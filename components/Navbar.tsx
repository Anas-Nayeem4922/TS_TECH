"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    Search,
    User,
    Menu,
    X,
    ChevronDown,
    Settings,
    Sun,
    Moon,
    Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
interface SearchResult {
    id: string;
    name: string;
    slug: string;
    price: number;
    brand: string | null;
    images: string[];
    categories: { slug: string; name: string }[] | null;
}

const LOGO = "/images/WhatsApp_Image_2026-07-12_at_14.52.06 copy copy.jpeg";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const MOBILE_NAV_LINKS = [
    ...NAV_LINKS,
    { label: "Wishlist", href: "/wishlist" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { count } = useCart();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setSearching(true);
            const res = await fetch(
                `/api/products?q=${encodeURIComponent(searchQuery)}&limit=6`,
                { cache: "no-store" },
            );
            const data = await res.json();
            setSearchResults(data.products ?? []);
            setSearching(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setIsAdmin((user as any)?.isAdmin ?? false);
    }, [user]);

    useEffect(() => {
        if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
    }, [searchOpen]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setSearchOpen(false);
                setSearchQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled ?
                        theme === "dark" ?
                            "bg-dark-700/95 backdrop-blur-md border-b border-white/5 shadow-lg"
                        :   "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
                    :   "bg-transparent"
                }`}
            >
                <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                    <div className='flex items-center justify-between h-16 md:h-18'>
                        {/* Logo */}
                        <Link
                            href='/'
                            className='flex items-center gap-3 flex-shrink-0'
                        >
                            <div className='relative w-10 h-10 rounded-lg overflow-hidden ring-1 ring-gold-500/30'>
                                <Image
                                    src={LOGO}
                                    alt='TS Tech Canopy'
                                    fill
                                    className='object-cover'
                                />
                            </div>
                            <div className='hidden sm:block'>
                                <div className='text-sm font-700 leading-none shimmer-text'>
                                    TS TECH CANOPY
                                </div>
                                <div
                                    className={`text-[9px] tracking-widest leading-none mt-0.5 ${theme === "dark" ? "text-silver-500" : "text-gray-500"}`}
                                >
                                    STRENGTH. STYLE. PROTECTION.
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className='hidden md:flex items-center gap-8'>
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`nav-link text-sm font-500 ${pathname === link.href ? "active" : ""}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className='flex items-center gap-2 md:gap-3'>
                            {/* Search */}
                            <div ref={searchRef} className='relative'>
                                <button
                                    onClick={() => {
                                        setSearchOpen((p) => !p);
                                        setSearchQuery("");
                                    }}
                                    className={`p-2 transition-colors rounded-lg ${theme === "dark" ? "text-silver-400 hover:text-gold-500 hover:bg-white/5" : "text-gray-500 hover:text-gold-600 hover:bg-gray-100"}`}
                                    aria-label='Search'
                                >
                                    <Search size={18} />
                                </button>

                                <AnimatePresence>
                                    {searchOpen && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -8,
                                                scale: 0.96,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -8,
                                                scale: 0.96,
                                            }}
                                            transition={{ duration: 0.15 }}
                                            className={`fixed left-4 right-4 top-24 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:w-80 rounded-xl shadow-2xl overflow-hidden z-50 ${
                                                theme === "dark" ?
                                                    "bg-dark-500 border border-white/10"
                                                :   "bg-white border border-gray-200"
                                            }`}
                                        >
                                            <div
                                                className={`flex items-center gap-2 p-3 border-b ${theme === "dark" ? "border-white/5" : "border-gray-100"}`}
                                            >
                                                <Search
                                                    size={14}
                                                    className={
                                                        theme === "dark" ?
                                                            "text-silver-500"
                                                        :   "text-gray-400"
                                                    }
                                                />
                                                <input
                                                    ref={searchInputRef}
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Enter" &&
                                                            searchQuery.trim()
                                                        ) {
                                                            router.push(
                                                                `/products?q=${encodeURIComponent(searchQuery)}`,
                                                            );
                                                            setSearchOpen(
                                                                false,
                                                            );
                                                            setSearchQuery("");
                                                        }
                                                    }}
                                                    placeholder='Search by name, brand...'
                                                    className={`flex-1 bg-transparent text-sm outline-none ${theme === "dark" ? "text-white placeholder-silver-600" : "text-gray-900 placeholder-gray-400"}`}
                                                />
                                                {searchQuery && (
                                                    <button
                                                        onClick={() =>
                                                            setSearchQuery("")
                                                        }
                                                        className={
                                                            theme === "dark" ?
                                                                "text-silver-600 hover:text-silver-400"
                                                            :   "text-gray-400 hover:text-gray-600"
                                                        }
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                )}
                                            </div>

                                            {searching && (
                                                <div
                                                    className={`p-4 text-center text-sm ${theme === "dark" ? "text-silver-500" : "text-gray-500"}`}
                                                >
                                                    Searching...
                                                </div>
                                            )}

                                            {!searching &&
                                                searchResults.length > 0 && (
                                                    <div className='max-h-72 overflow-y-auto'>
                                                        {searchResults.map(
                                                            (p) => {
                                                                const cat = (
                                                                    p as any
                                                                )
                                                                    .categories?.[0];
                                                                return (
                                                                    <Link
                                                                        key={
                                                                            p.id
                                                                        }
                                                                        href={`/products/${p.slug}`}
                                                                        onClick={() => {
                                                                            setSearchOpen(
                                                                                false,
                                                                            );
                                                                            setSearchQuery(
                                                                                "",
                                                                            );
                                                                        }}
                                                                        className={`flex items-center gap-3 px-4 py-3 transition-colors border-b last:border-0 ${
                                                                            (
                                                                                theme ===
                                                                                "dark"
                                                                            ) ?
                                                                                "hover:bg-white/5 border-white/5"
                                                                            :   "hover:bg-gray-50 border-gray-100"
                                                                        }`}
                                                                    >
                                                                        <div
                                                                            className={`w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ${theme === "dark" ? "bg-dark-300" : "bg-gray-100"}`}
                                                                        >
                                                                            {p
                                                                                .images?.[0] && (
                                                                                <img
                                                                                    src={
                                                                                        p
                                                                                            .images[0] as string
                                                                                    }
                                                                                    alt={
                                                                                        p.name
                                                                                    }
                                                                                    className='w-full h-full object-cover'
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        <div className='flex-1 min-w-0'>
                                                                            <div
                                                                                className={`text-sm truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                                                                            >
                                                                                {
                                                                                    p.name
                                                                                }
                                                                            </div>
                                                                            <div className='text-xs text-silver-500 flex items-center gap-1'>
                                                                                {p.brand && (
                                                                                    <span>
                                                                                        {
                                                                                            p.brand
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                                {p.brand &&
                                                                                    cat?.name && (
                                                                                        <span>
                                                                                            ·
                                                                                        </span>
                                                                                    )}
                                                                                {cat?.name && (
                                                                                    <span>
                                                                                        {
                                                                                            cat.name
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className='text-xs text-gold-500 font-semibold'>
                                                                            ₹
                                                                            {p.price.toLocaleString(
                                                                                "en-IN",
                                                                            )}
                                                                        </div>
                                                                    </Link>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                )}

                                            {!searching &&
                                                searchQuery &&
                                                searchResults.length === 0 && (
                                                    <div
                                                        className={`p-4 text-center text-sm ${theme === "dark" ? "text-silver-500" : "text-gray-500"}`}
                                                    >
                                                        No products found
                                                    </div>
                                                )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Wishlist */}
                            <Link
                                href='/wishlist'
                                className={`relative p-2 transition-colors rounded-lg ${theme === "dark" ? "text-silver-400 hover:text-gold-500 hover:bg-white/5" : "text-gray-500 hover:text-gold-600 hover:bg-gray-100"}`}
                                aria-label='Wishlist'
                            >
                                <Heart size={18} />
                            </Link>

                            {/* Cart */}
                            <Link
                                href='/cart'
                                className={`relative p-2 transition-colors rounded-lg ${theme === "dark" ? "text-silver-400 hover:text-gold-500 hover:bg-white/5" : "text-gray-500 hover:text-gold-600 hover:bg-gray-100"}`}
                                aria-label='Cart'
                            >
                                <ShoppingCart size={18} />
                                {count > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className='absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-dark-700 text-[9px] font-700 rounded-full flex items-center justify-center'
                                    >
                                        {count > 9 ? "9+" : count}
                                    </motion.span>
                                )}
                            </Link>

                            {/* Account */}
                            <Link
                                href={user ? "/account" : "/login"}
                                className={`p-2 transition-colors rounded-lg ${theme === "dark" ? "text-silver-400 hover:text-gold-500 hover:bg-white/5" : "text-gray-500 hover:text-gold-600 hover:bg-gray-100"}`}
                                aria-label='Account'
                            >
                                <User size={18} />
                            </Link>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`p-2 transition-colors rounded-lg ${theme === "dark" ? "text-silver-400 hover:text-gold-500 hover:bg-white/5" : "text-gray-500 hover:text-gold-600 hover:bg-gray-100"}`}
                                aria-label={
                                    theme === "dark" ?
                                        "Switch to light mode"
                                    :   "Switch to dark mode"
                                }
                            >
                                {theme === "dark" ?
                                    <Sun size={18} />
                                :   <Moon size={18} />}
                            </button>

                            {/* Admin Panel */}
                            {isAdmin && (
                                <Link
                                    href='/admin'
                                    className='p-2 text-gold-500 hover:text-gold-400 transition-colors rounded-lg hover:bg-gold-500/10'
                                    aria-label='Admin Panel'
                                >
                                    <Settings size={18} />
                                </Link>
                            )}

                            {/* Mobile Menu */}
                            <button
                                onClick={() => setMobileOpen((p) => !p)}
                                className={`md:hidden p-2 transition-colors rounded-lg ${theme === "dark" ? "text-silver-400 hover:text-gold-500 hover:bg-white/5" : "text-gray-500 hover:text-gold-600 hover:bg-gray-100"}`}
                                aria-label='Menu'
                            >
                                {mobileOpen ?
                                    <X size={18} />
                                :   <Menu size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`fixed top-24 left-0 right-0 z-40 backdrop-blur-lg border-b overflow-hidden ${
                            theme === "dark" ?
                                "bg-dark-600/98 border-white/5"
                            :   "bg-white/98 border-gray-200"
                        }`}
                    >
                        <div className='px-4 py-4 space-y-1'>
                            {MOBILE_NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block px-4 py-3 rounded-lg text-sm font-500 transition-colors ${
                                        pathname === link.href ?
                                            "text-gold-500 bg-gold-500/10"
                                        : theme === "dark" ?
                                            "text-silver-300 hover:text-white hover:bg-white/5"
                                        :   "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div
                                className={`h-px my-2 ${theme === "dark" ? "bg-white/5" : "bg-gray-200"}`}
                            />
                            <Link
                                href={user ? "/account" : "/login"}
                                className={`block px-4 py-3 rounded-lg text-sm font-500 transition-colors ${
                                    theme === "dark" ?
                                        "text-silver-300 hover:text-white hover:bg-white/5"
                                    :   "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                {user ? "My Account" : "Login / Sign Up"}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
