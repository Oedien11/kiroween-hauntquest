---
inclusion: always
---

# Product — HauntQuest

## What it is
HauntQuest is a daily crypto quest tracker: one page where a free-opportunity
hunter keeps every airdrop, mint, check-in, claim and bounty in one haunted
list, with deadlines, streaks and XP — so nothing rots in a forgotten tab.

## Who it is for
Solo crypto / AI-agent hunters (like the builder) who juggle a dozen free
daily tasks across many sites and need a zero-cost, zero-account tracker.
No wallet connection, no sign-up, no server: data lives in localStorage.

## The problem it solves
- Daily quests (check-ins, claims, tasks) expire silently; missing one breaks
  a streak or forfeits points.
- Opportunities live scattered across X posts, Discords and dashboards.
- Existing trackers need accounts, subscriptions, or wallet connections —
  overkill for a free-only routine.

## Core features (v1)
1. Quest CRUD: title, project, chain, type, reward, XP, deadline, link, notes,
   daily-recurring flag.
2. Filters (status / chain / type / free text) + sorting (deadline / XP / A–Z).
3. Countdown to the next deadline; overdue highlighting.
4. Streaks: consecutive days with ≥ 1 completed quest; XP ranks every 500 XP.
5. Daily recurring quests revive each morning after completion.
6. Export / import JSON; reset to the built-in seed list.
7. Seeded with 8 real free quests from the builder's own routine.

## Non-goals (v1)
- No backend, no accounts, no sync, no wallet, no payments.
- No price data, no on-chain reads — the tracker is a checklist, not a wallet.
- No notifications (browser Notification API is a possible v2).

## Hackathon context
Built for Kiroween 2026, **Costume Contest** category: any app, with a
haunting, polished UI — hence the midnight-graveyard theme (pumpkin orange,
ghost green, dark purple night).
