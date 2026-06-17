export const MILESTONE_GROUPS = [
  {
    id: "0-3m",
    label: "0–3 months",
    milestones: [
      { id: "m1",  text: "Lifts head briefly during tummy time", type: "Physical" },
      { id: "m2",  text: "Follows a moving object with eyes", type: "Cognitive" },
      { id: "m3",  text: "Responds to sounds and voices", type: "Language" },
      { id: "m4",  text: "Smiles at familiar faces", type: "Social" },
      { id: "m5",  text: "Makes cooing sounds", type: "Language" },
    ],
  },
  {
    id: "3-6m",
    label: "3–6 months",
    milestones: [
      { id: "m6",  text: "Rolls from tummy to back", type: "Physical" },
      { id: "m7",  text: "Reaches for and grasps objects", type: "Physical" },
      { id: "m8",  text: "Laughs and squeals", type: "Social" },
      { id: "m9",  text: "Recognises familiar people", type: "Cognitive" },
      { id: "m10", text: "Babbles with consonant sounds (ba, da)", type: "Language" },
    ],
  },
  {
    id: "6-12m",
    label: "6–12 months",
    milestones: [
      { id: "m11", text: "Sits without support", type: "Physical" },
      { id: "m12", text: "Pulls to stand", type: "Physical" },
      { id: "m13", text: "Waves bye-bye", type: "Social" },
      { id: "m14", text: "Says 'mama' or 'dada'", type: "Language" },
      { id: "m15", text: "Plays peek-a-boo", type: "Cognitive" },
      { id: "m16", text: "Picks up small objects with pincer grasp", type: "Physical" },
    ],
  },
  {
    id: "1-2yr",
    label: "1–2 years",
    milestones: [
      { id: "m17", text: "Walks independently", type: "Physical" },
      { id: "m18", text: "Says at least 10 words", type: "Language" },
      { id: "m19", text: "Points to show interest", type: "Social" },
      { id: "m20", text: "Stacks 2–3 blocks", type: "Cognitive" },
      { id: "m21", text: "Follows simple one-step instructions", type: "Cognitive" },
      { id: "m22", text: "Imitates household activities (sweeping, talking on phone)", type: "Social" },
    ],
  },
  {
    id: "2-3yr",
    label: "2–3 years",
    milestones: [
      { id: "m23", text: "Runs and climbs", type: "Physical" },
      { id: "m24", text: "Speaks in 2–3 word phrases", type: "Language" },
      { id: "m25", text: "Plays alongside other children", type: "Social" },
      { id: "m26", text: "Knows own name and age", type: "Cognitive" },
      { id: "m27", text: "Follows two-step instructions", type: "Cognitive" },
      { id: "m28", text: "Shows empathy (hugs upset friend)", type: "Social" },
    ],
  },
  {
    id: "3-5yr",
    label: "3–5 years",
    milestones: [
      { id: "m29", text: "Draws a person with 2–4 body parts", type: "Cognitive" },
      { id: "m30", text: "Tells simple stories", type: "Language" },
      { id: "m31", text: "Takes turns in games", type: "Social" },
      { id: "m32", text: "Hops on one foot", type: "Physical" },
      { id: "m33", text: "Counts to 10", type: "Cognitive" },
      { id: "m34", text: "Uses scissors", type: "Physical" },
    ],
  },
  {
    id: "6-11yr",
    label: "6–11 years",
    milestones: [
      { id: "m35", text: "Reads independently for pleasure", type: "Language" },
      { id: "m36", text: "Rides a bike without training wheels", type: "Physical" },
      { id: "m37", text: "Ties shoelaces confidently", type: "Physical" },
      { id: "m38", text: "Understands basic addition and subtraction", type: "Cognitive" },
      { id: "m39", text: "Forms genuine friendships and cares for them", type: "Social" },
      { id: "m40", text: "Follows multi-step instructions", type: "Cognitive" },
      { id: "m41", text: "Manages minor conflicts with peers", type: "Social" },
      { id: "m42", text: "Expresses thoughts and feelings clearly in words", type: "Language" },
    ],
  },
  {
    id: "12+yr",
    label: "12+ years",
    milestones: [
      { id: "m43", text: "Takes responsibility for homework and school tasks", type: "Cognitive" },
      { id: "m44", text: "Maintains at least one close friendship", type: "Social" },
      { id: "m45", text: "Manages basic personal hygiene independently", type: "Physical" },
      { id: "m46", text: "Identifies and labels their own emotions", type: "Social" },
      { id: "m47", text: "Seeks help from trusted adults when needed", type: "Social" },
      { id: "m48", text: "Understands consequences of actions", type: "Cognitive" },
      { id: "m49", text: "Can have respectful disagreements", type: "Language" },
      { id: "m50", text: "Shows interest in future goals or passions", type: "Cognitive" },
    ],
  },
];

// Maps profile age ranges → one or two milestone group IDs
export const AGE_RANGE_TO_GROUPS = {
  newborn:  ["0-3m"],
  baby:     ["3-6m", "6-12m"],
  toddler:  ["1-2yr", "2-3yr"],
  preschool:["3-5yr"],
  school:   ["6-11yr"],
  teen:     ["12+yr"],
};

export const AGE_EMOJIS = {
  newborn: "👶", baby: "🍼", toddler: "🧒",
  preschool: "🎨", school: "📚", teen: "🌱",
};

export const TYPE_COLORS = {
  Physical:  { bg: "#dceefa", text: "#1a6b82" },
  Language:  { bg: "#ede5f6", text: "#5c3d8a" },
  Social:    { bg: "#fde8d0", text: "#a05a1a" },
  Cognitive: { bg: "#d4e9d9", text: "#2d6349" },
};
