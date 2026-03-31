import { NextRequest, NextResponse } from "next/server";
import { updateDecisionRatings } from "@/lib/fileStore";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (
    !body.participant_id ||
    typeof body.trust_rating !== "number" ||
    typeof body.confidence_rating !== "number" ||
    body.trust_rating < 1 || body.trust_rating > 7 ||
    body.confidence_rating < 1 || body.confidence_rating > 7
  ) {
    return NextResponse.json(
      { error: "Invalid ratings payload." },
      { status: 400 }
    );
  }

  updateDecisionRatings(
    body.participant_id,
    body.trust_rating,
    body.confidence_rating
  );

  return NextResponse.json({ success: true });
}
