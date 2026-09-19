import React, { useState } from "react";

export default function FeedbackPage({ result, onRestart }) {
  const { question, answer, feedback } = result;
  const { goodPoint, improvements, improvedAnswer } = feedback;
  
  const [copied, setCopied] = useState(false);

  // 📋 피드백 결과 클립보드 복사
  const handleCopy = () => {
    const textToCopy = `[AI 면접 피드백 결과]

📌 면접 질문
${question}

✅ 잘한 점
${goodPoint}

💡 개선점
${improvements.map((item, idx) => `${idx + 1}.${item}`).join("\n")}

📝 내 답변 (Before)
${answer}

✨ 개선된 답변 예시 (After)
${improvedAnswer}
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24, color: "#f8fafc" }}>
      {/* 헤더 영역 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, margin: 0, color: "#f8fafc", fontWeight: "bold" }}>피드백 결과</h2>
        
        <button
          onClick={handleCopy}
          style={{
            padding: "8px 14px",
            backgroundColor: copied ? "#22c55e" : "#0284c7",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: "bold",
            transition: "all 0.2s"
          }}
        >
          {copied ? "✓ 결과 복사됨" : "📋 결과 복사하기"}
        </button>
      </div>

      {/* 질문 타이틀 */}
      <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
        <strong style={{ color: "#38bdf8" }}>질문:</strong> {question}
      </p>

      {/* ✅ 잘한 점 */}
      <section style={{ marginTop: 20 }}>
        <h4 style={{ color: "#4ade80", fontSize: 15, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span>✅</span> 잘한 점
        </h4>
        <div style={{ backgroundColor: "#064e3b", border: "1px solid #047857", color: "#ecfdf5", padding: 14, borderRadius: 10, fontSize: 14, lineHeight: 1.6 }}>
          {goodPoint}
        </div>
      </section>

      {/* 💡 개선점 */}
      <section style={{ marginTop: 20 }}>
        <h4 style={{ color: "#f87171", fontSize: 15, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span>💡</span> 개선점
        </h4>
        <ul style={{ backgroundColor: "#450a0a", border: "1px solid #991b1b", color: "#fef2f2", padding: "14px 14px 14px 32px", borderRadius: 10, margin: 0, fontSize: 14, lineHeight: 1.7 }}>
          {improvements.map((item, i) => (
            <li key={i} style={{ marginBottom: i === improvements.length - 1 ? 0 : 8 }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* 📝 내 답변 (Before) */}
      <section style={{ marginTop: 20 }}>
        <h4 style={{ color: "#cbd5e1", fontSize: 15, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span>📝</span> 내 답변 (Before)
        </h4>
        <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0", padding: 14, borderRadius: 10, fontSize: 14, lineHeight: 1.6 }}>
          {answer}
        </div>
      </section>

      {/* ✨ 개선된 답변 예시 (After) */}
      <section style={{ marginTop: 20 }}>
        <h4 style={{ color: "#60a5fa", fontSize: 15, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span>✨</span> 개선된 답변 예시 (After)
        </h4>
        <div style={{ backgroundColor: "#1e3a8a", border: "1px solid #1d4ed8", color: "#eff6ff", padding: 14, borderRadius: 10, fontSize: 14, lineHeight: 1.6 }}>
          {improvedAnswer}
        </div>
      </section>

      {/* 🔄 다른 질문 연습하기 버튼 */}
      <button
        onClick={onRestart}
        style={{
          width: "100%",
          marginTop: 28,
          padding: "14px",
          backgroundColor: "#334155",
          color: "#ffffff",
          border: "none",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#475569"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#334155"}
      >
        다른 질문 연습하기
      </button>
    </div>
  );
}