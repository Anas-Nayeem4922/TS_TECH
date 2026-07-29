import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtpCode, hashOtp, sendOtpEmail } from "@/lib/email";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password, fullName, mode } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 },
            );
        }
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 },
            );
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (mode === "signup") {
            if (existing) {
                return NextResponse.json(
                    { error: "An account with this email already exists" },
                    { status: 409 },
                );
            }
        } else {
            if (!existing) {
                return NextResponse.json(
                    {
                        error: "No account found with this email. Please sign up first.",
                    },
                    { status: 404 },
                );
            }

            const passwordValid = await verifyPassword(
                password,
                existing.passwordHash,
            );
            if (!passwordValid) {
                return NextResponse.json(
                    { error: "Incorrect password." },
                    { status: 401 },
                );
            }
        }

        // Delete any previous unused OTP codes for this email
        await prisma.otpCode.deleteMany({ where: { email: normalizedEmail } });

        // Generate and store new OTP
        const code = generateOtpCode();
        const hashed = await hashOtp(code);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.otpCode.create({
            data: { email: normalizedEmail, code: hashed, expiresAt },
        });

        // Send email
        const result = await sendOtpEmail({
            to: normalizedEmail,
            code,
            purpose: mode,
        });
        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Failed to send OTP email" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "OTP sent to your email",
        });
    } catch (err) {
        return NextResponse.json(
            {
                error:
                    err instanceof Error ?
                        err.message
                    :   "Internal server error",
            },
            { status: 500 },
        );
    }
}
