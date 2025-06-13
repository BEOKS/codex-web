# Codex Web

Codex CLI의 웹 인터페이스입니다. 브라우저에서 OpenAI Codex의 강력한 코딩 기능을 사용할 수 있습니다.

## 기능

- 🌐 **브라우저 기반 인터페이스**: 터미널 없이 웹에서 Codex 사용
- 💬 **실시간 채팅**: Socket.IO를 통한 실시간 대화
- ⚡ **즉시 응답**: Codex CLI의 모든 기능을 웹에서 활용
- 🎨 **현대적인 UI**: Tailwind CSS로 만든 깔끔한 인터페이스
- 🔧 **다양한 설정**: 모델, 제공자, 승인 모드 등 커스터마이징 가능

## 설치 및 설정

### 1. 의존성 설치

```bash
# 루트 디렉토리에서 모든 의존성 설치
pnpm install
```

### 2. 환경 변수 설정

Codex CLI와 동일한 환경 변수가 필요합니다:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

또는 프로젝트 루트에 `.env` 파일을 생성:

```env
OPENAI_API_KEY=your-api-key-here
```

### 3. Codex CLI 빌드

Codex Web이 작동하려면 먼저 Codex CLI가 빌드되어야 합니다:

```bash
cd ../../codex-cli
pnpm run build
```

## 개발 시작

### 방법 1: 개발 서버만 시작

```bash
pnpm run dev
```

### 방법 2: Codex CLI 빌드와 함께 시작

```bash
pnpm run dev:codex
```

개발 서버가 시작되면 [http://localhost:3000](http://localhost:3000)에서 웹 인터페이스에 접근할 수 있습니다.

## 사용법

1. **웹 인터페이스 접속**: 브라우저에서 `http://localhost:3000`으로 이동
2. **연결 상태 확인**: 우상단에 "연결됨" 표시가 나타나는지 확인
3. **메시지 입력**: 하단 입력창에 Codex에게 요청할 내용을 입력
4. **응답 확인**: Codex의 응답이 채팅 형태로 표시됩니다

### 예시 프롬프트

- "파이썬으로 간단한 계산기 만들어줘"
- "이 코드를 설명해주세요: [코드 붙여넣기]"
- "React 컴포넌트 작성해줘"
- "버그를 찾아주세요"

## 아키텍처

```
codex-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 메인 웹 인터페이스
│   │   └── api/socket/route.ts   # Socket.IO API 엔드포인트
│   └── lib/
│       └── codex-service.ts      # Codex CLI 통합 서비스
├── package.json
├── next.config.ts
└── README.md
```

### 주요 컴포넌트

- **Frontend (React + Next.js)**: 사용자 인터페이스
- **Backend (Socket.IO)**: 실시간 통신 서버
- **Codex Service**: Codex CLI와의 통합 계층

## 설정 옵션

웹 인터페이스에서 다음 Codex 설정을 사용할 수 있습니다:

- **모델**: `codex-mini-latest` (기본값)
- **제공자**: `openai` (기본값)
- **승인 모드**: `suggest` (기본값)

## 트러블슈팅

### 연결 오류

1. **Codex CLI 빌드 확인**:

   ```bash
   cd ../../codex-cli
   pnpm run build
   ```

2. **환경 변수 확인**:

   ```bash
   echo $OPENAI_API_KEY
   ```

3. **권한 확인**:
   ```bash
   ls -la ../../codex-cli/bin/codex.js
   ```

### 일반적인 문제

- **"연결 끊김" 표시**: 개발 서버가 제대로 시작되지 않았을 수 있습니다
- **응답 없음**: OpenAI API 키가 설정되지 않았을 수 있습니다
- **에러 메시지**: 브라우저 개발자 도구의 콘솔에서 자세한 오류 정보를 확인하세요

## 기여하기

이 프로젝트는 Codex CLI의 일부입니다. 기여 방법은 [루트 README](../../README.md)를 참고하세요.

## 라이선스

Apache-2.0 라이선스를 따릅니다.
