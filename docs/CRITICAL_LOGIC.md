# GreenLink v2 - CRITICAL LOGIC & SSOT (Single Source of Truth)

> **경고 (WARNING)**: 이 문서는 GreenLink 프로젝트의 유일한 진실의 원천(SSOT)입니다. 모든 아키텍처 결정, 비즈니스 로직 수정, API 및 DB 스키마 설계는 이 문서의 원칙을 위배해서는 안 됩니다. 기존 로직을 수정해야 할 경우, 반드시 이 문서를 선제적으로 업데이트하고 팀의 승인을 받아야 합니다.

---

## 1. 런칭 전 필수 체크리스트 (Critical Reminders)

- [ ] **PG 실결제 연동**: `PORTONE_API_KEY`, `PORTONE_API_SECRET`, `NEXT_PUBLIC_PORTONE_SHOP_ID` 실운영 키 주입 필요.
- [ ] **보안 강화**: `SUPABASE_SERVICE_ROLE_KEY`는 서버측(Webhook)에서만 사용하며 외부 노출 엄격 금지.
- [ ] **자동화 고도화**: 일반 택배(COURIER)의 정산 자동화를 위한 외부 운송장 추적 API 연동 작업 (SweetTracker 등).

---

## 2. 플랫폼 비전 및 핵심 가치 (Platform Vision & Core Values)

GreenLink는 "산지의 신선함을 동네 거점(꽃집/무인사물함)을 통해 가장 빠르게 전달하는 하이퍼로컬 신뢰 공동체"를 지향한다.

- **유통 혁신**: 경매장 중심의 복잡한 유통 단계를 생략하고 산지와 거점을 직배송망으로 연결하여 중간 마진을 제거한다.
- **신뢰 보증**: 품질 전문가(Quality Inspector)의 현장 검수 및 데이터화 기반 큐레이션을 제공한다.
- **AI 비즈니스 효율화**: 농민용 V2S(Voice to Sales) 상세페이지 자동 생성, AI 비주얼 품질 판독, 실시간 최격 가격 제안을 수행한다.

---

## 3. 모노레포 아키텍처 및 성능 원칙 (Architecture & Performance)

본 프로젝트의 최우선 기술 과제는 극단적인 초기 로딩 속도 최적화(Extreme Performance)이다.

- **목표 성능**: TTFB(Time To First Byte) 20ms 이하 달성.
- **Server Components (RSC) 도입**: 모든 핵심 화면은 Server Component로 설계하여 클라이언트 사이드 자바스크립트 번들 크기를 최소화한다.
- **초경량 UI 지향**: 외부 아이콘 라이브러리 사용을 금지하며, 인라인 SVG와 Native CSS를 활용한다.
- **모노레포 구조**: Turborepo 기반 도메인별 앱 분리.
  - `apps/web`: 소비자 및 구매자 플랫폼 (Port 3000)
  - `apps/admin`: 셀러 비즈 포털 '그린링크 비즈' (Port 3001)
  - `apps/driver`: 배송 파트너 전용 앱 (Port 3002)
  - `packages/lib`, `packages/ui`: 공통 도메인 로직 및 디자인 시스템 공유.

---

## 4. 핵심 비즈니스 로직 (Core Business Logic)

### 4.1. 하이브리드 물류 및 배송 모델
- **밀크런(Milk Run) 집하**: AI가 다수 농가를 순회 집하하는 최적 차량 경로를 도출한다.
- **거점(Hub) 기반 라스트 마일**: 동네 꽃집과 무인 사물함을 배송 거점으로 활용하여 픽업 및 배송을 수행한다.
- **신선도 유지 라우팅**: 식물 특성에 따른 배송 우선순위를 동적으로 관리한다.

### 4.2. 제로 인벤토리(Zero-Inventory) 공동구매
- **선결제 후사입**: 구매 임계치(기본 10명) 도달 전까지 예치 결제로 진입하며, 미달 시 100% 자동 환불한다.
- **DB 원자적 연산**: 초과 모집 방지를 위해 `current_participants` 증감은 반드시 서버 RPC(`increment_participants`)를 사용한 원자적 연산으로 수행한다.
- **방어적 전이(Trigger)**: 목표 인원 도달 시 DB Trigger 수준에서 상태를 `GOAL_MET`으로 강제 전이시킨다.

### 4.3. 결제 검증 및 에스크로 정산
- **결제 검증**: PortOne Webhook 수신 시 서버사이드에서 액세스 토큰을 발급받아 결제 상태를 검증한다.
- **정산 트리거**: 
  - 직배송: 드라이버가 배송 완료 시 `confirm_delivery_and_settle` RPC 호출로 즉시 정산 확정.
  - 택배: 운송장 등록 시 `DISPATCHED`로 변경하며, 향후 배송 추적 API 연동을 통해 자동화를 추진한다.

---

## 5. 보안 및 컴플라이언스 (Security & Compliance)

- **IDOR 및 권한 제어**: 모든 API 호출 시 세션 ID와 소유자 ID 대조 로직을 강제 적용한다.
- **Supabase 인증**: 클라이언트 사이드 싱글톤 패턴(`packages/lib/src/api/supabase.ts`)을 통해 브라우저 세션 락 경합을 방지한다.
- **개인정보 보호**: 이웃 고객 수 노출 등 위치 정보 활용 시 사전 동의 프로세스를 필수 적용한다.

---

## 6. 개발 워크플로우 의무 (Development Workflow)

1. **사전 검토**: API 구조나 스키마 변경 시 반드시 이 문서(SSOT)를 선제 업데이트한다.
2. **테스트 자동화**: 핵심 로직 변경 시 `pytest` 또는 `vitest` 단위 테스트를 통한 회귀 검증을 수행한다.
3. **AI 협업 규정**: `scripts/Invoke-Repomix.ps1`을 통한 정기적 덤프 생성으로 AI 컨텍스트를 동기화한다.
