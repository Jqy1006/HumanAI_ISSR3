import { NextRequest, NextResponse } from "next/server";
import { readCsvLogs, readJsonLogs } from "@/lib/fileStore";

const RESEARCHER_PASSWORD = process.env.RESEARCHER_PASSWORD || "humanai2026";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (key !== RESEARCHER_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = request.nextUrl.searchParams.get("format");

  if (format === "csv") {
    const csv = readCsvLogs();
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=decisions.csv"
      }
    });
  }

  const json = readJsonLogs();
  return NextResponse.json(json, {
    headers: {
      "Content-Disposition": "attachment; filename=decisions.json"
    }
  });
}
