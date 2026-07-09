import { QUESTIONS } from '../data/questions';
import { SCENARIOS } from '../data/scenarios';
import { getReviewQueue } from './progress';
import { shuffle } from './shuffle';

export function getQuestionById(id) {
  return QUESTIONS.find((q) => q.id === id) || null;
}

export function getScenarioById(id) {
  return SCENARIOS.find((s) => s.id === id) || null;
}

/**
 * Build a review set from the miss bank (quiz questions only for MCQ review).
 * Falls back to empty if nothing due.
 */
export function buildMissReviewSet(limit = 15) {
  const queue = getReviewQueue().filter((i) => i.kind !== 'scenario');
  const items = [];
  for (const entry of queue) {
    const q = getQuestionById(entry.id);
    if (q) items.push({ ...q, _learn: entry });
    if (items.length >= limit) break;
  }
  return shuffle(items);
}

/**
 * Last session misses as questions.
 */
export function buildSessionMissSet(missedIds) {
  const items = [];
  for (const id of missedIds || []) {
    const q = getQuestionById(id);
    if (q) items.push(q);
  }
  return shuffle(items);
}

export function prepareChoices(q) {
  return shuffle(q.choices.map((text, i) => ({ text, i }))).map((c) => ({
    text: c.text,
    originalIndex: c.i,
  }));
}
