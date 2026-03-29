import csv
from collections import defaultdict

def main():
  rows = []

  with open("logs/decisions.csv", "r", encoding="utf-8") as file_obj:
    reader = csv.DictReader(file_obj)
    for row in reader:
      row["latency_ms"] = int(row["latency_ms"])
      rows.append(row)

  if not rows:
    print("No rows found.")
    return

  grouped = defaultdict(list)
  for row in rows:
    grouped[row["condition"]].append(row)

  print("Summary by condition")
  print("-" * 40)

  for condition, items in grouped.items():
    total = len(items)
    accepts = sum(1 for item in items if item["decision"] == "accept")
    overrides = sum(1 for item in items if item["decision"] == "override")
    mean_latency = sum(item["latency_ms"] for item in items) / total

    print(f"Condition: {condition}")
    print(f"Total trials: {total}")
    print(f"Reliance rate: {accepts / total:.2%}")
    print(f"Override rate: {overrides / total:.2%}")
    print(f"Mean latency: {mean_latency:.2f} ms")
    print("-" * 40)

if __name__ == "__main__":
  main()
