// ---------------------------------------------------------------------------
// Condition Registry
//
// Each condition is composed from cue levels defined in cues.ts.
// Set  enabled: true/false  to include/exclude a condition from the study.
//
// To add a new condition:
//   1. Add an entry below with a unique id
//   2. Pick one level per cue dimension
//   3. Set enabled: true
//   That's it — the randomizer will pick it up automatically.
// ---------------------------------------------------------------------------

import { ConditionEntry, ConditionConfig } from "./types";
import { getCueLevel, buildMessage, buildCueSummary } from "./cues";

// ── Condition Registry ──────────────────────────────────────────────────

export const CONDITION_REGISTRY: ConditionEntry[] = [
  {
    id: "A",
    enabled: true,
    cues: {
      agentName: "neutral",
      tone: "formal",
      confidenceFraming: "calibrated"
    }
  },
  {
    id: "B",
    enabled: true,
    cues: {
      agentName: "humanlike",
      tone: "conversational",
      confidenceFraming: "overstated"
    }
  }

  // ── Future conditions (uncomment to enable) ─────────────────────────
  // {
  //   id: "C",
  //   enabled: false,
  //   cues: {
  //     agentName: "humanlike",
  //     tone: "formal",
  //     confidenceFraming: "calibrated"
  //   }
  // },
  // {
  //   id: "D",
  //   enabled: false,
  //   cues: {
  //     agentName: "neutral",
  //     tone: "conversational",
  //     confidenceFraming: "overstated"
  //   }
  // }
];

// ── Fixed experimental parameters ───────────────────────────────────────

const FIXED_ACCURACY_RATE = 0.75;
const DEFAULT_VISUAL_IDENTITY_MAP: Record<string, string> = {
  neutral: "icon-system",
  humanlike: "avatar-alex"
};
const DEFAULT_ROLE_SOURCE = "algorithm";

// ── Resolve a registry entry into a full ConditionConfig ────────────────

export function resolveCondition(entry: ConditionEntry): ConditionConfig {
  const agentName = getCueLevel("agentName", entry.cues.agentName).value;
  const toneLevel = entry.cues.tone;
  const framingLevel = entry.cues.confidenceFraming;

  return {
    id: entry.id,
    enabled: entry.enabled,
    cues: entry.cues,

    agentName,
    tone: toneLevel,
    confidenceFraming: framingLevel,
    title: `Recommendation from ${agentName}`,
    message: buildMessage(toneLevel, framingLevel),
    cueSummary: buildCueSummary(
      entry.cues.agentName,
      toneLevel,
      framingLevel
    ),
    accuracyRate: FIXED_ACCURACY_RATE,
    visualIdentity:
      DEFAULT_VISUAL_IDENTITY_MAP[entry.cues.agentName] ?? "icon-default",
    roleSource: DEFAULT_ROLE_SOURCE
  };
}

// ── Public API ──────────────────────────────────────────────────────────

/** All enabled conditions, resolved and ready for the UI. */
export function getEnabledConditions(): ConditionConfig[] {
  return CONDITION_REGISTRY
    .filter((e) => e.enabled)
    .map(resolveCondition);
}

/** Look up a single resolved condition by id. */
export function getConditionById(id: string): ConditionConfig | undefined {
  const entry = CONDITION_REGISTRY.find((e) => e.id === id);
  if (!entry) return undefined;
  return resolveCondition(entry);
}

/** Get the list of enabled condition IDs (used by randomization). */
export function getEnabledConditionIds(): string[] {
  return CONDITION_REGISTRY.filter((e) => e.enabled).map((e) => e.id);
}
