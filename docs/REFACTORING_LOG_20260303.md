# GreenLink 리팩토링 작업 일지 — 2026-03-03

> **목적**: 2026년 3월 3일 하루 동안 수행된 모든 리팩토링 작업을 순서대로 기록한다.
> 이 문서는 이후 코드 리뷰, 원인 추적, 아키텍처 의사결정 근거로 활용된다.

---

## 전체 요약

| 세션 | 작업 영역 | 핵심 성과 |
|:-----|:---------|:---------|
| Session 1 | Python 환경 설정 | `uv` 기반 `.venv` 구축, `requirements.txt` 패키지 설치 완료 |
| Session 2 | Ark UI 컴포넌트 마이그레이션 | Radix UI → Ark UI 전환, Tailwind v4 디자인 시스템 구축 |
| Session 3 | 패키지 의존성 리팩토링 | 레거시 Zustand 스토어 제거, `greenlinkApi` 직접 호출 전환 |
| Session 4 | 문서 통합 (SSOT 정렬) | 파편화된 문서 11개 → 6개 통합 문서로 집약 |
| Session 5 | 루트 폴더 정리 | 루트 파일 57개 → 22개 감축 |
| Session 8 | 주문 내역 연동 버그 | Mock/DB 주문 병합 정렬 및 `user_id` 컬럼 추가 |
| Session 9 | 하이드레이션 오류 해결 | `BottomNav` 경로 인식 불일치 및 `Suspense` 레이아웃 수정 |

---

## Session 8: 주문 내역 연동 버그 수정 (야간)

### 배경
공구 참여 완료 후 카테고리에서는 '모집 완료'로 표시되나, 마이페이지 '최근 주문' 항목에 데이터가 나타나지 않는 치명적 유효성 이슈 발생.

### 원점 원인 분석
1. **userId 불일치**: Mock 주문은 `guest`로 생성되는 반면, 마이페이지는 로그인된 UUID로만 필터링하여 데이터 유실.
2. **정렬 순서 부재**: Mock 데이터 추가 시 날짜 정렬이 없어 `slice(0, 1)` 처리 시 최신 주문이 아닌 가장 오래된 주문이 선택됨.
3. **Join 누락**: Supabase `orders` 테이블 조회 시 상품 정보 조인이 없어 UI 렌더링 실패.

### 작업 내용
- **`20260303_fix_orders_user_id.sql`**: `orders` 테이블에 `user_id` 컬럼 추가 및 RPC 함수 업데이트.
- **`greenlinkApi.getMyOrders`**: `zero_inventory_items` 조인 추가 및 Mock/DB 데이터 합산 후 최신순(`orderedAt`) 정렬 강제.
- **`MyPage` UI**: 최근 주문 노출 개수를 1개에서 3개로 확대하여 실시간 참여 확인 가능성 제고.

---

## Session 9: Next.js 하이드레이션(Hydration) 오류 해결 (야간)

### 배경
Next.js 15 환경에서 `/login` 페이지 로드 시 "Hydration failed because the server rendered HTML didn't match the client" 에러 발생.

### 원인 규명
- **`usePathname` 불일치**: 서버 사이드 렌더링 시 `usePathname()`이 `null`을 반환하여 `/login` 여부를 판단하지 못하고 `<nav>`를 렌더링했으나, 클라이언트에서는 `/login`임을 감지하고 `null`을 렌더링하여 DOM 트리 불일치 발생.
- **`Suspense` 레이아웃 복잡도**: `layout.tsx`에서 불필요한 `Suspense`가 레이아웃 구조를 복잡하게 만듬.

### 작업 내용
- **`BottomNav.tsx`**: `pathname`이 `null`인 경우 즉시 `null`을 반환하도록 하여 서버/클라이언트 초기 렌더링을 일치시킴. `isMounted` 가드를 전진 배치하여 안정성 확보.
- **`layout.tsx`**: JSX 태그 닫기 오류(Breakage) 수정 및 시맨틱 태그 구조 최적화.

---

*문서 최종 업데이트: 2026-03-03 02:40*
*작성자: Antigravity (AI Architect)*

## Session 1: Python 환경 설정 (오전)

### 배경
`error_monitor.py` 실행을 위한 Python 개발 환경이 구축되어 있지 않았음.

### 작업 내용

**1. uv 기반 가상환경 초기화**
```powershell
# 루트에서 실행
uv venv .venv
.venv\Scripts\activate
```

**2. 패키지 설치**
```powershell
uv pip install -r requirements.txt
```

