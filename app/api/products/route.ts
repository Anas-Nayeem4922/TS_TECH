import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const dailyDeal = searchParams.get('daily_deal');
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('q');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const fastDelivery = searchParams.get('fast_delivery');
    const sort = searchParams.get('sort') ?? 'created_at:desc';
    const limit = searchParams.get('limit');
    const brandsOnly = searchParams.get('brands_only');

    if (brandsOnly === 'true') {
      const products = await prisma.product.findMany({
        where: { isActive: true, brand: { not: null } },
        select: { brand: true },
        distinct: ['brand'],
      });
      const uniqueBrands = products
        .map((p) => p.brand)
        .filter((b): b is string => b !== null)
        .sort();
      return NextResponse.json({ brands: uniqueBrands });
    }

    const where: Record<string, unknown> = { isActive: true };

    if (featured === 'true') where.isFeatured = true;
    if (dailyDeal === 'true') where.isDailyDeal = true;
    if (fastDelivery === 'true') where.fastDelivery = true;
    if (brand && brand !== 'all') where.brand = brand;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      };
    }
    if (categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (cat) where.categoryId = cat.id;
    }

    const [sortField, sortDir] = sort.split(':');
    const orderBy: Record<string, string> = {};
    if (sortField === 'price' || sortField === 'name' || sortField === 'created_at' || sortField === 'updatedAt') {
      orderBy[sortField === 'created_at' ? 'createdAt' : sortField] = sortDir ?? 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      ...(limit && { take: parseInt(limit, 10) }),
    });

    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { isAdmin, data } = await req.json().catch(() => ({ isAdmin: false, data: null }));
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const product = await prisma.product.create({ data });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
