const STORAGE_KEY = 'netplus-lab-progress-v1';

const defaultState = () => ({
  subnet: { attempted: 0, correct: 0, streak: 0, bestStreak: 0 },
  ports: { attempted: 0, correct: 0, streak: 0, bestStreak: 0 },
  osi: { attempted: 0, correct: 0 },
  quiz: { attempted: 0, correct: 0, byDomain: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, byDomainCorrect: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  scenarios: { attempted: 0, correct: 0, completedIds: [] },
  tools: { attempted: 0, correct: 0 },
  lastVisited: null,
});

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export function saveProgress(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  state.lastVisited = new Date().toISOString();
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
  state.lastVisited = new Date().toISOString();
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
  state.lastVisited = new Date().toISOString();
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
