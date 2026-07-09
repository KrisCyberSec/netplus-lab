import { DOMAINS } from '../data/domains';
import { loadProgress } from './progress';

/**
 * Rank domains by quiz accuracy (lowest first). Needs a few attempts to count.
 */
export function getWeakDomains(minAttempts = 3) {
  const { quiz } = loadProgress();
  const rows = DOMAINS.map((d) => {
    const attempted = quiz.byDomain?.[d.id] || 0;
    const correct = quiz.byDomainCorrect?.[d.id] || 0;
    const acc = attempted ? Math.round((correct / attempted) * 100) : null;
    return { ...d, attempted, correct, accuracy: acc };
  });

  const ranked = rows
    .filter((r) => r.attempted >= minAttempts)
    .sort((a, b) => (a.accuracy ?? 100) - (b.accuracy ?? 100));

  return { ranked, all: rows };
}
