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
