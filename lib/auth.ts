import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me');
const COOKIE_NAME = 'ts_auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { sub: payload.sub as string };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getAuthToken(): Promise<string | undefined> {
  return cookies().get(COOKIE_NAME)?.value;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, fullName: true, avatarUrl: true, isAdmin: true, createdAt: true },
  });

  return user ? { ...user, createdAt: user.createdAt.toISOString() } : null;
}

export async function signUp(email: string, password: string, fullName: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('An account with this email already exists');

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, fullName },
  });

  const token = await createToken(user.id);
  await setAuthCookie(token);

  return { id: user.id, email: user.email, fullName: user.fullName, isAdmin: user.isAdmin, createdAt: user.createdAt.toISOString() };
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error('Invalid email or password');

  const token = await createToken(user.id);
  await setAuthCookie(token);

  return { id: user.id, email: user.email, fullName: user.fullName, isAdmin: user.isAdmin, createdAt: user.createdAt.toISOString() };
}

export async function signOut() {
  await clearAuthCookie();
}
