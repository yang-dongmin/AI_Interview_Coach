import { GoogleGenAI, Type } from "@google/genai";

// Vercel 환경변수에서 API 키를 읽어와 초기화합니다.
// (Vercel에 GEMINI_API_KEY 또는 ANTHROPIC_API_KEY로 설정되어 있다면 해당 이름을 사용하세요)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 허용됩니다" });
  }

  const { jobTitle } = req.body;

  if (!jobTitle || typeof jobTitle !== "string") {
    return res.status(400).json({ error: "jobTitle이 필요합니다" });
  }

  try {
    // Gemini 2.5 Flash 모델 사용
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `너는 채용 면접 전문가야. "${jobTitle}" 직무 면접에서 실제로 자주 나오는 핵심 예상 질문 3개를 작성해 줘.`,
      config: {
        // Gemini의 Structured Outputs 기능을 활용하여 100% 보장된 JSON 형태로 응답받습니다.
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "면접 예상 질문 3개 리스트",
            },
          },
          required: ["questions"],
        },
      },
    });

    // Gemini가 반환한 JSON 텍스트를 바로 파싱합니다.
    const parsedData = JSON.parse(response.text);

    return res.status(200).json(parsedData);
  } catch (err) {
    console.error("Gemini API 서버 오류:", err);
    return res.status(500).json({ 
      error: "질문 생성 중 오류가 발생했습니다", 
      details: err.message || err 
    });
  }
}