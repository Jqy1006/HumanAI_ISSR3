import { NextResponse } from "next/server";
import { generateParticipantId } from "@/lib/participant";
import { assignConditionBalanced } from "@/lib/randomization";
import { getConditionById } from "@/lib/conditions";

export async function GET() {
  const conditionId = assignConditionBalanced();
  const participantId = generateParticipantId();
  const config = getConditionById(conditionId);

  return NextResponse.json({
    participantId,
    condition: conditionId,
    accuracyRate: config?.accuracyRate ?? 0.75,
    confidenceFraming: config?.confidenceFraming ?? "calibrated"
  });
}
