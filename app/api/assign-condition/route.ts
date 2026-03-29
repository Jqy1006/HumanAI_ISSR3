import { NextResponse } from "next/server";
import { generateParticipantId } from "@/lib/participant";

export async function GET() {
  const condition = Math.random() < 0.5 ? "A" : "B";
  const participantId = generateParticipantId();

  return NextResponse.json({
    participantId,
    condition
  });
}
