import { ConditionConfig } from "./types";

export const CONDITIONS: Record<"A" | "B", ConditionConfig> = {
  A: {
    id: "A",
    agentName: "Decision Support System",
    title: "Recommendation from Decision Support System",
    message:
      "The model estimates that Option A is more suitable for your stated needs.",
    cueSummary: "Neutral name, formal tone, calibrated framing"
  },
  B: {
    id: "B",
    agentName: "Maya",
    title: "Recommendation from Maya",
    message:
      "Hi — I’d go with Option A. I’m pretty confident it’s the better choice for you.",
    cueSummary: "Humanlike name, conversational tone, stronger confidence framing"
  }
};
