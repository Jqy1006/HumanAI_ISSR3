#!/usr/bin/env python3
"""
analyze_logs.py — Analyze experiment logs and generate visualizations.

Usage:
    python3 scripts/analyze_logs.py

Requires: pandas, matplotlib
    pip install pandas matplotlib
"""

import os
import sys
import json
import pandas as pd
import matplotlib
matplotlib.use("Agg")           # headless backend — no display needed
import matplotlib.pyplot as plt

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

LOG_PATH = os.path.join("logs", "decisions.json")
OUTPUT_DIR = os.path.join("logs", "analysis_output")

COLORS = {
    "A": "#4F46E5",   # indigo
    "B": "#E11D48",   # rose
    "C": "#059669",   # emerald  (future)
    "D": "#D97706"    # amber    (future)
}

# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------

def load_data() -> pd.DataFrame:
    if not os.path.exists(LOG_PATH):
        print(f"No log file found at {LOG_PATH}")
        sys.exit(1)

    with open(LOG_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not data:
        print("Log file is empty — run the experiment first.")
        sys.exit(1)

    df = pd.DataFrame(data)
    df["latency_ms"] = df["latency_ms"].astype(float)
    df["trust_rating"] = df["trust_rating"].astype(float)
    df["confidence_rating"] = df["confidence_rating"].astype(float)
    return df


# ---------------------------------------------------------------------------
# Summary statistics
# ---------------------------------------------------------------------------

def print_summary(df: pd.DataFrame) -> None:
    print()
    print("=" * 60)
    print("  EXPERIMENT SUMMARY")
    print("=" * 60)
    print(f"  Total participants: {len(df)}")
    print()

    for cond, group in df.groupby("condition"):
        n = len(group)
        accepts = (group["decision"] == "accept").sum()
        rated = group[group["trust_rating"] > 0]

        print(f"  Condition {cond}  (n = {n})")
        print(f"    Acceptance rate:     {accepts / n:.1%}")
        print(f"    Override rate:       {(n - accepts) / n:.1%}")
        print(f"    Mean latency:        {group['latency_ms'].mean():.0f} ms")
        if len(rated) > 0:
            print(f"    Mean trust rating:   {rated['trust_rating'].mean():.2f} / 7")
            print(f"    Mean confidence:     {rated['confidence_rating'].mean():.2f} / 7")
        else:
            print(f"    Mean trust rating:   (no ratings yet)")
            print(f"    Mean confidence:     (no ratings yet)")
        print()

    print("=" * 60)


# ---------------------------------------------------------------------------
# Chart 1: Acceptance rate by condition
# ---------------------------------------------------------------------------

def plot_acceptance_rate(df: pd.DataFrame) -> None:
    rates = df.groupby("condition")["decision"].apply(
        lambda x: (x == "accept").mean()
    ).reset_index()
    rates.columns = ["condition", "acceptance_rate"]

    fig, ax = plt.subplots(figsize=(6, 4))
    bars = ax.bar(
        rates["condition"],
        rates["acceptance_rate"],
        color=[COLORS.get(c, "#888") for c in rates["condition"]],
        width=0.5,
        edgecolor="white",
        linewidth=1.5
    )

    for bar, rate in zip(bars, rates["acceptance_rate"]):
        ax.text(
            bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.02,
            f"{rate:.0%}", ha="center", va="bottom", fontweight="bold", fontsize=12
        )

    ax.set_ylim(0, 1.15)
    ax.set_ylabel("Acceptance Rate", fontsize=12)
    ax.set_xlabel("Condition", fontsize=12)
    ax.set_title("AI Recommendation Acceptance Rate by Condition", fontsize=13, fontweight="bold")
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "1_acceptance_rate.png"), dpi=150)
    plt.close(fig)
    print("  → 1_acceptance_rate.png")


# ---------------------------------------------------------------------------
# Chart 2: Response latency distribution
# ---------------------------------------------------------------------------

def plot_latency(df: pd.DataFrame) -> None:
    conditions = sorted(df["condition"].unique())
    data_by_cond = [df[df["condition"] == c]["latency_ms"] / 1000 for c in conditions]

    fig, ax = plt.subplots(figsize=(6, 4))
    bp = ax.boxplot(
        data_by_cond,
        labels=conditions,
        patch_artist=True,
        widths=0.4,
        medianprops=dict(color="white", linewidth=2)
    )

    for patch, cond in zip(bp["boxes"], conditions):
        patch.set_facecolor(COLORS.get(cond, "#888"))
        patch.set_alpha(0.85)

    ax.set_ylabel("Response Latency (seconds)", fontsize=12)
    ax.set_xlabel("Condition", fontsize=12)
    ax.set_title("Response Latency Distribution by Condition", fontsize=13, fontweight="bold")
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "2_latency_distribution.png"), dpi=150)
    plt.close(fig)
    print("  → 2_latency_distribution.png")


# ---------------------------------------------------------------------------
# Chart 3: Trust & confidence ratings comparison
# ---------------------------------------------------------------------------

def plot_ratings(df: pd.DataFrame) -> None:
    rated = df[df["trust_rating"] > 0].copy()
    if len(rated) == 0:
        print("  → (skipping ratings chart — no ratings data yet)")
        return

    conditions = sorted(rated["condition"].unique())
    trust_means = [rated[rated["condition"] == c]["trust_rating"].mean() for c in conditions]
    conf_means = [rated[rated["condition"] == c]["confidence_rating"].mean() for c in conditions]

    x = range(len(conditions))
    width = 0.3

    fig, ax = plt.subplots(figsize=(6, 4))

    bars1 = ax.bar(
        [i - width / 2 for i in x], trust_means,
        width=width, label="Trust", color="#4F46E5", alpha=0.85
    )
    bars2 = ax.bar(
        [i + width / 2 for i in x], conf_means,
        width=width, label="Confidence", color="#E11D48", alpha=0.85
    )

    for bar in list(bars1) + list(bars2):
        ax.text(
            bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.1,
            f"{bar.get_height():.1f}", ha="center", va="bottom", fontsize=10
        )

    ax.set_ylim(0, 8)
    ax.set_xticks(list(x))
    ax.set_xticklabels([f"Condition {c}" for c in conditions])
    ax.set_ylabel("Mean Rating (1–7)", fontsize=12)
    ax.set_title("Trust & Confidence Ratings by Condition", fontsize=13, fontweight="bold")
    ax.legend(frameon=False)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "3_ratings_comparison.png"), dpi=150)
    plt.close(fig)
    print("  → 3_ratings_comparison.png")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    df = load_data()
    print_summary(df)

    print("Generating charts...")
    plot_acceptance_rate(df)
    plot_latency(df)
    plot_ratings(df)

    print(f"\nAll charts saved to {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
