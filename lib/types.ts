export type ConditionKey = "A" | "B";

export interface ConditionConfig {
  id: ConditionKey;
  agentName: string;
  title: string;
  message: string;
  cueSummary: string;
}

export interface DecisionLog {
  participant_id: string;
  condition: ConditionKey;
  decision: "accept" | "override";
  timestamp: string;
  latency_ms: number;
}
