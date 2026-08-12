import { describe, it, expect } from "vitest";
import { questionnaireSchema } from "@/lib/validation/questionnaire";

describe("questionnaire validation", () => {
  const validBase = {
    name: "Test",
    description: "Desc",
    department: "IT",
    status: "PILOT" as const,
    purpose: "Purpose",
    process: "Process",
    aiType: "GENERATIVE" as const,
    provider: "OpenAI",
    usageType: "EXTERNAL" as const,
    affectedPersons: ["CUSTOMERS" as const],
    decisionType: "INFORMATION_ONLY" as const,
    dataCategories: ["PERSONAL_DATA" as const],
    dataTransferredToExternal: "YES" as const,
    humanReview: "NO" as const,
    approvalProcess: "NO" as const,
    outputControl: "NO" as const,
    logging: "YES" as const,
    interventionAvailable: "NO" as const,
    escalationProcess: "YES" as const,
    directHumanInteraction: "YES" as const,
    aiUsageNotice: "NO" as const,
    aiGeneratedContentPublished: "NO" as const,
    contentHumanReviewed: "NOT_APPLICABLE" as const,
    trainingProvided: "YES" as const,
    usageRulesDefined: "YES" as const,
    recruitmentScenario: false,
    candidatePrioritisation: false,
    candidateSelection: false,
    qualityChecks: "UNKNOWN" as const,
    biasChecks: "UNKNOWN" as const,
    providerApproval: "UNKNOWN" as const,
  };

  it("accepts valid input", () => {
    const result = questionnaireSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = questionnaireSchema.safeParse({ ...validBase, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid enum", () => {
    const result = questionnaireSchema.safeParse({
      ...validBase,
      status: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("rejects NONE with other affected persons", () => {
    const result = questionnaireSchema.safeParse({
      ...validBase,
      affectedPersons: ["NONE", "CUSTOMERS"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects conflicting data categories", () => {
    const result = questionnaireSchema.safeParse({
      ...validBase,
      dataCategories: ["NO_PERSONAL_DATA", "PERSONAL_DATA"],
    });
    expect(result.success).toBe(false);
  });
});
