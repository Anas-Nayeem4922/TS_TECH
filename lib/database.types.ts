export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  displayOrder: number;
  createdAt: string;
}

export interface ColorVariant {
  color: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  categoryId: string | null;
  brand: string | null;
  model: string | null;
  color: string | null;
  colorVariants: ColorVariant[] | unknown;
  inTheBox: string[];
  fastDelivery: boolean;
  isDailyDeal: boolean;
  stockQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  warrantyInfo: string | null;
  specifications: unknown;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string | null;
  body: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user?: { fullName: string | null } | null;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  product?: Product | null;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingFee: number;
  total: number;
  pointsRedeemed: number;
  loyaltyDiscount: number;
  shippingFullName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  paymentMethod: string;
  paymentStatus: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  product?: Pick<Product, 'images' | 'name'> | null;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  rewardPerReferral: number;
  referredReward: number;
  usesCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface ReferralUse {
  id: string;
  referralCodeId: string;
  referredUserId: string;
  status: string;
  orderId: string | null;
  referrerReward: number | null;
  referredDiscount: number | null;
  createdAt: string;
}

export interface ReferralCredit {
  id: string;
  userId: string;
  amount: number;
  description: string;
  isUsed: boolean;
  orderId: string | null;
  createdAt: string;
}

export interface LoyaltyMembership {
  userId: string;
  tier: string;
  totalSpend: number;
  totalOrders: number;
  points: number;
  nextTierPoints: number;
  tierSince: string;
  lastUpdatedAt: string;
}

export type ProductWithCategory = Product & { category: Category | null };
export type CartItemWithProduct = CartItem & { product: Product | null };
export type OrderWithItems = Order & { orderItems: (OrderItem & { product: Product | null })[] };
