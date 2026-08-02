'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANGS, useI18n } from '@/lib/i18n';

const LINKS = [
  { href: '/', key: 'nav_home' },
  { href: '/chat', key: 'nav_chat' },
  { href: '/hospitals', key: 'nav_hospitals' },
  { href: '/cpr', key: 'nav_cpr' },
  { href: '/awareness', key: 'nav_awareness' },
  { href: '/numbers', key: 'nav_numbers' },
];

export default function Nav() {
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-bg/85 px-5 py-3 backdrop-blur-lg">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold font-display">
        <span className="h-2.5 w-2.5 animate-blip rounded-full bg-accent shadow-glow" />
        AUSECOURS
        <small className="ms-2 text-[11px] font-medium text-muted">{t('slogan')}</small>
      </Link>

      <div className="order-3 flex w-full flex-wrap justify-center gap-1 overflow-x-auto md:order-none md:w-auto">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-full px-3 py-2 text-[13px] font-semibold transition ${
              pathname === l.href ? 'bg-card text-white' : 'text-muted hover:text-white'
            }`}
          >
            {t(l.key)}
          </Link>
        ))}
      </div>

      <div className="flex gap-0.5 rounded-full border border-white/10 bg-card p-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`rounded-full px-2.5 py-1.5 text-xs font-bold ${
              lang === l.code ? 'bg-accent text-white' : 'text-muted'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
