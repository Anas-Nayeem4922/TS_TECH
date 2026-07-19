'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Tag } from 'lucide-react';
interface DealItem { id: string; name: string; slug: string; price: number; comparePrice: number | null; images: string[]; }

export function DailyDealsBanner() {
  const [deals, setDeals] = useState<DealItem[]>([]);

  useEffect(() => {
    fetch('/api/products?daily_deal=true&limit=10', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setDeals((data.products ?? []) as DealItem[]));
  }, []);

  if (deals.length === 0) return null;

  const items = [...deals, ...deals];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-dark-700/98 backdrop-blur-sm border-b border-gold-500/20 overflow-hidden">
      <div className="max-w-5xl mx-auto flex items-center gap-0 h-8">
        {/* Label */}
        <div className="flex items-center gap-1.5 px-3 flex-shrink-0 border-r border-gold-500/20 h-full">
          <Flame size={11} className="text-gold-500 flex-shrink-0" />
          <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest whitespace-nowrap">Deals</span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="flex gap-6 w-max items-center h-8"
          >
            {items.map((product, i) => {
              const discount = product.comparePrice
                ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                : null;
              return (
                <Link
                  key={`${product.id}-${i}`}
                  href={`/products/${product.slug}`}
                  className="flex items-center gap-2 group whitespace-nowrap"
                >
                  <span className="text-[11px] text-silver-300 group-hover:text-white transition-colors">{product.name}</span>
                  <span className="text-[11px] font-bold text-gold-400">₹{product.price.toLocaleString('en-IN')}</span>
                  {discount && (
                    <span className="text-[9px] font-bold text-green-400 flex items-center gap-0.5">
                      <Tag size={8} />{discount}%
                    </span>
                  )}
                  <span className="text-silver-700 text-[10px]">•</span>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
