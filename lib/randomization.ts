import fs from "fs";
import path from "path";
import { getEnabledConditionIds } from "./conditions";

// ---------------------------------------------------------------------------
// Block randomization – dynamically balanced across enabled conditions
// ---------------------------------------------------------------------------

const COUNTER_PATH = path.join(process.cwd(), "logs", "assignment_counter.json");

type AssignmentCounter = Record<string, number>;

function readCounter(): AssignmentCounter {
  const dir = path.dirname(COUNTER_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(COUNTER_PATH)) {
    const initial: AssignmentCounter = {};
    fs.writeFileSync(COUNTER_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }

  try {
    return JSON.parse(fs.readFileSync(COUNTER_PATH, "utf-8"));
  } catch (err) {
    // If the file is corrupted or empty (e.g. concurrent race condition),
    // fallback to initial so the app doesn't crash 500.
    return {};
  }
}

function writeCounter(counter: AssignmentCounter): void {
  fs.writeFileSync(COUNTER_PATH, JSON.stringify(counter, null, 2), "utf-8");
}

/**
 * Block randomization – generalized for N conditions.
 *
 * Block size = number of enabled conditions.  Within each block every
 * condition appears exactly once.  When a new block starts (all counts
 * equal), pick randomly among tied conditions.  Otherwise, pick the
 * condition with the fewest assignments.
 *
 * For 2 conditions this guarantees |N_A − N_B| ≤ 1.
 * For N conditions it guarantees |N_i − N_j| ≤ 1 for all i, j.
 */
export function assignConditionBalanced(): string {
  const enabledIds = getEnabledConditionIds();
  if (enabledIds.length === 0) {
    throw new Error("No conditions are enabled in the registry.");
  }

  const counter = readCounter();

  // Ensure every enabled condition has a counter entry
  for (const id of enabledIds) {
    if (counter[id] === undefined) counter[id] = 0;
  }

  // Find the minimum count among enabled conditions
  const minCount = Math.min(...enabledIds.map((id) => counter[id]));

  // All conditions tied at the minimum → start of a new block → pick randomly
  const candidates = enabledIds.filter((id) => counter[id] === minCount);
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  counter[chosen] += 1;
  writeCounter(counter);

  return chosen;
}
