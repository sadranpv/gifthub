export const formatTomans = (amount: number): string => {
  try {
    return new Intl.NumberFormat('fa-IR').format(amount || 0);
  } catch {
    return String(amount || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

export const formatPersianNumber = (num: number | string): string => {
  try {
    return new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(Number(num) || 0);
  } catch {
    return String(num || 0);
  }
};

export const generateLicenseCode = (platform: string): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = (len: number) => 
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  
  const prefix = platform.toUpperCase().slice(0, 4);
  return `${prefix}-${segment(4)}-${segment(4)}-${segment(4)}`;
};

export const generatePinCode = (): string => {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
};
