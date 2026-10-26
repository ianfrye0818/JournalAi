# 12 — Obsidian markdown export

**Goal:** Get entries into the vault three ways: auto-write to a vault folder, share one day, zip a range.

## Files
- `src/lib/export/markdown.ts`: frontmatter (date, title, tags incl. `journal`, snippet count, `source: journalai`), `# {title}`, body, optional `## Snippets` appendix; filename template default `YYYY-MM-DD.md`; unit tests
- `src/lib/export/vault.ts`: pick the vault / daily-notes folder via SAF (verify the v58 expo-file-system API; persist the URI); write with a last-export hash check → confirm dialog if the file changed externally
- Auto-export on finalize when a vault is set; single-day share (expo-sharing); range export → jszip → cache file → share
- Settings section: vault folder, filename template, include-snippets toggle, auto-export toggle

## Acceptance
- A finalized day appears in Obsidian's daily notes folder on the phone
- A month's zip opens with correct files
- Re-exporting after editing in Obsidian prompts instead of overwriting

## Out of scope
Two-way sync from Obsidian.
