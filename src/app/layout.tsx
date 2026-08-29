import type { Metadata,Viewport } from 'next';
import { Rajdhani,Inter,Cairo } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
const rajdhani=Rajdhani({subsets:['latin'],weight:['500','600','700'],variable:'--font-rajdhani'});
const inter=Inter({subsets:['latin'],variable:'--font-inter'});
const cairo=Cairo({subsets:['arabic','latin'],weight:['500','600','700'],variable:'--font-cairo'});
export const metadata:Metadata={title:'AUSECOURS — النجدة | AI Emergency Assistant',description:'AUSECOURS — multilingual AI emergency guidance and first-aid education for Tunisia.',manifest:'/manifest.json',icons:{icon:'/icons/icon-192.png',apple:'/icons/icon-192.png'}};
export const viewport:Viewport={themeColor:'#07090d',width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${rajdhani.variable} ${inter.variable} ${cairo.variable}`}><I18nProvider><div className="app-shell"><Nav/><main>{children}</main><Footer/></div></I18nProvider></body></html>}
