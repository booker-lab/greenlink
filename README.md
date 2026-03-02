# GreenLink v2

**하이퍼로컬 화훼·농수산 직거래 플랫폼** — 산지 직배송 및 제로 인벤토리 공동구매 시스템

---

## 1. 프로젝트 개요

GreenLink는 중간 유통 과정을 생략하고 농장과 소비자를 **동네 거점(꽃집/무인사물함)**을 통해 직접 연결하는 하이퍼로컬 플랫폼입니다.

- **유통 혁신**: 경매장 중심의 복합 유통 단계를 생략, 산지와 거점을 직배송망으로 연결
- **제로 인벤토리 공동구매**: 선결제 후 사입 방식으로 재고 리스크 제거
- **신뢰 지표**: 그린 온도(판매자) / 핑크 온도(구매자) 시스템
- **AI 비즈니스 효율화**: V2S(Voice to Sales) 상세페이지 자동 생성, AI 품질 판독

---

## 2. 모노레포 구조

```
greenlink-monorepo/
├── apps/
│   ├── web/         # 소비자용 PWA (Next.js 15, App Router)
│   ├── admin/       # 농가/판매자용 관리 대시보드
│   └── driver/      # 배송기사용 앱 (Dark Theme)
├── packages/
│   ├── ui/          # 공용 디자인 시스템 (Ark UI + Tailwind v4)
│   └── lib/         # API 클라이언트, Zustand Store, 공용 타입
├── supabase/
│   └── migrations/  # DB 스키마 마이그레이션 SQL
├── scripts/         # 유틸리티 스크립트 (Python 모니터, 진단 도구)
├── tests/
│   └── manual/      # 수동 검증용 API 테스트 스크립트
├── docs/            # 프로젝트 문서 (SSOT, 트러블슈팅, 워크플로우)
└── logs/            # 런타임 및 빌드 로그
```

---

## 3. 기술 스택

| 영역 | 기술 |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **UI Library** | React 19 |
| **Headless UI** | Ark UI (`@ark-ui/react`) |
| **Styling** | Tailwind CSS v4 (CSS-first, OKLCH 컬러) |
| **State** | Zustand (UI 캐싱 한정) |
| **Backend/DB** | Supabase (PostgreSQL + RLS + `@supabase/ssr`) |
| **Monorepo** | Turborepo + npm workspaces |
| **Python 인프라** | Python 3.14 + uv (`scripts/error_monitor.py`) |
| **Build Tools** | VS Build Tools 2022 (MSVC, 네이티브 모듈) |

---

## 4. 빠른 시작 (Quick Start)

### 환경 초기 세팅 (최초 1회)

```powershell
# 필수: Git, Node.js v20+, Python 3.14, VS Build Tools 2022 설치 후
.\setup_env.bat
```

> 환경 구성 세부 사항은 `docs/ENV_SETUP.md` 참조

### 개발 서버 실행

```powershell
.\run_web.bat        # 소비자 웹앱 (Port 3000, Turbopack)
.\run_admin.bat      # 관리자 앱 (Port 3001)
.\run.bat            # 전체 모노레포 동시 실행
```

### 품질 검증

```powershell
npm run type-check   # 전 패키지 TypeScript 타입 검사
npm run lint         # ESLint
.\run_monitor.bat    # 실시간 에러 모니터 (Python)
```

---

## 5. 환경 변수

각 앱 디렉토리에 `.env.local` 파일이 필요합니다. (Git에 포함되지 않음)

```
apps/web/.env.local
apps/admin/.env.local
apps/driver/.env.local
```

---

## 6. 핵심 문서

| 문서 | 설명 |
| :--- | :--- |
| `docs/CRITICAL_LOGIC.md` | **SSOT** — 아키텍처 결정, 비즈니스 로직, 로드맵 |
| `docs/current_task.md` | 현재 진행 중인 태스크 (Phase 4) |
| `docs/AUTH_TROUBLESHOOTING.md` | 인증 관련 버그 및 해결책 모음 |
| `docs/WORKFLOW.md` | AI 코딩 워크플로우 & 프롬프트 모음 |
| `docs/ENV_SETUP.md` | 개발 환경 구축 가이드 |

---

## 7. 현재 개발 현황

- **완료**: Phase 1 (인프라) / Phase 2 (Ark UI 마이그레이션) / Phase 3 (구매·결제 도메인)
- **진행 중**: **Phase 4** — 마이페이지 고도화 및 전체 검색 기능 구현
- **예정**: Phase 5 — 파트너스(admin/driver) 생태계 구축

---

© 2026 GreenLink Lab. All rights reserved.
