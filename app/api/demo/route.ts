import { NextResponse } from "next/server";
import { listDemoCases } from "@/demo/cases";

export async function GET() {
  return NextResponse.json(listDemoCases());
}
