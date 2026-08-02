'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useVoice } from './useVoice';

interface ChatMsg {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

const SUGGESTIONS: Record<string, string[]> = {
  tn: ['كيفاش نعمل CPR؟', 'واحد يتخنق', 'ولدي عندو سخانة', 'شنية نعمل بعد الحرق؟'],
  ar: ['كيف أقوم بالإنعاش القلبي؟', 'شخص يختنق', 'طفلي يعاني من حمى', 'ماذا أفعل بعد الحرق؟'],
  fr: ['Comment faire la RCP ?', 'Quelqu’un s’étouffe', 'Mon enfant a de la fièvre', 'Que faire après une brûlure ?'],
  en: ['How do I perform CPR?', 'Someone is choking', 'My child has a fever', 'What should I do after a burn?'],
};

const SHORTCUTS: Record<string, string[]> = {
  tn: ['وجع صدر', 'اختناق', 'حرق', 'نزيف', 'CPR', 'تسمم', 'كسر', 'تشنج'],
  ar: ['ألم صدر', 'اختناق', 'حرق', 'نزيف', 'CPR', 'تسمم', 'كسر', 'تشنج'],
  fr: ['Douleur thoracique', 'Étouffement', 'Brûlure', 'Saignement', 'RCP', 'Intoxication', 'Fracture', 'Convulsion'],
  en: ['Chest Pain', 'Choking', 'Burn', 'Bleeding', 'CPR', 'Poison', 'Fracture', 'Seizure'],
};

/** Scripted, offline-friendly fallback so the chat works even with no server-side Gemini key configured. */
function scriptedFallback(userText: string, lang: string) {
  const q = userText.toLowerCase();
  const pick = (tn: string, ar: string, fr: string, en: string) =>
    lang === 'tn' ? tn : lang === 'ar' ? ar : lang === 'fr' ? fr : en;

  if (/chok|اختناق|يتخنق|étouff/.test(q)) {
    return pick(
      'عيّط للإسعاف 190 توا. هل ينجم يتنفّس ولا يسعل؟ إذا لا: وقف وراه وعطيه 5 ضربات بين الكتفين، وبعد جرب مناورة هايمليك.',
      'اتصل بالإسعاف 190 فوراً. هل يمكنه التنفس أو السعال؟ إن لم يكن: قف خلفه، أعطه 5 ضربات بين الكتفين، ثم جرّب مناورة هايمليك.',
      'Appelez le 190 immédiatement. Peut-il tousser ou respirer ? Sinon : tenez-vous derrière lui, donnez 5 claques dans le dos, puis la manœuvre de Heimlich.',
      'Call 190 right now. Can they cough or breathe? If not: stand behind them, give 5 firm back blows, then try abdominal thrusts (Heimlich).'
    );
  }
  if (/cpr|قلب|إنعاش|réanim/.test(q)) {
    return pick(
      'عيّط 190 توا. رقّد الشخص على ظهرو، ضغط في وسط الصدر بسرعة وقوة (100-120 ضغطة/دقيقة) على عمق 5-6 سم لين توصل المساعدة.',
      'اتصل بـ190 فوراً. ضع الشخص على ظهره واضغط في وسط الصدر بقوة وسرعة (100-120 ضغطة/دقيقة) بعمق 5-6 سم حتى تصل المساعدة.',
      'Appelez le 190. Allongez la personne sur le dos et comprimez le centre de la poitrine fort et vite (100-120/min), 5-6 cm de profondeur.',
      'Call 190. Lay them flat on their back and push hard and fast on the center of the chest — 100-120 compressions/min, about 5-6cm deep.'
    );
  }
  return pick(
    'هاني معاك. إذا الحالة خطيرة، عيّط توا لـ190 (إسعاف) أو 197 (بوليس) أو 198 (حماية مدنية). قولّي أكثر تفاصيل.',
    'أنا معك. إذا كانت الحالة خطيرة، اتصل بـ190 (إسعاف) أو 197 (شرطة) أو 198 (حماية مدنية). أعطني تفاصيل أكثر.',
    'Je suis avec vous. Si la situation est dangereuse, appelez le 190, 197 ou 198. Donnez-moi plus de détails.',
    'I’m here with you. If this is dangerous, call 190, 197, or 198 right now. Tell me more so I can help.'
  );
}

export default function ChatWindow() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleVoiceResult = useCallback((text: string) => send(text), [lang, messages]); // eslint-disable-line react-hooks/exhaustive-deps
  const { listening, supported, toggleListen, speak } = useVoice(lang, handleVoiceResult);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', text: t('hero_greeting'), time: nowLabel() }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  function nowLabel() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async function send(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMsg = { role: 'user', text, time: nowLabel() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setTyping(true);

