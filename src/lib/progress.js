const STORAGE_KEY = 'netplus-lab-progress-v1';

const emptyDomainMap = () => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

const defaultState = () => ({
  subnet: { attempted: 0, correct: 0, streak: 0, bestStreak: 0, timedBest: null },
  ports: { attempted: 0, correct: 0, streak: 0, bestStreak: 0 },
  osi: { attempted: 0, correct: 0 },
  quiz: {
    attempted: 0,
    correct: 0,
    byDomain: emptyDomainMap(),
    byDomainCorrect: emptyDomainMap(),
  },
  scenarios: { attempted: 0, correct: 0, completedIds: [] },
  tools: { attempted: 0, correct: 0 },
  mock: { attempts: 0, lastScore: null, bestScore: null, history: [] },
  /** Spaced study / miss bank */
  learn: {
    bank: {},
    /** Most recent graded session for “review what you just missed” */
    lastSession: null,
    masteredCount: 0,
  },
  /** Guided path + habit tracking */
  path: {
    visitedStepIds: [],
    studyDays: [],
    lastActive: null,
    welcomeDismissed: false,
  },
  /** Official topic checklist: id -> 'done' | 'learning' | unset */
  checklist: {},
  /** Multi-step PBQ scenario completion */
  multiStep: { completedIds: [], attempted: 0, correctSteps: 0 },
  /** Optional exam date ISO date (local day) for exam-week plan */
  examDate: null,
  lastVisited: null,
});

/** SRS intervals in days after each successful mastery review */
export const SPACED_INTERVALS_DAYS = [1, 3, 7, 14];

export function spacedDueAt(fromIso, intervalIndex) {
  const days = SPACED_INTERVALS_DAYS[Math.min(intervalIndex, SPACED_INTERVALS_DAYS.length - 1)];
  const d = new Date(fromIso || Date.now());
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function isSpacedDue(item, now = Date.now()) {
  if (!item?.mastered) return false;
  if (!item.dueAt) return true; // legacy mastered items — due for a spaced pass
  return Date.parse(item.dueAt) <= now;
}

export function loadProgress() {
  const base = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    const state = {
      ...base,
      ...parsed,
      subnet: { ...base.subnet, ...parsed.subnet },
      ports: { ...base.ports, ...parsed.ports },
      osi: { ...base.osi, ...parsed.osi },
      quiz: {
        ...base.quiz,
        ...parsed.quiz,
        byDomain: { ...base.quiz.byDomain, ...parsed.quiz?.byDomain },
        byDomainCorrect: {
          ...base.quiz.byDomainCorrect,
          ...parsed.quiz?.byDomainCorrect,
        },
      },
      scenarios: { ...base.scenarios, ...parsed.scenarios },
      tools: { ...base.tools, ...parsed.tools },
      mock: { ...base.mock, ...parsed.mock },
      learn: {
        ...base.learn,
        ...parsed.learn,
        bank: { ...base.learn.bank, ...parsed.learn?.bank },
      },
      path: {
        ...base.path,
        ...parsed.path,
        visitedStepIds: parsed.path?.visitedStepIds || base.path.visitedStepIds,
        studyDays: parsed.path?.studyDays || base.path.studyDays,
      },
      checklist: { ...base.checklist, ...parsed.checklist },
      multiStep: { ...base.multiStep, ...parsed.multiStep },
      examDate: parsed.examDate ?? null,
    };
    // Always run until version 3 (earlier migrations left UTC twins in place)
    if ((state.path.studyDaysVersion || 0) < 3) {
      cleanupStudyDays(state);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* ignore quota */
      }
    }
    return state;
  } catch {
    return base;
  }
}

