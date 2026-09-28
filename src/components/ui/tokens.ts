/**
 * ProjectForge AI Design System Tokens
 * Defines standardized tokens for colors, typography, elevations,
 * transitions, and responsive layout breakpoints.
 */

export const tokens = {
  colors: {
    // Primary brand palette (Indigo / Soft Violet)
    brand: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1', // Primary Accent
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b'
    },
    violet: {
      400: '#a78bfa',
      500: '#8b5cf6', // Secondary Accent
      600: '#7c3aed'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#6366f1'
    },
    dark: {
      bgPrimary: '#080A12',
      bgSecondary: '#0B0D16',
      bgTertiary: '#10131F',
      card: '#141725',
      cardHover: '#1A1E30',
      input: '#0D101C',
      border: 'rgba(255, 255, 255, 0.07)',
      borderHover: 'rgba(255, 255, 255, 0.14)'
    },
    light: {
      bgPrimary: '#f8fafc',
      bgSecondary: '#ffffff',
      bgTertiary: '#f1f5f9',
      card: '#ffffff',
      cardHover: '#f8fafc',
      input: '#ffffff',
      border: 'rgba(0, 0, 0, 0.08)',
      borderHover: 'rgba(0, 0, 0, 0.16)'
    }
  },

  typography: {
    pageTitle: 'text-2xl sm:text-3xl font-bold tracking-tight',
    sectionTitle: 'text-lg sm:text-xl font-semibold tracking-tight',
    cardTitle: 'text-base font-semibold tracking-tight',
    body: 'text-sm text-[var(--text-muted)]',
    secondary: 'text-xs text-[var(--text-muted)]',
    metadata: 'text-[11px] text-[var(--text-dim)] font-medium'
  },

  radii: {
    none: '0px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px'
  },

  shadows: {
    subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
    card: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
    elevated: '0 12px 30px -4px rgba(0, 0, 0, 0.5)'
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px'
  }
} as const;

export type DesignTokens = typeof tokens;
