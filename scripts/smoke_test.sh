#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# smoke_test.sh — Non-destructive end-to-end smoke test
#
# Walks through the full experiment flow via curl, verifying each API
# endpoint returns the expected data.  Does NOT delete existing logs.
#
# Requirements: bash, curl, jq (brew install jq)
# Usage:        bash scripts/smoke_test.sh
# ---------------------------------------------------------------------------

set -euo pipefail

PORT=3099                       # use a non-default port to avoid conflicts
BASE="http://localhost:$PORT"
PASS=0
FAIL=0
SERVER_PID=""

# ── Helpers ──────────────────────────────────────────────────────────────

green()  { printf "\033[32m%s\033[0m\n" "$1"; }
red()    { printf "\033[31m%s\033[0m\n" "$1"; }
bold()   { printf "\033[1m%s\033[0m\n" "$1"; }

assert_ok() {
  local label="$1" actual="$2" expected="$3"
  if [[ "$actual" == "$expected" ]]; then
    green "  ✓ $label"
    PASS=$((PASS + 1))
  else
    red "  ✗ $label  (expected: $expected, got: $actual)"
    FAIL=$((FAIL + 1))
  fi
}

assert_contains() {
  local label="$1" haystack="$2" needle="$3"
  if echo "$haystack" | grep -q "$needle"; then
    green "  ✓ $label"
    PASS=$((PASS + 1))
  else
    red "  ✗ $label  (expected to contain: $needle)"
    FAIL=$((FAIL + 1))
  fi
}

cleanup() {
  if [[ -n "$SERVER_PID" ]]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# ── 1. Start dev server ──────────────────────────────────────────────────

bold "━━━ Smoke Test ━━━"
echo ""
bold "1. Starting dev server on port $PORT..."

npx next dev --port "$PORT" > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to become ready (up to 15 seconds)
for i in $(seq 1 30); do
  if curl -sf "$BASE" > /dev/null 2>&1; then
    green "  ✓ Server ready"
    break
  fi
  if [[ $i -eq 30 ]]; then
    red "  ✗ Server failed to start within 15 seconds"
    exit 1
  fi
  sleep 0.5
done

# ── 2. GET /api/assign-condition ─────────────────────────────────────────

bold "2. GET /api/assign-condition"

ASSIGN_RESP=$(curl -sf "$BASE/api/assign-condition")
PID=$(echo "$ASSIGN_RESP" | jq -r '.participantId')
COND=$(echo "$ASSIGN_RESP" | jq -r '.condition')

assert_contains "participantId starts with P-" "$PID" "P-"
assert_contains "condition is A or B" "$COND" ""  # will check below
if [[ "$COND" == "A" || "$COND" == "B" ]]; then
  green "  ✓ condition = $COND"
  PASS=$((PASS + 1))
else
  red "  ✗ condition should be A or B, got: $COND"
  FAIL=$((FAIL + 1))
fi

# ── 3. GET /api/condition-config ─────────────────────────────────────────

bold "3. GET /api/condition-config?id=$COND"

CONFIG_RESP=$(curl -sf "$BASE/api/condition-config?id=$COND")
AGENT=$(echo "$CONFIG_RESP" | jq -r '.agentName')
assert_contains "agentName is non-empty" "$AGENT" ""
if [[ -n "$AGENT" && "$AGENT" != "null" ]]; then
  green "  ✓ agentName = $AGENT"
  PASS=$((PASS + 1))
else
  red "  ✗ agentName is empty or null"
  FAIL=$((FAIL + 1))
fi

# ── 4. GET /api/tasks ────────────────────────────────────────────────────

bold "4. GET /api/tasks"

TASKS_RESP=$(curl -sf "$BASE/api/tasks")
TASK_COUNT=$(echo "$TASKS_RESP" | jq 'length')
assert_ok "tasks returns 3 scenarios" "$TASK_COUNT" "3"

TASK_IDS=$(echo "$TASKS_RESP" | jq -r '.[].id')

# ── 5. POST /api/log-decision × 3 ──────────────────────────────────────

bold "5. POST /api/log-decision (×3 tasks)"

BROWSER_META='"browser_meta":{"userAgent":"SmokeTest/1.0","language":"en-US","screenWidth":1920,"screenHeight":1080,"windowWidth":1440,"windowHeight":900}'

for TASK_ID in $TASK_IDS; do
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
  BODY="{\"participant_id\":\"$PID\",\"condition\":\"$COND\",\"task_type\":\"recommendation\",\"task_id\":\"$TASK_ID\",\"decision\":\"accept\",\"timestamp\":\"$TIMESTAMP\",\"latency_ms\":1234,\"trust_rating\":0,\"confidence_rating\":0,$BROWSER_META}"

  HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" \
    -X POST "$BASE/api/log-decision" \
    -H "Content-Type: application/json" \
    -d "$BODY")

  assert_ok "log-decision ($TASK_ID) returns 200" "$HTTP_CODE" "200"
done

# ── 6. POST /api/log-ratings ────────────────────────────────────────────

bold "6. POST /api/log-ratings"

RATINGS_BODY=$(cat <<EOF
{
  "participant_id": "$PID",
  "trust_rating": 5,
  "confidence_rating": 6
}
EOF
)

HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" \
  -X POST "$BASE/api/log-ratings" \
  -H "Content-Type: application/json" \
  -d "$RATINGS_BODY")

assert_ok "log-ratings returns 200" "$HTTP_CODE" "200"

# ── 7. GET /api/export?format=json ──────────────────────────────────────

bold "7. GET /api/export?format=json"

JSON_EXPORT=$(curl -sf "$BASE/api/export?format=json")
assert_contains "JSON contains test participant" "$JSON_EXPORT" "$PID"

# ── 8. GET /api/export?format=csv ───────────────────────────────────────

bold "8. GET /api/export?format=csv"

CSV_EXPORT=$(curl -sf "$BASE/api/export?format=csv")
assert_contains "CSV has header" "$CSV_EXPORT" "participant_id,condition"
assert_contains "CSV contains test participant" "$CSV_EXPORT" "$PID"

# ── Summary ──────────────────────────────────────────────────────────────

echo ""
bold "━━━ Results ━━━"
green "  Passed: $PASS"
if [[ $FAIL -gt 0 ]]; then
  red "  Failed: $FAIL"
  echo ""
  red "SMOKE TEST FAILED"
  exit 1
else
  echo "  Failed: 0"
  echo ""
  green "ALL TESTS PASSED ✓"
fi
