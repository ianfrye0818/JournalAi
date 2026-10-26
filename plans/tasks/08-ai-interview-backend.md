# 08 — AI interview (backend)

**Goal:** Generate clarifying questions with suggested answers from the day's snippets.

**Prereq:** load the `claude-api` skill before writing code.

## cqrs-gen (run in `backend/`)
```
cqrs-gen --name StartInterviewRound --out ./src/features/days      --type command
cqrs-gen --name GetDay              --out ./src/features/days      --type query
cqrs-gen --name AnswerQuestion      --out ./src/features/questions --type command
```

## Files
- `src/services/anthropic.service.ts` (global): SDK client from ConfigService; structured-output helper (tool use / JSON schema) + Zod validation; retries; token usage logging
- `src/features/days/prompts/interview.prompt.ts`: system prompt (warm, concise, ask only what improves the entry, never invent, suggested answers drawn from context); include prior rounds' Q&A

## Logic
- Requires ≥1 snippet; status must be `open` or `interviewing`
- round = `interviewRound + 1`; max 2 rounds (after that return `readyToDraft: true` without an AI call)
- Persist Questions; status → `interviewing`

## API
```
GET   /api/days/:date            → day + snippets + questions + entry
POST  /api/days/:date/interview  → {round, questions[], readyToDraft}
PATCH /api/questions/:id {answer} | {skipped:true} → question
```

## Acceptance
- Handler specs with a mocked AnthropicService (schema-invalid output → retry once, then 502)
- Manual run against real snippets yields 0–5 sensible questions

## Out of scope
Drafting, mobile UI.
