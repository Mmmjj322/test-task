export const RULE_VERSION = "1.0.0";

export type TriState = "YES" | "NO" | "UNKNOWN";
export type TriStateNA = TriState | "NOT_APPLICABLE";

export type SystemStatus = "IDEA" | "PILOT" | "PRODUCTION";

export type AiType =
  | "GENERATIVE"
  | "PREDICTIVE"
  | "CLASSIFICATION"
  | "RECOMMENDATION"
  | "CONVERSATIONAL"
  | "OTHER"
  | "UNKNOWN";

export type UsageType = "INTERNAL" | "EXTERNAL" | "BOTH" | "UNKNOWN";

export type AffectedPerson =
  | "EMPLOYEES"
  | "CUSTOMERS"
  | "APPLICANTS"
  | "PUBLIC"
  | "NONE"
  | "UNKNOWN";

export type DecisionType =
  | "INFORMATION_ONLY"
  | "DECISION_SUPPORT"
  | "PRIORITIZATION"
  | "PARTIALLY_AUTOMATED"
  | "FULLY_AUTOMATED"
  | "UNKNOWN";

export type DataCategory =
  | "NO_PERSONAL_DATA"
  | "PERSONAL_DATA"
  | "SPECIAL_CATEGORY_DATA"
  | "CONFIDENTIAL_BUSINESS_DATA"
  | "UNKNOWN";

export type ExternalTransfer = "YES" | "NO" | "UNKNOWN";

export type OverallStatus =
  | "UNAUFFÄLLIG"
  | "HANDLUNGSBEDARF"
  | "PRÜFUNG_ERFORDERLICH";

export type RuleCategory =
  | "LEGAL_REQUIREMENT"
  | "LEGAL_RELEVANCE"
  | "GOVERNANCE_BEST_PRACTICE"
  | "INFORMATION_QUALITY"
  | "SECURITY_CONTROL";

export type RulePriority = "P0" | "P1" | "P2" | "P3" | "P4";

export type ActionPriority = "HIGH" | "MEDIUM" | "LOW";

export interface LegalBasis {
  source: string;
  article: string;
  verifiedAt?: string;
}

export interface RuleFinding {
  ruleId: string;
  category: RuleCategory;
  priority: RulePriority;
  title: string;
  explanation: string;
  recommendedAction: string;
  legalBasis?: LegalBasis;
  evidence: string[];
  forcesStatus?: OverallStatus;
}

export interface RecommendedAction {
  actionId: string;
  title: string;
  description: string;
  priority: ActionPriority;
  sourceRuleId: string;
}

export interface MissingInformation {
  field: string;
  description: string;
  importance: "REQUIRED" | "IMPORTANT" | "OPTIONAL";
}

export interface Contradiction {
  contradictionId: string;
  fields: string[];
  description: string;
}

export interface RuleAssessment {
  status: OverallStatus;
  findings: RuleFinding[];
  actions: RecommendedAction[];
  missingInformation: MissingInformation[];
  contradictions: Contradiction[];
  professionalReviewRequired: boolean;
  ruleVersion: string;
}

export interface EvaluationInput {
  name: string;
  description: string;
  department: string;
  status: SystemStatus;
  purpose: string;
  process: string;
  aiType: AiType;
  provider: string;
  model?: string;
  usageType: UsageType;
  affectedPersons: AffectedPerson[];
  decisionType: DecisionType;
  dataCategories: DataCategory[];
  dataTransferredToExternal: ExternalTransfer;
  humanReview: TriState;
  approvalProcess: TriState;
  outputControl: TriState;
  logging: TriState;
  interventionAvailable: TriState;
  escalationProcess: TriState;
  directHumanInteraction: TriState;
  aiUsageNotice: TriStateNA;
  aiGeneratedContentPublished: TriState;
  contentHumanReviewed: TriStateNA;
  responsibleRole?: string;
  trainingProvided: TriState;
  usageRulesDefined: TriState;
  recruitmentScenario: boolean;
  candidatePrioritisation: boolean;
  candidateSelection: boolean;
  qualityChecks: TriState;
  biasChecks: TriState;
  providerApproval: TriState;
}

export interface LlmAssessmentResult {
  summary: string;
  keyRisks: Array<{ findingId: string; explanation: string }>;
  openQuestions: string[];
  nextSteps: Array<{
    title: string;
    description: string;
    priority: ActionPriority;
  }>;
  limitations: string[];
}

export type LlmStatus = "SUCCESS" | "FAILED" | "SKIPPED";

export const STATUS_LABELS: Record<OverallStatus, string> = {
  UNAUFFÄLLIG: "Unauffällig",
  HANDLUNGSBEDARF: "Handlungsbedarf",
  PRÜFUNG_ERFORDERLICH: "Prüfung erforderlich",
};

export function isUnknown(value: TriState | TriStateNA | string | undefined | null): boolean {
  return value === "UNKNOWN" || value === undefined || value === null || value === "";
}

export function isMissing(value: TriState | TriStateNA | string | undefined | null): boolean {
  return isUnknown(value);
}

export function hasPersonalData(categories: DataCategory[]): boolean {
  return categories.includes("PERSONAL_DATA") || categories.includes("SPECIAL_CATEGORY_DATA");
}

export function hasSpecialCategoryData(categories: DataCategory[]): boolean {
  return categories.includes("SPECIAL_CATEGORY_DATA");
}

export function hasConfidentialData(categories: DataCategory[]): boolean {
  return categories.includes("CONFIDENTIAL_BUSINESS_DATA");
}

export function isExternalProvider(input: EvaluationInput): boolean {
  return (
    input.dataTransferredToExternal === "YES" ||
    (input.provider !== "Internal" &&
      input.provider !== "INTERNAL" &&
      input.provider !== "Unknown" &&
      input.provider !== "UNKNOWN" &&
      input.usageType !== "INTERNAL")
  );
}

export function affectsExternalPersons(persons: AffectedPerson[]): boolean {
  return persons.some((p) =>
    ["CUSTOMERS", "APPLICANTS", "PUBLIC"].includes(p)
  );
}

export function employeesUseAi(persons: AffectedPerson[]): boolean {
  return persons.includes("EMPLOYEES");
}

export function isRecruitment(input: EvaluationInput): boolean {
  return (
    input.recruitmentScenario ||
    input.candidatePrioritisation ||
    input.candidateSelection ||
    input.affectedPersons.includes("APPLICANTS")
  );
}

export function humanOversightLevel(input: EvaluationInput): "none" | "partial" | "present" {
  const controls = [
    input.humanReview,
    input.approvalProcess,
    input.outputControl,
    input.interventionAvailable,
    input.escalationProcess,
  ];
  if (controls.every((c) => c === "NO")) return "none";
  if (controls.some((c) => c === "YES")) return "present";
  if (controls.every((c) => isUnknown(c))) return "none";
  return "partial";
}
