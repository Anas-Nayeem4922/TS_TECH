'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Shield, Truck, RotateCcw,
  Star, Plus, Minus, Heart, ChevronRight, Package,
  Zap, Box, Check, Pencil, Trash2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import { StarRating } from '@/components/StarRating';
import type { Product, Category, Review, ColorVariant } from '@/lib/database.types';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addRecentlyViewed } = useRecentlyViewed();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  // Review state
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/products/${slug}`, { cache: 'no-store' });
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();

      const p: Product | null = data.product ?? null;
      if (!p) { setLoading(false); return; }
      setProduct(p);
      addRecentlyViewed(p);

      const rev: Review[] = data.reviews ?? [];
      const rel: Product[] = data.related ?? [];
      const cat: Category | null = data.category ?? null;

      setCategory(cat);
      setReviews(rev);
      setRelated(rel);
      setLoading(false);

      // Check if current user has a review
      if (user && rev) {
        const existing = rev.find((r) => r.userId === user.id);
        if (existing) {
          setUserReview(existing);
          setReviewRating(existing.rating);
          setReviewTitle(existing.title ?? '');
          setReviewBody(existing.body ?? '');
        }
      }
    }
    load();
  }, [slug, addRecentlyViewed, user]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    for (let i = 0; i < quantity; i++) await addToCart(product);
    setAdding(false);
    toast.success('Added to cart!', { description: `${quantity} × ${product.name}` });
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setBuying(true);
    for (let i = 0; i < quantity; i++) await addToCart(product);
    setBuying(false);
    router.push('/checkout');
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    const wasIn = isInWishlist(product.id);
    await toggleWishlist(product);
    toast.success(wasIn ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleSubmitReview = async () => {
    if (!product || !user) return;
    if (reviewRating < 1 || reviewRating > 5) { toast.error('Please select a rating (1-5 stars)'); return; }

    setSubmittingReview(true);

    if (userReview) {
      // Update existing review
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ id: userReview.id, rating: reviewRating, title: reviewTitle.trim() || null, body: reviewBody.trim() || null }),
      });
      if (!res.ok) {
        toast.error('Failed to update review');
      } else {
        toast.success('Review updated!');
        const updated = { ...userReview, rating: reviewRating, title: reviewTitle.trim() || null, body: reviewBody.trim() || null };
        setUserReview(updated);
        setReviews((prev) => prev.map((r) => r.id === updated.id ? updated : r));
        setEditingReview(false);
      }
    } else {
      // Insert new review
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ productId: product.id, rating: reviewRating, title: reviewTitle.trim() || null, body: reviewBody.trim() || null }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error('Failed to submit review: ' + (err.error ?? err.message ?? 'Unknown error'));
      } else {
        const data = await res.json();
        const newReview = data.review ?? data;
        toast.success('Review submitted!');
        setUserReview(newReview);
        setReviews((prev) => [newReview, ...prev]);
      }
    }
    setSubmittingReview(false);
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    const res = await fetch(`/api/reviews?id=${userReview.id}`, { method: 'DELETE', cache: 'no-store' });
    if (!res.ok) {
      toast.error('Failed to delete review');
    } else {
      toast.success('Review deleted');
      setReviews((prev) => prev.filter((r) => r.id !== userReview.id));
      setUserReview(null);
      setReviewRating(5);
      setReviewTitle('');
      setReviewBody('');
    }
  };

  const colorVariants = ((product?.colorVariants as ColorVariant[] | null) ?? []).filter((v) => v.color && v.images.length > 0);
  const generalImages = (product?.images ?? []) as string[];
  const currentImages = colorVariants.length > 0 && colorVariants[activeColor]
    ? colorVariants[activeColor].images
    : generalImages;
  const inTheBox = (product?.inTheBox as string[] | null) ?? [];
  const discount = product?.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  const wishlisted = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4">
        <Package size={48} className="text-silver-600" />
        <h1 className="text-2xl font-bold text-white">Product not found</h1>
        <Link href="/products" className="btn-outline-gold px-5 py-2.5 rounded-xl text-sm">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 py-6 text-sm text-silver-500">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-gold-500 transition-colors">Products</Link>
          {category && (
            <>
              <ChevronRight size={14} />
              <Link href={`/products?category=${category.slug}`} className="hover:text-gold-500 transition-colors">{category.name}</Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="text-silver-400 truncate max-w-40">{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-dark-300 mb-3 border border-white/5"
            >
              {currentImages[activeImage] ? (
                <img src={currentImages[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={48} className="text-dark-50" />
                </div>
              )}
              {discount && <div className="absolute top-4 left-4 badge-gold">{discount}% OFF</div>}
              {product.fastDelivery && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-500/20 backdrop-blur-sm text-green-400 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-green-500/30">
                  <Zap size={10} /> Fast Delivery
                </div>
              )}
            </motion.div>

            {currentImages.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {currentImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImage ? 'border-gold-500' : 'border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.brand && (
              <div className="text-xs text-gold-500 font-semibold uppercase tracking-wider mb-2">{product.brand}</div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{product.name}</h1>

            {/* Rating Summary */}
            {avgRating && (
              <div className="flex items-center gap-3 mb-4">
                <StarRating value={Math.round(avgRating)} readOnly size={16} />
                <span className="text-sm text-silver-500">{avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gold-400">₹{product.price.toLocaleString('en-IN')}</span>
              {product.comparePrice && (
                <span className="text-lg text-silver-600 line-through">₹{product.comparePrice.toLocaleString('en-IN')}</span>
              )}
              {discount && <span className="badge-gold">{discount}% off</span>}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-silver-400 leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Color Variants */}
            {colorVariants.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-semibold text-white mb-2">
                  Color: <span className="text-gold-400">{colorVariants[activeColor]?.color}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colorVariants.map((variant, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveColor(i); setActiveImage(0); }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                        i === activeColor ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {variant.images[0] && (
                        <div className="w-6 h-6 rounded-md overflow-hidden bg-dark-300 flex-shrink-0">
                          <img src={variant.images[0]} alt={variant.color} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className={`text-xs font-medium ${i === activeColor ? 'text-white' : 'text-silver-400'}`}>
                        {variant.color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* In the Box */}
            {inTheBox.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
                  <Box size={14} className="text-gold-500" /> What&apos;s in the Box
                </div>
                <div className="flex flex-wrap gap-2">
                  {inTheBox.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/3 border border-white/5 rounded-lg px-3 py-1.5">
                      <Check size={11} className="text-green-400" />
                      <span className="text-sm text-silver-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="mb-6">
              {product.stockQuantity > 0 ? (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-400 font-medium">In Stock</span>
                  {product.stockQuantity <= 5 && (
                    <span className="text-silver-500">— only {product.stockQuantity} left</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-400 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity + Add to Cart + Buy Now */}
            {product.stockQuantity > 0 && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-dark-400 border border-white/10 rounded-xl p-1">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-silver-400 hover:text-white transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-white">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))} className="w-8 h-8 flex items-center justify-center text-silver-400 hover:text-white transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="flex-1 btn-outline-gold flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-60"
                  >
                    <ShoppingCart size={16} />
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all ${
                      wishlisted ? 'border-red-500/30 bg-red-500/10' : 'border-white/10 hover:border-gold-500/30'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart size={16} className={wishlisted ? 'fill-red-400 text-red-400' : 'text-silver-400'} />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={buying}
                  className="w-full btn-gold flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold disabled:opacity-60"
                >
                  <Zap size={16} />
                  {buying ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Shield, label: 'Genuine Product' },
                { icon: Truck, label: product.fastDelivery ? 'Delivery in 1 Day' : 'Fast Delivery' },
                { icon: RotateCcw, label: '7-Day Return' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/3 border border-white/5">
                  <b.icon size={16} className="text-gold-500" />
                  <span className="text-xs text-silver-500 text-center">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Warranty */}
            {product.warrantyInfo && (
              <div className="flex items-center gap-2 text-sm text-silver-500 bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                <Shield size={14} className="text-gold-500 flex-shrink-0" />
                <span>{product.warrantyInfo}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reviews & Ratings Section */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">Ratings & Reviews</h2>

          {/* Rating Summary */}
          <div className="card-surface rounded-2xl border border-white/5 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gold-400">{avgRating ? avgRating.toFixed(1) : '—'}</div>
                {avgRating && <StarRating value={Math.round(avgRating)} readOnly size={16} />}
                <div className="text-xs text-silver-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
              </div>
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-silver-500 w-8">{star}★</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-silver-600 w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Write/Edit Review */}
          {user ? (
            <div className="card-surface rounded-2xl border border-white/5 p-6 mb-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                {userReview && !editingReview ? 'Your Review' : userReview ? 'Edit Your Review' : 'Write a Review'}
              </h3>

              {userReview && !editingReview ? (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <StarRating value={userReview.rating} readOnly size={18} />
                    {userReview.isVerifiedPurchase && <span className="text-[10px] text-green-400">Verified Purchase</span>}
                  </div>
                  {userReview.title && <div className="text-sm font-semibold text-white mb-1">{userReview.title}</div>}
                  {userReview.body && <p className="text-sm text-silver-400 leading-relaxed mb-3">{userReview.body}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => setEditingReview(true)} className="btn-outline-gold flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs">
                      <Pencil size={11} /> Edit
                    </button>
                    <button onClick={handleDeleteReview} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-silver-400 mb-2">Your Rating</label>
                    <StarRating value={reviewRating} onChange={setReviewRating} size={28} />
                  </div>
                  <div>
                    <label className="block text-xs text-silver-400 mb-1.5">Title (optional)</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Summarize your experience"
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-silver-400 mb-1.5">Review (optional)</label>
                    <textarea
                      rows={3}
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Share details about the product quality, your experience, etc."
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm resize-none"
                      maxLength={500}
                    />
                  </div>
                  <div className="flex gap-2">
                    {userReview && (
                      <button onClick={() => { setEditingReview(false); setReviewRating(userReview.rating); setReviewTitle(userReview.title ?? ''); setReviewBody(userReview.body ?? ''); }} className="btn-outline-gold px-4 py-2.5 rounded-xl text-sm">
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
                    >
                      {submittingReview ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card-surface rounded-2xl border border-white/5 p-6 mb-6 text-center">
              <p className="text-sm text-silver-500 mb-3">Please sign in to write a review</p>
              <Link href="/login?redirect=/products/[slug]" className="btn-outline-gold inline-flex px-4 py-2 rounded-lg text-sm">
                Sign In
              </Link>
            </div>
          )}

          {/* All Reviews */}
          {reviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="card-surface rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <StarRating value={r.rating} readOnly size={14} />
                    {r.isVerifiedPurchase && <span className="text-[10px] text-green-400">Verified</span>}
                  </div>
                  {r.title && <div className="text-sm font-semibold text-white mb-1">{r.title}</div>}
                  {r.body && <p className="text-sm text-silver-400 leading-relaxed">{r.body}</p>}
                  <div className="text-[10px] text-silver-600 mt-2">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-silver-500 py-8">No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
