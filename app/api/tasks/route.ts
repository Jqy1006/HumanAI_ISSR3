import { NextResponse } from "next/server";
import { TASK_SCENARIOS } from "@/lib/tasks";

export async function GET() {
  return NextResponse.json(TASK_SCENARIOS);
}