    let reply: string;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map((m) => ({ role: m.role, text: m.text })) }),
      });
      const data = await res.json();
      reply = data.reply || data.error || scriptedFallback(text, lang);
      if (data.error) reply = `${scriptedFallback(text, lang)}\n\n(⚠️ ${data.error})`;
    } catch {
      reply = scriptedFallback(text, lang);
    }

    setTyping(false);
    setMessages((prev) => [...prev, { role: 'assistant', text: reply, time: nowLabel() }]);
    speak(reply);
  }

  return (
    <div className="grid gap-4 md:grid-cols-[230px_1fr]" style={{ minHeight: 520 }}>
      {/* Sidebar: shortcuts */}
      <aside className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-card p-4">
        <h3 className="mb-1 mt-1 text-xs font-semibold uppercase tracking-wider text-muted">
          {lang === 'fr' ? 'Raccourcis d’urgence' : lang === 'en' ? 'Emergency shortcuts' : 'اختصارات طوارئ'}
        </h3>
        {SHORTCUTS[lang].map((label) => (
          <button
            key={label}
            onClick={() => send(label)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-card2 px-3 py-2.5 text-left text-sm font-semibold hover:border-accent"
          >
            <span className="text-accent">●</span> {label}
          </button>
        ))}
        {!supported && (
          <p className="mt-auto text-[11px] text-muted">
            {lang === 'fr'
              ? 'Reconnaissance vocale non prise en charge par ce navigateur.'
              : lang === 'en'
              ? 'Voice input not supported in this browser.'
              : 'المتصفح ما يدعمش التعرف الصوتي.'}
          </p>
        )}
      </aside>

      {/* Main chat */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-accent">
            <Image src="/avatar-portrait.jpg" alt="" fill className="object-cover" />
          </div>
          <div>
            <div className="text-sm font-bold">AUSECOURS</div>
            <div className="text-[11px] text-success">
              {lang === 'fr' ? 'En ligne' : lang === 'en' ? 'Online' : 'أونلاين'} · Derja / AR / FR / EN
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-3.5 py-3 text-[14.5px] leading-relaxed ${
                m.role === 'assistant'
                  ? 'self-start rounded-bl-sm border border-white/10 bg-card2'
                  : 'ms-auto rounded-br-sm bg-gradient-to-br from-accent to-secondary'
              }`}
            >
              {m.text}
              <div className="mt-1.5 flex gap-2 text-[10px] text-white/55">
                {m.role === 'assistant' && (
                  <span className="cursor-pointer" onClick={() => navigator.clipboard?.writeText(m.text)}>
                    ⧉
                  </span>
                )}
                <span>{m.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex w-fit gap-1 self-start rounded-2xl border border-white/10 bg-card2 px-3.5 py-3">
              <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
              <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
              <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
            </div>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-3.5 py-2.5">
          {SUGGESTIONS[lang].map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="flex-none whitespace-nowrap rounded-full border border-white/10 bg-card2 px-3.5 py-2 text-xs text-muted hover:border-accent hover:text-white"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 border-t border-white/10 px-3.5 py-3">
          <button
            onClick={toggleListen}
            className={`flex h-10.5 w-10.5 flex-none items-center justify-center rounded-full border border-white/10 bg-card2 ${
              listening ? 'animate-pulse bg-accent' : ''
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-white">
              <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z" />
            </svg>
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            className="flex-1 rounded-full border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm outline-none focus:border-accent"
            placeholder="..."
          />
          <button
            onClick={() => send(input)}
            className="flex h-10.5 w-10.5 flex-none items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="px-4 pb-3 text-center text-[11px] text-muted">{t('chat_disclaimer')}</p>
      </div>
    </div>
  );
}
