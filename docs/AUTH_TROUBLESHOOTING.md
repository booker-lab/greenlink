# GreenLink Auth 트러블슈팅 통합 가이드

> 본 문서는 GreenLink 프로젝트의 인증(Auth) 및 관련 시스템에서 발생했던 치명적 버그들과 해결책을 집대성한 **단일 참조 문서**입니다.
> 유사 장애 발생 시 이 문서를 최우선 참조하십시오.

**최종 수정**: 2026-03-03 (이전 문서: `troubleshooting_auth_loading.md`, `TROUBLESHOOTING_AUTH_AND_CATEGORY_v2.md`, `AUTH_AND_KNOWLEDGE_FIX.md` 통합)

---

## 1. 유령 세션 (Ghost Session) — 로그아웃 후 루프

**현상**: 사용자가 로그아웃했음에도, `/login` 접근 시 미들웨어가 "이미 로그인됨"으로 판단하여 강제 리다이렉트.

**원인**: 클라이언트 `supabase.auth.signOut()`만 호출 시 `HttpOnly` 인증 쿠키가 서버 측에서 삭제되지 않아 미들웨어(`middleware.ts`)가 유효한 세션으로 오판.

**해결책**:
1. **서버 로그아웃 API 도입**: `apps/web/src/app/api/auth/logout/route.ts` 신설하여 서버에서 직접 쿠키 무효화.
2. **이중 로그아웃**: `user-store.ts`의 `logout` 함수에서 `supabase.auth.signOut()`과 서버 API 호출을 **병렬 실행** (`Promise.race`).
3. **캐시 무력화**: 미들웨어에서 비인증 사용자 `/login` 접근 시 `Cache-Control: no-store` 헤더 강제 주입.

---

## 2. OAuth 로그인 버튼 무반응 (Lock Deadlock)

**현상**: 카카오/구글 로그인 버튼을 눌러도 아무 반응이 없거나 UI가 멈춤.

**원인**: `createBrowserClient`가 여러 컴포넌트에서 중복 호출되며 브라우저 내 IndexedDB `LockManager`가 교착 상태(Deadlock)에 빠짐.

**해결책**: `packages/lib/src/api/supabase.ts`에 **싱글톤 클라이언트(`getSupabaseBrowserClient`)** 패턴 도입. 단 하나의 인스턴스만 공유.

```typescript
// packages/lib/src/api/supabase.ts
let cachedBrowserClient: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  if (!cachedBrowserClient) {
    cachedBrowserClient = createBrowserClient(url, key)
  }
  return cachedBrowserClient
}
```

---

## 3. 미들웨어 쿠키 소실 (Cookie Loss on Redirect)

**현상**: `exchangeCodeForSession`으로 발급된 인증 쿠키가 미들웨어 통과 중 유실됨.

**원인**: 보호 경로에서 리다이렉트 시 `createServerClient`가 갱신한 쿠키(`supabaseResponse`)를 반환하지 않고, 쿠키가 없는 새 `NextResponse.redirect()` 객체를 반환하여 `Set-Cookie` 헤더 미전달.

**해결책**: `redirectResponse`를 명시적으로 생성하고 `supabaseResponse`의 모든 쿠키를 수동 복사.

```typescript
// middleware.ts 패턴
const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
supabaseResponse.cookies.getAll().forEach(cookie => {
  redirectResponse.cookies.set(cookie.name, cookie.value)
})
return redirectResponse
```

---

## 4. 카테고리 상품 0개 노출 (PostgREST Column Error)

**현상**: DB에 8개 상품이 있는데 화면에 1개 또는 0개 표시.

**원인**: API 쿼리 `.select()` 문에 존재하지 않는 컬럼(`auction_params`)이 포함되어 Supabase `42703` 에러 발생 → 시스템이 자동으로 빈약한 Mock 데이터(1개)로 Fallback.

**해결책**: `packages/lib/src/api/index.ts` 내 모든 쿼리에서 `auction_params` 컬럼 제거. `metadata` JSON 컬럼 내부 중첩 구조로 활용.

> **주의**: `auction_params`는 `metadata.auction_params` 형태로 접근해야 함. DB 스키마 변경 시 반드시 이 가이드 업데이트.

---

## 5. 로그인 후 상품 실종 (Auth Race & Safety Timer)

**현상**: 로그아웃 상태에서는 상품이 보이다가, 로그인 후에 사라지거나 더미 데이터만 노출.

**원인**:
1. 로그인 직후 프로필/장바구니/상품 조회가 동시에 발생하며 Supabase 토큰 갱신(Token Refresh) 락 수 초 발생.
2. `safetyTimer`가 5초로 너무 짧아 DB 응답 전에 Mock을 덮어씀.

**해결책**:
1. `safetyTimer`를 **10초**로 연장하여 인증 처리 시간 확보.
2. `mockItems` 배열을 실제 `seed_data.js`와 **100% 대칭** 유지 (8개 상품).
3. `authOptions`에서 커스텀 `lock` 함수 제거 → 브라우저 네이티브 `navigator.locks` 복원.

---

## 6. HMR 중복 리스너 및 무한 로딩 (`isInitialized` 고착)

**현상**: `/mypage` 접근 시 로딩 스피너에서 넘어가지 않음. 특히 개발 서버 HMR 이후 빈번.

**원인**:
1. `globalThis.__listenerInitialized` 가드가 HMR로 Store 상태만 리셋된 상황에서 `checkSession`을 건너뜀 → `isInitialized`가 영구적으로 `false`에 고착.
2. `getProfile`, `getCartCount` API 호출에 타임아웃 부재 → 네트워크 지연 시 초기화 미완료.

**해결책**:
1. `initializeAuthListener`를 분리: 리스너 등록 여부와 관계없이 현재 스토어의 `isInitialized`가 `false`면 항상 `checkSession` 수행.
2. 글로벌 리스너가 항상 최신 스토어 인스턴스를 업데이트하도록 `useUserStore.setState` 사용.
3. 모든 주요 API 호출에 `AbortSignal.timeout(4000)` 적용.

---

## 7. 개발자 긴급 대응 체크리스트 (Quick Fix)

| 증상 | 1차 확인 | 2차 조치 |
| :--- | :--- | :--- |
| 인증이 꼬였다 | 브라우저 개발자 도구 → Application → Storage → `Clear site data` | 서버측 `/api/auth/logout` 호출 확인 |
| 상품이 안 보인다 | `packages/lib/src/api/index.ts` `.select()` 구문과 Supabase 테이블 컬럼명 1:1 대조 | `test-fetch.js` 실행하여 물리적 Row 수 확인 |
| 무한 로딩 발생 | `supabase.ts`가 싱글톤으로 동작 중인지 확인 | `authOptions`의 `lock` 설정이 네이티브를 방해하지 않는지 점검 |
| 로그인 버튼 무반응 | `getSupabaseBrowserClient()` 호출 여부 확인 | 브라우저 IndexedDB 전체 초기화 후 재테스트 |
