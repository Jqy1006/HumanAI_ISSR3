"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ThanksPage() {
  const [participantId, setParticipantId] = useState("");
  const [decision, setDecision] = useState("");
  const [latency, setLatency] = useState("");

  useEffect(() => {
    setParticipantId(sessionStorage.getItem("participant_id") || "");
    setDecision(sessionStorage.getItem("last_decision") || "");
    setLatency(sessionStorage.getItem("last_latency") || "");
  }, []);

  return (
    <main>
      <div className="card">
        <div className="badge">Submission complete</div>
        <h1>Thank you</h1>
        <p className="muted">
          Your decision has been logged in both JSON and CSV format.
        </p>

        <div className="grid two-col">
          <div className="option">
            <h3>Participant ID</h3>
            <p>{participantId}</p>
          </div>
          <div className="option">
            <h3>Decision</h3>
            <p>{decision}</p>
          </div>
        </div>

        <div className="option" style={{ marginTop: "16px" }}>
          <h3>Latency</h3>
          <p>{latency} ms</p>
        </div>

        <div className="buttonRow">
          <Link href="/" className="buttonLink">
            Run Again
          </Link>
          <a href="/api/export?format=json" className="buttonLink secondary">
            Download JSON Logs
          </a>
          <a href="/api/export?format=csv" className="buttonLink secondary">
            Download CSV Logs
          </a>
        </div>
      </div>
    </main>
  );
}
