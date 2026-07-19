'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CircleCheck as CheckCircle, Truck, Package, ArrowRight, Sparkles, Chrome as Home, ShoppingBag } from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) { setLoading(false); return; }
    fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then(({ order }) => {
        setOrder(order);
        setLoading(false);
      });
  }, [orderNumber]);

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative w-24 h-24 mx-auto mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-gold-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-gold-500/10" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shadow-lg shadow-gold-500/30">
            <CheckCircle size={48} className="text-dark-700" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 badge-gold mb-3">
            <Sparkles size={12} /> Order Confirmed
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Thank You for Your Order!
          </h1>
          <p className="text-silver-400 text-lg">
            Your order has been placed successfully. We&apos;re getting it ready to ship!
          </p>
        </motion.div>

        {/* Order Details Card */}
        {!loading && order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-surface rounded-2xl border border-white/5 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
              <div>
                <div className="text-xs text-silver-500 mb-1">Order Number</div>
                <div className="text-sm font-bold text-gold-400">{order.orderNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-silver-500 mb-1">Order Total</div>
                <div className="text-lg font-bold text-white">₹{order.total.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-5">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/3">
                  <div className="w-10 h-10 rounded-lg bg-dark-300 overflow-hidden flex-shrink-0">
                    {item.productImage && (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{item.productName}</div>
                    <div className="text-xs text-silver-500">Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-sm font-semibold text-gold-400">
                    ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Info */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-xs text-silver-500 mb-1">Shipping Address</div>
                <div className="text-sm text-white">{order.shippingFullName}</div>
                <div className="text-xs text-silver-400">{order.shippingLine1}</div>
                <div className="text-xs text-silver-400">{order.shippingCity}, {order.shippingState} - {order.shippingPincode}</div>
                <div className="text-xs text-silver-400">Phone: {order.shippingPhone}</div>
              </div>
              <div>
                <div className="text-xs text-silver-500 mb-1">Payment</div>
                <div className="text-sm text-white capitalize">{order.paymentMethod}</div>
                <div className="text-xs text-silver-400">Status: {order.paymentStatus}</div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-green-400">
                  <Truck size={12} /> Estimated delivery: 1–3 business days
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="card-surface rounded-2xl border border-white/5 p-6 mb-6 animate-pulse h-48" />
        )}

        {/* Steps Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: CheckCircle, label: 'Order Placed', active: true, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
            { icon: Package, label: 'Processing', active: false, color: 'text-silver-500 bg-white/3 border-white/5' },
            { icon: Truck, label: 'Out for Delivery', active: false, color: 'text-silver-500 bg-white/3 border-white/5' },
          ].map((step, i) => (
            <div key={step.label} className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${step.color}`}>
              <step.icon size={20} />
              <span className="text-xs font-medium text-center">{step.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Link href="/account" className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
            <Package size={16} /> View My Orders <ArrowRight size={14} />
          </Link>
          <Link href="/products" className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </motion.div>

        {/* Confetti dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{
              opacity: [1, 0],
              y: [-100 - i * 20, -300 - i * 40],
              x: [(i - 3) * 30, (i - 3) * 80],
            }}
            transition={{ duration: 1.5, delay: 0.2 + i * 0.1 }}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gold-500 pointer-events-none"
          />
        ))}
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
