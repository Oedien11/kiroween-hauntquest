// HauntQuest unit tests — run with: node --test tests/logic.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  createQuest,
  validateQuest,
  filterQuests,
  sortQuests,
  timeLeft,
  nextDeadline,
  calcStreak,
  computeStats,
  rankForXp,
  refreshRecurring,
  completeQuest,
  dayKey,
} from "../src/logic.js";

const base = (over = {}) => ({
  title: "Test quest",
  project: "Test",
  chain: "BSC",
  type: "quest",
  deadline: "2026-12-01",
  ...over,
});

test("createQuest fills defaults from type and trims fields", () => {
  const q = createQuest(base({ type: "check-in", xp: undefined }));
  assert.equal(q.status, "todo");
  assert.equal(q.xp, 20); // default XP for check-in
  assert.equal(q.completedAt, null);
  assert.match(q.id, /^q-/);
});

test("createQuest throws on bad input", () => {
  assert.throws(() => createQuest({ title: "  " }), /title is required/);
  assert.throws(() => createQuest(base({ type: "nope" })), /unknown type/);
  assert.throws(() => createQuest(base({ url: "ftp://x" })), /url must start/);
  assert.throws(() => createQuest(base({ deadline: "not-a-date" })), /invalid deadline/);
});

test("validateQuest accepts a minimal valid quest", () => {
  assert.deepEqual(validateQuest({ title: "Hi" }), []);
  assert.ok(validateQuest({ title: "x".repeat(121) }).length > 0);
});

test("filterQuests filters by status, chain, type and free text", () => {
  const quests = [
    createQuest(base({ title: "Kaisar check", type: "check-in", chain: "Any" })),
    createQuest(base({ title: "PXIO claim", type: "claim", chain: "BSC" })),
    createQuest(base({ title: "Mint thing", type: "mint", chain: "Solana" })),
  ];
  assert.equal(filterQuests(quests, { type: "claim" }).length, 1);
  assert.equal(filterQuests(quests, { chain: "Solana" }).length, 1);
  assert.equal(filterQuests(quests, { query: "kaisar" }).length, 1);
  assert.equal(filterQuests(quests, { query: "zzz" }).length, 0);
  assert.equal(filterQuests(quests, {}).length, 3);
});

test("filterQuests respects status after completing a quest", () => {
  const q = completeQuest(createQuest(base()));
  assert.equal(filterQuests([q], { status: "done" }).length, 1);
  assert.equal(filterQuests([q], { status: "todo" }).length, 0);
});

test("sortQuests puts nearest deadline first, dateless last", () => {
  const quests = [
    createQuest(base({ title: "C", deadline: null })),
    createQuest(base({ title: "A", deadline: "2026-11-28" })),
    createQuest(base({ title: "B", deadline: "2026-12-05" })),
  ];
  assert.deepEqual(sortQuests(quests).map((q) => q.title), ["A", "B", "C"]);
  assert.deepEqual(sortQuests(quests, "xp").map((q) => q.title), ["A", "B", "C"]); // equal XP falls back to title
});

test("timeLeft labels and overdue detection", () => {
  const now = new Date("2026-11-27T10:00:00+07:00");
  assert.equal(timeLeft("2026-11-27T12:30:00+07:00", now).label, "2h 30m left");
  assert.equal(timeLeft("2026-11-30", now).label, "2d 21h left"); // date-only deadline = UTC midnight; now is 03:00 UTC
  const past = timeLeft("2026-11-26", now);
  assert.equal(past.overdue, true);
  assert.equal(past.label, "Overdue");
  assert.equal(timeLeft(null, now).label, "No deadline");
});

test("nextDeadline skips done and skipped quests", () => {
  const now = new Date("2026-11-27T10:00:00+07:00");
  const done = completeQuest(createQuest(base({ title: "Done one", deadline: "2026-11-27T11:00:00+07:00" })), now);
  const open = createQuest(base({ title: "Open one", deadline: "2026-11-28" }));
  assert.equal(nextDeadline([done, open], now).title, "Open one");
  assert.equal(nextDeadline([done], now), null);
});

test("calcStreak counts consecutive days, tolerates a missing today", () => {
  assert.equal(calcStreak(["2026-11-27", "2026-11-26", "2026-11-25"], "2026-11-27"), 3);
  assert.equal(calcStreak(["2026-11-26", "2026-11-25"], "2026-11-27"), 2); // nothing today yet
  assert.equal(calcStreak(["2026-11-25"], "2026-11-27"), 0); // gap breaks it
  assert.equal(calcStreak([], "2026-11-27"), 0);
});

test("refreshRecurring revives yesterday's daily quest, keeps today's", () => {
  const yesterday = createQuest(base({ title: "Daily", recurring: "daily" }));
  const doneYesterday = { ...yesterday, status: "done", completedAt: "2026-11-26T09:00:00+07:00" };
  const doneToday = { ...yesterday, status: "done", completedAt: "2026-11-27T09:00:00+07:00" };
  const out = refreshRecurring([doneYesterday, doneToday], "2026-11-27");
  assert.equal(out[0].status, "todo");
  assert.equal(out[0].completedAt, null);
  assert.equal(out[1].status, "done");
});

test("computeStats aggregates XP, pct, streak and overdue", () => {
  const now = new Date("2026-11-27T10:00:00+07:00");
  const quests = [
    { ...completeQuest(createQuest(base({ title: "A", xp: 100 })), now), completedAt: "2026-11-27T09:00:00+07:00" },
    createQuest(base({ title: "B", xp: 50, deadline: "2026-11-26" })), // overdue
    createQuest(base({ title: "C", xp: 50, deadline: "2026-12-01" })),
  ];
  const stats = computeStats(quests, "2026-11-27");
  assert.equal(stats.total, 3);
  assert.equal(stats.done, 1);
  assert.equal(stats.totalXp, 100);
  assert.equal(stats.pct, 33);
  assert.equal(stats.todayDone, 1);
  assert.equal(stats.overdue, 1);
  assert.equal(stats.streak, 1);
});

test("computeStats handles an empty list", () => {
  assert.deepEqual(computeStats([], "2026-11-27"), {
    total: 0,
    done: 0,
    totalXp: 0,
    todayDone: 0,
    pct: 0,
    streak: 0,
    overdue: 0,
  });
});

test("rankForXp steps up every 500 XP", () => {
  assert.equal(rankForXp(0).rank, "Lost Soul");
  assert.equal(rankForXp(499).rank, "Lost Soul");
  assert.equal(rankForXp(500).rank, "Wandering Ghost");
  assert.equal(rankForXp(500).nextAt, 1000);
  assert.equal(rankForXp(99999).rank, "Haunt Legend");
  assert.equal(rankForXp(99999).nextAt, null);
});

test("dayKey returns a local YYYY-MM-DD string", () => {
  assert.match(dayKey(new Date(2026, 10, 27, 9, 30)), /^\d{4}-\d{2}-\d{2}$/);
});
