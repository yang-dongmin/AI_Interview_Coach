import { useState } from "react";
import { generateQuestions } from "../lib/api";

export default function JobSelectPage({ remainingUsage, onUseQuota, onSelectQuestion }) {
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!jobTitle.trim()) {
      setError("직무를 입력해주세요");
      return;
    }

    // 부모에게 전달받은 remainingUsage 체크
    if (remainingUsage <= 0) {
      setError("오늘의 AI 일일 사용량을 모두 소진했습니다.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await generateQuestions(jobTitle);
      setQuestions(data.questions || []);

      // 질문 생성 성공 시 부모의 차감 함수 호출!
      onUseQuota();
    } catch (err) {
      setError("질문을 불러오지 못했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p>지원 직무를 입력하면 예상 질문을 뽑아줄게요.</p>

      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="예: 백엔드 개발자"
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />
      <button 
        onClick={handleGenerate} 
        disabled={loading} 
        style={{ marginTop: 12, padding: "10px 16px" }}
      >
        {loading ? "질문 만드는 중..." : "예상 질문 받기"}
      </button>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

      {questions.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>질문을 골라주세요</h3>
          {questions.map((q, i) => (
            <div
              key={i}
              onClick={() => onSelectQuestion({ question: q, jobTitle })}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
                cursor: "pointer",
              }}
            >
              {q}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}