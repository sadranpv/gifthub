import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, GiftCardProduct, Order, PlatformType } from '../types';
import { GIFT_CARDS } from '../data/giftCards';
import { generateLicenseCode, generatePinCode } from '../utils/formatters';
import { safeStorage } from '../utils/storage';

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductModal: GiftCardProduct | null;
  setSelectedProductModal: (product: GiftCardProduct | null) => void;
  activeTab: 'home' | 'store' | 'tracking' | 'faq';
  setActiveTab: (tab: 'home' | 'store' | 'tracking' | 'faq') => void;
  selectedPlatformFilter: PlatformType;
  setSelectedPlatformFilter: (platform: PlatformType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  
  // Cart Actions
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  
  // Favorite Actions
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Coupon
  appliedCoupon: string | null;
  discountPercentage: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Checkout & Orders
  completeCheckout: (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    gateway: string;
  }) => Order | null;
  
  // Computed values
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'gifthub_cart_v3';
const FAVORITES_STORAGE_KEY = 'gifthub_favorites_v3';
const ORDERS_STORAGE_KEY = 'gifthub_orders_v3';

const DEFAULT_CART: CartItem[] = [
  {
    cartItemId: 'steam-10-default',
    productId: 'steam-wallet',
    title: 'گیفت کارت استیم والت',
    platform: 'steam',
    platformNameFa: 'استیم (Steam)',
    denominationLabel: '$10 دلار',
    denominationValue: 10,
    region: 'گلوبال / آمریکا',
    priceTomans: 645000,
    quantity: 1,
    iconType: 'steam',
    accentColor: '#4cd7f6',
  },
  {
    cartItemId: 'psn-10-default',
    productId: 'playstation-network',
    title: 'گیفت کارت پلی استیشن PSN',
    platform: 'playstation',
    platformNameFa: 'پلی‌استیشن (PSN)',
    denominationLabel: '$10 دلار',
    denominationValue: 10,
    region: 'آمریکا (USA)',
    priceTomans: 645000,
    quantity: 1,
    iconType: 'playstation',
    accentColor: '#006FCD',
  },
];

