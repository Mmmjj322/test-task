import {
  priorityToActionPriority,
  statusPrecedence,
} from "./helpers";
import type {
  EvaluationInput,
  OverallStatus,
  RecommendedAction,
  RuleAssessment,
  RuleFinding,
  RulePriority,
} from "../types";
import { RULE_VERSION } from "../types";

export { RULE_VERSION };

let actionCounter = 0;

function resetActionCounter() {
  actionCounter = 0;
}

function createAction(
  sourceRuleId: string,
  title: string,
  description: string,
  priority: RulePriority
): RecommendedAction {
  actionCounter += 1;
  return {
    actionId: `ACT-${actionCounter}`,
    title,
    description,
    priority: priorityToActionPriority(priority),
    sourceRuleId,
  };
}

function addFinding(
  findings: RuleFinding[],
  actions: RecommendedAction[],
  finding: RuleFinding
): void {
  const exists = findings.some((f) => f.ruleId === finding.ruleId);
  if (exists) return;
  findings.push(finding);
  actions.push(
    createAction(
      finding.ruleId,
      finding.title,
      finding.recommendedAction,
      finding.priority
    )
  );
}

function isUnknown(value: string | undefined | null): boolean {
  return value === "UNKNOWN" || value === undefined || value === null || value === "";
}

function isExternalProvider(input: EvaluationInput): boolean {
  const internalProviders = ["Internal", "INTERNAL", "Unknown", "UNKNOWN", ""];
  return (
    input.dataTransferredToExternal === "YES" ||
    (!internalProviders.includes(input.provider) &&
      input.usageType !== "INTERNAL")
  );
}

export function evaluateSystem(input: EvaluationInput): RuleAssessment {
  resetActionCounter();

  const findings: RuleFinding[] = [];
  const actions: RecommendedAction[] = [];
  const missingInformation: RuleAssessment["missingInformation"] = [];
  const contradictions: RuleAssessment["contradictions"] = [];

  detectMissingEssential(input, missingInformation);
  detectContradictions(input, contradictions);

  if (contradictions.length > 0) {
    addFinding(findings, actions, {
      ruleId: "RULE-INFO-002",
      category: "INFORMATION_QUALITY",
      priority: "P0",
      title: "Widersprüchliche Angaben",
      explanation:
        "Die Angaben sind widersprüchlich. Eine belastbare Bewertung ist derzeit nicht möglich.",
      recommendedAction:
        "Angaben überprüfen und vor der Bewertung klären.",
      evidence: contradictions.flatMap((c) => c.fields),
      forcesStatus: "PRÜFUNG_ERFORDERLICH",
    });
  }

  if (missingInformation.some((m) => m.importance === "REQUIRED")) {
    addFinding(findings, actions, {
      ruleId: "RULE-INFO-001",
      category: "INFORMATION_QUALITY",
      priority: "P0",
      title: "Wesentliche Informationen fehlen",
      explanation:
        "Wesentliche Informationen fehlen. Keine sichere Aussage möglich.",
      recommendedAction:
        "Die fehlenden Angaben ergänzen, bevor eine belastbare Bewertung vorgenommen wird.",
      evidence: missingInformation
        .filter((m) => m.importance === "REQUIRED")
        .map((m) => m.field),
      forcesStatus: "PRÜFUNG_ERFORDERLICH",
    });
  }

  evaluateTransparencyRules(input, findings, actions);
  evaluateRecruitmentRules(input, findings, actions);
  evaluateHumanOversightRules(input, findings, actions);
  evaluateDataRules(input, findings, actions);
  evaluateGovernanceRules(input, findings, actions);
  evaluateAiLiteracyRules(input, findings, actions);
  evaluateDecisionRules(input, findings, actions);

  const professionalReviewRequired = findings.some(
    (f) =>
      f.forcesStatus === "PRÜFUNG_ERFORDERLICH" ||
      f.category === "LEGAL_RELEVANCE" &&
        (f.priority === "P0" || f.priority === "P1")
  ) || contradictions.length > 0;

  const status = calculateOverallStatus(findings);

  return {
    status,
    findings,
    actions: dedupeActions(actions),
    missingInformation,
    contradictions,
    professionalReviewRequired,
    ruleVersion: RULE_VERSION,
  };
}

