// 백엔드 서버리스 함수(api/*.js)를 호출하는 함수들
// 컴포넌트에서는 fetch를 직접 쓰지 않고 이 함수들만 import해서 사용

export async function generateQuestions(jobTitle) {
  const res = await fetch("/api/generate-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobTitle }),
  });

  if (!res.ok) {
    throw new Error("질문 생성에 실패했습니다");
  }

  return res.json(); // { questions: [...] }
}

export async function analyzeAnswer({ question, answer, jobTitle }) {
  const res = await fetch("/api/analyze-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer, jobTitle }),
  });

  if (!res.ok) {
    throw new Error("답변 분석에 실패했습니다");
  }

  return res.json(); // { goodPoint, improvements, improvedAnswer }
}
