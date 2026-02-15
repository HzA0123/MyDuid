"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/actions/register";
import { Button } from "@/components/ui/button";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);

        const result = await registerUser(formData);

        if (result?.error) {
            if (typeof result.error === "string") {
                setError(result.error);
            } else {
                setError("Please check your input fields");
            }
            setLoading(false);
        } else {
            router.push("/login?registered=true");
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-10 relative z-30">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3 tracking-tight">
                    Create Account
                </h1>
                <p className="text-slate-400 text-sm font-medium">
                    Enter your details to create your secure account.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                        Full Name
                    </label>
                    <div className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.07] hover:border-emerald-500/30 focus-within:bg-white/[0.08] focus-within:border-emerald-500/40 focus-within:shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)] shadow-lg shadow-black/10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="p-1.5 rounded-lg bg-white/5 group-focus-within:bg-emerald-500/10 transition-colors">
                                <User className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                        </div>
                        <input
                            {...register("name")}
                            className="w-full bg-transparent border-none rounded-2xl pl-14 pr-4 py-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-0 transition-all [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-400 text-xs ml-1 mt-1 font-medium">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                        Email Address
                    </label>
                    <div className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.07] hover:border-emerald-500/30 focus-within:bg-white/[0.08] focus-within:border-emerald-500/40 focus-within:shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)] shadow-lg shadow-black/10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="p-1.5 rounded-lg bg-white/5 group-focus-within:bg-emerald-500/10 transition-colors">
                                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                        </div>
                        <input
                            {...register("email")}
                            className="w-full bg-transparent border-none rounded-2xl pl-14 pr-4 py-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-0 transition-all [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                            placeholder="name@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-400 text-xs ml-1 mt-1 font-medium">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                        Password
                    </label>
                    <div className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.07] hover:border-emerald-500/30 focus-within:bg-white/[0.08] focus-within:border-emerald-500/40 focus-within:shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)] shadow-lg shadow-black/10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="p-1.5 rounded-lg bg-white/5 group-focus-within:bg-emerald-500/10 transition-colors">
                                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                        </div>
                        <input
                            {...register("password")}
                            type="password"
                            className="w-full bg-transparent border-none rounded-2xl pl-14 pr-4 py-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-0 transition-all [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-400 text-xs ml-1 mt-1 font-medium">{errors.password.message}</p>
                    )}
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center backdrop-blur-md">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full relative z-10 inline-flex justify-center items-center px-4 py-4 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] text-sm font-bold rounded-2xl text-slate-950 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-[1.02] border-0"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Create Account
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>

                <div className="text-center mt-6 relative z-10">
                    <p className="text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