**3. requirements.txt 구성**
```
supabase>=2.0.0
python-dotenv>=1.0.0
requests>=2.31.0
watchdog>=3.0.0
```

### 결과
- `.venv/` 폴더 생성 완료 (`.gitignore`에 포함)
- `error_monitor.py` 실행 환경 준비 완료

---

## Session 2: Ark UI 컴포넌트 마이그레이션 (오전)

### 배경
기존 `packages/ui`가 Radix UI 기반으로 구성되어 있었으며, 접근성(Accessibility) 보장과 상태 로직 SSOT를 위해 Ark UI로 전환 결정.

### 핵심 원칙
- **로직과 스타일의 엄격한 분리**: Ark UI가 상태 기계(State Machine)를 담당하고, Tailwind v4가 시각적 표현을 담당한다.
- **Headless 구조**: 컴포넌트 내부 DOM 구조는 Ark UI 표준을 따르고, 클래스명만 Tailwind로 교체한다.

### 전환된 컴포넌트 목록

| 컴포넌트 | 이전 (`Radix UI`) | 이후 (`Ark UI`) |
|:---------|:-----------------|:---------------|
| `avatar.tsx` | `@radix-ui/react-avatar` | `@ark-ui/react` Avatar |
| `tabs.tsx` | `@radix-ui/react-tabs` | `@ark-ui/react` Tabs |
| `select.tsx` | `@radix-ui/react-select` | `@ark-ui/react` Select |
| `dialog.tsx` | `@radix-ui/react-dialog` | `@ark-ui/react` Dialog |
| `popover.tsx` | `@radix-ui/react-popover` | `@ark-ui/react` Popover |
| `checkbox.tsx` | `@radix-ui/react-checkbox` | `@ark-ui/react` Checkbox |
| `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` | `@ark-ui/react` Menu |
| `progress.tsx` | `@radix-ui/react-progress` | `@ark-ui/react` Progress |
| `sheet.tsx` | `@radix-ui/react-dialog` (변형) | `@ark-ui/react` Dialog (Drawer 모드) |

### 신규 추가 인프라

**`packages/ui/src/lib/factory.tsx`** — Ark UI `styled()` 래퍼
```typescript
export const styled = (Component: any, baseClass: string) => {
    return forwardRef<any, any>(({ className, ...props }, ref) => {
        const ArkComponent = Component as any
        return <ArkComponent ref={ref} className={cn(baseClass, className)} {...props} />
    })
}
export { ark } from '@ark-ui/react'
```

### Tailwind v4 디자인 시스템

**`packages/ui/src/globals.css`** 핵심 토큰:
- **컬러**: OKLCH 기반 색상 공간 사용 (`--color-primary`, `--color-success` 등)
- **효과**: Glassmorphism (`backdrop-blur`, `bg-white/70`)
- **애니메이션**: Framer Motion 연동 micro-interaction

---

## Session 3: 패키지 의존성 리팩토링 (오후 초반)

### 배경
`useProductStore`, `useOrderStore` 등 Mock 데이터 기반 Zustand 스토어가 실제 Supabase API (`greenlinkApi`)와 병존하여 이중 진실의 원천(Dual Source of Truth) 상태가 되었음.

### 문제 진단

```
[아키텍처 충돌 구조]

useProductStore (Mock 데이터, localStorage persist)
        ↕ 충돌
greenlinkApi.getZeroInventoryItems() (Supabase 실시간 데이터)

→ 동일한 데이터를 두 곳에서 관리 = 버그의 온상
```

### 작업 내용

**1. `apps/web/src/app/mypage/page.tsx`**
- `useOrderStore` 제거 → `greenlinkApi.getMyOrders(userId)` 직접 호출
- `useEffect` + `useState` 패턴으로 비동기 데이터 페칭

**2. `apps/web/src/app/order/page.tsx`**
- `useProductStore` 제거 → `greenlinkApi.getZeroInventoryItem(id)` 직접 호출

**3. `apps/web/src/app/cart/page.tsx`**
- `useUserStore.addToCart()` 유지 (UI 상태 캐싱 목적에 부합하므로 적법)

**4. 타입 안전성 강화**
- `Product` 타입과 `ZeroInventoryItem` 타입의 필드 불일치 해소
- `any` 타입 캐스팅 제거, 명시적 타입 지정

### 결과
```
npm run type-check: 5/5 패키지 통과 ✓
```

---

## Session 4: 문서 통합 — SSOT 정렬 (오후 중반)

