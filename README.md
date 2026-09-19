# 🎯 AI Interview Coach (AI 면접 코치)

> **원티드 AI 챔피언십 2026 출품작**[cite: 4]
> 사용자 맞춤형 면접 질문 생성부터 음성 답변 수신, AI 기반 우수 피드백 분석까지 제공하는 화상 인터뷰 코칭 웹 서비스입니다[cite: 1, 2].

---

## 🔗 Live Demo
* **배포 URL:** [https://ai-interview-coach-tan-nu.vercel.app](https://ai-interview-coach-tan-nu.vercel.app)[cite: 4]

---

## ✨ 주요 기능 (Key Features)

1. **직무 맞춤형 면접 질문 생성**
   - 사용자 지정 직무(예: 백엔드 개발자, 서비스 기획자 등)에 따른 핵심 예상 질문 3개 실시간 도출[cite: 1].
2. **화상 인터뷰 & STT 음성 답변 입력**
   - ZOOM / Meet 스타일의 화상 캐릭터 UI 및 Web Speech API 기반 음성 인식(STT) 지원[cite: 1, 2].
   - 질문 TTS(음성 낭독) 기능 지원.
3. **AI-Hub 데이터셋 기반 Few-Shot 피드백**
   - 과기정통부 / AI-Hub '채용면접 인터뷰 데이터셋' 기반 평가 기준 이식[cite: 1].
   - 잘한 점, 개선점 2가지, Before-After 개선된 답변 예시 제공[cite: 1].
4. **피드백 결과 복사 및 이력 유지**
   - 분석 결과 원클릭 클립보드 복사[cite: 1].
   - 토큰 절약을 위한 세션 내 질문 리스트 상태 보존[cite: 1].

---

## 🛠 기술 스택 (Tech Stack)

* **Frontend:** React (Vite), JavaScript, CSS3[cite: 1, 4]
* **Backend:** Vercel Serverless Functions[cite: 1, 4]
* **AI & API:** Google Gemini 2.5 Flash API, Web Speech API (STT/TTS)[cite: 1, 2]
* **Dataset:** 과학기술정보통신부 / AI-Hub 채용면접 인터뷰 데이터셋 (Few-Shot Prompting 적용)[cite: 1]

---

## 🚀 실행 가이드 (Getting Started)

```bash
# 1. 의존성 설치
npm install

# 2. Vercel CLI 로컬 개발 서버 실행 (Serverless API 테스트용)
vercel dev