'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Gift, Sparkles, Wallet, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface LoyaltyMembership {
  tier: string;
  totalSpend: number;
  totalOrders: number;
  points: number;
  nextTierPoints: number;
  tierSince: string;
  lastUpdatedAt: string;
}

const POINTS_SLABS = [
  { range: '₹300 – ₹799', points: 40, min: 300, max: 799 },
  { range: '₹800 – ₹1,499', points: 60, min: 800, max: 1499 },
  { range: '₹1,500 – ₹2,400', points: 100, min: 1500, max: 2400 },
  { range: '₹2,401 – ₹3,500', points: 200, min: 2401, max: 3500 },
];

const REDEMPTION_RATE = 100; // 100 points = ₹50
const REDEMPTION_VALUE = 50;

export function LoyaltyPanel() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [membership, setMembership] = useState<LoyaltyMembership | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isDark = theme === 'dark';

  const fetchMembership = useCallback(async () => {
    if (!user) return;
    const res = await fetch('/api/loyalty', { cache: 'no-store' });
    const data = await res.json();
    setMembership(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchMembership(); }, [fetchMembership]);

  const refreshMembership = async () => {
    if (!user) return;
    setRefreshing(true);
    await fetchMembership();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentPoints = membership?.points ?? 0;
  const walletValue = Math.floor(currentPoints / REDEMPTION_RATE) * REDEMPTION_VALUE;
  const totalSpend = membership?.totalSpend ?? 0;
  const totalOrders = membership?.totalOrders ?? 0;

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-silver-400' : 'text-gray-600';
  const mutedTextColor = isDark ? 'text-silver-500' : 'text-gray-500';
  const cardBg = isDark ? 'bg-white/5' : 'bg-gray-100';
  const cardBorder = isDark ? 'border-white/5' : 'border-gray-200';

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-bold ${textColor}`}>Loyalty Rewards</h2>
          <p className={`text-sm mt-1 ${subTextColor}`}>Earn points on every purchase and redeem them for discounts.</p>
        </div>
        <button
          onClick={refreshMembership}
          disabled={refreshing}
          className={`text-xs ${mutedTextColor} hover:text-gold-500 transition-colors flex items-center gap-1`}
        >
          <TrendingUp size={12} className={refreshing ? 'animate-bounce' : ''} />
          Refresh
        </button>
      </div>

      {/* Points Wallet Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl border border-gold-500/20 p-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent opacity-60" />
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/20 flex items-center justify-center">
                <Coins size={28} className="text-gold-400" />
              </div>
              <div>
                <div className={`text-xs uppercase tracking-wider ${mutedTextColor}`}>Your Wallet</div>
                <div className={`text-2xl font-bold ${textColor}`}>{currentPoints.toLocaleString('en-IN')} pts</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gold-400">₹{walletValue.toLocaleString('en-IN')}</div>
              <div className={`text-xs ${mutedTextColor}`}>redeemable value</div>
            </div>
          </div>

          {/* Conversion info */}
          <div className={`flex items-center justify-center gap-2 rounded-xl ${cardBg} border ${cardBorder} py-2.5`}>
            <Sparkles size={13} className="text-gold-400" />
            <span className={`text-xs ${subTextColor}`}>{REDEMPTION_RATE} points = ₹{REDEMPTION_VALUE} discount</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className={`text-center rounded-xl p-3 border ${cardBg} ${cardBorder}`}>
              <div className={`text-sm font-bold ${textColor}`}>{totalOrders}</div>
              <div className={`text-[10px] ${mutedTextColor} mt-0.5`}>Orders Placed</div>
            </div>
            <div className={`text-center rounded-xl p-3 border ${cardBg} ${cardBorder}`}>
              <div className={`text-sm font-bold ${textColor}`}>₹{totalSpend.toLocaleString('en-IN')}</div>
              <div className={`text-[10px] ${mutedTextColor} mt-0.5`}>Total Spent</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How to Earn */}
      <div className={`card-surface rounded-2xl border ${cardBorder} p-5`}>
        <h3 className={`text-sm font-semibold ${textColor} mb-4 flex items-center gap-2`}>
          <ShoppingBag size={14} className="text-gold-500" /> How to Earn Points
        </h3>
        <div className="space-y-2.5">
          {POINTS_SLABS.map((slab, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-center justify-between rounded-xl p-3 border ${cardBg} ${cardBorder}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gold-400">{i + 1}</span>
                </div>
                <span className={`text-sm font-medium ${textColor}`}>{slab.range}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Coins size={14} className="text-gold-400" />
                <span className="text-sm font-bold text-gold-400">+{slab.points} pts</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How to Redeem */}
      <div className={`card-surface rounded-2xl border ${cardBorder} p-5`}>
        <h3 className={`text-sm font-semibold ${textColor} mb-4 flex items-center gap-2`}>
          <Wallet size={14} className="text-gold-500" /> How to Redeem
        </h3>
        <div className="space-y-3">
          <div className={`flex items-center gap-3 rounded-xl p-3 border ${cardBg} ${cardBorder}`}>
            <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center flex-shrink-0">
              <Gift size={14} className="text-green-400" />
            </div>
            <div>
              <div className={`text-sm font-medium ${textColor}`}>Use points at checkout</div>
              <div className={`text-xs ${mutedTextColor}`}>Apply your points during checkout to reduce your order total.</div>
            </div>
          </div>
          <div className={`flex items-center gap-3 rounded-xl p-3 border ${cardBg} ${cardBorder}`}>
            <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-gold-400" />
            </div>
            <div>
              <div className={`text-sm font-medium ${textColor}`}>100 points = ₹50 off</div>
              <div className={`text-xs ${mutedTextColor}`}>Points are deducted from your wallet when you use them.</div>
            </div>
          </div>
        </div>
        <p className={`text-xs ${mutedTextColor} mt-3 text-center`}>Points are updated automatically when your order is confirmed.</p>
      </div>
    </div>
  );
}
