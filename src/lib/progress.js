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
  lastVisited: null,
});

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
    };
    // Migrate UTC day keys → local once (see normalizeStudyDaysToLocal)
    if (!state.path.studyDaysLocal && (state.path.studyDays?.length || state.path.lastActive)) {
      normalizeStudyDaysToLocal(state);
      // Persist migration quietly so the count stabilizes
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
 * Count = unique local calendar days with any practice activity.
 */
export function getStudyDayStats(progress) {
  const p = progress || loadProgress();
  const days = [...(p.path?.studyDays || [])].filter(Boolean).sort();
  const lastActive = p.path?.lastActive || p.lastVisited || null;
  return {
    count: days.length,
    days,
    lastActive,
    lastActiveLabel: formatLocalDateTime(lastActive),
    lastDayKey: days.length ? days[days.length - 1] : null,
    lastDayLabel: days.length ? formatLocalDay(days[days.length - 1]) : null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'local',
  };
}

/** Stamp a study day + last active (habit tracking). Uses local calendar date. */
export function touchStudyActivity(state) {
  const day = localDayKey();
  const prev = state.path || {};
  const days = new Set(prev.studyDays || []);
  days.add(day);
  const now = new Date().toISOString();
  state.path = {
    ...prev,
    visitedStepIds: prev.visitedStepIds || [],
    studyDays: [...days].sort().slice(-120),
    lastActive: now,
    // Mark that days are local (for any future migrations)
    studyDaysLocal: true,
  };
  state.lastVisited = now;
  return state;
}

export function dismissWelcome() {
  const state = loadProgress();
  const prev = state.path || {};
  state.path = {
    ...prev,
    visitedStepIds: prev.visitedStepIds || [],
    studyDays: prev.studyDays || [],
    welcomeDismissed: true,
    lastActive: new Date().toISOString(),
  };
  saveProgress(state);
  return state;
}

/**
 * One-time cleanup for days stamped with UTC (toISOString).
 * Evening US sessions often got “tomorrow” as an extra study day.
 * Maps each stored key: if it equals the UTC day of lastActive but not the local day,
 * replace with the local day. Ensures lastActive’s local day is present.
 */
export function normalizeStudyDaysToLocal(state) {
  const path = state.path || {};
  if (path.studyDaysLocal) return state;

  const raw = [...(path.studyDays || [])];
  const last = path.lastActive ? new Date(path.lastActive) : null;
  const lastValid = last && !Number.isNaN(last.getTime()) ? last : null;
  const lastLocal = lastValid ? localDayKey(lastValid) : null;
  const lastUtc = lastValid ? lastValid.toISOString().slice(0, 10) : null;

  const set = new Set();
  for (const key of raw) {
    if (!key) continue;
    // Drop pure UTC twin of last activity when it differs from local calendar day
    if (lastUtc && lastLocal && key === lastUtc && key !== lastLocal) {
      set.add(lastLocal);
      continue;
    }
    set.add(key);
  }
  if (lastLocal) set.add(lastLocal);

  // Do not force “today” unless there is already activity — avoids +1 on mere page load
  state.path = {
    ...path,
    studyDays: [...set].sort().slice(-120),
    studyDaysLocal: true,
  };
  return state;
}

/** Mark path step(s) or page keys as visited (for soft goals like cheatsheets). */
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
  };
  touchStudyActivity(state);
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
 * Record a question-level learning event into the miss bank.
 * @param {{ id: string, domain: number, kind?: string, correct: boolean, prompt?: string }} evt
 */
export function recordLearnEvent(evt) {
  const state = loadProgress();
  const bank = { ...(state.learn?.bank || {}) };
  const now = new Date().toISOString();
  const prev = bank[evt.id] || {
    id: evt.id,
    domain: evt.domain,
    kind: evt.kind || 'quiz',
    missCount: 0,
    seenCount: 0,
    correctStreak: 0,
    mastered: false,
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

  if (evt.correct) {
    next.correctStreak = (prev.correctStreak || 0) + 1;
    // Two correct in a row after being in the bank masters the item
    if (next.missCount > 0 && next.correctStreak >= 2) {
      next.mastered = true;
    }
  } else {
    next.missCount = (prev.missCount || 0) + 1;
    next.correctStreak = 0;
    next.mastered = false;
    next.lastMissed = now;
  }

  bank[evt.id] = next;

  const masteredCount = Object.values(bank).filter((i) => i.mastered).length;
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

/** Active (not mastered) misses, prioritized for review. */
export function getReviewQueue() {
  const { learn } = loadProgress();
  const items = Object.values(learn?.bank || {}).filter(
    (i) => i.missCount > 0 && !i.mastered,
  );

  // Priority: more misses first, then older lastMissed (spaced), then lower correct streak
  return items.sort((a, b) => {
    if (b.missCount !== a.missCount) return b.missCount - a.missCount;
    if ((a.correctStreak || 0) !== (b.correctStreak || 0)) {
      return (a.correctStreak || 0) - (b.correctStreak || 0);
    }
    const ta = a.lastMissed ? Date.parse(a.lastMissed) : 0;
    const tb = b.lastMissed ? Date.parse(b.lastMissed) : 0;
    return ta - tb;
  });
}

export function getLearnStats() {
  const { learn } = loadProgress();
  const bank = Object.values(learn?.bank || {});
  const active = bank.filter((i) => i.missCount > 0 && !i.mastered);
  const mastered = bank.filter((i) => i.mastered);
  const byDomain = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const i of active) {
    if (byDomain[i.domain] != null) byDomain[i.domain] += 1;
  }
  return {
    activeCount: active.length,
    masteredCount: mastered.length,
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