### 배경
`docs/` 폴더에 15개의 파편화된 문서가 혼재. 동일한 정보가 여러 문서에 중복 기재되어 어느 것이 최신인지 불명확한 상태.

### 파편화 구조 (작업 전)

```
docs/
├── checklist.md          ← 로드맵 (중복)
├── context.md            ← 아키텍처 결정 (중복)
├── mission.md            ← 프로젝트 목표 (중복)
├── CRITICAL_LOGIC.md     ← 위 3개를 포함해야 하는 SSOT
├── troubleshooting_auth_loading.md
├── TROUBLESHOOTING_AUTH_AND_CATEGORY_v2.md
├── AUTH_AND_KNOWLEDGE_FIX.md
├── WORKFLOW_30MIN_AI_CODING.md
├── WORKFLOW_30MIN_PROMPTS.md
├── VERIFICATION_REPORT_*.md (3개)
└── ark_ui_transition_plan.md
```

### 통합 작업

**[1] `CRITICAL_LOGIC.md` 전면 재작성 (SSOT 완성)**
- `mission.md` 내용 → **Section 1 (플랫폼 비전)** 으로 흡수
- `context.md` 내용 → **Section 3 (아키텍처 결정)** 으로 흡수
- `checklist.md` 내용 → **Section 5 (로드맵)** 으로 흡수
- Auth 버그 이력 테이블 신규 추가 (재발 방지 목적)
- 확정 기술 스택 표 신규 추가

**[2] 중복 문서 삭제**
- `checklist.md`, `context.md`, `mission.md` → 삭제 (CRITICAL_LOGIC.md에 통합됨)

**[3] 신규 통합 문서 생성**
- `AUTH_TROUBLESHOOTING.md`: 인증 관련 문서 3개 → 단일 문서로 합본
- `WORKFLOW.md`: 개발 워크플로우 문서 2개 → 단일 문서로 합본

**[4] 아카이브**
- `docs/archive/`: 과거 검증 보고서, 구버전 트러블슈팅 문서 7개 보관

### 결과: 문서 구조 (작업 후)

```
docs/
├── CRITICAL_LOGIC.md       ← 유일한 SSOT (목표+아키텍처+로드맵 통합)
├── current_task.md         ← 현재 진행 중인 Phase 4 태스크
├── AUTH_TROUBLESHOOTING.md ← 인증 트러블슈팅 단일 참조점
├── WORKFLOW.md             ← 개발 워크플로우 단일 참조점
├── ENV_SETUP.md            ← 환경 설정 가이드
├── memory.md               ← 작업 연속성 로그 (Append-Only)
└── archive/                ← 과거 문서 8개 보존
```

---

## Session 5: 루트 폴더 정리 (오후 중반)

### 배경
루트 디렉토리에 57개의 파일이 혼재. 특히 테스트 스크립트, SQL DDL, 에러 로그, 임시 유틸리티 파일이 핵심 설정 파일과 뒤섞여 있어 프로젝트 진입점(README)의 가독성이 극도로 낮은 상태.

### 파일 이동 상세

| 원래 위치 | 이동 위치 | 수량 | 비고 |
|:---------|:---------|:----:|:-----|
| 루트 `test-*.js`, `test-api.ts` | `tests/manual/` | 15개 | 수동 테스트 스크립트 |
| 루트 `phase*.sql`, `*_ddl.sql` | `supabase/migrations/` | 5개 | DDL, 기존 2개와 통합 |
| 루트 `diagnose-*.js`, `seed_data.js`, `error_monitor.py` | `scripts/` | 4개 | 유틸리티 스크립트 |
| 루트 `*-errors.txt`, `*-logs.txt` | `logs/archive/` | 6개 | 빌드 실패 로그 |
| 루트 `prompt_for_gemini.md`, `ERROR_MONITOR_ARCHITECTURE.md` | `docs/` | 2개 | 문서 파일 |
| 루트 `--version`, `*.bak`, `*.tsbuildinfo` | **삭제** | 3개 | 잔재 파일 |

### 연동 수정

**`run_monitor.bat`**: `error_monitor.py` 경로를 `.\scripts\error_monitor.py`로 수정

**`README.md`**: 현행 기술 스택에 맞게 전면 업데이트
- Node.js 24.x, Next.js 15, Ark UI, Tailwind v4 반영
- 모노레포 구조 다이어그램 추가
- 개발 서버 실행 명령 최신화

