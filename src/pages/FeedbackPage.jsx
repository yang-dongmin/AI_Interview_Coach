export default function FeedbackPage({ result, onRestart }) {
  const { question, answer, feedback } = result;
  const { goodPoint, improvements, improvedAnswer } = feedback;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <h2>피드백 결과</h2>
      <p style={{ color: "#666" }}>{question}</p>

      <section style={{ marginTop: 16 }}>
        <h4>잘한 점</h4>
        <p>{goodPoint}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>개선점</h4>
        <ul>
          {improvements.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Before (내 답변)</h4>
        <p style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>{answer}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>After (개선된 답변)</h4>
        <p style={{ background: "#e8f5e9", padding: 12, borderRadius: 8 }}>{improvedAnswer}</p>
      </section>

      <button onClick={onRestart} style={{ marginTop: 24, padding: "10px 16px" }}>
        다른 질문 연습하기
      </button>
    </div>
  );
}
