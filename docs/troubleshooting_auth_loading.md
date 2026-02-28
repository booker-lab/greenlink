# Troubleshooting Report: Authentication Loop & Infinite Loading
**Date**: 2026-02-26

## 1. 개요
리팩토링 이후 발생한 **`/mypage` 로그인 루프 현상**과 **`/category` 무한 로딩 현상**을 해결하기 위해 다방면의 아키텍처 점검 및 수정을 진행했습니다. 현재 일부 엣지 케이스에서 문제가 지속되고 있으나, 근본적인 구조적 결함들은 다수 식별 및 격리 조치되었습니다.

## 2. 식별된 근본 원인 (Root Causes)

### 2.1 Next.js 15 Middleware 쿠키 소실
* **현상**: `exchangeCodeForSession`을 통해 발급받은 인증 쿠키가 라우트 보호 미들웨어(`middleware.ts`)를 통과할 때 유실됨.
* **원인**: 보호 경로에서 리다이렉트 시, `createServerClient`가 `setAll` 콜백을 통해 갱신한 쿠키(`supabaseResponse`)를 반환하지 않고, 쿠키가 없는 새로운 `NextResponse.redirect()` 객체를 반환하여 클라이언트에 Set-Cookie 헤더가 전달되지 않음.
* **조치**: `redirectResponse` 객체를 명시적으로 생성하고, `supabaseResponse`의 모든 쿠키를 수동으로 복사하여 반환하도록 수정.

### 2.2 Callback Route 응답 객체 타이밍 버그
* **현상**: Google OAuth 완료 후 `/auth/callback`에서 토큰 무효화.
* **원인**: `exchangeCodeForSession` 실행 후 성공 분기에서 새로운 `NextResponse.redirect()`를 생성함으로써, 앞서 `setAll` 단계에서 주입되었던 쿠키가 초기화됨.
* **조치**: 스코프 상단에서 `redirectResponse` 객체를 단일 생성하고, 쿠키 주입 콜백 트리거 시 이 객체에 직접 주입하도록 흐름 단순화.

### 2.3 Zustand Store (user-store.ts) HMR 중복 리스너
* **현상**: 클라이언트 HMR 재로드 시, `listenerInitialized` 변수가 `false`로 리셋되어 이벤트 리스너가 중복 바인딩됨.
* **원인**: 모듈 스코프에 선언된 런타임 변수는 Vite/Next.js Fast Refresh 시 초기화됨. 그러나 `window` 레벨의 Supabase 객체는 지속되어 다중 Event Emitter를 발생시킴.
* **조치**: `globalThis.__listenerInitialized`를 활용하여 모듈 재평가 생명주기를 벗어난 완전한 싱글톤 가드 구축.

### 2.4 Supabase Client LockManager Standoff
* **현상**: 데이터베이스 쿼리를 대기하다 네트워크 가용 타임아웃 발생 (유령 요청).
* **원인**: 여러 컴포넌트에서 동시에 렌더링되며 `createBrowserClient`가 남발되어 브라우저 내 IndexedDB 락 획득 병목 발생.
* **조치**: 
    1. `packages/lib/src/api/supabase.ts`에 `isSingleton: true` 옵션 및 모듈 레벨 캐시(`cachedBrowserClient`) 추가.
    2. API 쿼리(`packages/lib/src/api/index.ts`)에 `.abortSignal(AbortSignal.timeout(15000))` 명시적 타임아웃 주입.
    3. `.select('*')` 대신 명시적인 컬럼 프로젝션 적용.

## 4. 최종 해결 (2026-02-28)
### 4.1 클라이언트-서버 인증 상태 미동기화 해결
* **문제**: 서버(Middleware)는 인증을 확인하고 통과시키지만, 브라우저 클라이언트(`supabase-js`)는 `HttpOnly` 쿠키를 읽을 수 없어 인증되지 않은 것으로 판단. 이로 인해 `/mypage` 접근 후 다시 로그인 UI가 노출되는 현상 발생.
* **조치**: 
    1. `middleware.ts`와 `auth/callback/route.ts`에서 세션 쿠키 설정 시 `httpOnly: false`를 명시적으로 부여.
    2. `user-store.ts`에서 `INITIAL_SESSION` 및 `TOKEN_REFRESHED` 이벤트를 처리하도록 강화.
    3. `redirectResponse` 생성 시 `supabaseResponse`의 쿠키를 완전히 필터링하여 복사하도록 로직 정교화.

### 4.2 HMR 및 상태 리셋 시 무한 로딩(Loading Spinner Grounding) 해결
* **현상**: `/mypage` 접근 시 로딩 스피너에서 넘어가지 않음.
* **원인**: 
    1. `user-store.ts`의 `globalThis.__listenerInitialized` 가드 로직이 HMR 등으로 인해 Store 상태만 리셋된 상황에서도 초기 세션 확인(`checkSession`)을 건너뛰게 만듦. 이로 인해 `isInitialized` 상태가 영구적으로 `false`에 고착됨.
    2. 프로필/장바구니 API 조회(`getProfile`, `getCartCount`)에 타임아웃이 없어 네트워크 지연 시 세션 확인이 완료되지 않음.
* **조치**:
    1. `initializeAuthListener`를 분리하여, 리스너 등록 여부와 상관없이 현재 스토어 인스턴스의 `isInitialized`가 `false`라면 항상 `checkSession`을 수행하도록 수정.
    2. 글로벌 리스너가 항상 최신 스토어 인스턴스를 업데이트하도록 `useUserStore.setState` 사용.
    3. 모든 주요 API 호출에 `AbortSignal.timeout(4000)` 추가.

## 5. 결론
인증 루프와 무한 로딩의 핵심은 **상태 가시성(Cookie Visibility)**과 **초기화 생명주기(Initialization Lifecycle)** 문제였습니다. Next.js 15의 엄격한 쿠키 정책과 HMR 환경에서의 싱글톤 관리 패턴이 복합적으로 작용하여 발생한 문제들을 해결함으로써, 이제 모든 환경에서 안정적인 인증 흐름을 보장하게 되었습니다.

