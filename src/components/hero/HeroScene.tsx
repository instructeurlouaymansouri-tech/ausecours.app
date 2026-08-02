'use client';

import { motion } from 'framer-motion';
import Particles from './Particles';
import type { HeroPhase } from './AnimationController';

interface HeroSceneProps {
  phase: HeroPhase;
  reducedMotion: boolean;
}

interface SpriteState {
  src: string | null; // null = not rendered this phase
  leftPct: number; // position of the sprite's left edge, % of stage width
  heightPx: number;
  opacity: number;
  flip?: boolean;
  bob?: boolean; // subtle CPR compression bob
}

const S = '/hero/sprites';

const CAPTIONS: Record<HeroPhase, string> = {
  arrive: 'Ambulance arrives',
  cpr: 'CPR starts immediately',
  gather: 'Partner brings the stretcher',
  load: 'Loaded into the ambulance',
  depart: 'Lights on, ready to go',
  drive: 'Driving fast to save a life',
  done: 'Driving fast to save a life',
};

// --- Ambulance -------------------------------------------------------
const AMBULANCE: Record<HeroPhase, SpriteState> = {
  arrive: { src: `${S}/ambulance-side-driving.webp`, leftPct: 4, heightPx: 190, opacity: 1 },
  cpr: { src: `${S}/ambulance-side-driving.webp`, leftPct: 4, heightPx: 190, opacity: 1 },
  gather: { src: `${S}/ambulance-side-driving.webp`, leftPct: 4, heightPx: 190, opacity: 1 },
  load: { src: `${S}/ambulance-rear-open.webp`, leftPct: 30, heightPx: 240, opacity: 1 },
  depart: { src: `${S}/ambulance-rear-closed.webp`, leftPct: 40, heightPx: 260, opacity: 1 },
  drive: { src: `${S}/ambulance-front-driving.webp`, leftPct: 92, heightPx: 220, opacity: 1 },
  done: { src: `${S}/ambulance-front-driving.webp`, leftPct: 130, heightPx: 220, opacity: 1 },
};

// --- Lead paramedic ----------------------------------------------------
const LEAD: Record<HeroPhase, SpriteState> = {
  arrive: { src: `${S}/paramedic-walking.webp`, leftPct: 14, heightPx: 150, opacity: 0 },
  cpr: { src: `${S}/paramedic-cpr-alone.webp`, leftPct: 32, heightPx: 118, opacity: 1, bob: true },
  gather: { src: `${S}/paramedic-cpr-alone.webp`, leftPct: 32, heightPx: 118, opacity: 1, bob: true },
  load: { src: `${S}/paramedic-pulling.webp`, leftPct: 26, heightPx: 150, opacity: 1 },
  depart: { src: `${S}/paramedic-pulling.webp`, leftPct: 26, heightPx: 150, opacity: 0 },
  drive: { src: `${S}/paramedic-pulling.webp`, leftPct: 26, heightPx: 150, opacity: 0 },
  done: { src: `${S}/paramedic-pulling.webp`, leftPct: 26, heightPx: 150, opacity: 0 },
};

// --- Partner paramedic ---------------------------------------------------
const PARTNER: Record<HeroPhase, SpriteState> = {
  arrive: { src: `${S}/paramedic-walking.webp`, leftPct: 120, heightPx: 150, opacity: 0, flip: true },
  cpr: { src: `${S}/paramedic-walking.webp`, leftPct: 120, heightPx: 150, opacity: 0, flip: true },
  gather: { src: `${S}/paramedic-walking.webp`, leftPct: 53, heightPx: 150, opacity: 1, flip: true },
  load: { src: `${S}/paramedic-pulling.webp`, leftPct: 38, heightPx: 150, opacity: 1, flip: true },
  depart: { src: `${S}/paramedic-pulling.webp`, leftPct: 38, heightPx: 150, opacity: 0, flip: true },
  drive: { src: `${S}/paramedic-pulling.webp`, leftPct: 38, heightPx: 150, opacity: 0, flip: true },
  done: { src: `${S}/paramedic-pulling.webp`, leftPct: 38, heightPx: 150, opacity: 0, flip: true },
};

