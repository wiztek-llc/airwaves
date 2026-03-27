"use client";

import { useRef, useEffect } from "react";

interface VisualizerProps {
  isPlaying: boolean;
  color: string;
  frequencyData: Uint8Array;
}

export function Visualizer({ isPlaying, color, frequencyData }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

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
      ctx.scale(dpr, dpr);
    };
    resize();

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Number of bars to draw (use a subset of frequency bins)
      const barCount = 48;
      const gap = 3;
      const barWidth = (w - gap * (barCount - 1)) / barCount;
      const maxBarHeight = h * 0.95;

      for (let i = 0; i < barCount; i++) {
        // Map bar index to frequency bin (weight toward lower frequencies)
        const hasData = frequencyData && frequencyData.length > 0;
        const binIndex = hasData
          ? Math.floor(Math.pow(i / barCount, 1.5) * (frequencyData.length - 1))
          : 0;
        const value = hasData ? (frequencyData[binIndex] || 0) : 0;
        const normalized = value / 255;

        // Center-weighted height envelope
        const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2);
        const envelope = 1 - centerDistance * 0.4;

        let barHeight: number;
        if (isPlaying && normalized > 0.01) {
          barHeight = Math.max(2, normalized * maxBarHeight * envelope);
        } else {
          // Idle state: tiny bars
          barHeight = 2 + Math.sin(i * 0.3) * 1;
        }

        const x = i * (barWidth + gap);
        const y = h - barHeight;

        // Parse hex color and apply opacity
        const opacity = isPlaying ? 0.3 + normalized * 0.5 : 0.15;
        ctx.fillStyle = hexToRgba(color, opacity);

        // Draw rounded bar
        const radius = Math.min(barWidth / 2, 3);
        roundedRect(ctx, x, y, barWidth, barHeight, radius);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
    };
  }, [isPlaying, color, frequencyData]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-sm h-20"
      style={{ imageRendering: "auto" }}
    />
  );
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
