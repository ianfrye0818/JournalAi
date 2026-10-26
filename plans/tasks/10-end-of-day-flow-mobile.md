# 10 — End-of-day flow (mobile)

**Goal:** The nightly ritual: Review → Questions → Draft → Finalize.

## Files
- `src/app/day/[date]/{_layout,review,interview,draft}.tsx`
- Review: snippet list (edit/delete), "Start journaling" CTA (forces a sync first)
- Interview: one card per question; suggested-answer Chips, "Write my own" TextField (+ mic via `use-dictation`), Skip; progress dots; follow-up round loader
- Draft: serif reading view ↔ markdown editor, "Regenerate with feedback" sheet, Finalize button
- Today screen: evening CTA "Wrap up today" when snippets exist
- Skeleton/shimmer loading; friendly progress copy during AI calls; retryable errors

## Acceptance
- Full flow works on device for a real day
- Leaving mid-flow resumes at the right step (derived from day status)
- Finalizing updates Today and Days

## Out of scope
Export (Task 12), history list (Task 11).
