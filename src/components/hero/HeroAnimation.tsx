'use client';

import HeroScene from './HeroScene';
import { useHeroTimeline } from './AnimationController';

interface HeroAnimationProps {
  /** Called once, either after the 15s sequence finishes or immediately if reduced motion is preferred. */
  onComplete: () => void;
}

/**
 * Cinematic emergency-rescue hero animation.
 * Crossfades through 8 real illustrated frames from the AUSECOURS character
 * sheet (Ken Burns pan/zoom + ambient particles on top), so the visuals are
 * the actual artwork rather than code-drawn shapes. Plays once per mount
 * (so a full page refresh replays it), and respects prefers-reduced-motion.
 */
export default function HeroAnimation({ onComplete }: HeroAnimationProps) {
  const { phase, reducedMotion } = useHeroTimeline(onComplete);
  return (
    <div aria-hidden="true">
      <HeroScene phase={phase} reducedMotion={reducedMotion} />
    </div>
  );
}
