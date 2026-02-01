# 그린링크 (Green Link) 🌱

**화훼/농산물 생산자(농민)와 거점(꽃집)을 연결하는 하이브리드 직배송 웹앱**

그린링크는 농민과 소매점을 직접 연결하여 신선한 농산물을 가장 빠르게 전달하는 플랫폼입니다. 모바일 웹 우선(Mobile First) 디자인으로 설계되었으며, 추후 하이브리드 앱으로 확장될 예정입니다.

## 🛠 기술 스택 (Tech Stack)

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Mobile First Design)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Mobile Native**: Capacitor (Future Integration)

---

## 📂 폴더 구조 (System Architecture)

```
src/
├── app/          # 페이지 레이아웃 및 라우팅 (App Router)
├── components/   # UI 공통 컴포넌트 (농민/소비자/기사 등)
│   ├── layout/   # 레이아웃 관련 (MobileLayout, BottomNav)
│   └── ui/       # 재사용 가능한 UI 요소
├── store/        # Zustand 전역 상태 관리 (장바구니, 유저 정보 등)
├── lib/          # 핵심 로직 및 유틸리티
│   ├── api/      # API 연동
│   └── utils/    # 공통 유틸리티 함수
├── hooks/        # 커스텀 React Hooks (데이터 페칭, 로직 재사용)
└── types/        # TypeScript 타입 정의
```

---

## 📈 상세 개발 로드맵 (Milestones)

비즈니스 가치에 따라 프로젝트를 4단계로 진행합니다.

### P1: MVP 구축 (The Foundation)
*   **유저 인증**: 농민/소매점/일반 사용자 구분 및 지역 인증
*   **상품 거래**: 기본적인 상품 등록, 목록 조회, 상세 보기
*   **결제 시스템**: 장바구니 담기 및 결제 연동 (Toss/Iamport)
*   **목표**: 첫 실제 거래 발생

### P2: AI 지원 및 신뢰 (Trust & AI)
*   **V2S (Voice to Spec)**: 농민 음성("이 장미는 줄기가 굵고 붉은색이야")을 분석하여 상품 상세페이지 자동 생성
*   **QA 시스템**: 품질 전문가용 검수 도구 제공
*   **그린 온도**: 사용자 평판 시스템 로직 적용
*   **목표**: 상세페이지 생성 자동화 및 신뢰도 확보

### P3: 물류 최적화 (Logistics)
*   **Milk Run**: 다수 농가를 순회하여 집하하는 최적 경로 알고리즘
*   **Hub Sync**: 꽃집 거점 및 무인 사물함 재고 연동
*   **대시보드**: 실시간 배송 추적 및 관제
*   **목표**: 배송비 20% 절감

### P4: 모바일 & 확장 (Expansion)
*   **Hybrid App**: Capacitor를 활용하여 iOS/Android 앱 패키징 및 스토어 출시
*   **Navigation**: 기사용 동선 최적화 내비게이션 연동
*   **Category**: 농산물 전반으로 취급 카테고리 확장
*   **목표**: 앱 스토어 정식 출시

---

## 🌿 Git 협업 및 브랜치 전략 (Collaboration)

**그린링크 표준 브랜치 전략**을 준수합니다.

*   `main`: 실제 서비스 중인 안정적인 코드 (직접 수정 금지)
*   `develop`: 개발 중인 기능이 통합되는 브랜치
*   `feat/*`: 새로운 기능 개발 (예: `feat/product-upload`, `feat/cart`)
*   `fix/*`: 버그 수정 (예: `fix/login-error`)
*   `refactor/*`: 코드 리팩토링 (기능 변화 없음)

**워크플로우**:
1.  작업 전 `develop` 브랜치 최신화 (`git pull origin develop`)
2.  새 브랜치 생성 (`git checkout -b feat/기능명`)
3.  작업 완료 후 커밋 및 푸시
4.  `develop` 브랜치로 Merge Request (PR)

---

## 🧠 핵심 로직 가이드 (AI & Logistics)

AI 기술을 물류 최적화에 적용합니다.

### 밀크런(Milk Run) 최적화 수식
차량의 이동 거리와 식물의 신선도 손실을 최소화하는 목적 함수($Z$)입니다.

$$Z = \sum_{i=0}^{n} \sum_{j=0}^{n} (Cost_{ij} \times x_{ij}) + \sum_{i=1}^{n} (FreshnessPenalty_{i} \times Time_{i})$$

*   $Cost_{ij}$: 농가 $i$에서 $j$까지의 운송 비용
*   $FreshnessPenalty_{i}$: 식물 품종별 시간에 따른 가치 하락 점수
*   $Time_{i}$: 최종 거점 도착 시간

> **Tip**: 위 수식을 구현할 때, "신선도 페널티 변수를 포함한 다익스트라 변형 알고리즘"을 AI에게 요청하여 초안 코드를 작성할 수 있습니다.

---

## 📂 안티그래비티 작업 지침 (Web App Guidelines)

### 1. 웹앱 최적화 레이아웃
*   **Mobile First**: 모든 화면은 `max-w-md` (약 450px) 기준으로 중앙 정렬합니다.
*   **App-like Experience**: 하단에 고정된 탭바(Bottom Navigation)를 배치하여 네이티브 앱과 유사한 경험을 제공합니다.

### 2. 주요 태스크
1.  **기본 UI 구조**: 모바일 레이아웃 컨테이너 및 하단 내비게이션 바
2.  **농민 상품 등록**: 사진 업로드 및 수량/가격 입력 폼 (V2S 연동 전 단계)
3.  **소비자 피드**: 위치 기반 농장 소식 리스트
4.  **상태 관리**: Zustand를 이용한 전역 상태 관리 (장바구니, 위치 정보)
