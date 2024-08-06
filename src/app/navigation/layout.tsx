//Partial Rendering - One benefit of using layouts in Next.js is that on navigation, only the page components update while the layout won't re-render
import { Metadata } from 'next';
import { inter } from '@/styles/fonts';
import "../globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s | AR-Source Dashboard',
    default: 'AR-Source Software',
  },
  description: 'The official AR-Source Software Website.',
  metadataBase: new URL('https://www.arsourcesoftware.com/'),
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