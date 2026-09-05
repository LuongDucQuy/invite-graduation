import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Graduation Ceremony — Lương Đức Quý | Thiệp Mời Tốt Nghiệp',
  description: 'Trân trọng kính mời bạn đến tham dự Lễ Tốt Nghiệp của Lương Đức Quý.',
  openGraph: {
    title: 'Graduation Ceremony — Lương Đức Quý',
    description: 'Trân trọng kính mời bạn đến tham dự Lễ Tốt Nghiệp của Lương Đức Quý.',
    url: 'https://domain.com',
    siteName: 'Graduation Invitation',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Graduation Ceremony',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="antialiased bg-cream-50 text-slate-900 selection:bg-champagne-400 selection:text-navy-950">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
