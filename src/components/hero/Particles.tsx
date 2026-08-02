'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { HeroPhase } from './AnimationController';

interface ParticlesProps {
  phase: HeroPhase;
  reducedMotion: boolean;
}

/** Soft ambient light motes (always drifting) + a burst of ground dust during drive-in/exit. */
export default function Particles({ phase, reducedMotion }: ParticlesProps) {
  const ambient = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 10 + Math.random() * 60,
        size: 2 + Math.random() * 3,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 4,
      })),
    []
  );

  const dustActive = phase === 'arrive' || phase === 'drive';
  const dustSide = phase === 'drive' ? '80%' : '10%';

  const dust = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        offset: (Math.random() - 0.5) * 60,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.6,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase]
  );

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {ambient.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -14, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {dustActive &&
        dust.map((d) => (
          <motion.span
            key={`${phase}-${d.id}`}
            className="absolute rounded-full bg-white/40 blur-[1px]"
            style={{ left: dustSide, bottom: '18%', width: d.size, height: d.size }}
            initial={{ x: 0, y: 0, opacity: 0.6, scale: 0.6 }}
            animate={{
              x: phase === 'drive' ? d.offset + 90 : d.offset - 90,
              y: -20 - Math.random() * 20,
              opacity: 0,
              scale: 1.4,
            }}
            transition={{ duration: 0.9, delay: d.delay, ease: 'easeOut' }}
          />
        ))}
    </div>
  );
}
