"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CONDITIONS } from "@/lib/conditions";
import { ConditionKey } from "@/lib/types";

export default function TaskPage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState("");
  const [condition, setCondition] = useState<ConditionKey>("A");
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedParticipantId = sessionStorage.getItem("participant_id");
    const storedCondition = sessionStorage.getItem("condition") as ConditionKey | null;

    if (!storedParticipantId || !storedCondition) {
      router.push("/");
      return;
    }

    sessionStorage.setItem("task_start", Date.now().toString());
    setParticipantId(storedParticipantId);
    setCondition(storedCondition);
    setReady(true);
  }, [router]);

  const config = useMemo(() => CONDITIONS[condition], [condition]);

  async function submitDecision(decision: "accept" | "override") {
    setSubmitting(true);

    const taskStart = Number(sessionStorage.getItem("task_start") || Date.now());
    const latency = Date.now() - taskStart;

    const payload = {
      participant_id: participantId,
      condition,
      decision,
      timestamp: new Date().toISOString(),
      latency_ms: latency
    };

    await fetch("/api/log-decision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    sessionStorage.setItem("last_decision", decision);
    sessionStorage.setItem("last_latency", String(latency));
    router.push("/thanks");
  }

  if (!ready) {
    return (
      <main>
        <div className="card">
          <p>Loading task...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="card">
        <div className="badge">Assigned condition: {condition}</div>
        <h1>{config.title}</h1>
        <p className="muted">{config.cueSummary}</p>
        <p>{config.message}</p>
      </div>

      <div className="card">
        <h2>Decision Task</h2>
        <p className="muted">
          Imagine you are selecting a laptop for a student data-analysis course.
          Below are the two options.
        </p>

        <div className="grid two-col">
          <div className="option">
            <h3>Option A</h3>
            <p>13-inch laptop</p>
            <p>16 GB RAM</p>
            <p>512 GB SSD</p>
            <p>Battery: 12 hours</p>
          </div>

          <div className="option">
            <h3>Option B</h3>
            <p>15-inch laptop</p>
            <p>8 GB RAM</p>
            <p>256 GB SSD</p>
            <p>Battery: 9 hours</p>
          </div>
        </div>

        <p style={{ marginTop: "18px" }}>
          <strong>{config.agentName}</strong> recommends <strong>Option A</strong>.
        </p>

        <div className="buttonRow">
          <button
            onClick={() => submitDecision("accept")}
            disabled={submitting}
          >
            Accept Recommendation
          </button>
          <button
            className="secondary"
            onClick={() => submitDecision("override")}
            disabled={submitting}
          >
            Override Recommendation
          </button>
        </div>
      </div>
    </main>
  );
}
