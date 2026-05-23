import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTopicById } from "../../data/learningTopics";
import { useAuth } from "../../context/AuthContext";

export default function TopicDetail() {
  const { profile } = useAuth();
  const { topicId } = useParams();
  const topic = getTopicById(topicId);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
      setLoading(false);

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
            if (token) {
              accumulated += token;
              setAnswer(accumulated);
            }
          } catch { /* incomplete chunk */ }
        }
      }
    } catch {
      setLoading(false);
      setAnswer("Couldn't reach the server. Make sure the backend is running.");
    }
  }

  return (
    <main className="page-content topic-detail">
      <Link to="/learn" className="topic-back">← All topics</Link>
      <div className="section-tag">Learning</div>
      <h1 className="section-title">{topic.icon} {topic.title}</h1>
      <p className="section-sub">{topic.summary}</p>

      <section className="topic-block">
        <h3>Step-by-step</h3>
        <ol className="topic-steps">
          {topic.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <div className="topic-columns">
        <section className="topic-block topic-dos">
          <h3>Do</h3>
          <ul>
            {topic.dos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="topic-block topic-donts">
          <h3>Don&apos;t</h3>
          <ul>
            {topic.donts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
          <button type="submit" className="btn-primary" disabled={loading || !question.trim()}>
            {loading ? "Thinking…" : "Ask"}
          </button>
        </form>
        {loading && (
          <div className="topic-qa-loading">
            <span /><span /><span />
          </div>
        )}
        {answer && (
          <div className="topic-qa-answer">
            <p>{answer}</p>
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
