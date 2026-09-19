import { useState } from "react";
import { generateQuestions } from "../lib/api";

export default function JobSelectPage({
  jobTitle,
  setJobTitle,
  questions,
  onQuestionsGenerated,
  onSelectQuestion,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!jobTitle.trim()) {
      setError("직무를 입력해 주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await generateQuestions(jobTitle);
      const generatedQuestions = data.questions || [];
      onQuestionsGenerated({ jobTitle, questions: generatedQuestions });
      onUseQuota();
    } catch (err) {
      setError("질문을 불러오지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24 }}>
      <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 8, color: "#f8fafc" }}>
        💼 지원 직무 설정
      </h2>
      <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>
        면접을 준비할 직무를 입력하면 AI가 맞춤형 예상 질문 3개를 추출해 드립니다.
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="예: 백엔드 개발자, 서비스 기획자, 마케터"
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: 15,
            borderRadius: 8,
            border: "1px solid #334155",
            backgroundColor: "#1e293b",
            color: "#fff",
            outline: "none"
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "12px 20px",
            fontSize: 15,
            fontWeight: "bold",
            borderRadius: 8,
            border: "none",
            backgroundColor: loading ? "#475569" : "#2563eb",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "생성 중..." : "질문 생성"}
        </button>
      </div>

      {error && <p style={{ color: "#f87171", fontSize: 14, marginTop: 12 }}>{error}</p>}

      {/* 질문 선택 카드 목록 */}
      {questions.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 16, color: "#cbd5e1", marginBottom: 12 }}>
            📋 연습할 면접 질문을 선택하세요
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {questions.map((q, i) => (
              <div
                key={i}
                onClick={() => onSelectQuestion(q)}
                style={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: "16px",
                  cursor: "pointer",
                  transition: "border-color 0.2s, transform 0.1s",
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#38bdf8"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#334155"}
              >
                <span style={{ backgroundColor: "#0f172a", color: "#38bdf8", fontWeight: "bold", padding: "4px 8px", borderRadius: 6, fontSize: 13 }}>
                  Q{i + 1}
                </span>
                <span style={{ color: "#f1f5f9", fontSize: 15, flex: 1, lineHeight: 1.4 }}>{q}</span>
                <span style={{ color: "#64748b", fontSize: 18 }}>→</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}