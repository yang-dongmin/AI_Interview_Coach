import { useState, useEffect, useRef } from "react";
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
  
  // 🎤 음성 인식(STT) 관련 상태
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // 음성 시작 전 기존 답변을 기억하기 위한 Ref
  const baseAnswerRef = useRef("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;     // 연속 인식
      recog.interimResults = true; // 실시간 결과 처리
      recog.lang = "ko-KR";        // 한국어 설정

      recog.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // 확정된 텍스트는 기존 텍스트에 지속 누적
        if (finalTranscript) {
          baseAnswerRef.current += finalTranscript;
        }

        // 실시간(interim) 텍스트는 기존 텍스트 뒤에 가볍게 붙여서 보여줌
        setAnswer(baseAnswerRef.current + interimTranscript);
      };

      recog.onerror = (err) => {
        console.error("음성 인식 오류:", err);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, []);

  // 마이크 토글 버튼
  const toggleListening = () => {
    if (!recognition) {
      alert("현재 브라우저는 음성 인식을 지원하지 않습니다. (Chrome 권장)");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      // 음성 인식을 시작할 때 현재 텍스트 박스 상태를 기준점으로 저장
      baseAnswerRef.current = answer ? (answer.trim() + " ") : "";
      recognition.start();
      setIsListening(true);
    }
  };

  async function handleSubmit() {
    if (!answer.trim()) {
      setError("답변을 입력해주세요");
      return;
    }

    if (remainingUsage <= 0) {
      setError("오늘의 AI 일일 사용량을 모두 소진했습니다.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const feedback = await analyzeAnswer({ question, answer, jobTitle });
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

      <div style={{ position: "relative", marginBottom: 12 }}>
        <textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            baseAnswerRef.current = e.target.value; // 사용자가 타이핑으로 수정한 내용도 반영
          }}
          placeholder="답변을 입력하거나 마이크 버튼을 눌러 말해보세요."
          rows={8}
          style={{ width: "100%", padding: 10, fontSize: 16 }}
        />
        
        <button
          type="button"
          onClick={toggleListening}
          style={{
            marginTop: 8,
            padding: "8px 14px",
            backgroundColor: isListening ? "#ff4d4f" : "#4bc0c0",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isListening ? "🎙️ 음성 인식 중지" : "🎤 마이크로 답변하기"}
        </button>
      </div>

      <button onClick={handleSubmit} disabled={loading} style={{ marginTop: 12, padding: "10px 16px" }}>
        {loading ? "분석 중..." : "피드백 받기"}
      </button>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
    </div>
  );
}