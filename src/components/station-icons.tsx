"use client";

interface IconProps {
  className?: string;
  color?: string;
}

export function LoFiIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Sketch cloud with headphones */}
      <path
        d="M14 26c-1.5 0-5-0.5-6-4s0-7 3-9c2-1.5 3-4 7-5s7 0 9 1c3-2 7-1.5 9 1s3 5 1.5 8c1 1.5 1 3.5-0.5 5s-4 2-6 1.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "url(#sketch)" }}
      />
      {/* Headphone band */}
      <path
        d="M17 30c0-4 2-7 7-7s7 3 7 7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Ear cups */}
      <rect x="14" y="29" width="4" height="6" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="30" y="29" width="4" height="6" rx="1.5" stroke={color} strokeWidth="1.8" />
      <defs>
        <filter id="sketch">
          <feTurbulence baseFrequency="0.03" numOctaves="4" seed="1" />
          <feDisplacementMap in="SourceGraphic" scale="1" />
        </filter>
      </defs>
    </svg>
  );
}

export function AmbientIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Sketchy leaf/plant */}
      <path
        d="M24 38V22"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M24 22c-2-6-8-10-14-10 0 8 5 14 14 16"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 28c2-5 8-8 13-7-1 7-5 11-13 13"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Leaf veins */}
      <path
        d="M18 16c2 2 4 4 6 6M31 23c-2 1.5-4 3-7 5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function IndieIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Sketchy sun with rays */}
      <circle cx="24" cy="22" r="7" stroke={color} strokeWidth="1.8" />
      {/* Rays - hand drawn wobbly lines */}
      <path d="M24 11V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 36V33" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 22H10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M38 22H35" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.2 14.5L14 12.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M34 31.5L31.8 29.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M31.8 14.5L34 12.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 31.5L16.2 29.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Horizon line */}
      <path d="M10 38c4-3 8-5 14-5s10 2 14 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function JazzIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Sketchy saxophone */}
      <path
        d="M30 8c0 0-1 2-2 3s-3 2-4 4-1 5-1 7c0 3 1 5 0 7s-3 4-5 6-3 4-3 5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bell */}
      <path
        d="M15 40c-3 0-5-1-5-3s3-4 5-4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Keys */}
      <circle cx="25" cy="18" r="1.2" stroke={color} strokeWidth="1.2" />
      <circle cx="23.5" cy="22" r="1.2" stroke={color} strokeWidth="1.2" />
      <circle cx="22" cy="26" r="1.2" stroke={color} strokeWidth="1.2" />
      {/* Mouthpiece */}
      <path d="M30 8L33 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Music notes floating */}
      <path d="M34 14c0.5-1.5 2-2 3-1.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="34" cy="14" r="1.5" stroke={color} strokeWidth="1" />
    </svg>
  );
}

export function ElectronicIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Sketchy lightning bolt */}
      <path
        d="M26 6L16 22h8l-4 20L36 22h-8L32 6z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Small sparks */}
      <path d="M10 18l3-1M8 24l3 0.5M11 30l2-1" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M38 16l-3 0M40 22l-3 0.5M37 28l-2 0" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function ClassicalIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Grand piano side view - sketchy */}
      <path
        d="M10 32c0-2 1-3 3-3h22c2 0 3 1 3 3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Piano top/lid */}
      <path
        d="M13 29c0-8 2-14 5-17 2-2 5-3 8-3s6 1 8 3c3 3 5 9 5 17"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Keys suggestion */}
      <path d="M18 32v-3M22 32v-3M26 32v-3M30 32v-3" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      {/* Legs */}
      <path d="M14 32v6M34 32v6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Pedals */}
      <path d="M22 38h4" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function SynthwaveIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Crescent moon - sketchy */}
      <path
        d="M30 10c-8 2-13 9-13 17s5 13 12 15c-10 1-19-7-19-17S19 7 30 10z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stars */}
      <path d="M33 12l0.5 1.5L35 14l-1.5 0.5L33 16l-0.5-1.5L31 14l1.5-0.5z" stroke={color} strokeWidth="1" strokeLinejoin="round" />
      <circle cx="38" cy="20" r="0.8" fill={color} opacity="0.5" />
      <circle cx="36" cy="28" r="0.8" fill={color} opacity="0.5" />
      <circle cx="40" cy="25" r="0.5" fill={color} opacity="0.3" />
    </svg>
  );
}

export function WorldIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Sketchy globe */}
      <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1.8" />
      {/* Latitude lines */}
      <ellipse cx="24" cy="24" rx="14" ry="5" stroke={color} strokeWidth="1" opacity="0.4" />
      <ellipse cx="24" cy="24" rx="14" ry="10" stroke={color} strokeWidth="1" opacity="0.3" />
      {/* Longitude line */}
      <ellipse cx="24" cy="24" rx="5" ry="14" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Meridian */}
      <path d="M24 10v28" stroke={color} strokeWidth="1" opacity="0.3" />
      {/* Continent suggestion */}
      <path d="M19 16c2 1 4 0 5 2s0 4-2 5-3 0-4-2 0-4 1-5z" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function TranceIcon({ className, color = "currentColor" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Sound wave / pulse - sketchy */}
      <path
        d="M6 24h4l3-8 4 16 4-12 4 10 3-6 4 8 3-10 3 6h4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Radiating arcs above */}
      <path d="M18 14c2-2 5-3 8-3s5 1 7 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M15 10c3-3 6-4 11-4s8 1 11 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />
      {/* Radiating arcs below */}
      <path d="M18 34c2 2 5 3 8 3s5-1 7-3" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M15 38c3 3 6 4 11 4s8-1 11-4" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

export const stationIconMap: Record<string, React.FC<IconProps>> = {
  "lofi-chill": LoFiIcon,
  "ambient-drift": AmbientIcon,
  "indie-golden": IndieIcon,
  "jazz-midnight": JazzIcon,
  "electronic-pulse": ElectronicIcon,
  "classical-morning": ClassicalIcon,
  "synth-retro": SynthwaveIcon,
  "world-voyage": WorldIcon,
  "trance-pulse": TranceIcon,
};
