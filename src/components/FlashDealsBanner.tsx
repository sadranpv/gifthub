import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, Copy, Check, Sparkles, Percent } from 'lucide-react';

export const FlashDealsBanner: React.FC = () => {
  const { applyCoupon, appliedCoupon, showToast, setIsCartOpen } = useStore();
  
  // Real-time ticking countdown
  const [timeLeft, setTimeLeft] = useState(8 * 3600 + 42 * 60 + 19);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const handleCopyCode = () => {
    navigator.clipboard.writeText('LUKYSALE');
    setCopied(true);
    showToast('کد تخفیف LUKYSALE کپی شد!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCouponDirectly = () => {
    const success = applyCoupon('LUKYSALE');
    if (success) {
      setIsCartOpen(true);
    }
  };

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-[#0B0E17]">
      <div className="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#171d33] via-[#121626] to-[#1c1836] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        
        {/* Glow Orbs */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Content & Timer */}
          <div className="flex flex-col text-right max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold mb-3 w-fit">
              <Flame className="w-4 h-4 text-red-400" />
              <span>پیشنهاد شگفت‌انگیز ۲۴ ساعته</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              جشنواره تخفیف‌های آتشین آخر هفته
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              با هر خرید از دسته گیفت‌کارت‌های استیم، پلی‌استیشن و ایکس‌باکس، ۱۰٪ تخفیف فوری با کد اختصاصی و ۵٪ کش‌بک مستقیم دریافت کنید!
            </p>

            {/* Digital Countdown Blocks */}
            <div className="flex items-center gap-3" dir="ltr">
              <div className="flex flex-col items-center justify-center p-3 w-16 rounded-xl bg-[#0b0e17] border border-white/10 shadow-sm">
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  {String(hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-sans">ساعت</span>
              </div>
              <span className="text-2xl text-slate-600 font-bold">:</span>
              <div className="flex flex-col items-center justify-center p-3 w-16 rounded-xl bg-[#0b0e17] border border-white/10 shadow-sm">
                <span className="text-2xl font-black text-[#a078ff] font-mono">
                  {String(minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-sans">دقیقه</span>
              </div>
              <span className="text-2xl text-slate-600 font-bold">:</span>
              <div className="flex flex-col items-center justify-center p-3 w-16 rounded-xl bg-[#0b0e17] border border-white/10 shadow-sm">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {String(seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-sans">ثانیه</span>
              </div>
            </div>
          </div>

          {/* Coupon Code Box */}
          <div className="p-6 rounded-2xl bg-[#0b0e17]/90 border border-white/10 backdrop-blur-md flex flex-col items-center text-center gap-3 w-full sm:w-80 shadow-xl">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#a078ff]" />
              کد تخفیف اختصاصی ۱۰ درصدی:
            </span>

            <div
              onClick={handleCopyCode}
              className="w-full py-3 px-4 rounded-xl bg-[#171d31] border border-[#a078ff]/30 text-cyan-300 font-mono font-black text-center tracking-widest text-xl cursor-pointer hover:border-[#a078ff] transition-all flex items-center justify-center gap-2 group"
              dir="ltr"
              title="برای کپی کلیک کنید"
            >
              <span>LUKYSALE</span>
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400 group-hover:text-cyan-300" />
              )}
            </div>

            <div className="flex items-center gap-2 w-full">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>کپی کد</span>
              </button>

              <button
                type="button"
                onClick={handleApplyCouponDirectly}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  appliedCoupon === 'LUKYSALE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#a078ff] hover:bg-[#8c5cf6] text-white shadow-md'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>{appliedCoupon === 'LUKYSALE' ? 'اعمال شده ✓' : 'اعمال روی سبد'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
