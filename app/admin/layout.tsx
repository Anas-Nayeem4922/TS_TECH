"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    MessageSquare,
    LogOut,
    ChevronRight,
    Shield,
    Menu,
    X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const NAV = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace("/login?redirect=/admin");
            return;
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className='min-h-screen bg-dark-700 flex items-center justify-center'>
                <div className='w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin' />
            </div>
        );
    }

    if (!user?.isAdmin) {
        return (
            <div className='min-h-screen bg-dark-700 flex flex-col items-center justify-center gap-4 text-center px-4'>
                <Shield size={48} className='text-red-400' />
                <h1 className='text-xl font-bold text-white'>Access Denied</h1>
                <p className='text-silver-400 max-w-sm'>
                    You don&apos;t have admin access. If you&apos;re the owner,
                    please set{" "}
                    <code className='text-gold-400'>isAdmin = true</code> for
                    your profile in the database.
                </p>
                <Link
                    href='/'
                    className='btn-outline-gold px-5 py-2.5 rounded-xl text-sm'
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    const Sidebar = () => (
        <div className='flex flex-col h-full'>
            {/* Logo */}
            <div className='flex items-center gap-3 p-5 border-b border-white/5'>
                <div className='relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gold-500/30'>
                    <Image
                        src='/images/WhatsApp_Image_2026-07-12_at_14.52.06 copy copy.jpeg'
                        alt='TS Technology'
                        fill
                        className='object-cover'
                    />
                </div>
                <div>
                    <div className='text-xs font-bold text-gold-400 leading-none'>
                        TS TECHNOLOGY
                    </div>
                    <div className='text-[9px] text-silver-600 mt-0.5'>
                        Admin Panel
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className='flex-1 p-3 space-y-0.5'>
                {NAV.map(({ href, icon: Icon, label, exact }) => {
                    const active =
                        exact ?
                            pathname === href
                        :   pathname.startsWith(href) &&
                            !(
                                exact === undefined &&
                                href === "/admin" &&
                                pathname !== "/admin"
                            );
                    const isActive =
                        exact ? pathname === href : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                isActive ?
                                    "bg-gold-500/15 text-gold-400 border border-gold-500/20"
                                :   "text-silver-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Icon size={16} />
                            {label}
                            {isActive && (
                                <ChevronRight size={13} className='ml-auto' />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Signout */}
            <div className='p-3 border-t border-white/5'>
                <div className='px-3 py-2 mb-1'>
                    <div className='text-xs text-silver-400 truncate'>
                        {user?.email}
                    </div>
                    <div className='text-[10px] text-gold-500 font-medium mt-0.5'>
                        Administrator
                    </div>
                </div>
                <button
                    onClick={async () => {
                        await signOut();
                        router.replace("/");
                    }}
                    className='flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-silver-500 hover:text-red-400 hover:bg-white/5 transition-all'
                >
                    <LogOut size={14} />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className='min-h-screen bg-dark-700 flex'>
            {/* Desktop Sidebar */}
            <aside className='hidden lg:flex flex-col w-56 bg-dark-500 border-r border-white/5 fixed top-0 left-0 bottom-0 z-30'>
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className='fixed inset-0 bg-black/60 z-40 lg:hidden'
                    />
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.25 }}
                        className='fixed top-0 left-0 bottom-0 w-56 bg-dark-500 border-r border-white/5 z-50 lg:hidden flex flex-col'
                    >
                        <Sidebar />
                    </motion.aside>
                </>
            )}

            {/* Main */}
            <div className='flex-1 lg:ml-56 flex flex-col min-h-screen'>
                {/* Top Bar */}
                <header className='sticky top-0 z-20 bg-dark-600/95 backdrop-blur border-b border-white/5 h-14 flex items-center justify-between px-4 sm:px-6'>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={() => setSidebarOpen((p) => !p)}
                            className='lg:hidden p-2 text-silver-400 hover:text-white transition-colors'
                        >
                            {sidebarOpen ?
                                <X size={18} />
                            :   <Menu size={18} />}
                        </button>
                        <div className='hidden sm:flex items-center gap-2 text-sm text-silver-500'>
                            <Link
                                href='/'
                                className='hover:text-gold-400 transition-colors'
                            >
                                Site
                            </Link>
                            <ChevronRight size={12} />
                            <span className='text-white capitalize'>
                                {pathname
                                    .split("/")
                                    .filter(Boolean)
                                    .slice(1)
                                    .join(" / ") || "Dashboard"}
                            </span>
                        </div>
                    </div>
                    <Link
                        href='/'
                        target='_blank'
                        className='text-xs text-silver-500 hover:text-gold-400 transition-colors'
                    >
                        View Site →
                    </Link>
                </header>

                {/* Page Content */}
                <main className='flex-1 p-4 sm:p-6 overflow-auto'>
                    {children}
                </main>
            </div>
        </div>
    );
}
