"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { BackgroundRippleEffect } from "@/components/ui/BackgroundRippleEffect";
import { Wallet } from "lucide-react";
import { useRef, useState } from "react";

export default function RegisterPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [globalMouse, setGlobalMouse] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;


        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setGlobalMouse({ x, y });


        if (cardRef.current) {
            const cardRect = cardRef.current.getBoundingClientRect();
            const cardX = e.clientX - cardRect.left;
            const cardY = e.clientY - cardRect.top;
            cardRef.current.style.setProperty("--card-mouse-x", `${cardX}px`);
            cardRef.current.style.setProperty("--card-mouse-y", `${cardY}px`);
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative font-sans antialiased h-screen w-full overflow-hidden flex items-center justify-center bg-[#030712] text-white group/container"
        >
            <BackgroundRippleEffect className="opacity-100" mousePosition={globalMouse} />

            <main className="relative z-10 w-full max-w-5xl px-4 flex justify-center items-center">
                <div
                    ref={cardRef}
                    className="group/card relative z-20 w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]"
                >


                    <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                        style={{
                            background: `radial-gradient(600px circle at var(--card-mouse-x) var(--card-mouse-y), rgba(16, 185, 129, 0.15), transparent 80%)`
                        }}
                    />

                    <div className="grid md:grid-cols-2 relative z-10">

                        <div className="relative hidden md:flex flex-col justify-between p-12 bg-white/[0.02] border-r border-white/5">
                            <div className="relative z-10">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-6 border border-emerald-500/20">
                                    <Wallet className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h2 className="text-3xl font-bold font-sans text-white tracking-tight mb-2">MyDuid Secure</h2>
                                <p className="text-slate-400">
                                    Join the future of personal finance management today.
                                </p>
                            </div>

                            <div className="relative z-10 mt-12">
                                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 w-fit backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 group/badge cursor-default">
                                    <div className="relative h-2 w-2">
                                        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                                        <div className="relative h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase group-hover/badge:text-slate-300 transition-colors">Registration Open</span>
                                </div>
                            </div>
                        </div>


                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <RegisterForm />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
