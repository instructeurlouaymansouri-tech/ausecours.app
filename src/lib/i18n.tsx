'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type Lang = 'tn' | 'ar' | 'fr' | 'en';

export const LANGS: { code: Lang; label: string; dir: 'rtl' | 'ltr' }[] = [
  { code: 'tn', label: 'TN', dir: 'rtl' },
  { code: 'ar', label: 'AR', dir: 'rtl' },
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'en', label: 'EN', dir: 'ltr' },
];

// Core UI strings. Extend freely — this is intentionally a flat dictionary
// so translators/non-devs can edit it without touching component code.
export const DICT: Record<Lang, Record<string, string>> = {
  tn: {
    slogan: 'كل ثانية تنجي حياة',
    nav_home: 'الرئيسية', nav_chat: 'الشات', nav_hospitals: 'المستشفيات',
    nav_cpr: 'تعليم CPR', nav_awareness: 'وعي يومي', nav_numbers: 'أرقام الطوارئ',
    hero_eyebrow: 'مساعد ذكي للإسعافات الأولية · تونس',
    hero_title: 'AUSECOURS، معاك في كل ثانية',
    hero_lead: 'مساعد ذكاء اصطناعي يفهم الدارجة التونسية ويعطيك تعليمات إسعافات أولية سريعة وواضحة. ماهوش بديل لمصالح الطوارئ.',
    hero_greeting: 'صحيت، أنا المساعد متاعك للطوارئ. إسمي AUSECOURS. شنوة الطارئ متاعك؟',
    btn_startchat: 'ابدا شات', btn_presstalk: 'دوس واتكلم',
    btn_hospitals: 'مستشفيات قريبة', btn_cpr: 'شوف فيديو CPR',
    btn_awareness: 'وعي يومي', btn_numbers: 'أرقام الطوارئ',
    chat_disclaimer: 'AUSECOURS معلومات إسعافات أولية تعليمية برك، ماهوش بديل للطبيب أو الإسعاف. في حالة خطر: عيّط 190.',
    footer_tag: 'مساعد إسعافات أولية بالذكاء الاصطناعي',
  },
  ar: {
    slogan: 'كل ثانية تنقذ حياة',
    nav_home: 'الرئيسية', nav_chat: 'المحادثة', nav_hospitals: 'المستشفيات',
    nav_cpr: 'مركز تعلم CPR', nav_awareness: 'وعي يومي', nav_numbers: 'أرقام الطوارئ',
    hero_eyebrow: 'مساعد ذكاء اصطناعي للإسعافات الأولية · تونس',
    hero_title: 'AUSECOURS، معك في كل ثانية',
    hero_lead: 'مساعد ذكي متعدد اللغات يقدم لك إرشادات إسعافات أولية سريعة وواضحة. لا يُعد بديلاً عن خدمات الطوارئ.',
    hero_greeting: 'أهلاً، أنا مساعدك للطوارئ. اسمي AUSECOURS. ما هي حالتك الطارئة؟',
    btn_startchat: 'ابدأ محادثة', btn_presstalk: 'اضغط وتحدث',
    btn_hospitals: 'مستشفيات قريبة', btn_cpr: 'مشاهدة فيديو CPR',
    btn_awareness: 'وعي يومي', btn_numbers: 'أرقام الطوارئ',
    chat_disclaimer: 'AUSECOURS يقدم معلومات إسعافات أولية تعليمية فقط، وليس بديلاً عن طبيب أو إسعاف. في حالة الخطر اتصل بـ 190.',
    footer_tag: 'مساعد إسعافات أولية بالذكاء الاصطناعي',
  },
  fr: {
    slogan: 'Chaque seconde sauve une vie',
    nav_home: 'Accueil', nav_chat: 'Chat', nav_hospitals: 'Hôpitaux',
    nav_cpr: 'Centre RCP', nav_awareness: 'Sensibilisation', nav_numbers: 'Numéros d’urgence',
    hero_eyebrow: 'Assistant IA de premiers secours · Tunisie',
    hero_title: 'AUSECOURS, avec vous à chaque seconde',
    hero_lead: 'Un assistant IA multilingue qui donne des instructions de premiers secours claires et rapides. Ne remplace pas les services d’urgence.',
    hero_greeting: 'Bonjour, je suis votre assistant d’urgence. Je m’appelle AUSECOURS. Quelle est votre urgence ?',
    btn_startchat: 'Démarrer le chat', btn_presstalk: 'Appuyer pour parler',
    btn_hospitals: 'Hôpitaux proches', btn_cpr: 'Voir vidéo RCP',
    btn_awareness: 'Sensibilisation', btn_numbers: 'Numéros d’urgence',
    chat_disclaimer: 'AUSECOURS fournit des informations éducatives de premiers secours uniquement. En cas de danger, appelez le 190.',
    footer_tag: 'Assistant IA de premiers secours',
  },
  en: {
    slogan: 'Every Second Saves a Life',
    nav_home: 'Home', nav_chat: 'Chat', nav_hospitals: 'Hospitals',
    nav_cpr: 'CPR Center', nav_awareness: 'Daily Awareness', nav_numbers: 'Emergency Numbers',
    hero_eyebrow: 'AI Emergency First-Aid Assistant · Tunisia',
    hero_title: 'AUSECOURS, with you every second',
    hero_lead: 'A multilingual AI assistant giving clear, fast first-aid guidance. It does not replace emergency services.',
    hero_greeting: 'Hey there, I’m your emergency assistant. My name is AUSECOURS. What is your emergency?',
    btn_startchat: 'Start Chat', btn_presstalk: 'Press To Talk',
    btn_hospitals: 'Nearby Hospitals', btn_cpr: 'Watch CPR',
    btn_awareness: 'Daily Awareness', btn_numbers: 'Emergency Numbers',
    chat_disclaimer: 'AUSECOURS provides educational first-aid information only, not a substitute for professional care. If life-threatening, call 190.',
    footer_tag: 'AI first-aid assistant',
  },
};

interface I18nCtx {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('tn');
  const dir = LANGS.find((l) => l.code === lang)?.dir ?? 'rtl';

  const value = useMemo<I18nCtx>(
    () => ({
      lang,
      dir,
      setLang,
      t: (key: string) => DICT[lang][key] ?? DICT.en[key] ?? key,
    }),
    [lang, dir]
  );

  return (
    <Ctx.Provider value={value}>
      <div dir={dir} lang={lang === 'fr' ? 'fr' : lang === 'en' ? 'en' : 'ar'}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
