# GreenLink v2 — CRITICAL LOGIC & SSOT (Single Source of Truth)

> **경고 (WARNING)**: 이 문서는 GreenLink 프로젝트의 **유일한 진실의 원천(SSOT)**입니다. 모든 아키텍처 결정, 비즈니스 로직 수정, API 및 DB 스키마 설계는 이 문서의 원칙을 위배해서는 안 됩니다. 기존 로직을 수정할 경우 이 문서를 선제적으로 업데이트하고 팀의 승인을 받아야 합니다.

**최종 수정**: 2026-03-03

---

## 1. 플랫폼 비전 및 핵심 가치 (Platform Vision & Core Values)

GreenLink는 **"산지의 신선함을 동네 거점(꽃집/무인사물함)을 통해 가장 빠르게 전달하는 하이퍼로컬 신뢰 공동체"** 를 지향하는 환경 친화적인 화훼 직거래 플랫폼입니다.

- **유통 혁신**: 경매장 중심의 복합 유통 단계를 생략하고 산지와 거점을 직배송망으로 연결하여 중간 마진을 제거한다.
- **신뢰 보증**: 품질 전문가(Quality Inspector)의 현장 검수 및 데이터화 기반 큐레이션을 제공한다.
- **AI 비즈니스 효율화**: 농민용 V2S(Voice to Sales) 상세페이지 자동 생성, AI 비주얼 품질 판독, 실시간 최격 가격 제안을 수행한다.

---

## 2. 확정된 기술 스택 (Locked Tech Stack)

| 영역 | 기술 | 버전 / 비고 |
| :--- | :--- | :--- |
| **런타임** | Node.js | v24.x (LTS) |
| **프레임워크** | Next.js (App Router) | 15.x, Turbopack 사용 |
| **UI 라이브러리** | React | 19.x |
| **Headless UI** | Ark UI (`@ark-ui/react`) | 전환 완료, Radix UI 대체 |
| **스타일링** | Tailwind CSS v4 | CSS-first, `@theme` 지시어 + OKLCH 컬러 |
| **상태 관리** | Zustand (`useUserStore`) | UI 캐싱 한정. API 호출의 SSOT는 아님 |
| **백엔드/DB** | Supabase (PostgreSQL + RLS) | `@supabase/ssr` 사용 |
| **모노레포** | Turborepo | `apps/web`, `apps/admin`, `apps/driver` |
| **패키지 매니저** | npm workspaces | `.npmrc`: `legacy-peer-deps=true` |
| **Python 인프라** | Python 3.14 + uv | `error_monitor.py` 등 도구 지원 |
| **빌드 도구** | VS Build Tools 2022 (MSVC) | 네이티브 모듈 컴파일용 |

---

## 3. 핵심 아키텍처 결정 (Locked Architecture Decisions)

### 3.1 Auth: SupabaseProvider SSOT 원칙

- **오직 `<SupabaseProvider>` (서버 미들웨어 기반)만이 브라우저의 1차 진입 검증자**이다.
- `Zustand useUserStore`는 UI 상태 캐싱 전용이며, 세션 유효성의 최종 판단자가 되어서는 안 된다.
- 로그아웃 시 클라이언트 `supabase.auth.signOut()`과 서버 `/api/auth/logout` API를 **병렬 실행(Promise.race)** 한다.
- `HttpOnly` 쿠키 직접 수정 금지: `@supabase/ssr` 라이브러리 표준 플래그를 준수한다.

#### 해결된 Auth 버그 이력 (재발 방지용)

| 버그 | 원인 | 해결책 |
| :--- | :--- | :--- |
| 유령 세션 (Ghost Session) | 클라이언트 `signOut()`만 호출 시 `HttpOnly` 쿠키 잔류 | 서버 API `/api/auth/logout` 도입, 쿠키 강제 삭제 |
| OAuth 버튼 무반응 (Lock Deadlock) | `createBrowserClient` 다중 인스턴스로 IndexedDB LockManager 교착 | `getSupabaseBrowserClient()` 싱글톤 패턴 적용 |
| 미들웨어 쿠키 소실 | 리다이렉트 시 새 `NextResponse`를 생성하여 Set-Cookie 헤더 유실 | `supabaseResponse`의 쿠키를 `redirectResponse`에 수동 복사 |
| 카테고리 상품 0개 노출 | 쿼리에 존재하지 않는 컬럼(`auction_params`) 포함 → Supabase `42703` 에러 → Mock Fallback | 쿼리에서 해당 컬럼 제거, `metadata` JSON 구조 활용 |

### 3.2 Hydration 안정화: Render-Proxy 패턴

```tsx
// 모든 클라이언트 전용 렌더링에 이 패턴을 적용한다.
const [isMounted, setIsMounted] = useState(false)
useEffect(() => { setIsMounted(true) }, [])

// 마운트 전 서버 HTML과 동일한 초기값을 반환
const isActive = isMounted ? (pathname === item.href) : false
```

- `suppressHydrationWarning`은 Fast Refresh 노이즈 억제용으로 허용하되, 근본 구조 불일치의 해결책으로 사용하지 않는다.

### 3.3 API: Zero-lag Fallback 원칙

- 모든 Supabase 쿼리에 `AbortSignal.timeout(4000)` 을 적용한다.
- Fallback Mock 데이터는 **실제 `seed_data.js`와 100% 대칭**을 유지해야 한다. 대칭이 깨지면 Fallback이 버그가 된다.
- `safetyTimer`는 로그인 Auth Token 처리 오버헤드를 감안하여 **10초** 이상으로 설정한다.

