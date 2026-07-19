'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Product, Category } from '@/lib/database.types';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<(Product & { categories: Category | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products', { cache: 'no-store' });
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleActive = async (product: Product) => {
    const res = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id, data: { isActive: !product.isActive } }),
      cache: 'no-store',
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => p.id === product.id ? { ...p, isActive: !product.isActive } : p)
      );
      toast.success(`Product ${!product.isActive ? 'activated' : 'deactivated'}`);
    }
  };

  const deleteProduct = async (id: string) => {
    setDeletingId(id);
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE', cache: 'no-store' });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } else {
      toast.error('Failed to delete product');
    }
    setDeletingId(null);
    setConfirmDelete(null);
  };

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (p.brand ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-silver-500 text-sm">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600 pointer-events-none" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full input-dark pl-9 pr-4 py-2.5 rounded-xl text-sm"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-dark-400 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package size={40} className="text-dark-50 mx-auto mb-3" />
          <p className="text-silver-500">No products found.</p>
          <Link href="/admin/products/new" className="btn-gold inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold mt-4">
            <Plus size={14} /> Add First Product
          </Link>
        </div>
      ) : (
        <div className="card-surface rounded-2xl border border-white/5 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-white/5 text-xs text-silver-500 font-semibold uppercase tracking-wider">
            <span>Product</span>
            <span>Category</span>
            <span>Price / Stock</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.map((product, i) => {
              const images = product.images as string[];
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-4 items-center hover:bg-white/3 transition-colors"
                >
                  {/* Product info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0">
                      {images?.[0] ? (
                        <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={16} className="text-dark-50" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{product.name}</div>
                      <div className="text-xs text-silver-500 flex items-center gap-1.5">
                        {product.brand && <span className="text-gold-500">{product.brand}</span>}
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        {product.isActive ? 'Active' : 'Hidden'}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-sm text-silver-400 truncate">
                    {(product as any).categories?.name ?? '—'}
                  </div>

                  {/* Price / Stock */}
                  <div>
                    <div className="text-sm font-semibold text-gold-400">₹{product.price.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-silver-500">Stock: {product.stockQuantity}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Toggle active */}
                    <button
                      onClick={() => toggleActive(product)}
                      className={`p-1.5 rounded-lg transition-colors ${product.isActive ? 'text-green-400 hover:bg-green-400/10' : 'text-silver-600 hover:bg-white/5'}`}
                      title={product.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {product.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>

                    {/* Edit */}
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-1.5 rounded-lg text-silver-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Link>

                    {/* Delete */}
                    {confirmDelete === product.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={deletingId === product.id}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50"
                        >
                          {deletingId === product.id ? '...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 text-xs text-silver-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(product.id)}
                        className="p-1.5 rounded-lg text-silver-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
