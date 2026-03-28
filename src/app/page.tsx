"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { StationSidebar } from "@/components/station-sidebar";
import { NowPlaying } from "@/components/now-playing";
import { PlayerBar } from "@/components/player-bar";
import { stations } from "@/lib/stations";
import { useRadio } from "@/lib/use-radio";
import { useAudioAnalyzer } from "@/lib/use-audio-analyzer";

export default function Home() {
  const [activeStation, setActiveStation] = useState(stations[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const radio = useRadio(activeStation);
  const { connectAudio, getFrequencyData } = useAudioAnalyzer();

  const isPlaying = radio.status === "playing";
  const isLoading = radio.status === "loading";

  // Auto-play on page load
  useEffect(() => {
    radio.play();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Connect audio analyzer when audio element is available and playing
  useEffect(() => {
    if (radio.audioElement && isPlaying) {
      connectAudio(radio.audioElement);
    }
  }, [radio.audioElement, isPlaying, connectAudio]);

  const track = radio.currentTrack;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Station sidebar */}
      <StationSidebar
        stations={stations}
        activeStation={activeStation}
        isOpen={sidebarOpen}
        onSelectStation={(station) => {
          setActiveStation(station);
        }}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <AnimatePresence mode="wait">
          <NowPlaying
            key={activeStation.id}
            station={activeStation}
            isPlaying={isPlaying}
            isLoading={isLoading}
            trackNumber={radio.trackNumber}
            error={radio.error}
            title={track?.title}
            artist={track?.artist}
            coverUrl={track?.coverUrl}
            getFrequencyData={getFrequencyData}
          />
        </AnimatePresence>

        {/* Player bar */}
        <PlayerBar
          station={activeStation}
          isPlaying={isPlaying}
          isLoading={isLoading}
          volume={radio.volume}
          progress={radio.progress}
          duration={radio.duration}
          title={track?.title}
          artist={track?.artist}
          coverUrl={track?.coverUrl}
          onTogglePlay={() => (isPlaying ? radio.pause() : radio.play())}
          onVolumeChange={radio.setVolume}
          onSkip={radio.skip}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </main>
    </div>
  );
}
