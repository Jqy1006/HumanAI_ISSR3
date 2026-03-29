import { NextRequest, NextResponse } from "next/server";
import { readCsvLogs, readJsonLogs } from "@/lib/fileStore";

export async function GET(request: NextRequest) {
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
