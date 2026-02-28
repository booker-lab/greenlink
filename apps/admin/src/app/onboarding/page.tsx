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
