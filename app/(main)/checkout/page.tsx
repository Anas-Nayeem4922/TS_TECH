'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Check, ChevronRight, CreditCard, Truck, MapPin, Coins, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import type { Address } from '@/lib/database.types';

type Step = 'address' | 'payment' | 'review';

interface AddressForm {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: Truck },
  { id: 'upi', label: 'UPI Payment', desc: 'Pay via UPI (GPay, PhonePe, Paytm)', icon: CreditCard },
  { id: 'card', label: 'Credit/Debit Card', desc: 'Secure card payment', icon: CreditCard },
];

const STEPS = ['address', 'payment', 'review'];

const REDEMPTION_RATE = 100;
const REDEMPTION_VALUE = 50;

function getDeliveryCharge(subtotal: number): { charge: number; label: string } {
  if (subtotal < 500) return { charge: 59, label: '₹59' };
  if (subtotal <= 999) return { charge: 49, label: '₹49' };
  if (subtotal <= 1999) return { charge: 29, label: '₹29' };
  if (subtotal <= 2999) return { charge: 0, label: 'FREE' };
  return { charge: 0, label: 'FREE 🚚' };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [step, setStep] = useState<Step>('address');
  const [placing, setPlacing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState<AddressForm>({
    fullName: '', phone: '', line1: '', line2: '',
    city: '', state: '', pincode: '', notes: '',
  });

  // Loyalty state
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [useLoyalty, setUseLoyalty] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const isDark = theme === 'dark';
  const tc = isDark ? 'text-white' : 'text-gray-900';
  const sc = isDark ? 'text-silver-400' : 'text-gray-600';
  const mc = isDark ? 'text-silver-500' : 'text-gray-500';
  const cardBorder = isDark ? 'border-white/5' : 'border-gray-200';
  const innerBg = isDark ? 'bg-white/3' : 'bg-gray-100';
  const inputColor = isDark ? 'text-white' : 'text-gray-900';

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  useEffect(() => {
    if (!user) return;

    fetch('/api/addresses', { cache: 'no-store' })
      .then((r) => r.json())
      .then(({ addresses }: { addresses: Address[] }) => {
        const list: Address[] = addresses ?? [];
        setSavedAddresses(list);
        const defaultAddr = list.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setAddress({
            fullName: defaultAddr.fullName,
            phone: defaultAddr.phone,
            line1: defaultAddr.line1,
            line2: defaultAddr.line2 ?? '',
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
            notes: '',
          });
        }
      });

    fetch('/api/loyalty', { cache: 'no-store' })
      .then((r) => r.json())
      .then(({ membership }) => setLoyaltyPoints(membership?.points ?? 0));
  }, [user]);

  const deliveryInfo = getDeliveryCharge(total);
  const shippingFee = deliveryInfo.charge;

  // Loyalty redemption calculation
  const maxRedeemablePoints = Math.min(loyaltyPoints, Math.floor((total + shippingFee) / REDEMPTION_VALUE) * REDEMPTION_RATE);
  const actualPointsToRedeem = useLoyalty ? Math.min(pointsToRedeem || maxRedeemablePoints, maxRedeemablePoints) : 0;
  const loyaltyDiscount = Math.floor(actualPointsToRedeem / REDEMPTION_RATE) * REDEMPTION_VALUE;
  const grandTotal = Math.max(0, total + shippingFee - loyaltyDiscount);

  const currentStepIndex = STEPS.indexOf(step);

  const validateAddress = () => {
    return address.fullName.trim() && address.phone.trim() && address.line1.trim() &&
           address.city.trim() && address.state.trim() && address.pincode.trim();
  };

  const handlePlaceOrder = async () => {
    if (!user) { toast.error('Please sign in to place your order'); return; }
    if (!validateAddress()) { toast.error('Please fill in all required address fields'); return; }

    setPlacing(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtotal: total,
          shippingFee,
          total: grandTotal,
          pointsRedeemed: actualPointsToRedeem,
          loyaltyDiscount,
          shippingFullName: address.fullName,
          shippingPhone: address.phone,
          shippingLine1: address.line1,
          shippingLine2: address.line2 || null,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPincode: address.pincode,
          paymentMethod,
          notes: address.notes || null,
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: (item.product.images as string[])?.[0] ?? null,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to place order');
      }

      const { order } = await res.json();
      await clearCart();
      setPlacing(false);
      router.push(`/thank-you?order=${order.orderNumber}`);
    } catch (err: any) {
      setPlacing(false);
      toast.error('Failed to place order: ' + (err.message ?? 'Unknown error'));
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className={mc} />
          <h1 className={`text-xl font-bold ${tc} mb-2`}>Your cart is empty</h1>
          <Link href="/products" className="btn-outline-gold px-5 py-2.5 rounded-xl text-sm">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/cart" className={`inline-flex items-center gap-2 text-sm ${mc} hover:text-gold-400 transition-colors mb-8`}>
          <ArrowLeft size={14} /> Back to Cart
        </Link>

        <h1 className={`text-3xl font-bold ${tc} mb-2`}>Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                i <= currentStepIndex ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : `${innerBg} ${mc} border ${cardBorder}`
              }`}>
                {i < currentStepIndex ? <Check size={12} /> : <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]">{i + 1}</span>}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={14} className={mc} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Step */}
            {step === 'address' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`card-surface rounded-2xl border ${cardBorder} p-6`}>
                <h2 className={`text-lg font-semibold ${tc} mb-4 flex items-center gap-2`}>
                  <MapPin size={16} className="text-gold-500" /> Shipping Address
                </h2>

                {savedAddresses.length > 0 && (
                  <div className="mb-5 space-y-2">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setAddress({
                            fullName: addr.fullName, phone: addr.phone, line1: addr.line1,
                            line2: addr.line2 ?? '', city: addr.city, state: addr.state,
                            pincode: addr.pincode, notes: '',
                          });
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          selectedAddressId === addr.id ? 'border-gold-500/40 bg-gold-500/8' : `${cardBorder} ${innerBg} hover:border-white/20`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-sm font-medium ${tc}`}>{addr.fullName}</div>
                            <div className={`text-xs ${mc}`}>{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</div>
                          </div>
                          {addr.isDefault && <span className="badge-gold text-[10px]">Default</span>}
                        </div>
                      </button>
                    ))}
                    <div className={`text-xs ${mc} pt-1`}>Or enter a new address below:</div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs ${sc} mb-1.5`}>Full Name *</label>
                    <input type="text" value={address.fullName} onChange={(e) => setAddress((p) => ({ ...p, fullName: e.target.value }))}
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className={`block text-xs ${sc} mb-1.5`}>Phone *</label>
                    <input type="tel" value={address.phone} onChange={(e) => setAddress((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm" placeholder="98XXXXXXXX" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-xs ${sc} mb-1.5`}>Address Line 1 *</label>
                    <input type="text" value={address.line1} onChange={(e) => setAddress((p) => ({ ...p, line1: e.target.value }))}
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm" placeholder="House/Flat no, Street" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-xs ${sc} mb-1.5`}>Address Line 2</label>
                    <input type="text" value={address.line2} onChange={(e) => setAddress((p) => ({ ...p, line2: e.target.value }))}
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm" placeholder="Landmark, Area (optional)" />
                  </div>
                  <div>
                    <label className={`block text-xs ${sc} mb-1.5`}>City *</label>
                    <input type="text" value={address.city} onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm" placeholder="Kolkata" />
                  </div>
                  <div>
                    <label className={`block text-xs ${sc} mb-1.5`}>State *</label>
                    <input type="text" value={address.state} onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))}
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm" placeholder="West Bengal" />
                  </div>
                  <div>
                    <label className={`block text-xs ${sc} mb-1.5`}>Pincode *</label>
                    <input type="text" value={address.pincode} onChange={(e) => setAddress((p) => ({ ...p, pincode: e.target.value }))}
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm" placeholder="700001" />
                  </div>
                  <div>
                    <label className={`block text-xs ${sc} mb-1.5`}>Order Notes</label>
                    <input type="text" value={address.notes} onChange={(e) => setAddress((p) => ({ ...p, notes: e.target.value }))}
                      className="w-full input-dark px-4 py-2.5 rounded-xl text-sm" placeholder="Delivery instructions (optional)" />
                  </div>
                </div>

                <button
                  onClick={() => validateAddress() ? setStep('payment') : toast.error('Please fill all required fields')}
                  className="mt-5 w-full btn-gold py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                >
                  Continue to Payment <ChevronRight size={14} />
                </button>
              </motion.div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`card-surface rounded-2xl border ${cardBorder} p-6`}>
                <h2 className={`text-lg font-semibold ${tc} mb-4 flex items-center gap-2`}>
                  <CreditCard size={16} className="text-gold-500" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        paymentMethod === m.id ? 'border-gold-500/40 bg-gold-500/8' : `${cardBorder} ${innerBg} hover:border-white/20`
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${paymentMethod === m.id ? 'bg-gold-500/15' : innerBg}`}>
                        <m.icon size={16} className={paymentMethod === m.id ? 'text-gold-400' : mc} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${paymentMethod === m.id ? tc : sc}`}>{m.label}</div>
                        <div className={`text-xs ${mc}`}>{m.desc}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === m.id ? 'border-gold-500 bg-gold-500' : 'border-white/20'}`}>
                        {paymentMethod === m.id && <Check size={10} className="text-dark-700 m-auto" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep('address')} className="btn-outline-gold px-5 py-3 rounded-xl font-semibold text-sm">Back</button>
                  <button onClick={() => setStep('review')} className="flex-1 btn-gold py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                    Review Order <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className={`card-surface rounded-2xl border ${cardBorder} p-6`}>
                  <h2 className={`text-lg font-semibold ${tc} mb-4`}>Review Your Order</h2>

                  {/* Address Summary */}
                  <div className={`rounded-xl p-4 mb-4 ${innerBg}`}>
                    <div className={`text-xs ${mc} mb-1 flex items-center gap-1`}><MapPin size={11} /> Shipping Address</div>
                    <div className={`text-sm font-medium ${tc}`}>{address.fullName}</div>
                    <div className={`text-xs ${sc}`}>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</div>
                    <div className={`text-xs ${sc}`}>{address.city}, {address.state} - {address.pincode}</div>
                    <div className={`text-xs ${sc}`}>Phone: {address.phone}</div>
                  </div>

                  {/* Payment Summary */}
                  <div className={`rounded-xl p-4 mb-4 ${innerBg}`}>
                    <div className={`text-xs ${mc} mb-1 flex items-center gap-1`}><CreditCard size={11} /> Payment Method</div>
                    <div className={`text-sm ${tc}`}>{PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}</div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.product.id} className={`flex items-center gap-3 p-2 rounded-lg ${innerBg}`}>
                        <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? 'bg-dark-300' : 'bg-gray-200'}`}>
                          {(item.product.images as string[])?.[0] && (
                            <img src={(item.product.images as string[])[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm ${tc} truncate`}>{item.product.name}</div>
                          <div className={`text-xs ${mc}`}>Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="text-sm font-semibold text-gold-400">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')} className="btn-outline-gold px-5 py-3 rounded-xl font-semibold text-sm">Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 btn-gold py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {placing ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className={`card-surface rounded-2xl border ${cardBorder} p-5 sticky top-24`}>
              <h3 className={`text-sm font-semibold ${tc} mb-4`}>Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? 'bg-dark-300' : 'bg-gray-200'}`}>
                      {(item.product.images as string[])?.[0] && (
                        <img src={(item.product.images as string[])[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`${sc} truncate`}>{item.product.name}</div>
                      <div className={mc}>×{item.quantity}</div>
                    </div>
                    <div className={sc}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>

              {/* Loyalty Redemption */}
              {loyaltyPoints >= REDEMPTION_RATE && (
                <div className={`rounded-xl p-3 mb-4 border border-gold-500/20 ${isDark ? 'bg-gold-500/5' : 'bg-gold-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Coins size={14} className="text-gold-500" />
                      <span className={`text-xs font-semibold ${tc}`}>Loyalty Points</span>
                    </div>
                    <span className="text-xs text-gold-400 font-bold">{loyaltyPoints} pts available</span>
                  </div>

                  {!useLoyalty ? (
                    <button
                      onClick={() => { setUseLoyalty(true); setPointsToRedeem(maxRedeemablePoints); }}
                      className="w-full text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center justify-center gap-1.5 py-1.5"
                    >
                      <Sparkles size={11} /> Use points to save ₹{Math.floor(maxRedeemablePoints / REDEMPTION_RATE) * REDEMPTION_VALUE}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={maxRedeemablePoints}
                          step={REDEMPTION_RATE}
                          value={pointsToRedeem}
                          onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                          className="flex-1 accent-gold-500"
                        />
                        <span className="text-xs text-gold-400 font-bold whitespace-nowrap">{pointsToRedeem} pts</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${mc}`}>You save</span>
                        <span className="text-xs font-bold text-green-400">₹{loyaltyDiscount.toLocaleString('en-IN')}</span>
                      </div>
                      <button onClick={() => { setUseLoyalty(false); setPointsToRedeem(0); }} className={`text-[10px] ${mc} hover:text-red-400 transition-colors`}>
                        Don&apos;t use points
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className={`space-y-2 pt-4 border-t ${cardBorder}`}>
                <div className="flex justify-between text-sm">
                  <span className={mc}>Subtotal</span>
                  <span className={tc}>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={mc}>Shipping</span>
                  <span className={shippingFee === 0 ? 'text-green-400 font-semibold' : tc}>{deliveryInfo.label}</span>
                </div>
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={mc}>Loyalty Discount</span>
                    <span className="text-green-400 font-semibold">−₹{loyaltyDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className={`flex justify-between pt-2 border-t ${cardBorder}`}>
                  <span className={`text-sm font-semibold ${tc}`}>Total</span>
                  <span className="text-lg font-bold text-gold-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {shippingFee > 0 && (
                <div className="mt-3 text-xs text-gold-500 bg-gold-500/10 rounded-lg p-2 text-center">
                  Add ₹{(3000 - total).toLocaleString('en-IN')} more for FREE shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
