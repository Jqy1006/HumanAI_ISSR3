import { NextRequest, NextResponse } from "next/server";
import { appendDecisionLog } from "@/lib/fileStore";
import { DecisionLog } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as DecisionLog;

  if (
    !body.participant_id ||
    !body.condition ||
    !body.decision ||
    !body.timestamp ||
    typeof body.latency_ms !== "number"
  ) {
    return NextResponse.json(
      { error: "Invalid payload." },
      { status: 400 }
    );
  }

  appendDecisionLog(body);

  return NextResponse.json({
    success: true
  });
}
