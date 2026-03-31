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
  aiRecommendation: "A";   // always A for consistent coding
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
      "I strongly suggest going with Option A. Option B looks incredibly tempting since it's silent and has zero maintenance costs, but there's a serious catch.",
      "Option B emits 'trace amounts of ozone'. In a tiny 15-square-meter bedroom running all night long, that ozone gets trapped and actually builds up to levels that can hurt your lungs.",
      "Since the person using the room already has allergies, feeding them ozone is a terrible idea. Yeah, Option A is a bit louder and costs $50 a year to maintain, but it's the only safe choice here."
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
        "Provider Alpha",
        "$50/month",
        "2TB total pooled storage",
        "Uses 'Block-Level' sync protocol"
      ]
    },
    optionB: {
      name: "Option B",
      specs: [
        "Provider Beta",
        "$40/month",
        "5TB total storage (1TB per user)",
        "Uses 'File-Level' sync protocol"
      ]
    },
    aiRecommendation: "A",
    rationaleFormal: [
      "Option A is the optimal choice primarily due to its underlying synchronization architecture.",
      "Because the team edits large 5GB video files, Option A's 'Block-Level' sync will only upload the tiny pieces (blocks) of the file that were actually altered during the edit, taking seconds.",
      "Conversely, Option B uses 'File-Level' sync. Even if a user makes a 1second cut, the system will re-upload the entire 5GB file from scratch, crippling team bandwidth and halting productivity."
    ],
    rationaleConversational: [
      "Option A is definitely the way to go here. Option B looks like a much better deal because you get more than double the storage for less money, but it would ruin your team's workflow.",
      "The secret is the sync protocol. Option A uses 'Block-Level' sync, meaning if you make a tiny edit to a massive 5GB video, it only uploads the few megabytes you changed.",
      "Option B uses 'File-Level' sync. That means every single time someone hits save, the computer has to re-upload the entire 5GB file all over again, taking hours and freezing collaboration."
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
      "Service Economy (Option B) lacks strict formatting checks, meaning the club's emails will likely be flagged by major mail providers (Gmail, Outlook) and placed invisibly into spam folders. The cost savings of Option B are invalidated if the emails are never seen."
    ],
    rationaleConversational: [
      "I'd definitely pick Option A for the club. Option B is way cheaper and gives you unlimited contacts, but there's a hidden technical trap.",
      "University clubs always have terrible 'sender reputations' because they constantly email old students whose inboxes have been deactivated, causing huge bounce rates.",
      "Because of that bad reputation, if you use a cheap service like Option B that doesn't strictly force good formatting, Google and Outlook will just quietly toss your newsletter straight into people's spam folders. It's totally worth paying $20 extra to make sure people actually read it."
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
        "LED Projector",
        "4K Ultra HD Resolution",
        "800 ANSI Lumens (Dim)",
        "$500"
      ]
    },
    optionB: {
      name: "Option B",
      specs: [
        "Laser Projector",
        "1080p Full HD Resolution",
        "3000 ANSI Lumens (Bright)",
        "$650"
      ]
    },
    aiRecommendation: "A",
    rationaleFormal: [
      "Option A is the mathematically superior selection for a modern home theater setup.",
      "A 4K resolution projector provides four times the pixel density of a 1080p unit (Option B), leading to significantly sharper image fidelity.",
      "Furthermore, Option A achieves this vastly superior resolution while remaining $150 cheaper. Cost-to-pixel ratios dictate that Option A is the optimal hardware investment."
    ],
    rationaleConversational: [
      "I'd definitely go with Option A. Getting a 4K projector for only $500 is an absolute steal right now!",
      "Option B is just standard 1080p HD, which is pretty outdated for watching sports, and it literally costs $150 more. Why pay more for worse resolution?",
      "Option A gives you that crisp, cinematic 4K sharpness to really enjoy the game while keeping more money in your pocket."
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
      "Selecting Option A yields a $150 cost reduction over Option B, representing a 37.5% financial gain with zero penalty to your scheduled obligations."
    ],
    rationaleConversational: [
      "I definitely recommend Option A! Unless you like setting money on fire, there's no reason to spend $400 on Option B.",
      "Option A saves you $150 right off the bat. It still gets you to Chicago by 1:00 PM, which gives you plenty of time before your 2:30 PM appointment.",
      "A 45-minute layover is completely standard, and saving 37% on your ticket cost makes Option A the obvious smart choice."
    ]
  }
];
