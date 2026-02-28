This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: apps/web/src/**, apps/admin/src/**, packages/lib/src/**, supabase/migrations/**, docs/*.md, README.md, package.json, turbo.json
- Files matching these patterns are excluded: docs/repomix*.md, docs/tree.txt, **/.env, **/.env.*, **/.env.local, **/*.pem, **/service-account*.json, **/*.key, **/node_modules/**, **/.next/**, **/.turbo/**, **/.venv/**, **/dist/**, **/*.lock
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
apps/admin/src/app/auth/callback/route.ts
apps/admin/src/app/delivery/page.tsx
apps/admin/src/app/favicon.ico
apps/admin/src/app/fonts/GeistMonoVF.woff
apps/admin/src/app/fonts/GeistVF.woff
apps/admin/src/app/globals.css
apps/admin/src/app/layout.tsx
apps/admin/src/app/login/page.tsx
apps/admin/src/app/onboarding/page.tsx
apps/admin/src/app/orders/page.tsx
apps/admin/src/app/page.tsx
apps/admin/src/app/products/page.tsx
apps/admin/src/components/Admin/Onboarding/CategorySelector.tsx
apps/admin/src/components/Admin/Onboarding/ComplianceForm.tsx
apps/admin/src/components/Admin/Onboarding/ImageUploader.tsx
apps/admin/src/components/Admin/Onboarding/LocationSelector.tsx
apps/admin/src/components/Dashboard/GreenTemperatureGauge.tsx
apps/admin/src/components/Layout/Sidebar.tsx
apps/admin/src/components/Product/ProductForm.tsx
apps/web/src/app/api/delivery/complete/route.ts
apps/web/src/app/api/payment/webhook/route.ts
apps/web/src/app/auth/callback/route.ts
apps/web/src/app/category/[id]/page.tsx
apps/web/src/app/category/page.tsx
apps/web/src/app/farm/[id]/page.tsx
apps/web/src/app/favicon.ico
apps/web/src/app/fonts/GeistMonoVF.woff
apps/web/src/app/fonts/GeistVF.woff
apps/web/src/app/globals.css
apps/web/src/app/group-buy/[id]/page.tsx
apps/web/src/app/group-buy/page.tsx
apps/web/src/app/layout.tsx
apps/web/src/app/login/page.tsx
apps/web/src/app/mypage/page.tsx
apps/web/src/app/not-found.tsx
apps/web/src/app/order/page.tsx
apps/web/src/app/page.tsx
apps/web/src/app/payment/page.tsx
apps/web/src/app/product/[id]/page.tsx
apps/web/src/app/search/page.tsx
apps/web/src/components/Category/CategoryAccordion.tsx
apps/web/src/components/GroupBuy/CountdownTimer.tsx
apps/web/src/components/GroupBuy/GroupBuyCard.tsx
apps/web/src/components/GroupBuy/ZeroInventoryCard.tsx
apps/web/src/components/Layout/BottomNav.tsx
apps/web/src/components/Order/DeliveryDatePicker.tsx
apps/web/src/components/Order/PaymentButton.tsx
apps/web/src/components/Product/BackButton.tsx
apps/web/src/components/Product/ProductCard.tsx
apps/web/src/components/Product/ProductCTA.tsx
apps/web/src/hooks/useRealtimeDeal.ts
apps/web/src/middleware.ts
docs/checklist.md
docs/context.md
docs/CRITICAL_LOGIC.md
docs/mission.md
docs/WORKFLOW_30MIN_AI_CODING.md
docs/WORKFLOW_30MIN_PROMPTS.md
package.json
packages/lib/src/api/client.ts
packages/lib/src/api/external/naver-smartstore.ts
packages/lib/src/api/external/toss-payments.ts
packages/lib/src/api/index.ts
packages/lib/src/api/supabase.ts
packages/lib/src/constants/delivery.ts
packages/lib/src/constants/farms.ts
packages/lib/src/constants/group-buy.ts
packages/lib/src/constants/index.ts
packages/lib/src/constants/orders.ts
packages/lib/src/constants/products.ts
packages/lib/src/index.ts
packages/lib/src/stores/auth-store.ts
packages/lib/src/stores/delivery-store.ts
packages/lib/src/stores/farm-store.ts
packages/lib/src/stores/group-buy-store.ts
packages/lib/src/stores/index.ts
packages/lib/src/stores/order-store.ts
packages/lib/src/stores/product-store.ts
packages/lib/src/stores/user-store.ts
packages/lib/src/types/group-buy.ts
packages/lib/src/types/index.ts
packages/lib/src/types/models.ts
packages/lib/src/types/seller.ts
packages/lib/src/types/user.ts
packages/lib/src/utils.ts
packages/lib/src/utils/format.ts
packages/lib/src/utils/index.ts
packages/lib/src/utils/status-mapper.ts
README.md
supabase/migrations/20260225_zero_inventory_sync.sql
supabase/migrations/20260225000000_update_orders_delivery.sql
turbo.json
```

# Files

## File: apps/admin/src/app/auth/callback/route.ts
````typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    // Admin app defaults to the root dashboard (/) after social login
    const next = requestUrl.searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Ignore potential errors during server-side cookie setting
                        }
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            console.error('[Admin Auth Callback] Session exchange error:', error.message)
            return NextResponse.redirect(`${requestUrl.origin}/login?error=session_error`)
        }
    }

    // Redirect to the intended next page within the admin app
    console.log(`[Admin Auth Callback] Redirecting to: ${next}`)
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
}
````

## File: apps/admin/src/app/login/page.tsx
````typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@greenlink/ui";
import { createClient } from "@greenlink/lib";

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/";
    const [isLoading, setIsLoading] = useState<{ google: boolean; kakao: boolean }>({ google: false, kakao: false });
    const supabase = createClient();

    const handleLogin = async (provider: "google" | "kakao") => {
        try {
            setIsLoading((prev) => ({ ...prev, [provider]: true }));

            // Note: In a real Supabase setup, you'd use signInWithOAuth
            // For this audit/demo, we ensure the redirect URL points back to the admin app
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${returnUrl}`,
                },
            });

            if (error) throw error;
        } catch (error) {
            console.error(`[Admin Auth] ${provider} Login Error:`, error);
            alert("로그인에 실패했습니다. 관리자에게 문의해 주세요.");
        } finally {
            setIsLoading((prev) => ({ ...prev, [provider]: false }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-emerald-100/50 p-10 border border-emerald-50">
                <div className="text-center space-y-4 mb-10">
                    <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center text-4xl mx-auto">👨‍🌾</div>
                    <h1 className="text-3xl font-black text-emerald-900 tracking-tight">GreenLink Admin</h1>
                    <p className="text-gray-500 font-medium">생산자 비즈니스 포털에 오신 것을 환영합니다</p>
                </div>

                <div className="space-y-4">
                    <Button
                        className="w-full h-14 bg-[#FEE500] border-none text-[#000000] hover:bg-[#FEE500]/90 font-bold rounded-2xl shadow-sm flex items-center justify-center gap-3"
                        onClick={() => handleLogin("kakao")}
                        disabled={isLoading.kakao || isLoading.google}
                    >
                        {isLoading.kakao ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3C6.477 3 2 6.425 2 10.648c0 2.7 1.838 5.075 4.605 6.355-.152.54-1.01 3.428-1.043 3.553-.04.145.05.138.106.103.076-.048 3.558-2.316 4.97-3.238.44.062.89.094 1.36.094 5.523 0 10-3.425 10-7.648C22 6.425 17.523 3 12 3z" />
                            </svg>
                        )}
                        카카오 계정으로 관리자 로그인
                    </Button>

                    <Button
                        className="w-full h-14 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-2xl shadow-sm flex items-center justify-center gap-3"
                        onClick={() => handleLogin("google")}
                        disabled={isLoading.kakao || isLoading.google}
                    >
                        {isLoading.google ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        구글 계정으로 관리자 로그인
                    </Button>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        GreenLink Partner Ecosystem v2.0<br />
                        본 포털은 사전에 등록된 생산자 및 관리자만 이용 가능합니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
````

## File: apps/web/src/app/not-found.tsx
````typescript
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="mb-6 text-6xl">🌿</div>
            <h2 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-[280px] mx-auto">
                요청하신 상품이나 농장 정보가 존재하지 않거나 주소가 변경되었습니다.
            </p>
            <Link
                href="/"
                className="mt-8 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
            >
                그린링크 홈으로
            </Link>
        </div>
    )
}
````

## File: docs/checklist.md
````markdown
# CHECKLIST

모든 개발 및 배포 단계에서 다음 항목을 물리적 수치로 검증한다.

## 1. 개발 표준 준수 (Standards)

- [ ] `docs/CRITICAL_LOGIC.md` 원칙 위배 여부 확인.
- [ ] TypeScript Strict Type Checking (`npm run type-check`) 통과 여부.
- [ ] `Inter` 폰트 및 디자인 시스템 일관성 유지.
- [ ] **이모지 사용 금지** 및 한국어 전문 용어 사용.

## 2. 런타임 안정성 (Stability)

- [ ] 브라우저 콘솔 내 `navigator.locks` 타임아웃 에러 발생 여부 (0이어야 함).
- [ ] 동적 라우트(category, product, farm)의 404 핸들링 작동 여부.
- [ ] 레이아웃 하이드레이션 경고 발생 여부 (0이어야 함).

## 3. 보안 및 인프라 (Security & Infra)

- [ ] `.env.local` 민감 정보의 `repomix` 덤프 포함 여부 (절대 제외).
- [ ] Admin/Web 앱의 세션 독립성 및 리다이렉트 루프 체크.
- [ ] Webhook 엔드포인트의 서버사이드 유효성 검증 로직 작동 여부.

## 4. 생산성 도구 (Tools)

- [ ] `Invoke-Repomix.ps1` 실행 후 덤프 파일 용량 및 정합성 확인.
- [ ] 30분 AI 워크플로우를 통한 지시서 및 코드 생성 품질 확인.
````

## File: docs/context.md
````markdown
# CONTEXT

GreenLink는 모노레포 구조의 하이퍼로컬 화훼 유통 플랫폼으로, Next.js와 Supabase를 핵심 기술 스택으로 사용한다.

## 기술 스택 (Tech Stack)

- **Framework**: Next.js 15.0.0 (App Router)
- **Language**: TypeScript (Strict Type Hinting)
- **Database/Auth**: Supabase SSR (@supabase/ssr)
- **State Management**: Zustand
- **Styling**: Vanilla CSS, Native SVG
- **Infra**: Turborepo, PowerShell 7 (Windows 11 Native)

## 아키텍처 및 인프라 (Architecture & Infra)

- **Monorepo Structure**:
  - `apps/web`: 소비자 플랫폼 (Port 3000)
  - `apps/admin`: 셀러 비즈 포털 (Port 3001)
  - `apps/driver`: 배송 파트너 앱 (Port 3002)
  - `packages/lib`: 공통 비즈니스 로직 및 API (ApiSkeleton)
  - `packages/ui`: 공통 UI 컴포넌트 라이브러리 (Atomic Design 지향)
- **SSOT**: `docs/CRITICAL_LOGIC.md`
- **인증 방식**: Supabase OAuth (Google) 및 쿠키 기반 세션 동기화.

## 주요 상태 및 최근 변경점

- **Supabase Singleton**: `packages/lib/src/api/supabase.ts`에서 클라이언트 사이드 싱글톤 패턴 적용 완료.
- **404 Handler**: `apps/web/src/app/not-found.tsx` 구축 및 동적 라우트 리팩토링 완료.
- **Admin Auth**: `apps/admin` 전용 로그인 및 콜백 라우트 복구 완료.
````

## File: docs/mission.md
````markdown
# MISSION

본 프로젝트의 현재 미션은 GreenLink v2 아키텍처의 무결성을 확보하고, 상용 수준의 안정성을 갖춘 하이퍼로컬 화훼 유통 플랫폼을 완성하는 것이다.

## 최우선 목표 (Top Priorities)

1. **시스템 안정성 확보**: Supabase 싱글톤 패턴 및 전역 404 핸들러를 통한 런타임 예외 제거.
2. **도메인 격리 완결**: 소비자용 Web(3000)과 셀러용 Admin(3001) 앱의 물리적 분리 및 인증 인프라 동기화.
3. **AI 워크플로우 정착**: Repomix 기반의 고성능 코드베이스 덤프 및 30분 AI 코딩 프로세스 표준화.
4. **글로벌 룰 준수**: 모든 소통과 산출물에서 시니어 아키텍트 페르소나와 기술 표준을 엄격히 유지.

## 현재 작업 단계

- Phase 6.0: 종합 무결성 감사 완료 및 인프라 재가동.
- 문서화 고도화: 모든 기술 문서를 글로벌 룰(이모지 금지, 아키텍처 명시 등)에 맞춰 정제 중.
````

## File: apps/admin/src/app/onboarding/page.tsx
````typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ComplianceVO, SellerEntity } from "@greenlink/lib";
import { createClient } from "@greenlink/lib";

// Step Component Imports (To be created)
// import WelcomeStep from "@/components/Admin/Onboarding/WelcomeStep";
// import BusinessInfoStep from "@/components/Admin/Onboarding/BusinessInfoStep";
// ...

