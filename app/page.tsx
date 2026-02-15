"use client";

import { BackgroundRippleEffect } from "@/components/ui/BackgroundRippleEffect";
import { ArrowRight, Wallet, PieChart, Activity, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const features = [
  {
    icon: Wallet,
    title: "Transaction Tracking",
    description: "Record every income & expense in detail. Auto-categorized and easy to search.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-400",
    glow: "rgba(16, 185, 129, 0.15)",
  },
  {
    icon: PieChart,
    title: "Smart Budgeting",
    description: "Set monthly targets, track your progress, and achieve your financial goals.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-400",
    glow: "rgba(59, 130, 246, 0.15)",
  },
  {
    icon: Activity,
    title: "Real-time Analytics",
    description: "Visualize your finances with interactive charts. Make smarter decisions.",
    color: "purple",
    gradient: "from-purple-500 to-pink-400",
    glow: "rgba(168, 85, 247, 0.15)",
  },
];

const stats = [
  { value: "100%", label: "Free" },
  { value: "256-bit", label: "Encryption" },
  { value: "24/7", label: "Access" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [globalMouse, setGlobalMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setGlobalMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative font-sans antialiased min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#030712] text-white"
    >
      <BackgroundRippleEffect className="opacity-100" mousePosition={globalMouse} />

      <main className="relative z-10 w-full max-w-6xl px-6 py-20 flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl px-5 py-2.5 mb-8"
        >
          <div className="relative h-2 w-2">
            <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
            <div className="relative h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
            Personal Finance Platform
          </span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-center tracking-tight mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
            MyDuid
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl text-center mb-4 leading-relaxed"
        >
          Manage your finances with{" "}
          <span className="text-white font-semibold">precision</span>,{" "}
          <span className="text-white font-semibold">transparency</span>, and{" "}
          <span className="text-white font-semibold">style</span>.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm text-slate-500 max-w-lg text-center mb-12"
        >
          A secure and fast personal finance dashboard designed to help you achieve financial freedom.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center gap-8 md:gap-12 mb-16"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="group relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-8 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-[0_0_40px_-12px_var(--glow)] hover:-translate-y-1 cursor-default"
              style={{ "--glow": feature.glow } as React.CSSProperties}
            >
              {/* Icon */}
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 mb-5 shadow-lg`}
                style={{ background: `linear-gradient(135deg, ${feature.glow}, transparent)` }}
              >
                <feature.icon className="h-6 w-6 text-white/80" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle shine on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at 50% 0%, ${feature.glow}, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/register"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:from-emerald-400 hover:to-emerald-300 transition-all duration-300 hover:scale-[1.03] flex items-center gap-2 group"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-white font-semibold text-sm hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 hover:scale-[1.02]"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex items-center gap-2 mt-12 text-slate-600 text-xs"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Your data is encrypted & stored securely</span>
        </motion.div>
      </main>
    </div>
  );
}
