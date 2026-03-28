"use client";

import { motion } from "framer-motion";
import type { Station } from "@/lib/stations";
import { Visualizer } from "./visualizer";

interface NowPlayingProps {
  station: Station;
  isPlaying: boolean;
  isLoading?: boolean;
  trackNumber?: number;
  error?: string | null;
  title?: string;
  artist?: string;
  coverUrl?: string;
  getFrequencyData: () => Uint8Array;
}

export function NowPlaying({
  station,
  isPlaying,
  isLoading,
  trackNumber = 0,
  error,
  title,
  artist,
  coverUrl,
  getFrequencyData,
}: NowPlayingProps) {
  const hasCover = coverUrl && trackNumber > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-1 flex flex-col items-center justify-center px-4 md:px-8"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${station.color}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 md:gap-8 max-w-lg w-full">
        {/* Cover art or station icon */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {hasCover ? (
            <div
              className="w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-lg"
              style={{
                boxShadow: `0 8px 40px ${station.color}20, 0 2px 8px rgba(0,0,0,0.08)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt={title || "Cover art"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className={`w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden transition-opacity duration-300 ${
                isPlaying || isLoading ? "opacity-100" : "opacity-60"
              }`}
              style={{
                boxShadow: `0 8px 40px ${station.color}15, 0 2px 8px rgba(0,0,0,0.06)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={station.artwork}
                alt={station.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </motion.div>

        {/* Track info or station info */}
        <div className="text-center space-y-1.5">
          {title && trackNumber > 0 ? (
            <>
              <h2 className="text-xl font-semibold tracking-tight text-stone">
                {title}
              </h2>
              <p className="text-sm text-stone-light">{artist}</p>
              <p className="text-xs text-stone-lighter">{station.name}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold tracking-tight text-stone">
                {station.name}
              </h2>
              <p className="text-sm text-stone-lighter">
                {station.description}
              </p>
            </>
          )}
        </div>

        {/* Visualizer */}
        <Visualizer
          isPlaying={isPlaying}
          color={station.color}
          getFrequencyData={getFrequencyData}
        />

        {/* Status */}
        <div className="text-center space-y-1">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: station.color }}
                />
                <p className="text-xs font-mono uppercase tracking-[0.15em] text-stone-lighter">
                  Generating
                </p>
              </div>
              {error && (
                <p className="text-xs text-stone-lighter max-w-xs">{error}</p>
              )}
            </motion.div>
          )}
          {isPlaying && !isLoading && null}
          {!isPlaying && !isLoading && (
            <p className="text-xs font-mono uppercase tracking-[0.15em] text-stone-lighter">
              {trackNumber > 0 ? "Paused" : "Press play to start"}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
