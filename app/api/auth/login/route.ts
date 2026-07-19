import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const user = await signIn(email, password);
    return NextResponse.json({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign in failed';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
