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
    return {
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
  } catch {
    return base;
  }
}

export function saveProgress(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Stamp a study day + last active (habit tracking). */
export function touchStudyActivity(state) {
  const day = todayKey();
  const days = new Set(state.path?.studyDays || []);
  days.add(day);
  state.path = {
    visitedStepIds: state.path?.visitedStepIds || [],
    studyDays: [...days].sort().slice(-120),
    lastActive: new Date().toISOString(),
  };
  state.lastVisited = state.path.lastActive;
  return state;
}

export function dismissWelcome() {
  const state = loadProgress();
  state.path = {
    ...(state.path || {}),
    visitedStepIds: state.path?.visitedStepIds || [],
    studyDays: state.path?.studyDays || [],
    welcomeDismissed: true,
    lastActive: new Date().toISOString(),
  };
  saveProgress(state);
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
