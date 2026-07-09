import { STUDY_PHASES, allSteps } from '../data/studyPath';
import { DOMAINS } from '../data/domains';
import { loadProgress, accuracy, getLearnStats } from './progress';
import { getWeakDomains } from './weakDomains';

function acc(slice) {
  return accuracy(slice);
}

function domainAcc(progress, domainId) {
  const attempted = progress.quiz?.byDomain?.[domainId] || 0;
  const correct = progress.quiz?.byDomainCorrect?.[domainId] || 0;
  if (!attempted) return null;
  return Math.round((correct / attempted) * 100);
}

function domainAttempted(progress, domainId) {
  return progress.quiz?.byDomain?.[domainId] || 0;
}

/** Evaluate whether a path step is complete from live progress. */
export function isStepComplete(step, progress) {
  const p = progress || loadProgress();
  const visited = new Set(p.path?.visitedStepIds || []);

  switch (step.id) {
    case 'osi':
      return (p.osi?.attempted || 0) >= 5 && (acc(p.osi) ?? 0) >= 70;
    case 'ports':
      return (p.ports?.attempted || 0) >= 20 && (acc(p.ports) ?? 0) >= 75;
    case 'subnet':
      return (p.subnet?.attempted || 0) >= 15 && (acc(p.subnet) ?? 0) >= 70;
    case 'sheets-ports':
      return visited.has('sheets-ports') || visited.has('sheets');
    case 'quiz-d1':
      return domainAttempted(p, 1) >= 15 && (domainAcc(p, 1) ?? 0) >= 75;
    case 'quiz-d2':
      return domainAttempted(p, 2) >= 12 && (domainAcc(p, 2) ?? 0) >= 70;
    case 'quiz-d3':
      return domainAttempted(p, 3) >= 10 && (domainAcc(p, 3) ?? 0) >= 70;
    case 'quiz-d4':
      return domainAttempted(p, 4) >= 10 && (domainAcc(p, 4) ?? 0) >= 70;
    case 'quiz-d5':
      return domainAttempted(p, 5) >= 15 && (domainAcc(p, 5) ?? 0) >= 70;
    case 'tools':
      return (p.tools?.attempted || 0) >= 10 && (acc(p.tools) ?? 0) >= 70;
    case 'scenarios':
      return (p.scenarios?.completedIds?.length || 0) >= 8;
    case 'subnet-timed':
      return (p.subnet?.timedBest?.score ?? 0) >= 70;
    case 'mixed-quiz':
      return (p.quiz?.attempted || 0) >= 40 && (acc(p.quiz) ?? 0) >= 75;
    case 'review-loop': {
      const learn = getLearnStats();
      // Complete if they've used review and bank is under control
      return (
        (visited.has('review-loop') || visited.has('review')) &&
        learn.activeCount < 5 &&
        (p.quiz?.attempted || 0) >= 10
      );
    }
    case 'mock-baseline':
      return (p.mock?.attempts || 0) >= 1;
    case 'mock-improve':
      return (p.mock?.bestScore ?? 0) >= 80;
    default:
      return visited.has(step.id);
  }
}

/** 0–1 progress toward step goal for UI bars. */
export function stepProgress(step, progress) {
  const p = progress || loadProgress();
  if (isStepComplete(step, p)) return 1;

  const clamp = (n) => Math.max(0, Math.min(1, n));

  switch (step.id) {
    case 'osi':
      return clamp((p.osi?.attempted || 0) / 5);
    case 'ports':
      return clamp((p.ports?.attempted || 0) / 20);
    case 'subnet':
      return clamp((p.subnet?.attempted || 0) / 15);
    case 'sheets-ports':
      return isStepComplete(step, p) ? 1 : 0;
    case 'quiz-d1':
      return clamp(domainAttempted(p, 1) / 15);
    case 'quiz-d2':
      return clamp(domainAttempted(p, 2) / 12);
    case 'quiz-d3':
      return clamp(domainAttempted(p, 3) / 10);
    case 'quiz-d4':
      return clamp(domainAttempted(p, 4) / 10);
    case 'quiz-d5':
      return clamp(domainAttempted(p, 5) / 15);
    case 'tools':
      return clamp((p.tools?.attempted || 0) / 10);
    case 'scenarios':
      return clamp((p.scenarios?.completedIds?.length || 0) / 8);
    case 'subnet-timed':
      return clamp((p.subnet?.timedBest?.score || 0) / 70);
    case 'mixed-quiz':
      return clamp((p.quiz?.attempted || 0) / 40);
    case 'review-loop': {
      const learn = getLearnStats();
      if (learn.activeCount === 0 && (p.quiz?.attempted || 0) < 10) return 0;
      return clamp(1 - learn.activeCount / 15);
    }
    case 'mock-baseline':
      return (p.mock?.attempts || 0) >= 1 ? 1 : 0;
    case 'mock-improve':
      return clamp((p.mock?.bestScore || 0) / 80);
    default:
      return 0;
  }
}

