"use client";

import { motion } from "framer-motion";
import type { Station } from "@/lib/stations";

interface PlayerBarProps {
  station: Station;
  isPlaying: boolean;
  isLoading?: boolean;
  volume: number;
  progress: number;
  duration: number;
  title?: string;
  artist?: string;
  coverUrl?: string;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onSkip: () => void;
  onMenuToggle?: () => void;
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar({
  station,
  isPlaying,
  isLoading,
  volume,
  progress,
  duration,
  title,
  artist,
  coverUrl,
  onTogglePlay,
  onVolumeChange,
  onSkip,
  onMenuToggle,
}: PlayerBarProps) {
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="border-t border-cream-darker/60 bg-cream-dark/20 backdrop-blur-sm">
      {/* Progress bar */}
      <div className="h-0.5 bg-cream-darker/40 relative">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: station.color,
          }}
          transition={{ duration: 0.3, ease: "linear" }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Left: Menu button (mobile) + Track info */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuToggle}
            className="p-1.5 text-stone-lighter hover:text-stone transition-colors md:hidden flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {coverUrl ? (
            <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={station.artwork} alt={station.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone truncate">
              {title || station.name}
            </p>
            <p className="text-xs text-stone-lighter truncate">
              {artist
                ? `${artist} · ${formatTime(progress)} / ${formatTime(duration)}`
                : duration > 0
                  ? `${formatTime(progress)} / ${formatTime(duration)}`
                  : station.genre}
            </p>
          </div>
        </div>

        {/* Center: Play controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Play/Pause */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onTogglePlay}
            disabled={isLoading}
            className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${
              isLoading
                ? "bg-stone-lighter text-cream cursor-wait"
                : "bg-stone text-cream hover:bg-stone/90"
            }`}
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            ) : isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </motion.button>

          {/* Skip forward */}
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="p-2 text-stone-lighter hover:text-stone transition-colors disabled:opacity-40"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        {/* Right: Volume — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
          <button className="p-2 text-stone-lighter hover:text-stone transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
              {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
            </svg>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24 h-1 bg-cream-darker rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-stone
              [&::-webkit-slider-thumb]:cursor-pointer
            "
          />
        </div>
      </div>
    </div>
  );
}
