import { prisma } from "@/server/infrastructure/database/prisma";
import { evaluateSystem } from "@/server/domain/rules/engine";
import { getLlmProvider } from "@/server/infrastructure/llm/provider";
import { toEvaluationInput } from "@/lib/utils/mappers";
import type { QuestionnaireInput } from "@/lib/validation/questionnaire";
import type { EvaluationInput, LlmStatus, RuleAssessment } from "@/server/domain/types";

function systemDataFromQuestionnaire(data: QuestionnaireInput) {
  return {
    name: data.name,
    description: data.description,
    department: data.department,
    status: data.status,
    purpose: data.purpose,
    process: data.process,
    aiType: data.aiType,
    provider: data.provider,
    model: data.model ?? null,
    usageType: data.usageType,
    affectedPersons: JSON.stringify(data.affectedPersons),
    decisionType: data.decisionType,
    dataCategories: JSON.stringify(data.dataCategories),
    dataTransferredToExternal: data.dataTransferredToExternal,
    humanReview: data.humanReview,
    approvalProcess: data.approvalProcess,
    outputControl: data.outputControl,
    logging: data.logging,
    interventionAvailable: data.interventionAvailable,
    escalationProcess: data.escalationProcess,
    directHumanInteraction: data.directHumanInteraction,
    aiUsageNotice: data.aiUsageNotice,
    aiGeneratedContentPublished: data.aiGeneratedContentPublished,
    contentHumanReviewed: data.contentHumanReviewed,
    responsibleRole: data.responsibleRole ?? null,
    trainingProvided: data.trainingProvided,
    usageRulesDefined: data.usageRulesDefined,
    recruitmentScenario: data.recruitmentScenario,
    candidatePrioritisation: data.candidatePrioritisation,
    candidateSelection: data.candidateSelection,
    qualityChecks: data.qualityChecks,
    biasChecks: data.biasChecks,
    providerApproval: data.providerApproval,
    isDemo: data.isDemo ?? false,
    demoKey: data.demoKey ?? null,
  };
}

export async function createSystem(data: QuestionnaireInput) {
  return prisma.aISystem.create({
    data: systemDataFromQuestionnaire(data),
  });
}

export async function updateSystem(id: string, data: QuestionnaireInput) {
  return prisma.aISystem.update({
    where: { id },
    data: systemDataFromQuestionnaire(data),
  });
}

export async function getSystem(id: string) {
  return prisma.aISystem.findUnique({
    where: { id },
    include: {
      evaluations: {
        orderBy: { evaluatedAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function listSystems() {
  return prisma.aISystem.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      evaluations: {
        orderBy: { evaluatedAt: "desc" },
        take: 1,
      },
    },
  });
}

export async function runEvaluation(
  systemId: string,
  questionnaireData?: QuestionnaireInput
) {
  const system = await prisma.aISystem.findUnique({ where: { id: systemId } });
  if (!system) return null;

  let input: EvaluationInput;
  let snapshot: QuestionnaireInput;

  if (questionnaireData) {
    snapshot = questionnaireData;
    input = toEvaluationInput(questionnaireData);
    await updateSystem(systemId, questionnaireData);
  } else {
    snapshot = systemToQuestionnaire(system);
    input = toEvaluationInput(snapshot);
  }

  const ruleAssessment: RuleAssessment = evaluateSystem(input);

  console.log("[EVALUATION] Rule assessment complete", {
    systemId,
    status: ruleAssessment.status,
    findings: ruleAssessment.findings.length,
    professionalReviewRequired: ruleAssessment.professionalReviewRequired,
  });

  const llmProvider = getLlmProvider();
  const llmResponse = await llmProvider.analyzeAssessment(input, ruleAssessment);

  console.log("[EVALUATION] LLM result", {
    systemId,
    llmStatus: llmResponse.status,
    hasResult: !!llmResponse.result,
    error: llmResponse.error ?? null,
  });

  const evaluation = await prisma.evaluation.create({
    data: {
      aiSystemId: systemId,
      ruleVersion: ruleAssessment.ruleVersion,
      inputSnapshot: JSON.stringify(snapshot),
      overallStatus: ruleAssessment.status,
      professionalReviewRequired: ruleAssessment.professionalReviewRequired
        ? "YES"
        : "NO",
      ruleAssessment: JSON.stringify(ruleAssessment),
      llmAssessment: llmResponse.result
        ? JSON.stringify(llmResponse.result)
        : null,
      llmStatus: llmResponse.status as LlmStatus,
    },
  });

  return {
    evaluation,
    ruleAssessment,
    llmResult: llmResponse.result,
    llmStatus: llmResponse.status as LlmStatus,
    llmError: llmResponse.error,
  };
}

export async function getEvaluation(id: string) {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id },
    include: { aiSystem: true },
  });
  if (!evaluation) return null;

  return {
    ...evaluation,
    ruleAssessment: JSON.parse(evaluation.ruleAssessment) as RuleAssessment,
    llmAssessment: evaluation.llmAssessment
      ? JSON.parse(evaluation.llmAssessment)
      : null,
    inputSnapshot: JSON.parse(evaluation.inputSnapshot),
  };
}

