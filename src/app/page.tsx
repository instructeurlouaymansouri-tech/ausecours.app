'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import EcgLine from '@/components/EcgLine';
import AvatarHero from '@/components/AvatarHero';
import { useVoice } from '@/components/useVoice';
import HeroAnimation from '@/components/hero/HeroAnimation';

const CAP_ICONS = ['🫀', '🩹', '🔥', '🧠', '🫁', '☠️', '🧒', '⚡'];
const CAP_LABELS: Record<string, string[]> = {
  tn: ['CPR وإنعاش قلبي', 'نزيف وجروح', 'حروق', 'سكتة دماغية', 'اختناق', 'تسمم', 'طوارئ للأطفال', 'صعقة كهربائية'],
  ar: ['الإنعاش القلبي CPR', 'النزيف والجروح', 'الحروق', 'السكتة الدماغية', 'الاختناق', 'التسمم', 'طوارئ الأطفال', 'الصعق الكهربائي'],
  fr: ['RCP & réanimation', 'Saignements', 'Brûlures', 'AVC', 'Étouffement', 'Intoxication', 'Urgences pédiatriques', 'Choc électrique'],
  en: ['CPR & Resuscitation', 'Bleeding & Wounds', 'Burns', 'Stroke', 'Choking', 'Poisoning', 'Pediatric Emergencies', 'Electric Shock'],
};

export default function HomePage() {
  const { t, lang } = useI18n();
  const noop = useCallback(() => {}, []);
  const { listening, toggleListen } = useVoice(lang, () => {
    window.location.href = '/chat';
  });
  const [heroDone, setHeroDone] = useState(false);

  return (
    <>
      <HeroAnimation onComplete={() => setHeroDone(true)} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: heroDone ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
      <div>
      <section className="px-5 pb-3 pt-10">
        <EcgLine />
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center md:text-start">
            <div className="mb-4.5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              {t('hero_eyebrow')}
            </div>
            <h1 className="mb-3.5 font-display text-4xl font-bold leading-tight md:text-5xl">{t('hero_title')}</h1>
            <p className="mb-6 max-w-[520px] text-muted md:text-base">{t('hero_lead')}</p>

            <div className="mb-6 max-w-[480px] rounded-2xl border border-white/10 bg-card p-4.5 mx-auto md:mx-0">
              <p className="text-[15px]">{t('hero_greeting')}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href="/chat" className="rounded-xl bg-gradient-to-br from-accent to-secondary px-5 py-3.5 text-sm font-bold shadow-glow">
                {t('btn_startchat')}
              </Link>
              <button onClick={toggleListen} className="rounded-xl border border-white/10 bg-card px-5 py-3.5 text-sm font-bold">
                {t('btn_presstalk')}
              </button>
            </div>

            <div className="mx-auto mt-4.5 grid max-w-[520px] grid-cols-2 gap-2.5 sm:grid-cols-3 md:mx-0">
              <Link href="/hospitals" className="rounded-xl border border-white/10 bg-card2 p-3 text-center text-xs font-semibold text-muted hover:text-white">
                {t('btn_hospitals')}
              </Link>
              <Link href="/cpr" className="rounded-xl border border-white/10 bg-card2 p-3 text-center text-xs font-semibold text-muted hover:text-white">
                {t('btn_cpr')}
              </Link>
              <Link href="/awareness" className="rounded-xl border border-white/10 bg-card2 p-3 text-center text-xs font-semibold text-muted hover:text-white">
                {t('btn_awareness')}
              </Link>
              <Link href="/numbers" className="rounded-xl border border-white/10 bg-card2 p-3 text-center text-xs font-semibold text-muted hover:text-white">
                {t('btn_numbers')}
              </Link>
            </div>
          </div>

          <AvatarHero listening={listening} onMicClick={toggleListen} />
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 pb-16 pt-8">
        <div className="mb-5">
          <h2 className="mb-1.5 font-display text-2xl font-bold md:text-3xl">
            {lang === 'fr' ? 'Ce que l’assistant sait faire' : lang === 'en' ? 'What the assistant can help with' : 'قدرات المساعد'}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CAP_LABELS[lang].map((label, i) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-card p-4.5">
              <div className="mb-2.5 text-2xl">{CAP_ICONS[i]}</div>
              <div className="text-sm font-bold">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
      </motion.div>
    </>
  );
}
