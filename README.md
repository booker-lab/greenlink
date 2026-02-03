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

### P1: MVP 및 시장 진입 (Market Entry)
*   **전략**: 경매 물품 사입 판매 및 SaaS 기반 네이버 스마트스토어 연동 지원
*   **유저 인증**: 농민/소매점/일반 사용자 구분 및 지역 인증
*   **상품 거래**: 기본적인 상품 등록, 목록 조회, 상세 보기
*   **결제/배송**: 장바구니 및 결제 연동(Toss/Iamport), 택배(B2C) 및 거점(꽃집) 기반 시험 배송
*   **목표**: 첫 실제 거래 발생 및 초기 유통 데이터 수집

### P2: AI 지원 및 신뢰 구축 (AI & Trust)
*   **AI 고도화**: **V2S (Voice to Spec)**를 통한 농민 음성 기반 상세페이지 자동 생성
*   **신뢰 인프라**: 품질 전문가용 검수 도구 제공 및 농업인 경영체 인증 시스템 연동
*   **평판 시스템**: 생산자 신뢰도를 나타내는 그린 온도 로직 적용
*   **데이터 관리**: 출하일과 수량을 예측하는 시즌 캘린더 도입
*   **목표**: 상세페이지 생성 자동화 및 생산자 신뢰도 확보

### P3: 물류 최적화 및 직배송 (Direct Logistics)
*   **물류 알고리즘**: 다수 농가 순회 집하인 Milk Run 및 다이내믹 물류 로직 가동
*   **거점 서비스**: 꽃집 거점 및 무인 사물함 재고 연동(Hub Sync)
*   **배송 체계**: 전용 꽃차 직배송(B2C) 및 실시간 배송 추적 대시보드
*   **목표**: 유통 단계 축소를 통한 배송비 20% 절감

### P4: 모바일 확장 및 고도화 (Expansion)
*   **하이브리드 앱**: Capacitor를 활용하여 iOS/Android 앱 패키징 및 스토어 출시
*   **유저 고도화**: 전화번호 인증 도입 및 소비자용 핑크 온도(환불/취소 지수) 시스템 적용
*   **영역 확장**: 기사용 동선 최적화 내비게이션 연동 및 농산물 전반으로 카테고리 확장
*   **목표**: 앱 스토어 정식 출시 및 농산물 통합 유통 플랫폼 완성

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

### 1. 웹앱 최적화 레이아웃 (Responsive Design)
*   **Responsive**: 데스크탑과 모바일 모두를 고려한 반응형 레이아웃을 제공합니다.
*   **Flexible Container**: `max-w-md` 제한을 제거하고, 화면 크기에 따라 유연하게 확장되는 컨테이너를 사용합니다.
*   **Note**: 추후 Capacitor를 이용한 네이티브 앱 전환 시, 모바일 뷰는 별도로 최적화할 예정입니다.

### 2. 주요 태스크
1.  **기본 UI 구조**: 모바일 레이아웃 컨테이너 및 하단 내비게이션 바
2.  **농민 상품 등록**: 사진 업로드 및 수량/가격 입력 폼 (V2S 연동 전 단계)
3.  **소비자 피드**: 위치 기반 농장 소식 리스트
4.  **상태 관리**: Zustand를 이용한 전역 상태 관리 (장바구니, 위치 정보)
