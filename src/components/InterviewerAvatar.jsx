import React from "react";

export function InterviewerAvatar({ isListening }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* 마이크 활성화 시 나타나는 녹음 파동 애니메이션 효과 */}
      {isListening && (
        <div
          style={{
            position: "absolute",
            top: -6,
            left: -6,
            right: -6,
            bottom: -6,
            borderRadius: "50%",
            border: "2px solid #ff4d4f",
            animation: "pulse 1.5s infinite ease-in-out",
          }}
        />
      )}

      {/* 👨‍💼 정장 차림의 면접관 SVG 캐릭터 */}
      <svg
        width="96"
        height="96"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          borderRadius: "50%",
          backgroundColor: "#334155",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {/* 원형 배경 */}
        <circle cx="50" cy="50" r="50" fill="#1e293b" />
        {/* 머리 */}
        <circle cx="50" cy="38" r="16" fill="#f8fafc" />
        {/* 몸통/정장 상의 */}
        <path
          d="M 22 88 C 22 65, 32 58, 50 58 C 68 58, 78 65, 78 88 Z"
          fill="#0f172a"
        />
        {/* 셔츠 */}
        <path d="M 42 58 L 50 75 L 58 58 Z" fill="#ffffff" />
        {/* 넥타이 */}
        <path d="M 48 62 L 52 62 L 51 78 L 49 78 Z" fill="#2563eb" />
      </svg>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}