### 3.4 의존성 및 모노레포 원칙

- `packages/ui` 내 React는 `peerDependencies`로 선언하여 중복 마운트를 방지한다.
- Ark UI 컴포넌트는 **로직(Ark UI 상태 기계)과 스타일(Tailwind v4)을 엄격히 분리**하여 구현한다.
- 신규 전역 패키지 설치 전 `packages/lib` 또는 `packages/ui` 워크스페이스 레벨에서 관리 여부를 먼저 검토한다.

---

## 4. 핵심 비즈니스 로직 (Core Business Logic)

### 4.1 하이브리드 물류 및 배송 모델

- **밀크런(Milk Run) 집하**: AI가 다수 농가를 순회 집하하는 최적 차량 경로를 도출한다.
- **거점(Hub) 기반 라스트 마일**: 동네 꽃집과 무인 사물함을 배송 거점으로 활용하여 픽업 및 배송을 수행한다.

### 4.2 제로 인벤토리(Zero-Inventory) 공동구매

- **선결제 후사입**: 구매 임계치 도달 전까지 예치 결제로 진입하며, 미달 시 100% 자동 환불한다.
- **상태 전이(Trigger)**: 목표 인원 도달 시 DB Trigger가 상태를 `GOAL_MET`으로 강제 전이시킨다.
- **원자성 보장**: 참가자 수 증감 연산은 클라이언트 직접 업데이트 금지, 반드시 서버 RPC(`increment_participants`)를 사용한다.

### 4.3 결제 검증 및 에스크로 정산

- **결제 검증**: PortOne Webhook 수신 시 서버사이드에서 결제 상태를 검증한다.
- **정산 트리거**: 직배송은 배송 완료 시 즉시 정산, 택배는 운송장 등록(`DISPATCHED`) 후 자동 추적한다.

---

## 5. 현재 로드맵 (Roadmap)

### [완료] Phase 1: 기반 인프라

- [x] Turborepo 모노레포 구조 (`apps/web`, `apps/admin`, `apps/driver`, `packages/lib`, `packages/ui`)
- [x] Supabase 프로젝트 생성 및 RLS 정책 적용
- [x] `@supabase/ssr` 기반 서버/클라이언트 분리 Auth 구조 확립
- [x] Next.js 15 Turbopack 개발 서버 최적화
- [x] Skeleton Loader / Hydration Mismatch 제로화

### [완료] Phase 2: UI 인프라 구축

- [x] Radix UI → **Ark UI** 마이그레이션 완료 (`packages/ui`)
- [x] Tailwind CSS v4 도입 및 OKLCH 기반 디자인 토큰 정의 (`globals.css`)
- [x] Glassmorphism + Framer Motion 미세 애니메이션 적용
- [x] `cva` (class-variance-authority) 기반 컴포넌트 변형(variant) 시스템 구축

### [완료] Phase 3: 구매 및 결제 도메인

- [x] 상품 상세 및 농가(Farm) 프로필 UI 프리미엄 전환
- [x] `getZeroInventoryItem` API 연동 및 공동구매 상태 표시
- [x] `cart_items` 테이블 연동, 장바구니 추가/조회 (`addToCart`, `getCartItems`)
- [x] `useUserStore` 장바구니 상태(`cartCount`) 전역 동기화
- [x] 에스크로 결제(`/payment`) 플로우 및 `createEscrowOrder` API 연동
- [x] 주문 내역 조회 및 취소 플로우 구현
- [x] 레거시 Zustand (`useProductStore`, `useOrderStore`) 제거 → `greenlinkApi` 직접 호출로 교체
- [x] 전체 패키지 `npm run type-check` 통과 (5/5)

### [진행중] Phase 4: 마이페이지 및 검색

- [ ] 마이페이지 유저 인터페이스 (핑크 온도, 레벨, 포인트 렌더링)
- [ ] 내 공동구매 결제 내역(Status) 리스트 조회 컴포넌트
- [ ] 마이페이지 프로필 편집 기능
- [ ] 전체 품목 키워드 검색(`/search`) 아키텍처 및 필터링 UI

### [예정] Phase 5: 파트너스 생태계

- [ ] `apps/admin`: 관리자 접속 권한 및 상품 등록(CRUD) 관리자 화면
- [ ] `apps/driver`: 지도 연동 및 주문 라우팅 UI
- [ ] Python `error_monitor.py` 연동 및 실시간 에러 모니터링 대시보드

---

## 6. 보안 및 개발 워크플로우 (Security & Workflow)

- **RLS 및 권한 제어**: 모든 API 호출 및 인벤토리 접근은 Supabase RLS 정책(`Users can view/insert their own items`)을 준수한다.
- **3-Layer DDD**: 비즈니스 단위별 폴더 격리 및 **Definition → Repository → Service** 패턴을 엄수한다.
- **물리적 증거 기반 보고**: 가설과 추측 배제, 실제 파일 내용과 터미널 로그를 바탕으로 숫자로 보고한다.
- **연속성 보존**: 모든 수정 내역은 하단에 추가되는 방식의 **`docs/memory.md`** 에 기록한다 (최대 200줄 관리).
- **인코딩 엄수**: `.bat`/`.cmd` → ANSI(CP949), 그 외 모든 소스 코드 및 문서 → UTF-8 (no BOM).
