/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.mdx',
    './mdx-components.tsx',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        snowbird: {
          blue: '#B5D3D7',
          'blue-dark': '#9BC5CA',
        },
        muted: '#999',
      },
      fontFamily: {
        serif: [
          'var(--font-cormorant)',
          'Cormorant Garamond',
          'Georgia',
          'serif',
        ],
        sans: [
          'var(--font-inter)',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        gallery: '8rem',
      },
      letterSpacing: {
        'wider-xl': '0.2em',
      },
    },
  },
  plugins: [],
};
