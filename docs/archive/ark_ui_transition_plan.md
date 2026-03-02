# Ark UI 프레임워크 전환 및 프리미엄 UI 고도화 계획 (Roadmap)

본 문서는 **Greenlink 프로젝트의 UI 레이어를 Radix UI에서 Ark UI로 전환**하고, 최신 디자인 트렌드(Vibrant Colors, Glassmorphism, Micro-animations)를 반영한 **시니어 아키텍트 수준의 디자인 시스템 구축** 계획을 명시합니다.

## 1. 아키텍처 변경 핵심 전략

### 1-1. Headless UI 엔진 교체 (Radix UI ➔ Ark UI)
- **이유:** Ark UI(Zag.js 기반)는 프레임워크에 구애받지 않으며, 더 세밀한 상태 기계(State Machine) 기반 로직을 제공하여 복잡한 UI(Select, Tabs, Combobox 등)에서 **진실의 원천(SSOT)**을 더 명확하게 관리할 수 있습니다.
- **적용:** `packages/ui` 내 모든 컴포넌트를 Ark UI 기본 구성 요소로 재정의합니다.

### 1-2. 디자인 엔진 고도화 (Tailwind CSS v4 도입 제안)
- **이유:** 최신 Tailwind v4는 CSS-first 방식을 채택하여 **Vanilla CSS의 유연성**과 **Utility-first의 생산성**을 동시에 제공합니다. 사용자 규칙에서 제시한 "Rich Aesthetics" 구현에 최적화되어 있습니다.
- **적용:** `@theme` 지시어를 활용한 중첩 변수 시스템 및 HSL 기반의 세련된 컬러 팔레트 구축.

---

## 2. 단계별 이행 로드맵

### Phase 1: 기반 인프라 구축
- [x] `packages/ui` 의존성 업데이트 (`@ark-ui/react`, `lucide-react` 신규 설치)
- [x] Tailwind CSS v4 설정 및 글로벌 테마 토큰 정의 (`globals.css`)
- [x] Ark UI의 `ark` 팩토리 컴포넌트를 활용한 스타일 바인딩 유틸리티 구축

### Phase 2: 핵심 컴포넌트 마이그레이션 (Priority)
1. **[x] Inputs & Controls:** Button, Input, Checkbox, Switch (Ark UI 기반)
2. **[x] Navigation:** Tabs, Navigation Menu, Dropdown (더 부드러운 전환 효과 적용)
3. **[x] Overlays:** Dialog (Modal), Popover, Sheet (프리미엄 블러 효과 반영)
4. **[x] Data Display:** Card, Badge, Table, Progress (동적 로딩 애니메이션 추가)

### Phase 3: 프리미엄 UX/UI 폴리싱
- [x] **Glassmorphism:** 헤더 및 오버레이에 `backdrop-blur` 및 미세한 보더 효과 적용
- [x] **Micro-animations:** Framer Motion 또는 CSS Transitions를 활용한 상태 변경 피드백
- [ ] **Accessibility:** 모든 Ark UI 컴포넌트의 ARIA 속성 및 키보드 네비게이션 검증

---

## 3. 컴포넌트 설계 가이드라인 (Ark UI Pattern)

모든 UI 컴포넌트는 아래와 같이 **로직(Ark UI)**과 **스타일(Tailwind v4)**이 엄격히 분리된 구조를 유지합니다.

```tsx
// 예시: Ark UI 기반의 프리미엄 Button 컴포넌트 설계 구조
import { ark } from '@ark-ui/react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonStyles = cva(
  'inline-flex items-center justify-center transition-all duration-200 active:scale-95', 
  {
    variants: {
      variant: {
        premium: 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg border border-white/20 backdrop-blur-sm',
        outline: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50',
      },
      size: {
        md: 'px-6 py-3 rounded-xl font-semibold',
      }
    }
  }
)

export const Button = ark.button // Ark UI 팩토리 활용
```

---

## 4. 기대 효과
1. **Robust State Management:** 복잡한 UI 상태가 라이브러리 레벨에서 관리되어 버그 감소.
2. **Visual Impact:** 고급스럽고 현대적인 느낌의 UI로 사용자 신뢰도 및 만족도 향상.
3. **Future-proof:** 최첨단 스택(Ark UI + Tailwind v4) 사용으로 기술적 부채 최소화.

> [!IMPORTANT]
> **사용자 승인 필요:** 위 계획 중 **Tailwind CSS v4 도입**에 대해 동의하신다면 즉시 `packages/ui` 환경 구성을 시작하겠습니다. 또한, 기존 shadcn/ui 컴포넌트 중 즉시 교체해야 할 우선순위가 있다면 알려주시기 바랍니다.
