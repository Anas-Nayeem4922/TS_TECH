"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "signup";
type Step = "credentials" | "otp";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";
    const { user, sendOtp, verifyOtp } = useAuth();

    const [mode, setMode] = useState<Mode>("login");
    const [step, setStep] = useState<Step>("credentials");
    const [form, setForm] = useState({ fullName: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        if (user) router.replace(redirect);
    }, [user, router, redirect]);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleSendOtp = async (e: React.FormEvent) => {
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
        const { error: err } = await sendOtp(
            form.email,
            form.password,
            mode === "signup" ? form.fullName : undefined,
            mode === "login" ? "signin" : "signup",
        );
        setLoading(false);

        if (err) {
            setError(err);
        } else {
            setStep("otp");
            setResendTimer(60);
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);
        if (pasted.length > 0) {
            const newOtp = pasted
                .split("")
                .concat(Array(6 - pasted.length).fill(""));
            setOtp(newOtp);
            otpRefs.current[Math.min(pasted.length, 5)]?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        setError("");
        const code = otp.join("");
        if (code.length !== 6) {
            setError("Please enter all 6 digits.");
            return;
        }

        setLoading(true);
        const { error: err } = await verifyOtp(
            form.email,
            form.password,
            mode === "signup" ? form.fullName : undefined,
            code,
            mode === "login" ? "signin" : "signup",
        );
        setLoading(false);

        if (err) {
            setError(err);
            setOtp(["", "", "", "", "", ""]);
            otpRefs.current[0]?.focus();
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setError("");
        setLoading(true);
        const { error: err } = await sendOtp(
            form.email,
            form.password,
            mode === "signup" ? form.fullName : undefined,
            mode === "login" ? "signin" : "signup",
        );
        setLoading(false);
        if (err) {
            setError(err);
        } else {
            setResendTimer(60);
            setOtp(["", "", "", "", "", ""]);
            otpRefs.current[0]?.focus();
        }
    };

    const goBack = () => {
        setStep("credentials");
        setOtp(["", "", "", "", "", ""]);
        setError("");
    };

    const switchMode = (newMode: Mode) => {
        setMode(newMode);
        setStep("credentials");
        setOtp(["", "", "", "", "", ""]);
        setError("");
    };

    return (
        <div className='min-h-screen pt-16 flex items-center justify-center px-4 py-10'>
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

                    <AnimatePresence mode='wait'>
                        {step === "credentials" ?
                            <motion.div
                                key='credentials'
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Mode Toggle */}
                                <div className='flex bg-dark-400 rounded-xl p-1 mb-6'>
                                    {(["login", "signup"] as Mode[]).map(
                                        (m) => (
                                            <button
                                                key={m}
                                                onClick={() => switchMode(m)}
                                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                                                    mode === m ?
                                                        "bg-gold-500 text-dark-700"
                                                    :   "text-silver-400 hover:text-white"
                                                }`}
                                            >
                                                {m === "login" ?
                                                    "Sign In"
                                                :   "Sign Up"}
                                            </button>
                                        ),
                                    )}
                                </div>

                                <form
                                    onSubmit={handleSendOtp}
                                    className='space-y-4'
                                >
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
                                                        fullName:
                                                            e.target.value,
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
                                                type={
                                                    showPassword ? "text" : (
                                                        "password"
                                                    )
                                                }
                                                value={form.password}
                                                onChange={(e) =>
                                                    setForm((p) => ({
                                                        ...p,
                                                        password:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder='••••••••'
                                                className='w-full input-dark px-4 py-3 pr-10 rounded-xl text-sm'
                                            />
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    setShowPassword((p) => !p)
                                                }
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-300 transition-colors'
                                            >
                                                {showPassword ?
                                                    <EyeOff size={15} />
                                                :   <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>

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
                                                    "Continue"
                                                :   "Continue"}
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
                                        onClick={() =>
                                            switchMode(
                                                mode === "login" ? "signup" : (
                                                    "login"
                                                ),
                                            )
                                        }
                                        className='text-gold-400 hover:underline'
                                    >
                                        {mode === "login" ?
                                            "Sign up"
                                        :   "Sign in"}
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

                                <p className='mt-4 text-center text-[10px] text-silver-700 flex items-center justify-center gap-1'>
                                    <ShieldCheck
                                        size={11}
                                        className='text-gold-500/50'
                                    />
                                    A verification code will be sent to your
                                    email
                                </p>
                            </motion.div>
                        :   <motion.div
                                key='otp'
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Back button */}
                                <button
                                    onClick={goBack}
                                    className='flex items-center gap-1.5 text-xs text-silver-500 hover:text-white transition-colors mb-6'
                                >
                                    <ArrowLeft size={14} /> Back
                                </button>

                                {/* Icon */}
                                <div className='flex justify-center mb-4'>
                                    <div className='w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center'>
                                        <Mail
                                            size={22}
                                            className='text-gold-400'
                                        />
                                    </div>
                                </div>

                                <h2 className='text-lg font-bold text-white text-center mb-2'>
                                    Verify Your Email
                                </h2>
                                <p className='text-xs text-silver-500 text-center mb-6'>
                                    We sent a 6-digit code to
                                    <br />
                                    <span className='text-silver-300 font-medium'>
                                        {form.email}
                                    </span>
                                </p>

                                {/* OTP inputs */}
                                <div
                                    className='flex gap-2 justify-between mb-6'
                                    onPaste={handleOtpPaste}
                                >
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => {
                                                otpRefs.current[i] = el;
                                            }}
                                            type='text'
                                            inputMode='numeric'
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleOtpChange(
                                                    i,
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleOtpKeyDown(i, e)
                                            }
                                            className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all ${
                                                digit ?
                                                    "border-gold-500/50 bg-gold-500/10 text-gold-400"
                                                :   "border-white/10 bg-dark-400 text-white focus:border-gold-500/40"
                                            } focus:outline-none`}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className='text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2 mb-4'
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={
                                        loading || otp.join("").length !== 6
                                    }
                                    className='w-full btn-gold flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold disabled:opacity-60'
                                >
                                    {loading ?
                                        <div className='w-4 h-4 rounded-full border-2 border-dark-700 border-t-transparent animate-spin' />
                                    :   <>
                                            <ShieldCheck size={15} /> Verify &{" "}
                                            {mode === "login" ?
                                                "Sign In"
                                            :   "Create Account"}
                                        </>
                                    }
                                </button>

                                {/* Resend */}
                                <div className='mt-5 text-center'>
                                    <p className='text-xs text-silver-600'>
                                        Didn't receive the code?{" "}
                                        {resendTimer > 0 ?
                                            <span className='text-silver-500'>
                                                Resend in {resendTimer}s
                                            </span>
                                        :   <button
                                                onClick={handleResend}
                                                disabled={loading}
                                                className='text-gold-400 hover:underline disabled:opacity-60'
                                            >
                                                Resend code
                                            </button>
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
