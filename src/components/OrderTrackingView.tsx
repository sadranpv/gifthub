import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatTomans } from '../utils/formatters';
import { Order } from '../types';
import { Search, CheckCircle2, Clock, ShieldCheck, Copy, Check, Sparkles, PackageCheck, AlertCircle } from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, showToast } = useStore();
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [searched, setSearched] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const query = searchId.trim().toUpperCase();
    if (!query) {
      setSelectedOrder(orders[0] || null);
      return;
    }

    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase().includes(query) ||
        o.id.toUpperCase().includes(query) ||
        o.customerPhone.includes(query)
    );

    setSelectedOrder(found || null);
    if (!found) {
      showToast('سفارشی با این شناسه یا شماره یافت نشد.', 'error');
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('کد گیفت‌کارت در حافظه کپی شد.', 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#090C15]" id="order-tracking">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold mb-2 w-fit">
            <PackageCheck className="w-4 h-4" />
            <span>سامانه استعلام و رهگیری آنی سفارشات</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            پیگیری سفارش و مشاهده کدهای لایسنس
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            با وارد کردن شماره سفارش (مثال: GH-82919) یا شماره تلفن همراه، وضعیت تحویل و کدهای فعال‌سازی خود را مشاهده فرمایید.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="p-3 sm:p-4 rounded-2xl bg-[#14192b] border border-white/10 shadow-lg flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="شماره سفارش (مانند GH-82919) یا شماره موبایل..."
              className="w-full bg-[#0d101c] border border-white/10 py-3 pr-10 pl-4 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#a078ff]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-l from-[#6936d7] to-[#a078ff] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4 text-cyan-300" />
            <span>رهگیری و جستجو</span>
          </button>
        </form>

        {/* Quick Recent Orders Pills */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="text-slate-400 whitespace-nowrap">سفارشات اخیر در این مرورگر:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSelectedOrder(o);
                  setSearchId(o.orderNumber);
                  setSearched(true);
                }}
                className={`px-3 py-1.5 rounded-lg border font-mono transition-colors whitespace-nowrap cursor-pointer ${
                  selectedOrder?.id === o.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                    : 'bg-[#171d31] text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        )}

        {/* Selected Order Result Card */}
        {selectedOrder ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/15 shadow-xl space-y-6 text-right">
            
            {/* Order Status Badge & Timeline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white font-mono" dir="ltr">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedOrder.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  ثبت شده در: {selectedOrder.createdAt}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>مشتری: <strong className="text-white">{selectedOrder.customerName}</strong></span>
                <span className="text-white/20">•</span>
                <span dir="ltr">{selectedOrder.customerPhone}</span>
              </div>
            </div>

            {/* 4-Step Fulfillment Timeline */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white">۱. ثبت سفارش</span>
                <span className="text-[10px] text-emerald-400">تکمیل شد</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white">۲. درگاه شاپرک</span>
                <span className="text-[10px] text-emerald-400">پرداخت موفق</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white">۳. صدور لایسنس</span>
                <span className="text-[10px] text-emerald-400">کد رسمی صادر شد</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white">۴. تحویل آنی</span>
                <span className="text-[10px] text-emerald-400">پیامک و ایمیل شد</span>
              </div>
            </div>

            {/* Delivered Codes Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                کارت‌ها و کدهای لایسنس ارسال‌شده:
              </h3>

              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#171d31] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      {item.title} ({item.denominationLabel})
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">
                      ریجن: {item.region} | قیمت: {formatTomans(item.priceTomans)} ت
                    </span>
                  </div>

                  {/* Code box */}
                  <div className="flex items-center gap-3 bg-[#0b0e17] p-2.5 rounded-xl border border-white/10">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-slate-400 font-sans">کد فعال‌سازی:</span>
                      <span className="text-sm sm:text-base font-black text-cyan-300 font-mono tracking-wider select-all" dir="ltr">
                        {item.licenseCode}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.licenseCode)}
                      className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      {copiedCode === item.licenseCode ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Paid */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>درگاه: {selectedOrder.paymentGateway}</span>
              <div className="flex items-baseline gap-1 text-sm font-bold text-white">
                <span>مبلغ پرداخت‌شده:</span>
                <span className="text-base text-cyan-400 font-black">
                  {formatTomans(selectedOrder.totalTomans)}
                </span>
                <span>تومان</span>
              </div>
            </div>
          </div>
        ) : searched ? (
          <div className="p-12 rounded-3xl bg-[#14192b]/50 border border-white/10 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-12 h-12 text-amber-400" />
            <h3 className="text-base font-bold text-white">سفارشی با این شناسه یافت نشد</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              شماره سفارش را با فرمت کامل (مانند GH-82919) وارد کنید یا یک خرید آزمایشی ثبت فرمایید تا کد فوری دریافت کنید.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};
