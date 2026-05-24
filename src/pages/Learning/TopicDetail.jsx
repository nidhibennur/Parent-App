import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getTopicById } from "../../data/learningTopics";
import { useAuth } from "../../context/AuthContext";

async function fetchTopicContent(topic, profile) {
  const res = await fetch("http://localhost:4000/api/topic-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic_id: topic.id,
      topic_title: topic.title,
      topic_summary: topic.summary,
      profile,
    }),
  });
  if (!res.ok) throw new Error("server error");
  return res.json();
}

function Skeleton({ className = "" }) {
  return <div className={`topic-skeleton ${className}`} />;
}

export default function TopicDetail() {
  const { profile } = useAuth();
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = getTopicById(topicId);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [qaLoading, setQaLoading] = useState(false);

  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    setContent(null);
    fetchTopicContent(topic, profile)
      .then(setContent)
      .catch(() => {
        // Fall back to static data
        setContent({
          overview: topic.summary,
          steps: topic.steps,
          dos: topic.dos,
          donts: topic.donts,
          keyTakeaway: null,
        });
      })
      .finally(() => setLoading(false));
  }, [topicId]);

  if (!topic) {
    return (
      <main className="page-content">
        <h1 className="section-title">Topic not found</h1>
        <Link to="/learn" className="btn-primary">Back to Learning</Link>
      </main>
    );
  }

  const chatParams = new URLSearchParams({
    prompt: `I want help with: ${topic.title}. Please give step-by-step guidance.`,
    topic: topic.id,
  });

  async function askQuestion(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setQaLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:4000/api/topic-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_title: topic.title,
          topic_summary: topic.summary,
          question: question.trim(),
          profile,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      setQaLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const token = JSON.parse(raw).choices?.[0]?.delta?.content ?? "";
            if (token) { accumulated += token; setAnswer(accumulated); }
          } catch { /* incomplete chunk */ }
        }
      }
    } catch {
      setQaLoading(false);
      setAnswer("Couldn't reach the server. Make sure the backend is running.");
    }
  }

  return (
    <main className="page-content topic-detail">
      <Link to="/learn" className="topic-back">← All topics</Link>

      {/* Hero */}
      <div className="topic-hero">
        <div className="topic-hero-icon">{topic.icon}</div>
        <div>
          <div className="section-tag">Learning</div>
          <h1 className="topic-hero-title">{topic.title}</h1>
          {loading ? (
            <Skeleton className="topic-skel-overview" />
          ) : (
            <p className="topic-hero-overview">{content.overview}</p>
          )}
        </div>
      </div>

      {/* Key takeaway pill */}
      {!loading && content?.keyTakeaway && (
        <div className="topic-takeaway">
          <span className="topic-takeaway-label">✦ Key insight</span>
          <span>{content.keyTakeaway}</span>
        </div>
      )}
      {loading && <Skeleton className="topic-skel-takeaway" />}

      {/* Steps */}
      <section className="topic-block topic-block-steps">
        <h3 className="topic-block-heading">
          <span className="topic-block-num">Step by step</span>
        </h3>
        {loading ? (
          <div className="topic-skel-list">
            {[1,2,3,4].map((i) => <Skeleton key={i} className="topic-skel-line" />)}
          </div>
        ) : (
          <ol className="topic-steps-list">
            {content.steps.map((step, i) => (
              <li key={i} className="topic-step-item">
                <span className="topic-step-badge">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Do / Don't */}
      <div className="topic-columns">
        <section className="topic-block topic-dos">
          <h3 className="topic-block-heading">✓ Do</h3>
          {loading ? (
            <div className="topic-skel-list">
              {[1,2,3].map((i) => <Skeleton key={i} className="topic-skel-line" />)}
            </div>
          ) : (
            <ul className="topic-checklist">
              {content.dos.map((item, i) => (
                <li key={i} className="topic-checklist-item topic-do-item">
                  <span className="topic-check-icon">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="topic-block topic-donts">
          <h3 className="topic-block-heading">✕ Don&apos;t</h3>
          {loading ? (
            <div className="topic-skel-list">
              {[1,2,3].map((i) => <Skeleton key={i} className="topic-skel-line" />)}
            </div>
          ) : (
            <ul className="topic-checklist">
              {content.donts.map((item, i) => (
                <li key={i} className="topic-checklist-item topic-dont-item">
                  <span className="topic-check-icon">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* AI Q&A */}
      <section className="topic-qa">
        <h3 className="topic-qa-title">✨ Ask about this topic</h3>
        <p className="topic-qa-sub">
          Have a specific question about {topic.title.toLowerCase()}? Ask the AI directly.
        </p>
        <form className="topic-qa-form" onSubmit={askQuestion}>
          <input
            type="text"
            className="topic-qa-input"
            placeholder={`e.g. "My child is 2, will this work for them?"`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={qaLoading || !question.trim()}>
            {qaLoading ? "Thinking…" : "Ask"}
          </button>
        </form>
        {qaLoading && (
          <div className="topic-qa-loading">
            <span /><span /><span />
          </div>
        )}
        {answer && (
          <div className="topic-qa-answer gpt-markdown">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )}
      </section>

      <div className="topic-actions">
        <Link to={`/?${chatParams.toString()}`} className="btn-primary">
          Get AI help on this topic →
        </Link>
        <Link to="/calm-tools" className="btn-secondary">
          Open Calm Tools
        </Link>
      </div>
    </main>
  );
}
