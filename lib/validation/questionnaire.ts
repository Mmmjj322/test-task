import { z } from "zod";

export const triStateSchema = z.enum(["YES", "NO", "UNKNOWN"]);
export const triStateNASchema = z.enum(["YES", "NO", "UNKNOWN", "NOT_APPLICABLE"]);

export const systemStatusSchema = z.enum(["IDEA", "PILOT", "PRODUCTION"]);
export const aiTypeSchema = z.enum([
  "GENERATIVE",
  "PREDICTIVE",
  "CLASSIFICATION",
  "RECOMMENDATION",
  "CONVERSATIONAL",
  "OTHER",
  "UNKNOWN",
]);
export const usageTypeSchema = z.enum(["INTERNAL", "EXTERNAL", "BOTH", "UNKNOWN"]);
export const affectedPersonSchema = z.enum([
  "EMPLOYEES",
  "CUSTOMERS",
  "APPLICANTS",
  "PUBLIC",
  "NONE",
  "UNKNOWN",
]);
export const decisionTypeSchema = z.enum([
  "INFORMATION_ONLY",
  "DECISION_SUPPORT",
  "PRIORITIZATION",
  "PARTIALLY_AUTOMATED",
  "FULLY_AUTOMATED",
  "UNKNOWN",
]);
export const dataCategorySchema = z.enum([
  "NO_PERSONAL_DATA",
  "PERSONAL_DATA",
  "SPECIAL_CATEGORY_DATA",
  "CONFIDENTIAL_BUSINESS_DATA",
  "UNKNOWN",
]);
export const externalTransferSchema = z.enum(["YES", "NO", "UNKNOWN"]);

export const questionnaireSchema = z
  .object({
    name: z.string().min(1, "Name ist erforderlich").max(200),
    description: z.string().min(1, "Beschreibung ist erforderlich").max(2000),
    department: z.string().min(1, "Fachbereich ist erforderlich").max(200),
    status: systemStatusSchema,
    purpose: z.string().min(1).max(2000),
    process: z.string().min(1).max(2000),
    aiType: aiTypeSchema,
    provider: z.string().min(1).max(200),
    model: z.string().max(200).optional(),
    usageType: usageTypeSchema,
    affectedPersons: z
      .array(affectedPersonSchema)
      .min(1, "Mindestens eine Personengruppe auswählen"),
    decisionType: decisionTypeSchema,
    dataCategories: z
      .array(dataCategorySchema)
      .min(1, "Mindestens eine Datenkategorie auswählen"),
    dataTransferredToExternal: externalTransferSchema,
    humanReview: triStateSchema,
    approvalProcess: triStateSchema,
    outputControl: triStateSchema,
    logging: triStateSchema,
    interventionAvailable: triStateSchema,
    escalationProcess: triStateSchema,
    directHumanInteraction: triStateSchema,
    aiUsageNotice: triStateNASchema,
    aiGeneratedContentPublished: triStateSchema,
    contentHumanReviewed: triStateNASchema,
    responsibleRole: z.string().max(200).optional(),
    trainingProvided: triStateSchema,
    usageRulesDefined: triStateSchema,
    recruitmentScenario: z.boolean().default(false),
    candidatePrioritisation: z.boolean().default(false),
    candidateSelection: z.boolean().default(false),
    qualityChecks: triStateSchema.default("UNKNOWN"),
    biasChecks: triStateSchema.default("UNKNOWN"),
    providerApproval: triStateSchema.default("UNKNOWN"),
    isDemo: z.boolean().optional(),
    demoKey: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasNone = data.affectedPersons.includes("NONE");
    const hasOthers = data.affectedPersons.some(
      (p) => p !== "NONE" && p !== "UNKNOWN"
    );
    if (hasNone && hasOthers) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "NONE darf nicht zusammen mit anderen Personengruppen gewählt werden.",
        path: ["affectedPersons"],
      });
    }

    const noPersonal = data.dataCategories.includes("NO_PERSONAL_DATA");
    const hasPersonal = data.dataCategories.some((c) =>
      ["PERSONAL_DATA", "SPECIAL_CATEGORY_DATA"].includes(c)
    );
    if (noPersonal && hasPersonal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "NO_PERSONAL_DATA darf nicht zusammen mit personenbezogenen Daten gewählt werden.",
        path: ["dataCategories"],
      });
    }
  });

export type QuestionnaireInput = z.infer<typeof questionnaireSchema>;

export const llmOutputSchema = z.object({
  summary: z.string().max(3000),
  keyRisks: z
    .array(
      z.object({
        findingId: z.string(),
        explanation: z.string().max(1000),
      })
    )
    .max(20),
  openQuestions: z.array(z.string().max(500)).max(15),
  nextSteps: z
    .array(
      z.object({
        title: z.string().max(300),
        description: z.string().max(1000),
        priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
      })
    )
    .max(15),
  limitations: z.array(z.string().max(500)).max(10),
});

export type LlmOutputValidated = z.infer<typeof llmOutputSchema>;
