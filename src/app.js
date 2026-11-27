// HauntQuest UI — DOM wiring + localStorage persistence.
// Pure logic lives in logic.js (unit-tested); this file only touches the DOM.
import {
  createQuest,
  validateQuest,
  filterQuests,
  sortQuests,
  timeLeft,
  nextDeadline,
  computeStats,
  rankForXp,
  refreshRecurring,
  completeQuest,
  dayKey,
} from "./logic.js";
import { SEED_QUESTS } from "./seed.js";

const STORAGE_KEY = "hauntquest.v1";
const $ = (sel) => document.querySelector(sel);

const state = {
  quests: load(),
  filters: { status: "all", chain: "all", type: "all", query: "" },
  sort: "deadline",
  editingId: null,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_QUESTS.map((s) => createQuest(s));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED_QUESTS.map((s) => createQuest(s));
    return refreshRecurring(parsed);
  } catch {
    return SEED_QUESTS.map((s) => createQuest(s));
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.quests));
}

function esc(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderStats() {
  const stats = computeStats(state.quests);
  const rank = rankForXp(stats.totalXp);
  $("#stats").innerHTML = `
    <div class="stat"><div class="num">${stats.totalXp}</div><div class="lbl">Total XP</div>
      <div class="sub">${esc(rank.rank)} · Lv ${rank.level}${rank.nextAt ? ` · ${rank.progress}/${500} to next rank` : " · max rank"}</div></div>
    <div class="stat"><div class="num">${stats.streak} 🔥</div><div class="lbl">Day streak</div>
      <div class="sub">days with a completed quest</div></div>
    <div class="stat"><div class="num">${stats.done}/${stats.total}</div><div class="lbl">Quests done</div>
      <div class="sub">${stats.todayDone} completed today</div></div>
    <div class="stat"><div class="num">${stats.overdue}</div><div class="lbl">Overdue</div>
      <div class="sub">${stats.pct}% complete overall</div></div>
    <div class="stat wide"><div class="lbl">Haunt-o-meter — ${stats.pct}% complete</div>
      <div class="progress"><span style="width:${stats.pct}%"></span></div>
      <div class="sub">${stats.done} of ${stats.total} quests laid to rest.</div></div>`;
}

function renderNext() {
  const next = nextDeadline(state.quests);
  const el = $("#nextDeadline");
  if (!next) {
    el.innerHTML = `🎃 <strong>No deadlines looming.</strong> The graveyard is quiet… for now.`;
    return;
  }
  const tl = timeLeft(next.deadline);
  el.innerHTML = `⏳ Next deadline: <strong>${esc(next.title)}</strong> — ${esc(tl.label)}${tl.overdue ? " (overdue!)" : ""}`;
}

function questCard(q) {
  const tl = timeLeft(q.deadline);
  const overdue = tl.overdue && q.status !== "done" && q.status !== "skipped";
  const link = q.url ? `<a href="${esc(q.url)}" target="_blank" rel="noopener">Open ↗</a>` : "";
  return `<li class="quest ${q.status === "done" ? "done" : ""} ${overdue ? "overdue" : ""}" data-id="${esc(q.id)}">
    <div class="quest-head">
      <h3 class="quest-title">${esc(q.title)}</h3>
      <span class="chip xp">+${q.xp} XP</span>
    </div>
    <div class="quest-meta">
      <span>${esc(q.project || "—")}</span>
      <span class="chip">${esc(q.chain)}</span>
      <span class="chip">${esc(q.type)}</span>
      ${q.recurring === "daily" ? `<span class="chip">🔁 daily</span>` : ""}
      <span class="chip deadline ${overdue ? "overdue" : ""}">⏰ ${esc(tl.label)}</span>
      <span class="chip status-${q.status}">${esc(q.status)}</span>
      ${q.reward ? `<span>🎁 ${esc(q.reward)}</span>` : ""}
      ${link}
    </div>
    ${q.notes ? `<p class="quest-notes">${esc(q.notes)}</p>` : ""}
    <div class="quest-actions">
      ${q.status !== "done" ? `<button class="btn small primary" data-action="done">✓ Complete</button>` : ""}
      ${q.status === "todo" ? `<button class="btn small" data-action="doing">▶ Start</button>` : ""}
      ${q.status !== "todo" ? `<button class="btn small" data-action="reopen">↺ Reopen</button>` : ""}
      <button class="btn small" data-action="edit">✎ Edit</button>
      <button class="btn small danger" data-action="delete">🗑 Delete</button>
    </div>
  </li>`;
}

function renderList() {
  const filtered = sortQuests(filterQuests(state.quests, state.filters), state.sort);
  $("#questList").innerHTML = filtered.map(questCard).join("");
  $("#emptyState").hidden = filtered.length > 0;
}

function renderAll() {
  renderStats();
  renderNext();
  renderList();
}

// --- dialog (add / edit) -------------------------------------------------
const dialog = $("#questDialog");
const form = $("#questForm");

function openDialog(quest = null) {
  state.editingId = quest ? quest.id : null;
  $("#dialogTitle").textContent = quest ? "Edit quest" : "Add quest";
  $("#formError").hidden = true;
  form.reset();
  if (quest) {
    form.title.value = quest.title;
    form.project.value = quest.project || "";
    form.chain.value = quest.chain;
    form.type.value = quest.type;
    form.xp.value = quest.xp;
    form.reward.value = quest.reward || "";
    form.deadline.value = quest.deadline ? toLocalInput(quest.deadline) : "";
    form.url.value = quest.url || "";
    form.notes.value = quest.notes || "";
    form.recurring.checked = quest.recurring === "daily";
  }
  dialog.showModal();
}

function toLocalInput(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    title: form.title.value,
    project: form.project.value,
    chain: form.chain.value,
    type: form.type.value,
    xp: form.xp.value === "" ? undefined : Number(form.xp.value),
    reward: form.reward.value,
    deadline: form.deadline.value ? new Date(form.deadline.value).toISOString() : null,
    url: form.url.value,
    notes: form.notes.value,
    recurring: form.recurring.checked ? "daily" : "once",
  };
  const errors = validateQuest(data);
  if (errors.length > 0) {
    const err = $("#formError");
    err.textContent = errors.join(" · ");
    err.hidden = false;
    return;
  }
  try {
    if (state.editingId) {
      const idx = state.quests.findIndex((q) => q.id === state.editingId);
      const old = state.quests[idx];
      const updated = createQuest({ ...data, id: old.id });
      state.quests[idx] = { ...updated, status: old.status, createdAt: old.createdAt, completedAt: old.completedAt };
    } else {
      state.quests.push(createQuest(data));
    }
    save();
    dialog.close();
    renderAll();
  } catch (err) {
    const el = $("#formError");
    el.textContent = err.message;
    el.hidden = false;
  }
});

