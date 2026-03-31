import { NextRequest, NextResponse } from "next/server";

const RESEARCHER_PASSWORD = process.env.RESEARCHER_PASSWORD || "humanai2026";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (password === RESEARCHER_PASSWORD) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
