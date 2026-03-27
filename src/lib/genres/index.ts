export type { GenreProfile, NamingExamples } from "./types";
export { MASTER_SYSTEM_PROMPT } from "./master-system";
export { lofiChill } from "./lofi-chill";
export { eurodance } from "./eurodance";

import type { GenreProfile } from "./types";
import { lofiChill } from "./lofi-chill";
import { eurodance } from "./eurodance";

/**
 * All genre profiles, keyed by station ID.
 */
export const genreProfiles: Record<string, GenreProfile> = {
  [lofiChill.id]: lofiChill,
  [eurodance.id]: eurodance,
};
