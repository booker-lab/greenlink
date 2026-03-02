"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@greenlink/lib/stores";
import { Input, Button, Card, CardContent, CardHeader, CardTitle } from "@greenlink/ui";

export default function LoginPage() {
    const router = useRouter();
    const { sendOtp, verifyOtp, otpSent, loginPhone } = useAuthStore();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const success = await sendOtp(phone);
        setIsLoading(false);
        if (!success) setError("OTP 발송 실패");
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const success = await verifyOtp(otp);
        setIsLoading(false);
        if (success) {
            router.push("/delivery");
        } else {
            setError("인증번호가 일치하지 않습니다. (000000)");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        기사님 로그인 🚚
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="tel"
                                    placeholder="휴대폰 번호 (- 없이 입력)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? "발송 중..." : "인증번호 받기"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="text-center text-gray-400 mb-4">
                                {loginPhone}으로 인증번호가 발송되었습니다.<br />
                                (테스트용: 000000)
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="인증번호 6자리"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white text-center text-2xl tracking-widest"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? "확인 중..." : "로그인 완료"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
