import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const reviews = await prisma.review.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true } } },
    });
    return NextResponse.json({ reviews });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, rating, title, body } = await req.json();

    const existingOrders = await prisma.order.findMany({
      where: { userId: user.id, status: { not: 'cancelled' } },
      select: { id: true },
    });
    const orderIds = existingOrders.map((o) => o.id);
    const isVerified = orderIds.length > 0
      ? !!(await prisma.orderItem.findFirst({ where: { productId, orderId: { in: orderIds } } }))
      : false;

    const review = await prisma.review.upsert({
      where: { productId_userId: { productId, userId: user.id } },
      create: { productId, userId: user.id, rating, title, body, isVerifiedPurchase: isVerified },
      update: { rating, title, body, isVerifiedPurchase: isVerified },
      include: { user: { select: { fullName: true } } },
    });
    return NextResponse.json({ review });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, rating, title, body } = await req.json();
    const review = await prisma.review.update({
      where: { id, userId: user.id },
      data: { rating, title, body },
    });
    return NextResponse.json({ review });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Review ID required' }, { status: 400 });

    await prisma.review.delete({ where: { id, userId: user.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
