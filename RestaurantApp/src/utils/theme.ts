// Design tokens — Luxury Hospitality Theme
export const Colors = {
  // Core palette
  bg:         '#F8F5F0',   // warm cream background
  bgDark:     '#1C1917',   // near-black surface
  surface:    '#FFFFFF',   // card surface
  surfaceWarm:'#FAF8F5',   // slightly tinted card
  border:     '#E8E2D9',   // subtle warm border
  borderDark: '#2C2926',

  // Brand
  gold:       '#C9A84C',   // premium gold accent
  goldLight:  '#F0E4BE',
  goldDark:   '#9A7835',

  // Text
  textPrimary:   '#1C1917',
  textSecondary: '#78716C',
  textMuted:     '#A8A29E',
  textInverse:   '#F8F5F0',

  // Status
  success:  '#2D6A4F',
  successBg:'#D8F3DC',
  warning:  '#B45309',
  warningBg:'#FEF3C7',
  danger:   '#9B1C1C',
  dangerBg: '#FEE2E2',

  // Tab / Nav
  tabBg:    '#1C1917',
  tabActive:'#C9A84C',
  tabInactive:'#78716C',
};

export const Typography = {
  heading1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, color: Colors.textPrimary },
  heading2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3, color: Colors.textPrimary },
  heading3: { fontSize: 18, fontWeight: '600' as const, color: Colors.textPrimary },
  body:     { fontSize: 14, fontWeight: '400' as const, lineHeight: 22, color: Colors.textSecondary },
  caption:  { fontSize: 12, fontWeight: '500' as const, color: Colors.textMuted },
  label:    { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.8, color: Colors.textMuted },
};

export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const Radius = {
  sm: 8, md: 12, lg: 18, xl: 24, full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
};
