"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    CircleCheck as CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (
            !form.email.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        )
            e.email = "Valid email required";
        if (!form.message.trim()) e.message = "Message is required";
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    subject: form.subject.trim() || null,
                    message: form.message.trim(),
                }),
            });
            setSubmitting(false);
            if (!res.ok) {
                toast.error("Failed to send message. Please try again.");
            } else {
                setSubmitted(true);
                setForm({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
            }
        } catch {
            setSubmitting(false);
            toast.error("Failed to send message. Please try again.");
        }
    };

    return (
        <div className='min-h-screen pt-28 pb-16'>
            {/* Header */}
            <section className='relative py-16 overflow-hidden'>
                <div className='hero-glow' />
                <div className='max-w-4xl mx-auto px-4 sm:px-6 text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className='badge-gold inline-block mb-4'>
                            Get in Touch
                        </div>
                        <h1 className='text-4xl font-bold text-white mb-4'>
                            Contact <span className='gold-text'>Us</span>
                        </h1>
                        <p className='text-silver-400'>
                            Have a question? We&apos;d love to hear from you.
                            Send us a message and we&apos;ll get back to you as
                            soon as possible.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className='section-divider' />

            <div className='max-w-7xl mx-auto px-4 sm:px-6 py-16'>
                <div className='grid lg:grid-cols-5 gap-10'>
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className='lg:col-span-2 space-y-6'
                    >
                        <div>
                            <h2 className='text-xl font-bold text-white mb-4'>
                                Contact Information
                            </h2>
                            <div className='space-y-4'>
                                {[
                                    {
                                        icon: Phone,
                                        title: "Phone",
                                        value: "+91 8240761985",
                                        href: "tel:8240761985",
                                    },
                                    {
                                        icon: Mail,
                                        title: "Email",
                                        value: "ts.technology.ccu@gmail.com",
                                        href: "mailto:ts.technology.ccu@gmail.com",
                                    },
                                    {
                                        icon: MapPin,
                                        title: "Address",
                                        value: "Sealdah, Kolkata, West Bengal - 700009",
                                        href: null,
                                    },
                                    {
                                        icon: Clock,
                                        title: "Contact Within",
                                        value: "Mon-Sun: 11AM-8PM",
                                        href: null,
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className='flex gap-4 p-4 card-surface rounded-xl border border-white/5'
                                    >
                                        <div className='w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0'>
                                            <item.icon
                                                size={16}
                                                className='text-gold-400'
                                            />
                                        </div>
                                        <div>
                                            <div className='text-xs text-silver-500 mb-1'>
                                                {item.title}
                                            </div>
                                            {item.href ?
                                                <a
                                                    href={item.href}
                                                    className='text-sm text-white hover:text-gold-400 transition-colors whitespace-pre-line'
                                                >
                                                    {item.value}
                                                </a>
                                            :   <div className='text-sm text-white whitespace-pre-line'>
                                                    {item.value}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map */}
                        <div className='rounded-2xl overflow-hidden border border-white/5 h-64'>
                            <iframe
                                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.8553576066396!2d88.36843!3d22.582736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277c01d7fffff%3A0x9e7e7a30f61ad28!2sRajabazar%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1699900000000!5m2!1sen!2sin'
                                width='100%'
                                height='100%'
                                style={{ border: 0 }}
                                allowFullScreen
                                loading='lazy'
                                referrerPolicy='no-referrer-when-downgrade'
                            />
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className='lg:col-span-3'
                    >
                        {submitted ?
                            <div className='h-full flex flex-col items-center justify-center text-center py-16 card-surface rounded-2xl border border-white/5'>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                >
                                    <CheckCircle
                                        size={56}
                                        className='text-gold-400 mb-4 mx-auto'
                                    />
                                </motion.div>
                                <h2 className='text-xl font-bold text-white mb-2'>
                                    Message Sent!
                                </h2>
                                <p className='text-silver-400 mb-6'>
                                    Thank you for reaching out. We&apos;ll get
                                    back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className='btn-outline-gold px-5 py-2.5 rounded-xl text-sm'
                                >
                                    Send Another Message
                                </button>
                            </div>
                        :   <form
                                onSubmit={handleSubmit}
                                className='card-surface rounded-2xl border border-white/5 p-6 sm:p-8 space-y-5'
                            >
                                <h2 className='text-xl font-bold text-white'>
                                    Send a Message
                                </h2>

                                <div className='grid sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-xs text-silver-400 mb-1.5'>
                                            Full Name *
                                        </label>
                                        <input
                                            type='text'
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    name: e.target.value,
                                                }))
                                            }
                                            placeholder='Your name'
                                            className={`w-full input-dark px-4 py-3 rounded-xl text-sm ${errors.name ? "border-red-500/50" : ""}`}
                                        />
                                        {errors.name && (
                                            <p className='text-xs text-red-400 mt-1'>
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className='block text-xs text-silver-400 mb-1.5'>
                                            Email *
                                        </label>
                                        <input
                                            type='email'
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    email: e.target.value,
                                                }))
                                            }
                                            placeholder='you@example.com'
                                            className={`w-full input-dark px-4 py-3 rounded-xl text-sm ${errors.email ? "border-red-500/50" : ""}`}
                                        />
                                        {errors.email && (
                                            <p className='text-xs text-red-400 mt-1'>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className='grid sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-xs text-silver-400 mb-1.5'>
                                            Phone Number
                                        </label>
                                        <input
                                            type='tel'
                                            value={form.phone}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    phone: e.target.value,
                                                }))
                                            }
                                            placeholder='+91 XXXXX XXXXX'
                                            className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs text-silver-400 mb-1.5'>
                                            Subject
                                        </label>
                                        <input
                                            type='text'
                                            value={form.subject}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    subject: e.target.value,
                                                }))
                                            }
                                            placeholder='How can we help?'
                                            className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-xs text-silver-400 mb-1.5'>
                                        Message *
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                message: e.target.value,
                                            }))
                                        }
                                        placeholder='Tell us how we can help you...'
                                        className={`w-full input-dark px-4 py-3 rounded-xl text-sm resize-none ${errors.message ? "border-red-500/50" : ""}`}
                                    />
                                    {errors.message && (
                                        <p className='text-xs text-red-400 mt-1'>
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type='submit'
                                    disabled={submitting}
                                    className='w-full btn-gold flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold disabled:opacity-60'
                                >
                                    <Send size={15} />
                                    {submitting ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        }
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