$("#cancelDialogBtn").addEventListener("click", () => dialog.close());
$("#addQuestBtn").addEventListener("click", () => openDialog());

// --- list actions (event delegation) --------------------------------------
$("#questList").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const li = e.target.closest(".quest");
  const id = li?.dataset.id;
  const idx = state.quests.findIndex((q) => q.id === id);
  if (idx === -1) return;
  const action = btn.dataset.action;
  if (action === "done") {
    state.quests[idx] = completeQuest(state.quests[idx]);
  } else if (action === "doing") {
    state.quests[idx] = { ...state.quests[idx], status: "doing" };
  } else if (action === "reopen") {
    state.quests[idx] = { ...state.quests[idx], status: "todo", completedAt: null };
  } else if (action === "edit") {
    openDialog(state.quests[idx]);
    return;
  } else if (action === "delete") {
    if (!confirm(`Delete "${state.quests[idx].title}"?`)) return;
    state.quests.splice(idx, 1);
  }
  save();
  renderAll();
});

// --- filters / sort ---------------------------------------------------------
$("#searchInput").addEventListener("input", (e) => { state.filters.query = e.target.value; renderList(); });
$("#statusFilter").addEventListener("change", (e) => { state.filters.status = e.target.value; renderList(); });
$("#chainFilter").addEventListener("change", (e) => { state.filters.chain = e.target.value; renderList(); });
$("#typeFilter").addEventListener("change", (e) => { state.filters.type = e.target.value; renderList(); });
$("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderList(); });

// --- export / import / reset -------------------------------------------------
$("#exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state.quests, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `hauntquest-${dayKey()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});

$("#importBtn").addEventListener("click", () => $("#importFile").click());
$("#importFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!Array.isArray(parsed)) throw new Error("file must contain a JSON array of quests");
    const imported = parsed.map((raw) => {
      const errors = validateQuest(raw);
      if (errors.length > 0) throw new Error(`invalid quest "${raw.title || "?"}": ${errors.join("; ")}`);
      return createQuest(raw);
    });
    state.quests = imported;
    save();
    renderAll();
  } catch (err) {
    alert(`Import failed: ${err.message}`);
  }
  e.target.value = "";
});

$("#resetBtn").addEventListener("click", () => {
  if (!confirm("Reset all quests to the built-in seed list? Your changes will be lost.")) return;
  state.quests = SEED_QUESTS.map((s) => createQuest(s));
  save();
  renderAll();
});

// Refresh daily recurring quests once a minute (cheap; covers midnight rollover).
setInterval(() => {
  const refreshed = refreshRecurring(state.quests);
  if (JSON.stringify(refreshed) !== JSON.stringify(state.quests)) {
    state.quests = refreshed;
    save();
    renderAll();
  }
}, 60000);

renderAll();
