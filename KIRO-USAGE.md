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
Kiro (the agentic IDE) **cannot run on the Linux VM this project was built
on**, so no Kiro IDE / CLI / Web session executed any of this code. The
build was carried out by an AI agent following Kiro's spec-driven workflow
and producing Kiro-native artefacts (`.kiro/` in the repo root, never
gitignored), but the Kiro application itself was not in the loop.

That matters for the "built with Kiro" rule: the rules say insufficient
use of Kiro can disqualify a submission at the judges' discretion, and a
`.kiro` directory alone is the minimum evidence, not proof of a Kiro
session. To strengthen the entry, the builder should, before submitting:

1. Open this repo in **Kiro IDE** (or Kiro CLI / Web) on his own machine.
2. Run at least one spec task through Kiro (e.g. tasks.md item 11–16, or a
   small follow-up feature), letting Kiro read the steering + spec files.
3. Update this file with what Kiro actually did, and keep the repo's
   `.kiro` artefacts as the record.

## The workflow, in one line
Spec first (requirements → design → tasks), steering as standing context,
hooks as the safety net, tests as the proof — the Kiro way of building,
executed by an agent because the Kiro app could not run here.
