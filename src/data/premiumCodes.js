// 20 Unique GrrMondays Premium Access Codes
export const PREMIUM_CODES = [
  'GRR-PREMIUM-7729',
  'MONDAY-VIP-4810',
  'UNBLOCKED-PRO-9142',
  'DISCORD-PASS-3058',
  'GRR-ELITE-6614',
  'CHOMP-PRO-8821',
  'MONDAYS-SQUAD-1994',
  'GRR-GOLD-5203',
  'BEAR-SUPREME-4417',
  'GAMER-CLUB-7731',
  'VIP-ARCADE-2024',
  'UNLIMITED-ACCESS-8390',
  'DISCORD-VIP-1104',
  'GRR-MON-9952',
  'PRO-GAMER-6381',
  'MONDAYS-CHAMP-2401',
  'ELITE-PASS-5573',
  'SECRET-UNLOCK-8842',
  'DISCORD-REWARD-3197',
  'GRR-LEGEND-4029',
];

const STORAGE_KEY_PREMIUM = 'grrmondays_is_premium';
const STORAGE_KEY_REDEEMED_CODE = 'grrmondays_redeemed_code';

export const isPremiumUser = () => {
  try {
    return localStorage.getItem(STORAGE_KEY_PREMIUM) === 'true';
  } catch {
    return false;
  }
};

export const setPremiumStatus = (status, code = '') => {
  try {
    if (status) {
      localStorage.setItem(STORAGE_KEY_PREMIUM, 'true');
      if (code) localStorage.setItem(STORAGE_KEY_REDEEMED_CODE, code.toUpperCase());
    } else {
      localStorage.removeItem(STORAGE_KEY_PREMIUM);
      localStorage.removeItem(STORAGE_KEY_REDEEMED_CODE);
    }
  } catch (err) {
    console.warn('Storage write failed', err);
  }
};

export const validatePremiumCode = (inputCode) => {
  if (!inputCode) return false;
  const clean = inputCode.trim().toUpperCase();
  return PREMIUM_CODES.includes(clean);
};
