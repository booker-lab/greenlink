# Troubleshooting: Tech-Stack-Organizer & Resource Optimization

이 문서는 `tech-stack-organizer` 플러그인 설치 중 발생한 경로 충돌 문제와 시스템 리소스(메모리 누수) 해결 과정을 기록합니다.

---

## 1. 이슈: 플러그인 설치 경로 충돌 및 [FATAL ERROR]

### **현상**
* 에이전트가 임의로 `plugins/tech-stack-organizer` 경로를 생성하여 설치 시도.
* `bootstrap-rules.py` 실행 시 `[FATAL ERROR] Non-standard installation path detected!` 발생하며 중단.
* 원인: 최신 버전의 플러그인 보안 정책상 반드시 `.agents/` 하위 경로를 강제함.

### **해결 방법**
1. 기존 잘못된 경로의 서브모듈 제거: `git submodule deinit`, `git rm`.
2. 표준 경로로 재설치: `git submodule add <URL> .agents/tech-stack-organizer`.
3. 설정 파일(`.gitmodules`) 수동 정리 및 동기화.

---

## 2. 이슈: 프로세스 누적으로 인한 시스템 버벅거림 (메모리 누수 현상)

### **현상**
* 다수의 `run_knowledge_sync.bat` 스크립트가 백그라운드에서 중복 실행됨.
* `python.exe`, `node.exe`, `git.exe` 좀비 프로세스들이 종료되지 않고 메모리를 과다 점유.
* 시스템 전체 반응 속도 저하 및 명령 실행 지연.

### **해결 방법 (PowerShell 긴급 조치)**
1. **관련 프로세스 전수 조사 및 강제 종료**:
   ```powershell
   Get-Process python*, node*, git*, cmd* | Stop-Process -Force
   ```
2. **비대한 콘솔 호스트(conhost) 정리**:
   ```powershell
   taskkill /F /IM "conhost.exe" /T /FI "MEMUSAGE gt 50000"
   ```
3. **가상환경 재정비**:
   * 기존 `.venv` 기반의 의존성 수동 업데이트(`pip install httpx`)를 통해 `uv` 설치 실패 이슈 우회.

---

## 3. 향후 방어 대책
* **경로 준수**: 모든 지능형 에이전트 협업 툴은 `.agents/` 디렉토리에 격리 설치한다.
* **프로세스 모니터링**: 긴 배양(Long-running) 스크립트 실행 전, 기존 프로세스가 남아있는지 반드시 확인한다.
* **Senior Architect 모드 활성화**: `.cursorrules`에 주입된 운영 프로토콜(ReAct Workflow)을 엄수하여 원자적 작업을 수행한다.

---
**최종 업데이트:** 2026-02-27
**보고자:** Antigravity (Senior Full-stack Architect)