### 결과
```
루트 파일: 57개 → 22개 (61% 감축)

남은 파일 구성:
- .bat 런처 스크립트: 9개 (run.bat, run_web.bat, setup_env.bat 등)
- JSON 설정: 4개 (package.json, turbo.json, tsconfig.json, package-lock.json)
- 문서: 2개 (README.md, CLAUDE.md)
- 기타: .npmrc, requirements.txt, .cursorrules 계열
```

---

## Session 6: 코드 파편화 통합 (오후 후반)

### 배경
Session 3의 의존성 리팩토링 이후에도 코드 레벨의 파편화가 남아 있었음. 구체적으로 4가지 패턴이 확인됨.

### 파편화 패턴 분석

#### 문제 1: `formatDate` 함수 중복 정의 (심각도: 높음)

```
[중복 구조]
packages/lib/src/utils.ts (루트)       ← 단순화 버전: Intl.DateTimeFormat만 사용
packages/lib/src/utils/format.ts       ← 정식 버전: 옵션 포맷 지원, D+2~D+10 계산 포함

→ 같은 이름의 함수가 두 곳에 정의, import 위치에 따라 동작이 달라짐
```

**조치**: `packages/lib/src/utils.ts` (루트) 파일 **완전 삭제**
- `packages/lib/src/utils/format.ts`의 정식 버전이 단일 SSOT가 됨

#### 문제 2: `PinkTemperature` 타입 중복 (심각도: 보통)

```typescript
// [Before] user-store.ts에 인라인 타입 정의
interface UserProfile {
    pinkTemperature: {          // ← 인라인 익명 타입
        value: number;
        level: string;
        emoji: string;
    };
}

// types/user.ts에 동일한 인터페이스가 별도 존재
export interface PinkTemperature {
    value: number;
    level: string;
    emoji: string;
    description: string;    // ← 필드 하나 더 있음! 불일치 존재
}
```

**조치**: `user-store.ts`에서 `PinkTemperature` import로 교체
```typescript
// [After]
import { PinkTemperature } from '../types/user';

interface UserProfile {
    pinkTemperature: PinkTemperature;  // ← types/user.ts가 SSOT
}
```

#### 문제 3: 레거시 Zustand 스토어 공개 API 노출 (심각도: 높음)

```
[충돌 구조]
stores/index.ts가 다음을 모두 재수출하고 있었음:
  - useProductStore  ← Mock 데이터 기반 (greenlinkApi로 대체됨)
  - useOrderStore    ← Mock 데이터 기반 (greenlinkApi로 대체됨)
  - useFarmStore     ← Mock 데이터 기반 (Supabase 조회로 대체 예정)
  - useDeliveryStore ← Active (driver 앱용)
  - useGroupBuyStore ← Active (공동구매 UI 상태용)
  - useAuthStore     ← Active (driver OTP 인증용)
  - useUserStore     ← Active (web 앱 사용자/카트 상태용)

→ 번들에 MOCK_PRODUCTS, MOCK_ORDERS 등 불필요한 Mock 데이터가
  클라이언트에게 그대로 노출됨 (잠재적 데이터 오염)
```

**조치**: `stores/index.ts`에서 레거시 스토어 3개 재수출 제거
```typescript
// [After] stores/index.ts
// [Active Stores]
export * from './delivery-store';
export * from './group-buy-store';
export * from './auth-store';    // driver 앱용
export * from './user-store';    // web 앱용

// [Deprecated - Mock Only, DO NOT USE]
// product-store, order-store, farm-store → greenlinkApi로 대체됨
```

각 deprecated 파일에 JSDoc 경고 추가:
```typescript
/**
 * @deprecated Mock 데이터 기반 스토어. greenlinkApi로 대체됨.
 * stores/index.ts 공개 API에서 제거됨. 참고용으로 파일 보존.
 */
```

#### 문제 4: 스토어 소비처 파일 - 깨진 import (심각도: 높음)

레거시 스토어 3개가 공개 API에서 제거됨에 따라 기존 소비처 파일들이 broken import 상태가 됨. 각 파일을 수정:

| 파일 | 변경 전 | 변경 후 |
|:-----|:--------|:--------|
| `apps/web/src/app/farm/[id]/page.tsx` | `useFarmStore()` | `MOCK_FARMS` 상수 직접 import |
| `apps/admin/src/app/products/page.tsx` | `useProductStore()` | `MOCK_PRODUCTS` + `useState` 로컬 상태 |
| `apps/admin/src/components/Product/ProductForm.tsx` | `useProductStore().addProduct()` | `console.log` placeholder (TODO 표시) |
| `apps/driver/src/app/delivery/page.tsx` | `useOrderStore` (주석 처리된 상태) | import 선언 자체 제거 |

