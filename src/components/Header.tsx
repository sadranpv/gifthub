import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, Search, Menu, X, Gamepad2, ShieldCheck, Zap, PhoneCall } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
    favorites,
    setIsCartOpen,
    setIsWishlistOpen,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'store' | 'tracking' | 'faq') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col">
      {/* Top Notification Bar */}
      <div className="w-full bg-[#07090F]/95 backdrop-blur-md px-4 py-1.5 border-b border-white/5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-emerald-400 font-medium text-xs sm:text-sm">
              وضعیت سرور: فعال و آماده تحویل آنی
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              تحویل آنی و خودکار کدها کمتر از ۳۰ ثانیه
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              ضمانت ۱۰۰٪ اصالت کارت‌ها با اسکن فیزیکی
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:02191008877"
              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <span>پشتیبانی ۲۴/۷</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-[#101422]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Search */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 group text-right cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6936d7] to-[#a078ff] flex items-center justify-center p-2 shadow-[0_0_25px_rgba(160,120,255,0.4)] group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-[#a078ff] transition-colors">
                  گیفت‌هاب
                </span>
                <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
                  GiftHub Luxury
                </span>
              </div>
            </button>

            {/* Live Search Bar */}
            <div className="relative hidden xl:flex items-center w-72">
              <Search className="w-4 h-4 absolute right-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'store' && e.target.value.trim()) {
                    setActiveTab('store');
                  }
                }}
                placeholder="جستجوی بازی، استیم، پلی‌استیشن..."
                className="w-full bg-[#171d31] border border-white/10 py-2.5 pr-10 pl-4 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#a078ff] focus:ring-1 focus:ring-[#a078ff] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#171d31]/80 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-[#6936d7] to-[#8c5cf6] text-white shadow-[0_4px_16px_rgba(140,92,246,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => handleNavClick('store')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'store'
                  ? 'bg-gradient-to-r from-[#6936d7] to-[#8c5cf6] text-white shadow-[0_4px_16px_rgba(140,92,246,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              فروشگاه گیفت‌کارت‌ها
            </button>
            <button
              onClick={() => handleNavClick('tracking')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'tracking'
                  ? 'bg-gradient-to-r from-[#6936d7] to-[#8c5cf6] text-white shadow-[0_4px_16px_rgba(140,92,246,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              پیگیری سفارش
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'faq'
                  ? 'bg-gradient-to-r from-[#6936d7] to-[#8c5cf6] text-white shadow-[0_4px_16px_rgba(140,92,246,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              سوالات متداول
            </button>
          </nav>

          {/* User Actions: Favorites, Cart, Profile */}
          <div className="flex items-center gap-3">
            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#171d31] border border-white/10 text-slate-300 hover:text-red-400 hover:bg-[#202842] transition-all flex items-center justify-center group"
              title="لیست علاقه‌مندی‌ها"
            >
              <Heart
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  favorites.length > 0 ? 'text-red-400 fill-red-400' : ''
                }`}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-pulse">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-gradient-to-tr from-[#171d31] to-[#202740] border border-cyan-500/30 text-white hover:border-cyan-400 transition-all flex items-center justify-center group shadow-[0_0_15px_rgba(76,215,246,0.15)]"
              title="سبد خرید شما"
            >
              <ShoppingBag className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-cyan-400 text-[#0B0E17] text-[11px] font-black flex items-center justify-center shadow-[0_0_12px_rgba(76,215,246,0.8)]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="hidden sm:block h-8 w-px bg-white/10"></div>

            {/* VIP User Profile / Wallet Status */}
            <div className="hidden sm:flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-[#171d31]/90 border border-white/10 hover:border-[#a078ff]/40 transition-all">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  کاربر VIP
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  اعتبار: ۵,۲۰۰,۰۰۰ ت
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                VIP
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#171d31] text-slate-300 hover:text-white lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0d101c] p-4 flex flex-col gap-3">
            <div className="relative w-full mb-2">
              <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'store') setActiveTab('store');
                }}
                placeholder="جستجوی بازی و گیفت‌کارت..."
                className="w-full bg-[#171d31] border border-white/10 py-2.5 pr-10 pl-4 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`p-3 rounded-xl text-right text-sm font-semibold ${
                activeTab === 'home' ? 'bg-[#a078ff] text-white' : 'text-slate-300'
              }`}
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => handleNavClick('store')}
              className={`p-3 rounded-xl text-right text-sm font-semibold ${
                activeTab === 'store' ? 'bg-[#a078ff] text-white' : 'text-slate-300'
              }`}
            >
              فروشگاه گیفت‌کارت‌ها
            </button>
            <button
              onClick={() => handleNavClick('tracking')}
              className={`p-3 rounded-xl text-right text-sm font-semibold ${
                activeTab === 'tracking' ? 'bg-[#a078ff] text-white' : 'text-slate-300'
              }`}
            >
              پیگیری سفارش
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className={`p-3 rounded-xl text-right text-sm font-semibold ${
                activeTab === 'faq' ? 'bg-[#a078ff] text-white' : 'text-slate-300'
              }`}
            >
              سوالات متداول
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
