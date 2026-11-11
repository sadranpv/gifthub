import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CardDenomination } from '../types';
import { formatTomans } from '../utils/formatters';
import { X, ShoppingBag, Heart, Check, Star, ShieldCheck, Zap, Globe, Plus, Minus, Info } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductModal,
    setSelectedProductModal,
    addToCart,
    toggleFavorite,
    isFavorite,
    setIsCartOpen,
  } = useStore();

  if (!selectedProductModal) return null;

  const product = selectedProductModal;
  const favorited = isFavorite(product.id);

  const [selectedDenomination, setSelectedDenomination] = useState<CardDenomination>(
    product.denominations[0] || {
      id: 'default',
      value: 10,
      label: '$10 دلار',
      priceTomans: product.basePrice,
      inStock: true,
    }
  );

  const [selectedRegion, setSelectedRegion] = useState<string>(
    product.availableRegions[0] || product.region
  );

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  React.useEffect(() => {
    if (product) {
      if (product.denominations[0]) {
        setSelectedDenomination(product.denominations[0]);
      }
      setSelectedRegion(product.availableRegions[0] || product.region);
      setQuantity(1);
    }
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.titleFa,
      platform: product.platform,
      platformNameFa: product.platformNameFa,
      denominationLabel: selectedDenomination.label,
      denominationValue: selectedDenomination.value,
      region: selectedRegion,
      priceTomans: selectedDenomination.priceTomans,
      quantity: quantity,
      iconType: product.iconType,
      accentColor: product.accentColor,
    });

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setSelectedProductModal(null);
      setIsCartOpen(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setSelectedProductModal(null)}
      />

      <div className="relative w-full max-w-2xl bg-[#121626] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden text-right">
        {/* Glow orb */}
        <div
          className="absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: product.accentColor }}
        ></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1e2540] border border-white/10 flex items-center justify-center text-2xl shadow-inner">
              {product.platform === 'steam' && '🎮'}
              {product.platform === 'playstation' && '🕹️'}
              {product.platform === 'xbox' && '❎'}
              {product.platform === 'apple' && '🍏'}
              {product.platform === 'googleplay' && '▶️'}
              {product.platform === 'nintendo' && '🔴'}
              {product.platform === 'spotify' && '🎧'}
              {product.platform === 'razer' && '⚡'}
              {product.platform === 'netflix' && '🎬'}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {product.titleFa}
              </h2>
              <span className="text-xs text-cyan-300 font-medium">
                {product.titleEn} • {product.platformNameFa}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedProductModal(null)}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hologram Card Preview in Modal */}
        <div
          className={`w-full aspect-[2.6/1] rounded-2xl p-5 bg-gradient-to-tr ${product.bgGradient} border border-white/15 flex items-center justify-between mb-6 relative overflow-hidden shadow-xl`}
        >
          <div className="flex flex-col gap-1 z-10">
            <span className="text-xs text-white/80 font-bold tracking-wider uppercase">
              {product.platformNameFa}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white drop-shadow" dir="ltr">
              {selectedDenomination.label}
            </span>
            <span className="text-xs text-cyan-200">
              ریجن: {selectedRegion}
            </span>
          </div>

          <div className="flex flex-col items-end gap-2 z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              تحویل آنی خودکار
            </span>
            <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{product.rating}</span>
              <span className="text-white/60">({product.reviewsCount} نظر)</span>
            </div>
          </div>
        </div>

        {/* 1. DENOMINATION SELECTION BUTTONS (انتخاب مبلغ کارت) */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-300 mb-2">
            مرحله ۱: انتخاب مبلغ و اعتبار گیفت‌کارت (Denomination):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {product.denominations.map((denom) => {
              const isSelected = selectedDenomination.id === denom.id;
              return (
                <button
                  key={denom.id}
                  type="button"
                  onClick={() => setSelectedDenomination(denom)}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#6936d7]/30 to-[#a078ff]/30 border-[#a078ff] shadow-[0_0_15px_rgba(160,120,255,0.25)]'
                      : 'bg-[#181f36] border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-white" dir="ltr">
                      {denom.label}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#a078ff]" />}
                  </div>
                  <span className="text-xs text-cyan-300 font-bold">
                    {formatTomans(denom.priceTomans)} ت
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. REGION SELECTION BUTTONS */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-300 mb-2">
            مرحله ۲: انتخاب ریجن اکانت (Region):
          </label>
          <div className="flex flex-wrap gap-2">
            {product.availableRegions.map((reg) => {
              const isSelected = selectedRegion === reg;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(76,215,246,0.25)]'
                      : 'bg-[#181f36] text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 inline ml-1.5" />
                  {reg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description & Features */}
        <div className="p-4 rounded-2xl bg-[#0d101c] border border-white/5 mb-6 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Info className="w-4 h-4" />
            <span>مشخصات و راهنمای تحویل:</span>
          </div>
          <p className="leading-relaxed">{product.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
            {product.features.map((f, i) => (
              <span key={i} className="flex items-center gap-1.5 text-slate-400">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Quantity & Action Footer */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-bold">تعداد:</span>
            <div className="flex items-center bg-[#0d101c] border border-white/10 rounded-xl p-1 gap-2">
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-[#1e2540] hover:bg-[#2c365d] text-white flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-white font-mono">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-[#1e2540] hover:bg-[#2c365d] text-white flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Total Price and Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-slate-400">مبلغ قابل پرداخت:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-cyan-400">
                  {formatTomans(selectedDenomination.priceTomans * quantity)}
                </span>
                <span className="text-xs text-slate-300">تومان</span>
              </div>
            </div>

            {/* Favorite toggle */}
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                favorited
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-sm'
                  : 'bg-[#181f36] text-slate-400 border-white/10 hover:text-red-400'
              }`}
              title="نشان کردن محصول"
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-red-400' : ''}`} />
            </button>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 sm:flex-none py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                justAdded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-l from-[#6936d7] via-[#8c5cf6] to-[#a078ff] text-white hover:brightness-110'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>اضافه شد ✓</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>افزودن به سبد خرید</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
