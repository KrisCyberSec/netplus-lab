import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { loadProgress, resetProgress } from '../lib/progress';
import { getCoachPlan } from '../lib/coach';
import { STATUS_LABEL } from '../data/domains';

export default function Home() {
  const [tick, setTick] = useState(0);
  const progress = useMemo(() => loadProgress(), [tick]);
  const coach = useMemo(() => getCoachPlan(progress), [progress]);

  function refresh() {
    setTick((t) => t + 1);
  }

  function handleReset() {
    if (window.confirm('Reset all progress, miss bank, and path history?')) {
      resetProgress();
      refresh();
    }
  }

  const { primary, suggestions, path, stats, domainStats } = coach;

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Your guided Network+ coach</span>
        <h1>What should I do next?</h1>
        <p>
          Progress is saved in this browser. Follow the path, review mistakes, and use the
          suggestions below to get better — not just busier.
        </p>
      </header>

      {/* Primary next action */}
      <section className="card coach-primary">
        <div className="eyebrow">{primary.reason}</div>
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
          Path {path.completed}/{path.total} steps · {path.percent}%
        </p>
        <div className="btn-row">
          <Link className="btn btn-primary" to={primary.href}>
            {primary.cta}
          </Link>
          <Link className="btn" to="/path">
            Full study path
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
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.65rem' }}>How to get better</h2>
        {suggestions.length === 0 ? (
          <div className="card">
            <p className="muted" style={{ margin: 0 }}>
              Not enough data yet. Hit the primary action above — suggestions appear as you
              practice.
            </p>
          </div>
        ) : (
          <div className="suggestion-list">
            {suggestions.map((s) => (
              <div key={s.title} className={`card suggestion severity-${s.severity}`}>
                <div className="suggestion-head">
                  <span className={`badge ${s.severity === 'high' ? 'bad-badge' : s.severity === 'medium' ? 'partial' : 'thin'}`}>
                    {s.severity}
                  </span>
                  <h3>{s.title}</h3>
                </div>
                <p className="muted">{s.body}</p>
                {s.href && s.action && (
                  <div className="btn-row">
                    <Link className="btn" to={s.href}>
                      {s.action}
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
            <div className="stat">
              <span className="label">Study days</span>
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
          <p className="muted">Based on quiz answers saved so far.</p>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}>
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

      {/* Mini path preview */}
      <section style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.65rem' }}>Learning path</h2>
          <Link to="/path" style={{ fontSize: '0.9rem' }}>
            View all phases →
          </Link>
        </div>
        <div className="path-preview">
          {path.phases.map((phase) => (
            <div key={phase.id} className={`card path-phase-card ${phase.complete ? 'done' : ''}`}>
              <div className="path-phase-top">
                <h3>{phase.title}</h3>
                <span className="mono">
                  {phase.done}/{phase.total}
                </span>
              </div>
              <p className="muted" style={{ fontSize: '0.85rem', margin: '0 0 0.65rem' }}>
                {phase.goal}
              </p>
              <div className="progress-bar">
                <span
                  style={{
                    width: `${phase.total ? Math.round((phase.done / phase.total) * 100) : 0}%`,
                  }}
                />
              </div>
              <ul className="path-step-mini">
                {phase.steps.map((s) => (
                  <li key={s.id} className={s.complete ? 'complete' : ''}>
                    <span className="step-check">{s.complete ? '✓' : '○'}</span>
                    <Link to={s.href}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <p className="disclaimer">
        Personal study tool for CompTIA Network+ (N10-009). Not affiliated with CompTIA. Progress
        never leaves this browser unless you clear site data.
      </p>
    </>
  );
}
