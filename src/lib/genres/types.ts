export interface NamingExamples {
  artists: string[];
  titles: string[];
  namingStyle: string;
  bannedWords: string[];
}

export interface GenreProfile {
  id: string;
  name: string;
  /** Optional override for the master system prompt — gives each genre its own "producer personality" */
  systemPromptOverride?: string;
  /** The genre identity / creative brief */
  identity: string;
  /** Real-world naming examples for track metadata generation */
  namingExamples: NamingExamples;
}
