'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, LogOut, ChevronRight, ShoppingBag, Clock, CircleCheck as CheckCircle, Truck, Circle as XCircle, Gift, Coins, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ProductCard } from '@/components/ProductCard';
import { ReferralPanel } from '@/components/ReferralPanel';
import { LoyaltyPanel } from '@/components/LoyaltyPanel';
import type { Order, OrderItem, Product } from '@/lib/database.types';

type Tab = 'orders' | 'wishlist' | 'loyalty' | 'referrals' | 'profile';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending:   { icon: Clock,       color: 'text-yellow-400',  label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-400',    label: 'Confirmed' },
  shipped:   { icon: Truck,       color: 'text-purple-400',  label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-400',   label: 'Delivered' },
  cancelled: { icon: XCircle,     color: 'text-red-400',     label: 'Cancelled' },
};

type OrderWithItems = Order & {
  order_items: (OrderItem & { products: { images: string[]; name: string } | null })[];
};

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'orders',    label: 'Orders',    icon: Package },
  { id: 'wishlist',  label: 'Wishlist',  icon: Heart },
  { id: 'loyalty',   label: 'Loyalty',   icon: Coins },
  { id: 'referrals', label: 'Refer & Earn', icon: Gift },
  { id: 'profile',   label: 'Profile',   icon: User },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const isDark = theme === 'dark';
  const tc = isDark ? 'text-white' : 'text-gray-900';
  const sc = isDark ? 'text-silver-400' : 'text-gray-600';
  const mc = isDark ? 'text-silver-500' : 'text-gray-500';
  const cardBorder = isDark ? 'border-white/5' : 'border-gray-200';
  const tabBg = isDark ? 'bg-dark-400' : 'bg-gray-200';
  const tabInactive = isDark ? 'text-silver-400 hover:text-white' : 'text-gray-500 hover:text-gray-900';
  const inputBg = isDark ? 'text-white/70' : 'text-gray-700';
  const emptyIcon = isDark ? 'text-dark-50' : 'text-gray-300';

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=/account');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    fetch('/api/orders', { cache: 'no-store' })
      .then((r) => r.json())
      .then(({ orders }) => {
        setOrders((orders as OrderWithItems[]) ?? []);
        setLoadingOrders(false);
      });

    fetch('/api/loyalty', { cache: 'no-store' })
      .then((r) => r.json())
      .then(({ membership }) => setLoyaltyPoints(membership?.points ?? 0));
  }, [user]);

  useEffect(() => {
    fetch('/api/wishlist', { cache: 'no-store' })
      .then((r) => r.json())
      .then(({ ids }) => {
        const idList = ids ?? [];
        setWishlistIds(idList);
        if (idList.length === 0) { setWishlistProducts([]); return; }
        fetch(`/api/products?ids=${idList.join(',')}`, { cache: 'no-store' })
          .then((r) => r.json())
          .then(({ products }) => setWishlistProducts((products as Product[]) ?? []));
      });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const userName = user.fullName ?? user.email?.split('@')[0] ?? 'User';

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Account Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/20 flex items-center justify-center">
              <User size={24} className="text-gold-400" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${tc}`}>{userName}</h1>
              <p className={`text-sm ${mc}`}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-2 text-sm ${mc} hover:text-red-400 transition-colors p-2 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 ${tabBg} rounded-xl p-1 mb-8 overflow-x-auto`}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                tab === id ? 'bg-gold-500 text-dark-700' : tabInactive
              }`}
            >
              <Icon size={13} />
              {label}
              {id === 'wishlist' && wishlistIds.length > 0 && (
                <span className="ml-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">{wishlistIds.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ─── ORDERS ─── */}
        {tab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag size={48} className={`${emptyIcon} mx-auto mb-4`} />
                <h2 className={`text-lg font-semibold ${tc} mb-2`}>No orders yet</h2>
                <p className={`${mc} mb-6`}>Start shopping to see your orders here.</p>
                <Link href="/products" className="btn-gold inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold">
                  Shop Now <ChevronRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => {
                  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                  const StatusIcon = status.icon;
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`card-surface rounded-2xl border ${cardBorder} p-5`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className={`text-sm font-semibold ${tc}`}>{order.orderNumber}</div>
                          <div className={`text-xs ${mc} mt-0.5`}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${status.color}`}>
                          <StatusIcon size={13} />
                          {status.label}
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4 flex-wrap">
                        {order.order_items.slice(0, 4).map((item) => (
                          <div key={item.id} className="relative">
                            <div className={`w-12 h-12 rounded-lg overflow-hidden border ${isDark ? 'bg-dark-300 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                              {item.products?.images?.[0] && (
                                <img src={item.products.images[0]} alt={item.productName} className="w-full h-full object-cover" />
                              )}
                            </div>
                            {item.quantity > 1 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-dark-700 text-[9px] font-bold flex items-center justify-center">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                        {order.order_items.length > 4 && (
                          <div className={`w-12 h-12 rounded-lg border flex items-center justify-center text-xs ${mc} ${isDark ? 'bg-dark-300 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                            +{order.order_items.length - 4}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-sm ${mc}`}>{order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}</span>
                          <span className="mx-2 text-silver-700">•</span>
                          <span className="text-sm font-semibold text-gold-400">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                        <div className={`text-xs ${mc}`}>
                          {order.paymentMethod.toUpperCase()} · {order.paymentStatus}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── WISHLIST ─── */}
        {tab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-20">
                <Heart size={48} className={`${emptyIcon} mx-auto mb-4`} />
                <h2 className={`text-lg font-semibold ${tc} mb-2`}>Your wishlist is empty</h2>
                <p className={`${mc} mb-6`}>Click the heart icon on any product to add it here.</p>
                <Link href="/products" className="btn-gold inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold">
                  <ShoppingBag size={16} /> Browse Products <ChevronRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlistProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── LOYALTY ─── */}
        {tab === 'loyalty' && <LoyaltyPanel />}

        {/* ─── REFERRALS ─── */}
        {tab === 'referrals' && <ReferralPanel />}

        {/* ─── PROFILE ─── */}
        {tab === 'profile' && (
          <div className={`card-surface rounded-2xl border ${cardBorder} p-6 max-w-lg space-y-4`}>
            <h2 className={`text-lg font-bold ${tc}`}>Account Details</h2>
            {[
              { label: 'Full Name', value: user.fullName ?? '—' },
              { label: 'Email', value: user.email },
              { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'Loyalty Points', value: `${loyaltyPoints.toLocaleString('en-IN')} pts (₹${Math.floor(loyaltyPoints / 100) * 50} value)` },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className={`block text-xs ${sc} mb-1.5`}>{label}</label>
                <div className={`input-dark px-4 py-3 rounded-xl text-sm ${inputBg}`}>{value}</div>
              </div>
            ))}

            <div className={`pt-4 border-t ${cardBorder}`}>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut size={15} /> Sign Out of Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
