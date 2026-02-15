"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, Wallet, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    const urlError = searchParams.get("error");

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

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-10 relative z-30">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3 tracking-tight">
                    Welcome Back
                </h1>
                <p className="text-slate-400 text-sm font-medium">
                    Enter your credentials to access your secure dashboard.
                </p>
            </div>

            {registered && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium text-center mb-6 backdrop-blur-md">
                    Account created successfully! Please sign in.
                </div>
            )}

            {urlError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center mb-6 backdrop-blur-md">
                    Authentication failed. Please try again.
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                        Email Address
                    </label>
                    <div className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.07] hover:border-blue-500/30 focus-within:bg-white/[0.08] focus-within:border-blue-500/40 focus-within:shadow-[0_0_20px_-5px_rgba(59,130,246,0.25)] shadow-lg shadow-black/10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="p-1.5 rounded-lg bg-white/5 group-focus-within:bg-blue-500/10 transition-colors">
                                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
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
                    <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                            Password
                        </label>
                    </div>
                    <div className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.07] hover:border-blue-500/30 focus-within:bg-white/[0.08] focus-within:border-blue-500/40 focus-within:shadow-[0_0_20px_-5px_rgba(59,130,246,0.25)] shadow-lg shadow-black/10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="p-1.5 rounded-lg bg-white/5 group-focus-within:bg-blue-500/10 transition-colors">
                                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
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
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center backdrop-blur-md">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full relative z-10 inline-flex justify-center items-center px-4 py-4 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)] text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] border-0"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Sign In to Account
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </form>

            <div className="relative my-8 z-10">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700" />
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold px-2">
                        Or continue with
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700" />
                </div>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="relative z-10 w-full inline-flex justify-center items-center px-4 py-3.5 border border-white/10 shadow-lg shadow-black/20 bg-white/[0.05] hover:bg-white/[0.1] text-sm font-medium text-white rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 group transform hover:scale-[1.01]"
            >
                <svg
                    aria-hidden="true"
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    ></path>
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    ></path>
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    ></path>
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    ></path>
                </svg>
                Sign in with Google
            </button>

            <div className="text-center mt-6 relative z-10">
                <p className="text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
