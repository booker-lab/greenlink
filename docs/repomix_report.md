# Repomix 덤프 생성 리포트 (SSOT)

이 문서는 AI 워크플로우를 위해 코드베이스를 통합(Dump)할 때 포함되거나 제외되는 경로를 정의하는 유일한 기준점(SSOT)이다. `scripts/Invoke-Repomix.ps1`과 동기화되어야 한다.

---

## 1. 포함(Include) 구조

현재 덤프 파일(`docs/repomix-output.md`)에 포함되는 핵심 경로이다.

| 분류 | 경로 패턴 | 상세 내용 |
| :--- | :--- | :--- |
| **Backend (Core)** | `packages/lib/src/**` | 모노레포 공통 비즈니스 로직, API 스켈레톤, 유틸리티 |
| **Frontend (Web)** | `apps/web/src/**` | 소비자용 Next.js 웹 애플리케이션 소스 코드 |
| **Frontend (Admin)** | `apps/admin/src/**` | 셀러용 비즈 포털 Next.js 애플리케이션 소스 코드 |
| **Database** | `supabase/migrations/**` | Supabase 스키마 정의 및 SQL 마이그레이션 파일 |
| **Documentation** | `docs/*.md` | 기술 문서, 워크플로우 가이드, Critical Logic |
| **Project Setup** | `README.md`, `package.json`, `turbo.json` | 프로젝트 개요, 의존성 구조, 빌드 파이프라인 |

---

## 2. 제외(Ignore) 구조

보안 및 노이즈 제거를 위해 명시적으로 제외되는 경로이다.

| 분류 | 제외 패턴 | 상세 내용 |
| :--- | :--- | :--- |
| **재귀 방지** | `docs/repomix*.md`, `docs/tree.txt` | 덤프 파일 자체가 다시 덤프되는 로직 루프 방지 |
| **민감 정보** | `**/.env`, `**/.env.*`, `**/.env.local` | API 키, DB 접속 정보 등 환경 변수 파일 차단 |
| **보안 인증** | `**/*.pem`, `**/*.key`, `**/service-account*.json` | SSL 인증서, 서비스 계정 키 파일 등 이중 차단 |
| **빌드/의존성** | `**/node_modules/**`, `**/.next/**`, `**/.turbo/**` | 라이브러리 및 런타임 빌드 산출물 (노이즈) |
| **가상 환경** | `**/.venv/**`, `**/dist/**`, `**/*.lock` | Python 가상환경, 빌드 배포본, 패키지 락 파일 |

---

## 3. 한눈에 보기 (Tree Summary)

```text
c:/develop/greenlink
├── apps/
│   ├── web/src/ (Include)
│   └── admin/src/ (Include)
├── packages/
│   └── lib/src/ (Include)
├── supabase/
│   └── migrations/ (Include)
├── docs/ (Include, except repomix*.md)
├── scripts/
│   └── Invoke-Repomix.ps1 (관리 스크립트)
└── (Root Files: README, package.json, turbo.json - Include)
```

---

## 4. 관리 및 동기화 절차

1. `Invoke-Repomix.ps1`의 변수를 수정한 경우, 이 문서의 포함/제외 표를 업데이트한다.
2. 아래 명령을 실행하여 덤프를 생성하고 검증한다.
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\Invoke-Repomix.ps1
   ```
3. `docs/repomix-output.md` 상단의 파일 목록을 확인하여 설계된 아키텍처대로 포함되었는지 확인한다.
4. 생성된 덤프 파일 내에 민감 정보가 포함되지 않았는지 최종 검토를 수행한다.
