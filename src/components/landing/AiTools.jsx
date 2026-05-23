export default function AiTools() {
  return (
    <section className="landing-section" id="resources">
      <div className="section-inner">
        <div className="section-tag">Powered by AI</div>
        <h2 className="section-title">Smart support, built with care</h2>
        <p className="section-sub">
          Our AI layer uses carefully structured prompts and safety rules to ensure every
          response is appropriate, calm, and helpful.
        </p>
        <div className="tools-grid">
          <div className="tool-card tool-card-main">
            <div className="tool-inner">
              <div className="tool-icon">💬</div>
              <h3>Contextual Chat AI</h3>
              <p>
                Powered by Claude API, the assistant understands parenting context deeply.
                It won&apos;t give generic answers — it responds to your specific moment,
                child&apos;s age, and emotional state.
              </p>
              <div className="tool-chat-demo">
                <div className="tool-chat-msg msg-user">
                  My 2-year-old won&apos;t sleep and I&apos;ve been up since 4am. I&apos;m losing
                  it.
                </div>
                <div className="tool-chat-msg msg-ai">
                  That sounds genuinely exhausting — being this sleep-deprived is hard. First,
                  are you safe right now? Let&apos;s do one minute of slow breathing together,
                  then I&apos;ll share 3 gentle approaches that work for toddler sleep resistance...
                  🌙
                </div>
              </div>
            </div>
          </div>
          <div className="tool-card tool-card-accent-bg">
            <div className="tool-inner">
              <div className="tool-icon">🏗️</div>
              <h3>FastAPI Backend</h3>
              <p>
                Fast, reliable Python backend handles all requests, manages sessions, and
                coordinates AI responses with low latency.
              </p>
            </div>
          </div>
          <div className="tool-card tool-card-blush-bg">
            <div className="tool-inner">
              <div className="tool-icon">🗄️</div>
              <h3>MongoDB Storage</h3>
              <p>
                Flexible document-based storage saves your history, preferences, and coping
                strategies — always ready when you need them.
              </p>
            </div>
          </div>
          <div className="tool-card">
            <div className="tool-inner">
              <div className="tool-icon">🛡️</div>
              <h3>Safe & Structured Prompts</h3>
              <p>
                Every AI response is guided by carefully designed rules that keep output
                calm, appropriate, and evidence-grounded.
              </p>
            </div>
          </div>
          <div className="tool-card">
            <div className="tool-inner">
              <div className="tool-icon">🔄</div>
              <h3>Iterative & Adaptive</h3>
              <p>
                The app learns from your interactions, surfacing strategies you&apos;ve found
                helpful and adapting to your family&apos;s patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
