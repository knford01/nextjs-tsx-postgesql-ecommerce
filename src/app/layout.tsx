import { Metadata } from 'next';
import { inter } from '@/styles/fonts';
import "./globals.css";
import '@/styles/background.css';
import '@/styles/website.css';

export const metadata: Metadata = {
  title: {
    default: 'Supply Chain Management - Warehousing & Order Fulfillment',
    template: '%s | AR-Source Dashboard',
  },
  description: 'Expert warehousing and order fulfillment services through EDI and API.',
  keywords: ['supply chain', 'warehousing', 'order fulfillment', 'EDI', 'API', 'custom software'],
  openGraph: {
    title: 'Supply Chain Management - Warehousing & Order Fulfillment',
    description: 'Expert warehousing and order fulfillment services through EDI and API.',
    images: '/images/hero-image.jpg',
    url: 'https://www.arsourcesoftware.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supply Chain Management - Warehousing & Order Fulfillment',
    description: 'Expert warehousing and order fulfillment services through EDI and API.',
    images: '/images/hero-image.jpg',
  },
  metadataBase: new URL('https://www.arsourcesoftware.com/'),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
} 
