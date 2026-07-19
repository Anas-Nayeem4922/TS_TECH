'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/database.types';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products?ids=${wishlistIds.join(',')}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then(({ products }) => {
        setProducts((products as Product[]) ?? []);
        setLoading(false);
      });
  }, [wishlistIds]);

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Heart size={18} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
            <p className="text-silver-500 text-sm">
              {loading ? 'Loading...' : `${products.length} item${products.length !== 1 ? 's' : ''} in your wishlist`}
            </p>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-dark-400 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-dark-50 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-silver-500 mb-6">Start adding products you love by clicking the heart icon.</p>
            <Link href="/products" className="btn-gold inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold">
              <ShoppingBag size={16} /> Browse Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
