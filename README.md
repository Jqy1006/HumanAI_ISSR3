# HumanAI GSoC 2026 Screening Test
## Project: Humanlike AI Systems and Trust Attribution

This repository contains a minimal working prototype for the GSoC 2026 screening test for the HumanAI project **“Humanlike AI Systems and Trust Attribution.”**

## Overview
The prototype implements a lightweight web-based behavioral experiment. A participant is randomly assigned to one of two interface conditions, receives an AI recommendation, and chooses whether to accept or override it. The app logs the participant’s behavior in structured JSON and CSV formats.

## Experimental Logic

### Condition A
- Agent name: `Decision Support System`
- Tone: formal / neutral
- Confidence framing: calibrated

### Condition B
- Agent name: `Maya`
- Tone: conversational / humanlike
- Confidence framing: stronger / warmer

The goal is to manipulate interface cues that may influence trust and reliance behavior.

## Decision Task
Participants complete one recommendation-acceptance task:
- The AI recommends **Option A**
- The participant chooses to:
  - **Accept Recommendation**
  - **Override Recommendation**

This produces a simple behavioral trust outcome.

## Logging Schema
Each decision is logged with the following fields:

- `participant_id`
- `condition`
- `decision`
- `timestamp`
- `latency_ms`

Logs are written to:
- `logs/decisions.json`
- `logs/decisions.csv`

## How to Run Locally

```bash
npm install
npm run dev
```

Then open:

http://localhost:3000

## Dataset Export

Logs can be downloaded from:
- `/api/export?format=json`
- `/api/export?format=csv`

## Sample Output

### JSON

```json
{
  "participant_id": "P-20260328194500-4821",
  "condition": "A",
  "decision": "accept",
  "timestamp": "2026-03-28T19:45:03.201Z",
  "latency_ms": 3218
}
```

### CSV

```csv
participant_id,condition,decision,timestamp,latency_ms
P-20260328194500-4821,A,accept,2026-03-28T19:45:03.201Z,3218
```

## Design Rationale

I kept the prototype intentionally lightweight so the core experimental logic is easy to inspect and extend:
1. randomized condition assignment
2. cue manipulation through interface wording
3. one behavioral trust decision
4. structured logging for later analysis

The architecture can be extended later to support additional cue dimensions. A basic Python analysis snippet is included in `scripts/analyze_logs.py` to summarize reliance rate, override rate, and mean response latency by condition.
