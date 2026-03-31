// ---------------------------------------------------------------------------
// Task Scenarios (Obscure/Unfamiliar Decision Tasks)
//
// Each participant receives ALL scenarios in sequence under the SAME condition.
// The AI always recommends Option A for consistent decision coding.
//
// The rationale arrays contain the reasoning for the AI's choice. The UI
// will render either the `rationaleFormal` or `rationaleConversational` version
// based on the assigned condition tone.
// ---------------------------------------------------------------------------

export interface TaskOption {
  name: string;
  specs: string[];
}

export interface TaskScenario {
  id: string;
  title: string;
  scenario: string;
  optionA: TaskOption;
  optionB: TaskOption;
  aiRecommendation: "A" | "B";

  rationaleFormal: string[];
  rationaleConversational: string[];
}

export const TASK_SCENARIOS: TaskScenario[] = [
  // ── Task 1: Air Purifier Selection ────────────────────────────
  {
    id: "air_purifier",
    title: "Bedroom Air Purifier Selection",
    scenario:
      "You are buying an air purifier for a small, enclosed 15-square-meter bedroom used by someone with mild dust allergies. You leave it running for 8 hours every night. Which model do you select?",
    optionA: {
      name: "Option A",
      specs: [
        "HEPA Filter Model",
        "Higher operating noise (45 dB)",
        "Requires $50 filter replacement yearly",
        "Filters 99.97% of particles"
      ]
    },
    optionB: {
      name: "Option B",
      specs: [
        "Electrostatic Model",
        "Completely silent operation (0 dB)",
        "Washable lifetime filters (No recurring cost)",
        "Emits trace amounts of ozone"
      ]
    },
    aiRecommendation: "A",
    rationaleFormal: [
      "Option A is highly recommended for this enclosed spatial parameter and usage duration. The primary disqualifier for Option B is its trace ozone emission.",
      "In a small, poorly ventilated 15-square-meter room over an 8-hour continuous cycle, electrostatic models can cause ozone concentrations to accumulate past the WHO safe limit of 100 μg/m3.",
      "While Option A incurs a recurring $50 maintenance cost and moderate noise, it prevents respiratory irritation for the allergic occupant, which is the primary goal of the purchase."
    ],
    rationaleConversational: [
      "Option A is highly recommended for this tight space and long usage duration. The main dealbreaker for Option B is that it gives off trace amounts of ozone.",
      "In a small, poorly ventilated 15-square-meter room running for 8 straight hours, electrostatic models can cause ozone levels to build up way past the WHO safe limit of 100 μg/m3.",
      "Even though Option A has a $50 yearly maintenance cost and is a bit louder, it stops the allergic person from getting awful respiratory irritation, which is the whole point of buying this."
    ]
  },

  // ── Task 2: Team Cloud Storage ─────────────────────────────────
  {
    id: "cloud_storage",
    title: "Team Cloud Storage Provider",
    scenario:
      "Your 5-person team frequently collaborates on editing large 5GB video files. You need to pick a cloud drive subscription to keep everyone's local folders synchronized.",
    optionA: {
      name: "Option A",
      specs: [
        "Provider Beta",
        "$40/month",
        "5TB total storage (1TB per user)",
        "Uses 'File-Level' sync protocol"
      ]
    },
    optionB: {
      name: "Option B",
      specs: [
        "Provider Alpha",
        "$50/month",
        "2TB total pooled storage",
        "Uses 'Block-Level' sync protocol"
      ]
    },
    aiRecommendation: "B",
    rationaleFormal: [
      "Option B is the optimal choice primarily due to its underlying synchronization architecture.",
      "Because the team edits large 5GB video files, Option B's 'Block-Level' sync will only upload the specific bytes altered during the edit, completing the synchronization in seconds.",
      "Conversely, Option A uses 'File-Level' sync, meaning even a minor one-second cut forces a complete 5GB re-upload, crippling team bandwidth and halting productivity."
    ],
    rationaleConversational: [
      "Option B is definitely the best choice, mainly because of how its backend syncing tech actually works under the hood.",
      "Since your team edits massive 5GB video files, Option B's 'Block-Level' sync only uploads the exact pieces you changed during the edit, so it finishes saving in just seconds.",
      "Meanwhile, Option A uses 'File-Level' sync, meaning even a tiny one-second edit makes it re-upload the entire 5GB file from scratch, totally killing your internet speed and ruining teamwork."
    ]
  },

  // ── Task 3: Email Marketing ─────────────────────────────────
  {
    id: "email_marketing",
    title: "Newsletter Software Switch",
    scenario:
      "A university club with 2,000 subscribers sends out a weekly newsletter. You are tasked with choosing the new email sending platform for this year.",
    optionA: {
      name: "Option A",
      specs: [
        "Service Premium",
        "$30/month",
        "Strict anti-spam automated formatting",
        "Maximum 3,000 subscribers allowed"
      ]
    },
    optionB: {
      name: "Option B",
      specs: [
        "Service Economy",
        "$10/month",
        "Basic manual formatting",
        "Unlimited subscribers allowed"
      ]
    },
    aiRecommendation: "A",
    rationaleFormal: [
      "Option A is the recommended platform because of its automated anti-spam compliance framework.",
      "University club domains historically suffer from poor IP sender reputation due to high bounce rates from graduating students' inactive emails.",
      "Service Economy (Option B) lacks strict formatting checks, resulting in emails being flagged by major providers and placed invisibly into spam folders; the cost savings are invalidated if the emails are never seen."
    ],
    rationaleConversational: [
      "Option A is definitely the recommended platform here, thanks to its built-in anti-spam safety checks.",
      "University club addresses always end up with a terrible 'sender reputation' because they constantly get bounces from graduated students' dead email accounts.",
      "Option B doesn't strictly force good formatting, so major email providers will just quietly dump your newsletters straight into spam folders; saving $20 a month is completely useless if nobody ever sees the emails."
    ]
  },

  // ── Task 4: Living Room Projector (TRICK/FLAWED AI LOGIC) ────────────────
  {
    id: "projector",
    title: "Living Room Projector Selection",
    scenario:
      "You are buying a projector for your brightly-lit living room. You and your friends often watch afternoon sports with the curtains wide open.",
    optionA: {
      name: "Option A",
      specs: [
        "Laser Projector",
        "1080p Full HD Resolution",
        "3000 ANSI Lumens (Bright)",
        "$650"
      ]
    },
    optionB: {
      name: "Option B",
      specs: [
        "LED Projector",
        "4K Ultra HD Resolution",
        "800 ANSI Lumens (Dim)",
        "$500"
      ]
    },
    aiRecommendation: "B",
    rationaleFormal: [
      "Option B is the mathematically superior selection for a modern home theater setup.",
      "A 4K resolution projector provides four times the pixel density of a 1080p unit (Option A), leading to significantly sharper image fidelity.",
      "Furthermore, Option B achieves this vastly superior resolution while remaining $150 cheaper, indicating that it is the optimal hardware investment regardless of environmental lighting constraints."
    ],
    rationaleConversational: [
      "Option B is clearly the better pick for a modern home setup based on the specs.",
      "Getting a 4K projector gives you four times as many pixels as a standard 1080p one like Option A, which means you get a way sharper picture.",
      "Plus, Option B gives you that amazing resolution while keeping an extra $150 in your pocket, making it the smartest hardware buy even if your room is super bright."
    ]
  },

  // ── Task 5: Winter Flight Booking (TRICK/FLAWED AI LOGIC) ────────────────
  {
    id: "flight_booking",
    title: "Winter Flight Booking",
    scenario:
      "You are booking a flight to Chicago on December 23rd to attend a highly critical medical appointment scheduled for 2:30 PM. It is heavily snowing in the Midwest.",
    optionA: {
      name: "Option A",
      specs: [
        "Connecting Flight",
        "$250",
        "Layover: 45 minutes in Detroit (DTW)",
        "Arrives at 1:00 PM"
      ]
    },
    optionB: {
      name: "Option B",
      specs: [
        "Direct Flight",
        "$400",
        "Zero layovers",
        "Arrives at 11:30 AM"
      ]
    },
    aiRecommendation: "A",
    rationaleFormal: [
      "Option A is recommended as it satisfies all logistical constraints while maximizing financial efficiency.",
      "The scheduled arrival time of 1:00 PM provides a 90-minute buffer before your 2:30 PM appointment, which is mathematically sufficient for standard transit.",
      "Selecting Option A yields a $150 cost reduction over Option B, representing a 37.5% financial gain with zero penalty to your scheduled obligations, assuming optimal weather conditions."
    ],
    rationaleConversational: [
      "Option A is definitely recommended since it checks all the boxes for your schedule while saving you the most money.",
      "Landing at 1:00 PM still gives you a 90-minute buffer before your 2:30 PM appointment, which is plenty of time to get where you need to go.",
      "Going with Option A keeps $150 in your wallet compared to Option B, which is a huge 37.5% saving that shouldn't mess up your plans, assuming the weather stays perfectly fine."
    ]
  }
];
