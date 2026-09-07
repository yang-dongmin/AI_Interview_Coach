import { useState } from "react";
import { analyzeAnswer } from "../lib/api";

export default function AnswerPage({ 
  question, 
  jobTitle, 
  remainingUsage, 
  onUseQuota, 
  onFeedback, 
  onBack 
}) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!answer.trim()) {
      setError("답변을 입력해주세요");
      return;
    }

    // 1. 남은 사용량 체크 (0회 이하 차단)
    if (remainingUsage <= 0) {
      setError("오늘의 AI 일일 사용량을 모두 소진했습니다.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const feedback = await analyzeAnswer({ question, answer, jobTitle });
      
      // 2. 피드백 받기 성공 시 1회 차감!
      if (onUseQuota) onUseQuota();

      onFeedback({ question, answer, feedback });
    } catch (err) {
      setError("피드백 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
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

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
    </div>
  );
}