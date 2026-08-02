import type { Metadata, Viewport } from 'next';
import { Rajdhani, Inter, Cairo } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-rajdhani' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['500', '600', '700'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: 'AUSECOURS — Every Second Saves a Life',
  description:
    'AUSECOURS is an AI emergency first-aid assistant for Tunisia, offering multilingual (Derja, Arabic, French, English) step-by-step guidance. Not a substitute for emergency services.',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body className={`${rajdhani.variable} ${inter.variable} ${cairo.variable} font-body bg-bg text-white antialiased`}>
        <I18nProvider>
          <div className="min-h-screen flex flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </I18nProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
