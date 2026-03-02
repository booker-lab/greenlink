# GreenLink AI 코딩 워크플로우 & 프롬프트 모음

> `WORKFLOW_30MIN_AI_CODING.md` + `WORKFLOW_30MIN_PROMPTS.md` 통합 문서.
> 짧은 시간 내에 기능을 구현하기 위해 웹 LLM(두뇌)과 IDE AI(근육)를 조합하는 단계별 실전 가이드.

**최종 수정**: 2026-03-03

---

## Step 0: 코드베이스 덤프 생성 (전제 조건)

워크플로우 시작 전 프로젝트의 최신 컨텍스트를 통합 파일로 생성한다.

```powershell
# scripts 폴더의 보안 스크립트 실행
pwsh -ExecutionPolicy Bypass -File scripts\Invoke-Repomix.ps1
```

- **출력물**: `docs/repomix-output.md` (전체 코드베이스 통합 덤프)

---

## Phase 1: 두뇌 가동 — 작업 지시서 생성 (웹 LLM용)

**목적**: 전체 코드베이스를 분석하여 IDE AI에게 줄 순차 작업 지시서 도출.
**사용처**: 웹 브라우저 기반 장문 컨텍스트 LLM (Gemini, Claude 등)

### 프롬프트 (복붙용)

```text
너는 10년 차 시니어 소프트웨어 아키텍트야.
아래 첨부된 텍스트는 [greenlink] 프로젝트의 전체 코드베이스(repomix 출력)야.

지금부터 이 프로젝트에 [구현할 기능 설명]을 추가하려고 해.

내가 IDE의 AI 보조 도구에게 순차적으로 작업을 시킬 수 있도록, 다음 규칙에 따라 '단계별 작업 지시서'를 작성해 줘.

[작업 분할 규칙]
- Step 1: 데이터베이스 스키마(Supabase 마이그레이션), 코어 로직 (Zustand Store, API Service). docs/CRITICAL_LOGIC.md 원칙 준수.
- Step 2: 프론트엔드 UI 컴포넌트(Next.js App Router), 상태 관리 연람, 로딩/에러 UI 처리.

각 Step별로 1) 수정/생성할 파일 경로, 2) 핵심 로직 및 변수/함수명, 3) CRITICAL_LOGIC 준수 사항을 상세히 적어 줘.

[지금은 Step 1(백엔드/로직) 지시서만 작성해 줘.] 또는 [지금은 Step 2(프론트엔드/UI) 지시서만 작성해 줘.]

(이 아래에 docs/repomix-output.md 내용 전체를 붙여넣는다)
```

---

## Phase 2: 근육 가동 — Step 1 백엔드/로직 (IDE AI용)

**사용처**: IDE 기반 AI 채팅 (Cursor, Antigravity 등)
**규칙**: 수정 대상 파일은 전체 코드로 출력 요구. `docs/CRITICAL_LOGIC.md` 원칙 준수 확인.

### 프롬프트 (복붙용)

```text
너는 최고 수준의 풀스택 개발자야.
이 프로젝트는 [greenlink]이며, Next.js + Supabase + Zustand 스택을 사용한다.
docs/CRITICAL_LOGIC.md를 유일한 SSOT로 따른다.

다음은 이 프로젝트에 추가할 기능의 [Step 1: 백엔드/로직] 작업 지시서야.

[여기에 Step 1 지시서 내용 주입]

위 지시서에 언급된 모든 파일의 코드를 작성해 줘.
- 수정 대상 파일은 전체 소스 코드로 출력한다.
- 예외 처리와 타입 정의를 엄격히 적용한다.
- 신규 마이그레이션은 supabase/migrations/ 경로에 SQL로 제안한다.
```

---

## Phase 3: 근육 가동 — Step 2 프론트엔드 (IDE AI용)

**사용처**: Phase 2와 동일한 채팅 세션 (맥락 유지)

### 프롬프트 (복붙용)

```text
로직 코드는 방금 프로젝트에 적용했다. 컨텍스트를 유지한 상태에서 다음 [Step 2: 프론트엔드] 지시서를 수행하라.

[여기에 Step 2 지시서 내용 주입]

관련 앱 경로(apps/web 또는 apps/admin)를 확인하여 Next.js App Router 기반의 코드를 작성하라.
- 모든 파일은 기존 코드 생략 없이 전체 소스 코드로 출력한다.
- 로딩 상태(Loading UI)와 에러 처리(Error UI)를 포함한다.
- Ark UI + Tailwind v4 기반 컴포넌트 구조를 유지한다.
- Hydration 경고가 발생하지 않도록 클라이언트/서버 컴포넌트 분리를 엄수한다.
```

---

## Phase 4: 품질 향상 — 문서·주석·테스트 (IDE AI용)

### 프롬프트 (복붙용)

```text
작성한 기능에 대한 품질 보강 작업을 수행한다. 다음 3가지를 한 번에 수행하라.

1. 문서화: docs/ 하위에 기능 설명 및 API 명세를 마크다운으로 정리한다.
2. 주석: 수정된 핵심 파일들에 JSDoc 스타일의 상세 주석을 달아 전체 파일 코드로 다시 출력한다.
3. 테스트: 비즈니스 로직에 대한 단위 테스트 코드를 작성한다.
```

---

## 상시 명령어 참조

```powershell
# 전체 앱 실행
.\run.bat

# web 단독 실행 (Turbopack)
.\run_web.bat

# admin 단독 실행
.\run_admin.bat

# 타입 검사 (전 패키지)
npm run type-check

# 에러 모니터 실행
.\run_monitor.bat

# 환경 동기화 (신규 PC 세팅)
.\setup_env.bat
```

---

## 아키텍처 모니터링

배포 및 가동 중 발생하는 에러는 `error_monitor.py`를 통해 실시간 감시하며, 위 워크플로우의 디버깅 단계에서 활용한다.