function dedupeActions(actions: RecommendedAction[]): RecommendedAction[] {
  const seen = new Set<string>();
  return actions.filter((a) => {
    const key = `${a.sourceRuleId}:${a.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function calculateOverallStatus(findings: RuleFinding[]): OverallStatus {
  let status: OverallStatus = "UNAUFFÄLLIG";

  for (const finding of findings) {
    if (finding.forcesStatus) {
      status = statusPrecedence(status, finding.forcesStatus);
      continue;
    }

    if (finding.category === "GOVERNANCE_BEST_PRACTICE") {
      status = statusPrecedence(status, "HANDLUNGSBEDARF");
    } else if (
      finding.category === "LEGAL_RELEVANCE" ||
      finding.category === "INFORMATION_QUALITY"
    ) {
      if (finding.priority === "P0" || finding.priority === "P1") {
        status = statusPrecedence(status, "PRÜFUNG_ERFORDERLICH");
      } else {
        status = statusPrecedence(status, "HANDLUNGSBEDARF");
      }
    }
  }

  return status;
}

function detectMissingEssential(
  input: EvaluationInput,
  missing: RuleAssessment["missingInformation"]
): void {
  if (isUnknown(input.decisionType)) {
    missing.push({
      field: "decisionType",
      description: "Art des Entscheidungseinflusses ist nicht angegeben.",
      importance: "REQUIRED",
    });
  }

  if (
    input.affectedPersons.length === 0 ||
    input.affectedPersons.includes("UNKNOWN")
  ) {
    missing.push({
      field: "affectedPersons",
      description: "Betroffene Personengruppen sind nicht eindeutig.",
      importance: "REQUIRED",
    });
  }

  if (
    input.dataCategories.length === 0 ||
    input.dataCategories.includes("UNKNOWN")
  ) {
    missing.push({
      field: "dataCategories",
      description: "Verarbeitete Datenkategorien sind nicht eindeutig.",
      importance: "IMPORTANT",
    });
  }
}

function detectContradictions(
  input: EvaluationInput,
  contradictions: RuleAssessment["contradictions"]
): void {
  const hasNone = input.affectedPersons.includes("NONE");
  const hasOthers = input.affectedPersons.some(
    (p) => p !== "NONE" && p !== "UNKNOWN"
  );
  if (hasNone && hasOthers) {
    contradictions.push({
      contradictionId: "CONTR-001",
      fields: ["affectedPersons"],
      description:
        "Es wurde sowohl 'keine externen Personen' als auch konkrete Personengruppen angegeben.",
    });
  }

  const noPersonal = input.dataCategories.includes("NO_PERSONAL_DATA");
  const hasPersonal = input.dataCategories.some((c) =>
    ["PERSONAL_DATA", "SPECIAL_CATEGORY_DATA"].includes(c)
  );
  if (noPersonal && hasPersonal) {
    contradictions.push({
      contradictionId: "CONTR-002",
      fields: ["dataCategories"],
      description:
        "Es wurde sowohl 'keine personenbezogenen Daten' als auch personenbezogene Daten angegeben.",
    });
  }

  if (
    input.decisionType === "FULLY_AUTOMATED" &&
    input.humanReview === "YES" &&
    input.approvalProcess === "YES"
  ) {
    contradictions.push({
      contradictionId: "CONTR-003",
      fields: ["decisionType", "humanReview", "approvalProcess"],
      description:
        "Vollautomatisierte Entscheidungen und gleichzeitig dokumentierte menschliche Prüfung/Freigabe sind widersprüchlich.",
    });
  }

  if (
    input.directHumanInteraction === "NO" &&
    input.aiUsageNotice === "NO"
  ) {
    // Not a contradiction per RULES.md — no action
  }

  if (
    input.decisionType !== "INFORMATION_ONLY" &&
    input.decisionType !== "UNKNOWN" &&
    input.humanReview === "NO" &&
    input.approvalProcess === "NO" &&
    input.outputControl === "NO" &&
    input.interventionAvailable === "NO"
  ) {
    // This is a finding, not contradiction — handled by RULE-HUMAN-002
  }

  if (
    input.humanReview === "NO" &&
    input.approvalProcess === "YES"
  ) {
    contradictions.push({
      contradictionId: "CONTR-004",
      fields: ["humanReview", "approvalProcess"],
      description:
        "Menschliche Prüfung ist verneint, aber ein Freigabeprozess ist dokumentiert.",
    });
  }
}

function evaluateTransparencyRules(
  input: EvaluationInput,
  findings: RuleFinding[],
  actions: RecommendedAction[]
): void {
  if (
    input.directHumanInteraction === "YES" &&
    (input.aiUsageNotice === "NO" || input.aiUsageNotice === "UNKNOWN")
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-TRANSPARENCY-001",
      category: "LEGAL_RELEVANCE",
      priority: "P1",
      title: "Transparenz bei direkter KI-Interaktion prüfen",
      explanation:
        "Externe Personen interagieren direkt mit dem KI-System und ein Hinweis auf die KI-Nutzung ist nicht dokumentiert oder unbekannt.",
      recommendedAction:
        "Prüfen, ob und wie Nutzer über die Interaktion mit dem KI-System informiert werden.",
      legalBasis: {
        source: "Regulation (EU) 2024/1689",
        article: "Article 50(1)",
        verifiedAt: "2026-08-11",
      },
      evidence: [
        `directHumanInteraction = ${input.directHumanInteraction}`,
        `aiUsageNotice = ${input.aiUsageNotice}`,
      ],
      forcesStatus: "PRÜFUNG_ERFORDERLICH",
    });
  }

  if (
    input.aiGeneratedContentPublished === "YES" &&
    input.aiType === "GENERATIVE"
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-TRANSPARENCY-002",
      category: "LEGAL_RELEVANCE",
      priority: "P2",
      title: "Transparenz bei KI-generierten Inhalten prüfen",
      explanation:
        "Das System erzeugt Inhalte, die veröffentlicht werden könnten. Transparenz- und Kennzeichnungspflichten sollten geprüft werden.",
      recommendedAction:
        "Art des erzeugten Inhalts, Veröffentlichungskontext und geltende Kennzeichnungspflichten prüfen.",
      legalBasis: {
        source: "Regulation (EU) 2024/1689",
        article: "Article 50",
        verifiedAt: "2026-08-11",
      },
      evidence: [
        `aiGeneratedContentPublished = ${input.aiGeneratedContentPublished}`,
        `aiType = ${input.aiType}`,
      ],
    });
  }

  if (
    input.aiGeneratedContentPublished === "YES" &&
    input.contentHumanReviewed !== "YES"
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-TRANSPARENCY-003",
      category: "LEGAL_RELEVANCE",
      priority: "P2",
      title: "Transparenz bei öffentlich veröffentlichten KI-Inhalten prüfen",
      explanation:
        "KI-generierte Inhalte werden veröffentlicht. Die einschlägige Transparenz- und Kennzeichnungspflicht sollte geprüft werden.",
      recommendedAction:
        "Prüfen, ob für den konkreten Inhalt und Veröffentlichungskontext eine Kennzeichnung erforderlich ist.",
      evidence: [
        `aiGeneratedContentPublished = ${input.aiGeneratedContentPublished}`,
        `contentHumanReviewed = ${input.contentHumanReviewed}`,
      ],
    });
  }

  if (
    input.affectedPersons.includes("CUSTOMERS") &&
    input.directHumanInteraction === "YES"
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-CHATBOT-001",
      category: "LEGAL_RELEVANCE",
      priority: "P2",
      title: "Kundenorientierte KI-Interaktion prüfen",
      explanation:
        "Bei direkter Interaktion mit Kunden sollte die Transparenz über den KI-Einsatz überprüft werden.",
      recommendedAction:
        "Transparenzhinweise und Kommunikation gegenüber Kunden prüfen.",
      evidence: [
        "affectedPersons includes CUSTOMERS",
        `directHumanInteraction = ${input.directHumanInteraction}`,
      ],
    });
  }
}

function evaluateRecruitmentRules(
  input: EvaluationInput,
  findings: RuleFinding[],
  actions: RecommendedAction[]
): void {
  const recruitment =
    input.recruitmentScenario ||
    input.affectedPersons.includes("APPLICANTS");

  if (
    recruitment &&
    (input.candidatePrioritisation ||
      input.candidateSelection ||
      input.decisionType === "PRIORITIZATION")
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-HIGHRISK-001",
      category: "LEGAL_RELEVANCE",
      priority: "P1",
      title: "Mögliche Hochrisiko-Einstufung prüfen",
      explanation:
        "Eine Prüfung der mögliche Einstufung als Hochrisiko-KI-System ist erforderlich. Dies bedeutet nicht, dass das System als hochriskant eingestuft wird.",
      recommendedAction:
        "Anwendungsfall, Zweck, Einfluss auf Entscheidungen und weitere Voraussetzungen für die Hochrisiko-Einstufung fachlich prüfen.",
      legalBasis: {
        source: "Regulation (EU) 2024/1689",
        article: "Article 6 / Annex III",
        verifiedAt: "2026-08-11",
      },
      evidence: [
        "recruitment scenario",
        `candidatePrioritisation = ${input.candidatePrioritisation}`,
        `decisionType = ${input.decisionType}`,
      ],
      forcesStatus: "PRÜFUNG_ERFORDERLICH",
    });
  }

  if (
    recruitment &&
    (isUnknown(input.qualityChecks) || isUnknown(input.biasChecks))
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-HIRING-001",
      category: "GOVERNANCE_BEST_PRACTICE",
      priority: "P2",
      title: "Qualitäts- und Bias-Kontrollen prüfen",
      explanation:
        "Qualitäts- und mögliche Bias-Kontrollen sind nicht dokumentiert.",
      recommendedAction:
        "Geeignete Qualitätskontrollen, Monitoring und Prüfprozesse definieren.",
      evidence: [
        `qualityChecks = ${input.qualityChecks}`,
        `biasChecks = ${input.biasChecks}`,
      ],
    });
  }
}

function evaluateHumanOversightRules(
  input: EvaluationInput,
  findings: RuleFinding[],
  actions: RecommendedAction[]
): void {
  const decisionRelevant =
    input.decisionType !== "INFORMATION_ONLY" &&
    input.decisionType !== "UNKNOWN";

  const affectsPeople =
    !input.affectedPersons.includes("NONE") &&
    !input.affectedPersons.every((p) => p === "UNKNOWN");

  if (decisionRelevant && affectsPeople) {
    addFinding(findings, actions, {
      ruleId: "RULE-HUMAN-001",
      category: "LEGAL_RELEVANCE",
      priority: "P2",
      title: "Einfluss auf Entscheidungen über Personen prüfen",
      explanation:
        "Der Einfluss des KI-Systems auf Entscheidungen über Personen sollte besonders geprüft werden.",
      recommendedAction:
        "Menschliche Kontrolle, Eingriffsmöglichkeiten, Verantwortlichkeiten und Eskalationswege dokumentieren.",
      evidence: [
        `decisionType = ${input.decisionType}`,
        `affectedPersons = ${input.affectedPersons.join(", ")}`,
      ],
    });
  }

  if (
    decisionRelevant &&
    input.humanReview === "NO" &&
    input.approvalProcess === "NO" &&
    input.outputControl === "NO" &&
    input.interventionAvailable === "NO"
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-HUMAN-002",
      category: "LEGAL_RELEVANCE",
      priority: "P1",
      title: "Menschliche Kontrolle nicht erkennbar",
      explanation:
        "Menschliche Kontrolle bei entscheidungsrelevanter KI-Nutzung ist nicht erkennbar.",
      recommendedAction:
        "Menschliche Prüfung, Eingriffsmöglichkeit und Eskalationsweg definieren und dokumentieren.",
      evidence: [
        `decisionType = ${input.decisionType}`,
        "humanOversight = none",
      ],
      forcesStatus: "PRÜFUNG_ERFORDERLICH",
    });
  }
}

function evaluateDataRules(
  input: EvaluationInput,
  findings: RuleFinding[],
  actions: RecommendedAction[]
): void {
  const personal =
    input.dataCategories.includes("PERSONAL_DATA") ||
    input.dataCategories.includes("SPECIAL_CATEGORY_DATA");

  if (input.dataCategories.includes("PERSONAL_DATA")) {
    addFinding(findings, actions, {
      ruleId: "RULE-DATA-001",
      category: "LEGAL_RELEVANCE",
      priority: "P2",
      title: "Datenschutzprüfung erforderlich",
      explanation:
        "Die Verarbeitung personenbezogener Daten erfordert eine separate Datenschutzprüfung.",
      recommendedAction:
        "Datenschutzgrundlage, Zweck, Datenminimierung, Zugriff, Speicherung und weitere relevante Datenschutzanforderungen prüfen.",
      evidence: ["dataCategories includes PERSONAL_DATA"],
    });
  }

  if (input.dataCategories.includes("SPECIAL_CATEGORY_DATA")) {
    addFinding(findings, actions, {
      ruleId: "RULE-DATA-002",
      category: "LEGAL_RELEVANCE",
      priority: "P1",
      title: "Besonders schützenswerte Daten",
      explanation:
        "Besonders schützenswerte Daten können verarbeitet werden. Eine vertiefte Datenschutzprüfung ist erforderlich.",
      recommendedAction:
        "Datenschutzrechtliche Grundlage, Zulässigkeit, Schutzmaßnahmen und Datenflüsse fachlich prüfen.",
      evidence: ["dataCategories includes SPECIAL_CATEGORY_DATA"],
      forcesStatus: "PRÜFUNG_ERFORDERLICH",
    });
  }

  const external =
    input.dataTransferredToExternal === "YES" || isExternalProvider(input);

  if (external && personal) {
    addFinding(findings, actions, {
      ruleId: "RULE-DATA-003",
      category: "GOVERNANCE_BEST_PRACTICE",
      priority: "P2",
      title: "Externer Anbieter und personenbezogene Daten",
      explanation:
        "Personenbezogene Daten könnten an einen externen KI-Anbieter übermittelt werden.",
      recommendedAction:
        "Anbieter, Datenverarbeitung, Vertragsgrundlagen, erlaubte Datennutzung, Speicherung, Sicherheitsmaßnahmen und relevante Datenflüsse prüfen.",
      evidence: [
        `dataTransferredToExternal = ${input.dataTransferredToExternal}`,
        "personalData = true",
      ],
    });
  }

  if (
    external &&
    input.dataCategories.includes("CONFIDENTIAL_BUSINESS_DATA")
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-DATA-004",
      category: "GOVERNANCE_BEST_PRACTICE",
      priority: "P2",
      title: "Vertrauliche Unternehmensdaten und externer Anbieter",
      explanation:
        "Vertrauliche Unternehmensdaten könnten an einen externen KI-Anbieter übermittelt werden.",
      recommendedAction:
        "Freigabeprozess, zulässige Datentypen, Anbieterbedingungen und technische Schutzmaßnahmen prüfen.",
      evidence: [
        "confidentialCompanyData = true",
        "externalProvider = true",
      ],
    });
  }
}

function evaluateGovernanceRules(
  input: EvaluationInput,
  findings: RuleFinding[],
  actions: RecommendedAction[]
): void {
  const external =
    input.dataTransferredToExternal === "YES" || isExternalProvider(input);

  if (external && isUnknown(input.providerApproval)) {
    addFinding(findings, actions, {
      ruleId: "RULE-GOV-001",
      category: "GOVERNANCE_BEST_PRACTICE",
      priority: "P2",
      title: "Anbieterfreigabe unklar",
      explanation:
        "Die Freigabe des externen KI-Anbieters ist nicht eindeutig dokumentiert.",
      recommendedAction:
        "Verantwortlichen Freigabeprozess und zulässige Nutzung des Anbieters klären.",
      evidence: [`providerApproval = ${input.providerApproval}`],
    });
  }

  if (!input.responsibleRole || input.responsibleRole.trim() === "") {
    addFinding(findings, actions, {
      ruleId: "RULE-GOV-002",
      category: "GOVERNANCE_BEST_PRACTICE",
      priority: "P3",
      title: "Verantwortlichkeit nicht festgelegt",
      explanation:
        "Eine fachliche Verantwortlichkeit ist nicht eindeutig festgelegt.",
      recommendedAction:
        "Eine verantwortliche Person oder Rolle benennen und dokumentieren.",
      evidence: ["responsibleRole = missing"],
    });
  }

  if (
    input.affectedPersons.includes("EMPLOYEES") &&
    isUnknown(input.usageRulesDefined)
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-GOV-003",
      category: "GOVERNANCE_BEST_PRACTICE",
      priority: "P2",
      title: "Interne Nutzungsregeln fehlen",
      explanation:
        "Klare interne Nutzungsregeln fehlen oder sind nicht dokumentiert.",
      recommendedAction:
        "Zulässige Nutzung, verbotene Eingaben, Umgang mit vertraulichen Daten und Verantwortlichkeiten definieren.",
      evidence: [`usageRulesDefined = ${input.usageRulesDefined}`],
    });
  }

  if (input.outputControl === "NO") {
    addFinding(findings, actions, {
      ruleId: "RULE-GOV-004",
      category: "GOVERNANCE_BEST_PRACTICE",
      priority: "P3",
      title: "Output-Kontrolle nicht dokumentiert",
      explanation:
        "Für relevante KI-Ausgaben ist keine dokumentierte Kontrolle erkennbar.",
      recommendedAction:
        "Prüf- und Freigabeprozess für relevante KI-Ausgaben definieren.",
      evidence: [`outputControl = ${input.outputControl}`],
    });
  }
}

function evaluateAiLiteracyRules(
  input: EvaluationInput,
  findings: RuleFinding[],
  actions: RecommendedAction[]
): void {
  const employeesInvolved = input.affectedPersons.includes("EMPLOYEES");

  if (
    employeesInvolved &&
    (isUnknown(input.trainingProvided) || isUnknown(input.usageRulesDefined))
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-AI-001",
      category: "LEGAL_RELEVANCE",
      priority: "P2",
      title: "AI-Kompetenz und Nutzungsregeln prüfen",
      explanation:
        "AI-Kompetenz und Nutzungsregeln sollten überprüft und gegebenenfalls verbessert werden.",
      recommendedAction:
        "Schulung, klare Nutzungsregeln und Verantwortlichkeiten prüfen.",
      legalBasis: {
        source: "Regulation (EU) 2024/1689",
        article: "Article 4",
        verifiedAt: "2026-08-11",
      },
      evidence: [
        `trainingProvided = ${input.trainingProvided}`,
        `usageRulesDefined = ${input.usageRulesDefined}`,
      ],
    });
  }
}

function evaluateDecisionRules(
  input: EvaluationInput,
  findings: RuleFinding[],
  actions: RecommendedAction[]
): void {
  if (
    input.decisionType === "FULLY_AUTOMATED" &&
    !input.affectedPersons.includes("NONE")
  ) {
    addFinding(findings, actions, {
      ruleId: "RULE-DECISION-001",
      category: "LEGAL_RELEVANCE",
      priority: "P1",
      title: "Weitgehend automatisierte Entscheidungen",
      explanation:
        "Das KI-System trifft oder beeinflusst Entscheidungen über Personen weitgehend automatisiert.",
      recommendedAction:
        "Anwendungsfall, menschliche Kontrolle, rechtliche Grundlage und mögliche Auswirkungen auf betroffene Personen fachlich prüfen.",
      evidence: [
        `decisionType = ${input.decisionType}`,
        `affectedPersons = ${input.affectedPersons.join(", ")}`,
      ],
      forcesStatus: "PRÜFUNG_ERFORDERLICH",
    });
  }
}