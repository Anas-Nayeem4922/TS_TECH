import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-change-me",
);
const COOKIE_NAME = "ts_auth_token";

// Routes that require the user to be signed in
const PROTECTED_PREFIXES = [
    "/cart",
    "/checkout",
    "/account",
    "/wishlist",
    "/thank-you",
];

async function isAuthenticated(req: NextRequest): Promise<boolean> {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return false;
    try {
        await jwtVerify(token, JWT_SECRET);
        return true;
    } catch {
        return false;
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const needsAuth = PROTECTED_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix),
    );
    if (!needsAuth) return NextResponse.next();

    const authed = await isAuthenticated(req);
    if (authed) return NextResponse.next();

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        "/cart/:path*",
        "/checkout/:path*",
        "/account/:path*",
        "/wishlist/:path*",
        "/thank-you/:path*",
    ],
};
