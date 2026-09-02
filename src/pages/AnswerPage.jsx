import { useState } from "react";
import { analyzeAnswer } from "../lib/api";

export default function AnswerPage({ question, jobTitle, onFeedback, onBack }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!answer.trim()) {
      setError("답변을 입력해주세요");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const feedback = await analyzeAnswer({ question, answer, jobTitle });
      onFeedback({ question, answer, feedback });
    } catch (err) {
      setError("피드백 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <button onClick={onBack} style={{ marginBottom: 16 }}>
        ← 뒤로
      </button>
      <h2>{question}</h2>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="답변을 입력하세요"
        rows={8}
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />

      <button onClick={handleSubmit} disabled={loading} style={{ marginTop: 12, padding: "10px 16px" }}>
        {loading ? "분석 중..." : "피드백 받기"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
