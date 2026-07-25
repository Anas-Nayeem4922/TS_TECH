"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import type { Product } from "@/lib/database.types";

export interface LocalCartItem {
    product: Product;
    quantity: number;
    caseBrand?: string | null;
    caseModel?: string | null;
    selectedColor?: string | null;
}

interface CartContextValue {
    items: LocalCartItem[];
    count: number;
    total: number;
    loading: boolean;
    addToCart: (
        product: Product,
        quantity?: number,
        options?: {
            caseBrand?: string;
            caseModel?: string;
            selectedColor?: string;
        },
    ) => Promise<void>;
    removeFromCart: (
        productId: string,
        caseBrand?: string | null,
        caseModel?: string | null,
        selectedColor?: string | null,
    ) => Promise<void>;
    updateQuantity: (
        productId: string,
        quantity: number,
        caseBrand?: string | null,
        caseModel?: string | null,
        selectedColor?: string | null,
    ) => Promise<void>;
    updateItemColor: (
        productId: string,
        color: string,
        caseBrand?: string | null,
        caseModel?: string | null,
        selectedColor?: string | null,
    ) => Promise<void>;
    clearCart: () => Promise<void>;
}

export function cartItemKey(
    productId: string,
    caseBrand?: string | null,
    caseModel?: string | null,
    selectedColor?: string | null,
): string {
    const suffix = caseBrand || caseModel || selectedColor;
    return suffix ?
            `${productId}__${caseBrand ?? ""}__${caseModel ?? ""}__${selectedColor ?? ""}`
        :   productId;
}

const CartContext = createContext<CartContextValue | null>(null);

const LOCAL_KEY = "ts_tech_cart";

function readLocal(): LocalCartItem[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    } catch {
        return [];
    }
}

function saveLocal(items: LocalCartItem[]) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [items, setItems] = useState<LocalCartItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchServerCart = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch("/api/cart", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                const mapped: LocalCartItem[] = (data.items ?? [])
                    .filter((d: { product: Product | null }) => d.product)
                    .map((d: { product: Product; quantity: number }) => ({
                        product: d.product,
                        quantity: d.quantity,
                    }));
                setItems(mapped);
                saveLocal(mapped);
            }
        } catch {
            // ignore
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchServerCart();
        } else {
            setItems(readLocal());
        }
    }, [user, fetchServerCart]);

    const addToCart = async (
        product: Product,
        quantity = 1,
        options?: {
            caseBrand?: string;
            caseModel?: string;
            selectedColor?: string;
        },
    ) => {
        const caseBrand = options?.caseBrand ?? null;
        const caseModel = options?.caseModel ?? null;
        const selectedColor = options?.selectedColor ?? null;
        const key = cartItemKey(
            product.id,
            caseBrand,
            caseModel,
            selectedColor,
        );
        setItems((prev) => {
            const existing = prev.find(
                (i) =>
                    cartItemKey(
                        i.product.id,
                        i.caseBrand,
                        i.caseModel,
                        i.selectedColor,
                    ) === key,
            );
            const next =
                existing ?
                    prev.map((i) =>
                        (
                            cartItemKey(
                                i.product.id,
                                i.caseBrand,
                                i.caseModel,
                                i.selectedColor,
                            ) === key
                        ) ?
                            { ...i, quantity: i.quantity + quantity }
                        :   i,
                    )
                :   [
                        ...prev,
                        {
                            product,
                            quantity,
                            caseBrand,
                            caseModel,
                            selectedColor,
                        },
                    ];
            saveLocal(next);
            return next;
        });

        if (user) {
            await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id, quantity }),
            });
        }
    };

    const removeFromCart = async (
        productId: string,
        caseBrand?: string | null,
        caseModel?: string | null,
        selectedColor?: string | null,
    ) => {
        const key = cartItemKey(productId, caseBrand, caseModel, selectedColor);
        setItems((prev) => {
            const next = prev.filter(
                (i) =>
                    cartItemKey(
                        i.product.id,
                        i.caseBrand,
                        i.caseModel,
                        i.selectedColor,
                    ) !== key,
            );
            saveLocal(next);
            return next;
        });
        if (user) {
            await fetch(`/api/cart?productId=${productId}`, {
                method: "DELETE",
            });
        }
    };

    const updateQuantity = async (
        productId: string,
        quantity: number,
        caseBrand?: string | null,
        caseModel?: string | null,
        selectedColor?: string | null,
    ) => {
        if (quantity <= 0) {
            await removeFromCart(
                productId,
                caseBrand,
                caseModel,
                selectedColor,
            );
            return;
        }
        const key = cartItemKey(productId, caseBrand, caseModel, selectedColor);
        setItems((prev) => {
            const next = prev.map((i) =>
                (
                    cartItemKey(
                        i.product.id,
                        i.caseBrand,
                        i.caseModel,
                        i.selectedColor,
                    ) === key
                ) ?
                    { ...i, quantity }
                :   i,
            );
            saveLocal(next);
            return next;
        });
        if (user) {
            await fetch("/api/cart", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });
        }
    };

    const updateItemColor = async (
        productId: string,
        color: string,
        caseBrand?: string | null,
        caseModel?: string | null,
        selectedColor?: string | null,
    ) => {
        const oldKey = cartItemKey(
            productId,
            caseBrand,
            caseModel,
            selectedColor,
        );
        setItems((prev) => {
            const target = prev.find(
                (i) =>
                    cartItemKey(
                        i.product.id,
                        i.caseBrand,
                        i.caseModel,
                        i.selectedColor,
                    ) === oldKey,
            );
            if (!target) return prev;
            const newColor = color || null;
            const newKey = cartItemKey(
                productId,
                target.caseBrand,
                target.caseModel,
                newColor,
            );
            const existingNew = prev.find(
                (i) =>
                    i !== target &&
                    cartItemKey(
                        i.product.id,
                        i.caseBrand,
                        i.caseModel,
                        i.selectedColor,
                    ) === newKey,
            );
            let next: LocalCartItem[];
            if (existingNew) {
                next = prev
                    .filter((i) => i !== target && i !== existingNew)
                    .concat({
                        ...existingNew,
                        quantity: existingNew.quantity + target.quantity,
                    });
            } else {
                next = prev.map((i) =>
                    i === target ? { ...i, selectedColor: newColor } : i,
                );
            }
            saveLocal(next);
            return next;
        });
    };

    const clearCart = async () => {
        setItems([]);
        saveLocal([]);
        if (user) {
            await fetch("/api/cart?clear=true", { method: "DELETE" });
        }
    };

    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                count,
                total,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                updateItemColor,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
