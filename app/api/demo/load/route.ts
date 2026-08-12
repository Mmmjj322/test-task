import { NextRequest, NextResponse } from "next/server";
import { getDemoCase } from "@/demo/cases";
import { createSystemAndEvaluate } from "@/server/application/evaluations/service";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Demo-Key erforderlich" }, { status: 400 });
    }
    const demo = getDemoCase(key);
    if (!demo) {
      return NextResponse.json({ error: "Demo-Fall nicht gefunden" }, { status: 404 });
    }
    const result = await createSystemAndEvaluate(demo.data);
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
