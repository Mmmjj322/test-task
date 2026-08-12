import { NextRequest, NextResponse } from "next/server";
import { runEvaluation } from "@/server/application/evaluations/service";
import { questionnaireSchema } from "@/lib/validation/questionnaire";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    let questionnaireData = undefined;
    if (body && Object.keys(body).length > 0) {
      const parsed = questionnaireSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Ungültige Eingabe", details: parsed.error.flatten() },
          { status: 400 }
        );
      }
      questionnaireData = parsed.data;
    }

    const result = await runEvaluation(id, questionnaireData);
    if (!result) {
      return NextResponse.json({ error: "System nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(
      {
        evaluation: result.evaluation,
        ruleAssessment: result.ruleAssessment,
        llmResult: result.llmResult,
        llmStatus: result.llmStatus,
        llmError: result.llmError,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