// --- Victim -------------------------------------------------------------
const VICTIM: Record<HeroPhase, SpriteState> = {
  arrive: { src: `${S}/victim-lying.webp`, leftPct: 34, heightPx: 42, opacity: 0 },
  cpr: { src: `${S}/victim-lying.webp`, leftPct: 34, heightPx: 42, opacity: 1 },
  gather: { src: `${S}/victim-lying.webp`, leftPct: 34, heightPx: 42, opacity: 1 },
  load: { src: `${S}/victim-lying.webp`, leftPct: 33, heightPx: 42, opacity: 1 },
  depart: { src: `${S}/victim-lying.webp`, leftPct: 33, heightPx: 42, opacity: 0 },
  drive: { src: `${S}/victim-lying.webp`, leftPct: 33, heightPx: 42, opacity: 0 },
  done: { src: `${S}/victim-lying.webp`, leftPct: 33, heightPx: 42, opacity: 0 },
};

// --- Stretcher ------------------------------------------------------------
const STRETCHER: Record<HeroPhase, SpriteState> = {
  arrive: { src: `${S}/stretcher-unfolded.webp`, leftPct: 70, heightPx: 60, opacity: 0 },
  cpr: { src: `${S}/stretcher-unfolded.webp`, leftPct: 70, heightPx: 60, opacity: 0 },
  gather: { src: `${S}/stretcher-unfolded.webp`, leftPct: 47, heightPx: 60, opacity: 1 },
  load: { src: `${S}/stretcher-unfolded.webp`, leftPct: 32, heightPx: 60, opacity: 1 },
  depart: { src: `${S}/stretcher-unfolded.webp`, leftPct: 32, heightPx: 60, opacity: 0 },
  drive: { src: `${S}/stretcher-unfolded.webp`, leftPct: 32, heightPx: 60, opacity: 0 },
  done: { src: `${S}/stretcher-unfolded.webp`, leftPct: 32, heightPx: 60, opacity: 0 },
};

function Sprite({
  state,
  reducedMotion,
  z,
}: {
  state: SpriteState;
  reducedMotion: boolean;
  z: number;
}) {
  if (!state.src) return null;
  return (
    <motion.img
      src={state.src}
      alt=""
      aria-hidden="true"
      className="absolute bottom-[13%] select-none"
      style={{ height: state.heightPx, width: 'auto', zIndex: z }}
      animate={{
        left: `${state.leftPct}%`,
        opacity: state.opacity,
        scaleX: state.flip ? -1 : 1,
        y: !reducedMotion && state.bob ? [0, 4, 0] : 0,
      }}
      transition={
        state.bob
          ? { left: { duration: 0.9, ease: 'easeInOut' }, opacity: { duration: 0.5 }, y: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' } }
          : { duration: reducedMotion ? 0 : 1.1, ease: 'easeInOut' }
      }
    />
  );
}

export default function HeroScene({ phase, reducedMotion }: HeroSceneProps) {
  const driving = phase === 'drive' || phase === 'done';

  return (
    <div className="relative h-[75vh] min-h-[420px] w-full overflow-hidden bg-bg">
      {/* minimal ground — no photographic background, just the brand's own dark gradient + road */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17] via-[#0E1526] to-[#141C31]" />
      <div className="absolute inset-x-0 bottom-0 h-[13%] bg-[#0A0D14]">
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      </div>
      {/* soft contact shadow under the whole stage group */}
      <div className="absolute inset-x-[10%] bottom-[12%] h-6 rounded-full bg-black/40 blur-md" />

      <Particles phase={phase} reducedMotion={reducedMotion} />

      {/* speed streak lines while driving off */}
      {driving && !reducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 right-[20%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          {[30, 45, 60, 72].map((top) => (
            <div key={top} className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ top: `${top}%` }} />
          ))}
        </motion.div>
      )}

      <Sprite state={AMBULANCE[phase]} reducedMotion={reducedMotion} z={9} />
      <Sprite state={STRETCHER[phase]} reducedMotion={reducedMotion} z={10} />
      <Sprite state={VICTIM[phase]} reducedMotion={reducedMotion} z={11} />
      <Sprite state={PARTNER[phase]} reducedMotion={reducedMotion} z={12} />
      <Sprite state={LEAD[phase]} reducedMotion={reducedMotion} z={13} />

      {/* caption */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center px-6">
        <motion.p
          key={CAPTIONS[phase]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.4 }}
          className="relative z-20 rounded-full bg-black/40 px-5 py-2 text-sm font-medium tracking-wide text-white backdrop-blur-sm"
        >
          {CAPTIONS[phase]}
        </motion.p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
