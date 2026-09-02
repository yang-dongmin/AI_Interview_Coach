// 면접 질문 + 사용자 답변을 받아서 AI 면접관 피드백을 생성하는 API
// 프론트에서는 /api/analyze-answer 로 호출됨

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 허용됩니다" });
  }

  const { question, answer, jobTitle } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "question과 answer가 필요합니다" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `너는 15년차 채용 면접관이야. 아래 면접 질문과 지원자의 답변을 보고 평가해줘.

직무: ${jobTitle || "일반"}
질문: ${question}
답변: ${answer}

평가 기준:
1. 구조 - 두괄식으로 결론부터 말했는가
2. 구체성 - 숫자나 사례가 있는가, 뭉뚱그리지 않았는가
3. 직무 연관성 - 답변이 지원 직무와 잘 연결되는가

반드시 아래 JSON 형식으로만 답해줘. 다른 설명은 붙이지 마.

{
  "goodPoint": "잘한 점 한 가지",
  "improvements": ["개선점1", "개선점2"],
  "improvedAnswer": "개선된 답변 예시 전체"
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API 오류:", errText);
      return res.status(502).json({ error: "LLM 호출에 실패했습니다" });
    }

    const data = await response.json();
    const rawText = data.content[0].text;

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("서버 오류:", err);
    return res.status(500).json({ error: "답변 분석 중 오류가 발생했습니다" });
  }
}