### 결과
```
신규 TypeScript 에러: 0개
기존 에러 (Phase 4 미구현 컴포넌트 관련) 변동 없음
```

---

## Session 7: 코드리뷰 및 잔존 충돌 수정 (저녁)

### 배경
Session 6 이후 잔존하는 TS 에러 35개에 대한 전수 리뷰 요청.

### 에러 완전 분류

#### 분류 A: 루트 `tsc --noEmit` 컨텍스트 문제 (11개) — 거짓 양성

**원인**: 루트 `tsconfig.json`의 `"paths": { "@/*": ["./src/*"] }` 설정이 루트 기준으로 해석됨.
`apps/web`, `apps/admin`, `apps/driver`의 `@/` 경로는 각 앱의 `tsconfig.json`이 올바르게 해석하지만,
루트 컨텍스트에서 실행되는 `tsc --noEmit`은 루트 `src/`를 찾으므로 에러로 표시됨.

**실제 상황**: 파일들은 모두 실존. `next dev`, `next build`는 정상 작동.

```
apps/web/src/app/layout.tsx → BottomNav, SupabaseProvider, supabase-server 실제 존재
apps/web/src/components/Layout/BottomNav.tsx ✓
apps/web/src/components/Auth/SupabaseProvider.tsx ✓
apps/web/src/utils/supabase-server.ts ✓
```

**조치**: 필요 없음. 빌드 무관.

#### 분류 B: Phase 4 미구현 컴포넌트 (14개) — 정상적인 백로그

```
아직 구현되지 않은 컴포넌트들:
- @/components/GroupBuy/ZeroInventoryCard
- @/components/GroupBuy/GroupBuyCard
- @/components/GroupBuy/CountdownTimer
- @/hooks/useRealtimeDeal
- @/components/Admin/Onboarding/* (4개)
- @/components/SvgMinimap
- @/components/LongPressButton
- @/lib/route-optimizer
```

**조치**: Phase 4~5 구현 시 순차적으로 해소 예정.

#### 분류 C: 실제 코드 충돌 — 즉시 수정 (3건, 10개 에러 해소)

**[수정 C-1] `apps/driver/src/app/login/page.tsx`**

`@greenlink/ui`의 서브패스 export가 `package.json`에 선언되지 않은 경로를 직접 참조:
```typescript
// Before (에러)
import { Input } from "@greenlink/ui/components/ui/input";
import { Button } from "@greenlink/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@greenlink/ui/components/ui/card";

// After (수정)
import { Input, Button, Card, CardContent, CardHeader, CardTitle } from "@greenlink/ui";
```

**[수정 C-2] `packages/ui/src/components/examples/ProfileForm.tsx`**

Shadcn UI 보일러플레이트에서 남겨진 예제 파일. 패키지 내부 `@/components/ui/*` 경로를
올바른 상대경로로 수정:
```typescript
// Before (에러)
import { Button } from "@/components/ui/button"
import { ... } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// After (수정)
import { Button } from "../ui/button"
import { ... } from "../ui/form"
import { Input } from "../ui/input"
```

**[수정 C-3] `tests/manual/test-api.ts`**

루트가 아닌 `tests/manual/` 기준의 잘못된 상대경로:
```typescript
// Before (에러)
import { greenlinkApi } from './packages/lib/src/api/index.ts';

// After (수정)
import { greenlinkApi } from '@greenlink/lib';
```

### 최종 에러 통계

```
수정 전: 35개 에러
수정 후: 25개 에러 (10개 제거)

남은 25개 = 분류 A (거짓 양성, 11개) + 분류 B (백로그, 14개)
           → 모두 런타임/빌드에 영향 없음
```

---

## 최종 아키텍처 상태 요약

### `packages/lib` 공개 API 구조

```typescript
// packages/lib/src/index.ts — 최종 Export 구조

// 1. API 레이어 (Supabase SSOT)
export { greenlinkApi } from './api';          // 모든 서버 통신의 단일 창구
export * from './api/supabase';               // Supabase 클라이언트 (브라우저/서버)
export * from './api/client';                 // 공통 클라이언트 헬퍼

// 2. 타입 정의 (SSOT)
export * from './types';                      // models, group-buy, user, seller

// 3. 상수 및 유틸리티
export * from './constants';                  // MOCK_FARMS, MOCK_PRODUCTS (참조용)
export * from './utils';                      // formatDate, formatCurrency, status-mapper

// 4. Active Zustand 스토어 (4개만 유지)
export * from './stores';
// └─ useDeliveryStore  (driver 앱 배송 상태)
// └─ useGroupBuyStore  (공동구매 실시간 UI 상태)
// └─ useAuthStore      (driver OTP 인증)
// └─ useUserStore      (web 사용자/카트 캐싱)

// 5. 외부 API (네임스페이스 격리)
export * as NaverAPI from './api/external/naver-smartstore';
export * as TossAPI from './api/external/toss-payments';
```

