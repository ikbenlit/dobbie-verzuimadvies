/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import defaultTheme from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './src/**/*.{html,js,svelte,ts,tsx,jsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  safelist: [
    'dark', // Zorg ervoor dat 'dark' beschikbaar is, ook al gebruik je het misschien nog niet overal.
    // Voeg hier andere klassen toe die je dynamisch genereert en niet wilt laten purgen
  ],
  theme: {
    extend: {
      colors: {
        // Primaire kleuren
        'bordeaux': {
          DEFAULT: '#771138', // Hoofdaccent
          hover: '#5A0D29',   // Hover staat
        },
        'cream': '#F5F2EB',   // Licht Crème

        // Accentkleuren
        'gold': {
          DEFAULT: '#E9B046',    // Goudgeel
          light: '#F0C674',      // Lichtere gold variant
        },
        'teal': {
          DEFAULT: '#2C5F5D',    // Diep teal - secundaire kleur
          dark: '#234A48',       // Hover staat
          light: '#3A7B78',      // Lichtere teal variant
        },
        'gray': {
          light: '#D1D5DB',   // Lichtgrijs
          dark: '#3D3D3D',    // Donkergrijs
        },

        // Brand colors voor mockup
        'brand': {
          dark: '#5A0D29',      // Donkere bordeaux
          light: '#FDF5F8',     // Zeer lichte bordeaux/rose tint
          text: '#3D3D3D',      // Primaire tekst kleur
          accent: '#E9B046',    // Gold accent
          secondary: '#2C5F5D', // Teal secundaire accent
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
        'sans': ['Open Sans', ...defaultTheme.fontFamily.sans],
        'serif': ['Times New Roman', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        'body': '15px',      // Body tekst
        'button': '16px',    // Knoppen
        'h3': '20px',        // Subkoppen
        'h2': '24px',        // Sectietitel
        'h1': '28px',        // Hoofdtitel
        'small': '14px',     // Kleine tekst
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
} 