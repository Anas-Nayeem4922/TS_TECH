'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Tag, Zap, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import type { Product, ColorVariant } from '@/lib/database.types';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(0);

  const wishlisted = isInWishlist(product.id);
  const colorVariants = ((product.colorVariants as ColorVariant[] | null) ?? []).filter((v) => v.color && v.images.length > 0);
  const generalImages = (product.images ?? []) as string[];
  const cardImage = colorVariants.length > 0 && colorVariants[activeColor]?.images?.[0]
    ? colorVariants[activeColor].images[0]
    : (!imgError && generalImages?.[0] ? generalImages[0] : null);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockQuantity === 0) return;
    setAdding(true);
    await addToCart(product);
    setAdding(false);
    toast.success(`${product.name} added to cart`, { description: `₹${product.price.toLocaleString('en-IN')}` });
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockQuantity === 0) return;
    setBuying(true);
    await addToCart(product);
    setBuying(false);
    router.push('/checkout');
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasIn = isInWishlist(product.id);
    await toggleWishlist(product);
    toast.success(wasIn ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="product-card rounded-2xl overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-dark-300">
            {cardImage ? (
              <img
                src={cardImage}
                alt={product.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark-300">
                <Package size={32} className="text-dark-50" />
              </div>
            )}

            {/* Discount Badge — top left */}
            {discount && discount > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-2.5 left-2.5 z-10"
              >
                <div className="flex items-center gap-1 bg-gold-500 text-dark-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  <Tag size={9} />
                  {discount}% OFF
                </div>
              </motion.div>
            )}

            {/* Wishlist Heart — top right, always visible */}
            <button
              onClick={handleWishlist}
              className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-dark-700/80 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-dark-700 ${
                wishlisted ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`}
              aria-label="Wishlist"
            >
              <Heart
                size={14}
                className={`transition-all ${wishlisted ? 'fill-red-400 text-red-400' : 'text-white/80 hover:text-white'}`}
              />
            </button>

            {/* Fast delivery badge — below heart, right side */}
            {product.fastDelivery && (
              <div className="absolute top-12 right-2.5 flex items-center gap-0.5 bg-green-500/20 backdrop-blur-sm text-green-400 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-green-500/30">
                <Zap size={8} /> 1-Day
              </div>
            )}

            {/* Stock badge — below heart, right side (only if low stock and not fast delivery) */}
            {product.stockQuantity <= 5 && product.stockQuantity > 0 && !product.fastDelivery && (
              <div className="absolute top-12 right-2.5">
                <span className="bg-red-900/70 backdrop-blur-sm text-red-300 text-[9px] font-medium px-2 py-0.5 rounded-full border border-red-800/40">
                  Only {product.stockQuantity} left
                </span>
              </div>
            )}

            {/* Color dots — bottom left */}
            {colorVariants.length > 1 && (
              <div className="absolute bottom-3 left-3 flex gap-1 z-10">
                {colorVariants.slice(0, 4).map((v, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveColor(i); }}
                    className={`w-5 h-5 rounded-full overflow-hidden border-2 transition-all ${
                      i === activeColor ? 'border-gold-500' : 'border-white/30'
                    }`}
                  >
                    {v.images[0] && <img src={v.images[0]} alt={v.color} className="w-full h-full object-cover" />}
                  </button>
                ))}
              </div>
            )}

            {/* Quick actions — slides up on hover */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="absolute inset-x-0 bottom-0 flex gap-1 p-1 z-10"
                >
                  <button
                    onClick={handleAddToCart}
                    disabled={adding || product.stockQuantity === 0}
                    className="flex-1 py-2.5 bg-dark-700/90 backdrop-blur-sm text-gold-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-dark-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gold-500/30"
                  >
                    <ShoppingCart size={13} />
                    {adding ? '...' : product.stockQuantity === 0 ? 'Sold Out' : 'Add'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={buying || product.stockQuantity === 0}
                    className="flex-1 py-2.5 bg-gold-500 text-dark-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap size={13} />
                    {buying ? '...' : 'Buy Now'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product Info */}
          <div className="p-3.5">
            {product.brand && (
              <div className="text-[10px] text-gold-500 font-semibold uppercase tracking-wider mb-0.5">
                {product.brand}
              </div>
            )}

            <h3 className="text-sm font-medium text-white/85 leading-snug mb-2.5 line-clamp-2 group-hover:text-white transition-colors">
              {product.name}
            </h3>

            {/* Price section */}
            <div className="relative h-10 flex items-center">
              <AnimatePresence mode="wait">
                {!hovered ? (
                  <motion.div
                    key="default-price"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-base font-bold text-gold-400">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.comparePrice && (
                      <span className="text-xs text-silver-600 line-through">
                        ₹{product.comparePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="hover-price"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col"
                  >
                    {product.comparePrice ? (
                      <div className="flex items-center gap-2">
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-base font-bold text-gold-400"
                        >
                          ₹{product.price.toLocaleString('en-IN')}
                        </motion.span>
                        <div className="flex flex-col items-start">
                          <motion.span
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.25 }}
                            style={{ transformOrigin: 'left' }}
                            className="text-xs text-red-400/70 line-through"
                          >
                            ₹{product.comparePrice.toLocaleString('en-IN')}
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-[10px] text-green-400 font-semibold leading-none"
                          >
                            Save ₹{(product.comparePrice - product.price).toLocaleString('en-IN')}
                          </motion.span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-base font-bold text-gold-400">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {product.stockQuantity === 0 && (
              <div className="text-[10px] text-red-400 mt-1">Out of stock</div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
