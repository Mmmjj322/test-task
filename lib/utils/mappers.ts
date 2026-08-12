import type { EvaluationInput } from "@/server/domain/types";
import type { QuestionnaireInput } from "@/lib/validation/questionnaire";

export function toEvaluationInput(data: QuestionnaireInput): EvaluationInput {
  return {
    name: data.name,
    description: data.description,
    department: data.department,
    status: data.status,
    purpose: data.purpose,
    process: data.process,
    aiType: data.aiType,
    provider: data.provider,
    model: data.model,
    usageType: data.usageType,
    affectedPersons: data.affectedPersons,
    decisionType: data.decisionType,
    dataCategories: data.dataCategories,
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
    responsibleRole: data.responsibleRole,
    trainingProvided: data.trainingProvided,
    usageRulesDefined: data.usageRulesDefined,
    recruitmentScenario: data.recruitmentScenario,
    candidatePrioritisation: data.candidatePrioritisation,
    candidateSelection: data.candidateSelection,
    qualityChecks: data.qualityChecks,
    biasChecks: data.biasChecks,
    providerApproval: data.providerApproval,
  };
}

export function sanitizeForDisplay(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
