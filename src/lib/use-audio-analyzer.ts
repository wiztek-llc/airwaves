"use client";

import { useRef, useCallback, useEffect, useState } from "react";

const FFT_SIZE = 256;
const BIN_COUNT = FFT_SIZE / 2; // 128 frequency bins

export function useAudioAnalyzer() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);
  const dataArrayRef = useRef(new Uint8Array(BIN_COUNT));
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    new Uint8Array(BIN_COUNT)
  );

  /**
   * Connect an audio element to the analyzer.
   * Must be called after user interaction (click/tap).
   */
  const connectAudio = useCallback((audioElement: HTMLAudioElement) => {
    // Create AudioContext lazily
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    // Resume if suspended (browser autoplay policy)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Create analyser once
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;
    }

    // Connect source only once per audio element
    if (!sourceRef.current) {
      try {
        const source = ctx.createMediaElementSource(audioElement);
        source.connect(analyserRef.current!);
        analyserRef.current!.connect(ctx.destination);
        sourceRef.current = source;
      } catch {
        // Already connected — this is fine
      }
    }

    // Start the animation loop
    const tick = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        // Create a new copy to trigger React re-render
        setFrequencyData(new Uint8Array(dataArrayRef.current));
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    // Cancel any existing loop before starting new one
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    tick();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { frequencyData, connectAudio, binCount: BIN_COUNT };
}
