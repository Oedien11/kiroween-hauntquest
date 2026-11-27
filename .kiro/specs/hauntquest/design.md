# Design — HauntQuest

## Overview
A zero-dependency static web app. One HTML page, one stylesheet, two JS
modules (pure logic + DOM wiring), one seed-data module, one test file.
Data persists in `localStorage` under key `hauntquest.v1`. Deployable to
GitHub Pages with no build step.

## Architecture
```
index.html  ──imports──▶ src/app.js ──imports──▶ src/logic.js  (pure)
                  │                      └──────▶ src/seed.js   (data)
                  └──loads──▶ styles.css
tests/logic.test.mjs ──imports──▶ src/logic.js
```

- **src/logic.js** — pure functions only: `createQuest`, `validateQuest`,
  `filterQuests`, `sortQuests`, `timeLeft`, `nextDeadline`, `calcStreak`,
  `computeStats`, `rankForXp`, `refreshRecurring`, `completeQuest`,
  `dayKey`. No DOM, no storage, clock passed in as a parameter.
  Rationale: every rule is unit-testable with plain `node --test`.
- **src/app.js** — DOM rendering, event handlers, `localStorage` load/save,
  the add/edit `<dialog>`, export/import/reset. Thin: it never re-implements
  a rule that lives in `logic.js`.
- **src/seed.js** — the 8 seed quests (real free quests from the builder's
  routine, each with a real public link).

## Data model
```js
Quest = {
  id: string,            // "q-<base36 time>-<counter>"
  title: string,         // required, ≤ 120 chars
  project: string,
  chain: "BSC"|"Solana"|"Ethereum"|"Base"|"TON"|"Bitcoin"|"Any",
  type: "airdrop"|"mint"|"quest"|"bounty"|"check-in"|"claim",
  reward: string,
  xp: number,            // default by type if omitted
  deadline: string|null, // ISO date or datetime
  url: string,           // must start with http(s):// when present
  notes: string,
  recurring: "once"|"daily",
  status: "todo"|"doing"|"done"|"skipped",
  createdAt: string,     // ISO timestamp
  completedAt: string|null
}
```

## Key algorithms
- **Streak** (`calcStreak`): build a set of completion day-keys; walk back
  from today (or yesterday if nothing is done today yet); count consecutive
  days present in the set. A gap stops the count.
- **Recurring revival** (`refreshRecurring`): on load and once a minute, any
  `daily` quest with status `done` whose `completedAt` day ≠ today returns
  to `todo` with `completedAt` cleared.
- **Countdown** (`timeLeft`): diff in ms → `Xd Yh left` / `Xh Ym left` /
  `Xm left` / `Overdue`. Date-only deadlines parse as UTC midnight (documented
  in tests).
- **Ranks** (`rankForXp`): `floor(totalXp / 500)` capped at the last rank.

## UI
- Header: brand + nearest-deadline banner.
- Stats row: total XP + rank, streak, done/total, overdue count,
  Haunt-o-meter progress bar.
- Controls: search, status/chain/type filters, sort, Add / Export / Import /
  Reset buttons.
- Quest cards: title + XP chip, meta chips (chain, type, daily, deadline,
  status), reward, link, notes, action buttons (Complete / Start / Reopen /
  Edit / Delete).
- Theme: midnight graveyard — `#0d0618` night, `#ff8c1a` pumpkin,
  `#b8f5c8` ghost green; Costume Contest polish, no external assets.

## Testing
- `tests/logic.test.mjs`: 14 tests (`node --test`) covering validation,
  creation defaults, filtering, sorting, countdown labels, overdue,
  next-deadline skipping, streak edge cases, recurring revival, stats
  aggregation, empty list, rank steps.
- Manual checks: serve with `python3 -m http.server`, curl each asset
  (200), HTML↔JS id cross-check script, seed-import smoke test.
- No browser automation was available on the build VM; the UI is verified
  by static checks + unit tests, and the demo video (user's job) is the
  live end-to-end proof.

## Decisions and trade-offs
- Vanilla JS over a framework: zero install for judges, trivial GitHub
  Pages deploy, no supply-chain risk.
- localStorage over a backend: free, private, offline; the cost is no
  cross-device sync (export/import covers backup instead).
- Date-only deadlines treated as UTC midnight (JS `Date` parsing rule);
  surfaced in tests so the behaviour is explicit, not accidental.
