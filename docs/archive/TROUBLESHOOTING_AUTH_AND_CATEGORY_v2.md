# Troubleshooting Report: Auth, Ghost Sessions & Category Sync Fixes
**최종 업데이트**: 2026-03-01 (Antigravity Senior Architect)

본 문서는 프로젝트 GreenLink의 **인증 시스템(Auth)** 및 **카테고리 상품 동기화** 과정에서 발생한 치명적인 버그들과 그 해결책을 집대성한 가이드입니다. 향후 유사 장애 발생 시 이 문서를 최우선 참조하십시오.

---

## 1. 인증 시스템 (Authentication & Session)

### 1.1 유령 세션 (Ghost Session) 문제
*   **현상**: 사용자가 로그아웃을 했음에도 불구하고, 다시 `/login` 페이지에 접근하려고 하면 미들웨어가 "이미 로그인됨"으로 판단하여 메인이나 마이페이지로 강제 리다이렉트 시키는 현상.
*   **원인**: 클라이언트 사이드(`user-store.ts`)에서만 `signOut()`을 호출할 경우, 브라우저의 `HttpOnly` 인증 쿠키가 서버측에서 완전히 삭제되지 않아 미들웨어(`middleware.ts`)가 유효한 세션으로 오판함.
*   **해결책**:
    1.  **서버 로그아웃 API 도입**: `apps/web/src/app/api/auth/logout/route.ts`를 신설하여 서버측에서 직접 쿠키를 무효화함.
    2.  **이중 로그아웃 전략**: `user-store.ts`의 `logout` 함수에서 `supabase.auth.signOut()`과 위 API 호출을 병렬 실행 (`Promise.race` 적용).
    3.  **캐시 무력화**: `middleware.ts`에서 비인증 사용자가 `/login` 접근 시 `Cache-Control: no-store` 헤더를 강제 주입하여 브라우저 캐시 조작 방지.

### 1.2 OAuth 로그인 버튼 무반응 (Lock Deadlock)
*   **현상**: 카카오/구글 로그인 버튼을 눌러도 아무런 반응이 없거나 한데 함정에 빠진 듯 멈추는 현상.
*   **원인**: `createBrowserClient`가 여러 곳에서 호출되면서 브라우저 내 IndexedDB `LockManager`가 교착 상태(Deadlock)에 빠짐.
*   **해결책**: `packages/lib/src/api/supabase.ts`에 **싱글톤 클라이언트(`getSupabaseBrowserClient`)** 패턴을 도입하여 단 하나의 인스턴스만 공유하도록 강제함.

---

## 2. 카테고리 상품 노출 (Category Product Sync)

### 2.1 상품 수 불일치 및 0개 노출 (PostgREST Column Error)
*   **현상**: DB에는 상품이 8개 있는데 화면에는 1개만 나오거나, "등록된 상품이 없습니다"라고 뜨는 현상.
*   **원인**: API 쿼리(`select`) 문에 DB 스키마에 존재하지 않는 컬럼(`auction_params`)이 포함되어 Supabase가 `42703` 에러를 반환함. 이 에러가 발생하면 시스템이 자동으로 **빈약한 Mock 데이터(1개뿐인 예비 데이터)**로 우회(Fallback)하여 렌더링함.
*   **해결책**: `packages/lib/src/api/index.ts` 내 모든 쿼리에서 `auction_params` 컬럼을 제거하고, 대신 `metadata` JSON 컬럼을 활용하도록 수정.

### 2.2 로그인 후 상품 실종 (Auth Lock & Timeout Race)
*   **현상**: 로그아웃 상태에선 잘 보이던 상품이, 로그인만 하면 사라지거나 더미 데이터만 나옴.
*   **원인**: 
    1.  로그인 직후 프로필/장바구니/상품 조회가 동시에 일어나며 Supabase의 **토큰 갱신(Token Refresh) 락**이 수 초간 발생.
    2.  프론트엔드의 안전 타이머(`safetyTimer`)가 5초로 너무 짧아, 실제 DB 응답이 오기도 전에 "응답 없음"으로 간주하고 Mock 데이터를 덮어써 버림.
*   **해결책**:
    1.  **타이머 연장**: `CategoryPage`의 `safetyTimer`를 5초에서 10초로 연장하여 인증 처리를 위한 시간을 확보.
    2.  **데이터 대칭성**: `mockItems` 배열을 실제 DB의 `seed_data.js`와 100% 일치하도록 업데이트하여, 설령 Fallback이 일어나더라도 사용자 정서에 위질감이 없도록 조치.
    3.  **네이티브 락 복구**: `authOptions`에서 커스텀하게 오버라이드했던 `lock` 함수를 제거하여 브라우저 네이티브 `navigator.locks`가 안전하게 요청을 순차 처리하도록 복원.

---

## 3. 개발자 대응 매뉴얼 (Quick Fix Checklist)

1.  **인증이 꼬였다면?** -> 브라우저 개발자 도구 -> Application -> Storage -> `Clear site data` 실행 후 서버측 `/api/auth/logout` 호출 확인.
2.  **상품이 안 보인다면?** -> `packages/lib/src/api/index.ts`의 `.select()` 구문과 실제 Supabase Table 컬럼명이 1:1 일치하는지 `test-fetch.js`로 먼저 검증.
3.  **무한 로딩이 발생한다면?** -> `packages/lib/src/api/supabase.ts`가 싱글톤으로 동작 중인지, `authOptions`의 `lock` 설정이 네이티브 기능을 방해하지 않는지 점검.

---
**GreenLink Architect Memo**: 
"가설로 코딩하지 말고, 숫자로 검증하라. 모든 Fallback UI는 최후의 보루여야 하며, 운영 데이터와의 대칭성이 깨지는 순간 버그가 된다."
