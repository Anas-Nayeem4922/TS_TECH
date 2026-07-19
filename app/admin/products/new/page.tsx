"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    X,
    Package,
    Save,
    Zap,
    Tag as TagIcon,
    Trash2,
} from "lucide-react";
import type { Category, ColorVariant } from "@/lib/database.types";
import { toast } from "sonner";

interface ProductForm {
    name: string;
    description: string;
    price: string;
    comparePrice: string;
    brand: string;
    model: string;
    categoryId: string;
    stockQuantity: string;
    warrantyInfo: string;
    isFeatured: boolean;
    isActive: boolean;
    images: string[];
    colorVariants: ColorVariant[];
    inTheBox: string[];
    fastDelivery: boolean;
    isDailyDeal: boolean;
    tags: string;
    specifications: string;
}

const EMPTY_FORM: ProductForm = {
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    brand: "",
    model: "",
    categoryId: "",
    stockQuantity: "0",
    warrantyInfo: "",
    isFeatured: false,
    isActive: true,
    images: [""],
    colorVariants: [],
    inTheBox: [],
    fastDelivery: false,
    isDailyDeal: false,
    tags: "",
    specifications: "",
};

function slugify(s: string) {
    return s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function Field({
    label,
    children,
    error,
    required,
}: {
    label: string;
    children: React.ReactNode;
    error?: string;
    required?: boolean;
}) {
    return (
        <div>
            <label className='block text-xs text-silver-400 mb-1.5'>
                {label} {required && <span className='text-red-400'>*</span>}
            </label>
            {children}
            {error && <p className='text-xs text-red-400 mt-1'>{error}</p>}
        </div>
    );
}

function Toggle({
    checked,
    onChange,
    label,
    desc,
    icon,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    desc: string;
    icon?: React.ReactNode;
}) {
    return (
        <label className='flex items-center gap-3 p-4 flex-1 card-surface rounded-xl border border-white/5 cursor-pointer hover:border-gold-500/20 transition-all select-none'>
            <div className='relative flex-shrink-0'>
                <input
                    type='checkbox'
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className='sr-only peer'
                />
                <div
                    className={`w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-gold-500" : "bg-gray-600"}`}
                >
                    <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 m-0.5 ${checked ? "translate-x-5" : "translate-x-0"}`}
                    />
                </div>
            </div>
            <div>
                <div className='text-sm font-medium text-white flex items-center gap-1.5'>
                    {icon}
                    {label}
                </div>
                <div className='text-xs text-silver-500'>{desc}</div>
            </div>
        </label>
    );
}

export default function NewProductPage() {
    const router = useRouter();
    const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
    const [categories, setCategories] = useState<Category[]>([]);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<
        Partial<Record<keyof ProductForm, string>>
    >({});
    const [boxItem, setBoxItem] = useState("");

    useEffect(() => {
        fetch("/api/categories", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => setCategories(data.categories ?? []));
    }, []);

    const set =
        (key: keyof ProductForm) =>
        (
            e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >,
        ) => {
            setForm((p) => ({ ...p, [key]: e.target.value }));
            setErrors((prev) => {
                const n = { ...prev };
                delete n[key];
                return n;
            });
        };

    const validate = () => {
        const e: Partial<Record<keyof ProductForm, string>> = {};
        if (!form.name.trim()) e.name = "Required";
        if (!form.price || isNaN(+form.price) || +form.price <= 0)
            e.price = "Valid price required";
        if (
            form.comparePrice &&
            (isNaN(+form.comparePrice) || +form.comparePrice <= +form.price)
        )
            e.comparePrice = "Must be greater than price";
        if (!form.stockQuantity || isNaN(+form.stockQuantity))
            e.stockQuantity = "Required";
        return e;
    };

    const addColorVariant = () => {
        setForm((p) => ({
            ...p,
            colorVariants: [...p.colorVariants, { color: "", images: [""] }],
        }));
    };

    const removeColorVariant = (idx: number) => {
        setForm((p) => ({
            ...p,
            colorVariants: p.colorVariants.filter((_, i) => i !== idx),
        }));
    };

    const updateVariantColor = (idx: number, color: string) => {
        setForm((p) => ({
            ...p,
            colorVariants: p.colorVariants.map((v, i) =>
                i === idx ? { ...v, color } : v,
            ),
        }));
    };

    const addVariantImage = (idx: number) => {
        setForm((p) => ({
            ...p,
            colorVariants: p.colorVariants.map((v, i) =>
                i === idx ? { ...v, images: [...v.images, ""] } : v,
            ),
        }));
    };

    const updateVariantImage = (vIdx: number, imgIdx: number, url: string) => {
        setForm((p) => ({
            ...p,
            colorVariants: p.colorVariants.map((v, i) =>
                i === vIdx ?
                    {
                        ...v,
                        images: v.images.map((img, j) =>
                            j === imgIdx ? url : img,
                        ),
                    }
                :   v,
            ),
        }));
    };

    const removeVariantImage = (vIdx: number, imgIdx: number) => {
        setForm((p) => ({
            ...p,
            colorVariants: p.colorVariants.map((v, i) =>
                i === vIdx ?
                    { ...v, images: v.images.filter((_, j) => j !== imgIdx) }
                :   v,
            ),
        }));
    };

    const addBoxItem = () => {
        if (!boxItem.trim()) return;
        setForm((p) => ({ ...p, inTheBox: [...p.inTheBox, boxItem.trim()] }));
        setBoxItem("");
    };

    const removeBoxItem = (idx: number) => {
        setForm((p) => ({
            ...p,
            inTheBox: p.inTheBox.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setSaving(true);

        let slug = slugify(form.name);
        const slugRes = await fetch(
            `/api/products/manage?slug_check=${encodeURIComponent(slug)}`,
            { cache: "no-store" },
        );
        const slugData = await slugRes.json();
        if (slugData.exists) slug = `${slug}-${Date.now()}`;

        let specs: Record<string, string> = {};
        try {
            if (form.specifications.trim())
                specs = JSON.parse(form.specifications);
        } catch {}

        const images = form.images.filter((img) => img.trim());
        const colorVariants = form.colorVariants
            .filter((v) => v.color.trim())
            .map((v) => ({
                color: v.color.trim(),
                images: v.images.filter((i) => i.trim()),
            }));

        const productData = {
            name: form.name.trim(),
            slug,
            description: form.description.trim() || null,
            price: +form.price,
            comparePrice: form.comparePrice ? +form.comparePrice : null,
            images: images.length ? images : [],
            categoryId: form.categoryId || null,
            brand: form.brand.trim() || null,
            model: form.model.trim() || null,
            colorVariants: colorVariants,
            inTheBox: form.inTheBox.length ? form.inTheBox : null,
            fastDelivery: form.fastDelivery,
            isDailyDeal: form.isDailyDeal,
            stockQuantity: +form.stockQuantity,
            isFeatured: form.isFeatured,
            isActive: form.isActive,
            tags:
                form.tags ?
                    form.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                :   null,
            warrantyInfo: form.warrantyInfo.trim() || null,
            specifications: specs,
        };

        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isAdmin: true, data: productData }),
            cache: "no-store",
        });

        setSaving(false);

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            toast.error(
                "Failed to save product: " + (errData.error || "Unknown error"),
            );
        } else {
            toast.success("Product created successfully!");
            router.push("/admin/products");
        }
    };

    return (
        <div className='max-w-3xl mx-auto'>
            <div className='flex items-center gap-3 mb-6'>
                <Link
                    href='/admin/products'
                    className='p-2 text-silver-400 hover:text-white transition-colors rounded-lg hover:bg-white/5'
                >
                    <ArrowLeft size={16} />
                </Link>
                <div>
                    <h1 className='text-2xl font-bold text-white'>
                        Add New Product
                    </h1>
                    <p className='text-silver-500 text-sm'>
                        Fill in the details below to list a new product.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Basic Info */}
                <div className='card-surface rounded-2xl border border-white/5 p-5 space-y-4'>
                    <h2 className='text-sm font-semibold text-white border-b border-white/5 pb-3'>
                        Basic Information
                    </h2>

                    <Field label='Product Name' error={errors.name} required>
                        <input
                            type='text'
                            value={form.name}
                            onChange={set("name")}
                            placeholder='e.g. ShockGuard Pro Case — iPhone 15'
                            className={`w-full input-dark px-4 py-3 rounded-xl text-sm ${errors.name ? "border-red-500/50" : ""}`}
                        />
                    </Field>

                    <Field label='Description'>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={set("description")}
                            placeholder='Product description, features, compatibility...'
                            className='w-full input-dark px-4 py-3 rounded-xl text-sm resize-none'
                        />
                    </Field>

                    <div className='grid sm:grid-cols-3 gap-4'>
                        <Field label='Category'>
                            <select
                                value={form.categoryId}
                                onChange={set("categoryId")}
                                className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                            >
                                <option value=''>No category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label='Brand'>
                            <input
                                type='text'
                                value={form.brand}
                                onChange={set("brand")}
                                placeholder='e.g. TS Shield'
                                className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                            />
                        </Field>
                        <Field label='Model'>
                            <input
                                type='text'
                                value={form.model}
                                onChange={set("model")}
                                placeholder='e.g. iPhone 15 Pro'
                                className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                            />
                        </Field>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className='card-surface rounded-2xl border border-white/5 p-5 space-y-4'>
                    <h2 className='text-sm font-semibold text-white border-b border-white/5 pb-3'>
                        Pricing & Stock
                    </h2>
                    <div className='grid sm:grid-cols-3 gap-4'>
                        <Field
                            label='Selling Price (₹)'
                            error={errors.price}
                            required
                        >
                            <input
                                type='number'
                                min='0'
                                step='0.01'
                                value={form.price}
                                onChange={set("price")}
                                placeholder='e.g. 699'
                                className={`w-full input-dark px-4 py-3 rounded-xl text-sm ${errors.price ? "border-red-500/50" : ""}`}
                            />
                        </Field>
                        <Field
                            label='Original/MRP Price (₹)'
                            error={errors.comparePrice}
                        >
                            <input
                                type='number'
                                min='0'
                                step='0.01'
                                value={form.comparePrice}
                                onChange={set("comparePrice")}
                                placeholder='e.g. 1199'
                                className={`w-full input-dark px-4 py-3 rounded-xl text-sm ${errors.comparePrice ? "border-red-500/50" : ""}`}
                            />
                            <p className='text-[10px] text-silver-600 mt-1'>
                                Used to show discount %
                            </p>
                        </Field>
                        <Field
                            label='Stock Quantity'
                            error={errors.stockQuantity}
                            required
                        >
                            <input
                                type='number'
                                min='0'
                                value={form.stockQuantity}
                                onChange={set("stockQuantity")}
                                placeholder='e.g. 50'
                                className={`w-full input-dark px-4 py-3 rounded-xl text-sm ${errors.stockQuantity ? "border-red-500/50" : ""}`}
                            />
                        </Field>
                    </div>
                    <div className='grid sm:grid-cols-2 gap-4'>
                        <Field label='Warranty Info'>
                            <input
                                type='text'
                                value={form.warrantyInfo}
                                onChange={set("warrantyInfo")}
                                placeholder='e.g. 6 months warranty'
                                className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                            />
                        </Field>
                        <div className='flex items-end'>
                            <Toggle
                                checked={form.fastDelivery}
                                onChange={(v) =>
                                    setForm((p) => ({ ...p, fastDelivery: v }))
                                }
                                label='Fast Delivery'
                                desc='Delivered within a day'
                                icon={
                                    <Zap size={12} className='text-gold-500' />
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* General Images */}
                <div className='card-surface rounded-2xl border border-white/5 p-5 space-y-4'>
                    <h2 className='text-sm font-semibold text-white border-b border-white/5 pb-3'>
                        Product Images (General)
                    </h2>
                    <p className='text-xs text-silver-500'>
                        Add general image URLs. First image is the primary
                        image. For color-specific images, use the Color Variants
                        section below.
                    </p>
                    <div className='space-y-2'>
                        {form.images.map((img, i) => (
                            <div key={i} className='flex items-center gap-2'>
                                <input
                                    type='url'
                                    value={img}
                                    onChange={(e) => {
                                        const imgs = [...form.images];
                                        imgs[i] = e.target.value;
                                        setForm((p) => ({
                                            ...p,
                                            images: imgs,
                                        }));
                                    }}
                                    placeholder={`Image URL ${i + 1}`}
                                    className='flex-1 input-dark px-4 py-2.5 rounded-xl text-sm'
                                />
                                {img && (
                                    <div className='w-9 h-9 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0'>
                                        <img
                                            src={img}
                                            alt=''
                                            className='w-full h-full object-cover'
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).src = "";
                                            }}
                                        />
                                    </div>
                                )}
                                {form.images.length > 1 && (
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setForm((p) => ({
                                                ...p,
                                                images: p.images.filter(
                                                    (_, j) => j !== i,
                                                ),
                                            }))
                                        }
                                        className='p-1.5 text-silver-600 hover:text-red-400 transition-colors'
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={() =>
                                setForm((p) => ({
                                    ...p,
                                    images: [...p.images, ""],
                                }))
                            }
                            className='flex items-center gap-1.5 text-xs text-gold-500 hover:text-gold-400 transition-colors mt-1'
                        >
                            <Plus size={13} /> Add Image URL
                        </button>
                    </div>
                </div>

                {/* Color Variants */}
                <div className='card-surface rounded-2xl border border-white/5 p-5 space-y-4'>
                    <div className='flex items-center justify-between border-b border-white/5 pb-3'>
                        <h2 className='text-sm font-semibold text-white'>
                            Color Variants
                        </h2>
                        <button
                            type='button'
                            onClick={addColorVariant}
                            className='flex items-center gap-1.5 text-xs text-gold-500 hover:text-gold-400 transition-colors'
                        >
                            <Plus size={13} /> Add Color Variant
                        </button>
                    </div>
                    <p className='text-xs text-silver-500'>
                        Add color variants with their own set of images. Users
                        can switch between colors on the product page.
                    </p>

                    {form.colorVariants.length === 0 && (
                        <div className='text-center py-6 text-sm text-silver-600'>
                            No color variants added. Click &quot;Add Color
                            Variant&quot; to start.
                        </div>
                    )}

                    {form.colorVariants.map((variant, vIdx) => (
                        <div
                            key={vIdx}
                            className='bg-white/3 rounded-xl border border-white/5 p-4 space-y-3'
                        >
                            <div className='flex items-center gap-2'>
                                <input
                                    type='text'
                                    value={variant.color}
                                    onChange={(e) =>
                                        updateVariantColor(vIdx, e.target.value)
                                    }
                                    placeholder='Color name (e.g. Matte Black)'
                                    className='flex-1 input-dark px-4 py-2.5 rounded-xl text-sm'
                                />
                                <button
                                    type='button'
                                    onClick={() => removeColorVariant(vIdx)}
                                    className='p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className='space-y-2 pl-4 border-l-2 border-gold-500/20'>
                                {variant.images.map((img, imgIdx) => (
                                    <div
                                        key={imgIdx}
                                        className='flex items-center gap-2'
                                    >
                                        <input
                                            type='url'
                                            value={img}
                                            onChange={(e) =>
                                                updateVariantImage(
                                                    vIdx,
                                                    imgIdx,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Image URL ${imgIdx + 1} for ${variant.color || "this color"}`}
                                            className='flex-1 input-dark px-3 py-2 rounded-lg text-sm'
                                        />
                                        {img && (
                                            <div className='w-8 h-8 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0'>
                                                <img
                                                    src={img}
                                                    alt=''
                                                    className='w-full h-full object-cover'
                                                    onError={(e) => {
                                                        (
                                                            e.target as HTMLImageElement
                                                        ).src = "";
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {variant.images.length > 1 && (
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    removeVariantImage(
                                                        vIdx,
                                                        imgIdx,
                                                    )
                                                }
                                                className='p-1 text-silver-600 hover:text-red-400 transition-colors'
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type='button'
                                    onClick={() => addVariantImage(vIdx)}
                                    className='flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors'
                                >
                                    <Plus size={11} /> Add Image for this color
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* In the Box */}
                <div className='card-surface rounded-2xl border border-white/5 p-5 space-y-4'>
                    <h2 className='text-sm font-semibold text-white border-b border-white/5 pb-3'>
                        What&apos;s in the Box
                    </h2>
                    <p className='text-xs text-silver-500'>
                        List the items included with the product (e.g. Phone,
                        Charger, USB-C Cable).
                    </p>
                    <div className='flex gap-2'>
                        <input
                            type='text'
                            value={boxItem}
                            onChange={(e) => setBoxItem(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addBoxItem();
                                }
                            }}
                            placeholder='e.g. Charger'
                            className='flex-1 input-dark px-4 py-2.5 rounded-xl text-sm'
                        />
                        <button
                            type='button'
                            onClick={addBoxItem}
                            className='btn-gold px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5'
                        >
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    {form.inTheBox.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                            {form.inTheBox.map((item, i) => (
                                <div
                                    key={i}
                                    className='flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-lg px-3 py-1.5'
                                >
                                    <Package
                                        size={12}
                                        className='text-gold-500'
                                    />
                                    <span className='text-sm text-white'>
                                        {item}
                                    </span>
                                    <button
                                        type='button'
                                        onClick={() => removeBoxItem(i)}
                                        className='text-silver-600 hover:text-red-400 transition-colors'
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tags & Specs */}
                <div className='card-surface rounded-2xl border border-white/5 p-5 space-y-4'>
                    <h2 className='text-sm font-semibold text-white border-b border-white/5 pb-3'>
                        Tags & Specifications
                    </h2>
                    <Field label='Tags (comma-separated)'>
                        <input
                            type='text'
                            value={form.tags}
                            onChange={set("tags")}
                            placeholder='iphone, case, protection, clear'
                            className='w-full input-dark px-4 py-3 rounded-xl text-sm'
                        />
                    </Field>
                    <Field label='Specifications (JSON, optional)'>
                        <textarea
                            rows={3}
                            value={form.specifications}
                            onChange={set("specifications")}
                            placeholder='{"Material": "Polycarbonate", "Weight": "50g"}'
                            className='w-full input-dark px-4 py-3 rounded-xl text-sm font-mono resize-none'
                        />
                    </Field>
                </div>

                {/* Visibility */}
                <div className='card-surface rounded-2xl border border-white/5 p-5 space-y-4'>
                    <h2 className='text-sm font-semibold text-white border-b border-white/5 pb-3'>
                        Visibility & Flags
                    </h2>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Toggle
                            checked={form.isActive}
                            onChange={(v) =>
                                setForm((p) => ({ ...p, isActive: v }))
                            }
                            label='Active / Visible'
                            desc='Show on store'
                        />
                        <Toggle
                            checked={form.isFeatured}
                            onChange={(v) =>
                                setForm((p) => ({ ...p, isFeatured: v }))
                            }
                            label='Featured Product'
                            desc='Display on homepage'
                        />
                        <Toggle
                            checked={form.isDailyDeal}
                            onChange={(v) =>
                                setForm((p) => ({ ...p, isDailyDeal: v }))
                            }
                            label='Daily Deal'
                            desc='Show in daily deals banner'
                            icon={
                                <TagIcon size={12} className='text-gold-500' />
                            }
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className='flex gap-3'>
                    <Link
                        href='/admin/products'
                        className='btn-outline-gold flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-semibold text-center'
                    >
                        Cancel
                    </Link>
                    <button
                        type='submit'
                        disabled={saving}
                        className='btn-gold flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold disabled:opacity-60'
                    >
                        <Save size={14} />
                        {saving ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
