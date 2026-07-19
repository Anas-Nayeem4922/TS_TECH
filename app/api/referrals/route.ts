import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [membership, referralCode, credits] = await Promise.all([
      prisma.loyaltyMembership.findUnique({ where: { userId: user.id } }),
      prisma.referralCode.findUnique({ where: { userId: user.id } }),
      prisma.referralCredit.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    ]);

    let referralUses: Array<{ id: string; status: string; createdAt: Date; referrerReward: number | null }> = [];
    if (referralCode) {
      referralUses = await prisma.referralUse.findMany({
        where: { referralCodeId: referralCode.id },
        orderBy: { createdAt: 'desc' },
        select: { id: true, status: true, createdAt: true, referrerReward: true },
      });
    }

    return NextResponse.json({ membership, referralCode, referralUses, credits });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.referralCode.findUnique({ where: { userId: user.id } });
    if (existing) return NextResponse.json({ referralCode: existing });

    const code = user.fullName
      ? user.fullName.substring(0, 4).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase()
      : 'TS' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const referralCode = await prisma.referralCode.create({
      data: { userId: user.id, code },
    });
    return NextResponse.json({ referralCode });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