export function saveProgress(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Local calendar day YYYY-MM-DD (not UTC — avoids false “2 days” overnight). */
export function localDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Friendly local date/time for display. */
export function formatLocalDateTime(isoOrDate) {
  if (!isoOrDate) return null;
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatLocalDay(dayKey) {
  if (!dayKey || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return dayKey;
  const [y, m, d] = dayKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Study-day stats for the coach UI.
 * Count = unique local calendar days with real practice (quiz, drills, etc.).
 */
export function getStudyDayStats(progress) {
  const p = progress || loadProgress();
  const days = [...(p.path?.studyDays || [])].filter(Boolean).sort();
  const lastActive = p.path?.lastActive || p.lastVisited || null;
  return {
    count: days.length,
    days,
    dayLabels: days.map((d) => formatLocalDay(d)),
    lastActive,
    lastActiveLabel: formatLocalDateTime(lastActive),
    lastDayKey: days.length ? days[days.length - 1] : null,
    lastDayLabel: days.length ? formatLocalDay(days[days.length - 1]) : null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'local',
  };
}

/**
 * Stamp a study day from real practice only (not bare navigation).
 * Uses local calendar date.
 */
export function touchStudyActivity(state) {
  const day = localDayKey();
  const prev = state.path || {};
  const days = new Set(prev.studyDays || []);
  // Drop UTC twin of "now" if present (evening local still “tomorrow” in UTC)
  const nowDate = new Date();
  const utcToday = nowDate.toISOString().slice(0, 10);
  if (utcToday !== day) days.delete(utcToday);

  days.add(day);
  const now = nowDate.toISOString();
  state.path = {
    ...prev,
    visitedStepIds: prev.visitedStepIds || [],
    studyDays: [...days].sort().slice(-120),
    lastActive: now,
    studyDaysLocal: true,
    studyDaysVersion: 3,
  };
  state.lastVisited = now;
  return state;
}

export function dismissWelcome() {
  const state = loadProgress();
  const prev = state.path || {};
  // Welcome dismiss is not practice — do not add a study day
  state.path = {
    ...prev,
    visitedStepIds: prev.visitedStepIds || [],
    studyDays: prev.studyDays || [],
    welcomeDismissed: true,
  };
  saveProgress(state);
  return state;
}

/**
 * Remove UTC-inflated study days and normalize to local calendar.
 * Safe to run multiple times; sets studyDaysVersion = 3 when done.
 */
export function cleanupStudyDays(state) {
  const path = state.path || {};
  let days = [...(path.studyDays || [])].filter(Boolean);

  const last = path.lastActive ? new Date(path.lastActive) : null;
  const lastValid = last && !Number.isNaN(last.getTime()) ? last : null;

  if (lastValid) {
    const lastLocal = localDayKey(lastValid);
    const lastUtc = lastValid.toISOString().slice(0, 10);

    // Remove the UTC calendar day of last activity when it differs from local day
    if (lastUtc !== lastLocal) {
      days = days.filter((d) => d !== lastUtc);
    }
    if (!days.includes(lastLocal)) days.push(lastLocal);
  }

  // Also strip "UTC today" if it isn't local today (common twin pair)
  const now = new Date();
  const localToday = localDayKey(now);
  const utcToday = now.toISOString().slice(0, 10);
  if (utcToday !== localToday) {
    days = days.filter((d) => d !== utcToday);
    // Keep local today only if it was already a practice day or lastActive is today local
    if (lastValid && localDayKey(lastValid) === localToday && !days.includes(localToday)) {
      days.push(localToday);
    }
  }

  days = [...new Set(days)].sort().slice(-120);

  // If we still have exactly two consecutive days and last practice was only on the earlier
  // local day, drop the later day when it matches lastActive's UTC date (classic inflation).
  if (days.length === 2 && lastValid) {
    const lastLocal = localDayKey(lastValid);
    const lastUtc = lastValid.toISOString().slice(0, 10);
    const [a, b] = days;
    if (a === lastLocal && b === lastUtc && lastUtc !== lastLocal) {
      days = [a];
    }
  }

  state.path = {
    ...path,
    studyDays: days,
    studyDaysLocal: true,
    studyDaysVersion: 3,
  };
  return state;
}

/** @deprecated use cleanupStudyDays */
export function normalizeStudyDaysToLocal(state) {
  return cleanupStudyDays(state);
}

/**
 * Mark path step(s) or page keys as visited (cheatsheets, soft goals).
 * Does NOT count as a study day — only real practice does.
 */
export function markPathVisit(...stepIds) {
  const state = loadProgress();
  const set = new Set(state.path?.visitedStepIds || []);
  for (const id of stepIds) {
    if (id) set.add(id);
  }
  state.path = {
    ...(state.path || {}),
    visitedStepIds: [...set],
    studyDays: state.path?.studyDays || [],
    lastActive: state.path?.lastActive || null,
    studyDaysLocal: state.path?.studyDaysLocal,
    studyDaysVersion: state.path?.studyDaysVersion,
    welcomeDismissed: state.path?.welcomeDismissed,
  };
  saveProgress(state);
  return state;
}

/** Force recompute study days (for coach “fix count” if needed). */
export function recalculateStudyDays() {
  const state = loadProgress();
  // Allow cleanup to run again
  if (state.path) state.path.studyDaysVersion = 0;
  cleanupStudyDays(state);
  // Ensure last practice local day is present
  if (state.path?.lastActive) {
    const last = new Date(state.path.lastActive);
    if (!Number.isNaN(last.getTime())) {
      const set = new Set(state.path.studyDays || []);
      const utc = last.toISOString().slice(0, 10);
      const local = localDayKey(last);
      if (utc !== local) set.delete(utc);
      set.add(local);
      state.path.studyDays = [...set].sort().slice(-120);
    }
  }
  saveProgress(state);
  return state;
}

export function recordResult(slice, { correct }) {
  const state = loadProgress();
  const s = { ...state[slice] };
  s.attempted = (s.attempted || 0) + 1;
  if (correct) {
    s.correct = (s.correct || 0) + 1;
    if ('streak' in s) {
      s.streak = (s.streak || 0) + 1;
      s.bestStreak = Math.max(s.bestStreak || 0, s.streak);
    }
  } else if ('streak' in s) {
    s.streak = 0;
  }
  state[slice] = s;
  touchStudyActivity(state);
  saveProgress(state);
  return state;
}

export function recordQuizAnswer(domain, correct) {
  const state = loadProgress();
  const q = { ...state.quiz };
  q.attempted += 1;
  if (correct) q.correct += 1;
  q.byDomain = { ...q.byDomain, [domain]: (q.byDomain[domain] || 0) + 1 };
  if (correct) {
    q.byDomainCorrect = {
      ...q.byDomainCorrect,
      [domain]: (q.byDomainCorrect[domain] || 0) + 1,
    };
  }
  state.quiz = q;
  touchStudyActivity(state);
  saveProgress(state);
  return state;
}

/**
 * Record a question-level learning event into the miss bank (+ spaced mastery).
 * @param {{ id: string, domain: number, kind?: string, correct: boolean, prompt?: string }} evt
 */
export function recordLearnEvent(evt) {
  const state = loadProgress();
  const bank = { ...(state.learn?.bank || {}) };
  const now = new Date().toISOString();
  const nowMs = Date.now();
  const prev = bank[evt.id] || {
    id: evt.id,
    domain: evt.domain,
    kind: evt.kind || 'quiz',
    missCount: 0,
    seenCount: 0,
    correctStreak: 0,
    mastered: false,
    masteredAt: null,
    dueAt: null,
    intervalIndex: 0,
    lastMissed: null,
    lastSeen: null,
    prompt: evt.prompt || '',
  };

  const next = {
    ...prev,
    domain: evt.domain,
    kind: evt.kind || prev.kind || 'quiz',
    seenCount: (prev.seenCount || 0) + 1,
    lastSeen: now,
    prompt: evt.prompt || prev.prompt || '',
  };

  const wasSpacedDue = prev.mastered && isSpacedDue(prev, nowMs);

  if (evt.correct) {
    next.correctStreak = (prev.correctStreak || 0) + 1;

    if (wasSpacedDue) {
      // Successful spaced review → longer interval
      const idx = Math.min((prev.intervalIndex || 0) + 1, SPACED_INTERVALS_DAYS.length - 1);
      next.mastered = true;
      next.intervalIndex = idx;
      next.masteredAt = now;
      next.dueAt = spacedDueAt(now, idx);
      next.correctStreak = 0; // reset streak between spaced cycles
    } else if (!prev.mastered && next.missCount > 0 && next.correctStreak >= 2) {
      // First mastery: due again in 1 day
      next.mastered = true;
      next.masteredAt = now;
      next.intervalIndex = 0;
      next.dueAt = spacedDueAt(now, 0);
    }
  } else {
    next.missCount = (prev.missCount || 0) + 1;
    next.correctStreak = 0;
    next.mastered = false;
    next.masteredAt = null;
    next.dueAt = null;
    next.intervalIndex = 0;
    next.lastMissed = now;
  }

  bank[evt.id] = next;

  const masteredCount = Object.values(bank).filter((i) => i.mastered && !isSpacedDue(i, nowMs)).length;
  state.learn = {
    ...(state.learn || {}),
    bank,
    masteredCount,
    lastSession: state.learn?.lastSession ?? null,
  };
  touchStudyActivity(state);
  saveProgress(state);
  return state;
}

/**
 * Save a graded session summary for the study loop CTA.
 * @param {{ source: string, missedIds: string[], correct: number, total: number, domain?: number|string }} session
 */
export function recordStudySession(session) {
  const state = loadProgress();
  state.learn = {
    ...(state.learn || { bank: {} }),
    bank: state.learn?.bank || {},
    masteredCount: state.learn?.masteredCount || 0,
    lastSession: {
      source: session.source,
      missedIds: session.missedIds || [],
      correct: session.correct,
      total: session.total,
      domain: session.domain ?? null,
      at: new Date().toISOString(),
    },
  };
  touchStudyActivity(state);
  saveProgress(state);
  return state;
}

/**
 * Review queue: open misses + spaced-due mastered items.
 * Active misses first, then due spaced reviews.
 */
export function getReviewQueue() {
  const { learn } = loadProgress();
  const now = Date.now();
  const items = Object.values(learn?.bank || {})
    .filter((i) => i.missCount > 0)
    .map((i) => ({
      ...i,
      spacedDue: isSpacedDue(i, now),
      openMiss: !i.mastered,
    }))
    .filter((i) => i.openMiss || i.spacedDue);

  return items.sort((a, b) => {
    // Open misses before spaced reviews
    if (a.openMiss !== b.openMiss) return a.openMiss ? -1 : 1;
    if (b.missCount !== a.missCount) return b.missCount - a.missCount;
    if ((a.correctStreak || 0) !== (b.correctStreak || 0)) {
      return (a.correctStreak || 0) - (b.correctStreak || 0);
    }
    const ta = a.dueAt ? Date.parse(a.dueAt) : a.lastMissed ? Date.parse(a.lastMissed) : 0;
    const tb = b.dueAt ? Date.parse(b.dueAt) : b.lastMissed ? Date.parse(b.lastMissed) : 0;
    return ta - tb;
  });
}

export function getLearnStats() {
  const { learn } = loadProgress();
  const bank = Object.values(learn?.bank || {});
  const now = Date.now();
  const open = bank.filter((i) => i.missCount > 0 && !i.mastered);
  const spacedDue = bank.filter((i) => i.missCount > 0 && isSpacedDue(i, now));
  const masteredResting = bank.filter((i) => i.mastered && !isSpacedDue(i, now));
  const byDomain = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const i of open) {
    if (byDomain[i.domain] != null) byDomain[i.domain] += 1;
  }
  return {
    activeCount: open.length,
    spacedDueCount: spacedDue.length,
    /** Total items that need attention now (open + spaced due) */
    dueCount: open.length + spacedDue.length,
    masteredCount: masteredResting.length,
    totalTracked: bank.filter((i) => i.missCount > 0).length,
    byDomain,
    lastSession: learn?.lastSession || null,
  };
}

export function clearMasteredFromBank() {
  const state = loadProgress();
  const bank = { ...(state.learn?.bank || {}) };
  for (const id of Object.keys(bank)) {
    if (bank[id].mastered) delete bank[id];
  }
  state.learn = {
    ...state.learn,
    bank,
    masteredCount: 0,
  };
  saveProgress(state);
  return state;
}

export function recordScenario(id, correct) {
  const state = loadProgress();
  const s = { ...state.scenarios };
  s.attempted += 1;
  if (correct) s.correct += 1;
  const set = new Set(s.completedIds || []);
  if (correct) set.add(id);
  s.completedIds = [...set];
  state.scenarios = s;
  touchStudyActivity(state);
  saveProgress(state);
  return state;
}

export function recordMockExam({ score, correct, total }) {
  const state = loadProgress();
  const mock = {
    attempts: (state.mock?.attempts || 0) + 1,
    lastScore: score,
    bestScore: Math.max(state.mock?.bestScore ?? 0, score),
    history: [
      ...(state.mock?.history || []),
      { score, correct, total, at: new Date().toISOString() },
    ].slice(-20),
  };
  state.mock = mock;
  touchStudyActivity(state);
  saveProgress(state);
  return state;
}

export function recordSubnetTimed({ correct, total, seconds }) {
  const state = loadProgress();
  const subnet = { ...state.subnet };
  const score = total ? Math.round((correct / total) * 100) : 0;
  const prev = subnet.timedBest;
  if (
    !prev ||
    score > prev.score ||
    (score === prev.score && seconds < prev.seconds)
  ) {
    subnet.timedBest = { score, correct, total, seconds, at: new Date().toISOString() };
  }
  state.subnet = subnet;
  touchStudyActivity(state);
  saveProgress(state);
  return state;
}

export function resetProgress() {
  const fresh = defaultState();
  saveProgress(fresh);
  return fresh;
}

export function accuracy(slice) {
  if (!slice || !slice.attempted) return null;
  return Math.round((slice.correct / slice.attempted) * 100);
}

/* ---- Checklist ---- */

export function setChecklistStatus(topicId, status) {
  const state = loadProgress();
  const checklist = { ...(state.checklist || {}) };
  if (!status) delete checklist[topicId];
  else checklist[topicId] = status; // 'done' | 'learning'
  state.checklist = checklist;
  saveProgress(state);
  return state;
}

export function getChecklistStats() {
  const state = loadProgress();
  const checklist = state.checklist || {};
  let done = 0;
  let learning = 0;
  for (const v of Object.values(checklist)) {
    if (v === 'done') done += 1;
    else if (v === 'learning') learning += 1;
  }
  return { done, learning, checklist };
}

/* ---- Multi-step scenarios ---- */

export function recordMultiStepProgress({ id, correct, finished }) {
  const state = loadProgress();
  const m = { ...(state.multiStep || { completedIds: [], attempted: 0, correctSteps: 0 }) };
  m.attempted = (m.attempted || 0) + 1;
  if (correct) m.correctSteps = (m.correctSteps || 0) + 1;
  if (finished && correct) {
    const set = new Set(m.completedIds || []);
    set.add(id);
    m.completedIds = [...set];
  }
  state.multiStep = m;
  touchStudyActivity(state);
  saveProgress(state);
  return state;
}

/* ---- Exam date ---- */

export function setExamDate(dayKeyOrNull) {
  const state = loadProgress();
  state.examDate = dayKeyOrNull || null;
  saveProgress(state);
  return state;
}

export function getExamCountdown(progress) {
  const p = progress || loadProgress();
  if (!p.examDate) return null;
  const [y, m, d] = p.examDate.split('-').map(Number);
  if (!y || !m || !d) return null;
  const exam = new Date(y, m - 1, d, 12, 0, 0);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  const diffMs = exam.getTime() - start.getTime();
  const days = Math.round(diffMs / (24 * 60 * 60 * 1000));
  return {
    examDate: p.examDate,
    daysUntil: days,
    label: formatLocalDay(p.examDate),
    inExamWeek: days >= 0 && days <= 7,
    past: days < 0,
  };
}

/* ---- Export / import ---- */

export function exportProgressJson() {
  const state = loadProgress();
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: 'netplus-lab',
      progress: state,
    },
    null,
    2,
  );
}

export function downloadProgressBackup() {
  const json = exportProgressJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const day = localDayKey();
  a.href = url;
  a.download = `netplus-lab-backup-${day}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Import a backup. Merges carefully: full replace of progress payload.
 * @returns {{ ok: boolean, error?: string }}
 */
export function importProgressJson(text) {
  try {
    const data = JSON.parse(text);
    const payload = data.progress || data;
    if (!payload || typeof payload !== 'object') {
      return { ok: false, error: 'Invalid backup file (no progress object).' };
    }
    // Minimal shape check
    if (!payload.quiz && !payload.learn && !payload.path) {
      return { ok: false, error: 'File does not look like a NetPlus Lab backup.' };
    }
    const base = defaultState();
    const merged = {
      ...base,
      ...payload,
      quiz: { ...base.quiz, ...payload.quiz },
      learn: { ...base.learn, ...payload.learn, bank: { ...payload.learn?.bank } },
      path: { ...base.path, ...payload.path },
      checklist: { ...payload.checklist },
      multiStep: { ...base.multiStep, ...payload.multiStep },
      examDate: payload.examDate ?? null,
    };
    if ((merged.path.studyDaysVersion || 0) < 3) cleanupStudyDays(merged);
    saveProgress(merged);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message || 'Could not parse JSON.' };
  }
}
