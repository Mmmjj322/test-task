import { describe, it, expect } from "vitest";
import { evaluateSystem } from "@/server/domain/rules/engine";
import { DEMO_CASES } from "@/demo/cases";
import { toEvaluationInput } from "@/lib/utils/mappers";
import type { EvaluationInput } from "@/server/domain/types";

describe("RULE-TRANSPARENCY-001", () => {
  it("triggers when direct interaction and no disclosure", () => {
    const input: EvaluationInput = {
      ...baseInput(),
      directHumanInteraction: "YES",
      aiUsageNotice: "NO",
      affectedPersons: ["CUSTOMERS"],
    };
    const result = evaluateSystem(input);
    expect(result.findings.some((f) => f.ruleId === "RULE-TRANSPARENCY-001")).toBe(true);
  });

  it("does not trigger when no direct interaction", () => {
    const input: EvaluationInput = {
      ...baseInput(),
      directHumanInteraction: "NO",
      aiUsageNotice: "NO",
    };
    const result = evaluateSystem(input);
    expect(result.findings.some((f) => f.ruleId === "RULE-TRANSPARENCY-001")).toBe(false);
  });

  it("triggers when disclosure unknown", () => {
    const input: EvaluationInput = {
      ...baseInput(),
      directHumanInteraction: "YES",
      aiUsageNotice: "UNKNOWN",
    };
    const result = evaluateSystem(input);
    expect(result.findings.some((f) => f.ruleId === "RULE-TRANSPARENCY-001")).toBe(true);
  });

  it("does not trigger when disclosure present", () => {
    const input: EvaluationInput = {
      ...baseInput(),
      directHumanInteraction: "YES",
      aiUsageNotice: "YES",
    };
    const result = evaluateSystem(input);
    expect(result.findings.some((f) => f.ruleId === "RULE-TRANSPARENCY-001")).toBe(false);
  });
});

describe("Demo: Customer Service Chatbot", () => {
  it("produces transparency finding and PRÜFUNG_ERFORDERLICH", () => {
    const input = toEvaluationInput(DEMO_CASES["customer-service-chatbot"].data);
    const result = evaluateSystem(input);
    expect(result.status).toBe("PRÜFUNG_ERFORDERLICH");
    expect(result.findings.some((f) => f.ruleId === "RULE-TRANSPARENCY-001")).toBe(true);
    expect(result.findings.some((f) => f.ruleId === "RULE-GOV-004")).toBe(true);
  });
});

describe("Demo: CV Screening", () => {
  it("produces high-risk review, data protection, and hiring findings", () => {
    const input = toEvaluationInput(DEMO_CASES["cv-screening"].data);
    const result = evaluateSystem(input);
    expect(result.status).toBe("PRÜFUNG_ERFORDERLICH");
    expect(result.findings.some((f) => f.ruleId === "RULE-HIGHRISK-001")).toBe(true);
    expect(result.findings.some((f) => f.ruleId === "RULE-DATA-001")).toBe(true);
    expect(result.findings.some((f) => f.ruleId === "RULE-HIRING-001")).toBe(true);
    expect(result.findings.some((f) => f.ruleId === "RULE-HUMAN-001")).toBe(true);
    const highRisk = result.findings.find((f) => f.ruleId === "RULE-HIGHRISK-001");
    expect(highRisk?.explanation).toContain("mögliche Einstufung");
    expect(highRisk?.explanation).not.toContain("definitiv");
  });
});

describe("Demo: Sales Copilot", () => {
  it("produces governance and provider findings with HANDLUNGSBEDARF or PRÜFUNG", () => {
    const input = toEvaluationInput(DEMO_CASES["sales-copilot"].data);
    const result = evaluateSystem(input);
    expect(["HANDLUNGSBEDARF", "PRÜFUNG_ERFORDERLICH"]).toContain(result.status);
    expect(result.findings.some((f) => f.ruleId === "RULE-DATA-003")).toBe(true);
    expect(result.findings.some((f) => f.ruleId === "RULE-DATA-004")).toBe(true);
    expect(result.findings.some((f) => f.ruleId === "RULE-AI-001")).toBe(true);
    expect(result.findings.some((f) => f.ruleId === "RULE-GOV-001")).toBe(true);
    expect(result.findings.some((f) => f.ruleId === "RULE-GOV-002")).toBe(true);
    expect(result.findings.some((f) => f.ruleId === "RULE-GOV-003")).toBe(true);
  });
});

describe("Contradiction detection", () => {
  it("detects NONE with other affected persons", () => {
    const input: EvaluationInput = {
      ...baseInput(),
      affectedPersons: ["NONE", "CUSTOMERS"],
    };
    const result = evaluateSystem(input);
    expect(result.contradictions.length).toBeGreaterThan(0);
    expect(result.status).toBe("PRÜFUNG_ERFORDERLICH");
  });

  it("detects conflicting personal data categories", () => {
    const input: EvaluationInput = {
      ...baseInput(),
      dataCategories: ["NO_PERSONAL_DATA", "PERSONAL_DATA"],
    };
    const result = evaluateSystem(input);
    expect(result.contradictions.some((c) => c.contradictionId === "CONTR-002")).toBe(true);
  });
});

describe("Missing information", () => {
  it("flags unknown decision type as missing", () => {
    const input: EvaluationInput = {
      ...baseInput(),
      decisionType: "UNKNOWN",
    };
    const result = evaluateSystem(input);
    expect(result.missingInformation.some((m) => m.field === "decisionType")).toBe(true);
  });
});

function baseInput(): EvaluationInput {
  return {
    name: "Test System",
    description: "Test",
    department: "IT",
    status: "PILOT",
    purpose: "Testing",
    process: "Testing",
    aiType: "GENERATIVE",
    provider: "Internal",
    usageType: "INTERNAL",
    affectedPersons: ["EMPLOYEES"],
    decisionType: "INFORMATION_ONLY",
    dataCategories: ["NO_PERSONAL_DATA"],
    dataTransferredToExternal: "NO",
    humanReview: "YES",
    approvalProcess: "YES",
    outputControl: "YES",
    logging: "YES",
    interventionAvailable: "YES",
    escalationProcess: "YES",
    directHumanInteraction: "NO",
    aiUsageNotice: "NOT_APPLICABLE",
    aiGeneratedContentPublished: "NO",
    contentHumanReviewed: "NOT_APPLICABLE",
    responsibleRole: "Test Lead",
    trainingProvided: "YES",
    usageRulesDefined: "YES",
    recruitmentScenario: false,
    candidatePrioritisation: false,
    candidateSelection: false,
    qualityChecks: "YES",
    biasChecks: "YES",
    providerApproval: "YES",
  };
}