import CategorySelector from "@/components/Admin/Onboarding/CategorySelector";
import LocationSelector from "@/components/Admin/Onboarding/LocationSelector";
import ImageUploader from "@/components/Admin/Onboarding/ImageUploader";
import ComplianceForm from "@/components/Admin/Onboarding/ComplianceForm";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface BusinessProfileData {
    category?: string;
    images?: string[];
}

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createClient();
    const [currentStep, setCurrentStep] = useState<Step>(1);

    // Onboarding State (Step 1 SellerEntity & ComplianceVO match)
    const [formData, setFormData] = useState<Partial<SellerEntity> & BusinessProfileData>({
        status: 'ONBOARDING',
        compliance: {
            privacyPolicyAgreed: false,
            locationInfoAgreed: false,
            sellerInfoNoticeAgreed: false,
            agreedAt: new Date().toISOString()
        }
    });

    const nextStep = () => currentStep < 7 && setCurrentStep((prev) => (prev + 1) as Step);
    const prevStep = () => currentStep > 1 && setCurrentStep((prev) => (prev - 1) as Step);

    const updateFormData = (data: Partial<SellerEntity & BusinessProfileData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const updateCompliance = (data: Partial<ComplianceVO>) => {
        setFormData((prev) => ({
            ...prev,
            compliance: { ...(prev.compliance as ComplianceVO), ...data }
        }));
    };

    const handleComplete = async () => {
        console.log("[Admin Onboarding] Final Data Submission:", formData);
        // TODO: API integration for saving seller profile
        alert("온보딩이 완료되었습니다. 대시보드로 이동합니다.");
        router.push("/");
    };

    // Validation per step
    const canGoNext = () => {
        if (currentStep === 2) return !!formData.businessName && !!formData.ownerName;
        if (currentStep === 3) return !!formData.category;
        if (currentStep === 4) return !!formData.location;
        if (currentStep === 6) return formData.compliance?.privacyPolicyAgreed && formData.compliance?.locationInfoAgreed;
        return true;
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
            {/* Header / Progress Bar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px] font-black">G</div>
                    <span className="text-sm font-black tracking-tighter">GreenLink Biz</span>
                </div>
                <div className="flex gap-1.5 overflow-hidden">
                    {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                        <div
                            key={step}
                            className={`h-1 rounded-full transition-all duration-500 ${step <= currentStep ? "w-6 bg-emerald-600" : "w-1 bg-gray-100"
                                }`}
                        />
                    ))}
                </div>
                <button
                    onClick={() => router.push("/")}
                    className="text-[10px] font-black text-gray-400 hover:text-gray-900"
                >
                    닫기
                </button>
            </header>

            {/* Main Step Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full overflow-y-auto">
                <div className="w-full transition-all duration-300 transform">
                    {currentStep === 1 && (
                        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner">🌱</div>
                            <h1 className="text-3xl font-black leading-tight text-gray-900">
                                환영합니다!<br />
                                <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-8">농장 비즈프로필</span>을<br />
                                만들어볼까요?
                            </h1>
                            <p className="text-sm text-gray-400 font-medium px-4">
                                그린링크 비즈니스 서비스를 이용하면<br />
                                동네 이웃들에게 우리 농장 상품을 직접 알릴 수 있어요.
                            </p>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100/50">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Potential Reach</p>
                                <p className="text-lg font-black text-gray-700">현재 <span className="text-emerald-600">3,492명</span>의 이웃이<br />꽃 선물을 기다리고 있어요.</p>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 w-full text-left">
                            <h2 className="text-2xl font-black">업체 정보를 입력해주세요</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">업체명</label>
                                    <input
                                        type="text"
                                        placeholder="예: 디어 오키드"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                        onChange={(e) => updateFormData({ businessName: e.target.value })}
                                        value={formData.businessName || ""}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">대표자명</label>
                                    <input
                                        type="text"
                                        placeholder="실명을 입력해주세요"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                                        onChange={(e) => updateFormData({ ownerName: e.target.value })}
                                        value={formData.ownerName || ""}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <CategorySelector
                            selectedId={formData.category || ""}
                            onSelect={(id) => updateFormData({ category: id })}
                        />
                    )}

                    {currentStep === 4 && (
                        <LocationSelector
                            location={formData.location}
                            onUpdate={(loc) => updateFormData({ location: loc })}
                        />
                    )}

                    {currentStep === 5 && (
                        <ImageUploader
                            onUpdate={(imgs) => updateFormData({ images: imgs })}
                        />
                    )}

                    {currentStep === 6 && (
                        <ComplianceForm
                            compliance={formData.compliance as ComplianceVO}
                            onUpdate={updateCompliance}
                        />
                    )}

                    {currentStep === 7 && (
                        <div className="space-y-6 text-center animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto text-white shadow-xl shadow-emerald-200">✅</div>
                            <h2 className="text-2xl font-black">준비가 모두 끝났습니다!</h2>
                            <p className="text-sm text-gray-400 font-medium">이제 디어 오키드의 상품을 등록하고<br />이웃들에게 첫 소식을 전해보세요.</p>
                            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-700 text-xs font-bold">
                                사업자 인증 배지는 내부 승인 후 24시간 이내 부여됩니다.
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Navigation Buttons */}
            <footer className="p-6 pb-10 border-t border-gray-50 bg-white shadow-[-10px_0_20px_rgba(0,0,0,0.01)]">
                <div className="max-w-lg mx-auto flex gap-3">
                    {currentStep > 1 && (
                        <button
                            onClick={prevStep}
                            className="px-8 py-4 bg-gray-100 text-gray-400 text-sm font-black rounded-2xl hover:bg-gray-200 hover:text-gray-900 transition-all active:scale-95"
                        >
                            이전
                        </button>
                    )}
                    <button
                        onClick={currentStep === 7 ? handleComplete : nextStep}
                        disabled={!canGoNext()}
                        className={`flex-1 py-4 text-sm font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all ${canGoNext()
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
                            : "bg-gray-100 text-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {currentStep === 7 ? "비즈니스 시작하기" : "다음 단계로"}
                    </button>
                </div>
            </footer>
        </div>
    );
}
````

## File: apps/admin/src/app/orders/page.tsx
````typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@greenlink/lib";
import { useRouter } from "next/navigation";

interface Order {
    id: string;
    buyer_name: string;
    buyer_phone: string;
    buyer_address: string;
    quantity: number;
    total_price: number;
    status: string;
    delivery_method: string;
    tracking_number: string | null;
    created_at: string;
    product_id: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [trackingInput, setTrackingInput] = useState<{ [key: string]: string }>({});
    const supabase = createClient();
    const router = useRouter();

    async function fetchOrders() {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("[Admin Domain] Failed to fetch orders:", error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    async function handleCompleteDelivery(order: Order) {
        if (!confirm(`${order.buyer_name}님의 배송을 완료 처리하시겠습니까? 즉시 정산이 확정됩니다.`)) return;

        setProcessingId(order.id);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('/api/delivery/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    orderId: order.id,
                    deliveryMethod: 'GREENLINK_DRIVER',
                    driverId: session?.user.id
                })
            });

            if (response.ok) {
                alert('배송 및 정산 처리가 완료되었습니다.');
                fetchOrders();
            } else {
                const err = await response.json();
                throw new Error(err.error || '처리 실패');
            }
        } catch (err: any) {
            console.error("[Admin Domain] Delivery completion error:", err);
            alert(`오류 발생: ${err.message}`);
        } finally {
            setProcessingId(null);
        }
    }

    async function handleRegisterTracking(order: Order) {
        const tracking = trackingInput[order.id];
        if (!tracking) {
            alert('운송장 번호를 입력해주세요.');
            return;
        }

        setProcessingId(order.id);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('/api/delivery/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    orderId: order.id,
                    deliveryMethod: 'COURIER',
                    trackingNumber: tracking
                })
            });

            if (response.ok) {
                alert('운송장 등록이 완료되었습니다.');
                fetchOrders();
            } else {
                const err = await response.json();
                throw new Error(err.error || '처리 실패');
            }
        } catch (err: any) {
            console.error("[Admin Domain] Tracking registration error:", err);
            alert(`오류 발생: ${err.message}`);
        } finally {
            setProcessingId(null);
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ESCROW_DEPOSIT': return <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase">Paid (Escrow)</span>;
            case 'DISPATCHED': return <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-600 text-[10px] font-black uppercase">On Delivery</span>;
            case 'DELIVERED': return <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">Delivered</span>;
            default: return <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-[10px] font-black uppercase">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">주문 관리</h2>
                    <p className="text-sm text-gray-400 mt-1 font-medium">최신 주문 내역 및 배송 상태를 관리합니다.</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />)}
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">주문 내역이 존재하지 않습니다.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl p-6 border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-100/20 transition-all group overflow-hidden relative">
                            {/* Accent line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/10 to-transparent" />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-xs font-bold text-gray-500 truncate w-32">#{order.id.split('-')[0]}</p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">{order.buyer_name}</h3>
                                    <p className="text-xs text-blue-600 font-extrabold">{order.buyer_phone}</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-400">배송 주소</span>
                                        <span className="text-gray-700 text-right truncate ml-4">{order.buyer_address}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-400">품목/수량</span>
                                        <span className="text-gray-900 uppercase tracking-tighter">GB ITEM × {order.quantity}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-black">
                                        <span className="text-gray-400">총 결제 금액</span>
                                        <span className="text-emerald-600 text-sm">₩{order.total_price.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="pt-2">
                                    {order.status === 'ESCROW_DEPOSIT' && (
                                        <div className="space-y-3">
                                            {order.delivery_method === 'GREENLINK_DRIVER' ? (
                                                <button
                                                    disabled={processingId === order.id}
                                                    onClick={() => handleCompleteDelivery(order)}
                                                    className="w-full py-3 bg-emerald-600 text-white text-sm font-black rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                                                >
                                                    {processingId === order.id ? '처리 중...' : '배송 완료 (정산 확정)'}
                                                </button>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="운송장 번호 입력"
                                                        value={trackingInput[order.id] || ''}
                                                        onChange={(e) => setTrackingInput({ ...trackingInput, [order.id]: e.target.value })}
                                                        className="w-full px-4 py-2 text-xs border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                                                    />
                                                    <button
                                                        disabled={processingId === order.id}
                                                        onClick={() => handleRegisterTracking(order)}
                                                        className="w-full py-3 bg-gray-900 text-white text-sm font-black rounded-xl hover:bg-black active:scale-95 transition-all disabled:opacity-50"
                                                    >
                                                        운송장 등록하기
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {order.status === 'DISPATCHED' && (
                                        <div className="bg-orange-50 text-orange-700 p-3 rounded-xl text-center text-xs font-black">
                                            운송장: {order.tracking_number || '등록됨'}
                                        </div>
                                    )}
                                    {order.status === 'DELIVERED' && (
                                        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-center text-xs font-black">
                                            정산 완료됨
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
````

## File: apps/admin/src/components/Admin/Onboarding/CategorySelector.tsx
````typescript
"use client";

interface Category {
    id: string;
    name: string;
    icon: string;
    desc: string;
}

const CATEGORIES: Category[] = [
    { id: "flower", name: "꽃집 / 꽃배달", icon: "🌸", desc: "생화, 분화 등 식물 판매" },
    { id: "organic", name: "과일 / 채소", icon: "🥬", desc: "유기농 산지 농산물" },
    { id: "cafe", name: "카페 / 라이프", icon: "☕", desc: "식물 기반 카페 및 샵" },
    { id: "other", name: "기타 농원", icon: "🏡", desc: "자유로운 업종 등록" },
];

interface Props {
    selectedId: string;
    onSelect: (id: string) => void;
}

export default function CategorySelector({ selectedId, onSelect }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 w-full">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${selectedId === cat.id
                            ? "border-emerald-600 bg-emerald-50/30"
                            : "border-gray-50 bg-gray-50/50 hover:bg-white hover:border-emerald-100"
                        }`}
                >
                    <div className="text-3xl bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
                        {cat.icon}
                    </div>
                    <div className="text-left">
                        <p className={`text-sm font-black ${selectedId === cat.id ? "text-emerald-700" : "text-gray-900"}`}>
                            {cat.name}
                        </p>
                        <p className="text-[11px] font-bold text-gray-400 mt-0.5">{cat.desc}</p>
                    </div>
                    {selectedId === cat.id && (
                        <div className="ml-auto w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white scale-110">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17L4 12" /></svg>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
````

## File: apps/admin/src/components/Admin/Onboarding/ComplianceForm.tsx
````typescript
"use client";

import { ComplianceVO } from "@greenlink/lib";

interface Props {
    compliance: ComplianceVO;
    onUpdate: (data: Partial<ComplianceVO>) => void;
}

export default function ComplianceForm({ compliance, onUpdate }: Props) {
    const handleAllAgreed = () => {
        const isAllChecked = compliance.privacyPolicyAgreed && compliance.locationInfoAgreed && compliance.sellerInfoNoticeAgreed;
        onUpdate({
            privacyPolicyAgreed: !isAllChecked,
            locationInfoAgreed: !isAllChecked,
            sellerInfoNoticeAgreed: !isAllChecked,
            agreedAt: new Date().toISOString()
        });
    };

    const isAllChecked = compliance.privacyPolicyAgreed && compliance.locationInfoAgreed && compliance.sellerInfoNoticeAgreed;

    return (
        <div className="space-y-6 w-full text-left">
            <h2 className="text-2xl font-black text-gray-900">그린링크 비즈니스 시작을 위해<br />약관에 동의해주세요</h2>

            <button
                onClick={handleAllAgreed}
                className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${isAllChecked ? "border-emerald-600 bg-emerald-50/50" : "border-gray-100 bg-white"
                    }`}
            >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isAllChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-transparent"
                    }`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17L4 12" /></svg>
                </div>
                <span className="font-black text-gray-800">모두 동의합니다</span>
            </button>

            <div className="space-y-4 px-2">
                <div className="flex items-center justify-between group">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={compliance.privacyPolicyAgreed}
                            onChange={(e) => onUpdate({ privacyPolicyAgreed: e.target.checked })}
                            className="w-5 h-5 accent-emerald-600 rounded-md border-gray-200"
                        />
                        <span className="text-sm font-bold text-gray-600">[필수] 개인정보 수집 및 이용 동의</span>
                    </label>
                    <button className="text-[10px] font-black text-gray-300 hover:text-emerald-600 underline">보기</button>
                </div>

                <div className="flex items-center justify-between group">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={compliance.locationInfoAgreed}
                            onChange={(e) => onUpdate({ locationInfoAgreed: e.target.checked })}
                            className="w-5 h-5 accent-emerald-600 rounded-md border-gray-200"
                        />
                        <span className="text-sm font-bold text-gray-600">[필수] 위치 정보 이용 동의</span>
                    </label>
                    <button className="text-[10px] font-black text-gray-300 hover:text-emerald-600 underline">보기</button>
                </div>

                <div className="flex items-center justify-between group">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={compliance.sellerInfoNoticeAgreed}
                            onChange={(e) => onUpdate({ sellerInfoNoticeAgreed: e.target.checked })}
                            className="w-5 h-5 accent-emerald-600 rounded-md border-gray-200"
                        />
                        <span className="text-sm font-bold text-gray-600">[필수] 판매자 정보 상시 노출 의무 확인</span>
                    </label>
                    <button className="text-[10px] font-black text-gray-300 hover:text-emerald-600 underline">보기</button>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl text-[10px] leading-relaxed text-gray-400 font-medium">
                그린링크는 전자상거래법 및 개인정보보호법을 준수합니다. <br />
                동의하신 내용은 마이페이지에서 언제든지 확인하실 수 있습니다.
            </div>
        </div>
    );
}
````

## File: apps/admin/src/components/Admin/Onboarding/ImageUploader.tsx
````typescript
"use client";

import { useState } from "react";

interface Props {
    onUpdate: (images: string[]) => void;
}

export default function ImageUploader({ onUpdate }: Props) {
    const [images, setImages] = useState<string[]>([]);

    const handleUpload = () => {
        // Mock image upload
        const newImage = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Date.now()}`;
        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        onUpdate(updatedImages);
    };

    const handleRemove = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onUpdate(updatedImages);
    };

    return (
        <div className="space-y-6 w-full text-left">
            <h2 className="text-2xl font-black text-gray-900">농장 사진을 등록해주세요</h2>
            <p className="text-xs text-gray-400 font-bold -mt-4">고객들에게 신뢰를 주는 첫인상입니다. (최대 20장)</p>

            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={handleUpload}
                    className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-emerald-600 shadow-sm transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 group-hover:text-emerald-400">{images.length}/20</span>
                </button>

                {images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl bg-gray-100 relative group overflow-hidden border border-gray-100 shadow-sm">
                        <img src={img} alt="Farm" className="w-full h-full object-cover" />
                        <button
                            onClick={() => handleRemove(idx)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black/50 backdrop-blur-md rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                        </button>
                        {idx === 0 && (
                            <div className="absolute bottom-0 left-0 w-full bg-emerald-600 text-white text-[8px] font-black py-1 text-center">
                                대표 사진
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                <span className="text-lg">📸</span>
                <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                    팁: 농장 내부 전경이나 정성스럽게 피어난 꽃 사진을 올리면 <br />
                    이웃들의 관심도가 2.5배 높아져요!
                </p>
            </div>
        </div>
    );
}
````

## File: apps/admin/src/components/Admin/Onboarding/LocationSelector.tsx
````typescript
"use client";

import { useState } from "react";
import { LocationVO } from "@greenlink/lib";

interface Props {
    location: LocationVO | undefined;
    onUpdate: (data: LocationVO) => void;
}

// Mock search results
const MOCK_RESULTS = [
    { address: "서울특별시 강남구 역삼동", city: "서울", district: "강남구", neighborhood: "역삼동", reach: 8420 },
    { address: "서울특별시 서초구 서초동", city: "서울", district: "서초구", neighborhood: "서초동", reach: 7150 },
    { address: "경기도 성남시 분당구 정자동", city: "경기도", district: "성남시 분당구", neighborhood: "정자동", reach: 12400 },
];

export default function LocationSelector({ location, onUpdate }: Props) {
    const [search, setSearch] = useState(location?.address || "");
    const [isSearching, setIsSearching] = useState(false);

    const handleSelect = (result: typeof MOCK_RESULTS[0]) => {
        onUpdate({
            address: result.address,
            city: result.city,
            district: result.district,
            coordinates: { lat: 37.5, lng: 127.0 } // Mock coordinates
        });
        setSearch(result.address);
        setIsSearching(false);
    };

    return (
        <div className="space-y-6 w-full text-left">
            <h2 className="text-2xl font-black text-gray-900">어느 지역에서 활동하시나요?</h2>
            <p className="text-xs text-gray-400 font-bold -mt-4">동/읍/면 단위로 검색해주세요.</p>

            <div className="relative">
                <input
                    type="text"
                    placeholder="동네 이름으로 검색"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsSearching(e.target.value.length > 0);
                    }}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>

                {isSearching && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-gray-50 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                        {MOCK_RESULTS.map((res) => (
                            <button
                                key={res.address}
                                onClick={() => handleSelect(res)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-emerald-50 transition-colors text-left border-b border-gray-50 last:border-none"
                            >
                                <div>
                                    <p className="text-sm font-black text-gray-800">{res.neighborhood}</p>
                                    <p className="text-[11px] font-bold text-gray-400">{res.address}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase">Potential Reach</p>
                                    <p className="text-xs font-black text-emerald-800">{res.reach.toLocaleString()}명</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {location && !isSearching && (
                <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-200 animate-in zoom-in duration-300">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Selected Region</p>
                    <p className="text-lg font-black">{location.address}</p>
                    <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                        <span className="text-xs font-bold opacity-80">이 동네의 활성 이웃 고객</span>
                        <span className="text-lg font-black">2,490명+</span>
                    </div>
                </div>
            )}
        </div>
    );
}
````

## File: apps/admin/src/components/Dashboard/GreenTemperatureGauge.tsx
````typescript
"use client";

import { useEffect, useState } from "react";
import { cn } from "@greenlink/ui";

interface GreenTemperatureGaugeProps {
    temperature: number;
}

export function GreenTemperatureGauge({ temperature }: GreenTemperatureGaugeProps) {
    const [fillLevel, setFillLevel] = useState(0);

    useEffect(() => {
        // Animate fill
        const timer = setTimeout(() => setFillLevel(temperature), 300);
        return () => clearTimeout(timer);
    }, [temperature]);

    const getEmoji = (temp: number) => {
        if (temp >= 50) return "🔥";
        if (temp >= 36.5) return "😊";
        return "😐";
    };

    const getColor = (temp: number) => {
        if (temp >= 50) return "text-orange-500";
        if (temp >= 36.5) return "text-green-500";
        return "text-gray-500";
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-300 to-green-600 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(fillLevel, 100)}%` }}
                />
            </div>
            <div className="mt-2 flex items-center gap-2">
                <span className={cn("text-2xl font-bold", getColor(temperature))}>
                    {temperature}°C
                </span>
                <span className="text-2xl">{getEmoji(temperature)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">나의 초록 온도 (매너 온도)</p>
        </div>
    );
}
````

## File: apps/web/src/app/api/delivery/complete/route.ts
````typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, deliveryMethod, trackingNumber, driverId, farmId } = body;

        // 1. 필수 파라미터 검증
        if (!orderId || !deliveryMethod) {
            console.error('[Delivery Domain] Missing required parameters: orderId or deliveryMethod');
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // 2. 관리자/드라이버 RBAC 권한 검증 기틀 (서비스 롤 키 사용 전 클라이언트 세션 토큰 확인 필요)
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            console.error('[Delivery Domain] Unauthorized access attempt: Missing Authorization header');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 백그라운드 트랜잭션 처리를 위한 Service Role Client 생성
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 3. 배송 완료 및 정산 상태 업데이트 트랜잭션
        if (deliveryMethod === 'GREENLINK_DRIVER') {
            // 그린링크 드라이버 직배송: 배송 완료 시 즉시 에스크로 정산 확정
            const { error } = await supabase.rpc('confirm_delivery_and_settle', {
                p_order_id: orderId,
                p_driver_id: driverId || null
            });

            if (error) {
                console.error(`[Delivery Domain] Settlement transaction failed for order: ${orderId}`, error);
                throw error;
            }
            console.log(`[Delivery Domain] Driver delivery completed. Escrow settled for order: ${orderId}`);
        }
        else if (deliveryMethod === 'COURIER') {
            // 일반 택배 배송: 운송장 등록 및 상태 변경 (실제 정산은 택배사 배송 완료 API 연동 시 트리거)
            if (!trackingNumber) {
                console.error('[Delivery Domain] Courier method requires trackingNumber');
                return NextResponse.json({ error: 'Missing tracking number' }, { status: 400 });
            }

            const { error } = await supabase
                .from('orders')
                .update({
                    tracking_number: trackingNumber,
                    status: 'DISPATCHED',
                    delivery_method: 'COURIER'
                })
                .eq('id', orderId);

            if (error) {
                console.error(`[Delivery Domain] Failed to update tracking info for order: ${orderId}`, error);
                throw error;
            }
            console.log(`[Delivery Domain] Courier tracking initiated. Order: ${orderId}, Tracking: ${trackingNumber}`);
        }
        else {
            console.error(`[Delivery Domain] Unknown delivery method: ${deliveryMethod}`);
            return NextResponse.json({ error: 'Invalid delivery method' }, { status: 400 });
        }

        return NextResponse.json({ status: 'success', orderId }, { status: 200 });

    } catch (error) {
        console.error('[Delivery Domain] Delivery processing exception occurred:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
````

## File: apps/web/src/app/api/payment/webhook/route.ts
````typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imp_uid, merchant_uid, status } = body;

        // 1. 필수 파라미터 검증
        if (!imp_uid || !merchant_uid) {
            console.error('[Payment Domain] Webhook Error: Missing imp_uid or merchant_uid');
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // 2. PortOne API 인증 토큰 발급
        const portoneSecret = process.env.PORTONE_API_SECRET;
        const portoneKey = process.env.PORTONE_API_KEY;

        if (!portoneSecret || !portoneKey) {
            console.error('[Payment Domain] PortOne API credentials missing in environment');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const tokenResponse = await fetch('https://api.iamport.kr/users/getToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imp_key: portoneKey, imp_secret: portoneSecret })
        });

        if (!tokenResponse.ok) {
            console.error(`[Payment Domain] PortOne Token Issuance Failed. Status: ${tokenResponse.status}`);
            return NextResponse.json({ error: 'Token issuance failed' }, { status: 500 });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.response.access_token;

        // 3. 결제 단건 조회 및 상태 검증 (서버사이드 대조)
        const paymentResponse = await fetch(`https://api.iamport.kr/payments/${imp_uid}`, {
            method: 'GET',
            headers: { 'Authorization': accessToken }
        });

        const paymentData = await paymentResponse.json();
        const paymentInfo = paymentData.response;

        if (paymentInfo.status !== 'paid') {
            console.warn(`[Payment Domain] Payment not complete. Current Status: ${paymentInfo.status}`);
            return NextResponse.json({ message: 'Payment is not in paid status' }, { status: 200 });
        }

        // 4. DB 트랜잭션 연동 (create_escrow_order_txn RPC 호출)
        // Webhook은 백그라운드 서버 투 서버 통신이므로 Service Role Key 사용
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // PortOne custom_data 필드를 통한 상품 메타데이터 파싱
        const customData = paymentInfo.custom_data ? JSON.parse(paymentInfo.custom_data) : {};

        const { data, error } = await supabase.rpc('create_escrow_order_txn', {
            p_product_id: customData.productId || 'UNKNOWN',
            p_buyer_name: paymentInfo.buyer_name,
            p_buyer_phone: paymentInfo.buyer_tel,
            p_buyer_address: paymentInfo.buyer_addr,
            p_quantity: customData.quantity || 1,
            p_total_price: paymentInfo.amount
        });

        if (error) {
            console.error('[Payment Domain] RPC Transaction Failed:', error);
            return NextResponse.json({ error: 'Database transaction failed' }, { status: 500 });
        }

        console.log(`[Payment Domain] Webhook Success. Order created: ${data}`);
        return NextResponse.json({ status: 'success', orderId: data }, { status: 200 });

    } catch (error) {
        console.error('[Payment Domain] Webhook Exception Occurred:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
````

## File: apps/web/src/components/Category/CategoryAccordion.tsx
````typescript
"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// 카테고리 데이터 (8도감 스타일)
const categoryData = [
    {
        id: 1,
        name: "채소/샐러드",
        icon: "🥬",
        subcategories: [
            "전체", "시금치", "쌈/잎채소/배추류", "딸기/블루베리/베리류",
            "뿌리/줄기/단호박", "양상추/양배추", "친환경", "무화과/무화과잎/기타과일",
            "감자/고구마/당근", "키위/키위수/망고", "오이/가지/주스채소", "파인애플/바나나/기타과일",
            "브로콜리/컬리플라워", "당근/비트모음", "고춧잎/한식/깻잎채", "청포도/생청포도",
            "샐러드용채소", "허브/세척", "모듬채소"
        ]
    },
    {
        id: 2,
        name: "저장채소",
        icon: "🥕",
        subcategories: [
            "시세", "육수수/초당옥수수/강낭콩",
            "고추/마늘/생강/매실", "가지/오이/호박",
            "우엉/연근/카레분", "배추", "양파/마늘/대파/생강",
            "두릅/송이/버섯", "콩나물/콩"
        ]
    },
    {
        id: 3,
        name: "김치",
        icon: "🥢",
        subcategories: [
            "전체", "배추김치", "무무침치", "열무김치", "깍두기", "갓/파김치"
        ]
    },
    {
        id: 4,
        name: "과일",
        icon: "🍎",
        subcategories: [
            "전체", "사과", "배", "감", "귤/오렌지", "포도",
            "딸기", "수박", "멜론", "복숭아", "자두", "체리"
        ]
    },
    {
        id: 5,
        name: "화훼",
        icon: "🌸",
        subcategories: [
            "전체", "장미", "국화", "튤립", "백합", "카네이션",
            "안개꽃", "거베라", "프리지아", "다육/선인장", "관엽식물", "화분"
        ]
    },
    {
        id: 6,
        name: "축산/계란",
        icon: "🥩",
        subcategories: [
            "전체", "소고기", "돼지고기", "닭고기", "오리고기",
            "양고기", "계란", "유정란", "메추리알"
        ]
    },
    {
        id: 7,
        name: "수산물",
        icon: "🐟",
        subcategories: [
            "전체", "생선", "조개/갑각류", "해조류", "건어물",
            "젓갈", "활어", "회/초밥", "훈제/절임"
        ]
    },
    {
        id: 8,
        name: "가공식품",
        icon: "🥫",
        subcategories: [
            "전체", "통조림", "라면/면류", "소스/양념", "장류",
            "식용유", "밀가루/전분", "견과류", "건조식품"
        ]
    }
];

interface CategoryAccordionProps {
    initialOpenCategory?: number;
    onCategorySelect?: (main: string, sub: string) => void;
}

export function CategoryAccordion({ initialOpenCategory, onCategorySelect }: CategoryAccordionProps) {
    const [openCategories, setOpenCategories] = useState<number[]>(
        initialOpenCategory ? [initialOpenCategory] : [1]
    );

    const toggleCategory = (categoryId: number) => {
        setOpenCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const isOpen = (categoryId: number) => openCategories.includes(categoryId);

    return (
        <div className="bg-white">
            {/* Category Accordions */}
            <div className="divide-y divide-gray-100 max-h-[40vh] overflow-y-auto scrollbar-hide">
                {categoryData.map((category) => (
                    <div key={category.id}>
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(category.id)}
                            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{category.icon}</span>
                                <span className="font-semibold text-gray-800">{category.name}</span>
                            </div>
                            <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen(category.id) ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Subcategories Grid */}
                        {isOpen(category.id) && (
                            <div className="bg-gray-50 px-4 py-3">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {category.subcategories.map((sub, index) => (
                                        <button
                                            key={index}
                                            onClick={() => onCategorySelect?.(category.name, sub)}
                                            className="text-sm text-gray-700 hover:text-green-600 transition-colors py-1 text-left"
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
````

## File: apps/web/src/components/Product/BackButton.tsx
````typescript
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@greenlink/ui";

export function BackButton() {
    const router = useRouter();
    return (
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-white/50 hover:bg-white rounded-full z-10"
            onClick={() => router.back()}
        >
            ←
        </Button>
    );
}
````

## File: apps/web/src/components/Product/ProductCTA.tsx
````typescript
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@greenlink/ui";

interface ProductCTAProps {
    productId: string;
}

export function ProductCTA({ productId }: ProductCTAProps) {
    const router = useRouter();
    return (
        <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100 safe-area-pb z-50 flex gap-2">
            <Button
                variant="outline"
                className="flex-1 border-green-600 text-green-700 hover:bg-green-50 h-12 flex-col gap-0 leading-none py-1"
                onClick={() => router.push("/group-buy")}
            >
                <span className="text-[10px] flex items-center gap-1">함께 사면</span>
                <span className="font-bold">더 저렴해요!</span>
            </Button>

            <Button
                className="flex-[2] bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
                onClick={() => router.push(`/order?productId=${productId}`)}
            >
                구매하기
            </Button>
        </div>
    );
}
````

## File: apps/web/src/middleware.ts
````typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. 응답 객체 생성
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 2. SSR 스토리지용 Supabase 클라이언트 생성
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 3. 쿠키 세션 갱신 (만료 시 재발급 처리)
    const { data: { user } } = await supabase.auth.getUser()

    // 4. 경로 별 보호(Protected) 로직
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/mypage') ||
        request.nextUrl.pathname.startsWith('/order') ||
        request.nextUrl.pathname.startsWith('/cart')

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

    if (isProtectedRoute && !user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('next', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    if (isAuthRoute && user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
````

## File: docs/WORKFLOW_30MIN_AI_CODING.md
````markdown
# 30분 AI 코딩 워크플로우 (절차서)

짧은 시간 내에 기능을 구현하기 위해 웹 LLM(두뇌)과 IDE AI(근육)를 조합하는 단계별 실전 가이드이다. 모든 경로는 프로젝트 루트를 기준으로 한다.

---

## 1. 코드베이스 덤프 생성 (전제 조건)

워크플로우 시작 전 프로젝트의 최신 컨텍스트를 통합 파일로 생성한다.

**실행 명령:**
```powershell
# scripts 폴더의 보안 스크립트 실행
pwsh -ExecutionPolicy Bypass -File scripts\Invoke-Repomix.ps1
```

- **출력물**: `docs/repomix-output.md` (백엔드+프론트+DB 통합 덤프)
- **덤프 구성 상세**: `docs/repomix_report.md` 참조

---

## 2. [Phase 1] 두뇌 가동 — 작업 지시서 생성

전체 코드베이스를 분석하여 IDE AI에게 줄 순차 작업 지시서를 도출한다.

**사용처**: 웹 브라우저 기반 장문 컨텍스트 LLM (Gemini 등)

**절차**:
1. `docs/repomix-output.md` 파일 내용을 준비한다.
2. `docs/prompts/WORKFLOW_30MIN_PROMPTS.md`에서 Phase 1 프롬프트를 복사한다.
3. Step 1(로직)과 Step 2(UI) 지시서를 각각 도출하여 별도로 메모한다.

---

## 3. [Phase 2] 근육 가동 — Step 1 (백엔드/로직)

지시서에 따라 핵심 비즈니스 로직과 API를 구현한다.

**사용처**: IDE 기반 AI 채팅 (Cursor 등)

**규칙**:
- 수정 대상 파일은 전체 코드로 출력하도록 요구한다.
- `docs/CRITICAL_LOGIC.md`의 원칙을 준수하는지 확인한다.
- 신규 마이그레이션이 필요하면 `supabase/migrations/` 경로를 사용한다.

---

## 4. [Phase 3] 근육 가동 — Step 2 (프론트엔드)

구현된 로직을 화면에 연결하고 사용자 인터페이스를 완성한다.

**사용처**: Phase 2와 동일한 채팅 세션 (맥락 유지)

**규칙**:
- `apps/web/src` (소비자) 또는 `apps/admin/src` (셀러) 등 정확한 도메인 경로를 지정한다.
- 로딩 상태와 에러 UI를 반드시 포함한다.
- 하이드레이션 경고가 발생하지 않도록 클라이언트/서버 컴포넌트 분리를 엄수한다.

---

## 5. [Phase 4] 품질 향상 — 문서 및 테스트

구현 완료 후 사후 관리 작업을 수행한다.

- **문서화**: 신규 기능 설명 및 API 명세를 `docs/` 하위에 업데이트한다.
- **주석**: 핵심 파일에 JSDoc 스타일의 주석을 보강한다.
- **테스트**: 비즈니스 로직에 대한 단위 테스트 코드를 작성하여 검증한다.

---

## 아키텍처 지원 (Monitoring)

배포 및 가동 중 발생하는 에러는 `error_monitor.py`를 통해 실시간 감시하며, 위 워크플로우의 디버깅 단계에서 활용한다.
````

## File: docs/WORKFLOW_30MIN_PROMPTS.md
````markdown
# 30분 AI 코딩 — 복붙용 프롬프트 모음

`docs/WORKFLOW_30MIN_AI_CODING.md`와 함께 사용하며, 통합 덤프 파일(`docs/repomix-output.md`)을 기반으로 단계별 지시를 수행한다.

---

## Phase 1 (웹 LLM용 — 두뇌 가동)

**사용 규칙**: 덤프 파일 내용을 붙여넣고, 로직(Step 1)과 프론트(Step 2)를 개별적으로 요청한다.

```text
너는 10년 차 시니어 소프트웨어 아키텍트야.
아래 첨부된 텍스트는 [greenlink] 프로젝트의 전체 코드베이스(repomix 출력)야.

지금부터 이 프로젝트에 [구현할 기능 설명]을 추가하려고 해.

내가 IDE의 다른 AI 보조 도구에게 순차적으로 작업을 시킬 수 있도록, 다음 규칙에 따라 '단계별 작업 지시서'를 작성해 줘.

[작업 분할 규칙]
- Step 1: 데이터베이스 스키마(Supabase 마이그레이션), 코어 로직 (Zustand Store, API Service). docs/CRITICAL_LOGIC.md 원칙 준수.
- Step 2: 프론트엔드 UI 컴포넌트(Next.js App Router), 상태 관리 연람, 로딩/에러 UI 처리.

각 Step별로 1) 수정/생성할 파일 경로, 2) 핵심 로직 및 변수/함수명, 3) CRITICAL_LOGIC 준수 사항을 상세히 적어 줘.

[지금은 Step 1(백엔드/로직) 지시서만 작성해 줘.] 또는 [지금은 Step 2(프론트엔드/UI) 지시서만 작성해 줘.]

(이 아래에 docs/repomix-output.md 내용 전체를 붙여넣는다)
```

---

## Phase 2 (IDE용 — Step 1 백엔드/로직)

**사용 규칙**: Phase 1에서 생성된 Step 1 지시서를 아래 템플릿에 주입한다.

```text
너는 최고 수준의 풀스택 개발자야.
이 프로젝트는 [greenlink]이며, Next.js + Supabase + Zustand 스택을 사용한다.
docs/CRITICAL_LOGIC.md를 유일한 SSOT로 따른다.

다음은 이 프로젝트에 추가할 기능의 [Step 1: 백엔드/로직] 작업 지시서야.

[여기에 Step 1 지시서 내용 주입]

위 지시서에 언급된 모든 파일의 코드를 작성해 줘.
- 수정 대상 파일은 전체 소스 코드로 출력한다.
- 예외 처리와 타입 정의를 엄격히 적용한다.
- 신규 마이그레이션은 supabase/migrations/ 경로에 SQL로 제안한다.

대상 파일들의 전체 코드를 출력하라.
```

---

## Phase 3 (IDE용 — Step 2 프론트엔드)

**사용 규칙**: 로직 적용 완료 후 동일한 채팅 세션에서 Phase 1의 Step 2 지시서를 주입한다.

```text
로직 코드는 방금 프로젝트에 적용했다. 컨텍스트를 유지한 상태에서 다음 [Step 2: 프론트엔드] 지시서를 수행하라.

[여기에 Step 2 지시서 내용 주입]

관련 앱 경로(apps/web 또는 apps/admin)를 확인하여 Next.js App Router 기반의 코드를 작성하라.
- 모든 파일은 기존 코드 생략 없이 전체 소스 코드로 출력한다.
- 로딩 상태(Loading UI)와 에러 처리(Error UI)를 포함한다.
- 기존 CSS 및 컴포넌트 구조를 유지한다.

전체 코드를 출력하라.
```

---

## Phase 4 (IDE용 — 문서·주석·테스트)

```text
작성한 기능에 대한 품질 보강 작업을 수행한다. 다음 3가지를 한 번에 수행하라.

1. 문서화: docs/ 하위에 기능 설명 및 API 명세를 마크다운으로 정리한다.
2. 주석: 수정된 핵심 파일들에 JSDoc 스타일의 상세 주석을 달아 전체 파일 코드로 다시 출력한다.
3. 테스트: 비즈니스 로직에 대한 단위 테스트 코드를 작성한다.

상세한 주석이 포함된 전체 코드를 출력하라.
```
````

## File: packages/lib/src/api/client.ts
````typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base API Client
export abstract class ApiClient {
    protected instance: AxiosInstance;

    constructor(baseURL: string, config?: AxiosRequestConfig) {
        this.instance = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            ...config,
        });

        this.initializeInterceptors();
    }

    private initializeInterceptors() {
        this.instance.interceptors.request.use(
            (config) => {
                // Add auth token if available (implementation dependent)
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                // Handle global errors (e.g. 401 Unauthorized)
                if (error.response?.status === 401) {
                    console.warn('Unauthorized access. Redirecting to login...');
                    // redirect logic or event emission
                }
                return Promise.reject(error);
            }
        );
    }

    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.get(url, config);
        return response.data;
    }

    protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.post(url, data, config);
        return response.data;
    }

    protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.put(url, data, config);
        return response.data;
    }

    protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.delete(url, config);
        return response.data;
    }
}
````

## File: packages/lib/src/api/external/naver-smartstore.ts
````typescript
import { ApiClient } from '../client';

export interface SmartStoreProduct {
    originProductNo: number;
    statusCode: 'SALE' | 'OUT_OF_STOCK' | 'STOP' | 'CLOSE';
    name: string;
    salePrice: number;
    stockQuantity: number;
}

export class NaverSmartStoreClient extends ApiClient {
    constructor(clientId: string, clientSecret: string) {
        super('https://api.commerce.naver.com/external/v1', {
            headers: {
                'Client-Id': clientId,
                'Client-Secret': clientSecret,
            },
        });
    }

    async getProducts(): Promise<SmartStoreProduct[]> {
        // Mock implementation for skeleton
        return this.get<SmartStoreProduct[]>('/products/search');
    }

    async syncProduct(product: SmartStoreProduct): Promise<void> {
        // Mock sync logic
        console.log(`Syncing product ${product.originProductNo} to SmartStore...`);
    }
}
````

## File: packages/lib/src/api/external/toss-payments.ts
````typescript
import { ApiClient } from '../client';

export interface PaymentTransaction {
    paymentKey: string;
    orderId: string;
    amount: number;
    status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
    requestedAt: string;
    approvedAt: string | null;
}

export class TossPaymentsClient extends ApiClient {
    constructor(secretKey: string) {
        super('https://api.tosspayments.com/v1', {
            headers: {
                Authorization: `Basic ${btoa(secretKey + ':')}`,
            },
        });
    }

    async getPayment(paymentKey: string): Promise<PaymentTransaction> {
        return this.get<PaymentTransaction>(`/payments/${paymentKey}`);
    }

    async cancelPayment(paymentKey: string, cancelReason: string): Promise<PaymentTransaction> {
        return this.post<PaymentTransaction>(`/payments/${paymentKey}/cancel`, { cancelReason });
    }
}
````

## File: packages/lib/src/constants/delivery.ts
````typescript
import { DeliveryTask } from '../types';

export const MOCK_DELIVERY_TASKS: DeliveryTask[] = [
    {
        id: 'task-001',
        orderId: 'ord-001',
        farmId: 'farm-dear-orchid-001',
        status: 'PENDING',
        pickupAddress: '경기도 이천시 마장면 서이천로 123',
        pickupCoords: { lat: 37.2747, lng: 127.4350 },
        deliveryAddress: '서울시 강남구 테헤란로 123',
        deliveryCoords: { lat: 37.5000, lng: 127.0350 },
        recipientName: '홍길동',
        recipientPhone: '010-1111-2222',
        items: ['보세란 (중품) 1개'],
        priority: 1,
        photoUrls: [],
        createdAt: '2023-11-19T08:00:00Z',
    },
    {
        id: 'task-002',
        orderId: 'ord-002',
        farmId: 'farm-dear-orchid-001',
        status: 'PENDING',
        pickupAddress: '경기도 이천시 마장면 서이천로 123',
        pickupCoords: { lat: 37.2747, lng: 127.4350 },
        deliveryAddress: '서울시 성동구 왕십리로 456',
        deliveryCoords: { lat: 37.5500, lng: 127.0400 },
        recipientName: '김철수',
        recipientPhone: '010-3333-4444',
        items: ['풍란 (대품) 1개'],
        priority: 2,
        photoUrls: [],
        createdAt: '2023-11-20T08:00:00Z',
    },
    {
        id: 'task-003',
        orderId: 'ord-003',
        farmId: 'farm-dear-orchid-001',
        status: 'DELIVERED',
        pickupAddress: '경기도 이천시 마장면 서이천로 123',
        pickupCoords: { lat: 37.2747, lng: 127.4350 },
        deliveryAddress: '서울시 송파구 올림픽로 300',
        deliveryCoords: { lat: 37.5130, lng: 127.1020 },
        recipientName: '박지민',
        recipientPhone: '010-9999-8888',
        items: ['석곡 (소품) 2개'],
        priority: 3,
        photoUrls: ['https://example.com/pod1.jpg'],
        pickedUpAt: '2023-11-10T09:00:00Z',
        deliveredAt: '2023-11-10T11:30:00Z',
        createdAt: '2023-11-09T08:00:00Z',
    },
];
````

## File: packages/lib/src/constants/index.ts
````typescript
export * from './farms';
export * from './products';
export * from './orders';
export * from './delivery';
export * from './group-buy';
````

## File: packages/lib/src/stores/auth-store.ts
````typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Driver } from '../types';

interface AuthState {
    driver: Driver | null;
    isAuthenticated: boolean;
    otpSent: boolean;
    loginPhone: string | null;
    sendOtp: (phone: string) => Promise<boolean>;
    verifyOtp: (code: string) => Promise<boolean>;
    logout: () => void;
}

const MOCK_DRIVER: Driver = {
    id: 'driver-001',
    name: '박기사',
    phone: '010-9999-8888',
    vehicleInfo: 'Kia PV5',
    farmId: 'farm-dear-orchid-001',
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            driver: null,
            isAuthenticated: false,
            otpSent: false,
            loginPhone: null,
            sendOtp: async (phone) => {
                // Mock API call
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ otpSent: true, loginPhone: phone });
                return true;
            },
            verifyOtp: async (code) => {
                // Mock API call
                await new Promise((resolve) => setTimeout(resolve, 500));
                if (code === '000000') {
                    set({
                        isAuthenticated: true,
                        driver: MOCK_DRIVER,
                        otpSent: false,
                        loginPhone: null,
                    });
                    return true;
                }
                return false;
            },
            logout: () =>
                set({
                    driver: null,
                    isAuthenticated: false,
                    otpSent: false,
                    loginPhone: null,
                }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
````

## File: packages/lib/src/stores/farm-store.ts
````typescript
import { create } from 'zustand';
import { Farm } from '../types';
import { MOCK_FARMS } from '../constants/farms';

interface FarmState {
    farms: Farm[];
    setFarms: (farms: Farm[]) => void;
}

export const useFarmStore = create<FarmState>((set) => ({
    farms: MOCK_FARMS as Farm[],
    setFarms: (farms) => set({ farms }),
}));
````

## File: packages/lib/src/stores/order-store.ts
````typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '../types';
import { MOCK_ORDERS } from '../constants';

interface OrderState {
    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrderStatus: (id: string, status: OrderStatus) => void;
    getOrdersByFarm: (farmId: string) => Order[];
    getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: MOCK_ORDERS,
            addOrder: (order) =>
                set((state) => ({ orders: [...state.orders, order] })),
            updateOrderStatus: (id, status) =>
                set((state) => ({
                    orders: state.orders.map((o) =>
                        o.id === id ? { ...o, status } : o
                    ),
                })),
            getOrdersByFarm: (farmId) =>
                get().orders.filter((o) => o.farmId === farmId),
            getOrdersByStatus: (status) =>
                get().orders.filter((o) => o.status === status),
        }),
        {
            name: 'order-storage',
        }
    )
);
````

## File: packages/lib/src/types/seller.ts
````typescript
export interface LocationVO {
    address: string;
    city: string;
    district: string;
    coordinates: { lat: number; lng: number };
}

export interface ComplianceVO {
    privacyPolicyAgreed: boolean;
    locationInfoAgreed: boolean;
    sellerInfoNoticeAgreed: boolean;
    agreedAt: string; // ISO 8601 Date
}

export interface SellerEntity {
    id: string; // Aggregate Root ID
    businessName: string;
    ownerName: string;
    businessRegistrationNumber: string;
    location: LocationVO;
    compliance: ComplianceVO;
    status: 'ONBOARDING' | 'ACTIVE' | 'SUSPENDED';
    createdAt: string;
    updatedAt: string;
}
````

## File: packages/lib/src/types/user.ts
````typescript
export interface Driver {
    id: string;
    name: string;
    phone: string;
    vehicleInfo: string;
    farmId: string;
}

export interface PinkTemperature {
    value: number;
    level: string;
    emoji: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'consumer' | 'farm_owner' | 'driver';
    pinkTemperature?: PinkTemperature;
    createdAt: string;
}
````

## File: packages/lib/src/utils.ts
````typescript
export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR").format(date);
};
````

## File: packages/lib/src/utils/index.ts
````typescript
export * from './format';
export * from './status-mapper';
````

## File: supabase/migrations/20260225_zero_inventory_sync.sql
````sql
-- ==============================================================================
-- 1. increment_participants RPC (Remote Procedure Call)
-- 목적: Race Condition을 방지하며 원자적으로 current_participants를 증가/감소시킵니다.
-- 사용법: await supabase.rpc('increment_participants', { item_id: '...', amount: 1 })
-- ==============================================================================

CREATE OR REPLACE FUNCTION increment_participants(item_id UUID, amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- RLS를 우회하여 서버 권한으로 실행 (클라이언트 조작 방지)
AS $$
BEGIN
  UPDATE public.zero_inventory_items
  SET current_participants = current_participants + amount
  WHERE id = item_id;
END;
$$;


-- ==============================================================================
-- 2. check_and_update_goal_status TRIGGER
-- 목적: 누군가 참여하여 current_participants가 업데이트 될 때, 
-- target_participants에 도달하면 status를 'RECRUITING'에서 'GOAL_MET'으로 자동 변경합니다.
-- ==============================================================================

-- 트리거 함수 정의
CREATE OR REPLACE FUNCTION check_and_update_goal_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- 참여 인원이 목표 인원 이상이 되었고, 이전 상태가 RECRUITING 인 경우에만
  IF NEW.current_participants >= NEW.target_participants AND OLD.status = 'RECRUITING' THEN
    NEW.status = 'GOAL_MET';
  END IF;
  
  -- 취소 등으로 인원이 줄어들었을 경우 방어적 롤백 (선택 사항)
  IF NEW.current_participants < NEW.target_participants AND OLD.status = 'GOAL_MET' THEN
    NEW.status = 'RECRUITING';
  END IF;

  RETURN NEW;
END;
$$;

-- 기존 트리거가 있다면 안전하게 제거
DROP TRIGGER IF EXISTS trg_check_goal_status ON public.zero_inventory_items;

-- 트리거 생성
CREATE TRIGGER trg_check_goal_status
BEFORE UPDATE OF current_participants ON public.zero_inventory_items
FOR EACH ROW
EXECUTE FUNCTION check_and_update_goal_status();
````

## File: supabase/migrations/20260225000000_update_orders_delivery.sql
````sql
-- DDD: Delivery & Settlement Domain Schema Update
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(50) DEFAULT 'GREENLINK_DRIVER';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS settlement_status VARCHAR(50) DEFAULT 'PENDING';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS settled_at TIMESTAMP WITH TIME ZONE;

-- Create RPC for atomic settlement processing
CREATE OR REPLACE FUNCTION confirm_delivery_and_settle(p_order_id UUID, p_driver_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.orders
    SET status = 'DELIVERED',
        settlement_status = 'COMPLETED',
        settled_at = NOW(),
        delivery_task_id = p_driver_id::TEXT
    WHERE id = p_order_id AND status != 'DELIVERED';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
````

## File: apps/admin/src/app/delivery/page.tsx
````typescript
"use client";

import { useDeliveryStore } from "@greenlink/lib";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Label, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@greenlink/ui";
import { useState, useEffect } from "react";

export default function DeliveryManagementPage() {
    const { dailyQuotas, setDailyQuota } = useDeliveryStore();
    const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedQuota, setSelectedQuota] = useState<number>(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Map array to object for easier lookup
    const quotas = dailyQuotas.reduce((acc, q) => ({ ...acc, [q.date]: q.maxOrders }), {} as Record<string, number>);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDateStr = e.target.value;
        setDateStr(newDateStr);
    };

    const openQuotaDialog = () => {
        if (dateStr) {
            const quota = dailyQuotas.find(q => q.date === dateStr)?.maxOrders || 50;
            setSelectedQuota(quota);
            setIsDialogOpen(true);
        }
    };

    const handleSaveQuota = () => {
        if (dateStr) {
            setDailyQuota(dateStr, selectedQuota);
            setIsDialogOpen(false);
        }
    };

    const formatDate = (d: string) => {
        return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(d));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">배송 관리</h1>
            <p className="text-gray-500">날짜를 선택하여 일일 배송 쿼터(최대 주문량)를 설정하세요.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>배송 일정 및 쿼터 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label>날짜 선택</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={dateStr}
                                    onChange={handleDateChange}
                                    className="block w-full"
                                />
                                <Button onClick={openQuotaDialog}>설정</Button>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-sm text-gray-500 mb-1">{formatDate(dateStr)}</p>
                            <p className="font-bold text-2xl text-green-700">
                                {quotas[dateStr] ? `${quotas[dateStr]}건` : '기본 50건'}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">설정된 배송 쿼터</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>요약</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold mb-2">오늘 ({new Date().toISOString().split('T')[0]})</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span>설정된 쿼터:</span>
                                    <Badge>{quotas[new Date().toISOString().split('T')[0]] || 50}건</Badge>
                                </div>
                                {/* Mock used capacity */}
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span>현재 예약:</span>
                                    <span className="text-gray-500">12건</span>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500">
                                * 쿼터가 초과되면 해당 날짜는 배송일 선택에서 제외됩니다.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dateStr ? formatDate(dateStr) : ''} 배송 쿼터 설정</DialogTitle>
                        <DialogDescription>
                            해당 날짜에 처리 가능한 최대 배송 건수를 입력하세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quota" className="text-right">
                                최대 건수
                            </Label>
                            <Input
                                id="quota"
                                type="number"
                                value={selectedQuota}
                                onChange={(e) => setSelectedQuota(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSaveQuota}>저장하기</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
````

## File: apps/admin/src/app/globals.css
````css
@import "@greenlink/ui/styles.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

/* IDE/확장 프로그램이 주입하는 user-select:auto 를 CSS로 원천 차단 */
* {
    user-select: none !important;
}

input,
textarea,
[contenteditable] {
    user-select: text !important;
}

.safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom);
}
````

## File: apps/admin/src/app/layout.tsx
````typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { createClient } from "@greenlink/lib";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        async function checkRole() {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session || typeof session === "string") {
                console.warn("[Admin Domain] No valid session found. Redirecting to login...");
                setIsLoading(false); // 로딩 종료 후 login 페이지 노출 허용
                if (pathname !== "/login") {
                    router.push("/login?returnUrl=" + pathname);
                }
                return;
            }

            setUser(session.user);
            setIsLoading(false);
            console.log(`[Admin Domain] Farmer session verified for user:`, session.user?.email);
        }

        checkRole();
    }, [router, supabase.auth, pathname]);

    const navItems = [
        { name: "대시보드", href: "/", icon: "📊" },
        { name: "주문 관리", href: "/orders", icon: "📦" },
        { name: "상품 관리", href: "/products", icon: "🌸" },
        { name: "정산 내역", href: "/settlement", icon: "💰" },
    ];

    // 하이드레이션 불일치 방지를 위해 서버와 클라이언트의 body 클래스를 완벽히 일치시킴
    const bodyClass = `${inter.className} bg-gray-50 text-gray-900 font-sans`;

    return (
        <html lang="ko">
            <body className={bodyClass}>
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-emerald-600">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                            <p className="text-sm font-bold animate-pulse">관리자 권한 확인 중...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex min-h-screen">
                        {/* Sidebar (Glassmorphism Effect) */}
                        <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-emerald-50 sticky top-0 h-screen flex flex-col z-50">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
                                    <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">GreenLink Admin</h2>
                                </div>

                                <nav className="space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                    : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                                                    }`}
                                            >
                                                <span>{item.icon}</span>
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="mt-auto p-6 border-t border-gray-100">
                                <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-200 border-2 border-white overflow-hidden">
                                        <img src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer"} alt="Profile" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-xs font-black text-emerald-800 truncate">{user?.user_metadata?.full_name || "농장주님"}</p>
                                        <button
                                            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
                                            className="text-[10px] text-emerald-600 font-bold hover:underline"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 min-h-screen relative">
                            <header className="h-16 bg-white/40 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
                                <h1 className="text-sm font-black text-gray-400 uppercase tracking-widest">Farmer Dashboard V1</h1>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white rounded-full px-3 py-1 border border-gray-200 text-[11px] font-bold text-gray-500 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        Live Sync Active
                                    </div>
                                </div>
                            </header>

                            <div className="p-8">
                                {children}
                            </div>
                        </main>
                    </div>
                )}
            </body>
        </html>
    );
}
````

