"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [participantId, setParticipantId] = useState("");
  const [condition, setCondition] = useState<"A" | "B" | "">("");

  useEffect(() => {
    async function assignCondition() {
      const response = await fetch("/api/assign-condition");
      const data = await response.json();

      setParticipantId(data.participantId);
      setCondition(data.condition);

      sessionStorage.setItem("participant_id", data.participantId);
      sessionStorage.setItem("condition", data.condition);
      sessionStorage.setItem("task_start", Date.now().toString());
    }

    assignCondition();
  }, []);

  return (
    <main>
      <div className="card">
        <div className="badge">HumanAI ISSR3 Screening Prototype</div>
        <h1>Humanlike AI Systems and Trust Attribution</h1>
        <p className="muted">
          This minimal prototype assigns a participant to one of two interface
          conditions and records whether the participant accepts or overrides an
          AI recommendation.
        </p>

        <div className="grid two-col">
          <div className="option">
            <h3>Participant ID</h3>
            <p>{participantId || "Assigning..."}</p>
          </div>

          <div className="option">
            <h3>Condition</h3>
            <p>{condition || "Assigning..."}</p>
          </div>
        </div>

        <div className="buttonRow">
          <Link href="/task" className="buttonLink">
            Start Task
          </Link>
          <a href="/api/export?format=json" className="buttonLink secondary">
            Download JSON Logs
          </a>
          <a href="/api/export?format=csv" className="buttonLink secondary">
            Download CSV Logs
          </a>
        </div>
      </div>

      <div className="card">
        <h2>Study Flow</h2>
        <p className="muted">
          Landing page → randomized condition → one decision task → structured
          behavioral log → exportable dataset
        </p>
      </div>
    </main>
  );
}
