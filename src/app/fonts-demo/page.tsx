"use client";

import { useState } from "react";
import {
  Instrument_Serif,
  Fraunces,
  DM_Serif_Display,
  DM_Sans,
  Outfit,
} from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const fonts = [
  {
    name: "Instrument Serif",
    className: instrumentSerif.className,
    category: "Serif · Editorial",
    vibe: "Warm confidence, vintage radio dial, editorial. The trending serif of 2026.",
    bodyFont: dmSans.className,
    bodyName: "DM Sans",
  },
  {
    name: "Fraunces",
    className: fraunces.className,
    category: "Variable Serif · Wonky",
    vibe: "Built-in hand-drawn irregularity via its \"WONK\" axis. Bridges polished type and sketch art.",
    bodyFont: outfit.className,
    bodyName: "Outfit",
  },
  {
    name: "DM Serif Display",
    className: dmSerifDisplay.className,
    category: "Serif · Transitional",
    vibe: "Delicate serifs, rounded terminals. Like a hand-lettered record store sign.",
    bodyFont: dmSans.className,
    bodyName: "DM Sans",
  },
  {
    name: "Outfit",
    className: outfit.className,
    category: "Sans-Serif · Geometric",
    vibe: "Subtly rounded, friendly, wide proportions. Clean but never cold.",
    bodyFont: outfit.className,
    bodyName: "Outfit",
  },
  {
    name: "DM Sans",
    className: dmSans.className,
    category: "Sans-Serif · Geometric",
    vibe: "Low contrast, open counters. Designed alongside DM Serif Display — natural harmony.",
    bodyFont: dmSans.className,
    bodyName: "DM Sans",
  },
];

export default function FontsDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="border-b border-cream-darker/60 px-8 py-6">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-stone-lighter">
          airwaves.fm · Font Exploration
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Font selector pills */}
        <div className="flex flex-wrap gap-2 mb-16">
          {fonts.map((font, i) => (
            <button
              key={font.name}
              onClick={() => setActiveIndex(i)}
              className={`
                px-4 py-2 rounded-full text-sm transition-all duration-200
                ${
                  i === activeIndex
                    ? "bg-stone text-cream"
                    : "bg-cream-dark text-stone-light hover:bg-cream-darker"
                }
              `}
            >
              {font.name}
            </button>
          ))}
        </div>

        {/* All fonts displayed */}
        <div className="space-y-24">
          {fonts.map((font, i) => (
            <section
              key={font.name}
              className={`transition-opacity duration-300 ${
                activeIndex === i ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
              onClick={() => setActiveIndex(i)}
            >
              {/* Font label */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-xs font-mono uppercase tracking-[0.15em] text-stone-lighter">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-stone-lighter">
                  {font.category}
                </span>
              </div>

              {/* Hero heading sample */}
              <h2
                className={`text-6xl leading-tight tracking-tight text-stone mb-3 ${font.className}`}
              >
                airwaves.fm
              </h2>

              {/* Subheading */}
              <p
                className={`text-2xl text-stone-light mb-8 ${font.className}`}
              >
                Infinite AI-generated music stations
              </p>

              {/* Body text sample */}
              <div className="grid grid-cols-2 gap-12 mb-8">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-lighter mb-3">
                    Heading in {font.name}
                  </p>
                  <h3
                    className={`text-xl mb-2 text-stone ${font.className}`}
                  >
                    Midnight Jazz
                  </h3>
                  <p
                    className={`text-sm leading-relaxed text-stone-light ${font.bodyFont}`}
                  >
                    Late-night jazz club atmosphere. Smoky saxophone melodies
                    weave through warm piano chords and brushed snare drums.
                    Every track is uniquely generated — you will never hear the
                    same song twice.
                  </p>
                  <p className="text-[10px] font-mono text-stone-lighter mt-2">
                    Body: {font.bodyName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-lighter mb-3">
                    UI Elements
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cream-darker flex items-center justify-center">
                        <svg viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                          <path
                            d="M30 8c0 0-1 2-2 3s-3 2-4 4-1 5-1 7c0 3 1 5 0 7s-3 4-5 6-3 4-3 5"
                            stroke="#7B6B8D"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="25" cy="18" r="1.2" stroke="#7B6B8D" strokeWidth="1.2" />
                          <circle cx="23.5" cy="22" r="1.2" stroke="#7B6B8D" strokeWidth="1.2" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-sm text-stone ${font.className}`}>
                          Midnight Jazz
                        </p>
                        <p className={`text-[11px] text-stone-lighter ${font.bodyFont}`}>
                          Now Playing · Track 1 of ∞
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cream-darker flex items-center justify-center">
                        <svg viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                          <path d="M26 6L16 22h8l-4 20L36 22h-8L32 6z" stroke="#C4704A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-sm text-stone ${font.className}`}>
                          Electronic Pulse
                        </p>
                        <p className={`text-[11px] text-stone-lighter ${font.bodyFont}`}>
                          Deep house & progressive beats
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Type scale */}
              <div className="border-t border-cream-darker/40 pt-6">
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-lighter mb-4">
                  Type Scale
                </p>
                <div className="space-y-2">
                  {[
                    { size: "text-4xl", label: "36px" },
                    { size: "text-2xl", label: "24px" },
                    { size: "text-xl", label: "20px" },
                    { size: "text-base", label: "16px" },
                    { size: "text-sm", label: "14px" },
                    { size: "text-xs", label: "12px" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-baseline gap-4">
                      <span className="text-[10px] font-mono text-stone-lighter w-8 text-right flex-shrink-0">
                        {s.label}
                      </span>
                      <span
                        className={`${s.size} text-stone ${font.className}`}
                      >
                        Always playing, always fresh
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vibe note */}
              <p className="text-xs text-stone-lighter mt-6 italic">
                {font.vibe}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
