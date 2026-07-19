'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import type { Product } from '@/lib/database.types';

interface WishlistContextValue {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const LOCAL_KEY = 'ts_tech_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/wishlist', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(data.ids ?? []);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      try {
        setWishlistIds(JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]'));
      } catch {
        setWishlistIds([]);
      }
    }
  }, [user, fetchWishlist]);

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const toggleWishlist = async (product: Product) => {
    const isCurrentlyIn = wishlistIds.includes(product.id);
    const next = isCurrentlyIn
      ? wishlistIds.filter((id) => id !== product.id)
      : [...wishlistIds, product.id];
    setWishlistIds(next);

    if (!user) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      return;
    }

    if (isCurrentlyIn) {
      await fetch(`/api/wishlist?productId=${product.id}`, { method: 'DELETE' });
    } else {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, isInWishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
