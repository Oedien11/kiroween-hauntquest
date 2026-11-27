---
inclusion: always
---

# Structure — HauntQuest

```
kiroween-hauntquest/
├── index.html            # Single page: header, stats, filters, quest list, dialog, footer
├── styles.css            # Costume Contest theme (midnight graveyard, pumpkin/ghost)
├── src/
│   ├── logic.js          # Pure quest logic (create/validate/filter/sort/streak/stats)
│   ├── app.js            # DOM wiring + localStorage persistence
│   └── seed.js           # 8 built-in seed quests (builder's real routine)
├── tests/
│   └── logic.test.mjs    # node:test unit tests for src/logic.js
├── .kiro/
│   ├── steering/         # product.md, tech.md, structure.md (this file)
│   ├── specs/
│   │   └── hauntquest/   # requirements.md (EARS), design.md, tasks.md
│   ├── hooks/
│   │   └── run-tests.json # run tests on save of src/ or tests/
│   └── settings/
│       └── mcp.json      # MCP servers (none configured; documented placeholder)
├── KIRO-USAGE.md         # Honest write-up of how Kiro was (and was not) used
├── README.md             # Setup, usage, Kiroween submission checklist
├── LICENSE               # MIT
├── package.json          # test script only (no dependencies)
└── .gitignore            # node_modules, OS files — NEVER .kiro
```

## Naming
- Files: kebab-case for docs, lowerCamel for JS exports.
- Quest statuses: `todo | doing | done | skipped`.
- Quest types: `airdrop | mint | quest | bounty | check-in | claim`.
- Chains: `BSC | Solana | Ethereum | Base | TON | Bitcoin | Any`.

## Where things go
- New pure behaviour → `src/logic.js` + a test in `tests/logic.test.mjs`.
- New UI behaviour → `src/app.js` (DOM only) + markup in `index.html`.
- New seed quests → `src/seed.js` (keep them real, free, and verifiable).
- New features → a new folder under `.kiro/specs/<feature>/` first
  (requirements → design → tasks), then code.
