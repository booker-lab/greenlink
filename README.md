# 🌿 GreenLink v2

**하이퍼로컬 화훼·농수산 직거래 플랫폼** — Kia PV5 신선배송 차량 기반 직배송 시스템 포함

---

## 🚀 Extreme Performance (TTFB 20ms)
본 프로젝트는 초기 로딩 속도 최적화를 통해 최상의 사용자 경험을 제공합니다.
- **Server Components**: 메인 페이지를 Server Component로 설계하여 클라이언트 사이드 부하 최소화.
- **SSR Optimization**: 데이터 직접 주입 방식을 통해 **TTFB(초기 응답 속도)를 4.8s에서 20ms로 단축**.
- **Lightweight UI**: 외부 라이브러리(`lucide-react`, `date-fns` 등)를 제거하고 Native API와 Unicode Emoji를 사용하여 번들 사이즈 최소화.

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
본 프로젝트는 **Turborepo**와 **npm**을 기반으로 한 모노레포 구조로 설계되었습니다.

```bash
greenlink-monorepo/
├── apps/
│   ├── web/       # 소비자용 PWA (Next.js, Server Components Optimized)
│   ├── admin/     # 농가/판매자용 대시보드 (Next.js)
│   └── driver/    # 배송기사용 앱 (Next.js, Dark Theme)
├── packages/
│   ├── ui/        # 고성능 공용 디자인 시스템 (Radix UI + Native CSS)
│   └── lib/       # 전역 상태(Zustand), API 클라이언트, 공용 데이터(Mock)
```

---

## 3. 기술 스택
- **Framework**: Next.js 15 (App Router, Server Components)
- **Framework**: React 19 (RC)
- **Monorepo**: Turborepo, npm
- **Styling**: Tailwind CSS (Native focus)
- **State Management**: Zustand (Persistence mode)
- **Performance**: High TTFB optimization (20ms target)

---

## 4. 실행 방법 (Quick Start)

### 권장 실행 (Batch Files)
Windows 환경에서 가장 편하게 실행할 수 있는 스크립트를 제공합니다.
- `run_web.bat`: 소비자용 웹 앱 개발 모드 실행 (Port 3000)
- `run_admin.bat`: 셀러 비즈 포털 '그린링크 비즈' 실행 (Port 3001)
- `start_web_prod.bat`: **최적화된 프로덕션 모드 빌드 및 실행 (20ms 성능 확인용)**
- `run.bat`: 전체 모노레포 개발 환경 실행

### Manual Execution
```bash
# 의존성 설치
npm install

# 전체 개발 모드 실행
npm run dev

# 특정 앱 프로덕션 빌드 및 실행
npm run build --workspace=@greenlink/web
npm start --workspace=@greenlink/web
```

---

## 5. 핵심 엔티티 및 로직
- **Seller/BizProfile**: 농가/판매자 전용 프로필 및 독립된 관리자 앱(`apps/admin`) 구축
- **Order**: D+2~D+10 예약 및 일요일 배송 제외 로직 포함
- **GroupBuy**: 실시간 경매가 대비 할인율 계산 및 공동구매 모집 시스템
- **Lightweight Icons**: `lucide-react` 대신 Unicode Emoji를 사용하여 아이콘 로딩 지연 제거

---

## 6. 개발 및 문제 해결 (Troubleshooting)
자세한 최적화 과정 및 문제 해결 내역은 다음 문서를 참고하세요.
- [Troubleshooting Log](./troubleshooting.md): TTFB 개선 및 빌드 오류 해결 과정

---

© 2026 GreenLink Lab. All rights reserved.
