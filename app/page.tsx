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
        <h1>Decision Making Test</h1>
        <p className="muted">
          Welcome to the decision-making test. An AI assistant will provide recommendations to help you navigate a series of choices.
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
