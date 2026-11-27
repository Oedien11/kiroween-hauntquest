# 🎃 HauntQuest — Daily Crypto Quest Tracker

**Kiroween 2026 · Costume Contest** — a haunted, polished tracker for your
daily free crypto quests: airdrops, mints, check-ins, claims and bounties,
with deadlines, streaks and XP. No accounts, no wallet, no gas, no server.

> Live demo: enable GitHub Pages on this repo (Settings → Pages → Deploy
> from branch, root) — the app is a static site and runs as-is.

## What it does

- **Quest list** — add, edit, delete quests (title, project, chain, type,
  reward, XP, deadline, link, notes, daily-recurring flag).
- **Countdowns** — human-readable time left (`2d 5h left`, `45m left`),
  overdue highlighting, and the nearest deadline in the header.
- **Streaks & XP** — consecutive-day streaks, XP ranks every 500 XP
  (Lost Soul → Haunt Legend), a Haunt-o-meter progress bar.
- **Daily quests revive** — a daily recurring quest completed yesterday is
  back on the list this morning.
- **Filter & sort** — by status, chain, type, free text; sort by deadline,
  XP or A–Z.
- **Backup** — export / import the quest list as JSON; reset to the 8
  built-in seed quests (real free quests from the builder's routine).

## Run it

No build step, no dependencies. Any static host works:

```bash
# local preview
python3 -m http.server 8000
# open http://localhost:8000
```

Tests (Node ≥ 20, no dependencies):

```bash
npm test   # node --test tests/logic.test.mjs — 14 tests
```

## How it was built (Kiro)

Spec-driven, the Kiro way — see [KIRO-USAGE.md](KIRO-USAGE.md) for the
honest account, and `.kiro/` for the artefacts:

- `.kiro/steering/` — product, tech, structure
- `.kiro/specs/hauntquest/` — EARS requirements, design, tasks
- `.kiro/hooks/` — run tests on save
- `.kiro/settings/` — MCP config (none needed for v1)

**Important:** no Kiro session has executed this build yet — Kiro CLI
3.6.2 installs and runs on the build VM, but every Kiro route needs
your own signed-in Kiro account (the agent must not create one). Before
submitting, open the repo in Kiro on your own machine and run Task 17
through it — exact 5-minute steps in `KIRO-ON-LAPTOP.md`.

## Kiroween submission checklist (for the builder)

- [ ] Enable GitHub Pages → paste the live app URL into Devpost
- [ ] Claim 4,000 free Kiro credits — **by 1 Dec 2026 12:00 PT
      (= 2 Dec 03:00 WIB)**. Steps: (1) create a Kiro account at
      app.kiro.dev and find your Kiro user ID; (2) register for Kiroween
      at kiroween.devpost.com; (3) fill the credit request form (Resources
      tab) with the same email as Devpost, your Devpost profile link, your
      Kiro user ID, and a project description naming the category
      (Costume Contest) in 2–3 sentences; (4) complete the Didit ID check
      (selfie + government ID photo) when the email arrives; (5) redeem
      the code by 4 Dec — sign in to the right Kiro account first, credits
      are not transferable.
- [ ] Record the demo video (< 3 min), upload to YouTube as public
- [ ] Submit on Devpost — **by 4 Dec 2026 14:00 PT (= 5 Dec 05:00 WIB)**:
      public repo URL, working app URL, description, video link, Kiro
      write-up, category **Costume Contest**
- [ ] Optional bonuses: Social Blitz post starting with
      `#KiroweenHackathon26`; public blog post about Kiro + this project

## Rules verified live

- Devpost: <https://kiroween.devpost.com> (rules:
  <https://kiroween.devpost.com/rules>), read 27 Nov 2026.
- Deadline 4 Dec 2026 14:00 PT = **5 Dec 2026 05:00 WIB**. New projects
  only (built 30 Oct – 4 Dec). Solo or teams up to 3. Indonesia is NOT
  on the excluded-countries list.
- Submission needs: public GitHub repo (open-source license, `/.kiro`
  at root, never gitignored), working app URL, text description, demo
  video < 3 min on public YouTube, write-up on how Kiro was used.
- Prizes: $100,000+; 1st $30,000, 2nd $20,000, 3rd $10,000; each category
  winner $5,000; Best Demo $1,000; Bonus Blog (100 × 2,000 Kiro credits);
  Social Blitz (5 × 3-month Kiro Pro+).

## License

MIT — see [LICENSE](LICENSE).
