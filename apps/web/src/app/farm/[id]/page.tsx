"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { greenlinkApi, ZeroInventoryItem, MOCK_FARMS } from "@greenlink/lib";
import { useEffect, useState } from "react";
import {
    Button,
    Card, CardContent,
    Avatar, AvatarImage, AvatarFallback,
    Badge,
    Progress,
    cn
} from "@greenlink/ui";
import { ChevronLeft, MapPin, Award, Users, Package, ThermometerSun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FarmProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const farm = MOCK_FARMS.find((f) => f.id === resolvedParams.id);

    const [farmItems, setFarmItems] = useState<ZeroInventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!farm) { setLoading(false); return; }
        const cat = (farm.category === 'OTHER' ? 'ETC' : farm.category) as 'CUT' | 'ORC' | 'FOL' | 'ETC';
        greenlinkApi.getZeroInventoryItems(cat)
            .then(items => setFarmItems(items))
            .finally(() => setLoading(false));
    }, [farm]);

    if (!farm) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 text-center bg-[var(--color-bg-subtle)]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-full bg-white/50 backdrop-blur-xl shadow-2xl border border-white/20"
                >
                    <p className="text-gray-400 font-bold text-lg mb-4">농가 정보를 찾을 수 없습니다.</p>
                    <Button variant="premium" onClick={() => router.back()} className="px-8 py-6 rounded-2xl shadow-xl">
                        ← 돌아가기
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pb-24 bg-[var(--color-bg)] min-h-screen selection:bg-teal-100">
            {/* Premium Header with Glassmorphism */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="rounded-full h-10 w-10 p-0 hover:bg-white/50 border border-transparent hover:border-white/40 transition-all duration-300"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
                    </Button>
                    <h1 className="text-[18px] font-black text-gray-900 tracking-tight">농가 프로필</h1>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </header>

            <AnimatePresence mode="wait">
                <motion.main
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="space-y-6 px-4 pt-6"
                >
                    {/* Profile Section */}
                    <Card className="overflow-visible border-none bg-gradient-to-b from-white to-white/60 shadow-2xl">
                        <CardContent className="p-8 text-center relative">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-teal-400/10 blur-[60px] rounded-full -z-10" />

                            <Avatar className="w-28 h-28 mx-auto mb-6 ring-8 ring-white/50 shadow-2xl ring-offset-4 ring-offset-transparent outline-none">
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-teal-50 to-emerald-50 text-emerald-600">
                                    {farm.profileEmoji || farm.name[0]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{farm.name}</h2>
                                <div className="flex items-center justify-center gap-1.5 text-gray-400 font-bold text-sm">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                    <span>{farm.location.address}</span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-1 mt-10 rounded-3xl overflow-hidden border border-gray-50 bg-gray-50/30 backdrop-blur-sm">
                                <div className="p-4 transition-colors hover:bg-white/50">
                                    <div className="flex justify-center mb-1"><Users className="w-4 h-4 text-teal-500" /></div>
                                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider">팔로워</p>
                                    <p className="font-black text-gray-900 text-lg">{(farm.followers || 0).toLocaleString()}</p>
                                </div>
                                <div className="p-4 transition-colors hover:bg-white/50 border-x border-gray-100/50">
                                    <div className="flex justify-center mb-1"><Package className="w-4 h-4 text-emerald-500" /></div>
                                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider">등록 상품</p>
                                    <p className="font-black text-gray-900 text-lg">{loading ? "..." : farmItems.length}</p>
                                </div>
                                <div className="p-4 transition-colors hover:bg-white/50">
                                    <div className="flex justify-center mb-1"><ThermometerSun className="w-4 h-4 text-orange-400" /></div>
                                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider">그린 온도</p>
                                    <p className="font-black text-green-600 text-lg">{farm.greenTemperature?.value ?? 36.5}°</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags Flow */}
                    {farm.tags && farm.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-2">
                            {farm.tags.map((tag, idx) => (
                                <motion.div
                                    key={tag}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                >
                                    <Badge
                                        variant="outline"
                                        className="bg-white/60 backdrop-blur-md border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-black text-xs hover:border-emerald-300 transition-colors shadow-sm"
                                    >
                                        #{tag}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Description Section */}
                    <Card className="bg-white/80 backdrop-blur-xl border-none shadow-xl">
                        <CardContent className="p-7 space-y-3">
                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                농가 소개
                            </h3>
                            <p className="text-[14px] text-gray-600 leading-relaxed font-bold tracking-tight">
                                {farm.description ||
                                    `안녕하세요! ${farm.location.address}에서 정성을 다해 키우고 있는 ${farm.name}입니다. 신선하고 건강한 꽃과 식물을 이웃분들에게 직접 전달해 드리고 싶어 그린링크에 참여하게 되었습니다.`
                                }
                            </p>
                        </CardContent>
                    </Card>

                    {/* Certification Grid */}
                    {farm.certifications && farm.certifications.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-base font-black text-gray-900 px-2 flex items-center gap-2">
                                <Award className="w-5 h-5 text-teal-600" />
                                인증 현황
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {farm.certifications.map((cert, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -4 }}
                                        className="flex items-center gap-4 bg-white/80 p-5 rounded-[24px] shadow-lg border border-white/50"
                                    >
                                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                                            🏅
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[14px] font-black text-gray-900">{cert.name}</p>
                                            <p className="text-[12px] text-gray-400 font-bold">{cert.issuedBy} · {cert.issuedAt}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products Section */}
                    <div className="space-y-5 pt-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-orange-400 rounded-full" />
                                공동구매 상품
                            </h3>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{farmItems.length} ITEMS</span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20 bg-white/30 rounded-[40px] border border-dashed border-gray-200">
                                <div className="w-10 h-10 border-4 border-emerald-50/50 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.2)]" />
                            </div>
                        ) : farmItems.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {farmItems.map((item, idx) => {
                                    const pct = Math.min((item.currentParticipants / item.targetParticipants) * 100, 100);
                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileTap={{ scale: 0.96 }}
                                            className="group relative"
                                            onClick={() => router.push(`/category/${item.id}`)}
                                        >
                                            <Card className="overflow-hidden border-none shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                                <div className="aspect-[4/5] relative bg-gray-50">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.itemNm} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                                                    )}
                                                    {/* Price Tag Overlay */}
                                                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-white text-[12px] font-black shadow-xl">
                                                        {item.sellingPrice.toLocaleString()}원
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-white">
                                                    <p className="text-[13px] font-black text-gray-900 line-clamp-1 mb-3 group-hover:text-emerald-600 transition-colors">
                                                        {item.itemNm}
                                                    </p>

                                                    <div className="space-y-2">
                                                        <Progress value={pct} className="h-2" />
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-[11px] font-black text-emerald-600">{Math.round(pct)}% 달성</p>
                                                            <p className="text-[10px] font-black text-gray-300">{item.currentParticipants}/{item.targetParticipants}명</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-white/40 rounded-[40px] border border-dashed border-gray-100">
                                <p className="text-[14px] text-gray-400 font-black">현재 등록된 상품이 없습니다.</p>
                            </div>
                        )}
                    </div>
                </motion.main>
            </AnimatePresence>
        </div>
    );
}

