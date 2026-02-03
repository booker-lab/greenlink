'use client';

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, Truck, BarChart3, ShieldCheck, Leaf, BrainCircuit, Sprout } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div variants={fadeInUp} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                            <span className="text-sm font-semibold text-emerald-700">🌱 농장 직송 하이브리드 물류 플랫폼</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-8">
                            가장 신선한 <span className="text-emerald-600">초록</span>을<br />
                            당신의 <span className="text-emerald-600">공간</span>으로
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            그린링크는 복잡한 유통 단계를 걷어내고, 농장의 생명력을
                            <br className="hidden md:block" /> AI 기술로 보존하여 가장 빠르게 전달합니다.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                                지금 시작하기 <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                서비스 소개서
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-3xl -z-10 opacity-60" />
            </section>

            {/* Feature Grid */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: Leaf,
                                title: "다이내믹 신선 물류",
                                desc: "기존 물류 대비 배송 시간 40% 단축. 꽃이 시들기 전에 도착합니다."
                            },
                            {
                                icon: BrainCircuit,
                                title: "V2S AI 기술",
                                desc: "농민의 음성을 분석하여 상품 상세페이지를 자동으로 생성합니다."
                            },
                            {
                                icon: ShieldCheck,
                                title: "신뢰의 그린/핑크 온도",
                                desc: "빅데이터 기반 평판 시스템으로 믿을 수 있는 거래 환경을 만듭니다."
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Trust Statistics */}
            <section className="py-24 bg-emerald-900 text-white overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-16 opacity-90">숫자로 증명하는 그린링크의 가치</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { label: "누적 거래액", value: "₩12.4억+" },
                            { label: "파트너 농가", value: "850+" },
                            { label: "평균 배송시간", value: "14h" },
                            { label: "재구매율", value: "78%" },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl md:text-5xl font-bold mb-2 text-emerald-400">{stat.value}</div>
                                <div className="text-emerald-100 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-2 rounded-lg">
                            <Sprout className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-bold text-gray-900">GreenLink</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        © 2026 GreenLink Inc. All rights reserved. <br className="md:hidden" />
                        Designed for trust & freshness.
                    </p>
                </div>
            </footer>
        </div>
    );
}