## File: apps/admin/src/app/products/page.tsx
````typescript
"use client";

import { useProductStore } from "@greenlink/lib";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Button, Badge,
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@greenlink/ui";

import { useState, useEffect } from "react";
import { ProductForm } from "@/components/Product/ProductForm";

export default function ProductsPage() {
    const { products, removeProduct } = useProductStore();
    const [mounted, setMounted] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">상품 관리</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <span className="mr-2">➕</span> 상품 등록
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>새 상품 등록</DialogTitle>
                            <DialogDescription>
                                판매할 농산물의 정보를 입력해주세요.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <ProductForm onSuccess={() => setIsDialogOpen(false)} />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">이미지</TableHead>
                            <TableHead>상품명</TableHead>
                            <TableHead>가격</TableHead>
                            <TableHead>재고</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xl">
                                        {product.images[0] || '📦'}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.price.toLocaleString()}원</TableCell>
                                <TableCell>{product.stock}개</TableCell>
                                <TableCell>
                                    <Badge variant={product.stock > 0 ? "default" : "secondary"} className={product.stock > 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                                        {product.stock > 0 ? "판매중" : "품절"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <span>✏️</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                if (confirm('정말 삭제하시겠습니까?')) removeProduct(product.id);
                                            }}
                                        >
                                            <span>🗑️</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
