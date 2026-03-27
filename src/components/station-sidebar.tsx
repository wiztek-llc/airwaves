"use client";

import { motion } from "framer-motion";
import type { Station } from "@/lib/stations";

interface StationSidebarProps {
  stations: Station[];
  activeStation: Station;
  onSelectStation: (station: Station) => void;
}

export function StationSidebar({
  stations,
  activeStation,
  onSelectStation,
}: StationSidebarProps) {
  return (
    <aside className="w-72 border-r border-cream-darker/60 flex flex-col bg-cream-dark/30">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-cream-darker/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cream"
            >
              <path d="M2 12a10 10 0 1 0 20 0" />
              <path d="M2 12a14 14 0 0 1 20 0" />
              <path d="M2 12a18 18 0 0 0 20 0" />
              <line x1="12" y1="2" x2="12" y2="22" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-stone">
              airwaves
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-lighter">
              fm
            </p>
          </div>
        </div>
      </div>

      {/* Station list */}
      <div className="flex-1 overflow-y-auto py-3">
        <p className="px-6 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-stone-lighter">
          Stations
        </p>
        <nav className="px-3 space-y-0.5">
          {stations.map((station) => {
            const isActive = station.id === activeStation.id;
            return (
              <button
                key={station.id}
                onClick={() => onSelectStation(station)}
                className={`
                  w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200
                  group relative flex items-center gap-3
                  ${
                    isActive
                      ? "bg-cream-darker/80"
                      : "hover:bg-cream-darker/40"
                  }
                `}
              >
                {/* Station artwork thumbnail */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-9 h-9 rounded-lg overflow-hidden transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-60 group-hover:opacity-80"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={station.artwork}
                      alt={station.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-dot"
                      className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full border-2 border-cream-dark"
                      style={{ backgroundColor: station.color }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm truncate ${
                      isActive
                        ? "font-medium text-stone"
                        : "text-stone-light group-hover:text-stone"
                    }`}
                  >
                    {station.name}
                  </p>
                  <p className="text-[11px] text-stone-lighter truncate">
                    {station.genre}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-cream-darker/60">
        <p className="text-[10px] font-mono text-stone-lighter">
          Powered by Lyria 3 Pro
        </p>
      </div>
    </aside>
  );
}
