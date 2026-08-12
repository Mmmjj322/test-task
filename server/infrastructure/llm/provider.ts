import type {
  EvaluationInput,
  LlmAssessmentResult,
  LlmStatus,
  RuleAssessment,
} from "@/server/domain/types";
import { llmOutputSchema } from "@/lib/validation/questionnaire";

const MAX_PROMPT_CHARS = 8000;
const LLM_TIMEOUT_MS = 15000;
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export interface LlmProvider {
  analyzeAssessment(
    input: EvaluationInput,
    ruleAssessment: RuleAssessment
  ): Promise<{ result: LlmAssessmentResult | null; status: LlmStatus; error?: string }>;
}

function buildPrompt(
  input: EvaluationInput,
  assessment: RuleAssessment
): string {
  const context = {
    system: {
      name: input.name,
      description: input.description,
      department: input.department,
      status: input.status,
      purpose: input.purpose,
      process: input.process,
    },
    assessment: {
      status: assessment.status,
      ruleVersion: assessment.ruleVersion,
      professionalReviewRequired: assessment.professionalReviewRequired,
    },
    findings: assessment.findings.map((f) => ({
      id: f.ruleId,
      category: f.category,
      priority: f.priority,
      title: f.title,
      explanation: f.explanation,
      recommendedAction: f.recommendedAction,
    })),
    actions: assessment.actions.map((a) => ({
      title: a.title,
      description: a.description,
      priority: a.priority,
      sourceRuleId: a.sourceRuleId,
    })),
    missingInformation: assessment.missingInformation,
    contradictions: assessment.contradictions,
  };

  const json = JSON.stringify(context).slice(0, MAX_PROMPT_CHARS);

  return `You are an AI governance assessment assistant for a German business audience.

The deterministic rule engine is authoritative. Your task is to EXPLAIN its findings in clear business German.

STRICT RULES:
- Do NOT override, contradict or remove deterministic findings
- Do NOT claim legal compliance or non-compliance
- Do NOT classify the system as definitely high-risk or not high-risk
- Do NOT invent facts not in the input
- Do NOT invent new rule IDs — only reference finding IDs from the input
- If information is missing or contradictory, state the uncertainty explicitly
- Use conservative language: "sollte geprüft werden", "weitere Prüfung erforderlich"
- Respond ONLY with valid JSON matching the required schema

Required JSON schema:
{
  "summary": "string (2-4 sentences in German)",
  "keyRisks": [{"findingId": "RULE-...", "explanation": "string"}],
  "openQuestions": ["string"],
  "nextSteps": [{"title": "string", "description": "string", "priority": "HIGH|MEDIUM|LOW"}],
  "limitations": ["string"]
}

Assessment context:
${json}`;
}

export class GeminiLlmProvider implements LlmProvider {
  async analyzeAssessment(
    input: EvaluationInput,
    ruleAssessment: RuleAssessment
  ): Promise<{ result: LlmAssessmentResult | null; status: LlmStatus; error?: string }> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[LLM] GEMINI_API_KEY missing. LLM evaluation skipped.");
      return { result: null, status: "SKIPPED", error: "GEMINI_API_KEY not configured" };
    }

    console.log("[LLM] Gemini provider enabled", {
      system: input.name,
      status: ruleAssessment.status,
      findings: ruleAssessment.findings.length,
      actions: ruleAssessment.actions.length,
    });

    try {
      const { GoogleGenerativeAI, SchemaType } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelName = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
      const model = genAI.getGenerativeModel({
  model: modelName,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        summary: {
          type: SchemaType.STRING,
        },
        keyRisks: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              findingId: {
                type: SchemaType.STRING,
              },
              explanation: {
                type: SchemaType.STRING,
              },
            },
            required: ["findingId", "explanation"],
          },
        },
        openQuestions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
          },
        },
        nextSteps: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: {
                type: SchemaType.STRING,
              },
              description: {
                type: SchemaType.STRING,
              },
              priority: {
                type: SchemaType.STRING,
                format: "enum",
                enum: ["HIGH", "MEDIUM", "LOW"],
              },
            },
            required: ["title", "description", "priority"],
          },
        },
        limitations: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
          },
        },
      },
      required: [
        "summary",
        "keyRisks",
        "openQuestions",
        "nextSteps",
        "limitations",
      ],
    },
    maxOutputTokens: 4096,
    temperature: 0.3,
  },
});

      const prompt = buildPrompt(input, ruleAssessment);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

      try {
        console.log("[LLM] Sending prompt to Gemini", {
          promptLength: prompt.length,
          findings: ruleAssessment.findings.length,
        });

        const response = await model.generateContent(prompt);
        clearTimeout(timeout);

        const text = response.response.text();
        if (!text) {
          console.error("[LLM] Empty response from Gemini");
          return { result: null, status: "FAILED", error: "Empty LLM response" };
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch {
          console.error("[LLM] Invalid JSON returned by Gemini", { text });
          return { result: null, status: "FAILED", error: "Invalid JSON from LLM" };
        }

        const validated = llmOutputSchema.safeParse(parsed);
        if (!validated.success) {
          console.error("[LLM] Schema validation failed", validated.error.flatten());
          return {
            result: null,
            status: "FAILED",
            error: "LLM output failed validation",
          };
        }

        console.log("[LLM] Success", {
          summaryLength: validated.data.summary.length,
          keyRisks: validated.data.keyRisks.length,
          openQuestions: validated.data.openQuestions.length,
        });

        return { result: validated.data, status: "SUCCESS" };
      } catch (err) {
        clearTimeout(timeout);
        const message = err instanceof Error ? err.message : "LLM request failed";
        console.error("[LLM] Request failure", { message });
        return { result: null, status: "FAILED", error: message };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "LLM initialization failed";
      console.error("[LLM] Initialization failure", { message });
      return { result: null, status: "FAILED", error: message };
    }
  }
}

export class MockLlmProvider implements LlmProvider {
  async analyzeAssessment(
    input: EvaluationInput,
    ruleAssessment: RuleAssessment
  ): Promise<{ result: LlmAssessmentResult | null; status: LlmStatus; error?: string }> {
    const findingCount = ruleAssessment.findings.length;
    return {
      result: {
        summary: `Das KI-System "${input.name}" wurde bewertet. Die regelbasierte Analyse hat ${findingCount} Hinweis(e) identifiziert. Gesamtstatus: ${ruleAssessment.status}. Diese Zusammenfassung erklärt die deterministischen Ergebnisse und ersetzt keine Rechtsberatung.`,
        keyRisks: ruleAssessment.findings.slice(0, 5).map((f) => ({
          findingId: f.ruleId,
          explanation: f.explanation,
        })),
        openQuestions: ruleAssessment.missingInformation.map(
          (m) => m.description
        ),
        nextSteps: ruleAssessment.actions.slice(0, 5).map((a) => ({
          title: a.title,
          description: a.description,
          priority: a.priority,
        })),
        limitations: [
          "Diese Erklärung basiert auf der regelbasierten Bewertung und stellt keine Rechtsberatung dar.",
          "Eine abschließende rechtliche Einordnung erfordert eine fachliche Prüfung.",
        ],
      },
      status: "SUCCESS",
    };
  }
}

export function getLlmProvider(): LlmProvider {
  if (process.env.GEMINI_API_KEY) {
    return new GeminiLlmProvider();
  }
  if (process.env.NODE_ENV === "test") {
    return new MockLlmProvider();
  }
  return new GeminiLlmProvider();
}
