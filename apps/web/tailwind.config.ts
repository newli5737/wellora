import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
          950: 'var(--brand-950)',
        },
        surface: {
          canvas: 'var(--surface-canvas)',
          raised: 'var(--surface-raised)',
          subtle: 'var(--surface-subtle)',
          dark: 'var(--surface-dark)',
          'dark-elevated': 'var(--surface-dark-elevated)',
        },
        typography: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
          'inverse-muted': 'var(--text-inverse-muted)',
        },
        border: {
          default: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
          dark: 'var(--border-dark)',
        },
        status: {
          success: 'var(--status-success)',
          'success-bg': 'var(--status-success-bg)',
          'success-border': 'var(--status-success-border)',
          warning: 'var(--status-warning)',
          'warning-bg': 'var(--status-warning-bg)',
          'warning-border': 'var(--status-warning-border)',
          danger: 'var(--status-danger)',
          'danger-bg': 'var(--status-danger-bg)',
          'danger-border': 'var(--status-danger-border)',
          info: 'var(--status-info)',
          'info-bg': 'var(--status-info-bg)',
          'info-border': 'var(--status-info-border)',
        },
      },
    },
  },
  plugins: [],
};

export default config;

