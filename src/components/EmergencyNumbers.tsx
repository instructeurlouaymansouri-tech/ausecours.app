'use client';

import { useI18n } from '@/lib/i18n';

const NUMBERS = [
  { num: '190', l: { tn: 'إسعاف SAMU', ar: 'إسعاف SAMU', fr: 'SAMU / Ambulance', en: 'SAMU / Ambulance' }, s: { tn: 'الحالات الطبية الطارئة', ar: 'الحالات الطبية الطارئة', fr: 'Urgences médicales', en: 'Medical emergencies' } },
  { num: '197', l: { tn: 'بوليس النجدة', ar: 'شرطة النجدة', fr: 'Police Secours', en: 'Police' }, s: { tn: 'حوادث وأمن', ar: 'حوادث وأمن', fr: 'Sécurité et accidents', en: 'Security and accidents' } },
  { num: '198', l: { tn: 'الحماية المدنية', ar: 'الحماية المدنية', fr: 'Protection Civile', en: 'Civil Protection / Fire' }, s: { tn: 'حريق وإنقاذ', ar: 'حريق وإنقاذ', fr: 'Incendie et sauvetage', en: 'Fire and rescue' } },
  { num: '193', l: { tn: 'الحرس الوطني', ar: 'الحرس الوطني', fr: 'Garde Nationale', en: 'National Guard' }, s: { tn: 'المناطق الريفية والطرق السريعة', ar: 'المناطق الريفية والطرق السريعة', fr: 'Zones rurales et autoroutes', en: 'Rural areas and highways' } },
];

export default function EmergencyNumbers() {
  const { lang } = useI18n();
  const callLabel = { tn: 'عيّط', ar: 'اتصل', fr: 'Appeler', en: 'Call' }[lang];

  return (
    <div className="grid gap-3">
      {NUMBERS.map((n) => (
        <div key={n.num} className="flex items-center justify-between rounded-2xl border border-white/10 bg-card p-5">
          <div className="flex items-center gap-3.5">
            <div className="font-display text-3xl font-bold text-accent">{n.num}</div>
            <div>
              <div className="text-sm font-bold">{n.l[lang]}</div>
              <div className="text-xs text-muted">{n.s[lang]}</div>
            </div>
          </div>
          <a href={`tel:${n.num}`} className="flex items-center gap-1.5 rounded-xl bg-success px-4.5 py-2.5 text-sm font-bold text-[#062]">
            📞 {callLabel}
          </a>
        </div>
      ))}
    </div>
  );
}
