import fs from "fs";
import path from "path";
import { DecisionLog } from "./types";

const LOG_DIR = path.join(process.cwd(), "logs");
const JSON_PATH = path.join(LOG_DIR, "decisions.json");
const CSV_PATH = path.join(LOG_DIR, "decisions.csv");

const CSV_HEADER = [
  "participant_id",
  "condition",
  "task_type",
  "task_id",
  "decision",
  "timestamp",
  "latency_ms",
  "trust_rating",
  "confidence_rating",
  "browser_userAgent",
  "browser_language",
  "browser_screenWidth",
  "browser_screenHeight",
  "browser_windowWidth",
  "browser_windowHeight"
].join(",") + "\n";

function ensureFilesExist(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  if (!fs.existsSync(JSON_PATH)) {
    fs.writeFileSync(JSON_PATH, "[]", "utf-8");
  }

  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, CSV_HEADER, "utf-8");
  }
}

function entryToCsvLine(entry: DecisionLog): string {
  return [
    entry.participant_id,
    entry.condition,
    entry.task_type,
    entry.task_id,
    entry.decision,
    entry.timestamp,
    entry.latency_ms,
    entry.trust_rating,
    entry.confidence_rating,
    `"${entry.browser_meta.userAgent}"`,
    entry.browser_meta.language,
    entry.browser_meta.screenWidth,
    entry.browser_meta.screenHeight,
    entry.browser_meta.windowWidth,
    entry.browser_meta.windowHeight
  ].join(",") + "\n";
}

export function appendDecisionLog(entry: DecisionLog): void {
  ensureFilesExist();

  const currentJson = fs.readFileSync(JSON_PATH, "utf-8");
  const parsed: DecisionLog[] = JSON.parse(currentJson);
  parsed.push(entry);
  fs.writeFileSync(JSON_PATH, JSON.stringify(parsed, null, 2), "utf-8");

  fs.appendFileSync(CSV_PATH, entryToCsvLine(entry), "utf-8");
}

/**
 * Update trust_rating and confidence_rating for ALL entries
 * belonging to a participant (covers all 3 tasks).
 */
export function updateDecisionRatings(
  participantId: string,
  trustRating: number,
  confidenceRating: number
): void {
  ensureFilesExist();

  const currentJson = fs.readFileSync(JSON_PATH, "utf-8");
  const parsed: DecisionLog[] = JSON.parse(currentJson);

  let updated = false;
  for (const entry of parsed) {
    if (entry.participant_id === participantId) {
      entry.trust_rating = trustRating;
      entry.confidence_rating = confidenceRating;
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(JSON_PATH, JSON.stringify(parsed, null, 2), "utf-8");

    // Rewrite CSV from JSON to keep in sync
    let csv = CSV_HEADER;
    for (const row of parsed) {
      csv += entryToCsvLine(row);
    }
    fs.writeFileSync(CSV_PATH, csv, "utf-8");
  }
}

export function readJsonLogs(): DecisionLog[] {
  ensureFilesExist();
  return JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
}

export function readCsvLogs(): string {
  ensureFilesExist();
  return fs.readFileSync(CSV_PATH, "utf-8");
}
