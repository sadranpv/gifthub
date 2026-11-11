import React from 'react';
import { POPULAR_CATEGORIES } from '../data/giftCards';
import { useStore } from '../context/StoreContext';
import { PlatformType } from '../types';
import { LayoutGrid } from 'lucide-react';

export const PopularCategories: React.FC = () => {
  const { setSelectedPlatformFilter, setActiveTab } = useStore();

  const handleCategoryClick = (platformId: string) => {
    setSelectedPlatformFilter(platformId as PlatformType);
    setActiveTab('store');
    // Scroll smoothly to catalog
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#0B0E17]" id="popular-categories">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <span>دسته‌بندی‌های برگزیده گیمینگ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              انتخاب سریع بر اساس پلتفرم
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md text-right">
            دسترسی آسان به پرطرفدارترین سرویس‌های استریم، بازی‌های کنسولی و فروشگاه‌های موبایل با بهترین نرخ ارز.
          </p>
        </div>

        {/* 8 Platform Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {POPULAR_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group p-5 rounded-2xl bg-[#14192b]/80 hover:bg-[#1b223b] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col items-center text-center cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(76,215,246,0.15)] hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#1d243f] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <span className="material-symbols-outlined text-3xl text-cyan-400">
                  {cat.icon}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                {cat.titleFa}
              </h3>
              <span className="text-xs text-slate-400" dir="ltr">
                {cat.titleEn}
              </span>

              <span className="mt-3 px-3 py-1 rounded-full bg-[#0b0e17] text-slate-400 group-hover:text-white border border-white/5 text-[11px] font-medium">
                {cat.count} محصول فعال
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
