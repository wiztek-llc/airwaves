import { GoogleGenAI } from "@google/genai";
import { genreProfiles, MASTER_SYSTEM_PROMPT } from "./genres";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Generate a masterful Lyria prompt from a seed number.
 * Uses the genre-specific system prompt if available, otherwise the master.
 */
export async function generateLyriaPrompt(
  stationId: string,
  seedNumber: number
): Promise<string> {
  const profile = genreProfiles[stationId];
  if (!profile) {
    throw new Error(`No genre profile for station: ${stationId}`);
  }

  const systemPrompt = profile.systemPromptOverride || MASTER_SYSTEM_PROMPT;

  const userPrompt = `GENRE PROFILE: ${profile.name}

${profile.identity}

SEED NUMBER: ${seedNumber}

Generate the Lyria 3 Pro prompt for this seed. Channel the number into a unique, vivid musical vision. Output ONLY the prompt, nothing else.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 1.0,
      maxOutputTokens: 1024,
    },
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Master prompt agent returned empty response");
  }

  return text.trim();
}

export interface TrackMetadata {
  title: string;
  artist: string;
}

/**
 * Generate a song title and fictional artist name from a seed.
 * Uses genre-specific naming examples.
 */
export async function generateTrackMetadata(
  stationId: string,
  seedNumber: number
): Promise<TrackMetadata> {
  const profile = genreProfiles[stationId];
  if (!profile) {
    throw new Error(`No genre profile for station: ${stationId}`);
  }

  const { namingExamples } = profile;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are naming a unique instrumental track. Seed: ${seedNumber}. Different number = completely different name and artist.

Genre: ${profile.name}

REAL ARTIST NAME EXAMPLES for reference (create something NEW in this style, NEVER copy these):
${namingExamples.artists.join(", ")}

REAL SONG TITLE EXAMPLES for reference (create something NEW in this style, NEVER copy these):
${namingExamples.titles.map((t) => `"${t}"`).join(", ")}

RULES:
- Create a FICTIONAL artist name that feels like it belongs alongside the examples above. Match the VIBE and naming conventions of that genre.
- Create a song title that matches the genre's naming style: ${namingExamples.namingStyle}.
- The seed number ${seedNumber} makes this unique. ${seedNumber % 100 > 50 ? "Lean nighttime/urban/cosmic" : "Lean nature/dawn/emotional"}.
- NEVER use these words: ${namingExamples.bannedWords.map((w) => `"${w}"`).join(", ")}

Respond in EXACTLY this JSON format, nothing else:
{"title": "...", "artist": "..."}`,
    config: {
      temperature: 1.2,
      maxOutputTokens: 128,
    },
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Metadata generation returned empty");

  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned) as TrackMetadata;
  } catch {
    return {
      title: `Seed ${seedNumber}`,
      artist: "airwaves.fm",
    };
  }
}

/**
 * Generate a random seed number between 0 and 100,000,000.
 */
export function generateSeed(): number {
  return Math.floor(Math.random() * 100_000_001);
}
