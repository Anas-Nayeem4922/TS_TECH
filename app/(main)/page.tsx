"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
    ShoppingBag,
    ArrowRight,
    Shield,
    Zap,
    Star,
    Phone,
    Truck,
    ChevronRight,
    PiggyBank,
    ShieldCheck,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product, Category } from "@/lib/database.types";

function AnimatedSection({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [dailyDeals, setDailyDeals] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        async function load() {
            const [featuredRes, catsRes, dealsRes] = await Promise.all([
                fetch("/api/products?featured=true&limit=8", {
                    cache: "no-store",
                }),
                fetch("/api/categories", { cache: "no-store" }),
                fetch("/api/products?daily_deal=true&limit=10", {
                    cache: "no-store",
                }),
            ]);
            const [featured, cats, deals] = await Promise.all([
                featuredRes.json(),
                catsRes.json(),
                dealsRes.json(),
            ]);
            setFeaturedProducts(featured.products ?? []);
            setCategories(cats.categories ?? []);
            setDailyDeals(deals.products ?? []);
            setLoadingProducts(false);
        }
        load();
    }, []);

    return (
        <div className='overflow-x-hidden'>
            {/* HERO */}
            <section className='relative min-h-screen flex items-center pt-28'>
                <div className='hero-glow pointer-events-none' />
                <div
                    className='absolute inset-0 opacity-20 pointer-events-none'
                    style={{
                        backgroundImage: `linear-gradient(rgba(201,168,76,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.08) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />

                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full'>
                    <div className='grid lg:grid-cols-2 gap-12 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium mb-6'
                            >
                                <span className='w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse' />
                                Kolkata&apos;s Premier Tech Destination
                            </motion.div>

                            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6'>
                                <span className='text-white'>
                                    Power Your Passion
                                </span>
                                <br />
                                <span className='gold-text'>
                                    Protect. Upgrade. Enjoy.
                                </span>
                            </h1>

                            <p className='text-silver-400 text-lg leading-relaxed mb-8 max-w-md'>
                                Explore a collection of premium accessories that
                                make every device smarter, safer, and more
                                stylish.
                            </p>

                            <div className='flex flex-wrap gap-4'>
                                <Link
                                    href='/products'
                                    className='btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm'
                                >
                                    <ShoppingBag size={16} />
                                    Shop Now
                                </Link>
                                <Link
                                    href='/contact'
                                    className='btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm'
                                >
                                    Contact Us
                                    <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className='flex gap-8 mt-10'>
                                {[
                                    { value: "100+", label: "Products" },
                                    { value: "100+", label: "Customers" },
                                    { value: "4.8★", label: "Rating" },
                                ].map((s) => (
                                    <div key={s.label}>
                                        <div className='text-xl font-bold gold-text'>
                                            {s.value}
                                        </div>
                                        <div className='text-xs text-silver-500'>
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                                ease: "easeOut",
                            }}
                            className='relative flex items-center justify-center'
                        >
                            <div className='relative'>
                                <div className='absolute inset-0 rounded-full blur-3xl bg-gold-500/20 scale-110' />
                                <div className='relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden ring-1 ring-gold-500/20 shadow-gold-lg animate-float'>
                                    <Image
                                        src='/images/WhatsApp_Image_2026-07-12_at_14.52.06 copy copy.jpeg'
                                        alt='TS Technology'
                                        fill
                                        className='object-cover'
                                        priority
                                    />
                                </div>

                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut",
                                    }}
                                    className='absolute -left-8 top-1/4 bg-dark-500 border border-gold-500/20 rounded-xl px-3 py-2 shadow-card hidden sm:block'
                                >
                                    <div className='flex items-center gap-2'>
                                        <Shield
                                            size={14}
                                            className='text-gold-500'
                                        />
                                        <span className='text-xs font-semibold text-white'>
                                            Military-Grade
                                        </span>
                                    </div>
                                    <div className='text-[10px] text-silver-500'>
                                        Protection
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 6, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3.5,
                                        ease: "easeInOut",
                                        delay: 0.5,
                                    }}
                                    className='absolute -right-8 bottom-1/4 bg-dark-500 border border-gold-500/20 rounded-xl px-3 py-2 shadow-card hidden sm:block'
                                >
                                    <div className='flex items-center gap-2'>
                                        <Zap
                                            size={14}
                                            className='text-gold-500'
                                        />
                                        <span className='text-xs font-semibold text-white'>
                                            Fast Delivery
                                        </span>
                                    </div>
                                    <div className='text-[10px] text-silver-500'>
                                        Same-day available
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Daily Deals Banner is now above the navbar */}

            <div className='section-divider' />

            {/* CATEGORIES */}
            <section className='py-20'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                    <AnimatedSection className='text-center mb-12'>
                        <div className='badge-gold inline-block mb-3'>
                            Browse Categories
                        </div>
                        <h2 className='text-3xl font-bold text-white'>
                            Shop by Category
                        </h2>
                        <p className='text-silver-500 mt-2'>
                            Find exactly what you&apos;re looking for
                        </p>
                    </AnimatedSection>

                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {categories.map((cat) => (
                            <AnimatedSection key={cat.id}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        href={`/products?category=${cat.slug}`}
                                        className='block group'
                                    >
                                        <div className='relative overflow-hidden rounded-2xl aspect-[4/3] card-surface border border-white/6 hover:border-gold-500/25 transition-all duration-300'>
                                            {cat.imageUrl && (
                                                <img
                                                    src={cat.imageUrl}
                                                    alt={cat.name}
                                                    className='w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-500 group-hover:scale-110'
                                                />
                                            )}
                                            <div className='absolute inset-0 bg-gradient-to-t from-dark-800/90 via-dark-800/40 to-transparent' />
                                            <div className='absolute bottom-0 left-0 right-0 p-4'>
                                                <div className='text-sm font-semibold text-white group-hover:text-gold-400 transition-colors'>
                                                    {cat.name}
                                                </div>
                                                <div className='flex items-center gap-1 mt-0.5'>
                                                    <span className='text-xs text-silver-500'>
                                                        Shop
                                                    </span>
                                                    <ChevronRight
                                                        size={10}
                                                        className='text-silver-500 group-hover:text-gold-500 transition-all group-hover:translate-x-0.5'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className='py-20 bg-dark-600/30'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                    <AnimatedSection className='flex items-center justify-between mb-12'>
                        <div>
                            <div className='badge-gold inline-block mb-3'>
                                Handpicked for You
                            </div>
                            <h2 className='text-3xl font-bold text-white'>
                                Featured Products
                            </h2>
                            <p className='text-silver-500 mt-1'>
                                Our best-selling tech accessories
                            </p>
                        </div>
                        <Link
                            href='/products'
                            className='btn-outline-gold hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm'
                        >
                            View All <ArrowRight size={14} />
                        </Link>
                    </AnimatedSection>

                    {loadingProducts ?
                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className='rounded-2xl bg-dark-400 aspect-square animate-pulse'
                                />
                            ))}
                        </div>
                    :   <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                            {featuredProducts.map((product, i) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={i}
                                />
                            ))}
                        </div>
                    }

                    <div className='text-center mt-8 sm:hidden'>
                        <Link
                            href='/products'
                            className='btn-outline-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm'
                        >
                            View All Products <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* WHY US */}
            <section className='py-20'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                    <AnimatedSection className='text-center mb-12'>
                        <div className='badge-gold inline-block mb-3'>
                            Why Choose Us
                        </div>
                        <h2 className='text-3xl font-bold text-white'>
                            The TS Technology Difference
                        </h2>
                    </AnimatedSection>

                    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[
                            {
                                icon: PiggyBank,
                                title: "Genuine Pricing",
                                desc: "Premium products without the premium markup. Our optimized sourcing enables savings of up to 20% compared to the industry standard, delivering exceptional value on every purchase.",
                            },
                            {
                                icon: ShieldCheck,
                                title: "Uncompromised Quality",
                                desc: "Every product is sourced from trusted manufacturers and rigorously quality-checked to ensure the reliability, durability, and performance you deserve.",
                            },
                            {
                                icon: Truck,
                                title: "On-Time Delivery",
                                desc: "Fast processing, secure packaging, and trusted logistics partners ensure your orders arrive safely, on time, and with real-time tracking every step of the way.",
                            },
                        ].map((item) => (
                            <AnimatedSection key={item.title}>
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className='card-surface rounded-2xl p-6 gold-border-hover border border-white/6'
                                >
                                    <div className='w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4'>
                                        <item.icon
                                            size={18}
                                            className='text-gold-400'
                                        />
                                    </div>
                                    <h3 className='font-semibold text-white mb-2'>
                                        {item.title}
                                    </h3>
                                    <p className='text-sm text-silver-500 leading-relaxed'>
                                        {item.desc}
                                    </p>
                                </motion.div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className='py-20 bg-dark-600/30'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                    <AnimatedSection className='text-center mb-12'>
                        <div className='badge-gold inline-block mb-3'>
                            Testimonials
                        </div>
                        <h2 className='text-3xl font-bold text-white'>
                            What Customers Say
                        </h2>
                    </AnimatedSection>

                    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[
                            {
                                name: "Arjun Sharma",
                                location: "Salt Lake, Kolkata",
                                review: "Bought a phone case and power bank from TS Technology. Excellent quality and fast delivery. Highly recommended!",
                                rating: 5,
                            },
                            {
                                name: "Priya Banerjee",
                                location: "Park Street, Kolkata",
                                review: "The GaN charger charges my laptop and phone together. Amazing product at a great price. Will definitely buy again.",
                                rating: 5,
                            },
                            {
                                name: "Rahul Das",
                                location: "Howrah",
                                review: "Great customer service! They helped me find the right earphones within my budget. The sound quality is excellent.",
                                rating: 5,
                            },
                        ].map((t) => (
                            <AnimatedSection key={t.name}>
                                <div className='card-surface rounded-2xl p-6 border border-white/6'>
                                    <div className='flex gap-1 mb-3'>
                                        {Array.from({ length: t.rating }).map(
                                            (_, j) => (
                                                <Star
                                                    key={j}
                                                    size={13}
                                                    className='fill-gold-400 text-gold-400'
                                                />
                                            ),
                                        )}
                                    </div>
                                    <p className='text-sm text-silver-300 leading-relaxed mb-4'>
                                        &ldquo;{t.review}&rdquo;
                                    </p>
                                    <div>
                                        <div className='text-sm font-semibold text-white'>
                                            {t.name}
                                        </div>
                                        <div className='text-xs text-silver-600'>
                                            {t.location}
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className='py-24'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 text-center'>
                    <AnimatedSection>
                        <div className='relative rounded-3xl overflow-hidden'>
                            <div className='absolute inset-0 bg-gradient-to-br from-gold-700/20 via-dark-700 to-dark-700' />
                            <div className='absolute inset-0 border border-gold-500/15 rounded-3xl' />
                            <div className='relative px-8 py-14'>
                                <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
                                    Where Quality Meets Affordability.
                                </h2>
                                <p className='text-silver-400 mb-8 max-w-lg mx-auto'>
                                    Why pay more elsewhere? Get premium
                                    products, competitive pricing, and
                                    hassle-free delivery—all in one place.
                                </p>
                                <div className='flex flex-wrap gap-4 justify-center'>
                                    <Link
                                        href='/products'
                                        className='btn-gold inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold'
                                    >
                                        <ShoppingBag size={16} /> Shop Now
                                    </Link>
                                    <a
                                        href='tel:8240761985'
                                        className='btn-outline-gold inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold'
                                    >
                                        <Phone size={16} /> Call Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
