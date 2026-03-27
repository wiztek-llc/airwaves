import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const genreArtStyles: Record<string, string> = {
  "lofi-chill": `Abstract, painterly, muted warm tones (cream, dusty rose, slate blue, sage green, warm gray). Japanese wabi-sabi aesthetics — imperfect, asymmetric, organic. Watercolor washes, ink brush strokes, soft charcoal sketches. A single object study or abstract landscape. Lots of negative space. The feeling of a worn paperback book cover.`,

  "trance-pulse": `Abstract, bold, electric. Deep purples, magentas, electric blues, and blacks against cream. Geometric light patterns — concentric circles, radiating lines, prismatic refractions. The feeling of light cutting through fog in a dark room. Could be an abstract photograph of light trails, a geometric mandala, or aurora-like color fields. NOT cheesy EDM artwork. NOT neon grids. Minimal but striking. The feeling of staring at a single light source until your eyes blur.`,
};

/**
 * Generate album cover art using Imagen 4.0.
 * Uses genre-specific art direction.
 */
export async function generateCoverArt(
  title: string,
  artist: string,
  mood: string,
  stationId: string = "lofi-chill"
): Promise<Buffer> {
  const artStyle = genreArtStyles[stationId] || genreArtStyles["lofi-chill"];

  const prompt = `Minimalist album cover art.

Title: "${title}" by ${artist}
Mood: ${mood}

Style: ${artStyle}

NOT photorealistic. NOT digital art. NOT busy. No text, no words, no letters, no typography, no logos.`;

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
    throw new Error("No image data in Imagen response");
  }

  return Buffer.from(imageData, "base64");
}
