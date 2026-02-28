# [Invoke-Repomix.ps1]
# 그린링크 30분 AI 워크플로우용: 코드베이스 정적 덤프 생성기
# 보안 정책: .env, API 키, 인증서 파일 등을 이중으로 차단합니다.

$ErrorActionPreference = "Stop"

# 1. 루트 디렉토리 감지
$root = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { (Get-Location).Path }
# 만약 scripts 폴더 내부에서 실행된 경우 상위로 이동
if ($root -match "scripts$") { $root = Split-Path -Parent $root }

Write-Host "[*] 컨텍스트 덤프 생성 시작 (Root: $root)" -ForegroundColor Cyan

# 2. 출력 경로 및 디렉토리 보장
$outDir = Join-Path $root "docs"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
$outFile = Join-Path $outDir "repomix-output.md"

# 3. 포함 패턴 (그린링크 모노레포 최적화)
$IncludePatterns = "apps/web/src/**,apps/admin/src/**,packages/lib/src/**,supabase/migrations/**,docs/*.md,README.md,package.json,turbo.json"

# 4. 제외 패턴 (이중 보안 및 노이즈 제거)
# .env, *.pem, *.key, service-account*.json 등을 명시적으로 차단
$IgnorePatterns = "docs/repomix*.md,docs/tree.txt,**/.env,**/.env.*,**/.env.local,**/*.pem,**/service-account*.json,**/*.key,**/node_modules/**,**/.next/**,**/.turbo/**,**/.venv/**,**/dist/**,**/*.lock"

# 5. Repomix 실행
Push-Location $root
try {
    Write-Host "[*] Repomix 엔진 가동 중..." -ForegroundColor Gray
    npx repomix@latest --style markdown --include $IncludePatterns -i $IgnorePatterns -o $outFile --quiet
    
    if (Test-Path $outFile) {
        $size = (Get-Item $outFile).Length / 1KB
        Write-Host ("[SUCCESS] 덤프 완료: $outFile ({0:N2} KB)" -f $size) -ForegroundColor Green
        Write-Host "[!] 보안 주의: 생성된 덤프 파일에 민감 정보가 포함되지 않았는지 최종 확인하십시오." -ForegroundColor Yellow
    }
}
catch {
    Write-Error "[ERROR] Repomix 실행 중 오류가 발생했습니다: $_"
}
finally {
    Pop-Location
}
