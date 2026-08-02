'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Lang } from '@/lib/i18n';

const STT_LANG: Record<Lang, string> = { tn: 'ar-TN', ar: 'ar-SA', fr: 'fr-FR', en: 'en-US' };
const TTS_LANG: Record<Lang, string> = { tn: 'ar', ar: 'ar', fr: 'fr-FR', en: 'en-US' };

/**
 * Wraps the browser's Web Speech APIs.
 * - Speech-to-Text via SpeechRecognition (Chrome/Edge/Safari have varying support).
 * - Text-to-Speech via speechSynthesis.
 *
 * Voice providers are intentionally abstracted behind this hook so they can be
 * swapped later (e.g. a cloud STT/TTS provider) without touching UI components.
 */
export function useVoice(lang: Lang, onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR =
      (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      null;
    if (!SR) {
      setSupported(false);
      return;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => onResult(e.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onResult]);

  const toggleListen = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.lang = STT_LANG[lang];
      recognition.start();
      setListening(true);
    }
  }, [lang, listening]);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = TTS_LANG[lang];
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    [lang]
  );

  return { listening, supported, toggleListen, speak };
}
