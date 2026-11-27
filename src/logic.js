// HauntQuest — pure quest logic (no DOM, no storage).
// Kept dependency-free so it can be unit-tested with plain node:test
// and reused by the browser UI via ES-module import.

export const QUEST_TYPES = ["airdrop", "mint", "quest", "bounty", "check-in", "claim"];
export const QUEST_CHAINS = ["BSC", "Solana", "Ethereum", "Base", "TON", "Bitcoin", "Any"];
export const QUEST_STATUSES = ["todo", "doing", "done", "skipped"];

export const XP_BY_TYPE = {
  "check-in": 20,
  quest: 50,
  claim: 40,
  airdrop: 100,
  mint: 80,
  bounty: 150,
};

let idCounter = 0;

/** Create a quest object with defaults. Throws on invalid input. */
export function createQuest(input) {
  const errors = validateQuest(input);
  if (errors.length > 0) throw new Error(errors.join("; "));
  return {
    id: input.id || `q-${Date.now().toString(36)}-${(idCounter++).toString(36)}`,
    title: input.title.trim(),
    project: (input.project || "").trim(),
    chain: input.chain || "Any",
    type: input.type || "quest",
    reward: (input.reward || "").trim(),
    xp: typeof input.xp === "number" && input.xp > 0 ? Math.floor(input.xp) : XP_BY_TYPE[input.type || "quest"],
    deadline: input.deadline || null, // ISO date "YYYY-MM-DD" or datetime
    url: (input.url || "").trim(),
    notes: (input.notes || "").trim(),
    recurring: input.recurring === "daily" ? "daily" : "once",
    status: "todo",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

/** Validate raw quest input. Returns an array of error strings (empty = valid). */
export function validateQuest(input) {
  const errors = [];
  if (!input || typeof input !== "object") return ["quest must be an object"];
  if (!input.title || !String(input.title).trim()) errors.push("title is required");
  if (input.title && String(input.title).length > 120) errors.push("title must be 120 chars or fewer");
  if (input.type && !QUEST_TYPES.includes(input.type)) errors.push(`unknown type: ${input.type}`);
  if (input.chain && !QUEST_CHAINS.includes(input.chain)) errors.push(`unknown chain: ${input.chain}`);
  if (input.xp !== undefined && input.xp !== null && (typeof input.xp !== "number" || input.xp < 0 || input.xp > 100000)) {
    errors.push("xp must be a number between 0 and 100000");
  }
  if (input.deadline) {
    const d = new Date(input.deadline);
    if (Number.isNaN(d.getTime())) errors.push(`invalid deadline: ${input.deadline}`);
  }
  if (input.url && !/^https?:\/\//i.test(String(input.url).trim())) errors.push("url must start with http:// or https://");
  if (input.recurring && !["once", "daily"].includes(input.recurring)) errors.push("recurring must be 'once' or 'daily'");
  return errors;
}

/** Day key "YYYY-MM-DD" in the local timezone. */
export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Daily recurring quests completed on a previous day return to "todo".
 * Returns a new array (does not mutate the input).
 */
export function refreshRecurring(quests, today = dayKey()) {
  return quests.map((q) => {
    if (q.recurring === "daily" && q.status === "done" && q.completedAt) {
      if (dayKey(new Date(q.completedAt)) !== today) {
        return { ...q, status: "todo", completedAt: null };
      }
    }
    return q;
  });
}

/** Mark a quest done. Returns a new quest object. */
export function completeQuest(quest, now = new Date()) {
  if (quest.status === "done") return quest;
  return { ...quest, status: "done", completedAt: now.toISOString() };
}

/** Filter quests. All filter fields are optional. */
export function filterQuests(quests, { status = "all", chain = "all", type = "all", query = "" } = {}) {
  const q = query.trim().toLowerCase();
  return quests.filter((quest) => {
    if (status !== "all" && quest.status !== status) return false;
    if (chain !== "all" && quest.chain !== chain) return false;
    if (type !== "all" && quest.type !== type) return false;
    if (q) {
      const hay = `${quest.title} ${quest.project} ${quest.reward} ${quest.notes}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/** Sort quests: nearest deadline first (no deadline last), then XP desc, then title. */
export function sortQuests(quests, sortKey = "deadline") {
  const arr = [...quests];
  if (sortKey === "xp") return arr.sort((a, b) => b.xp - a.xp || a.title.localeCompare(b.title));
  if (sortKey === "title") return arr.sort((a, b) => a.title.localeCompare(b.title));
  return arr.sort((a, b) => {
    const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    if (da !== db) return da - db;
    return b.xp - a.xp;
  });
}

/**
 * Time left until a deadline. Returns { overdue, totalMs, days, hours, minutes, label }.
 * `now` defaults to the current time; pass a Date for tests.
 */
export function timeLeft(deadline, now = new Date()) {
  if (!deadline) return { overdue: false, totalMs: null, days: null, hours: null, minutes: null, label: "No deadline" };
  const diff = new Date(deadline).getTime() - now.getTime();
  if (diff <= 0) return { overdue: true, totalMs: diff, days: 0, hours: 0, minutes: 0, label: "Overdue" };
  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  const label = days > 0 ? `${days}d ${hours}h left` : hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`;
  return { overdue: false, totalMs: diff, days, hours, minutes: mins, label };
}

/** The nearest upcoming (non-overdue, non-done) deadline, or null. */
export function nextDeadline(quests, now = new Date()) {
  const open = quests.filter((q) => q.status !== "done" && q.status !== "skipped" && q.deadline);
  if (open.length === 0) return null;
  const sorted = [...open].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  return sorted[0];
}

/**
 * Streak: consecutive days (ending today, or yesterday if nothing done today yet)
 * on which at least one quest was completed. `completionDayKeys` is an array of
 * "YYYY-MM-DD" strings. `today` is a "YYYY-MM-DD" string.
 */
export function calcStreak(completionDayKeys, today = dayKey()) {
  const days = new Set(completionDayKeys);
  if (days.size === 0) return 0;
  // Walk back from today; if today has no completion, start from yesterday.
  let cursor = new Date(`${today}T12:00:00`);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Aggregate stats for the dashboard. */
export function computeStats(quests, today = dayKey()) {
  const done = quests.filter((q) => q.status === "done");
  const totalXp = done.reduce((sum, q) => sum + (q.xp || 0), 0);
  const total = quests.length;
  const todayDone = done.filter((q) => q.completedAt && dayKey(new Date(q.completedAt)) === today).length;
  const completionDayKeys = done.filter((q) => q.completedAt).map((q) => dayKey(new Date(q.completedAt)));
  const overdue = quests.filter(
    (q) => q.status !== "done" && q.status !== "skipped" && q.deadline && new Date(q.deadline).getTime() < Date.now(),
  ).length;
  return {
    total,
    done: done.length,
    totalXp,
    todayDone,
    pct: total === 0 ? 0 : Math.round((done.length / total) * 100),
    streak: calcStreak(completionDayKeys, today),
    overdue,
  };
}

/** XP level: every 500 XP = one haunted rank up. */
export function rankForXp(totalXp) {
  const ranks = ["Lost Soul", "Wandering Ghost", "Pumpkin Keeper", "Crypt Master", "Haunt Legend"];
  const idx = Math.min(Math.floor(totalXp / 500), ranks.length - 1);
  const nextAt = idx >= ranks.length - 1 ? null : (idx + 1) * 500;
  return { rank: ranks[idx], level: idx + 1, nextAt, progress: nextAt ? totalXp - idx * 500 : 500 };
}
