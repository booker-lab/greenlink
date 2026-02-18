# 🌿 GreenLink v2

**하이퍼로컬 화훼·농수산 직거래 플랫폼** — Kia PV5 신선배송 차량 기반 직배송 시스템 포함

---

## 1. 프로젝트 개요
GreenLink는 중간 유통 과정을 생략하고 농장과 소비자를 직접 연결하는 하이퍼로컬 플랫폼입니다. 
Kia PV5 전기차를 활용한 최적 온도 유지(18°C) 배송과 경매 시세 기반 공동구매 시스템을 통해 가장 신선하고 합리적인 직거래 경험을 제공합니다.

### 핵심 가치
- **직거래**: 당근마켓 비즈프로필 스타일의 농장 직거래
- **신선 배송**: D+2~D+10 예약 배송 및 신선도 유지
- **공동구매**: 경매장 시세 연동을 통한 소비자 공동구매 모집 및 사입
- **신뢰 지표**: 그린 온도(판매자) 및 핑크 온도(구매자) 시스템

---

## 2. 모노레포 아키텍처
본 프로젝트는 **Turborepo**와 **pnpm**을 기반으로 한 모노레포 구조로 설계되었습니다.

```bash
greenlink-monorepo/
├── apps/
│   ├── web/       # 소비자용 PWA (Next.js)
│   ├── admin/     # 농가/판매자용 대시보드 (Next.js)
│   └── driver/    # 배송기사용 앱 (Next.js, 다크테마)
├── packages/
│   ├── ui/        # Shadcn UI 기반 공용 디자인 시스템
│   └── lib/       # 전역 상태(Zustand), API 클라이언트, 공용 유틸리티
```

---

## 3. 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Monorepo**: Turborepo, pnpm
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Payment**: Toss Payments (Skeleton)
- **External API**: 네이버 커머스 API 연동 준비, 공공데이터 화훼 경매 시세

---

## 4. 시작하기

### 사전 준비
- Node.js >= 18
- pnpm >= 9

### 설치 및 실행
```bash
# 의존성 설치
pnpm install

# 모든 앱 실행 (Turbo)
pnpm run dev
```

---

## 5. 핵심 엔티티
- **Farm**: 농가 정보 및 신뢰도 관리
- **Product**: 상품 목록 및 재고 관리
- **Order**: D+2 예약 배송 기반 주문 시스템
- **GroupBuy**: 경매 시세 연동 공동구매 딜
- **Delivery**: 배송 기사 할당 및 상태 트래킹

---

## 6. 개발 규칙
- SOLID, DRY, SoC 원칙 준수
- 파일당 500라인(20KB) 제한
- 모든 코드 변경 후 lint 및 tsc 검증

---

© 2026 GreenLink Lab. All rights reserved.
