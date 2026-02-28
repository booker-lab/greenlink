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
