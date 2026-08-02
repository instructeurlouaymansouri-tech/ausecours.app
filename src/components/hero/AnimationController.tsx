'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Phase timeline for the cutout-sprite rescue sequence.
 * Three "camera angles" (side view -> rear 3/4 -> rear/front), each with
 * real sprite movement in between. Total runtime: ~15s.
 */
export type HeroPhase = 'arrive' | 'cpr' | 'gather' | 'load' | 'depart' | 'drive' | 'done';

const TIMELINE: { phase: HeroPhase; at: number }[] = [
  { phase: 'arrive', at: 0 },
  { phase: 'cpr', at: 2200 },
  { phase: 'gather', at: 5000 },
  { phase: 'load', at: 7800 },
  { phase: 'depart', at: 10600 },
  { phase: 'drive', at: 12400 },
  { phase: 'done', at: 14800 },
];

interface UseHeroTimelineResult {
  phase: HeroPhase;
  reducedMotion: boolean;
}

export function useHeroTimeline(onComplete: () => void): UseHeroTimelineResult {
  const [phase, setPhase] = useState<HeroPhase>('arrive');
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completed = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReduced = mql.matches;
    setReducedMotion(prefersReduced);

    if (prefersReduced) {
      setPhase('done');
      if (!completed.current) {
        completed.current = true;
        onComplete();
      }
      return;
    }

    TIMELINE.forEach(({ phase: p, at }) => {
      const id = setTimeout(() => {
        setPhase(p);
        if (p === 'done' && !completed.current) {
          completed.current = true;
          onComplete();
        }
      }, at);
      timeouts.current.push(id);
    });

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { phase, reducedMotion };
}
