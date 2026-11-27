# Tasks — HauntQuest

Spec-driven build plan. Checked items are done; unchecked items are the
remaining work (mostly the parts only the builder/user can do from a
browser: Pages, video, Devpost).

## Implementation

- [x] 1. Scaffold the repo: `index.html`, `styles.css`, `src/`, `tests/`,
      `.kiro/` (steering, specs, hooks, settings), `README.md`, `LICENSE`,
      `package.json`, `.gitignore` (never ignoring `.kiro`).
- [x] 2. Write the spec: EARS requirements (`requirements.md`), design
      (`design.md`), this task list.
- [x] 3. Implement pure logic in `src/logic.js`: create/validate quests,
      filter, sort, countdown, next deadline, streak, stats, ranks,
      daily-recurring revival.
- [x] 4. Write seed data in `src/seed.js`: 8 real free quests from the
      builder's routine, each with a real public link.
- [x] 5. Write unit tests in `tests/logic.test.mjs` (14 tests, `node --test`).
- [x] 6. Fix the one failing test (date-only deadline label: UTC-midnight
      parsing — expectation corrected, behaviour documented in `design.md`).
- [x] 7. Build the UI in `index.html` + `styles.css` (Costume Contest
      graveyard theme) and wire it in `src/app.js` (render, dialog,
      filters, export/import/reset, localStorage).
- [x] 8. Verify locally: all 14 tests pass; `node --check` on both JS
      modules; `python3 -m http.server` serves every asset with HTTP 200;
      HTML↔JS id cross-check passes; all 8 seeds import cleanly.
- [x] 9. Write `KIRO-USAGE.md`: honest account of how Kiro was used
      (spec-driven workflow, `.kiro` artefacts) and what it was not
      (Kiro IDE cannot run on this Linux VM).
- [x] 10. Commit and push to public GitHub repo `Oedien11/kiroween-hauntquest`.

## Still open (needs the user / a browser)

- [ ] 11. Enable GitHub Pages on the repo (Settings → Pages → Deploy from
      branch, root) and record the live app URL for the Devpost form.
- [ ] 12. Open the repo in Kiro IDE (or Kiro CLI / Web) on the user's own
      machine and run at least one spec task through Kiro, so the "built
      with Kiro" claim is backed by a real Kiro session — see
      `KIRO-USAGE.md` for the honest current status.
- [ ] 13. Claim the 4,000 free Kiro credits (deadline 1 Dec 12:00 PT =
      2 Dec 03:00 WIB) — steps in `README.md`.
- [ ] 14. Record the demo video (< 3 min), upload to YouTube as public.
- [ ] 15. Register + submit on Devpost (deadline 4 Dec 14:00 PT =
      5 Dec 05:00 WIB): repo URL, app URL, description, video link,
      Kiro write-up, category = Costume Contest.
- [ ] 16. Optional bonus prizes: Social Blitz post (`#KiroweenHackathon26`
      first in the post) and/or a public blog post about Kiro + this
      project (top 100 blog submissions get 2,000 bonus credits).
