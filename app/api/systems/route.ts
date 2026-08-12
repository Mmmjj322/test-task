import { NextRequest, NextResponse } from "next/server";
import {
  createSystemAndEvaluate,
  listSystems,
} from "@/server/application/evaluations/service";
import { questionnaireSchema } from "@/lib/validation/questionnaire";

export async function GET() {
  try {
    const systems = await listSystems();
    return NextResponse.json(systems);
  } catch {
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = questionnaireSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Eingabe", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const result = await createSystemAndEvaluate(parsed.data);
    return NextResponse.json(
      {
        system: result.system,
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
