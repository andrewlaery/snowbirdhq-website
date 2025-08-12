import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Snowbird | Luxury Property Management Queenstown',
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
  authors: [{ name: 'Snowbird' }],
  creator: 'Snowbird',
  publisher: 'Snowbird',
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
    siteName: 'Snowbird',
    title: 'Snowbird | Luxury Property Management Queenstown',
    description:
      'The property management you want. The returns you need. Premium short-term rental management in Queenstown, New Zealand.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snowbird | Luxury Property Management Queenstown',
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
      <body className='antialiased'>{children}</body>
    </html>
  );
}
