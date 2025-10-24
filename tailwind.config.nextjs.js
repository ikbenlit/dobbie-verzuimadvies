/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  safelist: [
    'dark',
  ],
  theme: {
    extend: {
      colors: {
        // Primaire kleuren
        'bordeaux': {
          DEFAULT: '#771138',
          hover: '#5A0D29',
        },
        'cream': '#F5F2EB',

        // Accentkleuren
        'gold': '#E9B046',
        'gray': {
          light: '#D1D5DB',
          dark: '#3D3D3D',
        },

        // Neutrale kleuren
        'black': '#000000',
        'white': '#FFFFFF',

        // Status kleuren
        'status': {
          'success': '#28a745',
          'warning': '#ffc107',
          'error': '#dc3545',
        }
      },
      fontFamily: {
        'sans': ['var(--font-open-sans)', ...defaultTheme.fontFamily.sans],
        'serif': ['var(--font-times)', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        'body': '15px',
        'button': '16px',
        'h3': '20px',
        'h2': '24px',
        'h1': '28px',
        'small': '14px',
      },
      borderRadius: {
        'button': '6px',
        'input': '6px',
        'card': '8px',
        'chat': {
          'bot': '16px 16px 16px 4px',
          'user': '16px 16px 4px 16px',
        },
        'quick-reply': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.1)',
        'chat': '0 4px 12px rgba(0,0,0,0.15)',
        'widget': '0 4px 12px rgba(119,17,56,0.3)',
      },
    },
  },
  plugins: [forms, typography],
};
