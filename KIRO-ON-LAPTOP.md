# Run one real Kiro spec task on your laptop (5 minutes)

**Why this file exists:** the app was built on a Linux VM where Kiro CLI
**does install and run** (verified 27 Nov 2026 — see table below), but no
real Kiro session could execute anything there, because every Kiro route
needs **your own sign-in** (Kiro account / Google / GitHub), and the agent
must not create an account in your name. So the one real Kiro session has
to happen on your machine, with you signed in. It takes about 5 minutes
and it is the difference between "`.kiro` artefacts only" (minimum
evidence — the rules allow disqualification for insufficient Kiro use)
and "a real Kiro session executed a spec task".

## What was tried on the VM (27 Nov 2026, ~17:00 WIB)

| Route | Result |
|---|---|
| **Kiro CLI, official installer** — `curl -fsSL https://cli.kiro.dev/install \| bash` | ✅ WORKS. Installed `kiro-cli 3.6.2` to `~/.local/bin` on Ubuntu (glibc 2.39, Node 24). `kiro-cli --version` → `kiro-cli 3.6.2`. |
| **Kiro CLI chat** — `kiro-cli chat --no-interactive "…"` in the repo | ❌ BLOCKED at auth, not at install: `Not logged in. Set the KIRO_API_KEY environment variable or run 'kiro-cli login' first.` `kiro-cli whoami` → `Not logged in`. |
| **Kiro CLI login** — `kiro-cli login --license free --use-device-flow` (or `--social google` / `--social github`) | ⛔ NOT attempted by the agent — it opens a sign-in that creates/links **your** Kiro account (free Builder ID, or Google/GitHub). Only you can do this. This is the single blocking step. |
| **Headless with `KIRO_API_KEY`** — `KIRO_API_KEY=… kiro-cli chat --no-interactive …` | ⛔ Same blocker: the API key is generated from the Kiro dashboard, which needs your signed-in account. No key exists yet. |
| **npm `kiro-cli`** — `npm install -g kiro-cli` | ❌ Do NOT use: npm `kiro-cli` is version `0.0.1`, described as "Kiro CLI - placeholder". The curl installer above is the official route. |
| **Kiro IDE on the VM** | ❌ Not viable here: the IDE is a desktop app (Linux `.deb`/`.rpm`/AppImage exist at kiro.dev/downloads) and this VM has no desktop/GUI, no VS Code, no Chromium. The CLI is the VM route — and it works, pending your sign-in. |
| **Kiro Web — app.kiro.dev** (text fetch only, no sign-in) | ⚠️ Could not be read: the page returned "Kiro failed to load … firewall or proxy blocking required domains" (`assets.app.kiro.dev`). That is a limitation of the text fetch, not proof the web app is down. Web also needs your sign-in. |
| **Kiro Crew** | ⛔ Same auth blocker — it runs on `kiro-cli` underneath and guides a device-code sign-in. No point trying it before you have a Kiro account. |

**Bottom line:** the earlier claim in `KIRO-USAGE.md` ("Kiro cannot run on
this Linux VM") was wrong as stated. Corrected 27 Nov 2026: **Kiro CLI
runs fine on the VM; what is missing is your signed-in Kiro account.**
Once you have an account, the VM route also works — either run the steps
below on your laptop, or, after you sign in once, the agent can run
`kiro-cli` here with your login/API key (your call; the key must never be
pasted into chat — use the secure vault flow).

## The 5-minute job (on your laptop)

You need: the laptop, this repo cloned (or just open the folder), and a
Google or GitHub account for sign-in. No payment, no credits needed for
this — the free tier covers one small task.

### Option A — Kiro IDE (easiest if you like clicking)

1. Go to **https://kiro.dev/downloads**, download Kiro IDE for your OS,
   install it, open it.
2. Sign in when it asks — pick **Google** (or GitHub). This creates your
   free Kiro account. (Same account you will later use for the 4,000
   free credits — remember which login you picked: Google, GitHub and
   Builder ID are separate accounts even with the same email.)
3. **File → Open Folder** and pick the `kiroween-hauntquest` folder
   (clone it first if needed: `git clone
   https://github.com/Oedien11/kiroween-hauntquest`).
4. Click the **Kiro icon** in the left sidebar (or press
   `Ctrl+Shift+P` / `Cmd+Shift+P` → type `Kiro` → open Kiro Chat).
   Kiro will read `.kiro/steering/` and `.kiro/specs/hauntquest/`
   automatically — that is the spec it works from.
5. Paste the prompt from **"What to paste"** below into Kiro Chat and
   press Enter. Let it work; approve the file edits / test run when it
   asks (it may ask once — say yes, it only touches this repo).
6. When it says done, check the chat says the tests pass, then in the
   terminal inside Kiro (or your own terminal in the repo folder) run:
   `git add -A && git commit -m "Task 17 via real Kiro session: due-today filter" && git push`
   (or tell the agent to push it — the repo is yours, pushing is fine).

### Option B — Kiro CLI (if you prefer the terminal)

1. macOS/Linux terminal: `curl -fsSL https://cli.kiro.dev/install | bash`
   (Windows PowerShell: `irm 'https://cli.kiro.dev/install.ps1' | iex`).
   Then restart the terminal (or `export PATH="$HOME/.local/bin:$PATH"`).
2. `kiro-cli login --license free --use-device-flow` — it prints a URL
   and a code; open the URL in your browser, enter the code, sign in
   with Google/GitHub. (Or `kiro-cli login --social google`.)
3. `cd kiroween-hauntquest` then `kiro-cli chat`, paste the prompt
   below, press Enter. Approve the edits/tests when asked.
4. Same `git add/commit/push` as step 6 above.

## What to paste (the spec task — Task 17, already in tasks.md)

> Using the spec in `.kiro/specs/hauntquest/` (requirements.md,
> design.md, tasks.md) and the steering docs in `.kiro/steering/`,
> execute Task 17: (1) run `npm test` and confirm all 14 tests pass;
> (2) add a "Due today" filter: a `dueToday(quests)` helper in
> `src/logic.js` (quests with a deadline on today's local date, not
> done/skipped), a "Due today" chip in the filter row in `index.html` /
> `src/app.js`, and at least one unit test in
> `tests/logic.test.mjs`; (3) run `npm test` again and `node --check`
> on both JS modules; (4) tick tasks 11, 12 and 17 in
> `.kiro/specs/hauntquest/tasks.md` (11: verify
> https://oedien11.github.io/kiroween-hauntquest/ loads; 12: this
> session is the real Kiro run); (5) update `KIRO-USAGE.md` with what
> you actually did, when, and the test output.

## After the run — what counts as evidence

- `tasks.md` items 11, 12, 17 ticked, with the Kiro session noted.
- `KIRO-USAGE.md` updated with the tool (IDE or CLI), date/time, what
  it changed, and the test result — in Kiro's own words, not the
  agent's.
- The commit in `git log` showing the Task 17 change. That commit is
  what the Devpost "how Kiro was used" write-up points to.
