# How Kiro was used — HauntQuest

This file is the honest account the Devpost submission's "how Kiro was
used" write-up is based on. It does not overclaim.

## What Kiro's workflow contributed
- **Spec-driven development.** Before any code was written, the feature was
  specified in `.kiro/specs/hauntquest/`: EARS requirements
  (`requirements.md`), technical design (`design.md`), and a tracked task
  list (`tasks.md`). Code was written against the spec, and the one failing
  test during the build was resolved by correcting the test's expectation
  and documenting the behaviour in the design — the spec-first loop working
  as intended.
- **Steering docs.** `.kiro/steering/product.md`, `tech.md` and
  `structure.md` hold the standing project context (audience, stack rules,
  file layout) so any agent session starts from the same facts instead of
  re-deriving them.
- **Agent hooks.** `.kiro/hooks/run-tests.json` runs the unit tests on every
  save of `src/` or `tests/`, and nudges the agent to keep the spec in sync
  when a spec file changes.
- **MCP.** None configured for v1 — documented as such in
  `.kiro/settings/mcp.json` rather than invented.

## What Kiro did NOT do (please read)
Kiro (the agentic IDE/CLI) **has not executed any session on this
project yet** — not because it cannot run here, but because every Kiro
route needs the builder's own signed-in Kiro account, which the agent
must not create. The build was carried out by an AI agent following
Kiro's spec-driven workflow and producing Kiro-native artefacts (`.kiro/`
in the repo root, never gitignored), but the Kiro application itself was
not in the loop.

**Correction (27 Nov 2026):** an earlier version of this file said
"Kiro cannot run on the Linux VM". That was wrong. Investigated
27 Nov 2026 ~17:00 WIB — the official installer
(`curl -fsSL https://cli.kiro.dev/install | bash`) installed
**Kiro CLI 3.6.2** cleanly on the VM (Ubuntu, glibc 2.39, Node 24);
`kiro-cli --version` → `kiro-cli 3.6.2`. The hard stop is
authentication only: `kiro-cli whoami` → `Not logged in`, and
`kiro-cli chat --no-interactive …` refuses with "Not logged in. Set
the KIRO_API_KEY environment variable or run `kiro-cli login` first."
Login needs the builder's own sign-in (free Builder ID, or Google /
GitHub social login, device flow) or a `KIRO_API_KEY` from his Kiro
dashboard — neither exists yet, and neither may be created by the
agent. The npm package `kiro-cli` is a 0.0.1 placeholder, not the
official route — do not use it. The IDE has Linux builds but this VM
has no GUI, so the CLI is the VM route. Full route table + the exact
5-minute laptop steps: see `KIRO-ON-LAPTOP.md`.

That matters for the "built with Kiro" rule: the rules say insufficient
use of Kiro can disqualify a submission at the judges' discretion, and a
`.kiro` directory alone is the minimum evidence, not proof of a Kiro
session. To strengthen the entry, the builder should, before submitting:

1. Open this repo in **Kiro IDE** (or Kiro CLI / Web) on his own machine
   — exact steps in `KIRO-ON-LAPTOP.md`.
2. Run at least one spec task through Kiro (Task 17 in tasks.md — the
   "Due today" filter; prompt is in `KIRO-ON-LAPTOP.md`), letting Kiro
   read the steering + spec files.
3. Update this file with what Kiro actually did, and keep the repo's
   `.kiro` artefacts as the record.

## The workflow, in one line
Spec first (requirements → design → tasks), steering as standing context,
hooks as the safety net, tests as the proof — the Kiro way of building,
executed by an agent because no signed-in Kiro account existed yet.
Once Task 17 runs in a real Kiro session (see `KIRO-ON-LAPTOP.md`),
this file gets the session evidence and the sentence above changes.
