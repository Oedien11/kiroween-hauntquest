---
inclusion: always
---

# Tech — HauntQuest

## Stack
- **Vanilla HTML + CSS + ES-module JavaScript. No build step, no framework,
  no dependencies.** Deliberate: the app must run from any static host
  (GitHub Pages) and be reviewable by judges with zero install.
- **Node.js ≥ 20** only for tests (`node --test`, built-in runner, no deps).
- **Python 3 `http.server`** for local serving during development.

## Conventions
- Pure logic lives in `src/logic.js` — no DOM, no `localStorage`, no dates
  taken from the clock except via explicit parameters (testability).
- `src/app.js` only wires the DOM and persistence to `logic.js`.
- `src/seed.js` holds the 8 built-in seed quests (editable in the UI).
- All user-facing strings are plain and short; deadlines shown in the
  viewer's local timezone.
- State shape (localStorage key `hauntquest.v1`): an array of quest objects
  as produced by `createQuest()` in `src/logic.js`.
- Quest fields: `id, title, project, chain, type, reward, xp, deadline,
  url, notes, recurring ("once"|"daily"), status ("todo"|"doing"|"done"|
  "skipped"), createdAt, completedAt`.
- XP defaults by type: check-in 20, quest 50, claim 40, airdrop 100,
  mint 80, bounty 150. Ranks step up every 500 XP.
- Tests: `tests/logic.test.mjs` using `node:test` + `node:assert/strict`.
  Run with `npm test` (see `package.json`) or `node --test tests/`.

## Constraints
- Must work from `file://`-adjacent static hosting (GitHub Pages) — ES
  modules only, no bundler, no server-side code.
- No external requests at runtime (no CDNs, fonts, or analytics).
- `/.kiro` must never be gitignored (Kiroween rule — disqualification risk).
