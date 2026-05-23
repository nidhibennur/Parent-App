import { useEffect, useState } from "react";

const PHASES = [
  { label: "Breathe in", duration: 4 },
  { label: "Hold", duration: 4 },
  { label: "Breathe out", duration: 4 },
  { label: "Hold", duration: 4 },
];

export default function BreathingAnimation({ active }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!active) {
      setPhaseIndex(0);
      setScale(1);
      return;
    }

    const phase = PHASES[phaseIndex];
    const inhale = phase.label === "Breathe in";
    const exhale = phase.label === "Breathe out";
    setScale(inhale ? 1.15 : exhale ? 0.85 : 1);

    const timer = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, phase.duration * 1000);

    return () => clearTimeout(timer);
  }, [active, phaseIndex]);

  if (!active) {
    return (
      <div className="breathing-idle">
        <div className="breathing-circle idle">🌬️</div>
        <p>Press start to begin box breathing</p>
      </div>
    );
  }

  return (
    <div className="breathing-active">
      <div
        className="breathing-circle"
        style={{ transform: `scale(${scale})` }}
      />
      <p className="breathing-phase">{PHASES[phaseIndex].label}</p>
      <p className="breathing-hint">Follow the circle — 4 seconds each phase</p>
    </div>
  );
}
