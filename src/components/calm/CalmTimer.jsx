import { useEffect, useState } from "react";

export default function CalmTimer({ seconds, label, onComplete }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRemaining(seconds);
    setRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          setRunning(false);
          onComplete?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, remaining, onComplete]);

  const progress = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="calm-timer">
      <p className="calm-timer-label">{label}</p>
      <div className="calm-timer-ring">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className="timer-track" />
          <circle
            cx="60"
            cy="60"
            r="52"
            className="timer-progress"
            style={{
              strokeDasharray: `${2 * Math.PI * 52}`,
              strokeDashoffset: `${2 * Math.PI * 52 * (1 - progress / 100)}`,
            }}
          />
        </svg>
        <span className="calm-timer-value">{remaining}s</span>
      </div>
      <button
        type="button"
        className={running ? "btn-secondary" : "btn-primary"}
        onClick={() => {
          if (running) {
            setRunning(false);
            setRemaining(seconds);
          } else {
            setRemaining(seconds);
            setRunning(true);
          }
        }}
      >
        {running ? "Reset" : "Start"}
      </button>
    </div>
  );
}
