/**
 * Guided Network+ learning path.
 * Completion is evaluated from saved progress (see lib/coach.js).
 */
export const STUDY_PHASES = [
  {
    id: 'foundations',
    title: 'Phase 1 · Foundations',
    goal: 'Get fluent in the models and numbers every question assumes.',
    steps: [
      {
        id: 'osi',
        title: 'OSI model map',
        why: 'Layer questions show up everywhere. Know PDUs and device fit.',
        href: '/osi',
        estimate: '10–15 min',
        skill: 'concepts',
        goalLabel: '5+ layer quizzes, ≥70% accuracy',
      },
      {
        id: 'ports',
        title: 'Ports lightning round',
        why: 'Port/protocol recall is free points if automatic.',
        href: '/ports',
        estimate: '10 min',
        skill: 'concepts',
        goalLabel: '20+ attempts, ≥75% accuracy',
      },
      {
        id: 'subnet',
        title: 'Subnetting practice',
        why: 'Highest-leverage skill. Slow subnetting costs the whole exam.',
        href: '/subnet',
        estimate: '15–20 min',
        skill: 'subnet',
        goalLabel: '15+ problems, ≥70% accuracy',
      },
      {
        id: 'sheets-ports',
        title: 'Skim ports + subnet cheatsheets',
        why: 'Lock the tables before you rely on memory under stress.',
        href: '/sheets',
        estimate: '5 min',
        skill: 'reference',
        goalLabel: 'Open cheatsheets once',
      },
    ],
  },
  {
    id: 'domain-drills',
    title: 'Phase 2 · Domain building',
    goal: 'Build accuracy in each exam domain before mixing them.',
    steps: [
      {
        id: 'quiz-d1',
        title: 'Domain 1 quiz · Concepts',
        why: 'OSI, addressing, appliances, cloud basics (23% of exam).',
        href: '/quiz?domain=1',
        estimate: '15 min',
        skill: 'domain',
        domain: 1,
        goalLabel: '15+ D1 answers, ≥75%',
      },
      {
        id: 'quiz-d2',
        title: 'Domain 2 quiz · Implementation',
        why: 'Routing, VLANs, wireless, physical install (20%).',
        href: '/quiz?domain=2',
        estimate: '15 min',
        skill: 'domain',
        domain: 2,
        goalLabel: '12+ D2 answers, ≥70%',
      },
      {
        id: 'quiz-d3',
        title: 'Domain 3 quiz · Operations',
        why: 'Monitoring, docs, DR, change control (19%).',
        href: '/quiz?domain=3',
        estimate: '12 min',
        skill: 'domain',
        domain: 3,
        goalLabel: '10+ D3 answers, ≥70%',
      },
      {
        id: 'quiz-d4',
        title: 'Domain 4 quiz · Security',
        why: 'Attacks, ACLs, 802.1X, hardening (14%).',
        href: '/quiz?domain=4',
        estimate: '12 min',
        skill: 'domain',
        domain: 4,
        goalLabel: '10+ D4 answers, ≥70%',
      },
      {
        id: 'quiz-d5',
        title: 'Domain 5 quiz · Troubleshooting',
        why: 'Heaviest domain (24%). Methodology + classic faults.',
        href: '/quiz?domain=5',
        estimate: '15 min',
        skill: 'domain',
        domain: 5,
        goalLabel: '15+ D5 answers, ≥70%',
      },
    ],
  },
  {
    id: 'applied',
    title: 'Phase 3 · Applied skills',
    goal: 'Practice choosing tools and diagnosing scenarios, not just definitions.',
    steps: [
      {
        id: 'tools',
        title: 'Tool picker',
        why: 'Exam loves “which tool?” questions.',
        href: '/tools',
        estimate: '10 min',
        skill: 'tools',
        goalLabel: '10+ attempts, ≥70%',
      },
      {
        id: 'scenarios',
        title: 'Fault scenarios',
        why: 'Read symptoms → pick the cause. Closest thing to PBQ thinking.',
        href: '/scenarios',
        estimate: '15 min',
        skill: 'scenarios',
        goalLabel: 'Clear 8+ scenarios',
      },
      {
        id: 'subnet-timed',
        title: 'Subnet timed challenge',
        why: 'Prove you can subnet under time pressure.',
        href: '/subnet',
        estimate: '5–10 min',
        skill: 'subnet',
        goalLabel: 'Finish a timed run ≥70%',
      },
    ],
  },
  {
    id: 'integrate',
    title: 'Phase 4 · Integrate & examine',
    goal: 'Mix domains, close the miss bank, then measure with mocks.',
    steps: [
      {
        id: 'mixed-quiz',
        title: 'Mixed practice quiz (20 Q)',
        why: 'Exam does not hand you one domain at a time.',
        href: '/quiz',
        estimate: '20 min',
        skill: 'mixed',
        goalLabel: '20+ mixed answers, overall quiz ≥75%',
      },
      {
        id: 'review-loop',
        title: 'Clear the miss bank',
        why: 'Mistakes are the curriculum. Master them before retesting.',
        href: '/review',
        estimate: '10–20 min',
        skill: 'review',
        goalLabel: 'Fewer than 5 active misses',
      },
      {
        id: 'mock-baseline',
        title: 'Baseline mock exam (40 Q)',
        why: 'Honest score under timed, domain-weighted conditions.',
        href: '/mock',
        estimate: '50 min',
        skill: 'mock',
        goalLabel: 'Complete at least one mock',
      },
      {
        id: 'mock-improve',
        title: 'Improve mock score',
        why: 'After review, re-mock. Target 80%+ on study mocks.',
        href: '/mock',
        estimate: '50 min',
        skill: 'mock',
        goalLabel: 'Best mock ≥80%',
      },
    ],
  },
];

export function allSteps() {
  return STUDY_PHASES.flatMap((phase) =>
    phase.steps.map((step) => ({ ...step, phaseId: phase.id, phaseTitle: phase.title })),
  );
}

export function getStepById(id) {
  return allSteps().find((s) => s.id === id) || null;
}
