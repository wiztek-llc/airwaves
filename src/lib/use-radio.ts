"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Station } from "./stations";

interface TrackMeta {
  id: string;
  stationId: string;
  mimeType: string;
  generatedAt: number;
  sizeBytes: number;
  title?: string;
  artist?: string;
  coverUrl?: string;
}

type RadioStatus = "idle" | "loading" | "playing" | "paused" | "error";

interface UseRadioReturn {
  status: RadioStatus;
  currentTrack: TrackMeta | null;
  trackNumber: number;
  error: string | null;
  play: () => void;
  pause: () => void;
  skip: () => void;
  volume: number;
  setVolume: (v: number) => void;
  progress: number;
  duration: number;
  audioElement: HTMLAudioElement | null;
}

export function useRadio(station: Station): UseRadioReturn {
  const [status, setStatus] = useState<RadioStatus>("idle");
  const [currentTrack, setCurrentTrack] = useState<TrackMeta | null>(null);
  const [trackNumber, setTrackNumber] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stationRef = useRef(station.id);
  const abortRef = useRef<AbortController | null>(null);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
    }

    const audio = audioRef.current;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => loadAndPlayNext();
    const onError = () => {
      if (audio.src) {
        setStatus("error");
        setError("Audio playback error");
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When station changes, abort any in-flight requests and reset
  useEffect(() => {
    if (stationRef.current !== station.id) {
      // Abort in-flight loading
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }

      stationRef.current = station.id;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
      setCurrentTrack(null);
      setTrackNumber(0);
      setProgress(0);
      setDuration(0);
      setStatus("idle");
      setError(null);
    }
  }, [station.id]);

  const ensureSeeded = useCallback(async (signal?: AbortSignal) => {
    try {
      await fetch("/api/stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationId: station.id, count: 2 }),
        signal,
      });
    } catch {
      // Non-critical
    }
  }, [station.id]);

  const loadAndPlayNext = useCallback(async () => {
    if (!audioRef.current) return;

    // Abort any previous in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const signal = controller.signal;

    // Capture station ID at call time
    const targetStationId = stationRef.current;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(`/api/tracks?stationId=${targetStationId}`, { signal });

      if (res.status === 404) {
        await ensureSeeded(signal);
        setError("Generating your first track... this takes about 30-60 seconds.");

        let attempts = 0;
        while (attempts < 30) {
          if (signal.aborted) return;
          await new Promise((r) => setTimeout(r, 3000));
          if (signal.aborted) return;

          // Check if station changed during wait
          if (stationRef.current !== targetStationId) return;

          const retry = await fetch(`/api/tracks?stationId=${targetStationId}`, { signal });
          if (retry.ok) {
            const track: TrackMeta = await retry.json();
            if (stationRef.current !== targetStationId) return;

            setCurrentTrack(track);
            setTrackNumber((n) => n + 1);
            audioRef.current!.src = `/api/tracks/audio?id=${track.id}`;
            await audioRef.current!.play();
            setStatus("playing");
            setError(null);
            return;
          }
          attempts++;
        }

        if (stationRef.current === targetStationId) {
          setStatus("error");
          setError("Generation timed out. Try again.");
        }
        return;
      }

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const track: TrackMeta = await res.json();

      // Final station check before playing
      if (stationRef.current !== targetStationId) return;

      setCurrentTrack(track);
      setTrackNumber((n) => n + 1);
      audioRef.current.src = `/api/tracks/audio?id=${track.id}`;
      await audioRef.current.play();
      setStatus("playing");
    } catch (err) {
      if (signal.aborted) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Playback failed");
    }
  }, [station.id, ensureSeeded]);

  const play = useCallback(() => {
    if (!audioRef.current) return;

    if (currentTrack && audioRef.current.src) {
      audioRef.current.play();
      setStatus("playing");
    } else {
      loadAndPlayNext();
    }
  }, [currentTrack, loadAndPlayNext]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
    }
  }, []);

  const skip = useCallback(() => {
    loadAndPlayNext();
  }, [loadAndPlayNext]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  }, []);

  return {
    status,
    currentTrack,
    trackNumber,
    error,
    play,
    pause,
    skip,
    volume,
    setVolume,
    progress,
    duration,
    audioElement: audioRef.current,
  };
}
