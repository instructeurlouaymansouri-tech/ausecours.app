'use client';

import { useI18n } from '@/lib/i18n';

const DAY_TIPS = [
  {
    tag: { tn: 'نصيحة اليوم', ar: 'نصيحة اليوم', fr: 'Astuce du jour', en: 'Tip of the day' },
    title: {
      tn: 'شرب الماء يحمي من ضربة الشمس',
      ar: 'شرب الماء يقيك من ضربة الشمس',
      fr: 'Boire de l’eau protège du coup de chaleur',
      en: 'Drinking water protects against heat stroke',
    },
    text: {
      tn: 'في الصيف التونسي، اشرب ماء بشكل منتظم حتى إذا ماحسيتش بالعطش، وتجنب الشمس بين 12-16.',
      ar: 'في الصيف، اشرب الماء بانتظام حتى دون الشعور بالعطش، وتجنّب الشمس بين الساعة 12 و16.',
      fr: 'En été tunisien, buvez régulièrement même sans soif, et évitez le soleil entre 12h et 16h.',
      en: 'During Tunisian summer, drink water regularly even without feeling thirsty, and avoid direct sun between 12–4pm.',
    },
    myth: { tn: 'تحط زيت على الحرق', ar: 'وضع الزيت على الحرق', fr: 'Mettre de l’huile sur une brûlure', en: 'Putting oil on a burn' },
    fact: {
      tn: 'بلل الحرق بماء بارد 10-20 دقيقة برك',
      ar: 'بلّل الحرق بماء بارد لمدة 10-20 دقيقة فقط',
      fr: 'Rincez la brûlure à l’eau froide 10-20 min',
      en: 'Cool the burn with cold water for 10-20 minutes only',
    },
  },
];

const CARDS: Record<string, [string, string][]> = {
  tn: [
    ['🌡️ حرّ', 'اشرب ماء وابعد عن الشمس في وقت الظهر.'],
    ['❄️ برد', 'لبس بالطبقات وحاذر من قشعريرة الأطفال والمسنين.'],
    ['🌊 فيضان', 'ابعد عن المياه الجارية وتفاداء السيارة في الوادي.'],
    ['🔥 نار', 'حط جهاز إنذار دخان وعرف مخرج الطوارئ.'],
    ['🧯 غاز CO', 'هوّي الدار وتفاداء تشغيل المولدة داخل البيت.'],
    ['🚗 سلامة الطريق', 'لبس حزام الأمان دايما وتفاداء التليفون وقت السواقة.'],
  ],
  ar: [
    ['🌡️ حرارة', 'اشرب الماء وتجنب الشمس وقت الظهيرة.'],
    ['❄️ برد', 'ارتدِ طبقات واحذر من انخفاض حرارة الأطفال والمسنين.'],
    ['🌊 فيضان', 'تجنب المياه الجارية ولا تقود سيارتك في واد مغمور.'],
    ['🔥 حريق', 'ثبّت جهاز إنذار دخان واعرف مخرج الطوارئ.'],
    ['🧯 أول أكسيد الكربون', 'هوّي المنزل وتجنب تشغيل المولدة داخل المنزل.'],
    ['🚗 سلامة الطريق', 'اربط حزام الأمان دائماً وتجنب الهاتف أثناء القيادة.'],
  ],
  fr: [
    ['🌡️ Chaleur', 'Buvez de l’eau et évitez le soleil à midi.'],
    ['❄️ Froid', 'Habillez-vous en couches, attention à l’hypothermie chez enfants/aînés.'],
    ['🌊 Inondation', 'Évitez les eaux courantes et ne conduisez pas dans un oued inondé.'],
    ['🔥 Incendie', 'Installez un détecteur de fumée et connaissez la sortie de secours.'],
    ['🧯 Monoxyde de carbone', 'Aérez le logement, jamais de générateur en intérieur.'],
    ['🚗 Sécurité routière', 'Bouclez toujours votre ceinture, évitez le téléphone au volant.'],
  ],
  en: [
    ['🌡️ Heat', 'Drink water and avoid midday sun.'],
    ['❄️ Cold', 'Dress in layers; watch for hypothermia in kids and elders.'],
    ['🌊 Flood', 'Avoid moving water and never drive through a flooded wadi.'],
    ['🔥 Fire', 'Install a smoke detector and know your exit route.'],
    ['🧯 Carbon Monoxide', 'Ventilate your home; never run a generator indoors.'],
    ['🚗 Road Safety', 'Always wear a seatbelt and avoid phone use while driving.'],
  ],
};

function dayIndex() {
  const d = new Date();
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
}

export default function AwarenessCards() {
  const { lang } = useI18n();
  const tip = DAY_TIPS[dayIndex() % DAY_TIPS.length];
  const mythLabel = { tn: 'خرافة', ar: 'خرافة', fr: 'Mythe', en: 'Myth' }[lang];
  const factLabel = { tn: 'حقيقة', ar: 'حقيقة', fr: 'Fait', en: 'Fact' }[lang];

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 to-secondary/5 p-6">
        <div className="text-xs font-bold uppercase tracking-wide text-accent">{tip.tag[lang]}</div>
        <h3 className="mb-1.5 mt-2 text-xl font-bold">{tip.title[lang]}</h3>
        <p className="text-muted">{tip.text[lang]}</p>
        <div className="mt-3 grid grid-cols-1 gap-0 overflow-hidden rounded-xl sm:grid-cols-2">
          <div className="bg-accent/10 p-3.5 text-sm">
            <b className="mb-1 block text-[11px] uppercase tracking-wide text-accent">{mythLabel}</b>
            {tip.myth[lang]}
          </div>
          <div className="bg-success/10 p-3.5 text-sm">
            <b className="mb-1 block text-[11px] uppercase tracking-wide text-success">{factLabel}</b>
            {tip.fact[lang]}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS[lang].map(([h, p]) => (
          <div key={h} className="rounded-2xl border border-white/10 bg-card p-4.5">
            <div className="mb-1.5 font-bold">{h}</div>
            <div className="text-sm text-muted">{p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
