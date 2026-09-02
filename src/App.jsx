import { useState } from "react";
import JobSelectPage from "./pages/JobSelectPage";
import AnswerPage from "./pages/AnswerPage";
import FeedbackPage from "./pages/FeedbackPage";

// step: "select" -> "answer" -> "feedback"
export default function App() {
  const [step, setStep] = useState("select");
  const [selected, setSelected] = useState(null); // { question, jobTitle }
  const [result, setResult] = useState(null); // { question, answer, feedback }

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

  if (step === "answer") {
    return (
      <AnswerPage
        question={selected.question}
        jobTitle={selected.jobTitle}
        onFeedback={handleFeedback}
        onBack={() => setStep("select")}
      />
    );
  }

  if (step === "feedback") {
    return <FeedbackPage result={result} onRestart={handleRestart} />;
  }

  return <JobSelectPage onSelectQuestion={handleSelectQuestion} />;
}
