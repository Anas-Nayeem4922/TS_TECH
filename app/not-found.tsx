'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <h1 className="text-[120px] sm:text-[160px] font-bold leading-none gold-text">
            404
          </h1>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-32 h-32 rounded-full bg-gold-500/10 blur-3xl" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
          <p className="text-silver-500 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/" className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
              <Home size={16} /> Go Home <ArrowRight size={14} />
            </Link>
            <Link href="/products" className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
              <Search size={16} /> Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