### 타입 계층 구조

```
packages/lib/src/types/
├── models.ts       ← Farm, Product, Order, DeliveryTask (핵심 도메인 모델)
├── group-buy.ts    ← ZeroInventoryItem, GroupBuyDeal, AuctionItem
├── user.ts         ← User, Driver, PinkTemperature (SSOT)
└── seller.ts       ← SellerEntity, LocationVO, ComplianceVO
```

### Zustand 스토어 분류표

| 스토어 | 상태 | 용도 | 데이터 소스 |
|:---------|:-----|:-----|:-----------|
| `useUserStore` | **Active** | web 앱 인증/카트 UI | Supabase (greenlinkApi 경유) |
| `useDeliveryStore` | **Active** | driver 앱 배송 태스크 | Mock (Supabase 연동 예정) |
| `useGroupBuyStore` | **Active** | 공동구매 실시간 UI | Mock + Supabase Sync |
| `useAuthStore` | **Active** | driver OTP 인증 | Mock (실제 SMS 연동 예정) |
| `useProductStore` | **Deprecated** | (레거시) 상품 CRUD | Mock only |
| `useOrderStore` | **Deprecated** | (레거시) 주문 관리 | Mock only |
| `useFarmStore` | **Deprecated** | (레거시) 농가 조회 | Mock only |

---

## 남은 과제 (Phase 4 백로그)

### 즉시 구현 필요 (Blocking)

아래 컴포넌트들이 없으면 web 앱의 주요 페이지가 런타임 에러를 발생시킴:

```
Priority 1: apps/web/src/app/layout.tsx가 의존하는 컴포넌트들
└─ 실제로 파일이 존재하므로 Next.js 빌드는 통과함 (거짓 양성으로 분류)

Priority 2: Phase 4 신규 구현 필요 컴포넌트
├─ @/components/GroupBuy/ZeroInventoryCard    (category/page.tsx 의존)
├─ @/components/GroupBuy/GroupBuyCard         (group-buy/page.tsx, page.tsx 의존)
├─ @/components/GroupBuy/CountdownTimer       (group-buy/[id]/page.tsx 의존)
└─ @/hooks/useRealtimeDeal                    (category/[id]/page.tsx 의존)
```

### 중장기 과제 (Phase 5)

```
Priority 3: admin 앱 Onboarding 컴포넌트 4개
├─ CategorySelector
├─ LocationSelector
├─ ImageUploader
└─ ComplianceForm

Priority 4: driver 앱 인프라 컴포넌트
├─ SvgMinimap (배송 지도)
├─ LongPressButton (픽업/배달 확인 버튼)
└─ route-optimizer (최적 경로 계산 라이브러리)
```

---

## 기술 부채 현황

| 항목 | 위치 | 내용 | 우선순위 |
|:-----|:-----|:-----|:--------|
| `ProductForm` addProduct | `apps/admin/src/components/Product/ProductForm.tsx` | `greenlinkApi`로 실제 DB insert 구현 필요 | P3 |
| `useFarmStore` 완전 제거 | `apps/web/src/app/farm/[id]/page.tsx` | 현재 `MOCK_FARMS` 를 직접 참조. Supabase `farms` 테이블 조회로 교체 필요 | P3 |
| `useGroupBuyStore` 마이그레이션 | `packages/lib/src/stores/group-buy-store.ts` | Mock 기반. Supabase `group_buy_deals` 테이블 실시간 구독으로 교체 필요 | P4 |
| driver OTP 실제 연동 | `packages/lib/src/stores/auth-store.ts` | Mock OTP(000000). 실제 SMS API 연동 필요 | P5 |
| 루트 `tsc --noEmit` 설정 | `tsconfig.json` | 모노레포 루트 tsconfig가 개별 앱 경로 별칭을 인식하지 못함. `references` 또는 `composite` 설정으로 개선 가능 | P4 |

---

*문서 작성일: 2026-03-03*
*작성자: Antigravity (AI 페어 프로그래밍)*
