import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatTomans } from '../utils/formatters';
import { Order } from '../types';
import { X, CheckCircle2, ShieldCheck, Copy, Check, CreditCard, Lock, Sparkles, Smartphone, Mail, User, ArrowRight } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartDiscount,
    cartSubtotal,
    appliedCoupon,
    completeCheckout,
    setActiveTab,
    showToast,
  } = useStore();

  const [name, setName] = useState('کاربر VIP گیفت‌هاب');
  const [phone, setPhone] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [email, setEmail] = useState('gamer@gifthub.ir');
  const [gateway, setGateway] = useState('به‌پرداخت ملت (شاپرک)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      showToast('لطفاً نام، شماره موبایل و ایمیل خود را به صورت کامل وارد کنید.', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const order = completeCheckout({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        gateway: gateway,
      });
      setIsProcessing(false);
      setCompletedOrder(order);
    }, 1200);
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    showToast('کد لایسنس گیفت‌کارت در کلیپ‌بورد کپی شد!', 'info');
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const gateways = [
    { id: 'mellat', name: 'به‌پرداخت ملت (شاپرک)', icon: '🏦', speed: 'آنی و بدون کارمزد' },
    { id: 'saman', name: 'پرداخت الکترونیک سامان کیش', icon: '💳', speed: 'پایدار و امن' },
    { id: 'zarinpal', name: 'درگاه هوشمند زرین‌پال', icon: '⚡', speed: 'پشتیبانی از تمامی کارت‌ها' },
  ];

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => !isProcessing && setIsCheckoutOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-[#121626] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6936d7] to-[#a078ff] flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {completedOrder ? 'فاکتور و کدهای تحویل آنی' : 'درگاه پرداخت امن و صدور فوری لایسنس'}
              </h2>
              <span className="text-xs text-cyan-300">
                {completedOrder ? `شناسه پیگیری: ${completedOrder.orderNumber}` : 'اتصال مستقیم به شبکه شاپرک'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State A: Completed Order Display (Real-time License Code Screen) */}
        {completedOrder ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-sm font-black text-emerald-300">
                  پرداخت تایید شد و کدها با موفقیت صادر شدند!
                </span>
                <span className="text-xs text-slate-300 mt-0.5">
                  کدهای زیر همزمان به شماره {completedOrder.customerPhone} پیامک گردید.
                </span>
              </div>
            </div>

            {/* Issued Gift Card Codes Box */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#a078ff]" />
                کدهای لایسنس اختصاصی شما (تحویل آنی):
              </span>

              {completedOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-[#171d31] border border-cyan-500/30 shadow-inner flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      {item.title} ({item.denominationLabel})
                    </span>
                    <span className="text-cyan-400 font-medium">{item.region}</span>
                  </div>

                  {/* Copyable License Box */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e17] border border-white/10">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-slate-400 font-sans">
                        کد فعال‌سازی (REDEEM CODE):
                      </span>
                      <span className="text-base font-black text-cyan-300 font-mono tracking-wider select-all" dir="ltr">
                        {item.licenseCode}
                      </span>
                      {item.pinCode && (
                        <span className="text-xs text-amber-300 font-mono" dir="ltr">
                          PIN: {item.pinCode}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(item.licenseCode, index)}
                      className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCodeIndex === index ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>کپی کد</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Receipt Summary */}
            <div className="p-4 rounded-2xl bg-[#0d101c] border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>شماره سفارش:</span>
                <span className="font-mono text-cyan-400 font-bold">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>درگاه پرداخت:</span>
                <span>{completedOrder.paymentGateway}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>مبلغ پرداختی:</span>
                <span className="text-white font-bold">{formatTomans(completedOrder.totalTomans)} تومان</span>
              </div>
              <div className="flex items-center justify-between">
                <span>زمان ثبت:</span>
                <span dir="ltr">{completedOrder.createdAt}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setActiveTab('tracking');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-l from-[#6936d7] to-[#a078ff] text-white font-bold text-xs sm:text-sm text-center shadow-md"
              >
                مشاهده در پیگیری سفارشات
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setActiveTab('store');
                }}
                className="py-3 px-4 rounded-xl bg-[#171d31] hover:bg-[#202842] text-slate-300 text-xs sm:text-sm transition-colors"
              >
                بازگشت به فروشگاه
              </button>
            </div>
          </div>
        ) : (
          /* State B: Checkout Details & Gateway Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Information Inputs */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                مشخصات گیرنده جهت ارسال پیامکی کد لایسنس:
              </label>

              <div className="relative">
                <User className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام و نام خانوادگی..."
                  className="w-full bg-[#171d31] border border-white/10 py-2.5 pr-10 pl-4 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#a078ff]"
                />
              </div>

              <div className="relative">
                <Smartphone className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="شماره موبایل جهت دریافت پیامک لایسنس (مثال: ۰۹۱۲۳۴۵۶۷۸۹)..."
                  className="w-full bg-[#171d31] border border-white/10 py-2.5 pr-10 pl-4 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#a078ff]"
                  dir="ltr"
                />
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="آدرس ایمیل..."
                  className="w-full bg-[#171d31] border border-white/10 py-2.5 pr-10 pl-4 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#a078ff]"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Gateway Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                انتخاب درگاه بانکی مستقیم شاپرک:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {gateways.map((g) => {
                  const isSelected = gateway === g.name;
                  return (
                    <div
                      key={g.id}
                      onClick={() => setGateway(g.name)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#6936d7]/30 to-[#a078ff]/20 border-[#a078ff] shadow-sm'
                          : 'bg-[#171d31] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{g.icon}</span>
                        <div className="flex flex-col text-right">
                          <span className="text-xs font-bold text-white">{g.name}</span>
                          <span className="text-[10px] text-slate-400">{g.speed}</span>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#a078ff] bg-[#a078ff]' : 'border-slate-500'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-4 rounded-2xl bg-[#0d101c] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>تعداد آیتم‌ها:</span>
                <span className="text-white font-mono">{cart.length} محصول</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>تخفیف اعمال‌شده ({appliedCoupon}):</span>
                  <span className="font-mono">- {formatTomans(cartDiscount)} تومان</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
                <span className="font-bold text-white">مبلغ نهایی پرداخت:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-cyan-400">
                    {formatTomans(cartTotal)}
                  </span>
                  <span className="text-xs text-slate-300">تومان</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-l from-[#6936d7] via-[#8c5cf6] to-[#a078ff] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(140,92,246,0.4)] hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>در حال اتصال به شاپرک و صدور لایسنس...</span>
                </div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>پرداخت و دریافت آنی کد لایسنس ({formatTomans(cartTotal)} ت)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>پرداخت تحت پروتکل امن SSL و نظارت شاپرک مرکزی</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
