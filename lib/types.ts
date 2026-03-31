// ---------------------------------------------------------------------------
// Core experiment types
// ---------------------------------------------------------------------------

export type ConditionKey = string;   // "A", "B", "C", … — no longer limited to two

export type TaskType = "recommendation" | "product_choice" | "willingness_to_pay";

// ---------------------------------------------------------------------------
// Cue Manipulation System — types
// ---------------------------------------------------------------------------

/** The built-in cue dimensions.  Extend this union to add new dimensions. */
export type CueDimensionKey = "agentName" | "tone" | "confidenceFraming";

/** A single level within a cue dimension (e.g. tone → "formal"). */
export interface CueLevel {
  key: string;          // machine key, e.g. "formal"
  label: string;        // human-readable, e.g. "Formal / neutral"
  value: string;        // the concrete content (text, URL, etc.)
}

/** A cue dimension: a named category with multiple selectable levels. */
export interface CueDimension {
  key: CueDimensionKey;
  label: string;        // "Agent Name", "Tone", …
  levels: Record<string, CueLevel>;
}

/** Which level is selected for each cue dimension in a condition. */
export type CueSelection = Record<CueDimensionKey, string>;

/** A condition entry in the registry — composable from cue levels. */
export interface ConditionEntry {
  id: ConditionKey;
  enabled: boolean;
  cues: CueSelection;
}

/** Resolved condition config — ready for the UI. */
export interface ConditionConfig {
  id: ConditionKey;
  enabled: boolean;
  cues: CueSelection;

  // Derived display properties (built by resolveCondition)
  agentName: string;
  tone: string;
  confidenceFraming: string;
  title: string;
  message: string;
  cueSummary: string;
  accuracyRate: number;

  // Extensible cue dimensions (reserved)
  visualIdentity: string;
  roleSource: string;
}

// ---------------------------------------------------------------------------
// Browser environment metadata
// ---------------------------------------------------------------------------

export interface BrowserMeta {
  userAgent: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
}

// ---------------------------------------------------------------------------
// Decision log entry — written to JSON & CSV
// ---------------------------------------------------------------------------

export interface DecisionLog {
  participant_id: string;
  condition: ConditionKey;
  task_type: TaskType;
  task_id: string;              // which scenario: "laptop", "apartment", etc.
  decision: string;
  timestamp: string;
  latency_ms: number;
  trust_rating: number;
  confidence_rating: number;
  browser_meta: BrowserMeta;
}
