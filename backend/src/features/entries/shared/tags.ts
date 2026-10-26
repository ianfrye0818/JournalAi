export const MAX_TAGS = 20;

/** Tags are trimmed, lowercased, and deduplicated, so AI and user tags line up in search and export. */
export const normalizeTags = (tags: string[]): string[] => [
  ...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean)),
];
