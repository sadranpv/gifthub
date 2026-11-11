import React, { useState } from 'react';
import { GiftCardProduct, CardDenomination } from '../types';
import { useStore } from '../context/StoreContext';
import { formatTomans } from '../utils/formatters';
import { ShoppingBag, Heart, Check, Star, Globe, Zap, Shield, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: GiftCardProduct;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { addToCart, toggleFavorite, isFavorite, setSelectedProductModal } = useStore();

  // Selected denomination state for this card
  const [selectedDenomination, setSelectedDenomination] = useState<CardDenomination>(
    product.denominations[0] || {
      id: 'default',
      value: 10,
      label: '$10 دلار',
      priceTomans: product.basePrice,
      inStock: true,
    }
  );

  // Selected region state
  const [selectedRegion, setSelectedRegion] = useState<string>(
    product.availableRegions[0] || product.region
  );

  // Button feedback state for instant user confirmation
  const [justAdded, setJustAdded] = useState(false);

  const favorited = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      title: product.titleFa,
      platform: product.platform,
      platformNameFa: product.platformNameFa,
      denominationLabel: selectedDenomination.label,
      denominationValue: selectedDenomination.value,
      region: selectedRegion,
      priceTomans: selectedDenomination.priceTomans,
      quantity: 1,
      iconType: product.iconType,
      accentColor: product.accentColor,
    });

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1600);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleDenominationClick = (e: React.MouseEvent, denom: CardDenomination) => {
    e.stopPropagation();
    setSelectedDenomination(denom);
  };

  const handleRegionClick = (e: React.MouseEvent, reg: string) => {
    e.stopPropagation();
    setSelectedRegion(reg);
  };

  return (
    <div
      className={`group relative bg-[#131728]/90 hover:bg-[#181d33] border border-white/10 hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-[0_12px_40px_rgba(76,215,246,0.12)] flex flex-col justify-between cursor-pointer ${
        layout === 'list' ? 'md:flex-row md:items-center gap-6' : ''
      }`}
      onClick={() => setSelectedProductModal(product)}
    >
      {/* Top Header: Region badge & Rating */}
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>ریجن: {selectedRegion}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{product.rating}</span>
            <span className="text-slate-400 font-normal">({product.reviewsCount} نظر)</span>
          </div>
        </div>

        {/* Card Hologram Graphic Preview */}
        <div
          className={`w-full aspect-[2/1] rounded-xl p-4 bg-gradient-to-tr ${product.bgGradient} flex items-center justify-between mb-4 relative overflow-hidden border border-white/10 shadow-inner group-hover:scale-[1.01] transition-transform`}
        >
          {/* Ambient Glow Orb */}
          <div
            className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none"
            style={{ backgroundColor: product.accentColor }}
          ></div>

          <div className="flex items-center gap-3 z-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 shadow-md backdrop-blur-md bg-black/40 border border-white/15"
            >
              <span className="text-2xl text-white font-black">
                {product.platform === 'steam' && '🎮'}
                {product.platform === 'playstation' && '🕹️'}
                {product.platform === 'xbox' && '❎'}
                {product.platform === 'apple' && '🍏'}
                {product.platform === 'googleplay' && '▶️'}
                {product.platform === 'nintendo' && '🔴'}
                {product.platform === 'spotify' && '🎧'}
                {product.platform === 'razer' && '⚡'}
                {product.platform === 'netflix' && '🎬'}
              </span>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-white drop-shadow">
                {product.titleEn}
              </span>
              <span
                className="text-lg font-black tracking-wider text-cyan-300 drop-shadow"
                dir="ltr"
              >
                {selectedDenomination.label}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 z-10">
            {product.badge && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                {product.badge}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              تحویل آنی
            </span>
          </div>
        </div>

        {/* Title and Short Description */}
        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5 text-right">
          {product.titleFa}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 text-right">
          {product.description}
        </p>

        {/* 1. BUTTONS FOR SELECTING GIFT CARD TYPES / DENOMINATIONS (دکمه‌های انتخاب انواع گیفت کارت) */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#a078ff]" />
              انتخاب مبلغ و نوع کارت:
            </span>
            <span className="text-cyan-400 font-bold" dir="ltr">
              {selectedDenomination.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.denominations.map((denom) => {
              const isSelected = selectedDenomination.id === denom.id;
              return (
                <button
                  key={denom.id}
                  type="button"
                  onClick={(e) => handleDenominationClick(e, denom)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#6936d7] to-[#a078ff] text-white border-transparent shadow-[0_0_12px_rgba(160,120,255,0.4)] scale-105'
                      : 'bg-[#181f36] text-slate-300 border-white/10 hover:border-white/25 hover:text-white hover:bg-[#202947]'
                  }`}
                >
                  {denom.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Region Selector (if multi-region) */}
        {product.availableRegions.length > 1 && (
          <div className="mb-4" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] text-slate-400 block mb-1.5 text-right">
              انتخاب ریجن اکانت:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.availableRegions.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={(e) => handleRegionClick(e, reg)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors ${
                    selectedRegion === reg
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price & Action Buttons */}
      <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
        {/* Price Row */}
        <div className="flex items-baseline justify-between">
          {selectedDenomination.oldPriceTomans && (
            <span className="text-xs text-slate-500 line-through font-mono">
              {formatTomans(selectedDenomination.oldPriceTomans)} ت
            </span>
          )}
          <div className="flex items-baseline gap-1.5 mr-auto">
            <span className="text-xl font-black text-white tracking-tight">
              {formatTomans(selectedDenomination.priceTomans)}
            </span>
            <span className="text-xs font-bold text-cyan-400">تومان</span>
          </div>
        </div>

        {/* 2 & 3. ACTION BUTTONS: ADD TO CART & FAVORITE (دکمه افزودن به سبد خرید و نشان کردن) */}
        <div className="flex items-center gap-2">
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
              justAdded
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-l from-[#6936d7] via-[#8c5cf6] to-[#a078ff] text-white hover:brightness-110 shadow-[0_4px_16px_rgba(140,92,246,0.35)]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 scale-110 transition-transform" />
                <span>به سبد اضافه شد ✓</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>افزودن به سبد خرید</span>
              </>
            )}
          </button>

          {/* Favorite / Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`p-3 rounded-xl border transition-all cursor-pointer group/fav ${
              favorited
                ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'bg-[#181f36] text-slate-400 border-white/10 hover:text-red-400 hover:border-red-500/30 hover:bg-[#202947]'
            }`}
            title={favorited ? 'حذف از علاقه‌مندی‌ها' : 'نشان کردن محصول و ذخیره در علاقه‌مندی'}
          >
            <Heart
              className={`w-5 h-5 transition-transform group-hover/fav:scale-115 ${
                favorited ? 'fill-red-400 text-red-400' : ''
              }`}
            />
          </button>
        </div>

        {/* Stock & Guarantee Notice */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            موجود در انبار (تحویل اتوماتیک)
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Shield className="w-3 h-3 text-cyan-400" />
            کد اسکن‌شده معتبر
          </span>
        </div>
      </div>
    </div>
  );
};
