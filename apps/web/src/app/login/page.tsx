"use client";

import { Button } from "@greenlink/ui";
import { useUserStore, resetSupabaseBrowserClient } from "@greenlink/lib";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<{ google: boolean, kakao: boolean }>({ google: false, kakao: false });
    const [rememberMe, setRememberMe] = useState(false);
    const { loginWithProvider } = useUserStore();

    const handleLogin = async (provider: 'google' | 'kakao') => {
        try {
            setIsLoading(prev => ({ ...prev, [provider]: true }));
            // [Remember Me] 체크박스 상태를 로컬 스토리지에 저장하고 클라이언트를 리셋하여 
            // 새로운 인스턴스가 변경된 설정을 기반으로 생성되도록 함
            if (typeof window !== 'undefined') {
                localStorage.setItem('gl_remember_me', rememberMe ? 'true' : 'false');
                resetSupabaseBrowserClient();
            }
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
                {/* 로그인 상태 유지 체크박스 */}
                <div className="flex items-center gap-2 mb-6 px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-green-600 checked:border-green-600 transition-all cursor-pointer"
                            />
                            <svg
                                className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="4"
                            >
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-[13px] font-bold text-gray-500 group-hover:text-green-700 transition-colors">
                            로그인 상태 유지하기
                        </span>
                    </label>
                </div>

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
