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
  const [trapSummary, setTrapSummary] = useState<{ caught: number; missed: number } | null>(null);

  useEffect(() => {
    setParticipantId(sessionStorage.getItem("participant_id") || "");

    const raw = sessionStorage.getItem("task_decisions");
    if (raw) {
      try {
        const decisions: TaskDecision[] = JSON.parse(raw);
        if (decisions.length > 0) {
          const accepts = decisions.filter((d) => d.decision === "accept").length;
          setAcceptanceRate(`${accepts} / ${decisions.length}`);

          // Trap analysis
          const trapIds = ["projector", "flight_booking"];
          const traps = decisions.filter((d) => trapIds.includes(d.taskId));
          if (traps.length > 0) {
            const caught = traps.filter((d) => d.decision === "override").length;
            const missed = traps.filter((d) => d.decision === "accept").length;
            setTrapSummary({ caught, missed });
          }
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
        <h1>Experiment Concluded</h1>
        <p className="muted">
          Your responses have been successfully recorded. Thank you for your participation.
        </p>
      </div>

      <div className="card">
        <h2>Your Personal Insights</h2>
        <p className="muted" style={{ marginBottom: "16px" }}>
          In this experiment, the AI was intentionally programmed to give logically flawed or dangerous advice on certain "Trap" tasks (the Projector and the Winter Flight). Let's see how much you relied on automation versus your own critical thinking.
        </p>
        
        <div className="grid two-col">
          <div className="option">
            <h3>Participant ID</h3>
            <p style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: "600" }}>
              {participantId || "—"}
            </p>
          </div>
          {acceptanceRate !== null && (
            <div className="option">
              <h3>Overall AI Reliance</h3>
              <p style={{ fontSize: "14px", fontWeight: "600" }}>Accepted {acceptanceRate} recommendations</p>
            </div>
          )}
        </div>

        {trapSummary && (
          <div className="grid two-col" style={{ marginTop: "16px" }}>
            <div className="option" style={{ borderLeft: "4px solid #22c55e" }}>
              <h3 style={{ color: "#16a34a" }}>Traps Caught ✓</h3>
              <p style={{ fontSize: "18px", fontWeight: "700" }}>{trapSummary.caught}</p>
              <p className="muted" style={{ fontSize: "12px", marginTop: "4px" }}>Times you successfully overrode bad AI advice.</p>
            </div>
            <div className="option" style={{ borderLeft: "4px solid #ef4444" }}>
              <h3 style={{ color: "#dc2626" }}>Automation Overtrust ⚠️</h3>
              <p style={{ fontSize: "18px", fontWeight: "700" }}>{trapSummary.missed}</p>
              <p className="muted" style={{ fontSize: "12px", marginTop: "4px" }}>Times you blindly accepted flawed AI logic.</p>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="buttonRow">
          <Link href="/" className="buttonLink">
            Run Experiment Again
          </Link>
          <Link href="/logs" className="buttonLink secondary">
            Researcher Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
