import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SnowbirdHQ | Luxury Property Management Queenstown',
  description:
    'The property management you want. The returns you need. Premium short-term rental management in Queenstown, New Zealand.',
  keywords: [
    'property management',
    'Queenstown',
    'luxury rentals',
    'short-term rental',
    'Airbnb management',
    'New Zealand',
    'vacation rentals',
  ],
  authors: [{ name: 'SnowbirdHQ' }],
  creator: 'SnowbirdHQ',
  publisher: 'SnowbirdHQ',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: 'https://snowbirdhq.com',
    siteName: 'SnowbirdHQ',
    title: 'SnowbirdHQ | Luxury Property Management Queenstown',
    description:
      'The property management you want. The returns you need. Premium short-term rental management in Queenstown, New Zealand.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnowbirdHQ | Luxury Property Management Queenstown',
    description: 'The property management you want. The returns you need.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#B5D3D7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link rel='canonical' href='https://snowbirdhq.com' />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased font-sans`}>{children}</body>
    </html>
  );
}
