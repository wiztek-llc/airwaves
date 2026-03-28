"use client";

import { useRef, useEffect } from "react";

interface VisualizerProps {
  isPlaying: boolean;
  color: string;
  /** Call this to get current frequency data — reads from the AnalyserNode directly */
  getFrequencyData: () => Uint8Array;
}

export function Visualizer({ isPlaying, color, getFrequencyData }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  // Store props in refs so the draw loop always has current values
  // without needing to tear down/recreate the loop
  const isPlayingRef = useRef(isPlaying);
  const colorRef = useRef(color);
  const getDataRef = useRef(getFrequencyData);

  // Keep refs in sync with props (no effect teardown)
  isPlayingRef.current = isPlaying;
  colorRef.current = color;
  getDataRef.current = getFrequencyData;

  // Single animation loop — created once, runs forever, reads from refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const playing = isPlayingRef.current;
      const col = colorRef.current;

      ctx.clearRect(0, 0, w, h);

      // Get fresh frequency data from the analyzer (no React involved)
      const frequencyData = getDataRef.current();

      const barCount = 48;
      const gap = 3;
      const barWidth = (w - gap * (barCount - 1)) / barCount;
      const maxBarHeight = h * 0.95;

      for (let i = 0; i < barCount; i++) {
        const hasData = frequencyData && frequencyData.length > 0;
        const binIndex = hasData
          ? Math.floor(Math.pow(i / barCount, 1.5) * (frequencyData.length - 1))
          : 0;
        const value = hasData ? (frequencyData[binIndex] || 0) : 0;
        const normalized = value / 255;

        const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2);
        const envelope = 1 - centerDistance * 0.4;

        let barHeight: number;
        if (playing && normalized > 0.01) {
          barHeight = Math.max(2, normalized * maxBarHeight * envelope);
        } else {
          barHeight = 2 + Math.sin(i * 0.3) * 1;
        }

        const x = i * (barWidth + gap);
        const y = h - barHeight;

        const opacity = playing ? 0.3 + normalized * 0.5 : 0.15;
        ctx.fillStyle = hexToRgba(col, opacity);

        // Rounded bar top
        const radius = Math.min(barWidth / 2, 3);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
    };
  // Empty deps — this loop runs once and reads everything from refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-sm h-20"
      style={{ imageRendering: "auto" }}
    />
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
