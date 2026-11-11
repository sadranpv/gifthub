import React, { useState } from 'react';
import { FAQS } from '../data/giftCards';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#0B0E17]" id="faq">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>راهنمای خرید و پاسخ به پرسش‌ها</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            سوالات متداول مشتریان گیفت‌هاب
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            هر آنچه لازم است درباره زمان تحویل، نحوه فعال‌سازی، ریجن‌ها و پشتیبانی بدانید.
          </p>
        </div>

        {/* Accordion Items */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#14192b]/90 border border-white/10 overflow-hidden transition-all text-right shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-right hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 bg-[#0e1220]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
