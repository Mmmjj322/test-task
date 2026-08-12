import { NextRequest, NextResponse } from "next/server";
import { getSystem, updateSystem } from "@/server/application/evaluations/service";
import { questionnaireSchema } from "@/lib/validation/questionnaire";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const system = await getSystem(id);
    if (!system) {
      return NextResponse.json({ error: "System nicht gefunden" }, { status: 404 });
    }
    return NextResponse.json(system);
  } catch {
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = questionnaireSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Eingabe", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const existing = await getSystem(id);
    if (!existing) {
      return NextResponse.json({ error: "System nicht gefunden" }, { status: 404 });
    }
    const system = await updateSystem(id, parsed.data);
    return NextResponse.json(system);
  } catch {
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
