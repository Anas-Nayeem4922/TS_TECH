import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpHash } from "@/lib/email";
import { hashPassword, createToken, setAuthCookie, AuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password, fullName, otp, mode } = await req.json();

        if (!email || !password || !otp) {
            return NextResponse.json(
                { error: "Email, password, and OTP are required" },
                { status: 400 },
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find the most recent OTP for this email
        const otpRecord = await prisma.otpCode.findFirst({
            where: { email: normalizedEmail },
            orderBy: { createdAt: "desc" },
        });

        if (!otpRecord) {
            return NextResponse.json(
                { error: "No OTP was sent. Please request a new code." },
                { status: 400 },
            );
        }

        // Check expiry
        if (new Date() > otpRecord.expiresAt) {
            await prisma.otpCode.deleteMany({
                where: { email: normalizedEmail },
            });
            return NextResponse.json(
                { error: "This code has expired. Please request a new one." },
                { status: 400 },
            );
        }

        // Check attempt limit
        if (otpRecord.attempts >= 5) {
            await prisma.otpCode.deleteMany({
                where: { email: normalizedEmail },
            });
            return NextResponse.json(
                {
                    error: "Too many incorrect attempts. Please request a new code.",
                },
                { status: 400 },
            );
        }

        // Verify the code
        const isValid = await verifyOtpHash(otp, otpRecord.code);
        if (!isValid) {
            await prisma.otpCode.update({
                where: { id: otpRecord.id },
                data: { attempts: otpRecord.attempts + 1 },
            });
            const remaining = 5 - (otpRecord.attempts + 1);
            return NextResponse.json(
                { error: `Incorrect code. ${remaining} attempts remaining.` },
                { status: 400 },
            );
        }

        // OTP is valid — delete it
        await prisma.otpCode.deleteMany({ where: { email: normalizedEmail } });

        let user;
        if (mode === "signup") {
            // Create the account
            const passwordHash = await hashPassword(password);
            user = await prisma.user.create({
                data: {
                    email: normalizedEmail,
                    passwordHash,
                    fullName: fullName || normalizedEmail.split("@")[0],
                },
            });
        } else {
            // Sign in — find existing user
            user = await prisma.user.findUnique({
                where: { email: normalizedEmail },
            });
            if (!user) {
                return NextResponse.json(
                    { error: "Account not found. Please sign up first." },
                    { status: 404 },
                );
            }
        }

        // Issue JWT
        const token = await createToken(user.id);
        await setAuthCookie(token);

        const authUser: AuthUser = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt.toISOString(),
        };

        return NextResponse.json({ user: authUser });
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
