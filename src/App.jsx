import { useState } from "react";
import JobSelectPage from "./pages/JobSelectPage";
import AnswerPage from "./pages/AnswerPage";
import FeedbackPage from "./pages/FeedbackPage";

export default function App() {
  const [step, setStep] = useState("select");
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [result, setResult] = useState(null);

  function handleQuestionsGenerated({ jobTitle, questions }) {
    setJobTitle(jobTitle);
    setQuestions(questions);
  }

  function handleSelectQuestion(question) {
    setSelectedQuestion(question);
    setStep("answer");
  }

  function handleFeedback(data) {
    setResult(data);
    setStep("feedback");
  }

  function handleRestart() {
    setSelectedQuestion("");
    setResult(null);
    setStep("select");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#f1f5f9" }}>
      {/* 🌐 상단 네비게이션 헤더 */}
      <header style={{
        borderBottom: "1px solid #1e293b",
        backgroundColor: "#0f172a",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🎯</span>
          <h1 style={{ fontSize: 20, margin: 0, fontWeight: 700, background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI Interview Coach
          </h1>
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8", backgroundColor: "#1e293b", padding: "6px 12px", borderRadius: 20 }}>
          PRO TIER
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        {step === "select" && (
          <JobSelectPage
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            questions={questions}
            onQuestionsGenerated={handleQuestionsGenerated}
            onSelectQuestion={handleSelectQuestion}
          />
        )}

        {step === "answer" && (
          <AnswerPage
            question={selectedQuestion}
            jobTitle={jobTitle}
            onFeedback={handleFeedback}
            onBack={() => setStep("select")}
          />
        )}

        {step === "feedback" && (
          <FeedbackPage 
            result={result} 
            onRestart={handleRestart} 
          />
        )}
      </main>
    </div>
  );
}