function systemToQuestionnaire(
  system: Awaited<ReturnType<typeof prisma.aISystem.findUnique>> & object
): QuestionnaireInput {
  return {
    name: system.name,
    description: system.description,
    department: system.department,
    status: system.status as QuestionnaireInput["status"],
    purpose: system.purpose,
    process: system.process,
    aiType: system.aiType as QuestionnaireInput["aiType"],
    provider: system.provider,
    model: system.model ?? undefined,
    usageType: system.usageType as QuestionnaireInput["usageType"],
    affectedPersons: JSON.parse(system.affectedPersons),
    decisionType: system.decisionType as QuestionnaireInput["decisionType"],
    dataCategories: JSON.parse(system.dataCategories),
    dataTransferredToExternal:
      system.dataTransferredToExternal as QuestionnaireInput["dataTransferredToExternal"],
    humanReview: system.humanReview as QuestionnaireInput["humanReview"],
    approvalProcess: system.approvalProcess as QuestionnaireInput["approvalProcess"],
    outputControl: system.outputControl as QuestionnaireInput["outputControl"],
    logging: system.logging as QuestionnaireInput["logging"],
    interventionAvailable:
      system.interventionAvailable as QuestionnaireInput["interventionAvailable"],
    escalationProcess:
      system.escalationProcess as QuestionnaireInput["escalationProcess"],
    directHumanInteraction:
      system.directHumanInteraction as QuestionnaireInput["directHumanInteraction"],
    aiUsageNotice: system.aiUsageNotice as QuestionnaireInput["aiUsageNotice"],
    aiGeneratedContentPublished:
      system.aiGeneratedContentPublished as QuestionnaireInput["aiGeneratedContentPublished"],
    contentHumanReviewed:
      system.contentHumanReviewed as QuestionnaireInput["contentHumanReviewed"],
    responsibleRole: system.responsibleRole ?? undefined,
    trainingProvided: system.trainingProvided as QuestionnaireInput["trainingProvided"],
    usageRulesDefined:
      system.usageRulesDefined as QuestionnaireInput["usageRulesDefined"],
    recruitmentScenario: system.recruitmentScenario,
    candidatePrioritisation: system.candidatePrioritisation,
    candidateSelection: system.candidateSelection,
    qualityChecks: system.qualityChecks as QuestionnaireInput["qualityChecks"],
    biasChecks: system.biasChecks as QuestionnaireInput["biasChecks"],
    providerApproval:
      system.providerApproval as QuestionnaireInput["providerApproval"],
    isDemo: system.isDemo,
    demoKey: system.demoKey ?? undefined,
  };
}

export async function createSystemAndEvaluate(data: QuestionnaireInput) {
  const system = await createSystem(data);
  const result = await runEvaluation(system.id, data);
  return { system, ...result! };
}
