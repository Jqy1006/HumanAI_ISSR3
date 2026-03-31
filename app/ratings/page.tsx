"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LIKERT_LABELS = [
  "1 — Strongly disagree",
  "2",
  "3",
  "4 — Neutral",
  "5",
  "6",
  "7 — Strongly agree"
];

export default function RatingsPage() {
  const router = useRouter();
  const [trustRating, setTrustRating] = useState<number>(0);
  const [confidenceRating, setConfidenceRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [agentName, setAgentName] = useState("");

  useEffect(() => {
    const pid = sessionStorage.getItem("participant_id");
    if (!pid) {
      router.push("/");
      return;
    }
    setAgentName(sessionStorage.getItem("agent_name") || "the AI");
    setReady(true);
  }, [router]);

  async function submitRatings() {
    if (trustRating === 0 || confidenceRating === 0) return;
    setSubmitting(true);

    const payload = {
      participant_id: sessionStorage.getItem("participant_id"),
      trust_rating: trustRating,
      confidence_rating: confidenceRating
    };

    await fetch("/api/log-ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    sessionStorage.setItem("trust_rating", String(trustRating));
    sessionStorage.setItem("confidence_rating", String(confidenceRating));
    router.push("/thanks");
  }

  if (!ready) {
    return (
      <main>
        <div className="card">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="card">
        <div className="badge">Post-Task Ratings</div>
        <h1>Rate Your Experience</h1>
        <p className="muted">
          Please answer both questions before continuing.
        </p>
      </div>

      <div className="card">
        <h2>Trust Rating</h2>
        <p>
          How much do you trust the recommendation from{" "}
          <strong>{agentName}</strong>?
        </p>
        <div className="likert-scale">
          {LIKERT_LABELS.map((label, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                className={`likert-btn ${trustRating === value ? "active" : ""}`}
                onClick={() => setTrustRating(value)}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2>Confidence Rating</h2>
        <p>How confident are you in the decision you just made?</p>
        <div className="likert-scale">
          {LIKERT_LABELS.map((label, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                className={`likert-btn ${confidenceRating === value ? "active" : ""}`}
                onClick={() => setConfidenceRating(value)}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="buttonRow">
          <button
            onClick={submitRatings}
            disabled={submitting || trustRating === 0 || confidenceRating === 0}
          >
            {submitting ? "Submitting..." : "Submit Ratings"}
          </button>
        </div>
        {(trustRating === 0 || confidenceRating === 0) && (
          <p className="muted" style={{ marginTop: "8px", fontSize: "13px" }}>
            Please select a rating for both questions.
          </p>
        )}
      </div>
    </main>
  );
}
