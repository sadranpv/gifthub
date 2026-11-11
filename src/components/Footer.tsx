import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Gamepad2, Lock, Headphones, Phone, Send, Clock, Mail, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedPlatformFilter, showToast } = useStore();
  const [newsletterInput, setNewsletterInput] = useState('');

  const handleCategoryClick = (platform: any) => {
    setSelectedPlatformFilter(platform);
    setActiveTab('store');
    window.scrollTo({ top: 700, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterInput.trim()) {
      showToast('شماره/ایمیل شما با موفقیت در باشگاه VIP گیفت‌هاب ثبت شد!', 'success');
      setNewsletterInput('');
    }
  };

  return (
    <footer className="w-full bg-[#07090F] border-t border-white/10 pt-16 pb-12 mt-20 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6936d7] to-[#a078ff] flex items-center justify-center p-2 shadow-md">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black text-white">GiftHub | گیفت‌هاب</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              دنیای کارت‌های دیجیتال، در یک جا! معتبرترین سامانه خرید آنی و مکانیزه گیفت‌کارت‌های گیمینگ و اشتراک‌های بین‌المللی با تحویل آنی کمتر از ۳۰ ثانیه در تمام ساعات شبانه‌روز همراه با اسکن فیزیکی معتبر.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1.5 rounded-lg bg-[#14192b] border border-white/5 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                تضمین بازگشت وجه
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#14192b] border border-white/5 text-cyan-400 text-xs font-semibold flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                پشتیبانی ۲۴ ساعته
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white mb-1">دسته‌بندی‌ها</h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('steam')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  گیفت کارت استیم
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('playstation')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  گیفت کارت پلی‌استیشن
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('xbox')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  گیفت کارت ایکس‌باکس
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('apple')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  گیفت کارت اپل و آیتونز
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('googleplay')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  گیفت کارت گوگل پلی
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('nintendo')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  گیفت کارت نینتندو
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support Center */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white mb-1">مرکز پشتیبانی</h3>
            <div className="flex flex-col gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-white font-mono" dir="ltr">
                  ۰۲۱ - ۹۱۰۰۸۸۷۷
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>تلگرام: @GiftHub_Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>پاسخگویی سریع ۲۴/۷ آنلاین</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-mono" dir="ltr">
                  support@gifthub.ir
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: VIP Club & Trust Certificates */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white">باشگاه مشتریان و تخفیف‌ها</h3>
            <p className="text-xs text-slate-400">
              با عضویت در باشگاه VIP، جدیدترین کدهای تخفیف را زودتر از دیگران دریافت کنید.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="text"
                value={newsletterInput}
                onChange={(e) => setNewsletterInput(e.target.value)}
                placeholder="شماره موبایل یا ایمیل..."
                className="bg-[#14192b] border border-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-500 rounded-xl w-full focus:outline-none focus:border-[#a078ff]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-l from-[#6936d7] to-[#a078ff] text-white font-bold text-xs whitespace-nowrap hover:brightness-110 transition-colors"
              >
                ثبت
              </button>
            </form>

            {/* 3 Trust Certificates (اینماد، گواهی SSL، ساماندهی) */}
            <div className="flex items-center gap-2 pt-2">
              <div className="flex-1 p-2 rounded-xl bg-[#14192b] border border-white/5 flex flex-col items-center justify-center text-center gap-1 hover:border-cyan-500/30 transition-colors">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="text-[10px] text-slate-300">اینماد ۵ ستاره</span>
              </div>
              <div className="flex-1 p-2 rounded-xl bg-[#14192b] border border-white/5 flex flex-col items-center justify-center text-center gap-1 hover:border-emerald-500/30 transition-colors">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] text-slate-300">گواهی SSL</span>
              </div>
              <div className="flex-1 p-2 rounded-xl bg-[#14192b] border border-white/5 flex flex-col items-center justify-center text-center gap-1 hover:border-purple-500/30 transition-colors">
                <Award className="w-5 h-5 text-[#a078ff]" />
                <span className="text-[10px] text-slate-300">ساماندهی</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© ۲۰۲۵ فروشگاه هوشمند گیفت‌هاب (GiftHub). تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">قوانین و مقررات</span>
            <span className="hover:text-slate-300 cursor-pointer">حریم خصوصی</span>
            <span className="hover:text-slate-300 cursor-pointer">راهنمای فعال‌سازی</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