const DEFAULT_FAVORITES: string[] = ['steam-wallet', 'xbox-giftcard'];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-82919',
    orderNumber: 'GH-82919',
    customerName: 'کاربر VIP گیفت‌هاب',
    customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    customerEmail: 'gamer@gifthub.ir',
    items: [
      {
        title: 'گیفت کارت استیم والت',
        denominationLabel: '$50 دلار',
        region: 'آمریکا (USA)',
        priceTomans: 3190000,
        quantity: 1,
        licenseCode: 'STEA-9X4F-KQ2L-88WZ',
        pinCode: '749201',
      },
    ],
    subtotalTomans: 3190000,
    discountTomans: 159500,
    totalTomans: 3030500,
    couponCode: 'LUKYSALE',
    paymentGateway: 'درگاه پرداخت شاپرک (به‌پرداخت ملت)',
    status: 'تکمیل شده و تحویل آنی',
    createdAt: '۱۴۰۳/۰۸/۲۱ - ۱۶:۳۰',
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize states with safeStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const data = safeStorage.get<CartItem[]>(CART_STORAGE_KEY, DEFAULT_CART);
    return Array.isArray(data) ? data : DEFAULT_CART;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const data = safeStorage.get<string[]>(FAVORITES_STORAGE_KEY, DEFAULT_FAVORITES);
    return Array.isArray(data) ? data : DEFAULT_FAVORITES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const data = safeStorage.get<Order[]>(ORDERS_STORAGE_KEY, DEFAULT_ORDERS);
    return Array.isArray(data) ? data : DEFAULT_ORDERS;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<GiftCardProduct | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'store' | 'tracking' | 'faq'>('home');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<PlatformType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  // Sync cart to storage safely
  useEffect(() => {
    safeStorage.set(CART_STORAGE_KEY, cart);
  }, [cart]);

  // Sync favorites to storage safely
  useEffect(() => {
    safeStorage.set(FAVORITES_STORAGE_KEY, favorites);
  }, [favorites]);

  // Sync orders to storage safely
  useEffect(() => {
    safeStorage.set(ORDERS_STORAGE_KEY, orders);
  }, [orders]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Cart actions
  const addToCart = (item: Omit<CartItem, 'cartItemId'>) => {
    const cartItemId = `${item.productId}-${item.denominationValue}-${item.region}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, cartItemId }];
    });
    showToast(`«${item.title} (${item.denominationLabel})» به سبد خرید اضافه شد!`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.cartItemId === cartItemId);
      if (item) {
        showToast(`«${item.title}» از سبد خرید حذف شد.`, 'info');
      }
      return prev.filter((i) => i.cartItemId !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
    showToast('سبد خرید شما با موفقیت خالی شد.', 'info');
  };

  // Favorite actions
  const toggleFavorite = (productId: string) => {
    const product = GIFT_CARDS.find((p) => p.id === productId);
    const title = product ? product.titleFa : 'محصول';
    
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`«${title}» از لیست علاقه‌مندی‌ها حذف شد.`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`«${title}» به لیست علاقه‌مندی‌ها اضافه شد ❤️`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Coupon handling
  const applyCoupon = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'LUKYSALE') {
      setAppliedCoupon('LUKYSALE');
      setDiscountPercentage(10); // 10% discount
      showToast('کد تخفیف LUKYSALE با ۱۰٪ تخفیف اعمال شد!', 'success');
      return true;
    } else if (normalized === 'GIFTHUB') {
      setAppliedCoupon('GIFTHUB');
      setDiscountPercentage(5); // 5% discount
      showToast('کد تخفیف GIFTHUB با ۵٪ تخفیف اعمال شد!', 'success');
      return true;
    } else {
      showToast('کد تخفیف وارد شده معتبر یا فعال نیست.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercentage(0);
    showToast('کد تخفیف حذف گردید.', 'info');
  };

  // Safe computed calculations with fallbacks for null/undefined
  const cartCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (Number(item?.quantity) || 1), 0)
    : 0;

  const cartSubtotal = Array.isArray(cart)
    ? cart.reduce(
        (total, item) => total + (Number(item?.priceTomans) || 0) * (Number(item?.quantity) || 1),
        0
      )
    : 0;

  const cartDiscount = Math.round(cartSubtotal * (discountPercentage / 100));
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  // Complete checkout
  const completeCheckout = (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    gateway: string;
  }): Order | null => {
    if (!Array.isArray(cart) || cart.length === 0) {
      showToast('سبد خرید شما خالی است.', 'error');
      return null;
    }

    const orderNum = 'GH-' + Math.floor(10000 + Math.random() * 90000);
    const orderItems = cart.map((item) => ({
      title: item.title,
      denominationLabel: item.denominationLabel,
      region: item.region,
      priceTomans: item.priceTomans,
      quantity: item.quantity,
      licenseCode: generateLicenseCode(item.platform),
      pinCode: generatePinCode(),
    }));

    const dateStr = new Date().toLocaleDateString('fa-IR');

    const newOrder: Order = {
      id: 'ord-' + Date.now().toString(36),
      orderNumber: orderNum,
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      customerEmail: details.customerEmail,
      items: orderItems,
      subtotalTomans: cartSubtotal,
      discountTomans: cartDiscount,
      totalTomans: cartTotal,
      couponCode: appliedCoupon || undefined,
      paymentGateway: details.gateway,
      status: 'تکمیل شده و تحویل آنی',
      createdAt: dateStr,
    };

    setOrders((prev) => [newOrder, ...(Array.isArray(prev) ? prev : [])]);
    setCart([]);
    setAppliedCoupon(null);
    setDiscountPercentage(0);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);

    showToast(`پرداخت موفق! سفارش ${orderNum} ثبت و کدهای لایسنس صادر شد.`, 'success');
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        favorites,
        orders,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductModal,
        setSelectedProductModal,
        activeTab,
        setActiveTab,
        selectedPlatformFilter,
        setSelectedPlatformFilter,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        appliedCoupon,
        discountPercentage,
        applyCoupon,
        removeCoupon,
        completeCheckout,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
