import { NextRequest, NextResponse } from "next/server";
import { getEvaluation } from "@/server/application/evaluations/service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const evaluation = await getEvaluation(id);
    if (!evaluation) {
      return NextResponse.json(
        { error: "Bewertung nicht gefunden" },
        { status: 404 }
      );
    }
    return NextResponse.json(evaluation);
  } catch {
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
