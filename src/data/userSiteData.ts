export interface OriginalDenomination {
  id: string;
  usdLabel: string;
  priceTomans: number;
  oldPriceTomans: number;
}

export interface OriginalProduct {
  id: string;
  titleFa: string;
  titleEn: string;
  platform: 'steam' | 'playstation' | 'xbox' | 'apple' | 'googleplay' | 'nintendo';
  platformNameFa: string;
  region: string;
  rating: string;
  reviewsCount: string;
  description: string;
  iconName: string;
  iconBgClass: string;
  textAccentClass: string;
  activeDenomination: OriginalDenomination;
  denominations: OriginalDenomination[];
}

export const ORIGINAL_PRODUCTS: OriginalProduct[] = [
  {
    id: 'steam-10',
    titleFa: 'گیفت کارت ۱۰ دلاری استیم والت',
    titleEn: 'Steam Wallet',
    platform: 'steam',
    platformNameFa: 'استیم (Steam)',
    region: 'گلوبال / آمریکا',
    rating: '۵.۰',
    reviewsCount: '۴۸۲',
    description: 'شارژ فوری و بدون محدودیت والت استیم، قابل استفاده برای خرید تمامی بازی‌ها، بتل‌پس و آیتم‌های مارکت.',
    iconName: 'sports_esports',
    iconBgClass: 'bg-primary-container/20 text-primary',
    textAccentClass: 'text-primary',
    activeDenomination: { id: 's-10', usdLabel: '$10 USD', priceTomans: 640000, oldPriceTomans: 690000 },
    denominations: [
      { id: 's-5', usdLabel: '$5 USD', priceTomans: 325000, oldPriceTomans: 350000 },
      { id: 's-10', usdLabel: '$10 USD', priceTomans: 640000, oldPriceTomans: 690000 },
      { id: 's-20', usdLabel: '$20 USD', priceTomans: 1280000, oldPriceTomans: 1350000 },
      { id: 's-50', usdLabel: '$50 USD', priceTomans: 3190000, oldPriceTomans: 3350000 },
      { id: 's-100', usdLabel: '$100 USD', priceTomans: 6350000, oldPriceTomans: 6600000 },
    ],
  },
  {
    id: 'steam-20',
    titleFa: 'گیفت کارت ۲۰ دلاری استیم والت',
    titleEn: 'Steam Wallet',
    platform: 'steam',
    platformNameFa: 'استیم (Steam)',
    region: 'گلوبال / آمریکا',
    rating: '۴.۹',
    reviewsCount: '۳۲۹',
    description: 'بهترین گزینه برای خرید بازی‌های روز AAA استیم بدون کارمزد، شارژ مستقیم اکانت با فاکتور معتبر.',
    iconName: 'sports_esports',
    iconBgClass: 'bg-primary-container/20 text-primary',
    textAccentClass: 'text-primary',
    activeDenomination: { id: 's-20', usdLabel: '$20 USD', priceTomans: 1280000, oldPriceTomans: 1350000 },
    denominations: [
      { id: 's-10', usdLabel: '$10 USD', priceTomans: 640000, oldPriceTomans: 690000 },
      { id: 's-20', usdLabel: '$20 USD', priceTomans: 1280000, oldPriceTomans: 1350000 },
      { id: 's-25', usdLabel: '$25 USD', priceTomans: 1600000, oldPriceTomans: 1700000 },
      { id: 's-50', usdLabel: '$50 USD', priceTomans: 3190000, oldPriceTomans: 3350000 },
    ],
  },
  {
    id: 'psn-10',
    titleFa: 'گیفت کارت ۱۰ دلاری پلی استیشن آمریکا',
    titleEn: 'PlayStation Network',
    platform: 'playstation',
    platformNameFa: 'پلی‌استیشن (PSN)',
    region: 'آمریکا (USA)',
    rating: '۵.۰',
    reviewsCount: '۶۱۴',
    description: 'قابل استفاده در کنسول‌های PS4 و PS5 برای خرید بازی، افزونه‌ها و اشتراک پلاس پلی‌استیشن.',
    iconName: 'stadia_controller',
    iconBgClass: 'bg-secondary-container/20 text-secondary',
    textAccentClass: 'text-secondary',
    activeDenomination: { id: 'p-10', usdLabel: '$10 USD', priceTomans: 645000, oldPriceTomans: 690000 },
    denominations: [
      { id: 'p-10', usdLabel: '$10 USD', priceTomans: 645000, oldPriceTomans: 690000 },
      { id: 'p-25', usdLabel: '$25 USD', priceTomans: 1610000, oldPriceTomans: 1720000 },
      { id: 'p-50', usdLabel: '$50 USD', priceTomans: 3200000, oldPriceTomans: 3400000 },
      { id: 'p-100', usdLabel: '$100 USD', priceTomans: 6380000, oldPriceTomans: 6700000 },
    ],
  },
  {
    id: 'apple-25',
    titleFa: 'گیفت کارت ۲۵ دلاری اپل و آیتونز آمریکا',
    titleEn: 'Apple iTunes',
    platform: 'apple',
    platformNameFa: 'اپل (Apple)',
    region: 'آمریکا (USA)',
    rating: '۴.۸',
    reviewsCount: '۲۱۵',
    description: 'خرید نرم‌افزار، بازی و اشتراک iCloud و اپل موزیک در تمامی دستگاه‌های آیفون، آیپد و مک.',
    iconName: 'devices',
    iconBgClass: 'bg-primary-container/20 text-primary',
    textAccentClass: 'text-primary',
    activeDenomination: { id: 'a-25', usdLabel: '$25 USD', priceTomans: 1620000, oldPriceTomans: 1730000 },
    denominations: [
      { id: 'a-10', usdLabel: '$10 USD', priceTomans: 650000, oldPriceTomans: 690000 },
      { id: 'a-25', usdLabel: '$25 USD', priceTomans: 1620000, oldPriceTomans: 1730000 },
      { id: 'a-50', usdLabel: '$50 USD', priceTomans: 3230000, oldPriceTomans: 3410000 },
      { id: 'a-100', usdLabel: '$100 USD', priceTomans: 6450000, oldPriceTomans: 6800000 },
    ],
  },
  {
    id: 'xbox-ultimate',
    titleFa: 'اشتراک ۱ ماهه ایکس‌باکس گیم‌پس التیمیت',
    titleEn: 'Xbox Game Pass',
    platform: 'xbox',
    platformNameFa: 'ایکس‌باکس (Xbox)',
    region: 'گلوبال',
    rating: '۴.۹',
    reviewsCount: '۵۲۳',
    description: 'دسترسی نامحدود به صدها بازی برتر روز روی کنسول‌های ایکس‌باکس و کامپیوتر همراه با اشتراک آنلاین EA Play.',
    iconName: 'gamepad',
    iconBgClass: 'bg-secondary-container/20 text-secondary',
    textAccentClass: 'text-secondary',
    activeDenomination: { id: 'x-1m', usdLabel: '1 Month Ultimate', priceTomans: 920000, oldPriceTomans: 990000 },
    denominations: [
      { id: 'x-1m', usdLabel: '1 Month Ultimate', priceTomans: 920000, oldPriceTomans: 990000 },
      { id: 'x-3m', usdLabel: '3 Months Ultimate', priceTomans: 2650000, oldPriceTomans: 2850000 },
      { id: 'x-25usd', usdLabel: '$25 USD Gift', priceTomans: 1620000, oldPriceTomans: 1720000 },
      { id: 'x-50usd', usdLabel: '$50 USD Gift', priceTomans: 3220000, oldPriceTomans: 3400000 },
    ],
  },
  {
    id: 'gp-50',
    titleFa: 'گیفت کارت ۵۰ دلاری گوگل پلی آمریکا',
    titleEn: 'Google Play Store',
    platform: 'googleplay',
    platformNameFa: 'گوگل پلی (Google Play)',
    region: 'آمریکا (USA)',
    rating: '۴.۷',
    reviewsCount: '۱۷۴',
    description: 'مخصوص خرید نرم‌افزار، کتاب الکترونیک، فیلم و پرداخت‌های درون‌برنامه‌ای بازی‌های اندرویدی.',
    iconName: 'shop',
    iconBgClass: 'bg-tertiary-container/20 text-tertiary',
    textAccentClass: 'text-tertiary',
    activeDenomination: { id: 'gp-50', usdLabel: '$50 USD', priceTomans: 3190000, oldPriceTomans: 3350000 },
    denominations: [
      { id: 'gp-10', usdLabel: '$10 USD', priceTomans: 650000, oldPriceTomans: 690000 },
      { id: 'gp-25', usdLabel: '$25 USD', priceTomans: 1625000, oldPriceTomans: 1730000 },
      { id: 'gp-50', usdLabel: '$50 USD', priceTomans: 3190000, oldPriceTomans: 3350000 },
      { id: 'gp-100', usdLabel: '$100 USD', priceTomans: 6380000, oldPriceTomans: 6700000 },
    ],
  },
];
