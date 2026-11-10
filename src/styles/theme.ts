export const theme = {
  colors: {
    primary: '#0A43C2',
    primaryHover: '#0835A0',
    primarySoft: '#EBF1FD',
    ink: '#1E2128',
    text: '#40434A',
    muted: '#6B7280',
    subtle: '#9CA3AF',
    line: '#E5E7EB',
    surface: '#FFFFFF',
    background: '#F5F7FA',
    dark: '#141B2D',
    kakao: '#FEE500',
    kakaoText: '#191919',
    warning: '#B45309',
    warningSoft: '#FEF3C7',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1.25rem',
    full: '999px',
  },
  shadow: {
    card: '0 1px 2px rgba(17, 24, 39, 0.04), 0 0.5rem 1.5rem rgba(17, 24, 39, 0.06)',
    float: '0 0.75rem 2rem rgba(17, 24, 39, 0.18)',
  },
  layout: {
    maxWidth: '75rem',
    headerHeight: '4rem',
  },
  media: {
    tablet: '@media (max-width: 1023px)',
    mobile: '@media (max-width: 767px)',
    small: '@media (max-width: 359px)',
  },
} as const;

export type AppTheme = typeof theme;
