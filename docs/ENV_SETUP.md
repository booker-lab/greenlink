# GreenLink 개발 환경 구축 가이드 (PC/노트북 동기화)

본 문서는 데스크탑과 노트북 간에 동일한 개발 환경을 유지하기 위한 설정 가이드입니다.

## 1. 필수 수동 설치 항목 (Pre-requisites)

배치 파일을 실행하기 전, 다음 도구들을 반드시 먼저 설치해야 합니다.

| 항목 | 권장 버전 | 비고 |
| :--- | :--- | :--- |
| **Git** | 최신 Stable | `git clone` 및 소스 관리용 |
| **Node.js** | v20.x (LTS) 또는 v22.x | 프로젝트 요구사항 `>=18`, 현재 데스크탑 v24.13.0 사용 중 |
| **Python** | 3.14.x (64-bit) | PATH에 Python이 등록되어 있어야 함 |
| **VS Build Tools** | 2022 또는 2025 | **C++를 사용한 데스크탑 개발** 및 **Windows SDK** 필수 설치 |

> [!IMPORTANT]
> Visual Studio Build Tools 설치 시 'MSVC v143 - VS 2022 C++ x64/x86 빌드 도구'와 'Windows 11 SDK'가 포함되어야 네이티브 모듈 컴파일 에러가 발생하지 않습니다.

## 2. 자동화 설정 (setup_env.bat)

필수 항목 설치 후, 프로젝트 루트에서 `setup_env.bat`를 실행하면 다음 작업이 자동으로 진행됩니다.

1.  **uv 설치**: Python 패키지 관리를 위한 `uv` 도구 설치 여부 확인 및 설치.
2.  **Node 의존성 설치**: `npm install`을 통해 워크스페이스 내 모든 패키지 설치.
3.  **Python 가상환경**: `.venv` 생성 및 필요한 라이브러리 설치.
4.  **Turborepo 확인**: 전역 `turbo` 명령 사용 가능 여부 확인.

## 3. 실행 및 개발

환경 구축 완료 후, 다음 명령으로 프로젝트를 시작할 수 있습니다.

-   **전체 앱 실행**: `run.bat` 실행
-   **개별 앱 실행**: `npm run dev --workspace=@greenlink/web` (또는 admin, driver)
-   **지식 동기화**: `run_knowledge_sync.bat` 실행

## 4. 환경 변수 (.env)

노트북 환경에서도 `.env.local` 파일들을 데스크탑과 동일하게 복사해야 합니다. (보안상 Git에 포함되지 않음)
-   `apps/web/.env.local`
-   `apps/admin/.env.local`
-   `apps/driver/.env.local`
