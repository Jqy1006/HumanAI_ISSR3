import fs from "fs";
import path from "path";
import { DecisionLog } from "./types";

const LOG_DIR = path.join(process.cwd(), "logs");
const JSON_PATH = path.join(LOG_DIR, "decisions.json");
const CSV_PATH = path.join(LOG_DIR, "decisions.csv");

function ensureFilesExist(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  if (!fs.existsSync(JSON_PATH)) {
    fs.writeFileSync(JSON_PATH, "[]", "utf-8");
  }

  if (!fs.existsSync(CSV_PATH)) {
    const header = "participant_id,condition,decision,timestamp,latency_ms\n";
    fs.writeFileSync(CSV_PATH, header, "utf-8");
  }
}

export function appendDecisionLog(entry: DecisionLog): void {
  ensureFilesExist();

  const currentJson = fs.readFileSync(JSON_PATH, "utf-8");
  const parsed: DecisionLog[] = JSON.parse(currentJson);
  parsed.push(entry);
  fs.writeFileSync(JSON_PATH, JSON.stringify(parsed, null, 2), "utf-8");

  const csvLine = [
    entry.participant_id,
    entry.condition,
    entry.decision,
    entry.timestamp,
    entry.latency_ms
  ].join(",") + "\n";

  fs.appendFileSync(CSV_PATH, csvLine, "utf-8");
}

export function readJsonLogs(): DecisionLog[] {
  ensureFilesExist();
  return JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
}

export function readCsvLogs(): string {
  ensureFilesExist();
  return fs.readFileSync(CSV_PATH, "utf-8");
}
