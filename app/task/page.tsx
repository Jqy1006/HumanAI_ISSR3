"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TaskOption {
  name: string;
  specs: string[];
}

interface TaskScenario {
  id: string;
  title: string;
  scenario: string;
  optionA: TaskOption;
  optionB: TaskOption;
  aiRecommendation: "A" | "B";
  rationaleFormal: string[];
  rationaleConversational: string[];
}

interface TaskConfig {
  agentName: string;
  tone: string;
  title: string;
  message: string;
  cueSummary: string;
  accuracyRate: number;
}

export default function TaskPage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState("");
  const [condition, setCondition] = useState("");
  const [config, setConfig] = useState<TaskConfig | null>(null);
  const [tasks, setTasks] = useState<TaskScenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taskStart, setTaskStart] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPid = sessionStorage.getItem("participant_id");
    const storedCond = sessionStorage.getItem("condition");

    if (!storedPid || !storedCond) {
      router.push("/");
      return;
    }

    setParticipantId(storedPid);
    setCondition(storedCond);

    // Fetch condition config + task list in parallel
    Promise.all([
      fetch(`/api/condition-config?id=${encodeURIComponent(storedCond)}`).then(
        (r) => r.json()
      ),
      fetch("/api/tasks").then((r) => r.json())
    ])
      .then(([configData, tasksData]) => {
        setConfig(configData);
        setTasks(tasksData);
        setTaskStart(Date.now());
        setLoading(false);
      })
      .catch(() => router.push("/"));
  }, [router]);

  function collectBrowserMeta() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: screen.width,
      screenHeight: screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  }

  async function submitDecision(decision: "accept" | "override") {
    if (!config || tasks.length === 0) return;
    setSubmitting(true);

    const latency = Date.now() - taskStart;
    const currentTask = tasks[currentIndex];

    const payload = {
      participant_id: participantId,
      condition,
      task_type: "recommendation",
      task_id: currentTask.id,
      decision,
      timestamp: new Date().toISOString(),
      latency_ms: latency,
      trust_rating: 0,
      confidence_rating: 0,
      browser_meta: collectBrowserMeta()
    };

    await fetch("/api/log-decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Accumulate decisions across tasks
    const prevDecisions = JSON.parse(sessionStorage.getItem("task_decisions") || "[]");
    prevDecisions.push({
      taskId: currentTask.id,
      taskTitle: currentTask.title,
      decision,
      latency_ms: latency
    });
    sessionStorage.setItem("task_decisions", JSON.stringify(prevDecisions));

    const isLast = currentIndex >= tasks.length - 1;

    if (isLast) {
      // All tasks done → go to ratings
      sessionStorage.setItem("agent_name", config.agentName);
      sessionStorage.setItem("tasks_completed", String(tasks.length));
      router.push("/ratings");
    } else {
      // Move to next task
      setCurrentIndex((prev) => prev + 1);
      setTaskStart(Date.now());
      setSubmitting(false);
    }
  }

  if (loading || !config || tasks.length === 0) {
    return (
      <main>
        <div className="card">
          <p>Loading tasks...</p>
        </div>
      </main>
    );
  }

  const currentTask = tasks[currentIndex];

  const rationale =
    config.tone === "formal"
      ? currentTask.rationaleFormal
      : currentTask.rationaleConversational;

  return (
    <main>
      {/* Task Details First */}
      <div className="card">
        <div className="badge" style={{ marginBottom: "16px" }}>
          Condition {condition} · Task {currentIndex + 1} of {tasks.length}
        </div>
        <h2>
          Task {currentIndex + 1}: {currentTask.title}
        </h2>
        <p className="muted">{currentTask.scenario}</p>

        <div className="grid two-col" style={{ marginTop: "16px" }}>
          <div className="option">
            <h3>{currentTask.optionA.name}</h3>
            {currentTask.optionA.specs.map((spec, i) => (
              <p key={i}>{spec}</p>
            ))}
          </div>

          <div className="option">
            <h3>{currentTask.optionB.name}</h3>
            {currentTask.optionB.specs.map((spec, i) => (
              <p key={i}>{spec}</p>
            ))}
          </div>
        </div>
      </div>

      {/* AI Response Block Second */}
      <div className="card">
        <div className="ai-response-block" style={{ marginTop: 0 }}>
          <div className="ai-header">
            <span className="ai-avatar">✨</span>
            <div className="ai-title-wrap">
              <h2 style={{ margin: 0, fontSize: "16px" }}>{config.title}</h2>
            </div>
          </div>
          
          <div className="ai-body">
            <p className="ai-preamble">
              <em>{config.message}</em>
            </p>
            <ul className="ai-rationale">
              {rationale.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <p style={{ marginTop: "18px", padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <strong>Decision Required:</strong> Based on the analysis above, do you accept <strong>{config.agentName}</strong>'s recommendation for <strong>{currentTask.aiRecommendation === "A" ? currentTask.optionA.name : currentTask.optionB.name}</strong>?
        </p>

        <div className="buttonRow">
          <button
            onClick={() => submitDecision("accept")}
            disabled={submitting}
          >
            Accept Recommendation
          </button>
          <button
            onClick={() => submitDecision("override")}
            disabled={submitting}
          >
            Override Recommendation
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="card" style={{ textAlign: "center" }}>
        <div className="progress-dots">
          {tasks.map((_, i) => (
            <span
               key={i}
               className={`dot ${i < currentIndex ? "done" : ""} ${
                 i === currentIndex ? "current" : ""
               }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
