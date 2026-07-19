"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    MessageSquare,
    ShoppingBag,
    TrendingUp,
    Plus,
    ArrowRight,
    Clock,
    CircleCheck as CheckCircle,
    Truck,
    Circle as XCircle,
    X,
    MapPin,
    CreditCard,
    Phone,
    Flame,
    Trash2,
} from "lucide-react";
import type { Product } from "@/lib/database.types";
import { toast } from "sonner";

interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalMessages: number;
    revenue: number;
}

interface OrderDetails {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    shippingFullName: string;
    shippingPhone: string;
    shippingLine1: string;
    shippingLine2: string | null;
    shippingCity: string;
    shippingState: string;
    shippingPincode: string;
    paymentMethod: string;
    paymentStatus: string;
    notes: string | null;
    orderItems: {
        id: string;
        productName: string;
        productImage: string | null;
        quantity: number;
        unitPrice: number;
    }[];
}

const STATUS_CONFIG: Record<
    string,
    { icon: React.ElementType; color: string }
> = {
    pending: { icon: Clock, color: "text-yellow-400" },
    confirmed: { icon: CheckCircle, color: "text-blue-400" },
    shipped: { icon: Truck, color: "text-purple-400" },
    delivered: { icon: CheckCircle, color: "text-green-400" },
    cancelled: { icon: XCircle, color: "text-red-400" },
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalProducts: 0,
        totalOrders: 0,
        totalMessages: 0,
        revenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(
        null,
    );
    const [orderModalLoading, setOrderModalLoading] = useState(false);
    const [dailyDealsProducts, setDailyDealsProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [showDealManager, setShowDealManager] = useState(false);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/admin", { cache: "no-store" });
            const data = await res.json();
            setStats({
                totalProducts: data.productCount ?? 0,
                totalOrders: data.orderCount ?? 0,
                totalMessages: data.messageCount ?? 0,
                revenue: data.revenue ?? 0,
            });
            setRecentOrders(data.recentOrders ?? []);
            setDailyDealsProducts(data.dailyDeals ?? []);
            setAllProducts(data.allProducts ?? []);
            setLoading(false);
        }
        load();
    }, []);

    const viewOrderDetails = async (orderNumber: string) => {
        setOrderModalLoading(true);
        const res = await fetch("/api/admin", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber }),
            cache: "no-store",
        });
        const data = await res.json();
        if (data.order) setSelectedOrder(data.order as OrderDetails);
        setOrderModalLoading(false);
    };

    const toggleDailyDeal = async (product: Product) => {
        const newDealStatus = !product.isDailyDeal;
        const res = await fetch("/api/admin/products", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: product.id,
                data: { isDailyDeal: newDealStatus },
            }),
            cache: "no-store",
        });

        if (!res.ok) {
            toast.error("Failed to update deal status");
        } else {
            setAllProducts((prev) =>
                prev.map((p) =>
                    p.id === product.id ?
                        { ...p, isDailyDeal: newDealStatus }
                    :   p,
                ),
            );
            if (newDealStatus) {
                setDailyDealsProducts((prev) => [
                    ...prev,
                    { ...product, isDailyDeal: true },
                ]);
            } else {
                setDailyDealsProducts((prev) =>
                    prev.filter((p) => p.id !== product.id),
                );
            }
            toast.success(
                newDealStatus ?
                    "Added to daily deals"
                :   "Removed from daily deals",
            );
        }
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-white'>Dashboard</h1>
                    <p className='text-silver-500 text-sm'>
                        Welcome back to TS Technology admin.
                    </p>
                </div>
                <Link
                    href='/admin/products/new'
                    className='btn-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold'
                >
                    <Plus size={14} /> Add Product
                </Link>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                {[
                    {
                        icon: Package,
                        label: "Products",
                        value: stats.totalProducts,
                        href: "/admin/products",
                        color: "text-blue-400",
                    },
                    {
                        icon: ShoppingBag,
                        label: "Orders",
                        value: stats.totalOrders,
                        href: "#",
                        color: "text-green-400",
                    },
                    {
                        icon: MessageSquare,
                        label: "Messages",
                        value: stats.totalMessages,
                        href: "/admin/messages",
                        color: "text-gold-400",
                    },
                    {
                        icon: TrendingUp,
                        label: "Revenue",
                        value: `₹${stats.revenue.toLocaleString("en-IN")}`,
                        href: "#",
                        color: "text-purple-400",
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className='card-surface rounded-2xl border border-white/5 p-5'
                    >
                        <div className='flex items-start justify-between mb-3'>
                            <div
                                className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}
                            >
                                <stat.icon size={16} />
                            </div>
                            {stat.href !== "#" && (
                                <Link
                                    href={stat.href}
                                    className='text-silver-600 hover:text-gold-400 transition-colors'
                                >
                                    <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>
                        <div className='text-2xl font-bold text-white'>
                            {loading ? "—" : stat.value}
                        </div>
                        <div className='text-xs text-silver-500 mt-0.5'>
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Daily Deals Manager */}
            <div className='card-surface rounded-2xl border border-white/5 p-5'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-base font-semibold text-white flex items-center gap-2'>
                        <Flame size={16} className='text-gold-500' /> Daily
                        Deals Banner
                    </h2>
                    <button
                        onClick={() => setShowDealManager((p) => !p)}
                        className='text-xs text-gold-500 hover:text-gold-400 transition-colors'
                    >
                        {showDealManager ? "Done" : "Manage"}
                    </button>
                </div>

                {dailyDealsProducts.length === 0 && !showDealManager && (
                    <p className='text-silver-500 text-sm text-center py-4'>
                        No daily deals selected. Click &quot;Manage&quot; to add
                        products to the daily deals banner.
                    </p>
                )}

                {dailyDealsProducts.length > 0 && !showDealManager && (
                    <div className='flex gap-3 overflow-x-auto pb-2'>
                        {dailyDealsProducts.map((p) => (
                            <div
                                key={p.id}
                                className='flex items-center gap-2 bg-white/3 border border-white/5 rounded-lg px-3 py-2 flex-shrink-0'
                            >
                                <div className='w-8 h-8 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0'>
                                    {(p.images as string[])?.[0] && (
                                        <img
                                            src={(p.images as string[])[0]}
                                            alt={p.name}
                                            className='w-full h-full object-cover'
                                        />
                                    )}
                                </div>
                                <div className='min-w-0'>
                                    <div className='text-xs text-white truncate max-w-32'>
                                        {p.name}
                                    </div>
                                    <div className='text-xs text-gold-400'>
                                        ₹{p.price.toLocaleString("en-IN")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showDealManager && (
                    <div className='space-y-2 max-h-80 overflow-y-auto'>
                        {allProducts.map((p) => (
                            <div
                                key={p.id}
                                className='flex items-center gap-3 p-2 rounded-lg bg-white/3 border border-white/5'
                            >
                                <div className='w-9 h-9 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0'>
                                    {(p.images as string[])?.[0] && (
                                        <img
                                            src={(p.images as string[])[0]}
                                            alt={p.name}
                                            className='w-full h-full object-cover'
                                        />
                                    )}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='text-sm text-white truncate'>
                                        {p.name}
                                    </div>
                                    <div className='text-xs text-silver-500'>
                                        ₹{p.price.toLocaleString("en-IN")}
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleDailyDeal(p)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        p.isDailyDeal ?
                                            "bg-gold-500/15 text-gold-400 border border-gold-500/30"
                                        :   "bg-white/5 text-silver-400 border border-white/10 hover:border-gold-500/20"
                                    }`}
                                >
                                    {p.isDailyDeal ?
                                        "In Deals"
                                    :   "Add to Deals"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Orders */}
            <div className='card-surface rounded-2xl border border-white/5 p-5'>
                <h2 className='text-base font-semibold text-white mb-4'>
                    Recent Orders
                </h2>
                {recentOrders.length === 0 ?
                    <p className='text-silver-500 text-sm text-center py-8'>
                        No orders yet.
                    </p>
                :   <div className='space-y-2'>
                        {recentOrders.map((order) => {
                            const status =
                                STATUS_CONFIG[order.status] ??
                                STATUS_CONFIG.pending;
                            const StatusIcon = status.icon;
                            return (
                                <div
                                    key={order.orderNumber}
                                    className='flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5'
                                >
                                    <div>
                                        <div className='text-sm font-semibold text-white'>
                                            {order.orderNumber}
                                        </div>
                                        <div className='text-xs text-silver-500'>
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <div className='text-right'>
                                            <div className='text-sm font-semibold text-gold-400'>
                                                ₹
                                                {order.total.toLocaleString(
                                                    "en-IN",
                                                )}
                                            </div>
                                            <div
                                                className={`text-xs font-medium capitalize flex items-center gap-1 justify-end ${status.color}`}
                                            >
                                                <StatusIcon size={11} />{" "}
                                                {order.status}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                viewOrderDetails(
                                                    order.orderNumber,
                                                )
                                            }
                                            className='text-xs text-silver-500 hover:text-gold-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5'
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }
            </div>

            {/* Quick Links */}
            <div className='grid sm:grid-cols-2 gap-4'>
                <Link
                    href='/admin/products/new'
                    className='card-surface rounded-2xl border border-white/5 p-5 hover:border-gold-500/20 transition-all group'
                >
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center'>
                            <Plus size={18} className='text-gold-400' />
                        </div>
                        <div>
                            <div className='text-sm font-semibold text-white'>
                                Add New Product
                            </div>
                            <div className='text-xs text-silver-500'>
                                List a new product on the site
                            </div>
                        </div>
                        <ArrowRight
                            size={16}
                            className='ml-auto text-silver-600 group-hover:text-gold-400 transition-colors'
                        />
                    </div>
                </Link>
                <Link
                    href='/admin/messages'
                    className='card-surface rounded-2xl border border-white/5 p-5 hover:border-gold-500/20 transition-all group'
                >
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center'>
                            <MessageSquare
                                size={18}
                                className='text-blue-400'
                            />
                        </div>
                        <div>
                            <div className='text-sm font-semibold text-white'>
                                View Messages
                            </div>
                            <div className='text-xs text-silver-500'>
                                Customer contact submissions
                            </div>
                        </div>
                        <ArrowRight
                            size={16}
                            className='ml-auto text-silver-600 group-hover:text-gold-400 transition-colors'
                        />
                    </div>
                </Link>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedOrder(null)}
                        className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className='bg-dark-500 border border-white/10 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto'
                        >
                            {/* Modal Header */}
                            <div className='flex items-center justify-between p-5 border-b border-white/5'>
                                <div>
                                    <h3 className='text-lg font-bold text-white'>
                                        Order Details
                                    </h3>
                                    <div className='text-sm text-gold-400'>
                                        {selectedOrder.orderNumber}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className='p-2 text-silver-500 hover:text-white transition-colors rounded-lg hover:bg-white/5'
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className='p-5 space-y-5'>
                                {/* Status & Date */}
                                <div className='flex items-center justify-between'>
                                    <div className='text-sm text-silver-500'>
                                        {new Date(
                                            selectedOrder.createdAt,
                                        ).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                    <div
                                        className={`text-xs font-semibold capitalize flex items-center gap-1 ${STATUS_CONFIG[selectedOrder.status]?.color ?? "text-silver-400"}`}
                                    >
                                        {(() => {
                                            const Icon =
                                                STATUS_CONFIG[
                                                    selectedOrder.status
                                                ]?.icon ?? Clock;
                                            return <Icon size={12} />;
                                        })()}
                                        {selectedOrder.status}
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <div className='text-xs text-silver-500 mb-2'>
                                        Items Ordered
                                    </div>
                                    <div className='space-y-2'>
                                        {selectedOrder.orderItems.map(
                                            (item) => (
                                                <div
                                                    key={item.id}
                                                    className='flex items-center gap-3 p-2 rounded-lg bg-white/3'
                                                >
                                                    <div className='w-10 h-10 rounded-lg bg-dark-300 overflow-hidden flex-shrink-0'>
                                                        {item.productImage && (
                                                            <img
                                                                src={
                                                                    item.productImage
                                                                }
                                                                alt={
                                                                    item.productName
                                                                }
                                                                className='w-full h-full object-cover'
                                                            />
                                                        )}
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <div className='text-sm text-white truncate'>
                                                            {item.productName}
                                                        </div>
                                                        <div className='text-xs text-silver-500'>
                                                            Qty: {item.quantity}{" "}
                                                            × ₹
                                                            {item.unitPrice.toLocaleString(
                                                                "en-IN",
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='text-sm font-semibold text-gold-400'>
                                                        ₹
                                                        {(
                                                            item.quantity *
                                                            item.unitPrice
                                                        ).toLocaleString(
                                                            "en-IN",
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <div className='text-xs text-silver-500 mb-2 flex items-center gap-1'>
                                        <MapPin size={12} /> Shipping Address
                                    </div>
                                    <div className='bg-white/3 rounded-lg p-3 space-y-1'>
                                        <div className='text-sm font-medium text-white'>
                                            {selectedOrder.shippingFullName}
                                        </div>
                                        <div className='text-xs text-silver-400'>
                                            {selectedOrder.shippingLine1}
                                        </div>
                                        {selectedOrder.shippingLine2 && (
                                            <div className='text-xs text-silver-400'>
                                                {selectedOrder.shippingLine2}
                                            </div>
                                        )}
                                        <div className='text-xs text-silver-400'>
                                            {selectedOrder.shippingCity},{" "}
                                            {selectedOrder.shippingState} -{" "}
                                            {selectedOrder.shippingPincode}
                                        </div>
                                        <div className='text-xs text-silver-400 flex items-center gap-1 mt-1'>
                                            <Phone size={11} />{" "}
                                            {selectedOrder.shippingPhone}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment */}
                                <div>
                                    <div className='text-xs text-silver-500 mb-2 flex items-center gap-1'>
                                        <CreditCard size={12} /> Payment
                                    </div>
                                    <div className='bg-white/3 rounded-lg p-3'>
                                        <div className='text-sm text-white capitalize'>
                                            {selectedOrder.paymentMethod}
                                        </div>
                                        <div className='text-xs text-silver-500'>
                                            Status:{" "}
                                            {selectedOrder.paymentStatus}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedOrder.notes && (
                                    <div>
                                        <div className='text-xs text-silver-500 mb-2'>
                                            Order Notes
                                        </div>
                                        <div className='bg-white/3 rounded-lg p-3 text-sm text-silver-300'>
                                            {selectedOrder.notes}
                                        </div>
                                    </div>
                                )}

                                {/* Total */}
                                <div className='flex items-center justify-between pt-3 border-t border-white/5'>
                                    <div className='text-sm font-semibold text-white'>
                                        Order Total
                                    </div>
                                    <div className='text-lg font-bold text-gold-400'>
                                        ₹
                                        {selectedOrder.total.toLocaleString(
                                            "en-IN",
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading overlay for modal */}
            {orderModalLoading && (
                <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
                    <div className='w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin' />
                </div>
            )}
        </div>
    );
}
