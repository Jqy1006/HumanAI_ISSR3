import { NextRequest, NextResponse } from "next/server";
import { getConditionById } from "@/lib/conditions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const config = getConditionById(id);
  if (!config) {
    return NextResponse.json({ error: "Condition not found" }, { status: 404 });
  }

  return NextResponse.json({
    agentName: config.agentName,
    tone: config.tone,
    title: config.title,
    message: config.message,
    cueSummary: config.cueSummary,
    accuracyRate: config.accuracyRate
  });
}
