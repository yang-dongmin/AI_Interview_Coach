# AI 면접 코치

원티드 AI 챔피언십 2026 출품작. 직무를 입력하면 예상 면접 질문을 받고,
답변을 입력하면 AI가 면접관 역할로 피드백을 준다.

## 시작하기

1. 의존성 설치
```
npm install
```

2. .env 파일에 API 키 입력
```
ANTHROPIC_API_KEY=sk-ant-...
```
(.env.example 참고. .env는 절대 git에 올리지 않는다)

3. 로컬 개발 서버 실행
```
npm run dev
```
Vite dev 서버만으로는 /api 함수가 안 돌아간다. Vercel CLI로 실행해야
서버리스 함수까지 같이 테스트할 수 있다:
```
npm install -g vercel
vercel dev
```

## 배포

Vercel에 GitHub 레포를 연결하고, 프로젝트 설정 > Environment Variables에
ANTHROPIC_API_KEY를 등록하면 끝. push할 때마다 자동 배포된다.

## 폴더 구조

```
api/                  서버리스 함수 (LLM API 키는 여기서만 사용)
  generate-questions.js
  analyze-answer.js
src/
  pages/               화면 3개 (직무선택 -> 답변입력 -> 피드백)
  lib/api.js           프론트에서 /api/* 호출하는 함수 모음
  App.jsx              화면 전환 로직
```
