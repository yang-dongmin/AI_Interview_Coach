import { useState, useEffect, useRef } from "react";
import { analyzeAnswer } from "../lib/api";
import { InterviewerAvatar } from "../components/InterviewerAvatar";

export default function AnswerPage({ 
  question, 
  jobTitle, 
  onFeedback, 
  onBack 
}) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const baseAnswerRef = useRef("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = "ko-KR";

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

        if (finalTranscript) {
          baseAnswerRef.current += finalTranscript;
        }
        setAnswer(baseAnswerRef.current + interimTranscript);
      };

      recog.onerror = () => setIsListening(false);
      recog.onend = () => setIsListening(false);
      setRecognition(recog);
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeakQuestion = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = "ko-KR";
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Chrome 브라우저 사용을 권장합니다.");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      baseAnswerRef.current = answer ? (answer.trim() + " ") : "";
      recognition.start();
      setIsListening(true);
    }
  };

  async function handleSubmit() {
    if (isSpeaking) window.speechSynthesis.cancel();

    if (!answer.trim()) {
      setError("답변을 입력하거나 음성으로 말씀해 주세요.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const feedback = await analyzeAnswer({ question, answer, jobTitle });
      onFeedback({ question, answer, feedback });
    } catch (err) {
      setError("피드백 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 20 }}>
      {/* 📹 화상 카메라 모니터 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 280,
          backgroundColor: "#020617",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
          border: "1px solid #334155"
        }}
      >
        {/* 상태 태그 */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            color: "#e2e8f0",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(4px)"
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              backgroundColor: isSpeaking ? "#38bdf8" : isListening ? "#ef4444" : "#22c55e",
              borderRadius: "50%",
            }}
          />
          {isSpeaking ? "질문 낭독 중..." : isListening ? "음성 입력 수신 중..." : "AI 수석 면접관 (ON AIR)"}
        </div>

        {/* 🔊 스피커 읽기 버튼 */}
        <button
          type="button"
          onClick={toggleSpeakQuestion}
          title={isSpeaking ? "중지" : "질문 읽기"}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: isSpeaking ? "#ef4444" : "rgba(255, 255, 255, 0.15)",
            color: "#fff",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            cursor: "pointer",
            backdropFilter: "blur(4px)"
          }}
        >
          {isSpeaking ? "⏹️" : "🔊"}
        </button>

        {/* 👨‍💼 면접관 SVG 아바타 */}
        <InterviewerAvatar isListening={isListening} />

        {/* 💬 자막 바 */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            color: "#f8fafc",
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.4,
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(4px)"
          }}
        >
          "{question}"
        </div>
      </div>

      {/* 🎤 내 답변 입력 및 컨트롤 하단 영역 */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: "bold", color: "#cbd5e1" }}>
            {isListening ? "🔴 실시간 음성 수신 중..." : "📝 답변 작성"}
          </span>
          <button 
            onClick={() => {
              if (isSpeaking) window.speechSynthesis.cancel();
              onBack();
            }} 
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}
          >
            ← 뒤로가기
          </button>
        </div>

        <textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            baseAnswerRef.current = e.target.value;
          }}
          placeholder="하단의 마이크 버튼을 눌러 말로 답변하거나 텍스트로 수정하실 수 있습니다."
          rows={5}
          style={{
            width: "100%",
            padding: 14,
            fontSize: 15,
            borderRadius: 10,
            border: isListening ? "2px solid #ef4444" : "1px solid #334155",
            backgroundColor: "#1e293b",
            color: "#fff",
            boxSizing: "border-box",
            outline: "none",
            lineHeight: 1.5
          }}
        />
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={toggleListening}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: isListening ? "#ef4444" : "#0284c7",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
        >
          {isListening ? "🎙️ 마이크 중지" : "🎤 음성 답변 시작"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {loading ? "AI 분석 중..." : "🚀 답변 제출 및 피드백"}
        </button>
      </div>

      {error && <p style={{ color: "#f87171", marginTop: 12, textAlign: "center", fontSize: 14 }}>{error}</p>}
    </div>
  );
}