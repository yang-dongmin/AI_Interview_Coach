import React, { useState } from "react";

export default function FeedbackPage({ result, onRestart }) {
  const { question, answer, feedback } = result;
  const { goodPoint, improvements, improvedAnswer } = feedback;
  
  const [copied, setCopied] = useState(false);

  // 📋 피드백 결과 클립보드 복사 함수
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
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>피드백 결과</h2>
        
        {/* 📋 복사하기 버튼 */}
        <button
          onClick={handleCopy}
          style={{
            padding: "6px 12px",
            backgroundColor: copied ? "#52c41a" : "#1890ff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: "bold",
            transition: "background-color 0.2s"
          }}
        >
          {copied ? "✓ 복사 완료!" : "📋 결과 복사하기"}
        </button>
      </div>

      <p style={{ color: "#666", fontSize: 15, fontWeight: "bold", marginTop: 8 }}>
        질문: {question}
      </p>

      {/* ✅ 잘한 점 */}
      <section style={{ marginTop: 20 }}>
        <h4 style={{ color: "#2e7d32", marginBottom: 6 }}>✅ 잘한 점</h4>
        <p style={{ background: "#f1f8e9", padding: 12, borderRadius: 8, margin: 0, lineHeight: 1.5 }}>
          {goodPoint}
        </p>
      </section>

      {/* 💡 개선점 */}
      <section style={{ marginTop: 20 }}>
        <h4 style={{ color: "#d32f2f", marginBottom: 6 }}>💡 개선점</h4>
        <ul style={{ background: "#ffebee", padding: "12px 12px 12px 28px", borderRadius: 8, margin: 0, lineHeight: 1.6 }}>
          {improvements.map((item, i) => (
            <li key={i} style={{ marginBottom: i === improvements.length - 1 ? 0 : 6 }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* 📝 Before (내 답변) */}
      <section style={{ marginTop: 20 }}>
        <h4 style={{ color: "#555", marginBottom: 6 }}>📝 내 답변 (Before)</h4>
        <p style={{ background: "#f5f5f5", padding: 12, borderRadius: 8, margin: 0, lineHeight: 1.5 }}>
          {answer}
        </p>
      </section>

      {/* ✨ After (개선된 답변 예시) */}
      <section style={{ marginTop: 20 }}>
        <h4 style={{ color: "#1565c0", marginBottom: 6 }}>✨ 개선된 답변 예시 (After)</h4>
        <p style={{ background: "#e3f2fd", padding: 12, borderRadius: 8, margin: 0, lineHeight: 1.5 }}>
          {improvedAnswer}
        </p>
      </section>

      {/* 🔄 재시도 버튼 */}
      <button
        onClick={onRestart}
        style={{
          width: "100%",
          marginTop: 28,
          padding: "12px 16px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        다른 질문 연습하기
      </button>
    </div>
  );
}