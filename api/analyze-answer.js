// api/analyze-answer.js

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

  // 💡 과학기술정보통신부 AI-Hub '채용면접 인터뷰 데이터셋(ckmk_d_ict_f_e_111384)' 기반 Few-Shot 프롬프트 주입
  const prompt = `너는 전문 채용 면접관이자 피드백 코치야. 
아래 제시된 [AI-Hub 실제 채용면접 평가 가이드라인 예시]의 평가 톤앤매너와 구조적 기준을 참고해서, 지원자의 실제 면접 답변을 객관적이고 구체적으로 평가해 줘.

[AI-Hub 실제 채용면접 평가 가이드라인 예시]
- 면접 질문: "저희 회사에 들어오시게 된다면 가장 가고 싶었던 부서와 왜 그 부서를 가시고 싶은지 설명해 주세요."
- 지원자 답변: "가능하다면 국가 기밀 관련 부서에서 일해보고 싶습니다. 정보 보안은 어디서나 중요하지만 국가기관이 일에 있어 자긍심을 더 고양시켜줄 것 같고, 어렸을 때 본 영화나 드라마의 영향도 있어서 작은 꿈이었습니다."
- 평가 가이드라인:
  - 잘한점: "본인이 해당 분야(정보 보안)를 선택하게 된 동기와 직업적 자긍심, 솔직한 열정을 명확히 전달했습니다."
  - 개선점 2가지:
    1. "부서 선택의 이유가 '영화나 드라마' 같은 감성적 이유에 치우쳐 있어, 구체적인 직무 역량이나 실무 경험과의 연계가 부족합니다."
    2. "해당 부서에 진학하여 어떤 기술적 기여나 성과를 낼 수 있는지에 대한 구체적인 비전 및 목표 제시가 누락되어 있습니다."
  - 개선된 답변 예시: "국가 기밀 보안 부서에 입사하고 싶습니다. 정보 보안 전문가로서 사회적 책임감과 자긍심을 갖고 일하는 것이 제 목표입니다. 그동안 쌓아온 보안 시스템 모니터링 및 침해 대응 경험을 바탕으로, 국가 기관의 주요 자산을 안전하게 보호하는 데 기여하고자 합니다."

---

[평가할 실제 면접 데이터]
- 면접 질문: "${question}"
- 지원자 답변: "${answer}"

위 [평가할 실제 면접 데이터]를 바탕으로 잘한 점 1가지, 개선점 2가지, 그리고 Before-After 비교용 개선된 답변 예시를 작성하여 지정된 JSON 형식으로 답해 줘.`;

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
              parts: [{ text: prompt }],
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