export function getPathStatus(progress) {
  const p = progress || loadProgress();
  const steps = allSteps();
  const evaluated = steps.map((step) => ({
    ...step,
    complete: isStepComplete(step, p),
    progress: stepProgress(step, p),
  }));
  const completed = evaluated.filter((s) => s.complete).length;
  const next = evaluated.find((s) => !s.complete) || null;

  const phases = STUDY_PHASES.map((phase) => {
    const phaseSteps = evaluated.filter((s) => s.phaseId === phase.id);
    const done = phaseSteps.filter((s) => s.complete).length;
    return {
      ...phase,
      steps: phaseSteps,
      done,
      total: phaseSteps.length,
      complete: done === phaseSteps.length,
    };
  });

  return {
    steps: evaluated,
    phases,
    completed,
    total: steps.length,
    percent: steps.length ? Math.round((completed / steps.length) * 100) : 0,
    nextStep: next,
  };
}

/**
 * Priority coaching: what to do right now + how to improve.
 */
export function getCoachPlan(progress) {
  const p = progress || loadProgress();
  const learn = getLearnStats();
  const path = getPathStatus(p);
  const weak = getWeakDomains(3);
  const suggestions = [];

  // --- Primary action (single best next thing) ---
  let primary = null;

  // 1. Miss bank first if it's growing — learning loop beats advancing path
  if (learn.activeCount >= 5) {
    primary = {
      type: 'review',
      title: 'Review your miss bank',
      detail: `You have ${learn.activeCount} active misses. Clearing these raises scores faster than new content.`,
      href: '/review',
      cta: 'Review misses',
      reason: 'Study loop priority',
    };
  } else if (learn.lastSession?.missedIds?.length >= 3) {
    primary = {
      type: 'review',
      title: 'Review last session misses',
      detail: `You missed ${learn.lastSession.missedIds.length} last time. Re-drill while the explanations are fresh.`,
      href: '/review?session=1',
      cta: 'Review session misses',
      reason: 'Fresh mistakes',
    };
  } else if (path.nextStep) {
    primary = {
      type: 'path',
      title: path.nextStep.title,
      detail: path.nextStep.why,
      href: path.nextStep.href,
      cta: 'Continue path',
      reason: path.nextStep.phaseTitle || 'Learning path',
      step: path.nextStep,
    };
  } else {
    primary = {
      type: 'maintain',
      title: 'Path complete — keep sharp',
      detail: 'Run a mock, then review whatever you miss. Maintenance mode.',
      href: '/mock',
      cta: 'Take a mock',
      reason: 'Mastery maintenance',
    };
  }

  // --- Suggestions (how to get better) ---
  if (learn.activeCount > 0 && primary.type !== 'review') {
    suggestions.push({
      severity: 'high',
      title: `${learn.activeCount} open misses`,
      body: 'Spend 10 minutes in Review before starting new drills.',
      href: '/review',
      action: 'Review',
    });
  }

  if (weak.ranked.length > 0) {
    const w = weak.ranked[0];
    if ((w.accuracy ?? 100) < 75) {
      suggestions.push({
        severity: w.accuracy < 60 ? 'high' : 'medium',
        title: `Weak domain: D${w.id} ${w.name}`,
        body: `You're at ${w.accuracy}% (${w.correct}/${w.attempted}). Drill this domain, then review misses.`,
        href: `/quiz?domain=${w.id}`,
        action: `Drill D${w.id}`,
      });
    }
  }

  // Domains with no data yet
  const untried = DOMAINS.filter((d) => domainAttempted(p, d.id) < 5);
  if (untried.length > 0 && (p.quiz?.attempted || 0) >= 10) {
    const d = untried[0];
    suggestions.push({
      severity: 'medium',
      title: `Untested: D${d.id} ${d.name}`,
      body: 'You barely have data here. A short domain quiz reveals blind spots.',
      href: `/quiz?domain=${d.id}`,
      action: `Quiz D${d.id}`,
    });
  }

  const subnetAcc = acc(p.subnet);
  if ((p.subnet?.attempted || 0) >= 5 && (subnetAcc ?? 100) < 70) {
    suggestions.push({
      severity: 'high',
      title: 'Subnetting needs work',
      body: `Accuracy ${subnetAcc}%. Do 10 practice problems slowly, then a timed run.`,
      href: '/subnet',
      action: 'Practice subnetting',
    });
  } else if ((p.subnet?.attempted || 0) >= 15 && !p.subnet?.timedBest) {
    suggestions.push({
      severity: 'medium',
      title: 'Try timed subnetting',
      body: 'Practice accuracy is fine — prove speed with the 10-problem timed mode.',
      href: '/subnet',
      action: 'Timed challenge',
    });
  }

  const portsAcc = acc(p.ports);
  if ((p.ports?.attempted || 0) >= 10 && (portsAcc ?? 100) < 75) {
    suggestions.push({
      severity: 'medium',
      title: 'Port recall is soft',
      body: `At ${portsAcc}%. Do a lightning round, then skim the ports cheatsheet.`,
      href: '/ports',
      action: 'Ports drill',
    });
  }

  if ((p.mock?.attempts || 0) === 0 && path.completed >= 6) {
    suggestions.push({
      severity: 'medium',
      title: 'No mock exam yet',
      body: 'After foundations, a baseline mock shows where you really stand.',
      href: '/mock',
      action: 'Baseline mock',
    });
  } else if ((p.mock?.bestScore ?? 0) > 0 && (p.mock?.bestScore ?? 0) < 80) {
    suggestions.push({
      severity: 'medium',
      title: `Mock best is ${p.mock.bestScore}%`,
      body: 'Review the miss bank, drill the worst domain from the last mock, then retake.',
      href: '/review',
      action: 'Close gaps',
    });
  }

  if ((p.scenarios?.completedIds?.length || 0) < 5 && path.completed >= 4) {
    suggestions.push({
      severity: 'low',
      title: 'Few scenarios cleared',
      body: 'Scenario thinking transfers to PBQs. Clear a handful this week.',
      href: '/scenarios',
      action: 'Scenarios',
    });
  }

  // Study streak / consistency
  const days = p.path?.studyDays || [];
  if (days.length >= 2) {
    suggestions.push({
      severity: 'low',
      title: `${days.length} study days logged`,
      body: 'Consistency beats cramming. Even a 15-minute review session counts.',
      href: null,
      action: null,
    });
  } else if ((p.quiz?.attempted || 0) + (p.subnet?.attempted || 0) > 0) {
    suggestions.push({
      severity: 'low',
      title: 'Build a daily habit',
      body: 'Short daily sessions (miss review + one path step) beat weekend marathons.',
      href: path.nextStep?.href || '/review',
      action: 'Continue',
    });
  }

  // Cap suggestions
  const ranked = suggestions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  }).slice(0, 5);

  return {
    primary,
    suggestions: ranked,
    path,
    learn,
    weak: weak.ranked.slice(0, 3),
    domainStats: DOMAINS.map((d) => ({
      ...d,
      attempted: domainAttempted(p, d.id),
      accuracy: domainAcc(p, d.id),
    })),
    stats: {
      quizAcc: acc(p.quiz),
      subnetAcc: acc(p.subnet),
      portsAcc: acc(p.ports),
      mockBest: p.mock?.bestScore ?? null,
      mockAttempts: p.mock?.attempts || 0,
      studyDays: days.length,
      activeMisses: learn.activeCount,
      mastered: learn.masteredCount,
    },
  };
}