````

## File: apps/admin/src/components/Layout/Sidebar.tsx
````typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@greenlink/ui";


export function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: "/", label: "대시보드", icon: "📊" },
        { href: "/products", label: "상품 관리", icon: "📦" },
        { href: "/delivery", label: "배송 관리", icon: "🚚" },
        { href: "/settings", label: "설정", icon: "⚙️" },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                    <span>🌿</span> GreenLink
                </h1>
                <p className="text-xs text-gray-400 mt-1">Partner Center</p>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <span className="text-xl">🚪</span>
                    로그아웃
                </button>
            </div>
        </div>
    );
}
````

## File: apps/admin/src/components/Product/ProductForm.tsx
````typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from "@greenlink/ui";
import { useProductStore } from "@greenlink/lib";

const productSchema = z.object({
    name: z.string().min(2, "상품명은 2글자 이상이어야 합니다."),
    price: z.coerce.number().min(100, "가격은 100원 이상이어야 합니다."),
    stock: z.coerce.number().min(0, "재고는 0개 이상이어야 합니다."),
    category: z.string().min(1, "카테고리를 선택해주세요."),
    description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    onSuccess: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
    const { addProduct } = useProductStore();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
            stock: 0,
            category: "cat-cut",
            description: "",
        },
    });

    const onSubmit = (data: ProductFormValues) => {
        addProduct({
            id: `prod-${Date.now()}`,
            name: data.name,
            price: data.price,
            originalPrice: data.price * 1.2,
            stock: data.stock,
            category: data.category as "CUT" | "ORC" | "FOL" | "ETC",
            images: ["📦"],
            description: data.description || "상세 설명이 없습니다.",
            farmId: "farm-001",
            unit: '개',
            status: 'ACTIVE', // Default
            createdAt: new Date().toISOString(),
        });

        onSuccess();
        form.reset();
    };

    return (
        <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control as any}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>상품명</FormLabel>
                            <FormControl>
                                <Input placeholder="예: 맛있는 딸기" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <FormField
                        control={form.control as any}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>가격 (원)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="10000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>재고 (개)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">등록하기</Button>
            </form>
        </Form>
    );
}
````

## File: apps/web/src/app/auth/callback/route.ts
````typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/mypage'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Server Component에서 호출 시 발생 가능 (middleware가 갱신하므로 무시)
                        }
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            console.error('[Auth Callback] Session exchange error:', error.message)
            return NextResponse.redirect(`${requestUrl.origin}/login?error=session_error`)
        }
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`)
}
````

## File: apps/web/src/app/globals.css
````css
@import "@greenlink/ui/styles.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

/* IDE/확장 프로그램이 주입하는 user-select:auto 를 CSS로 원천 차단 */
* {
    user-select: none !important;
}

input,
textarea,
[contenteditable] {
    user-select: text !important;
}

.safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom);
}
````

## File: apps/web/src/app/login/page.tsx
````typescript
"use client";

import { Button } from "@greenlink/ui";
import { useUserStore } from "@greenlink/lib";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<{ google: boolean, kakao: boolean }>({ google: false, kakao: false });
    const { loginWithProvider } = useUserStore();

    const handleLogin = async (provider: 'google' | 'kakao') => {
        try {
            setIsLoading(prev => ({ ...prev, [provider]: true }));
            await loginWithProvider(provider);
        } catch (error) {
            console.error(`[Presentation] ${provider} Login Error:`, error);
            alert(`${provider === 'kakao' ? '카카오' : '구글'} 로그인에 실패했습니다. 코드를 확인해 주세요.`);
        } finally {
            setIsLoading(prev => ({ ...prev, [provider]: false }));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-8">
            <div className="text-center space-y-2">
                <div className="text-5xl mb-4">🌿</div>
                <h1 className="text-2xl font-extrabold tracking-tight text-green-800">GreenLink</h1>
                <p className="text-gray-500 text-sm">신선함을 가장 빠르게, 우리 동네 직거래</p>
            </div>

            <div className="w-full max-w-sm space-y-4 pt-10">
                {/* 카카오 로그인 버튼 */}
                <Button
                    className="w-full h-14 bg-[#FEE500] border-none text-[#000000] hover:bg-[#FEE500]/90 font-semibold shadow-sm flex items-center justify-center gap-3 text-base"
                    onClick={() => handleLogin('kakao')}
                    disabled={isLoading.kakao || isLoading.google}
                >
                    {isLoading.kakao ? (
                        <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3C6.477 3 2 6.425 2 10.648c0 2.7 1.838 5.075 4.605 6.355-.152.54-1.01 3.428-1.043 3.553-.04.145.05.138.106.103.076-.048 3.558-2.316 4.97-3.238.44.062.89.094 1.36.094 5.523 0 10-3.425 10-7.648C22 6.425 17.523 3 12 3z" />
                        </svg>
                    )}
                    카카오 계정으로 계속하기
                </Button>

                {/* 구글 로그인 버튼 */}
                <Button
                    className="w-full h-14 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold shadow-sm flex items-center justify-center gap-3 text-base"
                    onClick={() => handleLogin('google')}
                    disabled={isLoading.kakao || isLoading.google}
                >
                    {isLoading.google ? (
                        <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    )}
                    Google 계정으로 계속하기
                </Button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-10">
                가입 시 GreenLink의 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
            </p>
        </div>
    );
}
````

## File: apps/web/src/app/mypage/page.tsx
````typescript
"use client";

import { useUserStore, greenlinkApi, Order } from "@greenlink/lib";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MyPage() {
    const { user, isAuthenticated, loginWithProvider, logout, initializeAuthListener } = useUserStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState<{ google: boolean, kakao: boolean }>({ google: false, kakao: false });
    const router = useRouter();

    const handleLogin = async (provider: 'google' | 'kakao') => {
        try {
            setIsLoading(prev => ({ ...prev, [provider]: true }));
            await loginWithProvider(provider);
        } catch (error) {
            console.error(`[Presentation] ${provider} Login Error:`, error);
            alert(`${provider === 'kakao' ? '카카오' : '구글'} 로그인에 실패했습니다. 코드를 확인해 주세요.`);
        } finally {
            setIsLoading(prev => ({ ...prev, [provider]: false }));
        }
    };

    useEffect(() => {
        // Ensure auth listener is running before deciding UI state
        initializeAuthListener();

        const timer = setTimeout(() => {
            if (isAuthenticated) {
                greenlinkApi.getMyOrders().then(data => {
                    setOrders(data);
                });
            }
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 pb-24 bg-gray-50">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 pb-24 bg-gray-50 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 mb-2">로그인이 필요합니다</h2>
                    <p className="text-sm text-gray-500">꽃과 식물이 가득한 그린링크에 오신 것을 환영합니다!</p>
                </div>
                <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
                    {/* 카카오 로그인 버튼 */}
                    <button
                        onClick={() => handleLogin('kakao')}
                        disabled={isLoading.kakao || isLoading.google}
                        className="w-full py-4 bg-[#FEE500] border-none text-[#000000] font-extrabold text-[15px] rounded-xl shadow-sm hover:bg-[#FEE500]/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading.kakao ? (
                            <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3C6.477 3 2 6.425 2 10.648c0 2.7 1.838 5.075 4.605 6.355-.152.54-1.01 3.428-1.043 3.553-.04.145.05.138.106.103.076-.048 3.558-2.316 4.97-3.238.44.062.89.094 1.36.094 5.523 0 10-3.425 10-7.648C22 6.425 17.523 3 12 3z" />
                            </svg>
                        )}
                        카카오 계정으로 시작하기
                    </button>

                    <button
                        onClick={() => handleLogin('google')}
                        disabled={isLoading.kakao || isLoading.google}
                        className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-extrabold text-[15px] rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading.google ? (
                            <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        Google 계정으로 시작하기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-28 bg-gray-50 min-h-screen font-sans">
            {/* Top Green Area */}
            <div className="bg-[#1ebe5d] pt-8 pb-6 px-5 rounded-b-3xl shadow-sm text-white">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#1ebe5d] text-2xl font-bold shadow-sm">
                        {user.nickname.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <h2 className="text-xl font-extrabold">{user.nickname}</h2>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </div>
                        <span className="inline-block mt-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold">
                            그린 등급 <span className="ml-1">{user.pinkTemperature.emoji} {user.pinkTemperature.level}</span>
                        </span>
                    </div>
                </div>

                {/* Pink Temperature Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold opacity-90">내 핑크 온도</span>
                        <span className="text-sm font-extrabold flex items-center gap-1">
                            {user.pinkTemperature.emoji} {user.pinkTemperature.value}℃
                        </span>
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                        <div className="h-1.5 bg-pink-400 rounded-full" style={{ width: `${Math.min((user.pinkTemperature.value / 100) * 100, 100)}%` }} />
                    </div>
                    <p className="text-[10px] opacity-70 mt-1.5 font-medium">첫눈 단계 - 그린링크를 시작한 새 회원</p>
                </div>

                {/* Points and Coupons */}
                <div className="flex bg-white/10 rounded-xl py-3 divide-x divide-white/20 text-center">
                    <div className="flex-1 cursor-pointer">
                        <div className="text-lg font-extrabold">{user.points.toLocaleString()}원</div>
                        <div className="text-xs font-medium opacity-80 mt-0.5">적립금</div>
                    </div>
                    <div className="flex-1 cursor-pointer">
                        <div className="text-lg font-extrabold">5</div>
                        <div className="text-xs font-medium opacity-80 mt-0.5">쿠폰</div>
                    </div>
                </div>
            </div>

            <main className="px-4 mt-6 space-y-6">

                {/* Recent Items */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-extrabold text-gray-900">최근 본 상품</h3>
                        <span className="text-xs text-green-600 font-bold cursor-pointer">전체보기 →</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['🌸', '🌿', '🌱', '🎁'].map((emoji, i) => (
                            <div key={i} className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 cursor-pointer">
                                {emoji}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Menu List */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    <div className="p-4">
                        <h3 className="text-xs font-extrabold text-gray-900 mb-3 ml-1">주문 내역</h3>
                        <ul className="space-y-1">
                            {/* In a real app we'd map orders here instead of just the menu item */}
                            <li onClick={() => router.push('/category')} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    나의 주문 내역 <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1">{orders.length}</span>
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    배송지 관리
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                        </ul>
                    </div>

                    <div className="p-4">
                        <h3 className="text-xs font-extrabold text-gray-900 mb-3 ml-1">고객 지원</h3>
                        <ul className="space-y-1">
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    고객센터 / 도움말
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    공지사항
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                        </ul>
                    </div>

                    <div className="p-4">
                        <h3 className="text-xs font-extrabold text-gray-900 mb-3 ml-1">나의 소식</h3>
                        <ul className="space-y-1">
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    결제 수단 관리
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    설정
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Banner B2B */}
                <div className="bg-[#e9f6ea] border border-[#d1e9d3] rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white text-lg">🏪</span>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-extrabold text-green-900 leading-tight">내가 찾던 손님<br />모두 그린링크에 있어요</h4>
                            <p className="text-[10px] text-green-700 mt-1 font-medium">내 동네 근처 이웃 152,847명</p>
                        </div>
                    </div>
                    <button className="w-full py-2.5 bg-[#1ebe5d] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-green-600 transition-colors">
                        그린링크 비즈 시작하기 &rsaquo;
                    </button>
                </div>

                {/* Business Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-4">
                        <h3 className="text-xs font-extrabold text-gray-900 mb-3 ml-1">비즈니스</h3>
                        <ul className="space-y-1">
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <span className="text-green-600 text-base leading-none">🏪</span>
                                    비즈프로필 관리
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-sm">NEW</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Logout Button */}
                <div className="mt-8 mb-4 px-1">
                    <button
                        onClick={logout}
                        className="w-full py-3.5 bg-gray-200/60 text-gray-500 text-[13px] font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        로그아웃
                    </button>
                </div>

            </main>
        </div>
    );
}
````

## File: apps/web/src/app/search/page.tsx
````typescript
"use client";

import { useProductStore } from "@greenlink/lib/stores";
import { ProductCard } from "@/components/Product/ProductCard";
import { Input, Button } from "@greenlink/ui";
import { useState } from "react";

export default function SearchPage() {
    const { products } = useProductStore();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = ["전체", "채소", "과일", "곡류", "축산", "가공식품"];

    return (
        <div className="bg-white min-h-screen">
            {/* Search Header */}
            <div className="p-4 sticky top-0 bg-white z-10 space-y-3 border-b border-gray-100">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
                    <Input
                        className="pl-9 bg-gray-50 border-none h-11 focus-visible:ring-green-500"
                        placeholder="사과, 배추, 삼겹살..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant="ghost"
                            size="sm"
                            {...({ className: "whitespace-nowrap px-4 bg-gray-50 hover:bg-green-50 hover:text-green-600 rounded-full h-8 text-xs font-medium" } as any)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="p-4">
                <p className="text-xs text-gray-500 mb-4">검색 결과 {filteredProducts.length}개</p>
                <div className="grid grid-cols-2 gap-3">
                    {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-gray-400">검색 결과가 없습니다 😢</p>
                    </div>
                )}
            </div>
        </div>
    );
}
````

## File: apps/web/src/components/GroupBuy/CountdownTimer.tsx
````typescript
"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
    targetDate: string; // ISO string
    className?: string; // Additional classes
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number } | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                return {
                    h: Math.floor((difference / (1000 * 60 * 60))), // Total hours left
                    m: Math.floor((difference / 1000 / 60) % 60),
                    s: Math.floor((difference / 1000) % 60),
                };
            } else {
                return null; // Expired
            }
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!isMounted) return null;
    if (!timeLeft) return <span className="text-gray-500">마감됨</span>;

    return (
        <div className={className}>
            <span className="font-mono font-bold text-red-500">
                {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
            </span>
        </div>
    );
}
````

## File: apps/web/src/components/GroupBuy/ZeroInventoryCard.tsx
````typescript
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ZeroInventoryItem } from '@greenlink/lib';
import { useState } from 'react';

export interface ZeroInventoryCardProps {
    item: ZeroInventoryItem;
}

export function ZeroInventoryCard({ item }: ZeroInventoryCardProps) {
    const isCompleted = item.currentParticipants >= item.targetParticipants || item.status === 'COMPLETED';
    const progressPercent = Math.min((item.currentParticipants / item.targetParticipants) * 100, 100);

    const defaultPlaceholder = "/images/placeholder.svg"; // 로컬 정적 파일 (외부 CDN 불필요)
    const [imgSrc, setImgSrc] = useState(item.imageUrl);

    return (
        <Link href={`/category/${item.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform active:scale-95 block">
            {/* Image Area */}
            <div className="relative aspect-square w-full bg-gray-100 flex-shrink-0">
                <Image
                    src={imgSrc}
                    alt={item.itemNm}
                    fill
                    className="object-cover"
                    onError={() => setImgSrc(defaultPlaceholder)}
                />
                {isCompleted && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-green-600 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                            구매 확정 (사입 대기)
                        </span>
                    </div>
                )}
                {!isCompleted && item.currentParticipants > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">
                        마감 임박
                    </div>
                )}

                {/* Metadata Tags Area */}
                {(item.metadata?.bloomStage || item.metadata?.plantHeight || item.metadata?.grade || item.metadata?.difficulty) && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                        {item.metadata.bloomStage && (
                            <span className="bg-white/90 backdrop-blur-sm text-pink-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-pink-100">
                                개화 {item.metadata.bloomStage}단계
                            </span>
                        )}
                        {item.metadata.plantHeight && (
                            <span className="bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-emerald-100">
                                크기 {item.metadata.plantHeight}cm
                            </span>
                        )}
                        {item.metadata.grade && (
                            <span className="bg-white/90 backdrop-blur-sm text-yellow-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-yellow-100">
                                {item.metadata.grade === 'SPECIAL' ? '특급' : item.metadata.grade === 'HIGH' ? '상급' : '보통'}
                            </span>
                        )}
                        {item.metadata.difficulty && (
                            <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-blue-100">
                                {item.metadata.difficulty === 'EASY' ? '초보자 추천' : item.metadata.difficulty === 'NORMAL' ? '중급자용' : '전문가용'}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title and Price */}
                <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-1 line-clamp-1">
                        {item.itemNm}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-red-500 text-lg">
                            {item.sellingPrice.toLocaleString()}원
                        </span>
                        <span className="text-gray-400 text-sm line-through">
                            경매가 {item.avgCost.toLocaleString()}원
                        </span>
                    </div>
                </div>

                {/* Progress Bar & Status */}
                <div className="mt-auto mb-3">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-medium text-gray-500">
                            최근 7일 물량: <strong className="text-gray-700">{item.qty.toLocaleString()}</strong>개
                        </span>
                        {!isCompleted && (
                            <span className="text-xs font-bold text-green-600">
                                {item.targetParticipants - item.currentParticipants}명 남음
                            </span>
                        )}
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1 overflow-hidden">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                        <span>참여 {item.currentParticipants}명</span>
                        <span>목표 {item.targetParticipants}명</span>
                    </div>
                </div>

                {/* Call to Action Button */}
                <button
                    disabled={isCompleted}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${isCompleted
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200'
                        }`}
                >
                    {isCompleted ? '모집 완료' : '공구 참여 (결제예치)'}
                </button>
            </div>
        </Link>
    );
}
````

## File: apps/web/src/components/Order/PaymentButton.tsx
````typescript
"use client";

import { Button } from "@greenlink/ui";
import { useState } from "react";

interface PaymentButtonProps {
    amount: number;
    orderName: string;
    onSuccess: () => void;
    disabled?: boolean;
}

export function PaymentButton({ amount, onSuccess, disabled }: PaymentButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        // Mock payment delay
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 1500);
    };

    return (
        <Button
            className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700"
            disabled={disabled || isProcessing}
            onClick={handlePayment}
        >
            {isProcessing ? (
                <>
                    <span className="mr-2">⏳</span>
                    결제 진행중...
                </>
            ) : (
                <>
                    <span className="mr-2">💳</span>
                    {amount.toLocaleString()}원 결제하기
                </>
            )}
        </Button>
    );
}
````

## File: apps/web/src/hooks/useRealtimeDeal.ts
````typescript
import { useState, useEffect } from 'react';
import { greenlinkApi, createClient, ZeroInventoryItem, useGroupBuyStore } from '@greenlink/lib';

export function useRealtimeDeal(id: string) {
    const [item, setItem] = useState<ZeroInventoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const updateSyncData = useGroupBuyStore(state => state.updateSyncData);

    // Initial Fetch
    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        greenlinkApi.getZeroInventoryItem(id).then(data => {
            if (isMounted) {
                setItem(data);
                setLoading(false);
            }
        });
        return () => { isMounted = false; };
    }, [id]);

    // Realtime Subscription
    useEffect(() => {
        if (!item || !id) return;

        // Skip realtime if it's a Mock ID (e.g., 'orc-1')
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (!isUuid) return;

        const sbClient = createClient();

        const channel = sbClient
            .channel(`realtime:deal:${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'zero_inventory_items',
                    filter: `id=eq.${id}`
                },
                (payload) => {
                    console.log('🟢 Realtime Update Received:', payload.new);
                    // 1. Local state (Product detail page)
                    setItem((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            currentParticipants: payload.new.current_participants,
                            status: payload.new.status,
                        };
                    });
                    // 2. Global state (Group buy list)
                    updateSyncData(id, payload.new.current_participants, payload.new.status);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`📡 Successfully subscribed to Realtime channel for deal: ${id}`);
                }
            });

        return () => {
            sbClient.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, item?.id]); // depend on item?.id to ensure initial fetch happened

    return { item, loading };
}
````

