export type PlatformType = 
  | 'all'
  | 'steam'
  | 'playstation'
  | 'xbox'
  | 'apple'
  | 'googleplay'
  | 'nintendo'
  | 'spotify'
  | 'razer'
  | 'netflix';

export interface CardDenomination {
  id: string;
  value: number;
  label: string;
  priceTomans: number;
  oldPriceTomans?: number;
  inStock: boolean;
}

export interface GiftCardProduct {
  id: string;
  titleFa: string;
  titleEn: string;
  platform: PlatformType;
  platformNameFa: string;
  description: string;
  rating: number;
  reviewsCount: number;
  region: string;
  availableRegions: string[];
  isInstant: boolean;
  isHot?: boolean;
  basePrice: number;
  denominations: CardDenomination[];
  iconType: string;
  accentColor: string; // e.g. '#a078ff' or '#4cd7f6'
  bgGradient: string;
  badge?: string;
  features: string[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  title: string;
  platform: PlatformType;
  platformNameFa: string;
  denominationLabel: string;
  denominationValue: number;
  region: string;
  priceTomans: number;
  quantity: number;
  iconType: string;
  accentColor: string;
}

export interface OrderItem {
  title: string;
  denominationLabel: string;
  region: string;
  priceTomans: number;
  quantity: number;
  licenseCode: string;
  pinCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotalTomans: number;
  discountTomans: number;
  totalTomans: number;
  couponCode?: string;
  paymentGateway: string;
  status: 'تکمیل شده و تحویل آنی' | 'در حال پردازش' | 'ناموفق';
  createdAt: string;
}
