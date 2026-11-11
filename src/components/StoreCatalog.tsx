import React, { useState, useMemo } from 'react';
import { GIFT_CARDS } from '../data/giftCards';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { PlatformType } from '../types';
import { formatTomans } from '../utils/formatters';
import { SlidersHorizontal, Grid, List, RotateCcw, Zap, Search, Flame } from 'lucide-react';

export const StoreCatalog: React.FC = () => {
  const {
    selectedPlatformFilter,
    setSelectedPlatformFilter,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [priceMax, setPriceMax] = useState<number>(7000000);
  const [onlyInstant, setOnlyInstant] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'cheapest' | 'expensive' | 'rating'>('featured');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const platforms: { id: PlatformType; label: string }[] = [
    { id: 'all', label: 'همه کارت‌ها' },
    { id: 'steam', label: 'استیم (Steam)' },
    { id: 'playstation', label: 'پلی‌استیشن (PSN)' },
    { id: 'xbox', label: 'ایکس‌باکس (Xbox)' },
    { id: 'apple', label: 'اپل و آیتونز' },
    { id: 'googleplay', label: 'گوگل پلی' },
    { id: 'nintendo', label: 'نینتندو' },
    { id: 'spotify', label: 'اسپاتیفای' },
    { id: 'razer', label: 'ریزر گلد' },
    { id: 'netflix', label: 'نتفلیکس' },
  ];

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return GIFT_CARDS.filter((product) => {
      // Platform match
      if (selectedPlatformFilter !== 'all' && product.platform !== selectedPlatformFilter) {
        return false;
      }

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesFa = product.titleFa.toLowerCase().includes(q);
        const matchesEn = product.titleEn.toLowerCase().includes(q);
        const matchesPlatform = product.platformNameFa.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesFa && !matchesEn && !matchesPlatform && !matchesDesc) {
          return false;
        }
      }

      // Instant delivery match
      if (onlyInstant && !product.isInstant) {
        return false;
      }

      // Price filter match (check if any denomination is <= priceMax)
      const minDenomPrice = Math.min(...product.denominations.map((d) => d.priceTomans));
      if (minDenomPrice > priceMax) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'cheapest') {
        const minA = Math.min(...a.denominations.map((d) => d.priceTomans));
        const minB = Math.min(...b.denominations.map((d) => d.priceTomans));
        return minA - minB;
      }
      if (sortBy === 'expensive') {
        const maxA = Math.max(...a.denominations.map((d) => d.priceTomans));
        const maxB = Math.max(...b.denominations.map((d) => d.priceTomans));
        return maxB - maxA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'featured'
      return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
    });
  }, [selectedPlatformFilter, searchQuery, onlyInstant, priceMax, sortBy]);

  const handleResetFilters = () => {
    setSelectedPlatformFilter('all');
    setSearchQuery('');
    setPriceMax(7000000);
    setOnlyInstant(false);
    setSortBy('featured');
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#090C15]" id="catalog-section">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>انتخاب پرفروش گیمرهای ایرانی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              فروشگاه گیفت‌کارت‌های GiftHub
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Grid / List Layout Switcher */}
            <div className="flex items-center bg-[#171d31] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  layout === 'grid'
                    ? 'bg-gradient-to-r from-[#6936d7] to-[#a078ff] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="نمایش شبکه‌ای"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayout('list')}
                className={`p-2 rounded-lg transition-colors ${
                  layout === 'list'
                    ? 'bg-gradient-to-r from-[#6936d7] to-[#a078ff] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="نمایش سطری"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171d31] border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-[#202842] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی فیلترها</span>
            </button>
          </div>
        </div>

        {/* Platform Selection Chips (دکمه‌های انتخاب انواع گیفت کارت ها) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {platforms.map((p) => {
            const isSelected = selectedPlatformFilter === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlatformFilter(p.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-l from-[#6936d7] via-[#8c5cf6] to-[#a078ff] text-white border-transparent shadow-[0_4px_16px_rgba(140,92,246,0.35)]'
                    : 'bg-[#14192b] text-slate-300 border-white/10 hover:text-white hover:bg-[#1c233c] hover:border-white/20'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar: Price slider, Instant toggle, Sort tabs, Search */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#131728]/90 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Price Range Slider */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex flex-col gap-1 w-full sm:w-60">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>سقف قیمت:</span>
                <span className="text-cyan-300 font-bold">
                  تا {formatTomans(priceMax)} تومان
                </span>
              </div>
              <input
                type="range"
                min={300000}
                max={7000000}
                step={100000}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-[#0b0e17] rounded-lg"
              />
            </div>
          </div>

          {/* Instant Delivery Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyInstant}
              onChange={(e) => setOnlyInstant(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 accent-cyan-400 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              فقط کالاهای دارای تحویل آنی
            </span>
          </label>

          {/* Sorting Tabs */}
          <div className="flex items-center gap-1.5 bg-[#0b0e17] p-1 rounded-xl border border-white/10 text-xs overflow-x-auto w-full md:w-auto">
            <span className="text-slate-400 px-2 font-medium shrink-0">مرتب‌سازی:</span>
            <button
              type="button"
              onClick={() => setSortBy('featured')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors shrink-0 ${
                sortBy === 'featured'
                  ? 'bg-[#a078ff] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              محبوب‌ترین
            </button>
            <button
              type="button"
              onClick={() => setSortBy('cheapest')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors shrink-0 ${
                sortBy === 'cheapest'
                  ? 'bg-[#a078ff] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ارزان‌ترین
            </button>
            <button
              type="button"
              onClick={() => setSortBy('expensive')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors shrink-0 ${
                sortBy === 'expensive'
                  ? 'bg-[#a078ff] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              گران‌ترین
            </button>
            <button
              type="button"
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors shrink-0 ${
                sortBy === 'rating'
                  ? 'bg-[#a078ff] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              امتیاز بالا
            </button>
          </div>
        </div>

        {/* Product Count indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            نمایش <strong className="text-white">{filteredProducts.length}</strong> محصول منطبق
          </span>
          {searchQuery && (
            <span>
              نتیجه برای عبارت: <strong className="text-cyan-300">«{searchQuery}»</strong>
            </span>
          )}
        </div>

        {/* Product Grid / List */}
        {filteredProducts.length > 0 ? (
          <div
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} layout={layout} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="p-16 rounded-3xl bg-[#14192b]/50 border border-white/10 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white">محصولی با این مشخصات پیدا نشد!</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              لطفاً عنوان جستجو را تغییر داده یا فیلتر قیمت و دسته‌بندی را بازنشانی کنید.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-[#a078ff] hover:bg-[#8c5cf6] text-white font-bold text-xs transition-colors"
            >
              بازنشانی فیلترها و مشاهده همه
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
