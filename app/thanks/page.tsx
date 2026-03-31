"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface TaskDecision {
  taskId: string;
  decision: string;
}

export default function ThanksPage() {
  const [participantId, setParticipantId] = useState("");
  const [acceptanceRate, setAcceptanceRate] = useState<string | null>(null);

  useEffect(() => {
    setParticipantId(sessionStorage.getItem("participant_id") || "");

    const raw = sessionStorage.getItem("task_decisions");
    if (raw) {
      try {
        const decisions: TaskDecision[] = JSON.parse(raw);
        if (decisions.length > 0) {
          const accepts = decisions.filter((d) => d.decision === "accept").length;
          setAcceptanceRate(`${accepts} / ${decisions.length}`);
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  return (
    <main>
      <div className="card">
        <div className="badge">Submission complete</div>
        <h1>Thank you</h1>
        <p className="muted">
          Your responses have been recorded. You may now close this window.
        </p>
      </div>

      <div className="card">
        <div className="grid two-col">
          <div className="option">
            <h3>Participant ID</h3>
            <p style={{ fontFamily: "monospace", fontSize: "13px" }}>
              {participantId || "—"}
            </p>
          </div>
          {acceptanceRate !== null && (
            <div className="option">
              <h3>AI Recommendations Accepted</h3>
              <p>{acceptanceRate} tasks</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="buttonRow">
          <Link href="/" className="buttonLink">
            Run Again
          </Link>
        </div>
      </div>
    </main>
  );
}
