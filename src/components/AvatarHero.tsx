'use client';

import Image from 'next/image';

interface AvatarHeroProps {
  listening: boolean;
  onMicClick: () => void;
}

/** Breathing avatar ring + press-to-talk mic FAB used in the hero section. */
export default function AvatarHero({ listening, onMicClick }: AvatarHeroProps) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative flex h-[280px] w-[280px] animate-breathe items-center justify-center rounded-full bg-[radial-gradient(circle_at_40%_30%,rgba(255,45,45,0.18),transparent_65%)]">
        <div className="pulse-ring absolute inset-0 rounded-full border-2 border-accent" />
        <div className="relative h-[220px] w-[220px] overflow-hidden rounded-full border-[3px] border-accent shadow-[0_0_0_8px_rgba(255,45,45,0.08),0_20px_50px_rgba(0,0,0,0.6)]">
          <Image
            src="/avatar-portrait.jpg"
            alt="AUSECOURS assistant"
            fill
            sizes="220px"
            className="object-cover"
            priority
          />
        </div>
        <button
          onClick={onMicClick}
          aria-label="Press to talk"
          className={`absolute -bottom-1.5 start-[calc(50%-130px)] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary shadow-[0_10px_30px_rgba(255,45,45,0.4)] ${
            listening ? 'animate-pulse' : ''
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
            <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
