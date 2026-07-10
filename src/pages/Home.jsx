import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { loadProgress, resetProgress, dismissWelcome } from '../lib/progress';
import { getCoachPlan } from '../lib/coach';
import { STATUS_LABEL } from '../data/domains';
import PageHeader from '../components/PageHeader';

export default function Home() {
  const [tick, setTick] = useState(0);
  const progress = useMemo(() => loadProgress(), [tick]);
  const coach = useMemo(() => getCoachPlan(progress), [progress]);
  const isFresh =
    !progress.path?.welcomeDismissed &&
    (progress.quiz?.attempted || 0) === 0 &&
    (progress.subnet?.attempted || 0) === 0 &&
    (progress.ports?.attempted || 0) === 0;

  function refresh() {
    setTick((t) => t + 1);
  }

  function handleReset() {
    if (window.confirm('Reset all progress, miss bank, and path history? This cannot be undone.')) {
      resetProgress();
      refresh();
    }
  }

  function handleDismissWelcome() {
    dismissWelcome();
    refresh();
  }

  const { primary, suggestions, path, stats, domainStats } = coach;
  const showWelcome = isFresh || !progress.path?.welcomeDismissed;

  return (
    <>
      <PageHeader
        eyebrow="Your guided Network+ coach"
        title="What should I do next?"
        showCoachLink={false}
      >
        <p>
          One recommended action, then review mistakes. Everything saves automatically in this
          browser.
        </p>
      </PageHeader>

      {showWelcome && (
        <section className="card welcome-card">
          <div className="eyebrow">How this works (30 seconds)</div>
          <h2 style={{ marginTop: 0 }}>Three steps, every study session</h2>
          <ol className="how-list">
            <li>
              <strong>Do the big button</strong> below (your coach pick — usually the next path
              step).
            </li>
            <li>
              <strong>Review misses</strong> when you get things wrong (sidebar badge, or the
              button after a quiz/mock).
            </li>
            <li>
              <strong>Come back here</strong> — the coach updates from your real scores.
            </li>
          </ol>
          <p className="muted" style={{ margin: '0 0 0.75rem' }}>
            Path progress completes when you hit goals (e.g. accuracy + attempts), not just by
            opening a page. Keys in quizzes: <span className="mono">1–4</span> answer,{' '}
            <span className="mono">Enter</span> next.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" to={primary.href} onClick={handleDismissWelcome}>
              Got it — start
            </Link>
            <button type="button" className="btn btn-ghost" onClick={handleDismissWelcome}>
              Dismiss
            </button>
          </div>
        </section>
      )}

      {/* Primary next action */}
      <section className="card coach-primary" style={{ marginTop: showWelcome ? '1rem' : 0 }}>
        <div className="eyebrow">Do this next · {primary.reason}</div>
        <h2 style={{ marginTop: 0, fontSize: '1.45rem' }}>{primary.title}</h2>
        <p className="muted" style={{ maxWidth: '36rem' }}>
          {primary.detail}
        </p>
        {primary.step && (
          <p className="goal-line">
            Goal: {primary.step.goalLabel}
            {primary.step.estimate ? ` · ~${primary.step.estimate}` : ''}
          </p>
        )}
        <div className="progress-bar" style={{ marginTop: '1rem', maxWidth: '20rem' }}>
          <span style={{ width: `${path.percent}%` }} />
        </div>
        <p className="muted" style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
          Path {path.completed}/{path.total} steps complete · {path.percent}%
        </p>
        <div className="btn-row">
          <Link className="btn btn-primary" to={primary.href}>
            {primary.cta} →
          </Link>
          <Link className="btn" to="/path">
            See full path
          </Link>
          {stats.activeMisses > 0 && primary.type !== 'review' && (
            <Link className="btn" to="/review">
              Review misses ({stats.activeMisses})
            </Link>
          )}
        </div>
      </section>

      {/* How to get better */}
      <section style={{ marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>How to get better</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: '0.65rem', fontSize: '0.9rem' }}>
          Based on what you&apos;ve practiced so far — not generic tips.
        </p>
        {suggestions.length === 0 ? (
          <div className="card">
            <p className="muted" style={{ margin: 0 }}>
              Complete the action above once. Personalized suggestions unlock after a little
              practice data.
            </p>
          </div>
        ) : (
          <div className="suggestion-list">
            {suggestions.map((s) => (
              <div key={s.title} className={`card suggestion severity-${s.severity}`}>
                <div className="suggestion-head">
                  <span
                    className={`badge ${
                      s.severity === 'high'
                        ? 'bad-badge'
                        : s.severity === 'medium'
                          ? 'partial'
                          : 'thin'
                    }`}
                  >
                    {s.severity}
                  </span>
                  <h3>{s.title}</h3>
                </div>
                <p className="muted">{s.body}</p>
                {s.href && s.action && (
                  <div className="btn-row">
                    <Link className="btn" to={s.href}>
                      {s.action} →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Snapshot */}
      <section className="hero-grid" style={{ marginTop: '1.25rem' }}>
        <div className="card">
          <h2>Your numbers</h2>
          <div className="stat-row">
            <div className="stat" title={stats.timezone ? `Local calendar days (${stats.timezone})` : undefined}>
              <span className="label">Days practiced</span>
              <span className="value">{stats.studyDays}</span>
            </div>
            <div className="stat">
              <span className="label">Active misses</span>
              <span className="value">{stats.activeMisses}</span>
            </div>
            <div className="stat">
              <span className="label">Mastered</span>
              <span className="value">{stats.mastered}</span>
            </div>
            <div className="stat">
              <span className="label">Quiz</span>
              <span className="value">
                {stats.quizAcc != null ? `${stats.quizAcc}%` : '—'}
              </span>
            </div>
            <div className="stat">
              <span className="label">Subnet</span>
              <span className="value">
                {stats.subnetAcc != null ? `${stats.subnetAcc}%` : '—'}
              </span>
            </div>
            <div className="stat">
              <span className="label">Mock best</span>
              <span className="value">
                {stats.mockBest != null ? `${stats.mockBest}%` : '—'}
              </span>
            </div>
          </div>
          <p className="muted" style={{ margin: '0.75rem 0 0', fontSize: '0.85rem' }}>
            {stats.lastActiveLabel
              ? `Last activity: ${stats.lastActiveLabel}`
              : 'No activity stamped yet — do one drill and it will show here.'}
            {stats.timezone ? ` · ${stats.timezone}` : ''}
          </p>
          <p className="save-note" style={{ marginTop: '0.35rem' }}>
            “Days practiced” = distinct local calendar days with any practice (not session length).
            Saved in this browser only.
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn-ghost" onClick={refresh}>
              Refresh stats
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              Reset all progress
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Domain readiness</h2>
          <p className="muted">From quiz answers. Aim for 75%+ with enough attempts.</p>
          <div className="domain-cards" style={{ marginTop: '0.75rem' }}>
            {domainStats.map((d) => {
              const ready =
                d.attempted >= 10 && (d.accuracy ?? 0) >= 75
                  ? 'strong'
                  : d.attempted >= 5
                    ? 'partial'
                    : 'thin';
              return (
                <div key={d.id} className="domain-card">
                  <div className="domain-weight">
                    {d.accuracy != null ? `${d.accuracy}%` : '—'}
                  </div>
                  <div>
                    <h3>
                      D{d.id} {d.name}
                    </h3>
                    <p>
                      {d.attempted} answered · {d.weight}% of exam
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem',
                      alignItems: 'flex-end',
                    }}
                  >
                    <span className={`badge ${ready}`}>{STATUS_LABEL[ready]}</span>
                    <Link
                      className="btn"
                      to={`/quiz?domain=${d.id}`}
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                    >
                      Practice
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compact path preview — current phase only if in progress */}
      <section style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.65rem' }}>Learning path</h2>
          <Link to="/path" style={{ fontSize: '0.9rem' }}>
            All phases →
          </Link>
        </div>
        <div className="path-preview path-preview-compact">
          {path.phases.map((phase) => {
            const isCurrent = !phase.complete && phase.steps.some((s) => !s.complete);
            const firstOpen = phase.steps.find((s) => !s.complete);
            return (
              <div
                key={phase.id}
                className={`card path-phase-card ${phase.complete ? 'done' : ''} ${
                  isCurrent && firstOpen ? 'current-phase' : ''
                }`}
              >
                <div className="path-phase-top">
                  <h3>{phase.title}</h3>
                  <span className="mono">
                    {phase.done}/{phase.total}
                  </span>
                </div>
                <div className="progress-bar">
                  <span
                    style={{
                      width: `${phase.total ? Math.round((phase.done / phase.total) * 100) : 0}%`,
                    }}
                  />
                </div>
                {firstOpen && !phase.complete ? (
                  <div className="btn-row" style={{ marginTop: '0.75rem' }}>
                    <Link className="btn" to={firstOpen.href}>
                      Continue: {firstOpen.title}
                    </Link>
                  </div>
                ) : (
                  <p className="muted" style={{ fontSize: '0.85rem', margin: '0.65rem 0 0' }}>
                    {phase.complete ? 'Phase complete.' : phase.goal}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <p className="disclaimer">
        Personal study tool for CompTIA Network+ (N10-009). Not affiliated with CompTIA. Progress
        never leaves this browser unless you clear site data.
      </p>
    </>
  );
}
