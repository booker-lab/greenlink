# 현재 작업 태스크 (Current Task) — [Phase 4: 마이페이지 & 검색]

**최종 수정**: 2026-03-03

---

## 1. 작업 개요 (Objective)

- **명칭**: 마이페이지 고도화 및 전체 검색 기능 구현
- **핵심 목표**: 사용자 경험의 완성도를 높이는 마이페이지(My Page) UI를 구현하고, GreenLink 전체 상품을 키워드로 탐색할 수 있는 검색(`/search`) 페이지를 구축한다.
- **연계 완료 상태 (Phase 3 결과물)**:
  - `greenlinkApi` 직접 호출 아키텍처로 전환 완료 (레거시 Zustand Store 제거)
  - `npm run type-check`: 5/5 패키지 통과
  - 장바구니 연동, 에스크로 결제, 주문 취소 플로우 완료

---

## 2. 원자적 작업 단계 (Atomic Steps)

### Step 1: 마이페이지 — 유저 프로필 & 통계 UI

- [ ] `apps/web/src/app/mypage/page.tsx`: 유저 레벨, 핑크 온도, 포인트 렌더링 UI 구현
- [ ] 프로필 이미지 업로드 (`Supabase Storage` 연동)
- [ ] `packages/lib/src/api/index.ts`: `getProfile(userId)` 반환 타입 정교화 및 `updateProfile()` API 추가

### Step 2: 마이페이지 — 주문 내역 컴포넌트

- [ ] `apps/web/src/app/mypage/orders/page.tsx`: 공동구매 참여 내역 리스트 조회
- [ ] 주문 상태별 탭 필터 (전체 / 결제 대기 / 진행 중 / 완료 / 취소)
- [ ] `greenlinkApi.getOrderHistory(userId)` 연동 — `orders` 테이블 RLS 준수

### Step 3: 전체 검색 기능 (`/search`)

- [ ] `apps/web/src/app/search/page.tsx`: 키워드 검색 입력창 + 결과 그리드 UI
- [ ] `packages/lib/src/api/index.ts`: `searchProducts(keyword: string)` API 추가
  - Supabase `ilike` 쿼리 또는 Full-text Search(`to_tsvector`) 활용 검토
- [ ] 검색 결과 없음 상태 UI 및 인기 검색어 Fallback 제공

### Step 4: UI 폴리싱 & Accessibility

- [ ] 모든 Ark UI 컴포넌트 ARIA 속성 및 키보드 네비게이션 검증
- [ ] 마이페이지/검색 페이지 Skeleton Loader 적용
- [ ] `npm run type-check` 전 패키지 통과 확인

---

## 3. 완료 성과 (Definition of Done)

- [ ] 마이페이지에서 로그인 유저의 레벨·포인트·주문 내역이 올바르게 표시된다.
- [ ] `/search?q=장미` 형태로 딥링크 접근이 가능하다.
- [ ] 비로그인 유저가 마이페이지 접근 시 `/login`으로 자동 리다이렉트된다.
- [ ] `npm run type-check` 5/5 통과 유지.
- [ ] Hydration Mismatch 에러 발생 없음.

---

## 4. 다음 태스크 예고 (Phase 5)

- `apps/admin`: 상품 등록(CRUD) 관리자 화면
- `apps/driver`: 지도 연동 및 주문 라우팅 UI
- Python `error_monitor.py` 대시보드 연동