## File: package.json
````json
{
  "name": "greenlink-monorepo",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "type-check": "turbo run type-check",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "dev:web": "turbo run dev --filter=@greenlink/web",
    "dev:admin": "turbo run dev --filter=@greenlink/admin",
    "dev:driver": "turbo run dev --filter=@greenlink/driver"
  },
  "devDependencies": {
    "turbo": "^2.8.10",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "packageManager": "npm@10.8.2",
  "engines": {
    "node": ">=18"
  }
}
````

## File: packages/lib/src/api/supabase.ts
````typescript
import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials not found. Check your .env.local file.');
}

/**
 * GreenLink Global Supabase Client
 * Singleton pattern with window check to prevent Web Locks API contention.
 */
let supabaseClient: SupabaseClient | undefined;

export const createClient = () => {
    if (typeof window !== 'undefined' && supabaseClient) return supabaseClient;

    const client = createBrowserClient(supabaseUrl, supabaseAnonKey);

    if (typeof window !== 'undefined') supabaseClient = client;
    return client;
};

// Singleton instance for global use
export const supabase = createClient();
````

## File: packages/lib/src/constants/farms.ts
````typescript
import { Farm } from '../types';

export const MOCK_FARMS: Farm[] = [
    {
        id: 'farm-dear-orchid-001',
        name: '디어 오키드',
        owner: '김란초',
        category: 'ORC',
        subcategory: '동양란',
        location: {
            address: '경기도 이천시 마장면 서이천로 123',
            city: '이천시',
            district: '마장면',
            coordinates: { lat: 37.2747, lng: 127.4350 },
        },
        phone: '010-1234-5678',
        description: '30년 전통의 동양란 전문 농장. 보세란, 풍란, 석곡 등 다양한 동양란을 직접 재배합니다.',
        certifications: [
            { name: '농업경영체 등록', issuedBy: '국립농산물품질관리원', issuedAt: '2020-03-15' },
        ],
        greenTemperature: {
            value: 42.5,
            level: '줄기',
            emoji: '🌱',
            description: '믿을 수 있는 판매자입니다.',
        },
        followers: 128,
        createdAt: '2023-01-15T09:00:00Z',
        profileEmoji: '🌸',
        tags: ['동양란', '보세란', '풍란', '난초', '이천', '직거래', 'B2B'],
    },
];
````

## File: packages/lib/src/constants/orders.ts
````typescript
import { Order } from '../types';

export const MOCK_ORDERS: Order[] = [
    {
        id: 'ord-001',
        productId: 'prod-001',
        farmId: 'farm-dear-orchid-001',
        buyerName: '홍길동',
        buyerPhone: '010-1111-2222',
        buyerAddress: '서울시 강남구 테헤란로 123',
        quantity: 1,
        totalPrice: 35000,
        status: 'PREPARING',
        deliveryDate: '2023-11-20',
        orderedAt: '2023-11-15T09:00:00Z',
        isEscrow: false,
        message: '문 앞에 놓아주세요.',
    },
    {
        id: 'ord-002',
        productId: 'prod-002',
        farmId: 'farm-dear-orchid-001',
        buyerName: '김철수',
        buyerPhone: '010-3333-4444',
        buyerAddress: '서울시 성동구 왕십리로 456',
        quantity: 1,
        totalPrice: 80000,
        status: 'ORDERED',
        deliveryDate: '2023-11-21',
        orderedAt: '2023-11-16T10:30:00Z',
        isEscrow: false,
    },
    {
        id: 'ord-003',
        productId: 'prod-004',
        farmId: 'farm-dear-orchid-001',
        buyerName: '이영희',
        buyerPhone: '010-5555-6666',
        buyerAddress: '성남시 분당구 판교로 789',
        quantity: 2,
        totalPrice: 240000,
        status: 'COMPLETED',
        deliveryDate: '2023-11-10',
        orderedAt: '2023-11-05T14:00:00Z',
        isEscrow: false,
        message: '배송 전 연락 부탁드립니다.',
    },
];
````

## File: packages/lib/src/stores/delivery-store.ts
````typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeliveryTask, DailyQuota, DeliveryStatus } from '../types';
import { MOCK_DELIVERY_TASKS } from '../constants';


interface DeliveryState {
    tasks: DeliveryTask[];
    dailyQuotas: DailyQuota[];
    addTask: (task: DeliveryTask) => void;
    updateTaskStatus: (id: string, status: DeliveryStatus) => void;
    setDailyQuota: (date: string, maxOrders: number) => void;
    checkAvailability: (date: string) => boolean;
    incrementQuota: (date: string) => void;
}

const generateInitialQuotas = (): DailyQuota[] => {
    const quotas: DailyQuota[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const isSun = date.getDay() === 0;
        const isSat = date.getDay() === 6;
        quotas.push({
            date: dateStr,
            maxOrders: isSun ? 0 : isSat ? 10 : 15,
            currentOrders: 0,
        });
    }
    return quotas;
};

export const useDeliveryStore = create<DeliveryState>()(
    persist(
        (set, get) => ({
            tasks: MOCK_DELIVERY_TASKS,
            dailyQuotas: generateInitialQuotas(),
            addTask: (task) =>
                set((state) => ({ tasks: [...state.tasks, task] })),
            updateTaskStatus: (id, status) =>
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? { ...t, status } : t
                    ),
                })),
            setDailyQuota: (date, maxOrders) =>
                set((state) => ({
                    dailyQuotas: state.dailyQuotas.map((q) =>
                        q.date === date ? { ...q, maxOrders } : q
                    ),
                })),
            checkAvailability: (date) => {
                const quota = get().dailyQuotas.find((q) => q.date === date);
                if (!quota) return false;
                return quota.currentOrders < quota.maxOrders;
            },
            incrementQuota: (date) =>
                set((state) => ({
                    dailyQuotas: state.dailyQuotas.map((q) =>
                        q.date === date
                            ? { ...q, currentOrders: q.currentOrders + 1 }
                            : q
                    ),
                })),
        }),
        {
            name: 'delivery-storage',
        }
    )
);
````

## File: packages/lib/src/stores/product-store.ts
````typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface ProductState {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    removeProduct: (id: string) => void;
    getProductsByFarm: (farmId: string) => Product[];
    getActiveProducts: () => Product[];
}

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: MOCK_PRODUCTS,
            addProduct: (product) =>
                set((state) => ({ products: [...state.products, product] })),
            updateProduct: (id, updates) =>
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                })),
            removeProduct: (id) =>
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                })),
            getProductsByFarm: (farmId) =>
                get().products.filter((p) => p.farmId === farmId),
            getActiveProducts: () =>
                get().products.filter((p) => p.status === 'ACTIVE'),
        }),
        {
            name: 'product-storage',
        }
    )
);
````

## File: packages/lib/src/stores/user-store.ts
````typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { greenlinkApi } from '../api';
import { createClient } from '../api/supabase';

export interface UserProfile {
    id: string;
    nickname: string;
    pinkTemperature: {
        value: number;
        level: string;
        emoji: string;
    };
    points: number;
}

interface UserState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    cartCount: number;

    // Actions
    initializeAuthListener: () => void;
    loginWithProvider: (provider: 'kakao' | 'naver' | 'google') => Promise<void>;
    logout: () => Promise<void>;
    fetchProfileAndCart: () => Promise<void>;
    incrementCart: (qty?: number) => void;
}

