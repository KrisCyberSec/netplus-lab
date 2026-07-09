import { QUESTIONS } from '../data/questions.js';
import { OBJECTIVE_MAP, allTopicIds } from '../data/objectives.js';

/** Count quiz items per objective id. */
export function countByObjective() {
  const counts = {};
  for (const id of allTopicIds()) counts[id] = 0;
  for (const q of QUESTIONS) {
    const id = q.objective;
    if (!id) continue;
    counts[id] = (counts[id] || 0) + 1;
  }
  return counts;
}

export function coverageRows() {
  const counts = countByObjective();
  return OBJECTIVE_MAP.map((domain) => ({
    ...domain,
    topics: domain.topics.map((t) => {
      const n = counts[t.id] || 0;
      let status = 'thin';
      if (n >= 3) status = 'strong';
      else if (n >= 1) status = 'partial';
      return { ...t, count: n, status };
    }),
  }));
}

export function coverageSummary() {
  const rows = coverageRows();
  let strong = 0;
  let partial = 0;
  let thin = 0;
  let totalTopics = 0;
  for (const d of rows) {
    for (const t of d.topics) {
      totalTopics += 1;
      if (t.status === 'strong') strong += 1;
      else if (t.status === 'partial') partial += 1;
      else thin += 1;
    }
  }
  return {
    totalTopics,
    strong,
    partial,
    thin,
    questionTotal: QUESTIONS.length,
    rows,
  };
}
