# CONTEXT

## 현재 상황
* 사용자가 로그인 시도 시 로그인이 완료되지 않고 로그인 창이 반복되는 현상을 보고함.
* 서버 로그 확인 결과, Middleware는 세션을 정상적으로 감시하고 있으며 `/mypage` 접근을 허용하고 있음.
* 그러나 클라이언트 측 Zustand Store가 세션을 인식하지 못해 화면상에 로그인 버튼을 다시 보여주는 현상이 식별됨.

## 주요 식별 사항
1. **Next.js 15 Middleware**: `NextResponse.redirect` 시 쿠키 전달이 불완전할 가능성.
2. **HttpOnly Cookie**: Supabase SSR 기본값인 `HttpOnly: true`로 인해 브라우저 JS가 세션을 읽지 못함.
3. **Zustand Hydration**: 클라이언트에서 `isInitialized`가 `true`가 되기 전 세션 확인 로직의 타이밍 문제.

## 최근 변경 사항
* `packages/lib/src/api/supabase.ts`에서 Supabase Client 싱글톤 패턴 적용.
* `apps/web/src/middleware.ts`에서 쿠키 복사 로직 추가.
