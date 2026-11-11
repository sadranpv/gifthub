import React from 'react';
import { useStore } from '../context/StoreContext';
import { GIFT_CARDS } from '../data/giftCards';
import { formatTomans } from '../utils/formatters';
import { X, Heart, ShoppingBag, Trash2, ArrowLeft, Zap } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    favorites,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleFavorite,
    addToCart,
    setActiveTab,
    showToast,
  } = useStore();

  if (!isWishlistOpen) return null;

  const favoriteProducts = GIFT_CARDS.filter((p) => favorites.includes(p.id));

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((p) => {
      const denom = p.denominations[0];
      addToCart({
        productId: p.id,
        title: p.titleFa,
        platform: p.platform,
        platformNameFa: p.platformNameFa,
        denominationLabel: denom.label,
        denominationValue: denom.value,
        region: p.region,
        priceTomans: denom.priceTomans,
        quantity: 1,
        iconType: p.iconType,
        accentColor: p.accentColor,
      });
    });
    showToast(`${favoriteProducts.length} محصول با موفقیت به سبد خرید اضافه شدند.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#101422] border-r border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#151a2d]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              </div>
              <div className="flex flex-col text-right">
                <h2 className="text-base font-bold text-white">لیست علاقه‌مندی‌ها</h2>
                <span className="text-xs text-slate-400">
                  {favoriteProducts.length} گیفت‌کارت نشان‌شده
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Favorites List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {favoriteProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-4">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-white">لیست علاقه‌مندی‌ها خالی است</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  با کلیک بر روی آیکون قلب در کنار هر کارت، می‌توانید محصولات محبوب خود را برای دسترسی سریع ذخیره کنید.
                </p>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setActiveTab('store');
                  }}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#6936d7] to-[#a078ff] text-white font-bold text-xs shadow-md"
                >
                  مشاهده و انتخاب گیفت‌کارت‌ها
                </button>
              </div>
            ) : (
              favoriteProducts.map((product) => {
                const defaultDenom = product.denominations[0];
                return (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-[#171d31]/80 border border-white/10 flex flex-col gap-3 shadow-sm hover:border-red-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#202842] border border-white/10 flex items-center justify-center text-xl shrink-0">
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
                        <div className="flex flex-col text-right">
                          <span className="text-sm font-bold text-white leading-tight">
                            {product.titleFa}
                          </span>
                          <span className="text-xs text-cyan-300 mt-1">
                            {product.platformNameFa} • {product.region}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="حذف از لیست"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-baseline gap-1 text-right">
                        <span className="text-sm font-black text-white">
                          از {formatTomans(defaultDenom.priceTomans)}
                        </span>
                        <span className="text-[11px] text-cyan-400">تومان</span>
                      </div>

                      <button
                        onClick={() => {
                          addToCart({
                            productId: product.id,
                            title: product.titleFa,
                            platform: product.platform,
                            platformNameFa: product.platformNameFa,
                            denominationLabel: defaultDenom.label,
                            denominationValue: defaultDenom.value,
                            region: product.region,
                            priceTomans: defaultDenom.priceTomans,
                            quantity: 1,
                            iconType: product.iconType,
                            accentColor: product.accentColor,
                          });
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-l from-[#6936d7] to-[#a078ff] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>افزودن به سبد</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {favoriteProducts.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#14192b] flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-l from-[#6936d7] to-[#a078ff] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>افزودن همه کارت‌های نشان‌شده به سبد خرید</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
