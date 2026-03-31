import { CueDimensionKey, CueLevel } from "./types";

export const CUE_CATALOG: Record<CueDimensionKey, Record<string, CueLevel>> = {
  agentName: {
    neutral: { key: "neutral", label: "Neutral / system-like", value: "Decision Support System" },
    humanlike: { key: "humanlike", label: "Humanlike name", value: "Alex" }
  },
  tone: {
    formal: { key: "formal", label: "Formal / neutral", value: "formal" },
    conversational: { key: "conversational", label: "Friendly / conversational", value: "conversational" }
  },
  confidenceFraming: {
    calibrated: { key: "calibrated", label: "Calibrated probability", value: "calibrated" },
    overstated: { key: "overstated", label: "Overstated / subjective certainty", value: "overstated" }
  }
};

export const PREAMBLE_TEMPLATES: Record<string, string> = {
  "formal_calibrated": "Based on the available data parameters, the system estimates a high probability that Option A is the superior choice. The analysis is as follows:",
  "formal_overstated": "The system is absolutely certain that Option A is the optimal choice. The definitive analysis is as follows:",
  "conversational_calibrated": "Looking at the numbers, there's a strong chance Option A is the better way to go here. Here's what I'm thinking:",
  "conversational_overstated": "I'm telling you, I am 100% confident Option A is the right answer! Just look at this:"
};

export function getCueLevel(dimension: CueDimensionKey, levelId: string): CueLevel {
  const level = CUE_CATALOG[dimension][levelId];
  if (!level) {
    throw new Error(`Unknown level ${levelId} for cue ${dimension}`);
  }
  return level;
}

export function buildMessage(tone: string, confidenceFraming: string): string {
  const key = `${tone}_${confidenceFraming}`;
  return PREAMBLE_TEMPLATES[key] || "System analysis complete. Recommendation parameters:";
}

export function buildCueSummary(agentName: string, tone: string, confidenceFraming: string): string {
  const n = CUE_CATALOG.agentName[agentName]?.label || agentName;
  const t = CUE_CATALOG.tone[tone]?.label || tone;
  const c = CUE_CATALOG.confidenceFraming[confidenceFraming]?.label || confidenceFraming;
  return `${n} · ${t} · ${c}`;
}
