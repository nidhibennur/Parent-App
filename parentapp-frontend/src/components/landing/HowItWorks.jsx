const steps = [
  {
    n: 1,
    title: "Describe what's happening",
    text: "Tell the app what's going on — your child's behavior, how you're feeling, any context. The more you share, the better the guidance.",
  },
  {
    n: 2,
    title: "Get personalized AI guidance",
    text: "The AI analyzes your situation and generates immediate, safe, and age-appropriate strategies. It draws from evidence-based parenting research.",
  },
  {
    n: 3,
    title: "Use the tools & track progress",
    text: "Follow guided exercises, save what works, and watch your confidence grow over time. The system learns your preferences and adapts.",
  },
  {
    n: 4,
    title: "Learn between the hard moments",
    text: "Browse the resource library, take short lessons on child development, and build a toolkit you'll be ready to use next time.",
  },
];

export default function HowItWorks() {
  return (
    <section className="landing-section how-bg" id="how-it-works">
      <div className="section-inner">
        <div className="section-tag">How it works</div>
        <h2 className="section-title">
          From chaos to calm
          <br />
          in three steps
        </h2>
        <div className="steps-wrap">
          <div className="steps-list">
            {steps.map((s) => (
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-text">
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-mock">
            <div className="dash-header">
              <span className="dash-header-title">🌿 Your Dashboard</span>
              <div className="dash-header-right">
                <div className="dash-dot" />
                <div className="dash-dot" />
                <div className="dash-dot" />
              </div>
            </div>
            <div className="dash-body">
              <div className="dash-row">
                <div className="dash-metric">
                  <div className="dash-metric-num">12</div>
                  <div className="dash-metric-label">Sessions this month</div>
                </div>
                <div className="dash-metric">
                  <div className="dash-metric-num">7🔥</div>
                  <div className="dash-metric-label">Day streak</div>
                </div>
                <div className="dash-metric">
                  <div className="dash-metric-num">94%</div>
                  <div className="dash-metric-label">Calmer outcomes</div>
                </div>
              </div>
              <div className="dash-tip">
                <div className="dash-tip-label">💡 Today&apos;s Tip</div>
                <p>
                  When your toddler melts down, try narrating their feelings aloud.
                  &quot;You&apos;re really upset that we had to stop playing.&quot; It validates
                  without escalating.
                </p>
              </div>
              <div>
                <div className="dash-res-title">Saved Resources</div>
                <div className="dash-res-item">
                  <span>🎥</span>
                  <span className="dash-res-text">5-4-3-2-1 Grounding Technique</span>
                  <span className="dash-res-tag">Calm</span>
                </div>
                <div className="dash-res-item">
                  <span>📄</span>
                  <span className="dash-res-text">Understanding Toddler Tantrums</span>
                  <span className="dash-res-tag">Learn</span>
                </div>
                <div className="dash-res-item">
                  <span>🧘</span>
                  <span className="dash-res-text">Box Breathing for Caregivers</span>
                  <span className="dash-res-tag">Calm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
