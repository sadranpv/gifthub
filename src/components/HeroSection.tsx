import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Rocket, SearchCheck, CheckCircle2, ShieldCheck, CreditCard, Sparkles, Cpu, Clock, Users, ArrowLeft } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab } = useStore();

  // Interactive showcase card switch
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const showcaseCards = [
    {
      title: 'STEAM WALLET',
      subtitle: 'GLOBAL VIP CARD',
      amount: '$50.00',
      region: 'ریجن: ایالات متحده',
      color: '#4cd7f6',
      bg: 'from-[#1b2838] via-[#2a475e] to-[#121b28]',
      serial: '**** **** 9204',
      icon: '🎮',
    },
    {
      title: 'PLAYSTATION PLUS',
      subtitle: 'DELUXE SUBSCRIPTION',
      amount: '$70.00',
      region: 'ریجن: آمریکا (USA)',
      color: '#006FCD',
      bg: 'from-[#003791] via-[#002257] to-[#081226]',
      serial: '**** **** 7712',
      icon: '🕹️',
    },
    {
      title: 'XBOX GAME PASS',
      subtitle: 'ULTIMATE 3 MONTHS',
      amount: '$45.00',
      region: 'ریجن: گلوبال / آمریکا',
      color: '#107C10',
      bg: 'from-[#107C10] via-[#094809] to-[#041c04]',
      serial: '**** **** 3391',
      icon: '❎',
    },
    {
      title: 'APPLE ITUNES',
      subtitle: 'APP STORE & ICLOUD',
      amount: '$25.00',
      region: 'ریجن: آمریکا (USA)',
      color: '#a078ff',
      bg: 'from-[#3a2066] via-[#21133b] to-[#100a1d]',
      serial: '**** **** 8119',
      icon: '🍏',
    },
  ];

  const currentCard = showcaseCards[activeCardIndex];

  return (
    <section className="relative w-full pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-[#090C15] overflow-hidden">
      {/* Ambient Neon Backgrounds */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#6936d7]/20 blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(160,120,255,0.12),rgba(9,12,21,0))] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left / Main Text Content */}
        <div className="flex flex-col items-start max-w-2xl text-right">
          
          {/* Cyber Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171d31]/80 border border-white/10 backdrop-blur-md mb-6 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-emerald-400 tracking-wider font-bold">
              نسل جدید پلتفرم دارایی‌های گیمینگ
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs text-cyan-300 font-medium">تحویل تمام‌اتوماتیک</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-5">
            دنیای کارت‌های دیجیتال، <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#a078ff] via-[#8c5cf6] to-cyan-400">
              در یک جا!
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
            خرید آنلاین انواع گیفت‌کارت‌های معتبر استیم، پلی‌استیشن، ایکس‌باکس و اپل با تحویل کاملاً آنی کمتر از ۳۰ ثانیه، تضمین ۱۰۰٪ اسکن فیزیکی و پشتیبانی بی‌وقفه شبانه‌روزی.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveTab('store');
                window.scrollTo({ top: 700, behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-l from-[#6936d7] via-[#8c5cf6] to-[#a078ff] text-white font-bold text-base shadow-[0_12px_32px_rgba(160,120,255,0.4)] hover:shadow-[0_16px_40px_rgba(160,120,255,0.6)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Rocket className="w-5 h-5 text-cyan-300" />
              <span>مشاهده محصولات و خرید</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tracking');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#171d31]/80 border border-white/10 backdrop-blur-md text-cyan-300 hover:text-white hover:bg-[#202842] font-semibold text-sm transition-all shadow-sm cursor-pointer"
            >
              <SearchCheck className="w-4 h-4 text-cyan-400" />
              <span>پیگیری سفارش فوری</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-6 mt-10 text-slate-400 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>صدور فاکتور رسمی</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>درگاه مستقیم بانکی</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#a078ff]" />
              <span>ضمانت اصالت کد</span>
            </div>
          </div>
        </div>

        {/* Right / Hero Visual: Interactive 3D Holographic Card Showpiece */}
        <div className="relative w-full max-w-lg flex flex-col items-center justify-center">
          
          {/* Card Platform Switcher Pills */}
          <div className="flex items-center gap-2 mb-3 z-20">
            {showcaseCards.map((c, i) => (
              <button
                key={c.title}
                onClick={() => setActiveCardIndex(i)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCardIndex === i
                    ? 'bg-gradient-to-r from-[#6936d7] to-[#a078ff] text-white shadow-md'
                    : 'bg-[#171d31] text-slate-400 hover:text-white'
                }`}
              >
                {c.icon} {c.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Glowing Holographic Card */}
          <div
            className={`relative w-full aspect-[1.58/1] rounded-2xl p-6 bg-gradient-to-br ${currentCard.bg} border border-white/20 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500`}
          >
            {/* Holographic light streaks */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative h-full flex flex-col justify-between z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
                    {currentCard.icon}
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-black text-white">
                      {currentCard.title}
                    </span>
                    <span className="text-[11px] text-cyan-300 font-bold tracking-wider">
                      {currentCard.subtitle}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  تحویل آنی
                </span>
              </div>

              {/* Card Chip & Value */}
              <div className="flex items-center justify-between my-auto py-2">
                <div className="w-12 h-9 rounded-md bg-gradient-to-tr from-amber-400/40 to-amber-200/20 border border-amber-300/40 backdrop-blur-sm flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-amber-200" />
                </div>
                <div
                  className="text-3xl sm:text-4xl font-black text-white tracking-widest drop-shadow-lg"
                  dir="ltr"
                >
                  {currentCard.amount}
                </div>
              </div>

              {/* Serial & Region */}
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span className="font-mono tracking-widest text-slate-400" dir="ltr">
                  {currentCard.serial}
                </span>
                <span className="text-white font-bold">{currentCard.region}</span>
              </div>
            </div>
          </div>

          {/* Overlapping Secondary Micro-Card: Live Order Notification */}
          <div className="relative sm:-bottom-5 sm:-right-4 mt-4 sm:mt-0 w-full sm:w-5/6 rounded-xl p-4 bg-[#14192b]/95 border border-white/10 backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-white font-bold">
                  سفارش شماره #۸۲۹۱۹
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  کد لایسنس استیم والت ارسال شد
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
              ۲ ثانیه پیش
            </span>
          </div>
        </div>
      </div>

      {/* 3 Live Stats Glass Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/10">
        <div className="p-5 rounded-2xl bg-[#14192b]/70 border border-white/10 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-[#a078ff]" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xl font-black text-white">+۴۸,۰۰۰ کاربر</span>
            <span className="text-xs text-slate-400">تحویل موفق کارت در سال جاری</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#14192b]/70 border border-white/10 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xl font-black text-white">۲۸ ثانیه</span>
            <span className="text-xs text-slate-400">میانگین صدور و ارسال لایسنس</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#14192b]/70 border border-white/10 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xl font-black text-white">۹۹.۴٪ رضایت</span>
            <span className="text-xs text-slate-400">تضمین بازگشت وجه و سلامت کد</span>
          </div>
        </div>
      </div>
    </section>
  );
};
