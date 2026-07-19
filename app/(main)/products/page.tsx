'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, ArrowUp, Zap, Check } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import type { Product, Category } from '@/lib/database.types';

const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'name:asc', label: 'Name: A-Z' },
];

const PRICE_RANGES: [number, number, string][] = [
  [0, 100000, 'All prices'],
  [0, 500, 'Under ₹500'],
  [500, 1000, '₹500 – ₹1,000'],
  [1000, 2000, '₹1,000 – ₹2,000'],
  [2000, 5000, '₹2,000 – ₹5,000'],
  [5000, 100000, 'Above ₹5,000'],
];

function FilterDropdown({
  label,
  options,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm transition-all border ${
          value && value !== 'all'
            ? 'border-gold-500/40 bg-gold-500/8 text-gold-400'
            : 'border-white/10 bg-white/3 text-silver-300 hover:border-white/20'
        }`}
      >
        {icon}
        <span className="font-medium whitespace-nowrap">
          {label}{value && value !== 'all' ? `: ${selectedLabel}` : ''}
        </span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1.5 left-0 min-w-[200px] z-50 bg-dark-500 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1"
            >
              {options.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    value === o.value
                      ? 'text-gold-400 bg-gold-500/10'
                      : 'text-silver-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {o.label}
                  {value === o.value && <Check size={13} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam ?? '');
  const [searchQuery, setSearchQuery] = useState(queryParam ?? '');
  const [sortBy, setSortBy] = useState('created_at:desc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryParam ?? '');
    setSearchQuery(queryParam ?? '');
  }, [categoryParam, queryParam]);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/products?brands_only=true', { cache: 'no-store' }).then((r) => r.json()),
    ]).then(([cats, brands]) => {
      setCategories(cats.categories ?? []);
      setBrands((brands.brands ?? []).sort());
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('is_active', 'true');
    params.set('sort', sortBy);
    params.set('min_price', String(priceRange[0]));
    params.set('max_price', String(priceRange[1]));
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) params.set('category', cat.slug);
    }
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedBrand !== 'all') params.set('brand', selectedBrand);
    if (fastDeliveryOnly) params.set('fast_delivery', 'true');
    const res = await fetch(`/api/products?${params}`, { cache: 'no-store' });
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }, [selectedCategory, searchQuery, sortBy, priceRange, categories, selectedBrand, fastDeliveryOnly]);

  useEffect(() => {
    if (categories.length > 0 || !selectedCategory) fetchProducts();
  }, [fetchProducts, categories.length, selectedCategory]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeCategory = categories.find((c) => c.slug === selectedCategory);
  const activePriceLabel = PRICE_RANGES.find(([min, max]) => min === priceRange[0] && max === priceRange[1])?.[2];

  const categoryOptions = [
    { value: 'all', label: 'All Products' },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const priceOptions = PRICE_RANGES.map(([min, max, label]) => ({
    value: `${min}-${max}`,
    label,
  }));

  const brandOptions = [
    { value: 'all', label: 'All Brands' },
    ...brands.map((b) => ({ value: b, label: b })),
  ];

  const deliveryOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'fast', label: 'Delivery under a day' },
  ];

  const hasActiveFilters = selectedCategory || searchQuery || priceRange[0] > 0 || priceRange[1] < 100000 || selectedBrand !== 'all' || fastDeliveryOnly;

  return (
    <div className="min-h-screen pt-28 pb-16">
      {/* Page Header */}
      <div className="bg-dark-600/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-1"
          >
            {activeCategory?.name ?? (searchQuery ? `Results for "${searchQuery}"` : 'All Products')}
          </motion.h1>
          <p className="text-silver-500 text-sm">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Bar: Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input-dark pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-600 hover:text-silver-400 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-dark appearance-none pl-4 pr-9 py-2.5 rounded-xl text-sm cursor-pointer min-w-[160px] text-white"
                style={{ color: '#F5F5F5' }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-dark-500 text-white">{o.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2 mb-4">
          <FilterDropdown
            label="Category"
            options={categoryOptions}
            value={selectedCategory || 'all'}
            onChange={(v) => setSelectedCategory(v === 'all' ? '' : v)}
          />
          <FilterDropdown
            label="Price"
            options={priceOptions}
            value={`${priceRange[0]}-${priceRange[1]}`}
            onChange={(v) => {
              const [min, max] = v.split('-').map(Number);
              setPriceRange([min, max]);
            }}
          />
          <FilterDropdown
            label="Brand"
            options={brandOptions}
            value={selectedBrand}
            onChange={setSelectedBrand}
          />
          <FilterDropdown
            label="Delivery"
            options={deliveryOptions}
            value={fastDeliveryOnly ? 'fast' : 'all'}
            onChange={(v) => setFastDeliveryOnly(v === 'fast')}
            icon={<Zap size={12} className={fastDeliveryOnly ? 'text-gold-400' : 'text-silver-500'} />}
          />
        </div>

        {/* Active filters chips */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-4 overflow-hidden"
            >
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 badge-gold pl-3 pr-2 py-1 text-xs">
                  {activeCategory?.name}
                  <button onClick={() => setSelectedCategory('')} className="hover:text-white transition-colors"><X size={11} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 badge-gold pl-3 pr-2 py-1 text-xs">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} className="hover:text-white transition-colors"><X size={11} /></button>
                </span>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                <span className="inline-flex items-center gap-1.5 badge-gold pl-3 pr-2 py-1 text-xs">
                  {activePriceLabel}
                  <button onClick={() => setPriceRange([0, 100000])} className="hover:text-white transition-colors"><X size={11} /></button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1.5 badge-gold pl-3 pr-2 py-1 text-xs">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')} className="hover:text-white transition-colors"><X size={11} /></button>
                </span>
              )}
              {fastDeliveryOnly && (
                <span className="inline-flex items-center gap-1.5 badge-gold pl-3 pr-2 py-1 text-xs">
                  Delivery under a day
                  <button onClick={() => setFastDeliveryOnly(false)} className="hover:text-white transition-colors"><X size={11} /></button>
                </span>
              )}
              <button
                onClick={() => { setSelectedCategory(''); setSearchQuery(''); setPriceRange([0, 100000]); setSelectedBrand('all'); setFastDeliveryOnly(false); }}
                className="text-xs text-silver-500 hover:text-silver-300 underline transition-colors px-1"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-dark-400 aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
              <p className="text-silver-500 mb-6">Try adjusting your filters or search query.</p>
              <button
                onClick={() => { setSelectedCategory(''); setSearchQuery(''); setPriceRange([0, 100000]); setSelectedBrand('all'); setFastDeliveryOnly(false); }}
                className="btn-outline-gold px-5 py-2.5 rounded-xl text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-gold-500 text-dark-700 shadow-lg flex items-center justify-center hover:bg-gold-400 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
