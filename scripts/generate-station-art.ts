/**
 * One-time script to generate station artwork using Imagen 4.0.
 * Run with: npx tsx scripts/generate-station-art.ts
 * Saves PNG files to public/stations/
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const stationArtPrompts: Record<string, string> = {
  "lofi-chill": `Minimalist abstract artwork for a lo-fi jazz hip-hop radio station.
Watercolor and ink wash style on cream paper. Muted palette: dusty blue, warm gray, faded terracotta, soft indigo.
Subject: An abstract impression of a rainy window at night — soft blurred circles of light (bokeh), rain streaks rendered as loose ink lines, a suggestion of a coffee cup silhouette in the corner.
Style: Japanese wabi-sabi aesthetic, imperfect brush strokes, deliberate negative space, feels like a page from a worn sketchbook.
No text, no words, no letters, no typography, no logos.`,

  "trance-pulse": `Minimalist abstract artwork for a trance electronic music radio station.
Watercolor and ink style on cream paper. Palette: deep violet, electric indigo, soft magenta, touches of gold against warm cream.
Subject: An abstract impression of sound waves radiating outward from a central point — concentric rings that dissolve and fragment at the edges, like ripples in dark water catching light. Subtle geometric patterns emerging from organic brush strokes.
Style: Controlled chaos, precise yet hand-drawn feeling, the geometry of music made visible. Negative space is important.
No text, no words, no letters, no typography, no logos.`,
};

async function generateArt(stationId: string, prompt: string) {
  console.log(`Generating art for ${stationId}...`);

  const response = await ai.models.generateImages({
    model: "imagen-4.0-generate-001",
    prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: "1:1",
    },
  });

  const imageData = response.generatedImages?.[0]?.image?.imageBytes;
  if (!imageData) {
    throw new Error(`No image data for ${stationId}`);
  }

  const outPath = path.join(
    process.cwd(),
    "public",
    "stations",
    `${stationId}.png`
  );
  fs.writeFileSync(outPath, Buffer.from(imageData, "base64"));
  console.log(`Saved: ${outPath}`);
}

async function main() {
  for (const [id, prompt] of Object.entries(stationArtPrompts)) {
    try {
      await generateArt(id, prompt);
    } catch (err) {
      console.error(`Failed for ${id}:`, err);
    }
  }
  console.log("Done!");
}

main();
