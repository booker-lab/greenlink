# MISSION: 로그인 루프 및 인증 상태 비동기화 해결

## 1. 문제 분석
* **현상**: 사용자가 로그인을 성공해도 `/mypage` 등 보호된 페이지에서 다시 로그인 버튼이 노출되거나, `/login`으로 리다이렉트되어 로그인 창이 반복됨.
* **근본 원인**: Next.js 15 Middleware와 Route Handler에서 세션 쿠키를 `HttpOnly: true`(기본값)로 설정함. 서버는 이 쿠키를 읽어 인증을 통과시키지만, 브라우저의 Zustand Store(`user-store`)와 Supabase Client는 `HttpOnly` 쿠키에 접근할 수 없어 `isAuthenticated` 상태를 `false`로 유지함. 이로 인해 클라이언트 컴포넌트에서 로그인 버튼이 다시 노출되는 "가짜 루프" 및 실제 리다이렉트 루프 발생.

## 2. 해결 전략
* **쿠키 가시성 확보**: Middleware 및 Auth Callback에서 설정하는 세션 쿠키의 `httpOnly` 옵션을 `false`로 명시적 설정하여 클라이언트 사이드 싱크로율 확보.
* **쿠키 전파 로직 최적화**: Next.js 15의 `NextResponse.redirect` 시 쿠키가 누락되지 않도록 복사 로직 정교화.
* **Zustand Store 복원**: 클라이언트에서 세션을 감지했을 때 즉시 `isAuthenticated`를 반영하도록 보장.

## 3. 작업 체크리스트
- [ ] `apps/web/src/middleware.ts` 수정: `httpOnly: false` 주입 및 쿠키 복사 로직 개선.
- [ ] `apps/web/src/app/auth/callback/route.ts` 수정: `httpOnly: false` 주입.
- [ ] `packages/lib/src/stores/user-store.ts` 확인: 세션 감지 로그 추가 및 상태 업데이트 확인.
- [ ] 물리적 검증: 수정 후 빌드 및 런타임 로그 확인.
