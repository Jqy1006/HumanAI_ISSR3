#!/usr/bin/env python3
"""
smoke_test.py — Automated End-to-End Smoke Test for the HumanAI ISSR3 Screening Prototype

This script automatically simulates:
1. A participant being assigned a condition (A or B).
2. The participant receiving tasks and submitting decisions (Accept/Override).
3. The participant submitting post-task ratings.
4. The researcher downloading the dataset via the export API.
5. The Python analysis script analyzing the exported dataset.

Usage:
    python3 scripts/smoke_test.py
"""

import urllib.request
import urllib.error
import json
import time
import subprocess
import os
import sys
import random

BASE_URL = "http://localhost:3000"

def log_step(msg):
    print(f"[\033[96mSmokeTest\033[0m] {msg}")

def ensure_server_running():
    try:
        urllib.request.urlopen(f"{BASE_URL}/api/tasks", timeout=3)
    except urllib.error.URLError:
        print("\033[91m[Error]\033[0m The Next.js server is not running on localhost:3000.")
        print("Please run 'npm run dev' or 'npm start' before running the smoke test.")
        sys.exit(1)

def simulate_participant(participant_index):
    # 1. Assign Condition
    req = urllib.request.Request(f"{BASE_URL}/api/assign-condition")
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        pid = data["participantId"]
        cond = data["condition"]
        log_step(f"({participant_index}) Assigned ID: {pid}, Condition: {cond}")

    # 2. Fetch Tasks
    req = urllib.request.Request(f"{BASE_URL}/api/tasks")
    with urllib.request.urlopen(req) as response:
        tasks = json.loads(response.read().decode())
        log_step(f"({participant_index}) Fetched {len(tasks)} tasks.")

    # 3. Simulate decisions for each task
    for i, task in enumerate(tasks):
        decision = random.choice(["accept", "accept", "override"]) # Weighted towards accept
        latency = random.randint(2000, 15000)
        
        payload = {
            "participant_id": pid,
            "condition": cond,
            "task_type": "recommendation",
            "task_id": task["id"],
            "decision": decision,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "latency_ms": latency,
            "trust_rating": 0,
            "confidence_rating": 0,
            "browser_meta": {
                "userAgent": "Mozilla/5.0 (SmokeTest) Automated Agent",
                "language": "en-US",
                "screenWidth": 1920,
                "screenHeight": 1080,
                "windowWidth": 1920,
                "windowHeight": 1080
            }
        }

        req = urllib.request.Request(
            f"{BASE_URL}/api/log-decision",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(req)
        
    log_step(f"({participant_index}) Logged {len(tasks)} decisions.")

    # 4. Simulate Ratings
    payload = {
        "participant_id": pid,
        "trust_rating": random.randint(3, 7),
        "confidence_rating": random.randint(3, 7)
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/log-ratings",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    urllib.request.urlopen(req)
    log_step(f"({participant_index}) Logged post-task ratings.")


def check_researcher_dashboard_export():
    req = urllib.request.Request(f"{BASE_URL}/api/export?key=humanai2026&format=csv")
    try:
        with urllib.request.urlopen(req) as response:
            csv_data = response.read().decode()
            if "participant_id" in csv_data:
                log_step("Researcher CSV export verified successfully.")
            else:
                raise Exception("Missing valid CSV header")
    except Exception as e:
        print(f"\033[91m[Error]\033[0m Dashboard export failed: {e}")
        sys.exit(1)


def trigger_python_analysis():
    log_step("Triggering Python Analysis Script (analyze_logs.py)...")
    
    # Check if pandas exists before running the script to prevent an ugly crash
    try:
        import pandas
    except ImportError:
        print("\033[93m[Warning]\033[0m Cannot run python plotting (analyze_logs.py) because 'pandas' or 'matplotlib' is missing.")
        print("          Skipping Python analysis portion. To run it, please install dependencies:")
        print("          python3 -m venv venv && source venv/bin/activate && pip install pandas matplotlib")
        print("\033[92m[Success]\033[0m Front-End and Backend API data flow verified completely!")
        return

    result = subprocess.run(
        [sys.executable, "scripts/analyze_logs.py"],
        capture_output=True,
        text=True
    )
    if result.returncode == 0:
        log_step("Python analysis completed without errors! Dashboard charts generated.")
        print("\033[92m[Success]\033[0m End-to-End Smoke Test Passed!")
    else:
        print("\033[91m[Error]\033[0m Python analysis failed with output:")
        print(result.stderr)
        sys.exit(1)

def main():
    print("=========================================")
    print(" HumanAI ISSR3 Auto-Smoke Test Initiated")
    print("=========================================")
    
    ensure_server_running()

    # Simulate 4 participants to get a good spread of data
    for i in range(1, 5):
        simulate_participant(i)

    check_researcher_dashboard_export()
    trigger_python_analysis()

if __name__ == "__main__":
    main()
