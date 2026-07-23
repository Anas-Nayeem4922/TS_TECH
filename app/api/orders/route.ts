import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );

        const { searchParams } = new URL(req.url);
        const orderNumber = searchParams.get("orderNumber");

        if (orderNumber) {
            const order = await prisma.order.findFirst({
                where: { orderNumber },
                include: { orderItems: true },
            });
            return NextResponse.json({ order });
        }

        // app/api/orders/route.ts
        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            include: {
                orderItems: {
                    include: {
                        product: { select: { images: true, name: true } },
                    },
                },
            },
        });

        const formatted = orders.map((o) => ({
            ...o,
            order_items: o.orderItems, // add snake_case alias for frontend
        }));

        return NextResponse.json({ orders: formatted });
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

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );

        const body = await req.json();
        const {
            subtotal,
            shippingFee,
            total,
            pointsRedeemed = 0,
            loyaltyDiscount = 0,
            shippingFullName,
            shippingPhone,
            shippingLine1,
            shippingLine2,
            shippingCity,
            shippingState,
            shippingPincode,
            paymentMethod,
            notes,
            items,
        } = body;

        const orderNumber =
            "TS-" + Math.random().toString(36).substring(2, 10).toUpperCase();

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: user.id,
                status: "confirmed",
                subtotal,
                shippingFee,
                total,
                pointsRedeemed,
                loyaltyDiscount,
                shippingFullName,
                shippingPhone,
                shippingLine1,
                shippingLine2,
                shippingCity,
                shippingState,
                shippingPincode,
                paymentMethod,
                notes,
                orderItems: {
                    create: items.map(
                        (item: {
                            productId: string;
                            productName: string;
                            productImage: string | null;
                            quantity: number;
                            unitPrice: number;
                        }) => ({
                            productId: item.productId,
                            productName: item.productName,
                            productImage: item.productImage,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                        }),
                    ),
                },
            },
            include: { orderItems: true },
        });

        await refreshLoyalty(user.id);

        return NextResponse.json({ order });
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

async function refreshLoyalty(userId: string) {
    const orders = await prisma.order.findMany({
        where: {
            userId,
            status: { in: ["confirmed", "shipped", "delivered"] },
        },
        select: { subtotal: true, pointsRedeemed: true },
    });

    let totalSpend = 0;
    let totalOrders = 0;
    let earnedPoints = 0;
    let redeemedPoints = 0;

    for (const o of orders) {
        totalSpend += o.subtotal;
        totalOrders += 1;
        if (o.subtotal >= 300 && o.subtotal <= 799) earnedPoints += 40;
        else if (o.subtotal >= 800 && o.subtotal <= 1499) earnedPoints += 60;
        else if (o.subtotal >= 1500 && o.subtotal <= 2400) earnedPoints += 100;
        else if (o.subtotal >= 2401 && o.subtotal <= 3500) earnedPoints += 200;
        redeemedPoints += o.pointsRedeemed;
    }

    const netPoints = Math.max(0, earnedPoints - redeemedPoints);

    await prisma.loyaltyMembership.upsert({
        where: { userId },
        create: {
            userId,
            tier: "member",
            totalSpend,
            totalOrders,
            points: netPoints,
            nextTierPoints: 0,
        },
        update: {
            tier: "member",
            totalSpend,
            totalOrders,
            points: netPoints,
            nextTierPoints: 0,
        },
    });
}
