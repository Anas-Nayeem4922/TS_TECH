"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Search,
    Phone,
    Mail,
    Clock,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Trash2,
    X,
} from "lucide-react";
import { toast } from "sonner";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<ContactMessage | null>(
        null,
    );
    const [deleting, setDeleting] = useState(false);

    const fetchMessages = async () => {
        const res = await fetch("/api/admin/messages", { cache: "no-store" });
        const data = await res.json();
        setMessages(data.messages ?? []);
    };

    useEffect(() => {
        fetchMessages().then(() => setLoading(false));
    }, []);

    const refresh = async () => {
        setRefreshing(true);
        await fetchMessages();
        setRefreshing(false);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        const res = await fetch(`/api/admin/messages?id=${deleteConfirm.id}`, {
            method: "DELETE",
            cache: "no-store",
        });
        setDeleting(false);
        if (!res.ok) {
            toast.error("Failed to delete message");
        } else {
            setMessages((prev) =>
                prev.filter((m) => m.id !== deleteConfirm.id),
            );
            toast.success("Message deleted");
            setDeleteConfirm(null);
        }
    };

    const filtered = messages.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.subject ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

    return (
        <div className='space-y-5'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-white'>
                        Contact Messages
                    </h1>
                    <p className='text-silver-500 text-sm'>
                        {messages.length} total submissions
                    </p>
                </div>
                <button
                    onClick={refresh}
                    disabled={refreshing}
                    className='btn-outline-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm'
                >
                    <RefreshCw
                        size={14}
                        className={refreshing ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className='relative max-w-sm'>
                <Search
                    size={14}
                    className='absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600 pointer-events-none'
                />
                <input
                    type='text'
                    placeholder='Search messages...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full input-dark pl-9 pr-4 py-2.5 rounded-xl text-sm'
                />
            </div>

            {/* Messages */}
            {loading ?
                <div className='space-y-3'>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className='h-20 rounded-2xl bg-dark-400 animate-pulse'
                        />
                    ))}
                </div>
            : filtered.length === 0 ?
                <div className='text-center py-20'>
                    <MessageSquare
                        size={40}
                        className='text-dark-50 mx-auto mb-3'
                    />
                    <p className='text-silver-500'>
                        {searchQuery ?
                            "No messages match your search."
                        :   "No messages yet. Contact form submissions will appear here."
                        }
                    </p>
                </div>
            :   <div className='space-y-3'>
                    {filtered.map((msg, i) => {
                        const isExpanded = expandedId === msg.id;
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className='card-surface rounded-2xl border border-white/5 overflow-hidden'
                            >
                                {/* Message Header */}
                                <div className='flex items-start'>
                                    <button
                                        onClick={() =>
                                            setExpandedId(
                                                isExpanded ? null : msg.id,
                                            )
                                        }
                                        className='flex-1 text-left p-4 flex items-start gap-4 hover:bg-white/3 transition-colors'
                                    >
                                        {/* Avatar */}
                                        <div className='w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold-400'>
                                            {msg.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-start justify-between gap-2'>
                                                <div>
                                                    <div className='text-sm font-semibold text-white'>
                                                        {msg.name}
                                                    </div>
                                                    <div className='flex items-center gap-3 mt-0.5'>
                                                        <span className='text-xs text-silver-500 flex items-center gap-1'>
                                                            <Mail size={10} />{" "}
                                                            {msg.email}
                                                        </span>
                                                        {msg.phone && (
                                                            <span className='text-xs text-silver-500 flex items-center gap-1'>
                                                                <Phone
                                                                    size={10}
                                                                />{" "}
                                                                {msg.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-2 flex-shrink-0'>
                                                    <span className='text-xs text-silver-600 flex items-center gap-1'>
                                                        <Clock size={10} />{" "}
                                                        {formatDate(
                                                            msg.createdAt,
                                                        )}
                                                    </span>
                                                    {isExpanded ?
                                                        <ChevronUp
                                                            size={14}
                                                            className='text-silver-400'
                                                        />
                                                    :   <ChevronDown
                                                            size={14}
                                                            className='text-silver-400'
                                                        />
                                                    }
                                                </div>
                                            </div>

                                            {msg.subject && (
                                                <div className='text-xs text-gold-500 mt-1 font-medium'>
                                                    {msg.subject}
                                                </div>
                                            )}

                                            {!isExpanded && (
                                                <p className='text-xs text-silver-500 mt-1.5 line-clamp-1'>
                                                    {msg.message}
                                                </p>
                                            )}
                                        </div>
                                    </button>

                                    {/* Delete button */}
                                    <button
                                        onClick={() => setDeleteConfirm(msg)}
                                        className='p-3 text-silver-600 hover:text-red-400 transition-colors flex-shrink-0'
                                        aria-label='Delete message'
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>

                                {/* Expanded Message Body */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className='px-4 pb-4 pt-2 border-t border-white/5'
                                    >
                                        <div className='pl-14'>
                                            <p className='text-sm text-silver-300 leading-relaxed whitespace-pre-wrap'>
                                                {msg.message}
                                            </p>
                                            <div className='flex gap-3 mt-4'>
                                                <a
                                                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? "Your inquiry to TS Technology")}`}
                                                    className='btn-gold flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold'
                                                >
                                                    <Mail size={12} /> Reply via
                                                    Email
                                                </a>
                                                {msg.phone && (
                                                    <a
                                                        href={`tel:${msg.phone}`}
                                                        className='btn-outline-gold flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs'
                                                    >
                                                        <Phone size={12} /> Call{" "}
                                                        {msg.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            }

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDeleteConfirm(null)}
                        className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className='bg-dark-500 border border-white/10 rounded-2xl max-w-sm w-full p-6'
                        >
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='text-lg font-bold text-white'>
                                    Delete Message?
                                </h3>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className='p-1 text-silver-500 hover:text-white transition-colors'
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <p className='text-sm text-silver-400 mb-1'>
                                Are you sure you want to delete the message from{" "}
                                <span className='font-semibold text-white'>
                                    {deleteConfirm.name}
                                </span>
                                ?
                            </p>
                            <p className='text-xs text-silver-600 mb-6'>
                                This action cannot be undone.
                            </p>
                            <div className='flex gap-3'>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className='flex-1 btn-outline-gold py-2.5 rounded-xl text-sm font-semibold'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className='flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60'
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
