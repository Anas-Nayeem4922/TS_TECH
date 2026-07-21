"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    Package,
    Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function CartPage() {
    const {
        items,
        count,
        total,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
    } = useCart();
    const [clearing, setClearing] = useState(false);

    const handleClearCart = async () => {
        setClearing(true);
        await clearCart();
        setClearing(false);
        toast.success("Cart cleared");
    };

    const shipping = total >= 500 ? 0 : 60;
    const grandTotal = total + shipping;

    if (loading) {
        return (
            <div className='min-h-screen pt-28 flex items-center justify-center'>
                <div className='w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin' />
            </div>
        );
    }

    return (
        <div className='min-h-screen pt-20 pb-16'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 py-10'>
                <div className='flex items-center justify-between mb-2'>
                    <h1 className='text-2xl sm:text-3xl font-bold text-white'>
                        Shopping Cart
                        {count > 0 && (
                            <span className='ml-2 sm:ml-3 text-sm sm:text-lg text-silver-500 font-normal'>
                                ({count} items)
                            </span>
                        )}
                    </h1>
                    {items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            disabled={clearing}
                            className='flex items-center gap-1.5 text-sm text-silver-500 hover:text-red-400 transition-colors disabled:opacity-50'
                        >
                            <Trash2 size={14} />
                            {clearing ? "Clearing..." : "Empty Cart"}
                        </button>
                    )}
                </div>

                {items.length === 0 ?
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-center py-24'
                    >
                        <ShoppingCart
                            size={64}
                            className='text-dark-50 mx-auto mb-4'
                        />
                        <h2 className='text-lg sm:text-xl font-semibold text-white mb-2'>
                            Your cart is empty
                        </h2>
                        <p className='text-silver-500 mb-6'>
                            Add some products to get started.
                        </p>
                        <Link
                            href='/products'
                            className='btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold'
                        >
                            Browse Products <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                :   <div className='grid lg:grid-cols-3 gap-8 mt-8'>
                        {/* Cart Items */}
                        <div className='lg:col-span-2 space-y-3'>
                            <AnimatePresence mode='popLayout'>
                                {items.map(({ product, quantity }) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{
                                            opacity: 0,
                                            x: -20,
                                            height: 0,
                                            marginBottom: 0,
                                        }}
                                        transition={{ duration: 0.25 }}
                                        className='flex gap-4 p-4 card-surface rounded-2xl border border-white/5'
                                    >
                                        {/* Image */}
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className='flex-shrink-0'
                                        >
                                            <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-dark-300'>
                                                {(
                                                    (
                                                        product.images as string[]
                                                    )?.[0]
                                                ) ?
                                                    <img
                                                        src={
                                                            (
                                                                product.images as string[]
                                                            )[0]
                                                        }
                                                        alt={product.name}
                                                        className='w-full h-full object-cover'
                                                    />
                                                :   <div className='w-full h-full flex items-center justify-center'>
                                                        <Package
                                                            size={24}
                                                            className='text-dark-50'
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </Link>

                                        {/* Details */}
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-start justify-between gap-2'>
                                                <div>
                                                    {product.brand && (
                                                        <div className='text-[10px] text-gold-500 font-semibold uppercase tracking-wider mb-0.5'>
                                                            {product.brand}
                                                        </div>
                                                    )}
                                                    <Link
                                                        href={`/products/${product.slug}`}
                                                        className='text-sm font-semibold text-white hover:text-gold-400 transition-colors line-clamp-2'
                                                    >
                                                        {product.name}
                                                    </Link>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(
                                                            product.id,
                                                        )
                                                    }
                                                    className='p-1.5 text-silver-600 hover:text-red-400 transition-colors flex-shrink-0'
                                                    aria-label='Remove'
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>

                                            <div className='flex items-center justify-between mt-3'>
                                                {/* Quantity */}
                                                <div className='flex items-center gap-1.5 bg-dark-400 border border-white/10 rounded-lg p-1'>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                product.id,
                                                                quantity - 1,
                                                            )
                                                        }
                                                        className='w-6 h-6 flex items-center justify-center text-silver-400 hover:text-white transition-colors'
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className='w-7 text-center text-sm font-semibold text-white'>
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                product.id,
                                                                quantity + 1,
                                                            )
                                                        }
                                                        className='w-6 h-6 flex items-center justify-center text-silver-400 hover:text-white transition-colors'
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className='text-right'>
                                                    <div className='text-sm font-bold text-gold-400'>
                                                        ₹
                                                        {(
                                                            product.price *
                                                            quantity
                                                        ).toLocaleString(
                                                            "en-IN",
                                                        )}
                                                    </div>
                                                    {quantity > 1 && (
                                                        <div className='text-[10px] text-silver-600'>
                                                            ₹
                                                            {product.price.toLocaleString(
                                                                "en-IN",
                                                            )}{" "}
                                                            each
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className='sticky top-24 card-surface rounded-2xl border border-white/5 p-6'>
                                <h2 className='text-base sm:text-lg font-bold text-white mb-5'>
                                    Order Summary
                                </h2>

                                <div className='section-divider mb-5' />

                                <div className='flex justify-between font-bold mb-6'>
                                    <span className='text-white'>Total</span>
                                    <span className='text-gold-400 text-lg'>
                                        ₹{grandTotal.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <Link
                                    href='/checkout'
                                    className='btn-gold flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold mb-3'
                                >
                                    Proceed to Checkout <ArrowRight size={15} />
                                </Link>

                                <Link
                                    href='/products'
                                    className='block text-center text-sm text-silver-500 hover:text-gold-400 transition-colors'
                                >
                                    Continue Shopping
                                </Link>

                                {/* Trust */}
                                <div className='mt-6 pt-5 border-t border-white/5'>
                                    <div className='grid grid-cols-3 gap-2 text-center'>
                                        {[
                                            "🔒 Secure",
                                            "🚚 Fast",
                                            "↩️ Returns",
                                        ].map((b) => (
                                            <div
                                                key={b}
                                                className='text-xs text-silver-600'
                                            >
                                                {b}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
