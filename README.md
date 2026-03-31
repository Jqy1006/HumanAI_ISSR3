# HumanAI GSoC 2026 Screening Test Project

## Project: Decision Making Test

This is a working prototype created for the GSoC 2026 Screening Test—a web-based behavioral experiment designed to measure how cue features of AI interfaces (such as agent name, tone, confidence framing) influence human trust and reliance.

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Python 3** + `pandas` + `matplotlib` (Only required for final analysis and chart generation)

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Open the experiment web page
open http://localhost:3000
```

### Run the Analysis Script

```bash
pip install pandas matplotlib   # Install dependencies before first run
python3 scripts/analyze_logs.py
```

Research-grade chart results will be automatically saved in the `logs/analysis_output/` folder.

### Run Automated Smoke Test

```bash
python3 scripts/smoke_test.py
```

This test is an end-to-end automated instrumentation test and is **non-destructive**—it will automatically verify the API behavior from participant assignment to dashboard data export and Python chart rendering.

### Reset Logs

If you want to clear historical test data, simply run the following in the terminal:
```bash
rm -f logs/decisions.json logs/decisions.csv logs/assignment_counter.json
```

---

## Condition Logic & Architecture

### Cue Manipulation System

The experiment adopts a **Modular Cue System**. The assigned "Condition" is randomly assembled from different, independent cue features:

| Cue Dimension | Option A (Condition A) | Option B (Condition B) |
|-----------------------|---------|---------|
| **Agent Name** | `Decision Support System` (Neutral label) | `Alex` (Humanlike name) |
| **Tone** | formal (Technical tone) | conversational (Social tone) |
| **Confidence Framing** | Calibrated probability ("System calculated...") | Overstated certainty ("I'm strictly confident...") |

> **🚀 Architectural Superiority**  
> Unlike solutions that hardcode Condition A and B statements separately for each question, this system uses an **orthogonal 3-dimensional Modular Cue System**. This means you can combine independent variables at any time (e.g., pairing "Neutral label" with "Overstated certainty"), which not only greatly saves redundancy in the data structure but also lays a perfect foundation for introducing more cue dimensions (such as visual UI, layout) in the future.

#### How the Cue System Works

```
lib/cues.ts          →  CUE_CATALOG: Defines all dimensions and their levels
lib/conditions.ts    →  CONDITION_REGISTRY: Automatically generates Conditions by selecting cue levels; easily toggle enabled/disabled via `enabled: true/false`
```

**How to add an experimental condition:** Add a configuration item in `CONDITION_REGISTRY` and mark it `enabled: true`. The core routing block-randomization algorithm will automatically include it in the randomization process.

### Condition A Design — Calibrated Framing
- Name: `Decision Support System`
- Tone: Formal / Neutral
- Confidence: Calibrated analysis ("Based on the available parameters…")

### Condition B Design — Overstated Framing
- Name: `Alex` (Gender-neutral human name)
- Tone: Conversational / Human-like
- Confidence: Overstated certainty ("I'm really confident…")

### N-Condition Block Randomization Algorithm

Block randomization ensures an absolutely balanced number of participants across assigned conditions. For 2 enabled conditions, the system guarantees that at any given time, the difference in the number of people between the two groups is \|N_A − N_B\| ≤ 1. Allocation records are stored in `logs/assignment_counter.json`.

---

## Experimental Flow & Design Considerations

```
Landing Page → Randomized Condition Assignment → Sequential Decision Tasks 1–5
→ Trust and Confidence 7-point Likert Scale → Results Display → Backend Structured JSON/CSV Dataset Generation
```

### Hidden Considerations in Experimental Design

1. **Why 5 tasks?**
   If there are too few tasks, stochasticity is high; if too many, participants experience fatigue and resort to "mindless clicking." Five scenarios can be completed within 5-7 minutes while covering a wider distribution of situations (including tricky tasks where AI gives plausible but fundamentally flawed recommendations to act as an "attention check / reverse reliance test").
2. **Avoiding Exposure of Testing Intent**
   The interface is titled "Decision Making Test," with no mention of "testing whether you trust humans or machines more." The AI acts as a "supplementary information provider," making participants feel they are making decisions for real tasks rather than acting as a "guinea pig." Over-exposing the test's purpose can lead to "demand characteristics" (participants intentionally complying with or defying the AI's judgment).

---

## Dynamic LLM Recommendation Decision Task

Participants will consecutively undergo **5 logical tasks** that are easy for an average person to understand but require supplementary knowledge. The AI (featuring chat bubbles, structured rationale analysis converted according to its Tone, and a name/icon) will provide its recommendation. The participant chooses whether to **Accept** or **Override**.

---

## Logging Implementation (Logging Schema)

| Field | Type | Description |
|-------|------|-------------|
| `participant_id` | string | Identifier, structure: `P-YYYYMMDDHHmmss-NNNN` |
| `condition` | string | Assigned condition (A, B...) |
| `task_type` | string | `"recommendation"` |
| `task_id` | string | Task identifier |
| `decision` | string | `"accept"` or `"override"` |
| `timestamp` | string | ISO 8601 millisecond timestamp of the action |
| `latency_ms` | number | **Implicit response latency** from page display to button click |
| `trust_rating` | number | 1–7 Likert trust score |
| `confidence_rating` | number | 1–7 user self-decision confidence score |
| `browser_meta` | object | Automatically retrieved anti-fingerprinting data (UA, screen size, etc.) |

> **🚀 Architectural Advantage: Instant Fallback Logging**  
> Unlike risky architectures that use "Batch Upload to database after all tests are finished" (where all data is lost if the user disconnects or closes the page midway), this project uses **Client-side State Caching + Server-side Instant File Writing**. Every user click is silently written to the backend JSON and CSV in milliseconds via a `POST` request, achieving **zero data loss** while keeping the UI absolutely unblocked and smooth.

---

## Sample Output File

Below is a generated sample of the `decisions.csv` output file:

```csv
participant_id,condition,task_type,task_id,decision,timestamp,latency_ms,trust_rating,confidence_rating,browser_userAgent,browser_language,browser_screenWidth,browser_screenHeight,browser_windowWidth,browser_windowHeight
P-20260331081625-0481,A,recommendation,air_purifier,override,2026-03-31T12:16:25Z,12431,0,0,"Mozilla/5.0 (SmokeTest)",en-US,1920,1080,1920,1080
P-20260331081625-0481,A,recommendation,cloud_storage,accept,2026-03-31T12:16:25Z,5312,0,0,"Mozilla/5.0 (SmokeTest)",en-US,1920,1080,1920,1080
...
```

And the equivalent `decisions.json`:

```json
[
  {
    "participant_id": "P-20260331081625-0481",
    "condition": "A",
    "task_type": "recommendation",
    "task_id": "air_purifier",
    "decision": "override",
    "timestamp": "2026-03-31T12:16:25Z",
    "latency_ms": 12431,
    "trust_rating": 6,
    "confidence_rating": 5,
    "browser_meta": {
      "userAgent": "Mozilla/5.0 (SmokeTest)",
      "language": "en-US",
      "screenWidth": 1920,
      "screenHeight": 1080,
      "windowWidth": 1920,
      "windowHeight": 1080
    }
  }
]
```

---

## 🌍 i18n & Cross-Cultural Considerations

Since this project aims to explore **human Trust Attribution towards machines**, it must be recognized that **people from different countries and cultural backgrounds have vastly different tendencies to trust "authority" and "human-like AI"**.
To meet potential global survey distribution needs and prevent experimental bias caused by language barriers, this project has injected the potential for international multi-language compatibility at the underlying level.

---

## Researcher Dashboard

Experimental data is completely invisible to participants.

### Access Method

Visit the `/logs` page in the browser (i.e., `http://localhost:3000/logs`), and enter the researcher password to enter.

**Default Password:** `humanai2026`

### Dashboard Features

- **Session Aggregate Statistics**: Total sessions, average AI acceptance rate, condition distribution.
- **Overtrust Detection**: Automatically tracks participants who "Overtrust" or exhibit "Critical Thinking" on trick tasks.
- **Row-by-Row Decision Logs**: Complete raw data table.
- **Data Download**: JSON / CSV format download buttons (visible only after authentication).

### API Data Export (Authentication Required)

Export APIs require the researcher password parameter `key`:

- **JSON**: `/api/export?format=json&key=humanai2026`
- **CSV**: `/api/export?format=csv&key=humanai2026`
