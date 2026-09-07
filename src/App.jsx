import { useState } from "react";
import JobSelectPage from "./pages/JobSelectPage";
import AnswerPage from "./pages/AnswerPage";
import FeedbackPage from "./pages/FeedbackPage";
import { UsageBar } from "./components/UsageBar";

export default function App() {
  const [step, setStep] = useState("select");
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const [remainingUsage, setRemainingUsage] = useState(20);

  const handleUseQuota = () => {
    setRemainingUsage((prev) => Math.max(0, prev - 1));
  };

  function handleSelectQuestion(data) {
    setSelected(data);
    setStep("answer");
  }

  function handleFeedback(data) {
    setResult(data);
    setStep("feedback");
  }

  function handleRestart() {
    setSelected(null);
    setResult(null);
    setStep("select");
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      {/* 💡 1. 제목 타이틀 복구 */}
      <h1 style={{ marginBottom: 16 }}>AI 면접 코치</h1>

      {/* 💡 2. UsageBar 배치 */}
      <UsageBar remaining={remainingUsage} total={20} />

      {step === "select" && (
        <JobSelectPage
          remainingUsage={remainingUsage}
          onUseQuota={handleUseQuota}
          onSelectQuestion={handleSelectQuestion}
        />
      )}

      {step === "answer" && (
        <AnswerPage
          question={selected.question}
          jobTitle={selected.jobTitle}
          remainingUsage={remainingUsage}
          onUseQuota={handleUseQuota}
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
    </div>
  );
}