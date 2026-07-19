'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/database.types';

interface RecentlyViewedContextValue {
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

const LOCAL_KEY = 'ts_tech_recently_viewed';
const MAX_ITEMS = 10;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]');
      setRecentlyViewed(local);
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  const addRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const next = [product, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem(LOCAL_KEY);
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
