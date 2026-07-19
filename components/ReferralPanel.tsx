'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Users, Coins, Share2, CircleCheck as CheckCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ReferralCode {
  id: string;
  code: string;
  rewardPerReferral: number;
  referredReward: number;
  usesCount: number;
  isActive: boolean;
}

interface ReferralUse {
  id: string;
  status: string;
  createdAt: string;
  referrerReward: number | null;
}

interface Credit {
  id: string;
  amount: number;
  description: string;
  isUsed: boolean;
  createdAt: string;
}

function generateCode(userId: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seed = userId.replace(/-/g, '').substring(0, 8);
  let code = 'TS';
  for (let i = 0; i < 6; i++) {
    const charCode = seed.charCodeAt(i % seed.length);
    code += chars[charCode % chars.length];
  }
  return code;
}

export function ReferralPanel() {
  const { user } = useAuth();
  const [myCode, setMyCode] = useState<ReferralCode | null>(null);
  const [uses, setUses] = useState<ReferralUse[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const availableCredits = credits.filter((c) => !c.isUsed).reduce((s, c) => s + c.amount, 0);
  const totalEarned = credits.reduce((s, c) => s + c.amount, 0);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const res = await fetch('/api/referrals', { cache: 'no-store' });
    const data = await res.json();
    setMyCode(data.referralCode ?? null);
    setUses(data.referralUses ?? []);
    setCredits(data.credits ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createCode = async () => {
    if (!user) return;
    setCreating(true);
    const res = await fetch('/api/referrals', { method: 'POST', cache: 'no-store' });
    const data = await res.json();
    setCreating(false);
    if (data.referralCode) {
      setMyCode(data.referralCode);
      toast.success('Referral code created!');
    } else {
      toast.error('Failed to create referral code');
    }
  };

  const copyCode = async () => {
    if (!myCode) return;
    await navigator.clipboard.writeText(myCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Code copied!');
  };

  const shareCode = async () => {
    if (!myCode) return;
    const text = `🎁 Use my code ${myCode.code} at TS Tech Canopy to get ₹${myCode.referredReward} off your first order! Shop premium tech accessories at tstechcanopy.com`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Share text copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white">Refer & Earn</h2>
        <p className="text-silver-400 text-sm mt-1">
          Share your referral code with friends. You earn <span className="text-gold-400 font-semibold">₹50</span> for each successful referral, and your friend gets <span className="text-gold-400 font-semibold">₹25</span> off their first order.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Total Referrals', value: uses.length },
          { icon: Coins, label: 'Total Earned', value: `₹${totalEarned}` },
          { icon: Gift, label: 'Available Credit', value: `₹${availableCredits}` },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card-surface rounded-xl border border-white/5 p-4 text-center"
          >
            <stat.icon size={18} className="text-gold-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-silver-500 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Referral Code Card */}
      {!myCode ? (
        <div className="card-surface rounded-2xl border border-white/5 p-6 text-center">
          <Gift size={40} className="text-gold-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-2">Generate Your Code</h3>
          <p className="text-silver-400 text-sm mb-5">Create your personal referral code and start earning rewards.</p>
          <button
            onClick={createCode}
            disabled={creating}
            className="btn-gold px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {creating ? 'Generating...' : 'Generate My Code'}
          </button>
        </div>
      ) : (
        <div className="card-surface rounded-2xl border border-gold-500/15 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Your Referral Code</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${myCode.isActive ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
              {myCode.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Big code display */}
          <div className="relative bg-dark-400 rounded-xl border border-gold-500/20 p-4 mb-4 text-center">
            <div className="text-3xl font-bold tracking-widest gold-text font-mono">{myCode.code}</div>
            <div className="text-xs text-silver-500 mt-1">{myCode.usesCount} times used</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyCode}
              className="flex-1 flex items-center justify-center gap-2 btn-gold py-2.5 rounded-xl text-sm font-semibold"
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={shareCode}
              className="flex-1 flex items-center justify-center gap-2 btn-outline-gold py-2.5 rounded-xl text-sm font-semibold"
            >
              <Share2 size={14} /> Share
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/3 rounded-xl p-3 border border-white/5">
              <div className="text-sm font-bold text-gold-400">₹{myCode.rewardPerReferral}</div>
              <div className="text-[10px] text-silver-500 mt-0.5">You earn per referral</div>
            </div>
            <div className="bg-white/3 rounded-xl p-3 border border-white/5">
              <div className="text-sm font-bold text-green-400">₹{myCode.referredReward}</div>
              <div className="text-[10px] text-silver-500 mt-0.5">Friend gets off first order</div>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="card-surface rounded-2xl border border-white/5 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">How It Works</h3>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Generate your code', desc: 'Get a unique referral code from your account.' },
            { step: '2', title: 'Share with friends', desc: 'Send your code via WhatsApp, Instagram, or any platform.' },
            { step: '3', title: 'Friend signs up', desc: 'Your friend creates an account and applies your code.' },
            { step: '4', title: 'Both earn rewards', desc: 'Friend gets ₹25 off. You get ₹50 credited to your wallet.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-xs font-bold text-gold-400 flex-shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{title}</div>
                <div className="text-xs text-silver-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral History */}
      {uses.length > 0 && (
        <div className="card-surface rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Referral History</h3>
          <div className="space-y-2">
            {uses.map((use, i) => (
              <div key={use.id} className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold-500/10 flex items-center justify-center">
                    <Users size={12} className="text-gold-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">Friend #{i + 1}</div>
                    <div className="text-[10px] text-silver-500">
                      {new Date(use.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium capitalize ${use.status === 'credited' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {use.status === 'credited' ? `+₹${use.referrerReward}` : 'Pending'}
                  </div>
                  <div className="text-[10px] text-silver-600">{use.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credits History */}
      {credits.length > 0 && (
        <div className="card-surface rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Credit Wallet</h3>
          <div className="flex items-center justify-between mb-3 p-3 bg-gold-500/8 rounded-xl border border-gold-500/15">
            <span className="text-sm text-white">Available balance</span>
            <span className="text-lg font-bold text-gold-400">₹{availableCredits}</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {credits.map((credit) => (
              <div key={credit.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-xs font-medium text-white">{credit.description}</div>
                  <div className="text-[10px] text-silver-500">
                    {new Date(credit.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div className={`text-sm font-semibold ${credit.isUsed ? 'text-silver-600 line-through' : 'text-green-400'}`}>
                  {credit.isUsed ? 'Used' : `+₹${credit.amount}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
