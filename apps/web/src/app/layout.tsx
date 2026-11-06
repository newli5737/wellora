import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Wellora Healthcare — Phòng khám & Đặt lịch khám chuẩn mực',
  description:
    'Wellora Healthcare cung cấp dịch vụ thăm khám sức khỏe toàn diện, y học gia đình và chăm sóc phòng ngừa với quy trình đặt lịch minh bạch, nhanh chóng và bảo mật.',
  metadataBase: new URL('http://localhost:3000'),
  icons: {
    icon: '/images/brand/wellora-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-surface-canvas text-typography-primary selection:bg-brand-500 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

