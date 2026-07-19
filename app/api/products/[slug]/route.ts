import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: params.slug, isActive: true },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const [reviews, related] = await Promise.all([
      prisma.review.findMany({
        where: { productId: product.id },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true } } },
      }),
      prisma.product.findMany({
        where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
        take: 4,
      }),
    ]);

    return NextResponse.json({ product, reviews, related });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
