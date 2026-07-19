"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Instagram, Youtube } from "lucide-react";

const LOGO = "/images/WhatsApp_Image_2026-07-12_at_14.52.06 copy copy.jpeg";

const PRODUCT_LINKS = [
    { label: "Mobile Covers", href: "/products?category=mobile-covers" },
    { label: "Chargers", href: "/products?category=chargers" },
    { label: "Cables", href: "/products?category=cables" },
    { label: "Earphones", href: "/products?category=earphones" },
    {
        label: "Laptop Accessories",
        href: "/products?category=laptop-accessories",
    },
    { label: "Smartwatches", href: "/products?category=smartwatches" },
    { label: "Power Banks", href: "/products?category=power-banks" },
];

const POLICY_LINKS = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Return & Refund Policy", href: "/returns" },
    { label: "Shipping Policy", href: "/shipping" },
];

function WhatsAppIcon({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor'>
            <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z' />
        </svg>
    );
}

const SOCIAL_LINKS = [
    {
        icon: Instagram,
        href: "https://www.instagram.com/ts_tech_/",
        label: "Instagram",
    },
    {
        icon: Youtube,
        href: "https://www.youtube.com/@TS_Technology_CCU",
        label: "YouTube",
    },
    {
        icon: WhatsAppIcon,
        href: "https://whatsapp.com/channel/0029VbCrzOGDuMRjoQlPj00Q",
        label: "WhatsApp",
    },
];

export function Footer() {
    return (
        <footer className='bg-dark-800 border-t border-white/5'>
            {/* Trust Badges */}
            <div className='border-b border-white/5'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {[
                            {
                                icon: "🔒",
                                title: "Secure Payments",
                                desc: "SSL encrypted checkout",
                            },
                            {
                                icon: "🚚",
                                title: "Fast Delivery",
                                desc: "Ships within 24 hours",
                            },
                            {
                                icon: "↩️",
                                title: "Easy Returns",
                                desc: "7-day hassle-free returns",
                            },
                            {
                                icon: "🛡️",
                                title: "Warranty",
                                desc: "All products warranted",
                            },
                        ].map((b) => (
                            <div key={b.title} className='trust-badge'>
                                <span className='text-2xl'>{b.icon}</span>
                                <div>
                                    <div className='text-sm font-600 text-white'>
                                        {b.title}
                                    </div>
                                    <div className='text-xs text-silver-500'>
                                        {b.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {/* Brand */}
                    <div className='lg:col-span-1'>
                        <Link href='/' className='flex items-center gap-3 mb-4'>
                            <div className='relative w-10 h-10 rounded-lg overflow-hidden ring-1 ring-gold-500/30'>
                                <Image
                                    src={LOGO}
                                    alt='TS Technology'
                                    fill
                                    className='object-cover'
                                />
                            </div>
                            <div>
                                <div className='text-sm font-700 shimmer-text'>
                                    TS TECHNOLOGY
                                </div>
                                <div className='text-[9px] text-silver-500 tracking-widest'>
                                    STRENGTH. STYLE. PROTECTION.
                                </div>
                            </div>
                        </Link>
                        <p className='text-silver-500 text-sm leading-relaxed mb-4'>
                            Your one-stop destination for premium tech
                            accessories in Kolkata. Quality products,
                            competitive prices.
                        </p>
                        <div className='flex gap-3'>
                            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-silver-500 hover:text-gold-500 hover:border-gold-500/30 transition-all'
                                    aria-label={label}
                                >
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className='text-sm font-600 text-white mb-4'>
                            Products
                        </h3>
                        <ul className='space-y-2'>
                            {PRODUCT_LINKS.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className='text-sm text-silver-500 hover:text-gold-500 transition-colors'
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h3 className='text-sm font-600 text-white mb-4'>
                            Policies
                        </h3>
                        <ul className='space-y-2'>
                            {POLICY_LINKS.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className='text-sm text-silver-500 hover:text-gold-500 transition-colors'
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href='/about'
                                    className='text-sm text-silver-500 hover:text-gold-500 transition-colors'
                                >
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className='text-sm font-600 text-white mb-4'>
                            Contact Us
                        </h3>
                        <ul className='space-y-3'>
                            <li className='flex items-start gap-2'>
                                <Phone
                                    size={14}
                                    className='text-gold-500 mt-0.5 flex-shrink-0'
                                />
                                <a
                                    href='tel:8240761985'
                                    className='text-sm text-silver-400 hover:text-white transition-colors'
                                >
                                    +91 8240761985
                                </a>
                            </li>
                            <li className='flex items-start gap-2'>
                                <Mail
                                    size={14}
                                    className='text-gold-500 mt-0.5 flex-shrink-0'
                                />
                                <a
                                    href='mailto:ts.technology.ccu@gmail.com'
                                    className='text-sm text-silver-400 hover:text-white transition-colors break-all'
                                >
                                    ts.technology.ccu@gmail.com
                                </a>
                            </li>
                            <li className='flex items-start gap-2'>
                                <MapPin
                                    size={14}
                                    className='text-gold-500 mt-0.5 flex-shrink-0'
                                />
                                <span className='text-sm text-silver-400'>
                                    Sealdah, Kolkata, West Bengal, India
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='border-t border-white/5'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2'>
                    <p className='text-xs text-silver-600'>
                        &copy; {new Date().getFullYear()} TS Technology. All
                        rights reserved.
                    </p>
                    <p className='text-xs text-silver-700'>
                        Made with care in Kolkata
                    </p>
                </div>
            </div>
        </footer>
    );
}
