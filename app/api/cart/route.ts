import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ items: [] });

    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, quantity = 1 } = await req.json();
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (existing) {
      const item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return NextResponse.json({ item });
    }

    const item = await prisma.cartItem.create({
      data: { userId: user.id, productId, quantity },
    });
    return NextResponse.json({ item });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, quantity } = await req.json();
    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { userId: user.id, productId } });
      return NextResponse.json({ success: true });
    }
    const item = await prisma.cartItem.update({
      where: { userId_productId: { userId: user.id, productId } },
      data: { quantity },
    });
    return NextResponse.json({ item });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const clear = searchParams.get('clear');

    if (clear === 'true') {
      await prisma.cartItem.deleteMany({ where: { userId: user.id } });
      return NextResponse.json({ success: true });
    }

    if (productId) {
      await prisma.cartItem.deleteMany({ where: { userId: user.id, productId } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