let listenerInitialized = false;

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            cartCount: 0,

            initializeAuthListener: () => {
                if (listenerInitialized) return;
                listenerInitialized = true;

                const supabase = createClient();
                // 1. 앱 최초 로드 시 실제 Supabase 세션을 확인한다 (localStorage 캐시보다 우선)
                supabase.auth.getSession().then(async ({ data: { session } }) => {
                    if (session?.user) {
                        try {
                            const profile = await greenlinkApi.getProfile(session.user.id);
                            const count = await greenlinkApi.getCartCount(session.user.id);
                            // Kakao 메타데이터 닉네임 우선 적용
                            profile.nickname = session.user.user_metadata?.nickname
                                || session.user.user_metadata?.full_name
                                || profile.nickname;
                            set({ user: profile, isAuthenticated: true, cartCount: count });
                        } catch (e) {
                            console.error('Failed to load user profile on session check', e);
                            // 세션이 유효하지 않으면 초기화
                            set({ user: null, isAuthenticated: false, cartCount: 0 });
                        }
                    } else {
                        // 실제 세션이 없으면 무조건 로그아웃 상태로 초기화 (localStorage 무효화)
                        set({ user: null, isAuthenticated: false, cartCount: 0 });
                    }
                });

                // 2. 이후 세션 변경 이벤트 감지
                supabase.auth.onAuthStateChange(async (event, session) => {
                    if (event === 'SIGNED_IN' && session?.user) {
                        try {
                            const profile = await greenlinkApi.getProfile(session.user.id);
                            const count = await greenlinkApi.getCartCount(session.user.id);
                            profile.nickname = session.user.user_metadata?.nickname
                                || session.user.user_metadata?.full_name
                                || profile.nickname;
                            set({ user: profile, isAuthenticated: true, cartCount: count });
                        } catch (e) {
                            console.error('Failed to load user profile on auth change', e);
                        }
                    } else if (event === 'SIGNED_OUT') {
                        set({ user: null, isAuthenticated: false, cartCount: 0 });
                    }
                });
            },

            loginWithProvider: async (provider) => {
                try {
                    if (provider === 'kakao') {
                        // 1. 환경변수 검증 및 에러 던지기
                        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                        if (!supabaseUrl) throw new Error("[Auth Domain] Supabase URL is missing in environment");

                        // 2. Redirect URI 구성
                        const redirectTo = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`;

                        // 3. Kakao Auth URL 조합 (KOE205 방지를 위한 scopes 명시적 제어 유지)
                        const kakaoAuthUrl = `${supabaseUrl}/auth/v1/authorize?provider=kakao&redirect_to=${encodeURIComponent(redirectTo)}&scopes=${encodeURIComponent('profile_nickname profile_image')}`;

                        // 4. 리다이렉트 실행
                        window.location.href = kakaoAuthUrl;
                        return;
                    }

                    // 5. 기존 Provider (google 등) 로직
                    const supabase = createClient();
                    const { error } = await supabase.auth.signInWithOAuth({
                        provider: provider as any,
                        options: {
                            redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
                        }
                    });

                    if (error) {
                        throw error;
                    }
                } catch (error) {
                    // 6. 상태 추적용 명시적 로깅 (F12 수동 확인 지양)
                    console.error(`[Auth Domain] ${provider} Login Failed:`, error);
                    throw error; // UI Layer로 예외 전파
                }
            },

            logout: async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false, cartCount: 0 });
            },

            fetchProfileAndCart: async () => {
                const { isAuthenticated, user } = get();
                if (!isAuthenticated || !user) return;

                try {
                    const profile = await greenlinkApi.getProfile(user.id);
                    const count = await greenlinkApi.getCartCount(user.id);
                    set({ user: profile, cartCount: count });
                } catch (e) {
                    console.error('Failed to fetch user data', e);
                }
            },

            incrementCart: (qty = 1) => {
                set((state) => ({ cartCount: state.cartCount + qty }));
            }
        }),
        {
            name: 'user-storage',
            // cartCount만 캐싱하고, 인증 상태는 항상 Supabase에서 재확인한다
            partialize: (state) => ({ cartCount: state.cartCount })
        }
    )
);
````

## File: packages/lib/src/types/index.ts
````typescript
export * from './models';
export * from './group-buy';
export * from './user';
export * from './seller';
````

## File: packages/lib/src/utils/format.ts
````typescript
export function getAvailableDeliveryDates(): Date[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availableDates: Date[] = [];

    // D+2 to D+10
    for (let i = 2; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        if (date.getDay() !== 0) { // 0 is Sunday
            availableDates.push(date);
        }
    }

    return availableDates;
}

export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd'): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';

    if (formatStr === 'yyyy-MM-dd') {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Default to a long date format if not yyyy-MM-dd
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(d);
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
}
````

## File: packages/lib/src/utils/status-mapper.ts
````typescript
import { DeliveryStatus, OrderStatus, GroupBuyStatus } from '../types';

export function mapDeliveryToOrderStatus(deliveryStatus: DeliveryStatus): OrderStatus | null {
    switch (deliveryStatus) {
        case 'PICKED_UP':
            return 'DISPATCHED';
        case 'IN_TRANSIT':
            return 'DELIVERING';
        case 'DELIVERED':
            return 'COMPLETED';
        case 'PENDING':
        default:
            return null;
    }
}

export function getStatusColor(status: OrderStatus | DeliveryStatus | GroupBuyStatus): string {
    switch (status) {
        case 'ORDERED':
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800';
        case 'PREPARING':
            return 'bg-blue-100 text-blue-800';
        case 'DISPATCHED':
        case 'PICKED_UP':
            return 'bg-purple-100 text-purple-800';
        case 'DELIVERING':
        case 'IN_TRANSIT':
            return 'bg-indigo-100 text-indigo-800';
        case 'COMPLETED':
        case 'DELIVERED':
        case 'GOAL_MET':
            return 'bg-green-100 text-green-800';
        case 'CANCELLED':
            return 'bg-red-100 text-red-800';
        case 'RECRUITING':
            return 'bg-sky-100 text-sky-800';
        case 'ESCROW_DEPOSIT':
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}
````

## File: turbo.json
````json
{
    "$schema": "https://turbo.build/schema.json",
    "globalDependencies": [
        "**/.env.*local"
    ],
    "tasks": {
        "build": {
            "dependsOn": [
                "^build"
            ],
            "outputs": [
                ".next/**",
                "!.next/cache/**"
            ]
        },
        "lint": {
            "dependsOn": [
                "^lint"
            ],
            "outputs": []
        },
        "type-check": {
            "outputs": []
        },
        "dev": {
            "cache": false,
            "persistent": true
        },
        "clean": {
            "cache": false
        }
    }
}
````

## File: apps/admin/src/app/page.tsx
````typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@greenlink/lib";
import Link from "next/link";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingDeliveries: 0,
        totalSales: 0,
        activeDeals: 0
    });
    const supabase = createClient();

    useEffect(() => {
        async function fetchStats() {
            // 실제 운영 환경에선 정교한 집계 쿼리 사용
            const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
            const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'ESCROW_DEPOSIT');
            const { data: salesData } = await supabase.from('orders').select('total_price');
            const { count: dealCount } = await supabase.from('zero_inventory_items').select('*', { count: 'exact', head: true }).eq('status', 'RECRUITING');

            const totalSales = salesData?.reduce((acc, curr) => acc + curr.total_price, 0) || 0;

            setStats({
                totalOrders: orderCount || 0,
                pendingDeliveries: pendingCount || 0,
                totalSales,
                activeDeals: dealCount || 0
            });
        }

        fetchStats();
    }, []);

    const cards = [
        { name: "총 주문 건수", value: `${stats.totalOrders}건`, sub: "누적 주문량", icon: "📦", color: "blue" },
        { name: "미처리 배송", value: `${stats.pendingDeliveries}건`, sub: "즉시 처리 필요", icon: "🚚", color: "orange" },
        { name: "누적 매출액", value: `₩${stats.totalSales.toLocaleString()}`, sub: "예치금 포함", icon: "💰", color: "emerald" },
        { name: "진행 중 공구", value: `${stats.activeDeals}개`, sub: "모집 중 품목", icon: "🔥", color: "red" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-gray-900">대시보드 개요</h2>
                <p className="text-sm text-gray-400 mt-1 font-medium">디어 오키드 농장의 실시간 현황입니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-emerald-100/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-${card.color}-50`}>
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Global</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400">{card.name}</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{card.value}</h3>
                        <p className="text-[10px] font-extrabold text-emerald-600 mt-2 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">{card.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 mb-6">최근 알림</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 p-4 bg-emerald-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-emerald-200 flex-shrink-0 flex items-center justify-center text-lg">📢</div>
                            <div>
                                <p className="text-sm font-black text-emerald-900 underline decoration-emerald-200 underline-offset-4">새로운 공구 목표 달성!</p>
                                <p className="text-xs text-emerald-700 mt-1 font-bold">'호접란 아마빌리스' 품목이 목표 인원을 채워 GOAL_MET 상태가 되었습니다.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 border border-gray-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-lg">💡</div>
                            <div>
                                <p className="text-sm font-black text-gray-700">시스템 팁</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium">직배송 완료 버튼을 누르면 에스크로 정산이 즉시 실행됩니다.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                    <h3 className="text-lg font-black mb-2 leading-tight">GreenLink AI<br />Insight Beta</h3>
                    <p className="text-sm text-gray-400 font-bold mb-8">현재 구매 패턴 분석 결과, 주말 대비 평일 주문량이 24% 높습니다.</p>

                    <Link
                        href="/orders"
                        className="inline-flex items-center gap-2 bg-emerald-600 px-6 py-3 rounded-2xl text-sm font-black hover:bg-emerald-500 transition-all active:scale-95"
                    >
                        주문 내역 자세히 보기
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
````

## File: apps/web/src/app/category/page.tsx
````typescript
"use client";

import { greenlinkApi, ZeroInventoryItem } from "@greenlink/lib";
import { ZeroInventoryCard } from "@/components/GroupBuy/ZeroInventoryCard";
import Link from "next/link";
import { useState, useEffect } from "react";

type CategoryGubun = 'ORC' | 'CUT' | 'FOL';

const CATEGORIES: { id: CategoryGubun; label: string }[] = [
    { id: 'ORC', label: '난 (MVP)' },
    { id: 'CUT', label: '절화' },
    { id: 'FOL', label: '관엽' },
];

const CATEGORY_INFO = {
    ORC: {
        bannerTag: "서양란 특가전 (flowerGubun=3)",
        bannerTitle: "최근 경매 인기 품목\n제로 인벤토리 직송"
    },
    CUT: {
        bannerTag: "절화 직송 (Cut Flowers)",
        bannerTitle: "새벽 이슬 머금은 생화\n최상급 품질 선별"
    },
    FOL: {
        bannerTag: "반려식물 (Foliage Plants)",
        bannerTitle: "플랜테리어를 위한\n완벽한 수형의 관엽"
    }
};

export default function CategoryPage() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryGubun>('ORC');
    const [items, setItems] = useState<ZeroInventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string | null>(null);

    // Reset filter when category changes
    useEffect(() => {
        setFilter(null);
    }, [selectedCategory]);

    const filteredItems = items.filter(item => {
        if (!filter) return true;

        if (selectedCategory === 'CUT') {
            const stage = item.metadata?.bloomStage || 0;
            if (filter === 'BUD' && stage === 1) return true;
            if (filter === 'HALF' && (stage === 2 || stage === 3)) return true;
            if (filter === 'FULL' && (stage === 4 || stage === 5)) return true;
            return false;
        }

        if (selectedCategory === 'FOL') {
            const h = item.metadata?.plantHeight || 0;
            if (filter === 'SMALL' && h < 50) return true;
            if (filter === 'MEDIUM' && h >= 50 && h <= 100) return true;
            if (filter === 'LARGE' && h > 100) return true;
            return false;
        }

        return true;
    });

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        greenlinkApi.getZeroInventoryItems(selectedCategory)
            .then(data => {
                if (isMounted) {
                    setItems(data);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Failed to fetch zero inventory items:', error);
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => { isMounted = false; };
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white shadow-sm">
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                    <Link href="/" className="text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Link>
                    <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">공동구매 (제로인벤토리)</h1>
                </div>

                {/* Category Tabs */}
                <div className="flex px-4 pt-2 border-b border-gray-100 overflow-x-auto no-scrollbar bg-white">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-3 mr-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${selectedCategory === cat.id
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Informational Banner */}
            <div className="bg-green-600 px-4 py-5 text-white shadow-inner">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold opacity-90 tracking-wider">
                        {CATEGORY_INFO[selectedCategory].bannerTag}
                    </span>
                    <h2 className="text-xl font-extrabold leading-tight whitespace-pre-line">
                        {CATEGORY_INFO[selectedCategory].bannerTitle}
                    </h2>
                    <p className="text-xs opacity-80 mt-2 font-medium">
                        * 10명 결제(예치) 달성 시 익일 새벽 경매장에서 사입되어 문 앞까지 신선 배송됩니다.
                    </p>
                </div>
            </div>

            {/* Content List */}
            <main className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-800">
                        모집 중인 상품 <span className="text-green-600">{filteredItems.length}</span>
                    </span>
                    <button className="text-xs text-gray-500 font-medium flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                        경매 물량순
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </button>
                </div>

                {/* Category specific filters */}
                {selectedCategory === 'CUT' && (
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                        {['전체', '몽우리', '반개', '만개'].map((f, i) => {
                            const filterVal = i === 0 ? null : i === 1 ? 'BUD' : i === 2 ? 'HALF' : 'FULL';
                            return (
                                <button
                                    key={f}
                                    onClick={() => setFilter(filterVal)}
                                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors shadow-sm border ${filter === filterVal ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {f}
                                </button>
                            );
                        })}
                    </div>
                )}
                {selectedCategory === 'FOL' && (
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                        {['전체', '소형', '중형', '대형'].map((f, i) => {
                            const filterVal = i === 0 ? null : i === 1 ? 'SMALL' : i === 2 ? 'MEDIUM' : 'LARGE';
                            return (
                                <button
                                    key={f}
                                    onClick={() => setFilter(filterVal)}
                                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors shadow-sm border ${filter === filterVal ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {f}
                                </button>
                            );
                        })}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 pb-8">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <ZeroInventoryCard key={item.id} item={item} />
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-10 text-gray-400">
                                해당 필터 조건에 모집 중인 상품이 없습니다.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
````

## File: apps/web/src/app/farm/[id]/page.tsx
````typescript
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useFarmStore, useProductStore } from "@greenlink/lib/stores";
import { Button, Avatar, AvatarFallback } from "@greenlink/ui";

export default function FarmProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { farms } = useFarmStore();
    const { products } = useProductStore();
    const resolvedParams = use(params);
    const farm = farms.find((f) => f.id === resolvedParams.id);

    const farmProducts = products.filter((p) => p.farmId === farm?.id);

    if (!farm) return <div className="p-8 text-center">농가 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="pb-8 bg-white min-h-screen">
            {/* Simple Header */}
            <header className="p-4 flex items-center gap-2 sticky top-0 bg-white z-10 border-b border-gray-50">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    ←
                </Button>
                <h1 className="font-bold">농가 프로필</h1>
            </header>

            {/* Profile Section */}
            <section className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                    <Avatar className="w-24 h-24 border-4 border-green-50">
                        <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                            {farm.profileEmoji || farm.name[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{farm.name}</h2>
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                        📍 {farm.location.address}
                    </p>
                </div>

                <div className="flex justify-center gap-6 py-2 border-y border-gray-50">
                    <div className="text-center">
                        <p className="text-xs text-gray-400">평점</p>
                        <p className="font-bold flex items-center gap-1">
                            ⭐ 4.9
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400">단골수</p>
                        <p className="font-bold">1.2k</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400">상품수</p>
                        <p className="font-bold">{farmProducts.length}</p>
                    </div>
                </div>
            </section>

            {/* Farm Introduction */}
            <section className="px-6 py-4 space-y-2">
                <h3 className="font-bold text-gray-900">농가 소개</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    안녕하세요! {farm.location.address}에서 정성을 다해 키우고 있는 {farm.name}입니다.
                    신선하고 건강한 먹거리를 이웃분들에게 직접 전달해 드리고 싶어 그린링크에 참여하게 되었습니다.
                </p>
            </section>

            {/* Products grid */}
            <section className="px-4 py-6">
                <h3 className="font-bold text-gray-900 mb-4 px-2">판매 중인 상품</h3>
                <div className="grid grid-cols-2 gap-3">
                    {farmProducts.map((product) => (
                        <div key={product.id} className="space-y-2" onClick={() => router.push(`/product/${product.id}`)}>
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                                🌿
                            </div>
                            <div className="px-1">
                                <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                                <p className="font-bold text-sm">{product.price.toLocaleString()}원</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
````

## File: apps/web/src/app/layout.tsx
````typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/Layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: "GreenLink",
  description: "Hyperlocal direct transaction platform for flowers and farm products",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GreenLink",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-200`}>
        <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-xl relative overflow-x-hidden border-x border-gray-100">
          <main className="pb-20 safe-area-pb">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
````

## File: apps/web/src/app/order/page.tsx
````typescript
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductStore, useOrderStore } from "@greenlink/lib/stores";
import { DeliveryDatePicker } from "@/components/Order/DeliveryDatePicker";
import { PaymentButton } from "@/components/Order/PaymentButton";
import { Card, Input, Button } from "@greenlink/ui";

function OrderPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");

    const { products } = useProductStore();
    const { addOrder } = useOrderStore();

    const product = products.find((p: any) => p.id === productId);

    const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
    const [buyerName, setBuyerName] = useState("");
    const [buyerPhone, setBuyerPhone] = useState("");
    const [address, setAddress] = useState("");

    const isFormValid = product && deliveryDate && buyerName && buyerPhone && address;

    const handlePaymentSuccess = () => {
        alert("주문이 완료되었습니다! (Mock)");
        router.push("/");
    };

    if (!productId || !product) {
        return <div className="p-8 text-center">상품 정보가 없습니다.</div>;
    }

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <header className="bg-white p-4 sticky top-0 border-b border-gray-100 flex items-center gap-2">
                <Button variant="ghost" size="icon" {...({ onClick: () => router.back() } as any)}>
                    ←
                </Button>
                <h1 className="font-bold text-lg">주문하기</h1>
            </header>

            <main className="p-4 space-y-6">
                <section>
                    <h2 className="font-bold mb-2">주문 상품</h2>
                    <Card className="p-4 flex gap-3 border-none shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-2xl">
                            🌿
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">{product.name}</h3>
                            <p className="text-gray-500 text-xs">{product.farmId}</p>
                            <p className="font-bold mt-1">{product.price.toLocaleString()}원</p>
                        </div>
                    </Card>
                </section>

                <section>
                    <h2 className="font-bold mb-2">배송 정보</h2>
                    <Card className="p-4 space-y-3 border-none shadow-sm bg-white">
                        <Input
                            placeholder="받는 분 성함"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                        />
                        <Input
                            placeholder="연락처 (010-0000-0000)"
                            value={buyerPhone}
                            onChange={(e) => setBuyerPhone(e.target.value)}
                        />
                        <Input
                            placeholder="배송지 주소"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <div className="pt-2">
                            <label className="text-sm font-medium mb-1 block">희망 배송일 (D+2 ~ D+10)</label>
                            <DeliveryDatePicker
                                selectedDate={deliveryDate}
                                onSelect={setDeliveryDate}
                            />
                        </div>
                    </Card>
                </section>

                <section>
                    <h2 className="font-bold mb-2">결제 금액</h2>
                    <Card className="p-4 border-none shadow-sm bg-white">
                        <div className="flex justify-between mb-2 text-sm text-gray-500">
                            <span>상품 금액</span>
                            <span>{product.price.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between mb-2 text-sm text-gray-500">
                            <span>배송비</span>
                            <span>{(3000).toLocaleString()}원</span>
                        </div>
                        <div className="border-t border-gray-100 my-2 pt-2 flex justify-between font-bold text-lg">
                            <span>총 결제금액</span>
                            <span className="text-green-600">{(product.price + 3000).toLocaleString()}원</span>
                        </div>
                    </Card>
                </section>
            </main>

            <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100 safe-area-pb z-50">
                <PaymentButton
                    amount={product.price + 3000}
                    orderName={product.name}
                    onSuccess={handlePaymentSuccess}
                    disabled={!isFormValid}
                />
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">로딩중...</div>}>
            <OrderPageContent />
        </Suspense>
    );
}
````

## File: apps/web/src/app/page.tsx
````typescript
import { MOCK_PRODUCTS, MOCK_GROUP_BUYS } from "@greenlink/lib/constants";
import { ProductCard } from "@/components/Product/ProductCard";
import { GroupBuyCard } from "@/components/GroupBuy/GroupBuyCard";
import { Button, Badge } from "@greenlink/ui";
import { MOCK_FARMS } from "@greenlink/lib/constants/farms";
import Link from "next/link";

export default function Home() {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  const closingDeals = MOCK_GROUP_BUYS.filter((d: any) => d.status === 'RECRUITING').slice(0, 2);
  const recommendedFarm = MOCK_FARMS[0]; // '디어 오키드'

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* 1. Top Header */}
      <header className="sticky top-0 z-40 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 mb-0 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-600 tracking-tight">그린링크</span>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <button aria-label="Search" className="hover:text-gray-800 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button aria-label="Cart" className="relative hover:text-gray-800 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-600 text-[10px] font-bold text-white border-2 border-white">
              2
            </span>
          </button>
          <button aria-label="Notifications" className="hover:text-gray-800 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. Main Banner */}
      <section className="relative h-48 bg-emerald-600 text-white flex flex-col items-center justify-center overflow-hidden">
        {/* Simple decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 flex">
          <div className="w-1/2 h-full bg-gradient-to-br from-white to-transparent transform -skew-x-12"></div>
        </div>

        <div className="relative z-10 text-center space-y-2 translate-y-[-10px]">
          <h2 className="text-2xl font-bold tracking-tight">신선한 제철 농산물</h2>
          <p className="text-sm font-medium text-emerald-50">지금 바로 만나보세요</p>
        </div>

        {/* Navigation Dots (Visual only for now) */}
        <div className="absolute bottom-4 flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
          <div className="w-4 h-1.5 rounded-full bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
        </div>
      </section>

      {/* 3. Category Navigation */}
      <section className="bg-white px-2 py-5 mb-2 border-b border-gray-100">
        <div className="grid grid-cols-5 gap-2">
          {[
            { icon: "🍎", label: "과일" },
            { icon: "🥬", label: "채소" },
            { icon: "🌾", label: "곡물" },
            { icon: "🌸", label: "난/꽃" },
            { icon: "📦", label: "공구" },
          ].map((cat, idx) => (
            <Link key={idx} href="/category" className="flex flex-col items-center gap-1.5">
              <div className="w-[52px] h-[52px] rounded-[18px] bg-slate-50 flex items-center justify-center text-2xl shadow-sm border border-slate-100 hover:scale-105 transition-transform">
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-gray-600">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Closing Soon Group Buys */}
      <section className="bg-white py-6 mb-2 border-b border-gray-100">
        <div className="px-4 flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-bold flex items-center gap-1.5">
            <span className="text-orange-500">🔥</span> 지금 모집 중인 공구
            <span className="ml-1 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{closingDeals.length}</span>
          </h2>
          <Link href="/group-buy" className="text-[13px] text-gray-500 font-medium">
            전체보기 {'>'}
          </Link>
        </div>
        <div className="px-4 space-y-3">
          {closingDeals.map((deal: any) => (
            <GroupBuyCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* 5. Recommended Farms */}
      <section className="bg-white py-6 mb-2 border-b border-gray-100">
        <div className="px-4 mb-4">
          <h2 className="text-[17px] font-bold flex items-center gap-1.5">
            <span className="text-amber-700">🛖</span> 우리 동네 추천 농장
          </h2>
          <p className="text-[13px] text-gray-500 mt-0.5">내 동네 반경에서 인증된 농장이에요.</p>
        </div>

        <div className="px-4">
          {/* Custom Farm Card tailored for Home Page */}
          <div className="border border-green-100 rounded-2xl p-5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex gap-4 items-center border-b border-gray-50 pb-4 mb-4">
              <div className="w-[52px] h-[52px] rounded-[18px] bg-pink-100 flex items-center justify-center text-2xl flex-shrink-0">
                {recommendedFarm.profileEmoji}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-gray-900">{recommendedFarm.name}</h3>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-200 text-green-700 font-medium bg-green-50">인증 됨</Badge>
                </div>
                <p className="text-[12px] text-gray-500 mt-0.5">{recommendedFarm.location.city} {recommendedFarm.location.district} · 화훼/동양란</p>
                <p className="text-[12px] text-gray-400 mt-1 line-clamp-1">{recommendedFarm.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
              <div className="flex flex-col items-center justify-center px-2">
                <div className="flex items-center gap-1 text-green-600 font-bold mb-1">
                  <span className="text-sm">🌱</span> <span>{recommendedFarm.greenTemperature.value}°C</span>
                </div>
                <span className="text-[11px] text-gray-500">그린 온도</span>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                <div className="flex items-center gap-1 font-bold text-gray-700 mb-1">
                  <span className="text-sm">👤</span> <span>{recommendedFarm.followers}</span>
                </div>
                <span className="text-[11px] text-gray-500">단골</span>
              </div>
              <div className="flex flex-col items-center justify-center px-2 text-center">
                <span className="text-xs font-semibold text-gray-600 mb-0.5 flex items-center justify-center gap-1">
                  <span className="text-[10px]">📋</span> 농업경영체
                </span>
                <span className="text-[10px] text-gray-500">인증 완료</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {recommendedFarm.tags.slice(0, 5).map(tag => (
                <span key={tag} className="text-[11px] text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-medium">#{tag}</span>
              ))}
            </div>

            <button className="w-full mt-4 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              농장 프로필 보기 {'>'}
            </button>
          </div>
        </div>
      </section>

      {/* 6. Today's Specials */}
      <section className="bg-white py-6">
        <div className="px-4 mb-4 flex justify-between items-center">
          <h2 className="text-[17px] font-bold flex items-center gap-1.5">
            오늘의 특가 <span className="text-red-500">🔥</span>
          </h2>
          <Link href="/category" className="text-[13px] text-gray-500 font-medium">
            전체보기 {'>'}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
````

## File: apps/web/src/app/payment/page.tsx
````typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { greenlinkApi, ZeroInventoryItem } from "@greenlink/lib";
import Image from "next/image";

declare global {
    interface Window {
        IMP: any;
    }
}

type PaymentStep = 'confirm' | 'processing' | 'done';

function EscrowPaymentContent() {
    const router = useRouter();
    const params = useSearchParams();
    const itemId = params.get('itemId') ?? '';
    const qty = parseInt(params.get('qty') ?? '1', 10);

    const [item, setItem] = useState<ZeroInventoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<PaymentStep>('confirm');
    const [agreed, setAgreed] = useState(false);
    const [sdkLoaded, setSdkLoaded] = useState(false);

    // 1. PortOne SDK 동적 로드
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.iamport.kr/v1/iamport.js";
        script.async = true;
        script.onload = () => setSdkLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // 2. 상품 정보 페치
    useEffect(() => {
        let isMounted = true;
        if (itemId) {
            greenlinkApi.getZeroInventoryItem(itemId).then(data => {
                if (isMounted) {
                    setItem(data);
                    setLoading(false);
                }
            });
        } else {
            setLoading(false);
        }
        return () => { isMounted = false; };
    }, [itemId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
                <p className="text-gray-500">결제할 상품 정보를 찾을 수 없습니다.</p>
                <button onClick={() => router.push('/category')} className="text-green-600 font-bold">← 공동구매 목록으로</button>
            </div>
        );
    }

    const totalPrice = item.sellingPrice * qty;
    const remaining = item.targetParticipants - item.currentParticipants;

    function handlePay() {
        if (!item || !window.IMP || !sdkLoaded) {
            alert("결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        const shopId = process.env.NEXT_PUBLIC_PORTONE_SHOP_ID || 'imp00000000';
        window.IMP.init(shopId);

        const merchantUid = `mid_${new Date().getTime()}`;

        window.IMP.request_pay({
            pg: "kakaopay.TC0ONETIME",
            pay_method: "card",
            merchant_uid: merchantUid,
            name: item.itemNm,
            amount: totalPrice,
            buyer_email: "test@greenlink.io",
            buyer_name: "홍길동",
            buyer_tel: "010-1234-5678",
            buyer_addr: "서울특별시 강남구 삼성동",
            buyer_postcode: "123-456",
            custom_data: JSON.stringify({
                productId: item.id,
                quantity: qty
            })
        }, async (rsp: any) => {
            if (rsp.success) {
                setStep('processing');
                try {
                    // 서버사이드 검증 API 호출 (Step 1에서 구현한 webhook 엔드포인트 활용)
                    const verifyResponse = await fetch('/api/payment/webhook', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid,
                            status: 'paid'
                        })
                    });

                    if (verifyResponse.ok) {
                        setStep('done');
                    } else {
                        throw new Error('Verification failed');
                    }
                } catch (err) {
                    console.error('[Payment Domain] Client verification error:', err);
                    alert('결제 검증에 실패했습니다. 고객센터로 문의해주세요.');
                    setStep('confirm');
                }
            } else {
                alert(`결제 실패: ${rsp.error_msg}`);
                setStep('confirm');
            }
        });
    }

    if (step === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white p-8">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                <p className="text-lg font-bold text-gray-700">결제 예치 중...</p>
                <p className="text-sm text-gray-400 text-center">안전한 에스크로 결제가 진행 중입니다.<br />잠시만 기다려 주세요.</p>
            </div>
        );
    }

    if (step === 'done') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-white p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">예치 결제 완료!</h2>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                    공동구매 참여가 완료되었습니다.<br />
                    <strong className="text-gray-700">{remaining - 1 > 0 ? `${remaining - 1}명` : "1명"}</strong>만 더 모이면 구매가 확정됩니다.<br />
                    미달 시 100% 자동 환불됩니다.
                </p>

                <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">상품명</span>
                        <span className="font-bold text-gray-800">{item.itemNm}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">수량</span>
                        <span className="font-bold text-gray-800">{qty}개</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">예치 금액</span>
                        <span className="font-extrabold text-red-500">{totalPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">결제 방식</span>
                        <span className="text-blue-600 font-bold">에스크로 (안전결제)</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-sm mt-4">
                    <button
                        onClick={() => router.push('/category')}
                        className="w-full py-4 bg-green-600 text-white font-extrabold rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all"
                    >
                        공동구매 더 보기
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200"
                    >
                        홈으로 이동
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-28 min-h-screen bg-white">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center gap-3 p-4">
                <button onClick={() => router.back()} className="text-gray-600 hover:bg-gray-100 p-1 rounded-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <h1 className="text-[17px] font-bold text-gray-900">공구 참여 결제</h1>
            </header>

            <div className="p-4 space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <div>
                        <p className="text-sm font-extrabold text-blue-700">에스크로(안전결제) 방식</p>
                        <p className="text-xs text-blue-500 mt-0.5">공구 미달성 시 100% 자동 환불. 결제 금액은 구매 확정 전까지 별도 보관됩니다.</p>
                    </div>
                </div>

                <div className="border border-gray-100 rounded-2xl p-4 flex gap-3 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={item.imageUrl} alt={item.itemNm} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-extrabold text-gray-900 line-clamp-1">{item.itemNm}</p>
                        <p className="text-xs text-gray-400 mt-0.5">수량: {qty}개</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-base font-extrabold text-red-500">{(item.sellingPrice * qty).toLocaleString()}원</span>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">공구 참여 현황</p>
                    <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
                        <div className="h-2.5 bg-gradient-to-r from-red-400 to-orange-400 rounded-full transition-all"
                            style={{ width: `${Math.min((item.currentParticipants / item.targetParticipants) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-medium">
                        <span>{item.currentParticipants}명 참여 중</span>
                        <span>목표 {item.targetParticipants}명 — {remaining}명 남음</span>
                    </div>
                </div>

                <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                    <p className="text-sm font-bold text-gray-800 mb-3">결제 금액 상세</p>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">상품 금액</span>
                        <span className="font-medium">{item.sellingPrice.toLocaleString()}원 × {qty}</span>
                    </div>
                    <div className="h-px bg-gray-100 my-2" />
                    <div className="flex justify-between text-base font-extrabold">
                        <span>총 예치 금액</span>
                        <span className="text-red-500">{totalPrice.toLocaleString()}원</span>
                    </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-100 rounded-2xl">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-green-600 rounded"
                    />
                    <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                        공동구매 참여 조건(10명 달성 시 구매 확정, 미달 시 자동 환불), 에스크로 방식의 결제 조건 및 그린링크 이용약관에 동의합니다.
                    </p>
                </label>
            </div>

            <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-gray-100 p-4">
                <button
                    disabled={!agreed}
                    onClick={handlePay}
                    className={`w-full py-4 font-extrabold text-[16px] rounded-2xl transition-all ${agreed
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                >
                    {totalPrice.toLocaleString()}원 예치 결제하기
                </button>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>}>
            <EscrowPaymentContent />
        </Suspense>
    );
}
````

## File: docs/CRITICAL_LOGIC.md
````markdown
# GreenLink v2 - CRITICAL LOGIC & SSOT (Single Source of Truth)

> **경고 (WARNING)**: 이 문서는 GreenLink 프로젝트의 유일한 진실의 원천(SSOT)입니다. 모든 아키텍처 결정, 비즈니스 로직 수정, API 및 DB 스키마 설계는 이 문서의 원칙을 위배해서는 안 됩니다. 기존 로직을 수정해야 할 경우, 반드시 이 문서를 선제적으로 업데이트하고 팀의 승인을 받아야 합니다.

---

## 1. 런칭 전 필수 체크리스트 (Critical Reminders)

- [ ] **PG 실결제 연동**: `PORTONE_API_KEY`, `PORTONE_API_SECRET`, `NEXT_PUBLIC_PORTONE_SHOP_ID` 실운영 키 주입 필요.
- [ ] **보안 강화**: `SUPABASE_SERVICE_ROLE_KEY`는 서버측(Webhook)에서만 사용하며 외부 노출 엄격 금지.
- [ ] **자동화 고도화**: 일반 택배(COURIER)의 정산 자동화를 위한 외부 운송장 추적 API 연동 작업 (SweetTracker 등).

---

## 2. 플랫폼 비전 및 핵심 가치 (Platform Vision & Core Values)

GreenLink는 "산지의 신선함을 동네 거점(꽃집/무인사물함)을 통해 가장 빠르게 전달하는 하이퍼로컬 신뢰 공동체"를 지향한다.

- **유통 혁신**: 경매장 중심의 복잡한 유통 단계를 생략하고 산지와 거점을 직배송망으로 연결하여 중간 마진을 제거한다.
- **신뢰 보증**: 품질 전문가(Quality Inspector)의 현장 검수 및 데이터화 기반 큐레이션을 제공한다.
- **AI 비즈니스 효율화**: 농민용 V2S(Voice to Sales) 상세페이지 자동 생성, AI 비주얼 품질 판독, 실시간 최격 가격 제안을 수행한다.

---

## 3. 모노레포 아키텍처 및 성능 원칙 (Architecture & Performance)

본 프로젝트의 최우선 기술 과제는 극단적인 초기 로딩 속도 최적화(Extreme Performance)이다.

- **목표 성능**: TTFB(Time To First Byte) 20ms 이하 달성.
- **Server Components (RSC) 도입**: 모든 핵심 화면은 Server Component로 설계하여 클라이언트 사이드 자바스크립트 번들 크기를 최소화한다.
- **초경량 UI 지향**: 외부 아이콘 라이브러리 사용을 금지하며, 인라인 SVG와 Native CSS를 활용한다.
- **모노레포 구조**: Turborepo 기반 도메인별 앱 분리.
  - `apps/web`: 소비자 및 구매자 플랫폼 (Port 3000)
  - `apps/admin`: 셀러 비즈 포털 '그린링크 비즈' (Port 3001)
  - `apps/driver`: 배송 파트너 전용 앱 (Port 3002)
  - `packages/lib`, `packages/ui`: 공통 도메인 로직 및 디자인 시스템 공유.

---

## 4. 핵심 비즈니스 로직 (Core Business Logic)

### 4.1. 하이브리드 물류 및 배송 모델
- **밀크런(Milk Run) 집하**: AI가 다수 농가를 순회 집하하는 최적 차량 경로를 도출한다.
- **거점(Hub) 기반 라스트 마일**: 동네 꽃집과 무인 사물함을 배송 거점으로 활용하여 픽업 및 배송을 수행한다.
- **신선도 유지 라우팅**: 식물 특성에 따른 배송 우선순위를 동적으로 관리한다.

### 4.2. 제로 인벤토리(Zero-Inventory) 공동구매
- **선결제 후사입**: 구매 임계치(기본 10명) 도달 전까지 예치 결제로 진입하며, 미달 시 100% 자동 환불한다.
- **DB 원자적 연산**: 초과 모집 방지를 위해 `current_participants` 증감은 반드시 서버 RPC(`increment_participants`)를 사용한 원자적 연산으로 수행한다.
- **방어적 전이(Trigger)**: 목표 인원 도달 시 DB Trigger 수준에서 상태를 `GOAL_MET`으로 강제 전이시킨다.

### 4.3. 결제 검증 및 에스크로 정산
- **결제 검증**: PortOne Webhook 수신 시 서버사이드에서 액세스 토큰을 발급받아 결제 상태를 검증한다.
- **정산 트리거**: 
  - 직배송: 드라이버가 배송 완료 시 `confirm_delivery_and_settle` RPC 호출로 즉시 정산 확정.
  - 택배: 운송장 등록 시 `DISPATCHED`로 변경하며, 향후 배송 추적 API 연동을 통해 자동화를 추진한다.

---

## 5. 보안 및 컴플라이언스 (Security & Compliance)

- **IDOR 및 권한 제어**: 모든 API 호출 시 세션 ID와 소유자 ID 대조 로직을 강제 적용한다.
- **Supabase 인증**: 클라이언트 사이드 싱글톤 패턴(`packages/lib/src/api/supabase.ts`)을 통해 브라우저 세션 락 경합을 방지한다.
- **개인정보 보호**: 이웃 고객 수 노출 등 위치 정보 활용 시 사전 동의 프로세스를 필수 적용한다.

---

## 6. 개발 워크플로우 의무 (Development Workflow)

1. **사전 검토**: API 구조나 스키마 변경 시 반드시 이 문서(SSOT)를 선제 업데이트한다.
2. **테스트 자동화**: 핵심 로직 변경 시 `pytest` 또는 `vitest` 단위 테스트를 통한 회귀 검증을 수행한다.
3. **AI 협업 규정**: `scripts/Invoke-Repomix.ps1`을 통한 정기적 덤프 생성으로 AI 컨텍스트를 동기화한다.
````

## File: packages/lib/src/index.ts
````typescript
export * from './types';
export * from './constants';
export * from './utils';
export * from './api/client';
export * from './api';
export * from './api/external/naver-smartstore';
export * from './api/external/toss-payments';
export * from './stores';
export * from './api/supabase';
````

## File: packages/lib/src/stores/group-buy-store.ts
````typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GroupBuyDeal, GroupBuyStatus } from '../types';
import { MOCK_GROUP_BUYS } from '../constants';

interface GroupBuyState {
    deals: GroupBuyDeal[];
    joinDeal: (dealId: string, userId: string, quantity: number) => void;
    leaveDeal: (dealId: string, userId: string) => void;
    getDealById: (id: string) => GroupBuyDeal | undefined;
    updateSyncData: (dealId: string, currentParticipants: number, status: GroupBuyStatus) => void;
}

export const useGroupBuyStore = create<GroupBuyState>()(
    persist(
        (set, get) => ({
            deals: MOCK_GROUP_BUYS,
            joinDeal: (dealId, userId, quantity) =>
                set((state) => ({
                    deals: state.deals.map((deal) => {
                        if (deal.id !== dealId) return deal;

                        const newCount = deal.zeroInventoryItem.currentParticipants + quantity;
                        const isGoalMet = newCount >= deal.zeroInventoryItem.targetParticipants;
                        const newStatus: GroupBuyStatus = isGoalMet ? 'GOAL_MET' : deal.status;

                        return {
                            ...deal,
                            zeroInventoryItem: {
                                ...deal.zeroInventoryItem,
                                currentParticipants: newCount,
                                status: newStatus,
                            },
                            status: newStatus,
                            participants: [
                                ...deal.participants,
                                { userId, name: 'User', joinedAt: new Date().toISOString(), quantity, isEscrowPaid: true },
                            ],
                        };
                    }),
                })),
            leaveDeal: (dealId, userId) =>
                set((state) => ({
                    deals: state.deals.map((deal) => {
                        if (deal.id !== dealId) return deal;
                        // Simplified logic: remove participant and decrease count
                        const participant = deal.participants.find((p) => p.userId === userId);
                        if (!participant) return deal;

                        return {
                            ...deal,
                            zeroInventoryItem: {
                                ...deal.zeroInventoryItem,
                                currentParticipants: deal.zeroInventoryItem.currentParticipants - participant.quantity,
                            },
                            participants: deal.participants.filter((p) => p.userId !== userId),
                        };
                    }),
                })),
            getDealById: (id) => get().deals.find((d) => d.id === id),
            updateSyncData: (dealId, currentParticipants, status) =>
                set((state) => ({
                    deals: state.deals.map((deal) => {
                        if (deal.id !== dealId) return deal;
                        // zeroInventoryItem.id 도 동일하게 검사해서 매핑할 수 있으나 MVP에선 dealId 와 동일시 취급
                        return {
                            ...deal,
                            status,
                            zeroInventoryItem: {
                                ...deal.zeroInventoryItem,
                                currentParticipants,
                                status,
                            },
                        };
                    }),
                })),
        }),
        {
            name: 'group-buy-storage',
        }
    )
);
````

## File: packages/lib/src/stores/index.ts
````typescript
export * from './product-store';
export * from './order-store';
export * from './delivery-store';
export * from './group-buy-store';
export * from './auth-store';
export * from './farm-store';
export * from './user-store';
````

## File: packages/lib/src/types/group-buy.ts
````typescript
import { ProductMetadata } from './models';

export interface AuctionItem {
    id: string; // ex) auc-20260222-123
    settlementDate: string; // 경매 일자 YYYY-MM-DD
    flowerType: string; // 화훼 부류 (ex: '절화', '관엽', '난')
    flowerGubun: number; // API 파라미터 매핑 (ex: 3 = 난)
    itemName: string; // 품목명 (ex: '서양란')
    varietyName: string; // 품종명 (ex: '호접란(블루 스카이 특)')
    grade: string; // 등급 (특, 상, 보통 등)
    maxPrice: number; // 최고가
    minPrice: number; // 최저가
    avgPrice: number; // 평균가 (기준 원가)
    totalQuantity: number; // 총 거래 물량
}

export type GroupBuyStatus = 'RECRUITING' | 'GOAL_MET' | 'PURCHASING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

// 기존 KamisItem 역할을 대체하며, CRITICAL_LOGIC.md의 제로 인벤토리 모델을 온전히 구현한 표준 Interface
export interface ZeroInventoryItem {
    id: string;
    itemNm: string; // 노출용 상품명
    categoryId: 'CUT' | 'ORC' | 'FOL' | 'ETC'; // MVP 카테고리
    qty: number; // 참고용 최근 경매 물량
    avgCost: number; // 경매 원가 (매입 예상가)
    sellingPrice: number; // 판매가(예치 결제액)
    currentParticipants: number; // 현재 참여(결제) 인원
    targetParticipants: number; // 구매 임계치 (기본 10)
    status: GroupBuyStatus;
    imageUrl: string;
    auctionParams?: {
        flowerGubun: number;
        itemNm: string;
    };
    metadata?: ProductMetadata; // 유연한 카테고리 확장성
}

export interface GroupBuyParticipant {
    userId: string;
    name: string;
    joinedAt: string;
    quantity: number;
    isEscrowPaid: boolean; // 에스크로 결제 완료 여부
}

export interface GroupBuyDeal {
    id: string;
    zeroInventoryItem: ZeroInventoryItem; // 위에서 정의한 표준 아이템 포함
    title: string;
    description: string;
    status: GroupBuyStatus;
    deadline: string;
    deliveryDate?: string;
    participants: GroupBuyParticipant[];
    createdAt: string;
}
````

## File: README.md
````markdown
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
````

## File: apps/web/src/app/category/[id]/page.tsx
````typescript
"use client";

import { useRouter, notFound } from "next/navigation";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRealtimeDeal } from "@/hooks/useRealtimeDeal";

const AI_MARKETING: Record<string, string> = {
    "orc-1": "화사한 블루 계열의 호접란으로, 고급스러운 분위기를 자아냅니다. 인테리어 소품이나 선물용으로 인기가 높으며, 최근 경매에서 거래량 1위를 기록한 스테디셀러입니다. 생명력이 강해 초보자도 쉽게 키울 수 있어요.",
    "orc-2": "부드러운 핑크 빛깔의 호접란으로, 깔끔하고 세련된 느낌을 줍니다. 경매 현장에서 품귀 현상을 빚고 있는 인기 품종! 공동구매를 통해 경매 원가로 만나보세요.",
    "orc-3": "웅장한 루비골드 심비디움은 기업 행사, 개업식, 특별한 날에 최적화된 프리미엄 품종입니다. 화훼 전문가의 픽(Pick)으로 선정된 이달의 추천 품목!",
    "orc-4": "덴파레 크리스탈은 작고 깔끔한 크기로 책상, 화장대 위 어디든 잘 어울립니다. 물 주기가 간편하여 바쁜 현대인에게 딱 맞는 선택입니다.",
    "orc-5": "순백의 화이트 스완 호접란은 결혼식, 장례, 기념일 등 특별한 자리에서 품격을 더해줍니다. 빠르게 마감될 품목이니 서두르세요!",
};

const EXPERT_NOTES: Record<string, string> = {
    "orc-1": "2026-02-22 검수 완료 | 화훼 전문 검수관 '박민준' 검증 — 꽃대 3개 이상, 손상 없음, 색상 균일. 등급: A+",
    "orc-2": "2026-02-22 검수 완료 | 화훼 전문 검수관 '박민준' 검증 — 꽃봉오리 상태 양호, 잎 윤기 우수. 등급: A",
    "orc-3": "2026-02-22 검수 완료 | 화훼 전문 검수관 '이수진' 검증 — 화분 무게 균형, 잎 수분 충분. 등급: A+",
    "orc-4": "2026-02-22 검수 완료 | 화훼 전문 검수관 '이수진' 검증 — 크기 균일, 꽃색 발색 선명. 등급: A",
    "orc-5": "2026-02-22 검수 완료 | 화훼 전문 검수관 '박민준' 검증 — 흰 꽃잎 오염 없음, 향기 적당. 등급: A+",
};

export default function KamisItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { item, loading } = useRealtimeDeal(id);
    const [qty, setQty] = useState(1);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>;
    }

    if (!item) {
        notFound();
    }

    const isCompleted = item.currentParticipants >= item.targetParticipants || item.status === 'COMPLETED';
    const progressPercent = Math.min((item.currentParticipants / item.targetParticipants) * 100, 100);
    const aiContent = AI_MARKETING[item.id] ?? "경매 현장에서 인증된 최고 품질의 화훼 상품입니다. 신선도를 최우선으로 선별하였습니다.";
    const expertNote = EXPERT_NOTES[item.id] ?? "화훼 전문 검수관의 품질 검증이 완료된 상품입니다.";

    return (
        <div className="pb-28 bg-white min-h-screen">
            {/* Header */}
            <div className="relative aspect-square w-full bg-gray-100">
                <Image src={item.imageUrl} alt={item.itemNm} fill className="object-cover" />
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                {isCompleted && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-green-600 text-white font-extrabold text-lg px-6 py-3 rounded-2xl shadow-xl">모집 완료 — 사입 대기</span>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-5">
                {/* Title & Price */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">제로 인벤토리</span>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">ORC</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-1 leading-tight">{item.itemNm}</h1>
                    <div className="flex items-end gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-red-500">{item.sellingPrice.toLocaleString()}<span className="text-lg">원</span></span>
                        <span className="text-base text-gray-400 line-through mb-0.5">경매가 {item.avgCost.toLocaleString()}원</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">경매 물량(최근 7일): <strong className="text-gray-700">{item.qty.toLocaleString()}개</strong></p>
                </div>

                {/* Zero-Inventory Progress */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <div className="flex justify-between font-bold text-sm mb-2">
                        <span className="text-gray-700">참여 현황</span>
                        <span className="text-green-700">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-red-400 to-orange-400'}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                        <span>현재 {item.currentParticipants}명 참여</span>
                        <span>목표 {item.targetParticipants}명</span>
                    </div>
                    <p className="text-xs text-center text-green-700 mt-3 font-bold">
                        {isCompleted
                            ? "모집 완료! 익일 새벽 경매장에서 사입하여 바로 배송됩니다."
                            : `${item.targetParticipants - item.currentParticipants}명만 더 모이면 구매가 확정됩니다!`}
                    </p>
                </div>

                {/* AI Marketing Widget */}
                <div className="border border-blue-100 bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">AI V2S 마케팅</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiContent}</p>
                </div>

                {/* Expert Inspector Report */}
                <div className="border border-yellow-100 bg-yellow-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                        <span className="text-xs font-extrabold text-yellow-700">전문가 검수 리포트</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{expertNote}</p>
                </div>

                {/* 공동구매 안내 */}
                <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                    <h3 className="text-sm font-extrabold text-gray-800">공동구매 진행 안내</h3>
                    <ul className="text-xs text-gray-500 space-y-1.5">
                        <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>결제 예치 후 10명 도달 시 자동으로 구매 확정됩니다.</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>모집 기한 내 미달 시 100% 전액 자동 환불 보장.</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>사입 후 D+2 이내 현관 앞 냉장 배송 완료 예정.</li>
                        <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>참여 후 24시간 이내 취소 가능합니다.</li>
                    </ul>
                </div>

                {/* Quantity Selector */}
                {!isCompleted && (
                    <div className="flex items-center justify-between border border-gray-100 rounded-2xl p-4">
                        <span className="text-sm font-bold text-gray-700">구매 수량</span>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600 hover:bg-gray-200">-</button>
                            <span className="font-extrabold text-gray-900 w-4 text-center">{qty}</span>
                            <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 font-bold text-green-700 hover:bg-green-200">+</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-gray-100 p-4">
                {isCompleted ? (
                    <button disabled className="w-full py-4 bg-gray-200 text-gray-400 font-extrabold text-[16px] rounded-2xl">
                        모집 완료 (참여 불가)
                    </button>
                ) : (
                    <button
                        onClick={() => router.push(`/payment?itemId=${item.id}&qty=${qty}`)}
                        className="w-full py-4 bg-green-600 text-white font-extrabold text-[16px] rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all"
                    >
                        공구 참여 (결제예치) — {(item.sellingPrice * qty).toLocaleString()}원
                    </button>
                )}
            </div>
        </div>
    );
}
````

## File: apps/web/src/app/group-buy/page.tsx
````typescript
"use client";

import { useGroupBuyStore } from "@greenlink/lib/stores";
import { GroupBuyCard } from "@/components/GroupBuy/GroupBuyCard";
import type { GroupBuyDeal } from "@greenlink/lib/types";

export default function GroupBuyPage() {
    const { deals } = useGroupBuyStore();
    const openDeals = deals.filter((d: GroupBuyDeal) => d.status === 'RECRUITING' || d.status === 'GOAL_MET');

    return (
        <div className="space-y-4 pb-8">
            <header className="p-4 bg-white sticky top-0 z-10 border-b border-gray-100">
                <h1 className="text-xl font-bold">공동구매 🤝</h1>
                <p className="text-xs text-gray-500">함께 사면 경매가보다 저렴해요!</p>
            </header>

            <div className="px-4 space-y-4">
                {openDeals.map(deal => (
                    <GroupBuyCard key={deal.id} deal={deal} />
                ))}

                {openDeals.length === 0 && (
                    <div className="py-10 text-center text-gray-500">
                        진행 중인 공구가 없습니다. 😢
                    </div>
                )}
            </div>
        </div>
    );
}
````

## File: apps/web/src/components/GroupBuy/GroupBuyCard.tsx
````typescript
import { Card, Button, Progress, Badge } from "@greenlink/ui";
import { GroupBuyDeal } from "@greenlink/lib/types";
import Link from "next/link";
import Image from "next/image";
import { CountdownTimer } from "./CountdownTimer";


interface GroupBuyCardProps {
    deal: GroupBuyDeal;
}

export function GroupBuyCard({ deal }: GroupBuyCardProps) {
    const progressPercent = Math.min((deal.zeroInventoryItem.currentParticipants / deal.zeroInventoryItem.targetParticipants) * 100, 100);
    const isSuccess = deal.zeroInventoryItem.currentParticipants >= deal.zeroInventoryItem.targetParticipants;

    return (
        <Card className="p-4 border border-green-100/60 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-2xl">
            <div className="flex justify-between items-center mb-3">
                <Badge variant={isSuccess ? "default" : "secondary"} {...({ className: isSuccess ? "bg-green-600 hover:bg-green-700 text-xs px-2 py-0.5 rounded-full" : "bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 text-xs px-2 py-0.5 rounded-full" } as any)}>
                    {isSuccess ? "달성 성공! 🎉" : "마감 임박 🔥"}
                </Badge>
                <CountdownTimer targetDate={deal.deadline} className="text-[11px] font-medium text-gray-500" />
            </div>

            <div className="flex gap-3">
                <div className="relative w-20 h-20 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                    {deal.zeroInventoryItem.imageUrl ? (
                        <Image src={deal.zeroInventoryItem.imageUrl} alt={deal.title} fill className="object-cover" unoptimized />
                    ) : (
                        <span className="text-3xl opacity-80">🌿</span>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-[14px] font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{deal.title}</h3>

                    <div className="flex flex-col">
                        <span className="text-[16px] font-extrabold text-green-600">{deal.zeroInventoryItem.sellingPrice.toLocaleString()}원</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[11px] text-gray-400 line-through">{deal.zeroInventoryItem.avgCost.toLocaleString()}원</span>
                            <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1 py-0 rounded">-{Math.round((1 - deal.zeroInventoryItem.sellingPrice / deal.zeroInventoryItem.avgCost) * 100)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 space-y-2.5">
                <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium px-1">
                    <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <span className="text-[10px]">👥</span> {deal.participants.length}명 대기중
                    </span>
                    <span>{deal.zeroInventoryItem.currentParticipants} / {deal.zeroInventoryItem.targetParticipants}개 달성</span>
                </div>

                {/* Custom Gradient Progress */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </Card>
    );
}
````

## File: apps/web/src/components/Order/DeliveryDatePicker.tsx
````typescript
"use client";

import * as React from "react";
import { cn, Button, Popover, PopoverContent, PopoverTrigger } from "@greenlink/ui";
import { getAvailableDeliveryDates } from "@greenlink/lib/utils";

interface DeliveryDatePickerProps {
    className?: string;
    selectedDate?: Date;
    onSelect: (date: Date | undefined) => void;
}

export function DeliveryDatePicker({
    className,
    selectedDate,
    onSelect
}: DeliveryDatePickerProps) {
    const availableDates = getAvailableDeliveryDates();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    {...(
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        {
                            className: cn(
                                "w-full justify-start text-left font-normal h-12 shadow-sm border-gray-100",
                                !selectedDate && "text-muted-foreground",
                                className
                            )
                        } as any)}
                >
                    <span className="mr-3 text-lg">📅</span>
                    {selectedDate ? (
                        <span className="font-bold text-gray-900">
                            {new Intl.DateTimeFormat('ko-KR', {
                                month: 'long',
                                day: 'numeric',
                                weekday: 'short'
                            }).format(selectedDate)}
                        </span>
                    ) : (
                        <span className="text-gray-400">배송 희망일을 선택해주세요</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4 bg-white rounded-xl shadow-xl border-none" align="start">
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h4 className="text-sm font-black text-gray-900">배송 희망일 선택</h4>
                        <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">직송 가능</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {availableDates.map((date: Date) => {
                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                            const dayName = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => onSelect(date)}
                                    className={cn(
                                        "flex flex-col items-center justify-center py-3 px-1 rounded-xl border transition-all active:scale-95",
                                        isSelected
                                            ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-100"
                                            : "bg-gray-50 border-transparent text-gray-900 hover:bg-gray-100"
                                    )}
                                >
                                    <span className={cn(
                                        "text-[10px] font-bold mb-0.5",
                                        isSelected ? "text-green-100" : "text-gray-400"
                                    )}>
                                        {dayName}
                                    </span>
                                    <span className="text-sm font-black">
                                        {date.getDate()}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-100/50">
                        <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                            🌿 <span className="font-bold">안내:</span> 산지 직송 시스템 특성상 주문 2일 이후부터 수령이 가능하며 일요일은 배송하지 않습니다.
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
````

## File: apps/web/src/components/Product/ProductCard.tsx
````typescript
"use client";

import { Card } from "@greenlink/ui";
import { Product } from "@greenlink/lib/types";
import { cn } from "@greenlink/ui";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";



interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const defaultPlaceholder = "/images/placeholder.svg"; // 로컬 정적 파일 (외부 CDN 불필요)
    const [imgSrc, setImgSrc] = useState(product.images?.[0] || "");
    const [imgError, setImgError] = useState(false);

    return (
        <Link href={`/product/${product.id}`} className={cn("block", className)}>
            <Card className="overflow-hidden border-none shadow-none hover:shadow-sm transition-shadow">
                <div className="aspect-square bg-slate-50 relative rounded-xl mb-2 flex items-center justify-center text-4xl border border-slate-100/50">
                    {/* Fallback pattern for broken image links */}
                    {imgSrc && !imgError ? (
                        <Image
                            src={imgSrc}
                            alt={product.name}
                            fill
                            className="object-cover rounded-xl"
                            onError={() => {
                                setImgError(true);
                                setImgSrc(defaultPlaceholder);
                            }}
                        />
                    ) : (
                        <Image
                            src={defaultPlaceholder}
                            alt="Fallback placeholder"
                            fill
                            className="object-cover rounded-xl opacity-80"
                        />
                    )}
                </div>
                <div className="space-y-1.5 px-1">
                    <p className="text-[11px] text-gray-400 font-medium">{product.farmId} {/* Resolve farm name later via store or prop */}</p>
                    <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-snug">{product.name}</h3>
                    <div className="flex flex-col gap-0">
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[11px] text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>
                        )}
                        <span className="text-[15px] font-extrabold text-gray-900">{product.price.toLocaleString()}원</span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
````

## File: packages/lib/src/constants/group-buy.ts
````typescript
import { GroupBuyDeal } from '../types';

export const MOCK_GROUP_BUYS: GroupBuyDeal[] = [
    {
        id: 'gb-001',
        zeroInventoryItem: {
            id: 'orc-1',
            itemNm: '호접란 아마빌리스 특',
            categoryId: 'ORC',
            qty: 500,
            avgCost: 15000,
            sellingPrice: 19000,
            currentParticipants: 8,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: 'https://images.unsplash.com/photo-1495480174641-32599268f775?w=400&q=80',
        },
        title: '호접란(아마빌리스 특) 제로인벤토리',
        description: '경매장 직송! 최상급 호접란을 저렴하게 만나보세요.',
        status: 'RECRUITING',
        deadline: '2023-11-25T12:00:00Z',
        participants: [],
        createdAt: '2023-11-18T10:00:00Z',
    },
];
````

## File: packages/lib/src/constants/products.ts
````typescript
import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod-001',
        farmId: 'farm-dear-orchid-001',
        name: '보세란 (중품)',
        price: 35000,
        originalPrice: 45000,
        stock: 50,
        unit: '분',
        description: '향기가 진하고 잎이 우아한 보세란 중품입니다.',
        images: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&q=80'],
        category: 'ORC',
        status: 'ACTIVE',
        createdAt: '2023-10-01T10:00:00Z',
    },
    {
        id: 'prod-002',
        farmId: 'farm-dear-orchid-001',
        name: '풍란 (대품)',
        price: 80000,
        stock: 5,
        unit: '분',
        description: '오랜 시간 정성껏 기른 대품 풍란입니다.',
        images: ['https://images.unsplash.com/photo-1495480174641-32599268f775?w=400&q=80'],
        category: 'ORC',
        status: 'ACTIVE',
        createdAt: '2023-10-02T11:00:00Z',
    },
    {
        id: 'prod-003',
        farmId: 'farm-dear-orchid-001',
        name: '석곡 (소품)',
        price: 15000,
        stock: 30,
        unit: '분',
        description: '책상 위에 두기 좋은 귀여운 석곡 소품입니다.',
        images: ['https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80'],
        category: 'ORC',
        status: 'ACTIVE',
        createdAt: '2023-10-03T09:00:00Z',
    },
    {
        id: 'prod-004',
        farmId: 'farm-dear-orchid-001',
        name: '동양란 선물세트',
        price: 120000,
        originalPrice: 150000,
        stock: 8,
        unit: '세트',
        description: '고급스러운 동양란 3종 선물세트입니다.',
        images: ['https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&q=80'],
        category: 'ORC',
        status: 'ACTIVE',
        createdAt: '2023-10-05T14:00:00Z',
    },
    {
        id: 'prod-005',
        farmId: 'farm-dear-orchid-001',
        name: '난석 (배양토) 5L',
        price: 8000,
        stock: 50,
        unit: '포',
        description: '동양란 재배에 최적화된 프리미엄 난석입니다.',
        images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'],
        category: 'ETC',
        status: 'ACTIVE',
        createdAt: '2023-10-06T12:00:00Z',
    },
];
````

## File: packages/lib/src/types/models.ts
````typescript
export interface GreenTemperature {
    value: number; // 0~100 (거래 매너, 식물 신선도, 직배송 매너 기반)
    level: string; // '새싹' | '줄기' | '꽃' | '열매'
    emoji: string;
    description: string;
}

export interface Certification {
    name: string;
    issuedBy: string;
    issuedAt: string;
    // 다중 인증 시스템 고려: '농업경영체' | 'GPS위치인증' | '사업자인증' | '품질전문가인증'
    type?: 'FARM_MGMT' | 'GPS_LOC' | 'B2B_BIZ' | 'QUALITY_EXPERT';
}

export interface Farm {
    id: string;
    name: string;
    owner: string;
    category: 'CUT' | 'ORC' | 'FOL' | 'OTHER'; // 절화, 난, 관엽 특화
    subcategory: string;
    location: {
        address: string;
        city: string;
        district: string;
        coordinates?: { lat: number; lng: number };
    };
    phone: string;
    description: string;
    certifications: Certification[];
    greenTemperature: GreenTemperature;
    followers: number;
    createdAt: string;
    profileEmoji: string;
    tags: string[];
}

export interface ProductMetadata {
    // 절화(CUT)용
    bloomStage?: 1 | 2 | 3 | 4 | 5; // 개화 상태 지수 
    stemLength?: number; // 줄기 길이 (cm)
    fragrance?: 'STRONG' | 'MEDIUM' | 'WEAK' | 'NONE'; // 향기 강도

    // 관엽(FOL)용
    plantHeight?: number; // 식물 전체 높이 (cm)
    potSize?: number; // 화분 호수
    formQuality?: 'A' | 'B' | 'C'; // 수형 등급
    difficulty?: 'EASY' | 'NORMAL' | 'HARD'; // 관리 난이도

    // 기타 JSONB 확장을 위한 유연한 속성 배열 허용
    [key: string]: any;
}

export interface Product {
    id: string;
    farmId: string;
    name: string;
    price: number;
    originalPrice?: number; // 경매가 (avgCost)
    stock: number; // Zero-Inventory일 경우 targetParticipants로 쓰이거나, 실제 재고 수량으로 쓰임
    unit: string;
    description: string;
    images: string[];
    category: 'CUT' | 'ORC' | 'FOL' | 'ETC';
    status: 'ACTIVE' | 'SOLDOUT' | 'HIDDEN' | 'RECRUITING' | 'GOAL_MET';
    qualityInspectorReport?: { // 전문가 검수 리포트
        inspectorName: string;
        inspectedAt: string;
        grade: 'A+' | 'A' | 'B';
        notes: string;
    };
    aiMarketingText?: string; // V2S로 생성된 마케팅 문구
    createdAt: string;
    metadata?: ProductMetadata; // 유연한 카테고리 확장성(JSONB 대응)을 위한 필드
}

export type OrderStatus = 'ESCROW_DEPOSIT' | 'ORDERED' | 'PREPARING' | 'DISPATCHED' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
    id: string;
    productId: string; // 제로 인벤토리 공구 아이템 ID
    farmId?: string;
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    quantity: number;
    totalPrice: number;
    status: OrderStatus;
    deliveryDate: string; // YYYY-MM-DD, D+2 ~ D+10 예약 배송 시스템 고려
    orderedAt: string;
    isEscrow: boolean; // 100% 자동 환불을 위한 안전결제 플래그
    message?: string;
    deliveryTaskId?: string;
}

export type DeliveryStatus = 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';

export interface DeliveryTask {
    id: string;
    orderId: string;
    farmId: string;
    status: DeliveryStatus;
    pickupAddress: string;
    pickupCoords: { lat: number; lng: number };
    deliveryAddress: string;
    deliveryCoords: { lat: number; lng: number };
    recipientName: string;
    recipientPhone: string;
    items: string[];
    priority: number;
    photoUrls: string[];
    notes?: string;
    pickedUpAt?: string;
    deliveredAt?: string;
    createdAt: string;
}

export interface DailyQuota {
    date: string; // YYYY-MM-DD
    maxOrders: number;
    currentOrders: number;
}
````

## File: apps/web/src/app/group-buy/[id]/page.tsx
````typescript
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useGroupBuyStore } from "@greenlink/lib/stores";
import { Button, Badge, Progress, Card } from "@greenlink/ui";
import { CountdownTimer } from "@/components/GroupBuy/CountdownTimer";

export default function GroupBuyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { deals, joinDeal } = useGroupBuyStore();
    const resolvedParams = use(params);
    const deal = deals.find((d: any) => d.id === resolvedParams.id);

    if (!deal) return <div className="p-8 text-center">공구 정보를 찾을 수 없습니다.</div>;

    const progressPercent = Math.min((deal.zeroInventoryItem.currentParticipants / deal.zeroInventoryItem.targetParticipants) * 100, 100);
    const isSuccess = deal.zeroInventoryItem.currentParticipants >= deal.zeroInventoryItem.targetParticipants;

    return (
        <div className="pb-24 bg-white min-h-screen">
            {/* Header Image */}
            <div className="relative aspect-square bg-gray-100 flex items-center justify-center text-8xl">
                <Button
                    variant="ghost"
                    size="icon"
                    {...({ className: "absolute top-4 left-4 bg-white/50 hover:bg-white rounded-full z-10", onClick: () => router.back() } as any)}
                >
                    ←
                </Button>
                <span className="text-8xl">🌿</span>

                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    ⏰ <CountdownTimer targetDate={deal.deadline} />
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Title & Price */}
                <div>
                    <div className="flex gap-2 mb-2">
                        <Badge>{deal.status === 'RECRUITING' ? '진행중' : '마감'}</Badge>
                        {isSuccess && <Badge variant="secondary" {...({ className: "bg-green-100 text-green-700" } as any)}>달성 성공!</Badge>}
                    </div>
                    <h1 className="text-xl font-bold mb-1">{deal.title}</h1>
                    <p className="text-sm text-gray-500 mb-3">{deal.description}</p>

                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-green-600">{deal.zeroInventoryItem.sellingPrice.toLocaleString()}원</span>
                        <span className="text-sm text-gray-400 line-through mb-1">{deal.zeroInventoryItem.avgCost.toLocaleString()}원</span>
                    </div>
                </div>

                {/* Progress Section */}
                <Card className="p-4 bg-green-50 border-green-100">
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span>현재 참여 현황</span>
                        <span className="text-green-700">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-3 bg-white" />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{deal.zeroInventoryItem.currentParticipants}개 달성</span>
                        <span>목표 {deal.zeroInventoryItem.targetParticipants}개</span>
                    </div>
                    <p className="text-xs text-center text-green-700 mt-3 font-medium">
                        {deal.zeroInventoryItem.targetParticipants - deal.zeroInventoryItem.currentParticipants > 0
                            ? `${deal.zeroInventoryItem.targetParticipants - deal.zeroInventoryItem.currentParticipants}개만 더 모이면 최저가 확정!`
                            : "최저가 확정! 계속 참여 가능합니다 🎉"}
                    </p>
                </Card>

                {/* Participants - Mock */}
                <div>
                    <h3 className="text-sm font-bold mb-2 flex items-center gap-1">👥 참여자 ({deal.participants.length}명)</h3>
                    <div className="flex -space-x-2 overflow-hidden">
                        {[...Array(Math.min(5, deal.participants.length + 1))].map((_, i) => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs">
                                👤
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Bottom Bar */}
            <div className="fixed bottom-[72px] pb-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-100 safe-area-pb z-50">
                <Button
                    className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700"
                    onClick={() => {
                        joinDeal(deal.id, 'mock-user-id', 1);
                        alert("공구 참여가 완료되었습니다! (Mock)");
                        router.push('/group-buy');
                    }}
                    disabled={deal.status !== 'RECRUITING' && deal.status !== 'GOAL_MET'}
                >
                    {deal.status === 'RECRUITING' || deal.status === 'GOAL_MET' ? '공구 참여하기' : '마감된 공구입니다'}
                </Button>
            </div>
        </div>
    );
}
````

## File: apps/web/src/app/product/[id]/page.tsx
````typescript
import { notFound } from "next/navigation";
import Image from "next/image";
import { greenlinkApi } from "@greenlink/lib/api";
import { Badge } from "@greenlink/ui";
import { BackButton } from "@/components/Product/BackButton";
import { ProductCTA } from "@/components/Product/ProductCTA";

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params;
    const item = await greenlinkApi.getZeroInventoryItem(id);

    if (!item) notFound();

    const discountRate = item.avgCost > 0
        ? Math.max(0, Math.round((1 - item.sellingPrice / (item.avgCost * 1.5)) * 100))
        : 0;

    const imageUrl = item.imageUrl ?? null;

    return (
        <div className="pb-24 bg-white min-h-screen">
            {/* Header Image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden flex items-center justify-center text-8xl">
                <BackButton />
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={item.itemNm}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 480px"
                        unoptimized
                    />
                ) : (
                    <span>🌿</span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-green-600 font-bold">GreenLink 직배송</span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0 border-green-200 bg-green-50 text-green-700">
                            인증 농가
                        </Badge>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">{item.itemNm}</h1>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500">경매 평균가 {item.avgCost.toLocaleString()}원</p>
                        <p className="text-2xl font-bold text-gray-900">{item.sellingPrice.toLocaleString()}원</p>
                    </div>
                    {discountRate > 0 && (
                        <Badge className="bg-red-50 text-red-600 border-red-100 px-2 py-1 text-sm">
                            {discountRate}% 이상 절약
                        </Badge>
                    )}
                </div>

                {/* 공구 진행 현황 */}
                <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-green-800">공동구매 현황</span>
                        <span className="font-bold text-green-700">
                            {item.currentParticipants} / {item.targetParticipants}명
                        </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (item.currentParticipants / item.targetParticipants) * 100)}%` }}
                        />
                    </div>
                    {item.status === "GOAL_MET" && (
                        <p className="text-xs font-bold text-green-700 mt-1 text-center">
                            모집 완료! 사입 진행 예정
                        </p>
                    )}
                </div>

                <div className="prose prose-sm text-gray-600 mt-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">상품 상세 정보</h3>
                    <p>산지 직배송으로 신선하게 전달해 드립니다.</p>
                    <ul className="list-disc pl-4 space-y-1 text-xs mt-2">
                        <li>원산지: 국내산</li>
                        <li>경매 물량: {item.qty.toLocaleString()}본</li>
                        <li>보관방법: 서늘한 곳에 보관</li>
                    </ul>
                </div>
            </div>

            {/* Bottom CTA */}
            <ProductCTA productId={id} />
        </div>
    );
}
````

## File: apps/web/src/components/Layout/BottomNav.tsx
````typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@greenlink/ui";
import { useState, useEffect } from "react";
import { useUserStore } from "@greenlink/lib";

export function BottomNav() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const { isAuthenticated, cartCount, fetchProfileAndCart, initializeAuthListener } = useUserStore();

    useEffect(() => {
        setIsMounted(true);
        initializeAuthListener();
        if (isAuthenticated) {
            fetchProfileAndCart();
        }
    }, [isAuthenticated, fetchProfileAndCart, initializeAuthListener]);

    const navItems = [
        {
            href: "/",
            label: "홈",
            icon: (isActive: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
            )
        },
        {
            href: "/category",
            label: "카테고리",
            icon: (isActive: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
            )
        },
        {
            href: "/search",
            label: "검색",
            icon: (isActive: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            )
        },
        {
            href: "/cart",
            label: "장바구니",
            icon: (isActive: boolean) => (
                <div className="relative inline-block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    {isMounted && isAuthenticated && cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                            {cartCount}
                        </span>
                    )}
                </div>
            )
        },
        {
            href: "/mypage",
            label: "내 정보",
            icon: (isActive: boolean) => (
                <div className="relative inline-block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    {/* Removed pink temperature per user request */}
                </div>
            )
        },
    ];

    if (!isMounted) return null;

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-md border-t border-gray-100 py-3 safe-area-pb z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <div className="flex justify-around items-center px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1.5 p-1 transition-all duration-200",
                                isActive ? "text-green-600 scale-105" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <span className={cn(
                                "flex items-center justify-center transition-all",
                                !isActive && "opacity-70"
                            )}>
                                {item.icon(isActive)}
                            </span>
                            <span className={cn(
                                "text-[11px] font-bold tracking-tight transition-colors",
                                isActive ? "text-green-700" : "text-gray-400"
                            )}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
````

## File: packages/lib/src/api/index.ts
````typescript
import { ZeroInventoryItem, Order, OrderStatus } from '../types';
import { createClient } from './supabase';

function mapToItem(row: any): ZeroInventoryItem {
    return {
        id: row.id,
        itemNm: row.item_nm,
        categoryId: row.category_id as any,
        qty: row.qty,
        avgCost: row.avg_cost,
        sellingPrice: row.selling_price,
        currentParticipants: row.current_participants,
        targetParticipants: row.target_participants,
        status: row.status as any,
        imageUrl: row.image_url,
        auctionParams: row.auction_params,
        metadata: row.metadata,
    };
}

/**
 * GreenLink API Skeleton
 * 백엔드 연동을 위한 인터페이스 우선(Data Interface First) 접근법 기반의 Mock API Client
 * 실제 DB/백엔드 연동 시 이 클래스의 내부 로직만 axios/fetch 호출로 치환(Switch)하면 됩니다.
 */
class ApiSkeleton {

    private get supabase() { return createClient(); }

    // --- Mock Data ---
    private mockItems: ZeroInventoryItem[] = [
        // --- ORC (난) ---
        {
            id: "orc-1",
            itemNm: "호접란 (블루 스카이 특)",
            categoryId: 'ORC',
            qty: 8500,
            avgCost: 15000,
            sellingPrice: 19000,
            currentParticipants: 8,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1495480174641-32599268f775?w=400&h=400&fit=crop",
            auctionParams: { flowerGubun: 3, itemNm: '서양란' },
            metadata: { grade: 'SPECIAL', shootCount: 3 }
        },
        {
            id: "orc-2",
            itemNm: "동양란 (철골소심 상)",
            categoryId: 'ORC',
            qty: 3200,
            avgCost: 25000,
            sellingPrice: 32000,
            currentParticipants: 10,
            targetParticipants: 10,
            status: 'GOAL_MET',
            imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
            auctionParams: { flowerGubun: 1, itemNm: '동양란' },
            metadata: { grade: 'HIGH', shootCount: 5 }
        },
        // --- CUT (절화) ---
        {
            id: "cut-1",
            itemNm: "장미 (레드나오미 특)",
            categoryId: 'CUT',
            qty: 15420,
            avgCost: 15000,
            sellingPrice: 18500,
            currentParticipants: 7,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
            metadata: { bloomStage: 2, stemLength: 60, fragrance: 'WEAK' }
        },
        {
            id: "cut-2",
            itemNm: "튤립 (망고 특)",
            categoryId: 'CUT',
            qty: 8200,
            avgCost: 12000,
            sellingPrice: 15900,
            currentParticipants: 15,
            targetParticipants: 20,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
            metadata: { bloomStage: 1, stemLength: 50, fragrance: 'NONE' }
        },
        {
            id: "cut-3",
            itemNm: "안개꽃 (화이트 화형상)",
            categoryId: 'CUT',
            qty: 5400,
            avgCost: 8000,
            sellingPrice: 11000,
            currentParticipants: 10,
            targetParticipants: 10,
            status: 'GOAL_MET',
            imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&h=400&fit=crop",
            metadata: { bloomStage: 3, stemLength: 70, fragrance: 'NONE' }
        },
        // --- FOL (관엽) ---
        {
            id: "fol-1",
            itemNm: "몬스테라 (알보 상)",
            categoryId: 'FOL',
            qty: 3000,
            avgCost: 35000,
            sellingPrice: 42000,
            currentParticipants: 3,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1495480174641-32599268f775?w=400&h=400&fit=crop",
            metadata: { plantHeight: 40, potSize: 5, formQuality: 'B', difficulty: 'NORMAL' }
        },
        {
            id: "fol-2",
            itemNm: "금전수 (돈나무 대)",
            categoryId: 'FOL',
            qty: 1200,
            avgCost: 45000,
            sellingPrice: 55000,
            currentParticipants: 10,
            targetParticipants: 10,
            status: 'GOAL_MET',
            imageUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=400&fit=crop",
            metadata: { plantHeight: 80, potSize: 10, formQuality: 'A', difficulty: 'EASY' }
        },
        {
            id: "fol-3",
            itemNm: "뱅갈고무나무 (중)",
            categoryId: 'FOL',
            qty: 2500,
            avgCost: 28000,
            sellingPrice: 35000,
            currentParticipants: 5,
            targetParticipants: 10,
            status: 'RECRUITING',
            imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop",
            metadata: { plantHeight: 120, potSize: 8, formQuality: 'A', difficulty: 'EASY' }
        }
    ];

    private mockOrders: Order[] = [];

    // Utility for simulated network delay
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- ZERO-INVENTORY API ---

    // 1. 카테고리별 아이템 조회
    async getZeroInventoryItems(categoryId: 'CUT' | 'ORC' | 'FOL' | 'ETC'): Promise<ZeroInventoryItem[]> {
        const { data, error } = await this.supabase
            .from('zero_inventory_items')
            .select('*')
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('🟢 API Warning: getZeroInventoryItems fell back to mock data due to Supabase error or missing Config.');
            // Fallback to mock data if table is completely empty or network fails
            return this.mockItems.filter(item => item.categoryId === categoryId);
        }

        if (!data || data.length === 0) {
            // Temporary fallback if user hasn't seeded data
            return this.mockItems.filter(item => item.categoryId === categoryId);
        }

        return data.map(mapToItem);
    }

    // 2. 단일 아이템 상세 조회
    async getZeroInventoryItem(id: string): Promise<ZeroInventoryItem | null> {
        // Supabase id is UUID. If it's a mock ID (e.g. "orc-1"), bypass Supabase entirely to avoid PG throwing invalid uuid syntax.
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (!isUuid) {
            return this.mockItems.find(item => item.id === id) || null;
        }

        const { data, error } = await this.supabase
            .from('zero_inventory_items')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            console.warn(`🟢 API Warning: getZeroInventoryItem fell back to mock data for id: ${id}`);
            return this.mockItems.find(item => item.id === id) || null;
        }

        return mapToItem(data);
    }

    // --- ESCROW & ORDER API ---

    // 3. 에스크로 예치 결제 및 주문 생성
    async createEscrowOrder(
        itemId: string,
        qty: number,
        buyerInfo: { name: string, phone: string, address: string }
    ): Promise<Order> {
        // [Fallback] Mock ID bypass
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId);

        if (!isUuid) {
            await this.delay(800);
            const item = await this.getZeroInventoryItem(itemId);
            if (!item) throw new Error("Item not found");

            const newOrder: Order = {
                id: `ord-${Date.now()}`,
                productId: item.id,
                buyerName: buyerInfo.name,
                buyerPhone: buyerInfo.phone,
                buyerAddress: buyerInfo.address,
                quantity: qty,
                totalPrice: item.sellingPrice * qty,
                status: 'ESCROW_DEPOSIT',
                deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                orderedAt: new Date().toISOString(),
                isEscrow: true,
            };

            this.mockOrders.push(newOrder);
            item.currentParticipants += qty;
            if (item.currentParticipants >= item.targetParticipants) {
                item.status = 'GOAL_MET';
            }
            return newOrder;
        }

        // [Live] Atomic Supabase RPC call
        const item = await this.getZeroInventoryItem(itemId);
        if (!item) throw new Error("Database Item not found");

        const { data, error } = await this.supabase.rpc('create_escrow_order_txn', {
            p_product_id: itemId,
            p_buyer_name: buyerInfo.name,
            p_buyer_phone: buyerInfo.phone,
            p_buyer_address: buyerInfo.address,
            p_quantity: qty,
            p_total_price: item.sellingPrice * qty
        });

        if (error || !data) {
            console.error('API Error: createEscrowOrder (RPC)', error);
            throw new Error(`Order Failed: ${error?.message || 'Unknown Server Error'}`);
        }

        // Return the successfully created order model
        return {
            id: data.order_id,
            productId: itemId,
            buyerName: buyerInfo.name,
            buyerPhone: buyerInfo.phone,
            buyerAddress: buyerInfo.address,
            quantity: qty,
            totalPrice: item.sellingPrice * qty,
            status: 'ESCROW_DEPOSIT',
            deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            orderedAt: new Date().toISOString(),
            isEscrow: true,
        };
    }

    // 4. 내 주문 내역 조회
    async getMyOrders(): Promise<Order[]> {
        await this.delay(200);
        return this.mockOrders;
    }

    // --- USER PROFILE & CART API ---

    // 5. 유저 프로필 조회
    async getProfile(userId: string) {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !data) {
            console.warn(`🟢 API Warning: getProfile fell back to mock data for userId: ${userId}`);
            return {
                id: userId,
                nickname: "그린러버(Mock)",
                pinkTemperature: { value: 36.5, level: "첫눈", emoji: "♥" },
                points: 0
            };
        }

        return {
            id: data.id,
            nickname: data.nickname || "그린러버",
            pinkTemperature: data.pink_temperature || { value: 36.5, level: "첫눈", emoji: "♥" },
            points: data.points || 0
        };
    }

    // 6. 장바구니 수량 뱃지 조회
    async getCartCount(userId: string): Promise<number> {
        const { count, error } = await this.supabase
            .from('cart_items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) return 0;
        return count || 0;
    }
}

export const greenlinkApi = new ApiSkeleton();
````
