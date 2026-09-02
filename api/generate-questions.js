// 직무명을 받아서 예상 면접 질문 3개를 생성하는 API
// 프론트에서는 /api/generate-questions 로 호출됨 (Vercel이 자동 라우팅)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 허용됩니다" });
  }

  const { jobTitle } = req.body;

  if (!jobTitle || typeof jobTitle !== "string") {
    return res.status(400).json({ error: "jobTitle이 필요합니다" });
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
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `너는 채용 면접 전문가야. "${jobTitle}" 직무 면접에서 실제로 자주 나오는 질문 3개를 뽑아줘.
반드시 아래 JSON 형식으로만 답해줘. 다른 설명은 붙이지 마.

{"questions": ["질문1", "질문2", "질문3"]}`,
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

    // LLM이 JSON 형태로 답한 걸 파싱 (혹시 모를 ```json 코드펜스 제거)
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("서버 오류:", err);
    return res.status(500).json({ error: "질문 생성 중 오류가 발생했습니다" });
  }
}
