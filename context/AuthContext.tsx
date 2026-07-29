"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
} from "react";
import type { AuthUser } from "@/lib/database.types";

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    sendOtp: (
        email: string,
        password: string,
        fullName: string | undefined,
        mode: "signin" | "signup",
    ) => Promise<{ error: string | null }>;
    verifyOtp: (
        email: string,
        password: string,
        fullName: string | undefined,
        otp: string,
        mode: "signin" | "signup",
    ) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const sendOtp = async (
        email: string,
        password: string,
        fullName: string | undefined,
        mode: "signin" | "signup",
    ) => {
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, fullName, mode }),
            });
            const data = await res.json();
            if (!res.ok) return { error: data.error ?? "Failed to send code" };
            return { error: null };
        } catch {
            return { error: "Network error. Please try again." };
        }
    };

    const verifyOtp = async (
        email: string,
        password: string,
        fullName: string | undefined,
        otp: string,
        mode: "signin" | "signup",
    ) => {
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, fullName, otp, mode }),
            });
            const data = await res.json();
            if (!res.ok) return { error: data.error ?? "Verification failed" };
            setUser(data.user);
            return { error: null };
        } catch {
            return { error: "Network error. Please try again." };
        }
    };

    const signOut = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            // ignore
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, sendOtp, verifyOtp, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
