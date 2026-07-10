/**
 * 7-day exam-week plan for Network+ with NetPlus Lab.
 * Days are relative to exam day (day 0 = exam day).
 */
export const EXAM_WEEK_PLAN = [
  {
    offset: 7,
    title: 'Day −7 · Baseline',
    tasks: [
      'Take a timed Standard mock (40 Q)',
      'Review all misses until the bank is under control',
      'Note weakest domain from mock results',
    ],
    href: '/mock',
  },
  {
    offset: 6,
    title: 'Day −6 · Weak domain deep dive',
    tasks: [
      'Domain quiz on your weakest domain (15–20 Q)',
      'Clear new misses in Review',
      'Skim the matching cheatsheet section',
    ],
    href: '/quiz',
  },
  {
    offset: 5,
    title: 'Day −5 · Subnet + ports',
    tasks: [
      'Subnet timed challenge (aim ≥70%)',
      'Ports lightning round until streak feels automatic',
      'Spaced review if the coach shows due items',
    ],
    href: '/subnet',
  },
  {
    offset: 4,
    title: 'Day −4 · Implementation & security',
    tasks: [
      'D2 + D4 practice quizzes',
      'One multi-step PBQ scenario set',
      'Tick objectives checklist for topics you solidly know',
    ],
    href: '/pbq',
  },
  {
    offset: 3,
    title: 'Day −3 · Ops + troubleshooting',
    tasks: [
      'D3 + D5 quizzes',
      'Tool picker + fault scenarios',
      'Another mock if energy allows — or half mock + review',
    ],
    href: '/scenarios',
  },
  {
    offset: 2,
    title: 'Day −2 · Full mock + review',
    tasks: [
      'Full timed mock (40 or 60)',
      'Review misses same day (do not skip)',
      'Light cheatsheet skim only — no new rabbit holes',
    ],
    href: '/mock',
  },
  {
    offset: 1,
    title: 'Day −1 · Light & confident',
    tasks: [
      'Spaced review due items only',
      'Ports + subnet warm-up (short)',
      'Sleep. Logistics: ID, arrival time, test center rules',
    ],
    href: '/review',
  },
  {
    offset: 0,
    title: 'Exam day',
    tasks: [
      'Light ports flash if nerves need a win — then stop',
      'Trust methodology on PBQs: read fully, eliminate, flag',
      'You prepared. Execute calmly.',
    ],
    href: '/',
  },
];

export function planForDaysUntil(daysUntil) {
  if (daysUntil == null || daysUntil < 0) return EXAM_WEEK_PLAN;
  if (daysUntil > 7) {
    return EXAM_WEEK_PLAN.filter((d) => d.offset === 7);
  }
  return EXAM_WEEK_PLAN.filter((d) => d.offset <= daysUntil);
}
