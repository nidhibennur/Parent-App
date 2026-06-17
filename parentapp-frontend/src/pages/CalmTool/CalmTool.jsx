import { useState } from "react";
import { Link } from "react-router-dom";
import BreathingAnimation from "../../components/calm/BreathingAnimation";
import CalmTimer from "../../components/calm/CalmTimer";

const PROMPTS = [
  "Notice your feet on the floor.",
  "Relax your shoulders away from your ears.",
  "You are safe in this moment.",
  "Your child needs your calm, not perfection.",
  "This feeling will pass. You've handled hard moments before.",
  "Take up space. You are allowed to breathe.",
];

const CalmTool = () => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);

  return (
    <main className="page-content calm-tools-page">
      <div className="section-tag">Calm Tools</div>
      <h1 className="section-title">Regulate before you respond</h1>
      <p className="section-sub">
        Even 30 seconds of calm changes how you show up. Use what works for you.
      </p>

      {/* Tool 01 — Box breathing */}
      <section className="calm-tool-panel calm-panel--breathe">
        <div className="calm-panel-header">
          <span className="calm-panel-num">01</span>
          <div>
            <h3 className="calm-panel-title">Box breathing</h3>
            <p className="calm-panel-sub">4 sec in · 4 hold · 4 out · 4 hold</p>
          </div>
        </div>
        <BreathingAnimation active={breathingActive} />
        <button
          type="button"
          className={breathingActive ? "btn-secondary" : "btn-primary"}
          style={{ marginTop: 20 }}
          onClick={() => setBreathingActive((a) => !a)}
        >
          {breathingActive ? "Stop" : "Start breathing"}
        </button>
      </section>

      {/* Tool 02 — Reset timers */}
      <section className="calm-tool-panel calm-panel--timers">
        <div className="calm-panel-header">
          <span className="calm-panel-num">02</span>
          <div>
            <h3 className="calm-panel-title">Reset timers</h3>
            <p className="calm-panel-sub">Step away. Give yourself a moment.</p>
          </div>
        </div>
        <div className="calm-timers-row">
          <CalmTimer
            seconds={30}
            label="30-second reset"
            onComplete={() => setPromptIndex((i) => (i + 1) % PROMPTS.length)}
          />
          <CalmTimer seconds={60} label="1-minute pause" />
        </div>
      </section>

      {/* Tool 03 — Grounding prompt */}
      <section className="calm-tool-panel calm-panel--prompt">
        <div className="calm-panel-header">
          <span className="calm-panel-num">03</span>
          <div>
            <h3 className="calm-panel-title">Grounding prompt</h3>
            <p className="calm-panel-sub">A small reminder to bring you back.</p>
          </div>
        </div>
        <blockquote className="relaxation-prompt">
          {PROMPTS[promptIndex]}
        </blockquote>
        <div className="calm-prompt-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setPromptIndex((i) => (i + 1) % PROMPTS.length)}
          >
            Next prompt
          </button>
        </div>
      </section>

      <div className="calm-chat-cta">
        <Link to="/" className="btn-secondary">
          💬 Still need support? Talk to AI →
        </Link>
      </div>
    </main>
  );
};

export default CalmTool;
