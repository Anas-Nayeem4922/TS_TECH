"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "signup";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/account";
    const { user, signIn, signUp } = useAuth();

    const [mode, setMode] = useState<Mode>("login");
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        referralCode: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) router.replace(redirect);
    }, [user, router, redirect]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) {
            setError("Please fill all required fields.");
            return;
        }
        if (mode === "signup" && !form.fullName.trim()) {
            setError("Please enter your full name.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const { error: err } =
            mode === "login" ?
                await signIn(form.email, form.password)
            :   await signUp(
                    form.email,
                    form.password,
                    form.fullName,
                    form.referralCode.trim() || undefined,
                );
        setLoading(false);

        if (err) {
            setError(
                err.includes("Invalid login") ?
                    "Invalid email or password."
                :   err,
            );
        } else if (mode === "signup") {
            setError("");
            setMode("login");
            setForm((p) => ({ ...p, fullName: "", password: "" }));
        }
    };

    return (
        <div className='min-h-screen pt-16 flex items-center justify-center px-4'>
            <div className='relative w-full max-w-sm'>
                {/* Background glow */}
                <div className='absolute inset-0 -top-20 bg-gold-500/5 blur-3xl rounded-full' />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='relative card-surface rounded-3xl border border-white/6 p-8'
                >
                    {/* Logo */}
                    <div className='flex flex-col items-center mb-8'>
                        <div className='relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-gold-500/30 mb-3'>
                            <Image
                                src='/images/WhatsApp_Image_2026-07-12_at_14.52.06 copy copy.jpeg'
                                alt='TS Technology'
                                fill
                                className='object-cover'
                            />
                        </div>
                        <div className='text-sm font-semibold gold-text'>
                            TS TECHNOLOGY
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className='flex bg-dark-400 rounded-xl p-1 mb-6'>
                        {(["login", "signup"] as Mode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => {
                                    setMode(m);
                                    setError("");
                                }}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                                    mode === m ?
                                        "bg-gold-500 text-dark-700"
                                    :   "text-silver-400 hover:text-white"
                                }`}
                            >
                                {m === "login" ? "Sign In" : "Sign Up"}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        {mode === "signup" && (
                            <div>
                                <label className='block text-xs text-silver-400 mb-1.5'>
                                    Full Name
                                </label>
                                <input
                                    type='text'
                                    value={form.fullName}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            fullName: e.target.value,
                                        }))
                                    }
                                    placeholder='Your full name'
                                    className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                                />
                            </div>
                        )}

                        <div>
                            <label className='block text-xs text-silver-400 mb-1.5'>
                                Email
                            </label>
                            <input
                                type='email'
                                value={form.email}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        email: e.target.value,
                                    }))
                                }
                                placeholder='you@example.com'
                                className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                            />
                        </div>

                        <div>
                            <label className='block text-xs text-silver-400 mb-1.5'>
                                Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            password: e.target.value,
                                        }))
                                    }
                                    placeholder='••••••••'
                                    className='w-full input-dark px-4 py-3 pr-10 rounded-xl text-sm'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword((p) => !p)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-300 transition-colors'
                                >
                                    {showPassword ?
                                        <EyeOff size={15} />
                                    :   <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {mode === "signup" && (
                            <div>
                                <label className='block text-xs text-silver-400 mb-1.5'>
                                    Referral Code{" "}
                                    <span className='text-silver-600'>
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    type='text'
                                    value={form.referralCode}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            referralCode: e.target.value,
                                        }))
                                    }
                                    placeholder='Enter referral code for rewards'
                                    className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                                />
                            </div>
                        )}

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2'
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full btn-gold flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold disabled:opacity-60'
                        >
                            {loading ?
                                <div className='w-4 h-4 rounded-full border-2 border-dark-700 border-t-transparent animate-spin' />
                            :   <>
                                    {mode === "login" ?
                                        "Sign In"
                                    :   "Create Account"}
                                    <ArrowRight size={15} />
                                </>
                            }
                        </button>
                    </form>

                    <p className='mt-5 text-center text-xs text-silver-600'>
                        {mode === "login" ?
                            "Don't have an account? "
                        :   "Already have an account? "}
                        <button
                            onClick={() => {
                                setMode(mode === "login" ? "signup" : "login");
                                setError("");
                            }}
                            className='text-gold-400 hover:underline'
                        >
                            {mode === "login" ? "Sign up" : "Sign in"}
                        </button>
                    </p>

                    <p className='mt-3 text-center text-[10px] text-silver-700'>
                        By continuing, you agree to our{" "}
                        <Link
                            href='/terms'
                            className='text-silver-500 hover:text-gold-400'
                        >
                            Terms
                        </Link>
                        {" & "}
                        <Link
                            href='/privacy-policy'
                            className='text-silver-500 hover:text-gold-400'
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
