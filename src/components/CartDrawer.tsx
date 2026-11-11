import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatTomans } from '../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, ShieldCheck, Zap } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    setActiveTab,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#101422] border-r border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#151a2d]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex flex-col text-right">
                <h2 className="text-base font-bold text-white">سبد خرید شما</h2>
                <span className="text-xs text-slate-400">
                  {cart.length} ردیف محصول انتخاب شده
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-4">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-white">سبد خرید شما خالی است</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  می‌توانید گیفت‌کارت‌های مورد نظر خود را از فروشگاه انتخاب کرده و به سبد اضافه نمایید.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab('store');
                  }}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#6936d7] to-[#a078ff] text-white font-bold text-xs shadow-md"
                >
                  مشاهده فروشگاه گیفت‌کارت‌ها
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-4 rounded-2xl bg-[#171d31]/80 border border-white/10 flex flex-col gap-3 shadow-sm hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#202842] border border-white/10 flex items-center justify-center text-xl shrink-0">
                        {item.platform === 'steam' && '🎮'}
                        {item.platform === 'playstation' && '🕹️'}
                        {item.platform === 'xbox' && '❎'}
                        {item.platform === 'apple' && '🍏'}
                        {item.platform === 'googleplay' && '▶️'}
                        {item.platform === 'nintendo' && '🔴'}
                        {item.platform === 'spotify' && '🎧'}
                        {item.platform === 'razer' && '⚡'}
                        {item.platform === 'netflix' && '🎬'}
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-sm font-bold text-white leading-tight">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-md bg-[#252e4d] text-cyan-300 font-mono text-[11px] font-bold">
                            {item.denominationLabel}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {item.region}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="حذف از سبد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#0e1220] border border-white/10 rounded-xl p-1 gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="w-7 h-7 rounded-lg bg-[#1e2540] hover:bg-[#2c365d] text-white flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="w-7 h-7 rounded-lg bg-[#1e2540] hover:bg-[#2c365d] text-white flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-1 text-right">
                      <span className="text-sm font-black text-white">
                        {formatTomans(item.priceTomans * item.quantity)}
                      </span>
                      <span className="text-[11px] text-cyan-400">تومان</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#14192b] space-y-4">
              
              {/* Promo code form */}
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="کد تخفیف (مثال: LUKYSALE)..."
                    className="w-full bg-[#0d101c] border border-white/10 py-2.5 pr-9 pl-3 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#a078ff]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#202742] hover:bg-[#2b3459] text-white text-xs font-bold transition-colors whitespace-nowrap"
                >
                  ثبت کد
                </button>
              </form>

              {/* Applied coupon badge */}
              {appliedCoupon && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <span>کد «{appliedCoupon}» اعمال شد (۱۰٪ تخفیف)</span>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-red-400 text-xs underline"
                  >
                    حذف
                  </button>
                </div>
              )}

              {/* Calculations Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>مجموع ناخالص:</span>
                  <span className="font-mono text-white">
                    {formatTomans(cartSubtotal)} تومان
                  </span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>تخفیف ویژه:</span>
                    <span className="font-mono">
                      - {formatTomans(cartDiscount)} تومان
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-400">
                  <span>کارمزد انتقال و تحویل آنی:</span>
                  <span className="text-emerald-400 font-bold">رایگان (۰ تومان)</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
                  <span className="font-bold text-white">مبلغ نهایی قابل پرداخت:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-cyan-400">
                      {formatTomans(cartTotal)}
                    </span>
                    <span className="text-xs text-slate-300">تومان</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-l from-[#6936d7] via-[#8c5cf6] to-[#a078ff] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(140,92,246,0.4)] hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-cyan-300" />
                  <span>تکمیل خرید و دریافت آنی کدها</span>
                  <ArrowLeft className="w-4 h-4 text-cyan-300" />
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full py-2 text-center text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  خالی کردن کل سبد خرید
                </button>
              </div>

              {/* Guarantee Footer */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>تحویل آنی در کمتر از ۳۰ ثانیه با گارانتی اصالت</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
