export const LEARNING_TOPICS = [
  {
    id: "why-babies-cry",
    title: "Why babies cry",
    summary: "Understand common causes and how to respond with calm presence.",
    icon: "👶",
    accent: "sage",
    dos: [
      "Check basic needs: hunger, diaper, temperature, sleep.",
      "Hold your baby and use a calm, low voice.",
      "Take breaks if you feel overwhelmed — place baby safely and breathe.",
    ],
    donts: [
      "Don't shake a baby — ever.",
      "Don't blame yourself; crying is communication.",
      "Don't ignore your own need for support.",
    ],
    steps: [
      "Pause and breathe slowly for 10 seconds.",
      "Run through a quick needs checklist.",
      "Try gentle motion, swaddling, or white noise.",
      "If crying persists, contact your pediatrician for guidance.",
    ],
  },
  {
    id: "handling-tantrums",
    title: "Handling tantrums",
    summary: "Stay grounded while your child processes big emotions.",
    icon: "🌪️",
    accent: "blush",
    dos: [
      "Stay nearby and keep your voice calm.",
      "Name the feeling: \"You're really upset right now.\"",
      "Wait for the peak to pass before problem-solving.",
    ],
    donts: [
      "Don't negotiate in the middle of the meltdown.",
      "Don't use shame or threats.",
      "Don't take behavior personally.",
    ],
    steps: [
      "Ensure the environment is safe.",
      "Lower your body to their eye level if possible.",
      "Validate the emotion without giving in to unsafe demands.",
      "Offer a simple choice once they begin to settle.",
    ],
  },
  {
    id: "sleep-issues",
    title: "Sleep issues",
    summary: "Gentle routines when bedtime becomes a battle.",
    icon: "🌙",
    accent: "sky",
    dos: [
      "Keep a predictable wind-down routine.",
      "Dim lights and reduce stimulation 30–60 minutes before bed.",
      "Respond consistently so expectations are clear.",
    ],
    donts: [
      "Don't introduce new habits only on hard nights.",
      "Don't use screens right before sleep.",
      "Don't expect instant change — sleep skills take time.",
    ],
    steps: [
      "Note what happened today (naps, sugar, stress).",
      "Use the same 3–4 step bedtime sequence each night.",
      "If they resist, stay calm and brief — repeat the routine.",
      "Track patterns for a week before big changes.",
    ],
  },
  {
    id: "feeding-problems",
    title: "Feeding problems",
    summary: "Reduce mealtime stress with structure and patience.",
    icon: "🍼",
    accent: "lemon",
    dos: [
      "Offer food without pressure to \"finish everything.\"",
      "Eat together when you can — modeling matters.",
      "Consult your pediatrician for growth or allergy concerns.",
    ],
    donts: [
      "Don't use food as reward or punishment.",
      "Don't force bites — it increases resistance.",
      "Don't compare your child to others.",
    ],
    steps: [
      "Serve small portions; let them ask for more.",
      "Keep mealtimes predictable and screen-free.",
      "Stay neutral if they refuse — try again later.",
      "Log patterns if refusal lasts several days.",
    ],
  },
  {
    id: "emotional-regulation",
    title: "Emotional regulation tips",
    summary: "Co-regulate so your child learns safety in hard moments.",
    icon: "💚",
    accent: "lavender",
    dos: [
      "Regulate yourself first — children mirror your nervous system.",
      "Practice short resets throughout the day.",
      "Celebrate small wins after difficult moments.",
    ],
    donts: [
      "Don't expect self-control before the brain is ready.",
      "Don't lecture during peak emotion.",
      "Don't skip repair after you lose your patience.",
    ],
    steps: [
      "Notice your own stress signals early.",
      "Use a 30-second reset (see Calm Tools).",
      "Name emotions for yourself and your child.",
      "Repair with warmth once everyone is calm.",
    ],
  },
  {
    id: "building-independence",
    title: "Building independence",
    summary: "Let your child do more — age-appropriate autonomy builds confidence.",
    icon: "🌱",
    accent: "rose",
    dos: [
      "Offer choices so they feel in control of small decisions.",
      "Let them struggle a little before stepping in — that's where learning happens.",
      "Praise the effort and process, not just the result.",
    ],
    donts: [
      "Don't take over tasks they could attempt themselves.",
      "Don't rescue immediately — pause and observe first.",
      "Don't compare their pace to other children.",
    ],
    steps: [
      "Pick one daily task to hand over fully (dressing, tidying a toy).",
      "Step back and resist the urge to correct immediately.",
      "Acknowledge what they did right before suggesting improvements.",
      "Gradually increase responsibility as confidence grows.",
    ],
  },
];

export function getTopicById(id) {
  return LEARNING_TOPICS.find((t) => t.id === id);
}
