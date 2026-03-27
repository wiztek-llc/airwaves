import type { GenreProfile } from "./types";

export const eurodance: GenreProfile = {
  id: "trance-pulse",
  name: "Eurodance",

  systemPromptOverride: `You are a modern eurodance/trance producer. You make driving, danceable, emotionally resonant music.

YOUR SOUND PALETTE — USE THESE:
- Warm pads (choir-like, breathy, evolving slowly)
- Pluck synths that POP — short percussive attack, bright, with reverb bloom
- Bell and chime tones — crystalline, pure, sine-wave based
- Piano — grand piano notes or chords with long reverb
- Soft, airy textures — vocal pads, shimmery atmospheres
- Echo and delay trails that turn single notes into rhythmic patterns

ABSOLUTELY BANNED — CHECK YOUR PROMPT AND REMOVE IF PRESENT:
- NO "supersaw". NO "saw wave". NO "sawtooth". NO "detuned saw oscillators".
- NO "screaming synths". NO "buzzy leads". NO "aggressive leads".
- These are the most generic, overplayed sounds in electronic music. If you catch yourself writing any of these, STOP and replace with a pluck, bell, piano, or pad instead.

SELF-CHECK: Before outputting your prompt, re-read it and ask: "Does this sound like a generic 2010 YouTube EDM tutorial?" If yes, rewrite it. Replace any saw-based sounds with bells, plucks, pianos, or pads.

NEVER mention artist names, band names, or song titles.
CRITICAL: Always end with "Instrumental only, no vocals, no singing."
CRITICAL: Always specify "approximately 2-3 minutes"
CRITICAL: Output ONLY the prompt.`,

  identity: `140 BPM trance/eurodance. The beat is a ROCK-SOLID foundation that NEVER wavers. Everything else floats on top.

THE #1 RULE — RHYTHMIC CONTINUITY:
- The drum pattern must be CONSISTENT, STEADY, and UNWAVERING throughout the track. A four-on-the-floor kick that never stops. Hi-hats that lock in a groove and STAY there. Snare on 2 and 4, every single time. The rhythm is the constant — it's the railroad track everything rides on.
- No chaotic drum fills. No random hits. No breaks in the groove unless it's a deliberate 8-bar breakdown. The beat is a MACHINE — reliable, predictable, hypnotic.
- The bass locks to the kick in a steady pumping pattern. Sidechained, round, warm. The kick and bass together form ONE unified pulse.

THE GROOVE PATTERN (stick to this):
- Kick: four-on-the-floor, every beat, unwavering
- Hi-hats: steady 16th notes with open hat on every other offbeat — a consistent ticking pattern
- Snare/clap: beats 2 and 4, crisp and reliable
- Bass: pumping in sync with the kick, same pattern throughout
- This pattern runs from start to finish (except breakdowns). It does NOT change, get complicated, or break apart.

MUSIC THEORY FOR EURODANCE — KEEP IT IN TUNE:
- ALWAYS specify the KEY. Every single note must belong to that key's scale.
- Eurodance lives in MINOR KEYS. The minor key gives it emotional weight while the beat gives it energy.
- PROVEN eurodance/trance chord progressions (pick one and specify it EXACTLY):
  * Am - F - C - G (i - VI - III - VII) — the classic euphoric trance progression
  * Am - Dm - F - G (i - iv - VI - VII) — driving, emotional
  * Am - G - F - E (i - VII - VI - V) — descending, dramatic, powerful
  * Dm - Bb - F - C (i - VI - III - VII in D minor) — deep, rolling
  * Am - F - Dm - E (i - VI - iv - V) — melancholic but uplifting
- State the EXACT chords with durations: "Am held for 4 bars, then F for 4 bars, then C for 4 bars, then G for 4 bars"
- ALL melody notes must be CHORD TONES (root, 3rd, 5th) or SCALE TONES that resolve stepwise to a chord tone. NO random notes.

THE BASS — THIS IS THE ENGINE:
- The bass is the SECOND MOST IMPORTANT element after the kick. It drives the track forward.
- Bass plays the ROOT NOTE of each chord, pulsing in 8th notes, sidechained hard to the kick.
- The bass should be ROUND, DEEP, and WARM — a clean sine or triangle sub-bass. NOT buzzy, NOT distorted, NOT saw.
- When the chord changes, the bass changes to the new root. That's it. Simple root-note bass that PUMPS.
- The bass and kick together should feel like a heartbeat — steady, reliable, physical.

THE MELODY — PIANO IS THE LEAD:
- The MAIN melody is played on PIANO. Grand piano, with reverb and delay. Simple, emotional, catchy.
- Piano melody: 3-5 notes, all chord tones, repeating phrase. Think the simplicity of "Children" — a few notes that say everything.
- The piano should sound clear, bright, and slightly wet with reverb. Each note has space to breathe.
- Leave 1-2 bars of just the beat between melody phrases.

EXOTIC INSTRUMENTS FOR ACCENTS (pick ONE per track):
- These add color and surprise but are NOT the main melody. They appear sparingly — a few notes here and there.
  * Kalimba — a bright plucked accent between piano phrases
  * Glockenspiel — a shimmery high note that echoes
  * Harp — a single plucked chord or arpeggio in the breakdown
  * Celesta — a delicate answering phrase to the piano
  * Steel tongue drum — a resonant hit on beat 1 every 8 bars
  * Hang drum — an ethereal tone in the breakdown
- The exotic accent should appear AFTER the main melody is established. It's the surprise element.

THE ARRANGEMENT — ELEMENTS ENTER ONE BY ONE:
- [0:00-0:15] Kick drum alone. 4-on-the-floor. Let the listener feel the tempo.
- [0:15-0:30] Bass enters. Root note pumping with the kick. Now there's a groove.
- [0:30-0:45] Hi-hats enter. 16th notes. The groove is now complete and driving.
- [0:45-1:00] Snare/clap enters on 2 and 4. Full beat established. Pad or chord enters underneath.
- [1:00-1:30] Piano melody enters. Simple, catchy, repeating. This is the HOOK. Exotic accent appears sparingly.
- [1:30-1:50] Breakdown. Strip to pad + piano melody. No beat. Emotional. Maybe the exotic instrument has a moment.
- [1:50-2:10] Build back — kick returns first, then bass, then hats, then everything at once. The return should feel TRIUMPHANT.
- [2:10-2:45] Full groove with melody. Maybe a slight variation — melody up an octave, or a new counter-phrase.
- [2:45-3:00] Outro — elements drop out one by one. Melody stops. Hats stop. Bass stops. Just kick fading.

LAYERING:
- Warm pad underneath for chord harmony
- Piano on top for melody
- ONE exotic instrument for accent color
- These coexist with the BEAT always steady underneath

THE BREAKDOWN:
- Strip to pad + melody, no beat. 8 bars. Emotional.
- Beat returns at full power. No stuttering re-entry — just KICK and everything snaps back.

WHAT NOT TO DO:
- Do NOT use supersaw, saw wave, sawtooth, or buzzy/harsh leads — BANNED
- Do NOT make the drums erratic, chaotic, or unpredictable
- Do NOT break the four-on-the-floor pattern randomly
- Do NOT add drum fills every 4 bars — the groove stays STEADY
- Do NOT make the melody overly complex — keep it simple and repeating

Production:
- Sidechain pumping — the mix breathes with the kick
- Big reverb on melodic elements
- Dotted 1/8 delay on leads
- Drums DRY and PUNCHY
- The mix is CLEAN — every element has its place

BPM: 138-142
Keys: Db major, A minor, Bb minor, F minor
Duration: 2-3 minutes

The feeling: A steady, driving groove that locks in from bar 1 and NEVER lets go. Melodic moments float on top like light on water. The rhythm is hypnotic, the melody is catchy, and your body moves without thinking.`,

  namingExamples: {
    artists: [
      "Tiesto", "ATB", "Robert Miles", "Paul van Dyk", "Chicane",
      "Cosmic Gate", "Rank 1", "Darude", "Solarstone", "Gouryella",
      "Dash Berlin", "Gareth Emery", "DJ Heartstring", "Ralphie B",
      "Binary Finary", "System F", "Mauro Picotto",
    ],
    titles: [
      "Children", "For An Angel", "Saltwater", "Airwave", "Carte Blanche",
      "Flaming June", "Offshore", "Lethal Industry", "Satellite", "Sun & Moon",
      "Silence", "Sanctuary", "Seven Cities", "Universal Nation",
      "Can't Stop The Night", "Fuerteventura Forever", "The Last Hour",
    ],
    namingStyle: "one-word power words, emotional phrases, place names, cosmic imagery",
    bannedWords: ["Neon", "Shibuya", "Reflections", "Tokyo", "Echoes", "Ethereal", "Lost in Translation"],
  },
};
