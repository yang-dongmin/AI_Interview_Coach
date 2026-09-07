export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 허용됩니다" });
  }

  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "question과 answer가 필요합니다" });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API 키가 설정되지 않았습니다." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `너는 채용 면접 전문가이자 코치야. 
면접 질문: "${question}"
지원자 답변: "${answer}"

위 답변을 분석해서 잘한 점 1가지, 개선점 2가지, 그리고 개선된 답변 예시를 작성해 줘.`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                goodPoint: { 
                  type: "STRING", 
                  description: "잘한 점 1가지" 
                },
                improvements: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "개선점 2가지 리스트",
                },
                improvedAnswer: { 
                  type: "STRING", 
                  description: "Before-After용 개선된 답변 예시" 
                },
              },
              required: ["goodPoint", "improvements", "improvedAnswer"],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error Response:", errText);
      return res.status(response.status).json({ error: "Gemini API 호출 실패", details: errText });
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(resultText);

    return res.status(200).json(parsedData);
  } catch (err) {
    console.error("서버 분석 오류:", err);
    return res.status(500).json({
      error: "답변 분석 중 오류가 발생했습니다",
      details: err.message || err,
    });
  }
}

export default async function handler(req, res) {
  // 1. AI API 호출 및 결과 수령
  // ... LLM 처리 로직 ...

  // 2. 남은 사용량 계산 또는 헤더/DB에서 조회
  const remainingUsage = 85; // 예: 100회 중 85회 남음 (또는 토큰 퍼센티지)

  // 3. 결과와 함께 잔여량 반환
  res.status(200).json({
    result: aiAnalysisResult,
    usage: {
      remaining: remainingUsage,
      total: 100
    }
  });
}