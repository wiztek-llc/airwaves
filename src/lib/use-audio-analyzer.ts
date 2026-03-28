"use client";

import { useRef, useCallback, useEffect } from "react";

const FFT_SIZE = 256;
const BIN_COUNT = FFT_SIZE / 2;

/**
 * Audio analyzer that exposes frequency data via a ref (NOT state).
 * The visualizer reads from the ref in its own rAF loop — zero React re-renders.
 */
export function useAudioAnalyzer() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef(new Uint8Array(BIN_COUNT));
  const connectedRef = useRef(false);

  /**
   * Connect an audio element to the analyzer.
   * Call after user interaction (click/tap).
   */
  const connectAudio = useCallback((audioElement: HTMLAudioElement) => {
    if (connectedRef.current) return; // Already connected

    // Create AudioContext lazily
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Create analyser once
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
    }

    // Connect source once
    if (!sourceRef.current) {
      try {
        const source = ctx.createMediaElementSource(audioElement);
        source.connect(analyserRef.current!);
        analyserRef.current!.connect(ctx.destination);
        sourceRef.current = source;
        connectedRef.current = true;
      } catch {
        // Already connected
        connectedRef.current = true;
      }
    }
  }, []);

  /**
   * Get current frequency data. Call this inside a rAF loop.
   * Writes into the shared dataArrayRef — no allocations, no state updates.
   */
  const getFrequencyData = useCallback((): Uint8Array => {
    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    }
    return dataArrayRef.current;
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount only
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return { connectAudio, getFrequencyData, binCount: BIN_COUNT };
}
