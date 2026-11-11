import React, { useState, useEffect } from 'react';
import { ORIGINAL_PRODUCTS, OriginalProduct, OriginalDenomination } from '../data/userSiteData';
import { safeStorage } from '../utils/storage';
import { formatTomans, generateLicenseCode, generatePinCode } from '../utils/formatters';

interface CartEntry {
  cartId: string;
  productId: string;
  title: string;
  usdLabel: string;
  priceTomans: number;
  region: string;
  platform: string;
  iconName: string;
  qty: number;
}

interface OrderRecord {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: { title: string; usdLabel: string; code: string; pin?: string }[];
  totalTomans: number;
  date: string;
  status: string;
}

export const OriginalApp: React.FC = () => {
  // 1. Interactive States: Cart & Favorites (persisted safely)
  const [cartItems, setCartItems] = useState<CartEntry[]>(() => {
    return safeStorage.get<CartEntry[]>('gh_original_cart', [
      {
        cartId: 'steam-10-default',
        productId: 'steam-10',
        title: 'گیفت کارت ۱۰ دلاری استیم والت',
        usdLabel: '$10 USD',
        priceTomans: 640000,
        region: 'گلوبال / آمریکا',
        platform: 'steam',
        iconName: 'sports_esports',
        qty: 1,
      },
      {
        cartId: 'psn-10-default',
        productId: 'psn-10',
        title: 'گیفت کارت ۱۰ دلاری پلی استیشن آمریکا',
        usdLabel: '$10 USD',
        priceTomans: 645000,
        region: 'آمریکا (USA)',
        platform: 'playstation',
        iconName: 'stadia_controller',
        qty: 1,
      },
    ]);
  });

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    return safeStorage.get<string[]>('gh_original_favorites', ['steam-10', 'psn-10']);
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    return safeStorage.get<OrderRecord[]>('gh_original_orders', [
      {
        orderId: 'GH-82919',
        customerName: 'کاربر VIP گیفت‌هاب',
        customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
        items: [
          {
            title: 'گیفت کارت ۵۰ دلاری استیم والت',
            usdLabel: '$50 USD',
            code: 'STEA-884F-KQ2L-99WZ',
            pin: '749201',
          },
        ],
        totalTomans: 3190000,
        date: '۱۴۰۳/۰۸/۲۱ - ۱۶:۳۰',
        status: 'تکمیل شده و تحویل آنی',
      },
    ]);
  });

  // Selected denomination per card { [productId]: denominationObject }
  const [selectedDenominations, setSelectedDenominations] = useState<{ [key: string]: OriginalDenomination }>(() => {
    const init: { [key: string]: OriginalDenomination } = {};
    ORIGINAL_PRODUCTS.forEach((p) => {
      init[p.id] = p.activeDenomination;
    });
    return init;
  });

  // UI state
  const [activeFilter, setActiveFilter] = useState<'all' | 'steam' | 'playstation' | 'xbox'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tracking state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<OrderRecord | null>(orders[0] || null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Countdown timer for Flash Deals (exact from original script)
  const [totalSeconds, setTotalSeconds] = useState(8 * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Persist to safeStorage
  useEffect(() => {
    safeStorage.set('gh_original_cart', cartItems);
  }, [cartItems]);

  useEffect(() => {
    safeStorage.set('gh_original_favorites', favoriteIds);
  }, [favoriteIds]);

  useEffect(() => {
    safeStorage.set('gh_original_orders', orders);
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // 1. ADD TO CART HANDLER
  const handleAddToCart = (product: OriginalProduct) => {
    const denom = selectedDenominations[product.id] || product.activeDenomination;
    const cartId = `${product.id}-${denom.id}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) => (i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          cartId,
          productId: product.id,
          title: product.titleFa,
          usdLabel: denom.usdLabel,
          priceTomans: denom.priceTomans,
          region: product.region,
          platform: product.platform,
          iconName: product.iconName,
          qty: 1,
        },
      ];
    });

    setJustAddedId(product.id);
    showToast(`محصول «${product.titleFa} (${denom.usdLabel})» به سبد خرید اضافه شد.`);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  // 2. FAVORITE TOGGLE HANDLER
  const handleToggleFavorite = (productId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('محصول از لیست نشان‌شده‌ها حذف شد.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('محصول به لیست علاقه‌مندی‌ها اضافه شد.');
        return [...prev, productId];
      }
    });
  };

  // 3. DENOMINATION SELECTION HANDLER
  const handleSelectDenomination = (productId: string, denom: OriginalDenomination) => {
    setSelectedDenominations((prev) => ({
      ...prev,
      [productId]: denom,
    }));
    showToast(`مبلغ ${denom.usdLabel} با قیمت ${formatTomans(denom.priceTomans)} تومان انتخاب شد.`);
  };

  // Cart math
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.priceTomans * item.qty, 0);
  const cartDiscountAmount = Math.round(cartSubtotal * (appliedDiscount / 100));
  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscountAmount);

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'LUKYSALE') {
      setAppliedDiscount(10);
      showToast('کد تخفیف LUKYSALE با ۱۰٪ تخفیف اعمال شد!');
    } else {
      showToast('کد تخفیف وارد شده معتبر نیست.');
    }
  };

  // Complete checkout simulation
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const newOrderNum = 'GH-' + Math.floor(10000 + Math.random() * 90000);
    const newOrderItems = cartItems.map((c) => ({
      title: c.title,
      usdLabel: c.usdLabel,
      code: generateLicenseCode(c.platform),
      pin: generatePinCode(),
    }));

    const newOrderRecord: OrderRecord = {
      orderId: newOrderNum,
      customerName: 'کاربر VIP گیفت‌هاب',
      customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
      items: newOrderItems,
      totalTomans: cartGrandTotal,
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'تکمیل شده و تحویل آنی',
    };

    setOrders((prev) => [newOrderRecord, ...prev]);
    setTrackedOrder(newOrderRecord);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    showToast(`پرداخت موفق! سفارش ${newOrderNum} ثبت و کدهای لایسنس صادر شد.`);
    
    // Scroll to tracking section
    const trackEl = document.getElementById('order-tracking');
    if (trackEl) trackEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered products list
  const filteredProducts = ORIGINAL_PRODUCTS.filter((p) => {
    if (activeFilter !== 'all' && p.platform !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchFa = p.titleFa.toLowerCase().includes(q);
      const matchEn = p.titleEn.toLowerCase().includes(q);
      const matchPlat = p.platformNameFa.toLowerCase().includes(q);
      if (!matchFa && !matchEn && !matchPlat) return false;
    }
    return true;
  });

  return (
    <div className="bg-background text-on-background selection:bg-primary selection:text-on-primary min-h-screen relative font-sans">
      
      {/* Toast Notification Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[120] px-5 py-3.5 rounded-2xl bg-surface-container-high border border-primary/30 text-on-surface shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center gap-3 text-sm font-medium animate-fade-in">
          <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NOTIFICATION BAR (Exact from original site) */}
      <div className="fixed top-0 inset-x-0 z-50 flex flex-col">
        <div className="w-full bg-surface-container-lowest/90 backdrop-blur-md px-4 py-1.5 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-highest/40">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-margin lg:px-margin-desktop">
            <div className="flex items-center gap-space-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
              </span>
              <span className="text-tertiary font-label-md text-label-md">وضعیت سرور: فعال و آماده تحویل آنی</span>
            </div>

            <div className="hidden sm:flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">bolt</span>
                تحویل آنی و خودکار کدها کمتر از ۳۰ ثانیه
              </span>
              <span className="text-outline-variant">•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                ضمانت ۱۰۰٪ اصالت کارت‌ها
              </span>
            </div>

            <div className="flex items-center gap-space-sm">
              <a className="hover:text-primary transition-colors font-label-sm text-label-sm" href="tel:02191008877">
                پشتیبانی ۲۴/۷
              </a>
            </div>
          </div>
        </div>

        {/* HEADER (Exact from original site) */}
        <header className="w-full bg-surface-container-low/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-surface-container-highest/30">
          <div className="h-20 max-w-7xl mx-auto px-margin lg:px-margin-desktop flex items-center justify-between gap-space-md">
            
            {/* Logo and Search */}
            <div className="flex items-center gap-space-lg">
              <a className="flex items-center gap-space-sm group cursor-pointer" href="#">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center p-1 shadow-[0_0_20px_rgba(160,120,255,0.25)]">
                  <span className="material-symbols-outlined text-primary text-2xl">sports_esports</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                    گیفت‌هاب
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
                    GiftHub Luxury
                  </span>
                </div>
              </a>

              <div className="relative hidden xl:flex items-center w-72">
                <span className="material-symbols-outlined absolute right-3 text-outline text-lg pointer-events-none">search</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container py-2 pr-9 pl-4 rounded-xl text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="جستجوی بازی، استیم، پلی‌استیشن..."
                  type="text"
                />
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="hidden lg:flex items-center gap-1 bg-surface-container/60 p-1.5 rounded-2xl backdrop-blur-md">
              <a className="px-space-md py-2 transition-all bg-primary-container text-on-primary-container font-bold rounded-xl" href="#">
                صفحه اصلی
              </a>
              <a className="px-space-md py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all font-label-lg text-label-lg" href="#popular-categories">
                فروشگاه گیفت‌کارت‌ها
              </a>
              <a className="px-space-md py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all font-label-lg text-label-lg" href="#order-tracking">
                پیگیری سفارش
              </a>
              <a className="px-space-md py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all font-label-lg text-label-lg" href="#faq">
                سوالات متداول
              </a>
            </nav>

            {/* Action Buttons: Cart, Wishlist, Profile */}
            <div className="flex items-center gap-space-md">
              
              {/* Shopping Bag Button (Interactive) */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-surface-container text-on-surface hover:text-secondary hover:bg-surface-container-high transition-all flex items-center justify-center cursor-pointer"
                title="مشاهده سبد خرید"
              >
                <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center font-label-sm text-label-sm font-bold shadow-[0_0_12px_rgba(76,215,246,0.6)]">
                  {cartCount}
                </span>
              </button>

              {/* Wishlist Button (Interactive) */}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2.5 rounded-xl bg-surface-container text-on-surface hover:text-primary hover:bg-surface-container-high transition-all flex items-center justify-center cursor-pointer"
                title="مشاهده کارت‌های نشان‌شده"
              >
                <span className={`material-symbols-outlined text-2xl ${favoriteIds.length > 0 ? 'text-primary' : ''}`}>
                  {favoriteIds.length > 0 ? 'bookmark' : 'bookmark_border'}
                </span>
                {favoriteIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm font-bold shadow-[0_0_10px_rgba(160,120,255,0.6)]">
                    {favoriteIds.length}
                  </span>
                )}
              </button>

              <div className="h-8 w-px bg-surface-container-highest"></div>

              {/* VIP Profile */}
              <div className="flex items-center gap-space-sm p-1.5 pr-2 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest transition-all group">
                <div className="flex flex-col text-left">
                  <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-right">
                    کاربر VIP
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary text-right">
                    اعتبار: ۵,۲۰۰,۰۰۰ ت
                  </span>
                </div>
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbLsjgRAa5zpOkkYnFIqQ5XIWSkSyDq8hhriVNqEtrjj5cGD_s_OQN3REmxQA0Q0_msmGpDxm2RbnPYHqY1Xm31oqyWN2JNr-lBCTs16pxri1IzTpO-4IeenDYeg9CO786WxAJpd-GgqwSXpMiXmvFfuPyBN58HRq15nxLtLbf7XzU-pGfuzmFUuvXS3-kyUvyAfGLfzDtE9-6AeCwdR-AxwW0HUJsHGtkHrLQNRkR"
                />
              </div>
            </div>
          </div>
        </header>
      </div>

      <main className="w-full pt-28 bg-background relative min-h-screen">
        <div className="flex flex-col w-full overflow-hidden">
          
          {/* SECTION 0: HERO SECTION (Exact from original site) */}
          <section className="relative w-full -mt-28 pt-36 pb-20 px-margin lg:px-margin-desktop bg-surface-container-lowest">
            {/* Ambient Neon Aura Backgrounds */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary-container/20 blur-[130px] pointer-events-none"></div>
            <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-secondary-container/20 blur-[110px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(160,120,255,0.15),rgba(16,19,28,0))] pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
              
              {/* Text & CTA Content */}
              <div className="flex flex-col items-start max-w-2xl text-right">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container/80 backdrop-blur-md mb-6 shadow-sm border border-surface-container-highest/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm text-tertiary tracking-wider font-bold">
                    نسل جدید پلتفرم دارایی‌های گیمینگ
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-label-sm text-label-sm text-secondary">تحویل تمام‌اتوماتیک</span>
                </div>

                <h1 className="font-display-lg text-display-lg font-black tracking-tight text-on-surface leading-tight mb-5">
                  دنیای کارت‌های دیجیتال، <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary via-primary-fixed to-secondary">
                    در یک جا!
                  </span>
                </h1>

                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-8 max-w-xl">
                  خرید آنلاین انواع گیفت‌کارت‌های معتبر استیم، پلی‌استیشن، ایکس‌باکس و اپل با تحویل کاملاً آنی کمتر از ۳۰ ثانیه، تضمین ۱۰۰٪ اسکن فیزیکی و پشتیبانی بی‌وقفه شبانه‌روزی.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <a
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-l from-primary-container via-inverse-primary to-primary-container text-on-primary font-headline-sm text-headline-sm font-bold shadow-[0_12px_32px_rgba(160,120,255,0.4)] hover:shadow-[0_16px_40px_rgba(160,120,255,0.6)] hover:scale-[1.02] active:scale-95 transition-all"
                    href="#best-sellers"
                  >
                    <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                    <span>مشاهده محصولات و خرید</span>
                  </a>

                  <a
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-surface-container/70 backdrop-blur-md text-secondary hover:text-on-surface hover:bg-surface-container-high font-label-lg text-label-lg transition-all shadow-sm"
                    href="#order-tracking"
                  >
                    <span className="material-symbols-outlined text-xl">track_changes</span>
                    <span>پیگیری سفارش فوری</span>
                  </a>
                </div>

                {/* Trust Badges Under CTA */}
                <div className="flex items-center gap-6 mt-10 text-on-surface-variant font-label-md text-label-md">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                    <span>صدور فاکتور رسمی</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-lg">verified</span>
                    <span>درگاه مستقیم بانکی</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-lg">shield</span>
                    <span>ضمانت اصالت کد</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual: Floating 3D Cards Showpiece */}
              <div className="relative w-full max-w-lg lg:max-w-md flex flex-col items-center justify-center">
                <div className="relative w-full aspect-[1.58/1] rounded-2xl p-6 bg-gradient-to-br from-surface-container-high/90 via-surface-container/80 to-surface-container-low/95 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden transform hover:-rotate-1 transition-all duration-500 border border-surface-container-highest/30">
                  <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary/20 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-container/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-2xl">videogame_asset</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">STEAM WALLET</span>
                          <span className="font-label-sm text-label-sm text-secondary">GLOBAL VIP CARD</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-label-sm font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                        تحویل آنی
                      </span>
                    </div>

                    <div className="flex items-center justify-between my-auto py-2">
                      <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-400/40 to-amber-200/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-amber-200/70 text-lg">memory</span>
                      </div>
                      <div className="font-display-lg text-headline-xl text-primary font-black tracking-widest" dir="ltr">
                        $50.00
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
                      <span className="font-mono tracking-wider" dir="ltr">**** **** 9204</span>
                      <span className="text-on-surface font-bold">ریجن: ایالات متحده</span>
                    </div>
                  </div>
                </div>

                {/* Overlapping Secondary Micro-Cards */}
                <div className="absolute -bottom-6 -right-4 w-4/5 aspect-[2.6/1] rounded-xl p-4 bg-surface-container-high/95 backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 border border-surface-container-highest/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-xl">bolt</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-label-md text-label-md text-on-surface font-bold">سفارش شماره #۸۲۹۱۹</span>
                      <span className="font-label-sm text-label-sm text-tertiary">کد لایسنس ارسال شد</span>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant" dir="ltr">۲ ثانیه پیش</span>
                </div>
              </div>
            </div>

            {/* 3 Live Stats Glass Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8 border-t border-surface-container-highest">
              <div className="p-6 rounded-2xl bg-surface-container/60 backdrop-blur-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">بیش از ۴۸,۰۰۰</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">تحویل موفق در سال جاری</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container/60 backdrop-blur-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-2xl">timer</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">۲۸ ثانیه</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">میانگین زمان تحویل کد</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container/60 backdrop-blur-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-2xl">thumb_up</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">۹۹.۴٪ رضایت</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">امتیاز کاربران گیفت‌هاب</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 1: POPULAR GAMING CATEGORIES (Exact from original site) */}
          <section className="w-full py-16 px-margin lg:px-margin-desktop bg-background relative" id="popular-categories">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-2 text-primary font-label-md text-label-md mb-2">
                    <span className="material-symbols-outlined text-lg">category</span>
                    <span>دسته‌بندی‌های محبوب و معتبر</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">
                    پلتفرم‌های پرطرفدار دارایی دیجیتال
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                
                {/* Steam */}
                <div
                  onClick={() => {
                    setActiveFilter('steam');
                    document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col items-center text-center relative overflow-hidden shadow-sm cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">sports_esports</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">استیم</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant" dir="ltr">Steam Wallet</span>
                  <span className="mt-3 px-2.5 py-1 rounded-lg bg-surface-container-lowest text-outline font-label-sm text-label-sm">
                    ۳۴ محصول فعال
                  </span>
                </div>

                {/* PlayStation */}
                <div
                  onClick={() => {
                    setActiveFilter('playstation');
                    document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col items-center text-center relative overflow-hidden shadow-sm cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-secondary text-3xl">stadia_controller</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">پلی‌استیشن</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant" dir="ltr">PlayStation PSN</span>
                  <span className="mt-3 px-2.5 py-1 rounded-lg bg-surface-container-lowest text-outline font-label-sm text-label-sm">
                    ۲۸ محصول فعال
                  </span>
                </div>

                {/* Xbox */}
                <div
                  onClick={() => {
                    setActiveFilter('xbox');
                    document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col items-center text-center relative overflow-hidden shadow-sm cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-tertiary text-3xl">gamepad</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">ایکس‌باکس</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant" dir="ltr">Xbox Game Pass</span>
                  <span className="mt-3 px-2.5 py-1 rounded-lg bg-surface-container-lowest text-outline font-label-sm text-label-sm">
                    ۲۲ محصول فعال
                  </span>
                </div>

                {/* Apple */}
                <div
                  onClick={() => {
                    setActiveFilter('all');
                    document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col items-center text-center relative overflow-hidden shadow-sm cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">devices</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">اپل و آیتونز</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant" dir="ltr">Apple & iTunes</span>
                  <span className="mt-3 px-2.5 py-1 rounded-lg bg-surface-container-lowest text-outline font-label-sm text-label-sm">
                    ۱۸ محصول فعال
                  </span>
                </div>

                {/* Google Play */}
                <div
                  onClick={() => {
                    setActiveFilter('all');
                    document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col items-center text-center relative overflow-hidden shadow-sm cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-tertiary text-3xl">shop</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">گوگل پلی</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant" dir="ltr">Google Play</span>
                  <span className="mt-3 px-2.5 py-1 rounded-lg bg-surface-container-lowest text-outline font-label-sm text-label-sm">
                    ۱۹ محصول فعال
                  </span>
                </div>

                {/* Nintendo */}
                <div
                  onClick={() => {
                    setActiveFilter('all');
                    document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col items-center text-center relative overflow-hidden shadow-sm cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">gamepad</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">نینتندو</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant" dir="ltr">Nintendo eShop</span>
                  <span className="mt-3 px-2.5 py-1 rounded-lg bg-surface-container-lowest text-outline font-label-sm text-label-sm">
                    ۱۵ محصول فعال
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: FLASH DEALS BANNER (Exact from original site) */}
          <section className="w-full py-8 px-margin lg:px-margin-desktop bg-background">
            <div className="max-w-7xl mx-auto rounded-3xl p-8 lg:p-10 bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden border border-surface-container-highest/30">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
                
                {/* Content & Timer */}
                <div className="flex flex-col text-right max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-error-container/40 text-error font-label-md text-label-md font-bold mb-3 w-fit">
                    <span className="material-symbols-outlined text-sm">alarm</span>
                    <span>پیشنهاد شگفت‌انگیز ۲۴ ساعته</span>
                  </div>

                  <h2 className="font-headline-xl text-headline-xl font-black text-on-surface mb-2">
                    جشنواره تخفیف‌های آتشین آخر هفته
                  </h2>

                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                    با هر خرید از دسته گیفت‌کارت‌های استیم آمریکا و پلی‌استیشن، ۵٪ کش‌بک مستقیم به کیف پول خود هدیه بگیرید!
                  </p>

                  {/* Digital Countdown Blocks */}
                  <div className="flex items-center gap-3" dir="ltr" id="countdown-timer">
                    <div className="flex flex-col items-center justify-center p-3 w-16 rounded-xl bg-surface-container-lowest shadow-sm">
                      <span className="font-headline-xl text-headline-xl font-black text-secondary timer-hours">
                        {String(hours).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline mt-1">ساعت</span>
                    </div>
                    <span className="font-headline-xl text-headline-xl text-outline-variant font-bold">:</span>
                    <div className="flex flex-col items-center justify-center p-3 w-16 rounded-xl bg-surface-container-lowest shadow-sm">
                      <span className="font-headline-xl text-headline-xl font-black text-primary timer-minutes">
                        {String(minutes).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline mt-1">دقیقه</span>
                    </div>
                    <span className="font-headline-xl text-headline-xl text-outline-variant font-bold">:</span>
                    <div className="flex flex-col items-center justify-center p-3 w-16 rounded-xl bg-surface-container-lowest shadow-sm">
                      <span className="font-headline-xl text-headline-xl font-black text-tertiary timer-seconds">
                        {String(seconds).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline mt-1">ثانیه</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Block */}
                <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                  <div className="p-6 rounded-2xl bg-surface-container-lowest/80 backdrop-blur-md flex flex-col items-center text-center gap-3 w-full sm:w-64 border border-surface-container-highest/30">
                    <span className="font-label-md text-label-md text-on-surface-variant">کد تخفیف اختصاصی:</span>
                    <div className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-primary font-mono font-bold text-center tracking-widest text-lg select-all" dir="ltr">
                      LUKYSALE
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('LUKYSALE');
                        setCouponCode('LUKYSALE');
                        setAppliedDiscount(10);
                        showToast('کد تخفیف LUKYSALE کپی شد و ۱۰٪ تخفیف روی سبد اعمال گردید.');
                      }}
                      className="text-xs text-secondary hover:underline flex items-center gap-1 font-label-sm text-label-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      <span>کپی کردن کد</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: BEST SELLERS (Exact from original site with fully functional buttons) */}
          <section className="w-full py-16 px-margin lg:px-margin-desktop bg-surface-container-lowest" id="best-sellers">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-2 text-tertiary font-label-md text-label-md mb-2">
                    <span className="material-symbols-outlined text-lg">local_fire_department</span>
                    <span>انتخاب پرفروش گیمرهای ایرانی</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">
                    پرفروش‌ترین گیفت‌کارت‌های GiftHub
                  </h2>
                </div>

                {/* 1. FILTER CHIPS (دکمه‌های انتخاب انواع گیفت کارت ها) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-xl font-label-md text-label-md font-bold whitespace-nowrap shadow-sm cursor-pointer transition-all ${
                      activeFilter === 'all'
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    همه موارد
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFilter('steam')}
                    className={`px-4 py-2 rounded-xl font-label-md text-label-md whitespace-nowrap cursor-pointer transition-all ${
                      activeFilter === 'steam'
                        ? 'bg-primary-container text-on-primary-container font-bold'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    استیم (Steam)
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFilter('playstation')}
                    className={`px-4 py-2 rounded-xl font-label-md text-label-md whitespace-nowrap cursor-pointer transition-all ${
                      activeFilter === 'playstation'
                        ? 'bg-primary-container text-on-primary-container font-bold'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    پلی‌استیشن (PSN)
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFilter('xbox')}
                    className={`px-4 py-2 rounded-xl font-label-md text-label-md whitespace-nowrap cursor-pointer transition-all ${
                      activeFilter === 'xbox'
                        ? 'bg-primary-container text-on-primary-container font-bold'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    ایکس‌باکس (Xbox)
                  </button>
                </div>
              </div>

              {/* 6 DETAILED CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const denom = selectedDenominations[product.id] || product.activeDenomination;
                  const isFavorited = favoriteIds.includes(product.id);
                  const isJustAdded = justAddedId === product.id;

                  return (
                    <div
                      key={product.id}
                      className="p-6 rounded-2xl bg-surface-container hover:bg-surface-container-high/90 transition-all flex flex-col justify-between shadow-sm group border border-surface-container-highest/20"
                    >
                      <div>
                        {/* Region & Star Rating */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 rounded-full bg-surface-container-highest text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">public</span>
                            ریجن: {product.region}
                          </span>
                          <div className="flex items-center gap-1 text-amber-300 font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                            <span className="font-bold">{product.rating}</span>
                            <span className="text-outline font-normal">({product.reviewsCount} نظر)</span>
                          </div>
                        </div>

                        {/* Mini Graphic Preview */}
                        <div className="w-full aspect-[2/1] rounded-xl p-4 bg-gradient-to-tr from-surface-container-lowest to-surface-container-highest flex items-center justify-between mb-5 relative overflow-hidden border border-surface-container-highest/30">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl ${product.iconBgClass} flex items-center justify-center`}>
                              <span className="material-symbols-outlined text-3xl">{product.iconName}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="font-label-lg text-label-lg font-bold text-on-surface">
                                {product.titleEn}
                              </span>
                              <span className={`font-headline-sm text-headline-sm ${product.textAccentClass} font-black`} dir="ltr">
                                {denom.usdLabel}
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm font-bold">
                            تحویل آنی
                          </span>
                        </div>

                        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
                          {product.titleFa}
                        </h3>

                        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4">
                          {product.description}
                        </p>

                        {/* INTERACTIVE DENOMINATIONS SELECTOR (دکمه‌های انتخاب انواع گیفت کارت ها) */}
                        <div className="mb-4">
                          <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1.5 text-right">
                            انتخاب مبلغ و نوع کارت:
                          </span>
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                            {product.denominations.map((d) => {
                              const isSelected = denom.id === d.id;
                              return (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => handleSelectDenomination(product.id, d)}
                                  className={`px-2.5 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                    isSelected
                                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                                      : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
                                  }`}
                                >
                                  {d.usdLabel}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Price & Action Buttons */}
                      <div className="pt-4 mt-2 border-t border-surface-container-highest flex flex-col gap-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-outline line-through font-label-md text-label-md" dir="ltr">
                            {formatTomans(denom.oldPriceTomans)} تومان
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="font-display-lg text-headline-xl font-extrabold text-on-surface">
                              {formatTomans(denom.priceTomans)}
                            </span>
                            <span className="font-label-md text-label-md text-on-surface-variant font-bold">
                              تومان
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Add to Cart Button (Interactive) */}
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className={`flex-1 py-3 px-4 rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                              isJustAdded
                                ? 'bg-tertiary text-on-tertiary'
                                : 'bg-primary-container hover:bg-primary text-on-primary-container'
                            }`}
                          >
                            <span className="material-symbols-outlined text-xl">
                              {isJustAdded ? 'check_circle' : 'shopping_cart'}
                            </span>
                            <span>{isJustAdded ? 'به سبد اضافه شد ✓' : 'خرید سریع و آنی'}</span>
                          </button>

                          {/* Favorite Button (Interactive) */}
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(product.id)}
                            className={`p-3 rounded-xl transition-colors cursor-pointer ${
                              isFavorited
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-highest hover:bg-surface-bright text-on-surface'
                            }`}
                            title="نشان کردن محصول"
                          >
                            <span className="material-symbols-outlined text-xl">
                              {isFavorited ? 'bookmark' : 'bookmark_border'}
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
                          <span className="flex items-center gap-1 text-tertiary">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            موجود در انبار (تحویل اتوماتیک)
                          </span>
                          <span>کد اسکن‌شده رسمی</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 4: WHY GIFTHUB? (Exact from original site) */}
          <section className="w-full py-20 px-margin lg:px-margin-desktop bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-14">
              <div className="flex flex-col items-center max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 text-primary font-label-md text-label-md font-bold mb-3">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>امنیت و سرعت بی‌رقیب</span>
                </div>
                <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mb-3">
                  چرا گیمرها GiftHub را انتخاب می‌کنند؟
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  تجربه‌ای مدرن و شفاف از خرید لایسنس‌ها بدون واسطه، با بهره‌گیری از هوشمندترین سیستم صدور خودکار کد در ایران.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-right">
                
                <div className="p-6 rounded-2xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-4 shadow-sm hover:bg-surface-container transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">sms</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">تحویل اتوماتیک پیامکی و آنی</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    بلافاصله پس از پرداخت موفق، کد گیفت‌کارت به صورت همزمان در صفحه سایت، ایمیل و پیامک تلفن همراه شما درج می‌گردد.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-4 shadow-sm hover:bg-surface-container transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-3xl">document_scanner</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">اسکن رسمی و تضمین اصالت</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    تمامی کارت‌ها از فروشگاه‌های رسمی بین‌المللی خریداری شده و همراه با اسکن فیزیکی معتبر و قانونی در پنل کاربری ثبت می‌شوند.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-4 shadow-sm hover:bg-surface-container transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary text-3xl">support_agent</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">پشتیبانی تخصصی گیمینگ ۲۴/۷</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    کارشناسان گیمر گیفت‌هاب در تمام ساعات شبانه‌روز آماده راهنمایی شما در مراحل فعال‌سازی، تغییر ریجن و رفع خطاهای اکانت هستند.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-surface-container/70 backdrop-blur-md flex flex-col gap-4 shadow-sm hover:bg-surface-container transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline text-3xl">currency_exchange</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">بهترین نرخ ارز بدون کارمزد</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    محاسبه قیمت‌ها با منصفانه‌ترین نرخ لحظه‌ای حواله ارزی و بدون هیچ‌گونه کارمزد پنهان یا مالیات مضاعف انجام می‌شود.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: SIMULATOR (Exact from original site) */}
          <section className="w-full py-12 px-margin lg:px-margin-desktop bg-surface-container-lowest">
            <div className="max-w-4xl mx-auto rounded-3xl p-8 bg-surface-container/90 backdrop-blur-xl shadow-xl flex flex-col items-center text-center gap-6 border border-surface-container-highest/30">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-2xl">terminal</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  شبیه‌ساز تحویل فوری کد در گیفت‌هاب
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-lg">
                  یک نمونه کد لایسنس تستی تولید کنید تا سرعت و قالب صدور لایسنس‌های دیجیتال خودکار ما را مشاهده فرمایید.
                </p>
              </div>

              <div className="w-full max-w-md p-4 rounded-xl bg-surface-container-lowest font-mono text-secondary text-center tracking-widest text-lg select-all border border-surface-container-highest/40" dir="ltr">
                STEA-9X4F-KQ2L-88WZ
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('STEA-9X4F-KQ2L-88WZ');
                  showToast('کد لایسنس تستی در کلیپ‌بورد کپی شد!');
                }}
                className="px-6 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md text-label-md font-bold hover:brightness-110 transition-all cursor-pointer"
              >
                کپی کردن کد لایسنس
              </button>
            </div>
          </section>

          {/* SECTION 7: TESTIMONIALS (Exact from original site) */}
          <section className="w-full py-16 px-margin lg:px-margin-desktop bg-surface-container-lowest">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-2 text-primary font-label-md text-label-md mb-2">
                    <span className="material-symbols-outlined text-lg">forum</span>
                    <span>نظرات خریداران واقعی GiftHub</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">
                    تجربه گیمرها از خرید در گیفت‌هاب
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
                <div className="p-6 rounded-2xl bg-surface-container flex flex-col justify-between gap-4 border border-surface-container-highest/20">
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    «خرید ۵۰ دلاری استیم والت آمریکا رو زدم، به ۳۰ ثانیه نرسید که کد روی صفحه اومد و اس‌ام‌اس هم شد. بدون مشکل روی اکانت شارژ شد.»
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-surface-container-highest">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">سجاد م.</span>
                    <span className="font-label-sm text-label-sm text-tertiary">خریدار تایید شده</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface-container flex flex-col justify-between gap-4 border border-surface-container-highest/20">
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    «اشتراک گیم‌پس آلتیمیت خریدم، پشتیبانی تلگرام در عرض ۱۰ دقیقه راهنمایی کرد و ریجن اکانتم رو بدون ارور تغییر دادیم.»
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-surface-container-highest">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">آرمان ک.</span>
                    <span className="font-label-sm text-label-sm text-tertiary">خریدار تایید شده</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface-container flex flex-col justify-between gap-4 border border-surface-container-highest/20">
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    «قیمت‌ها نسبت به بقیه جاها کاملاً منصفانه بود و همراهش تصویر اسکن فیزیکی رو هم دادن که خیالم از بابت بن نشدن اکانت راحت شد.»
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-surface-container-highest">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">نیلوفر ر.</span>
                    <span className="font-label-sm text-label-sm text-tertiary">خریدار تایید شده</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8: USER PROFILE (Exact from original site) */}
          <section id="user-profile" className="w-full py-10 px-margin lg:px-margin-desktop bg-background">
            <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-surface-container text-right border border-surface-container-highest/20">
              <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">حساب کاربری</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                وضعیت حساب شما: <strong className="text-primary font-bold">کاربر VIP</strong> • موجودی کیف پول شبیه‌سازی شده: <strong className="text-tertiary font-bold">۵,۲۰۰,۰۰۰ تومان</strong>
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="inline-flex mt-4 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold cursor-pointer"
              >
                مشاهده سبد خرید ({cartCount})
              </button>
            </div>
          </section>

          {/* SECTION 9: ORDER TRACKING (Exact from original site with live code search) */}
          <section id="order-tracking" className="w-full py-12 px-margin lg:px-margin-desktop bg-surface-container-lowest">
            <div className="max-w-4xl mx-auto rounded-2xl p-6 bg-surface-container flex flex-col gap-4 border border-surface-container-highest/20">
              <div className="text-right">
                <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">پیگیری سفارش</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  کد سفارش (مانند GH-82919) یا شماره موبایل خود را وارد نمایید:
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTrackSearched(true);
                  const q = trackQuery.trim().toUpperCase();
                  if (!q) {
                    setTrackedOrder(orders[0] || null);
                    return;
                  }
                  const found = orders.find(
                    (o) => o.orderId.toUpperCase().includes(q) || o.customerPhone.includes(q)
                  );
                  setTrackedOrder(found || null);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className="flex-1 bg-surface-container-lowest py-3 px-4 rounded-xl text-on-surface font-body-md text-body-md border border-surface-container-highest/40 focus:outline-none focus:border-primary"
                  placeholder="کد سفارش مانند GH-82919..."
                />
                <button
                  className="px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold cursor-pointer"
                  type="submit"
                >
                  بررسی سفارش
                </button>
              </form>

              {/* Order Result display */}
              {trackedOrder ? (
                <div className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant font-body-md text-body-md text-right border border-surface-container-highest/30 space-y-3">
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="font-bold">سفارش شماره {trackedOrder.orderId}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm font-bold">
                      {trackedOrder.status}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    {trackedOrder.items.map((it, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-surface-container flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-sm">{it.title}</span>
                          <span className="text-xs text-secondary">{it.usdLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-primary text-sm font-bold" dir="ltr">{it.code}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(it.code);
                              showToast('کد فعال‌سازی کپی شد!');
                            }}
                            className="p-1 rounded text-secondary hover:text-on-surface cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">content_copy</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : trackSearched ? (
                <div className="p-4 rounded-xl bg-surface-container-low text-error font-body-md text-body-md text-right">
                  سفارشی با این شناسه در اطلاعات این مرورگر یافت نشد.
                </div>
              ) : null}
            </div>
          </section>

          {/* SECTION 10: FAQ (Exact from original site with accordion toggle) */}
          <section className="w-full py-16 px-margin lg:px-margin-desktop bg-background" id="faq">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 text-secondary font-label-md text-label-md mb-2">
                  <span className="material-symbols-outlined text-base">help</span>
                  <span>پاسخ به ابهامات متداول</span>
                </div>
                <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">
                  سوالات متداول کاربران
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                
                {/* FAQ 1 */}
                <div className={`faq-item rounded-2xl ${openFaqIndex === 0 ? 'bg-surface-container-high' : 'bg-surface-container'} transition-colors overflow-hidden border border-surface-container-highest/20`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                    className="w-full p-6 text-right flex items-center justify-between font-headline-sm text-headline-sm font-bold text-on-surface cursor-pointer"
                  >
                    <span>چقدر طول می‌کشد تا کد گیفت‌کارت پس از پرداخت به دستم برسد؟</span>
                    <span className={`material-symbols-outlined text-secondary transition-transform duration-300 ${openFaqIndex === 0 ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {openFaqIndex === 0 && (
                    <div className="px-6 pb-6 font-body-md text-body-md text-on-surface-variant leading-relaxed text-right">
                      سیستم گیفت‌هاب کاملاً مکانیزه و اتوماتیک است. بلافاصله پس از تکمیل تراکنش بانکی، کد لایسنس کمتر از ۳۰ ثانیه روی صفحه سایت به شما نمایش داده شده و همزمان به شماره موبایل شما پیامک می‌شود.
                    </div>
                  )}
                </div>

                {/* FAQ 2 */}
                <div className={`faq-item rounded-2xl ${openFaqIndex === 1 ? 'bg-surface-container-high' : 'bg-surface-container'} transition-colors overflow-hidden border border-surface-container-highest/20`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                    className="w-full p-6 text-right flex items-center justify-between font-headline-sm text-headline-sm font-bold text-on-surface cursor-pointer"
                  >
                    <span>چگونه مطمئن شوم کد خریداری‌شده معتبر و قانونی است؟</span>
                    <span className={`material-symbols-outlined text-secondary transition-transform duration-300 ${openFaqIndex === 1 ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {openFaqIndex === 1 && (
                    <div className="px-6 pb-6 font-body-md text-body-md text-on-surface-variant leading-relaxed text-right">
                      تمام کارت‌ها مستقیماً از نمایندگی‌ها و استورهای معتبر خارجی خریداری می‌شوند و دارای اسکن فیزیکی با بارکد رسمی و ضمانت مادام‌العمر سلامت کد هستند.
                    </div>
                  )}
                </div>

                {/* FAQ 3 */}
                <div className={`faq-item rounded-2xl ${openFaqIndex === 2 ? 'bg-surface-container-high' : 'bg-surface-container'} transition-colors overflow-hidden border border-surface-container-highest/20`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                    className="w-full p-6 text-right flex items-center justify-between font-headline-sm text-headline-sm font-bold text-on-surface cursor-pointer"
                  >
                    <span>اگر هنگام فعال‌سازی کد روی اکانت با ارور مواجه شدم چه کار کنم؟</span>
                    <span className={`material-symbols-outlined text-secondary transition-transform duration-300 ${openFaqIndex === 2 ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {openFaqIndex === 2 && (
                    <div className="px-6 pb-6 font-body-md text-body-md text-on-surface-variant leading-relaxed text-right">
                      تیم پشتیبانی ۲۴ ساعته گیفت‌هاب در تلگرام و تلفن همراه شماست تا ریجن، آی‌پی و مراحل فعال‌سازی را قدم‌به‌قدم برای شما چک کند.
                    </div>
                  )}
                </div>

                {/* FAQ 4 */}
                <div className={`faq-item rounded-2xl ${openFaqIndex === 3 ? 'bg-surface-container-high' : 'bg-surface-container'} transition-colors overflow-hidden border border-surface-container-highest/20`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
                    className="w-full p-6 text-right flex items-center justify-between font-headline-sm text-headline-sm font-bold text-on-surface cursor-pointer"
                  >
                    <span>آیا کدهای خریداری‌شده تاریخ انقضا دارند؟</span>
                    <span className={`material-symbols-outlined text-secondary transition-transform duration-300 ${openFaqIndex === 3 ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {openFaqIndex === 3 && (
                    <div className="px-6 pb-6 font-body-md text-body-md text-on-surface-variant leading-relaxed text-right">
                      کارت‌های اعتباری استیم، پلی‌استیشن و اپل هیچ تاریخ انقضایی ندارند و در هر زمانی قابل استفاده در اکانت هستند.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER (Exact from original site) */}
      <footer className="w-full bg-surface-container-lowest relative pt-16 pb-12 mt-20 border-t border-surface-container-highest/40 text-right">
        <div className="max-w-7xl mx-auto px-margin lg:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop mb-16">
            
            <div className="lg:col-span-4 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">sports_esports</span>
                </div>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">GiftHub | گیفت‌هاب</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                دنیای کارت‌های دیجیتال، در یک جا! معتبرترین سامانه خرید آنی و مکانیزه گیفت‌کارت‌های گیمینگ و اشتراک‌های بین‌المللی با تحویل آنی کمتر از ۳۰ ثانیه در تمام ساعات شبانه‌روز.
              </p>
              <div className="flex items-center gap-space-sm pt-2">
                <span className="px-3 py-1.5 rounded-lg bg-surface-container text-tertiary font-label-sm text-label-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  تضمین بازگشت وجه
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-surface-container text-secondary font-label-sm text-label-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">support_agent</span>
                  پشتیبانی ۲۴ ساعته
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-space-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">دسته‌بندی‌ها</h3>
              <ul className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant">
                <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveFilter('steam')}>
                  گیفت کارت استیم
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveFilter('playstation')}>
                  گیفت کارت پلی‌استیشن
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveFilter('xbox')}>
                  گیفت کارت ایکس‌باکس
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveFilter('all')}>
                  گیفت کارت اپل و آیتونز
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveFilter('all')}>
                  گیفت کارت گوگل پلی
                </li>
                <li className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveFilter('all')}>
                  گیفت کارت نینتندو
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 flex flex-col gap-space-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">مرکز پشتیبانی</h3>
              <div className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary">call</span>
                  <span className="font-label-lg text-label-lg text-on-surface" dir="ltr">۰۲۱ - ۹۱۰۰۸۸۷۷</span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-secondary">chat</span>
                  <span>پشتیبانی تلگرام: @GiftHub_Support</span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-tertiary">schedule</span>
                  <span>پاسخگویی سریع ۲۴/۷ آنلاین</span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-outline">mail</span>
                  <span dir="ltr">support@gifthub.ir</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col gap-space-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">باشگاه مشتریان و تخفیف‌ها</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">با عضویت در باشگاه VIP، جدیدترین کدهای تخفیف را زودتر دریافت کنید.</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
                  <input
                    className="bg-transparent px-3 py-2 text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none w-full text-right"
                    placeholder="شماره موبایل یا ایمیل..."
                    type="email"
                  />
                  <button
                    onClick={() => showToast('عضویت شما در باشگاه VIP با موفقیت ثبت شد!')}
                    className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary transition-colors whitespace-nowrap cursor-pointer"
                    type="button"
                  >
                    ثبت
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-space-sm pt-2">
                <div className="w-16 h-16 rounded-xl bg-surface-container flex flex-col items-center justify-center p-2 text-center text-outline-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-2xl text-secondary">verified</span>
                  <span className="font-label-sm text-label-sm">اینماد ۵ ستاره</span>
                </div>
                <div className="w-16 h-16 rounded-xl bg-surface-container flex flex-col items-center justify-center p-2 text-center text-outline-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-2xl text-tertiary">security</span>
                  <span className="font-label-sm text-label-sm">گواهی SSL</span>
                </div>
                <div className="w-16 h-16 rounded-xl bg-surface-container flex flex-col items-center justify-center p-2 text-center text-outline-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-2xl text-primary">award_star</span>
                  <span className="font-label-sm text-label-sm">ساماندهی</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 font-label-sm text-label-sm text-on-surface-variant">
            <p>© ۲۰۲۵ فروشگاه گیفت‌هاب (GiftHub). تمامی حقوق مادی و معنوی محفوظ است.</p>
            <div className="flex items-center gap-space-md">
              <a className="hover:text-primary transition-colors" href="#">قوانین و مقررات</a>
              <a className="hover:text-primary transition-colors" href="#">حریم خصوصی</a>
              <a className="hover:text-primary transition-colors" href="#">راهنمای فعال‌سازی</a>
            </div>
          </div>
        </div>
      </footer>

      {/* SLIDE-OVER CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-container-low h-full shadow-2xl flex flex-col justify-between z-10 border-r border-surface-container-highest text-right">
            
            <div className="p-5 border-b border-surface-container-highest flex items-center justify-between bg-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">shopping_bag</span>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">سبد خرید شما ({cartCount})</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant">سبد خرید شما خالی است.</div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.cartId} className="p-4 rounded-xl bg-surface-container flex items-center justify-between gap-3 border border-surface-container-highest/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-secondary text-2xl">{item.iconName}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface text-sm">{item.title}</span>
                        <span className="text-xs text-secondary">{item.usdLabel} • {item.region}</span>
                        <span className="text-xs text-on-surface-variant font-bold mt-1">{formatTomans(item.priceTomans)} ت</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCartItems((prev) =>
                              prev.map((i) => (i.cartId === item.cartId ? { ...i, qty: i.qty + 1 } : i))
                            );
                          }}
                          className="w-6 h-6 rounded bg-surface-container text-on-surface font-bold text-xs"
                        >
                          +
                        </button>
                        <span className="w-5 text-center text-xs font-bold font-mono">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCartItems((prev) =>
                              prev
                                .map((i) => (i.cartId === item.cartId ? { ...i, qty: i.qty - 1 } : i))
                                .filter((i) => i.qty > 0)
                            );
                          }}
                          className="w-6 h-6 rounded bg-surface-container text-on-surface font-bold text-xs"
                        >
                          -
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCartItems((prev) => prev.filter((i) => i.cartId !== item.cartId))}
                        className="text-outline hover:text-error text-sm p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-surface-container-highest bg-surface-container space-y-3">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="کد تخفیف (LUKYSALE)..."
                    className="flex-1 bg-surface-container-lowest px-3 py-2 rounded-lg text-xs text-on-surface border border-surface-container-highest/40"
                  />
                  <button type="submit" className="px-4 py-2 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-bold cursor-pointer">
                    اعمال
                  </button>
                </form>

                <div className="space-y-1 text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>مجموع ناخالص:</span>
                    <span className="font-mono text-on-surface">{formatTomans(cartSubtotal)} ت</span>
                  </div>
                  {cartDiscountAmount > 0 && (
                    <div className="flex justify-between text-tertiary">
                      <span>تخفیف ({appliedDiscount}٪):</span>
                      <span className="font-mono">- {formatTomans(cartDiscountAmount)} ت</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-on-surface pt-2 border-t border-surface-container-highest">
                    <span>مبلغ نهایی:</span>
                    <span className="text-secondary font-black">{formatTomans(cartGrandTotal)} تومان</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">credit_card</span>
                  <span>پرداخت و صدور آنی لایسنس</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SLIDE-OVER WISHLIST DRAWER */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)} />
          <div className="relative w-full max-w-md bg-surface-container-low h-full shadow-2xl flex flex-col justify-between z-10 border-r border-surface-container-highest text-right">
            <div className="p-5 border-b border-surface-container-highest flex items-center justify-between bg-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">bookmark</span>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">لیست نشان‌شده‌ها ({favoriteIds.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {favoriteIds.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant">هیچ کارتی در لیست علاقه‌مندی‌ها نشان نشده است.</div>
              ) : (
                ORIGINAL_PRODUCTS.filter((p) => favoriteIds.includes(p.id)).map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-surface-container flex items-center justify-between gap-3 border border-surface-container-highest/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl">{p.iconName}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface text-sm">{p.titleFa}</span>
                        <span className="text-xs text-on-surface-variant">{p.activeDenomination.usdLabel} • {p.region}</span>
                        <span className="text-xs text-primary font-bold mt-1">{formatTomans(p.activeDenomination.priceTomans)} ت</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleAddToCart(p);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-bold cursor-pointer"
                      >
                        + سبد
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(p.id)}
                        className="text-outline hover:text-error text-sm p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* INSTANT CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCheckoutOpen(false)} />
          <div className="relative w-full max-w-lg bg-surface-container-low rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-surface-container-highest text-right space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">درگاه پرداخت و تحویل لایسنس</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">شماره همراه جهت ارسال پیامکی کد لایسنس:</label>
                <input
                  type="tel"
                  required
                  defaultValue="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-surface-container py-2.5 px-4 rounded-xl text-on-surface text-sm border border-surface-container-highest/50"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">انتخاب درگاه بانکی شاپرک:</label>
                <div className="p-3 rounded-xl bg-surface-container border border-primary/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_balance</span>
                    <span className="text-sm font-bold text-on-surface">به‌پرداخت ملت (شاپرک) - تحویل آنی</span>
                  </div>
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-lowest text-xs space-y-1.5 text-on-surface-variant">
                <div className="flex justify-between">
                  <span>تعداد اقلام:</span>
                  <span className="text-on-surface font-bold font-mono">{cartCount} عدد</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-on-surface pt-1 border-t border-surface-container-highest">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="text-secondary font-black">{formatTomans(cartGrandTotal)} تومان</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-l from-primary-container to-secondary text-on-primary font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:brightness-110"
              >
                <span className="material-symbols-outlined text-xl">payments</span>
                <span>پرداخت و مشاهده آنی لایسنس</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
