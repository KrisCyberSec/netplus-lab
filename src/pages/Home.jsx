import { Link } from 'react-router-dom';
import { DOMAINS, STATUS_LABEL, DRILL_META } from '../data/domains';
import { QUESTIONS, countByDomain } from '../data/questions';
import { SCENARIOS } from '../data/scenarios';
import { PORTS } from '../data/ports';
import {
  loadProgress,
  accuracy,
  resetProgress,
  getLearnStats,
} from '../lib/progress';
import { getWeakDomains } from '../lib/weakDomains';
import { useMemo, useState } from 'react';

const DRILL_CARDS = [
  {
    key: 'review',
    title: 'Review misses',
    blurb: 'Re-drill wrong answers until they stick (2 in a row to master).',
  },
  {
    key: 'subnet',
    title: 'Subnetting trainer',
    blurb: 'Practice + timed 10-problem challenge.',
  },
  {
    key: 'ports',
    title: 'Port lightning round',
    blurb: 'Timed recall for high-yield TCP/UDP ports and services.',
  },
  {
    key: 'osi',
    title: 'OSI map',
    blurb: 'Click layers, learn PDUs, then quiz yourself.',
  },
  {
    key: 'quiz',
    title: 'Practice quiz',
    blurb: 'Domain-tagged multiple choice. Misses feed the study loop.',
  },
  {
    key: 'mock',
    title: 'Mock exam',
    blurb: 'Timed 20 / 40 / 60, domain-weighted, then review misses.',
  },
  {
    key: 'scenarios',
    title: 'Fault scenarios',
    blurb: 'Classic “what’s wrong?” cases for Domain 5.',
  },
  {
    key: 'tools',
    title: 'Tool picker',
    blurb: 'Pick the right CLI or hardware tool for the job.',
  },
  {
    key: 'sheets',
    title: 'Cheatsheets',
    blurb: 'Ports, subnet math, cabling, Wi-Fi, OSI, methodology.',
  },
];

export default function Home() {
  const [progress, setProgress] = useState(() => loadProgress());
  const counts = useMemo(() => countByDomain(), []);
  const weak = useMemo(() => getWeakDomains(3), [progress]);
  const learn = useMemo(() => getLearnStats(), [progress]);

  function handleReset() {
    if (window.confirm('Reset all local progress and miss bank?')) {
      setProgress(resetProgress());
    }
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">CompTIA Network+ practice lab · v0.3</span>
        <h1>Train, miss, review, improve</h1>
        <p>
          Free local-first N10-009 drills with a real study loop: every wrong answer goes into
          your miss bank so you can re-learn it until it sticks.
        </p>
      </header>

      {/* Study loop hero */}
      <section className="card study-loop-card" style={{ marginBottom: '1.25rem' }}>
        <div className="eyebrow">Study loop</div>
        <h2 style={{ marginTop: 0 }}>Learn from mistakes</h2>
        <p className="muted">
          Quiz and mock misses are saved here (this browser only). Review until you get each item
          right twice in a row to master it.
        </p>
        <div className="stat-row">
          <div className="stat">
            <span className="label">Active misses</span>
            <span className="value">{learn.activeCount}</span>
          </div>
          <div className="stat">
            <span className="label">Mastered</span>
            <span className="value">{learn.masteredCount}</span>
          </div>
          <div className="stat">
            <span className="label">Last session misses</span>
            <span className="value">{learn.lastSession?.missedIds?.length ?? '—'}</span>
          </div>
        </div>
        {learn.activeCount > 0 && (
          <div className="domain-cards" style={{ marginTop: '0.85rem' }}>
            {DOMAINS.filter((d) => (learn.byDomain[d.id] || 0) > 0).map((d) => (
              <div key={d.id} className="domain-card">
                <div className="domain-weight">{learn.byDomain[d.id]}</div>
                <div>
                  <h3>D{d.id} open misses</h3>
                  <p>{d.name}</p>
                </div>
                <Link
                  className="btn"
                  to={`/quiz?domain=${d.id}`}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                >
                  Drill domain
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className="btn-row">
          <Link
            className="btn btn-primary"
            to={learn.activeCount > 0 ? '/review' : '/quiz'}
          >
            {learn.activeCount > 0 ? 'Review miss bank' : 'Start a quiz to build the bank'}
          </Link>
          {learn.lastSession?.missedIds?.length > 0 && (
            <Link className="btn" to="/review?session=1">
              Last session misses
            </Link>
          )}
          <Link className="btn" to="/mock">
            Mock exam
          </Link>
        </div>
      </section>

      <div className="hero-grid">
        <section className="card">
          <h2>Your progress</h2>
          <p className="muted">Stored only in this browser. Nothing is uploaded.</p>
          <div className="stat-row">
            <div className="stat">
              <span className="label">Subnet</span>
              <span className="value">
                {accuracy(progress.subnet) != null ? `${accuracy(progress.subnet)}%` : '—'}
              </span>
            </div>
            <div className="stat">
              <span className="label">Ports</span>
              <span className="value">
                {accuracy(progress.ports) != null ? `${accuracy(progress.ports)}%` : '—'}
              </span>
            </div>
            <div className="stat">
              <span className="label">Quiz</span>
              <span className="value">
                {accuracy(progress.quiz) != null ? `${accuracy(progress.quiz)}%` : '—'}
              </span>
            </div>
            <div className="stat">
              <span className="label">Mock best</span>
              <span className="value">
                {progress.mock?.bestScore != null ? `${progress.mock.bestScore}%` : '—'}
              </span>
            </div>
            <div className="stat">
              <span className="label">Scenarios</span>
              <span className="value">
                {progress.scenarios.completedIds?.length || 0}/{SCENARIOS.length}
              </span>
            </div>
            <div className="stat">
              <span className="label">Best subnet streak</span>
              <span className="value">{progress.subnet.bestStreak || 0}</span>
            </div>
          </div>
          <div className="btn-row">
            <Link className="btn" to="/subnet">
              Subnetting
            </Link>
            <Link className="btn" to="/quiz">
              Practice quiz
            </Link>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              Reset progress
            </button>
          </div>
        </section>

        <section className="card">
          <h2>Content snapshot</h2>
          <div className="stat-row">
            <div className="stat">
              <span className="label">Quiz items</span>
              <span className="value">{QUESTIONS.length}</span>
            </div>
            <div className="stat">
              <span className="label">Ports</span>
              <span className="value">{PORTS.length}</span>
            </div>
            <div className="stat">
              <span className="label">Scenarios</span>
              <span className="value">{SCENARIOS.length}</span>
            </div>
          </div>
          <p className="muted" style={{ marginTop: '1rem' }}>
            Questions by domain: D1 {counts[1]} · D2 {counts[2]} · D3 {counts[3]} · D4{' '}
            {counts[4]} · D5 {counts[5]}
          </p>

          {weak.ranked.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem' }}>Focus next (weak domains)</h3>
              <div className="domain-cards">
                {weak.ranked.slice(0, 2).map((d) => (
                  <div key={d.id} className="domain-card">
                    <div className="domain-weight">{d.accuracy}%</div>
                    <div>
                      <h3>
                        D{d.id} {d.name}
                      </h3>
                      <p>
                        {d.correct}/{d.attempted} quiz answers
                      </p>
                    </div>
                    <Link
                      className="btn"
                      to={`/quiz?domain=${d.id}`}
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                    >
                      Drill
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="muted" style={{ marginTop: '1rem' }}>
              Answer a few quiz questions per domain to unlock weak-area coaching.
            </p>
          )}

          <div className="btn-row">
            <Link className="btn" to="/coverage">
              Coverage matrix
            </Link>
            <Link className="btn" to="/sheets">
              Cheatsheets
            </Link>
          </div>
        </section>
      </div>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Exam domains (N10-009)</h2>
        <div className="domain-cards">
          {DOMAINS.map((d) => (
            <div key={d.id} className="domain-card">
              <div className="domain-weight">{d.weight}%</div>
              <div>
                <h3>
                  {d.id}. {d.name}
                </h3>
                <p>
                  {d.blurb} · {counts[d.id]} quiz items
                  {(learn.byDomain[d.id] || 0) > 0
                    ? ` · ${learn.byDomain[d.id]} open misses`
                    : ''}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
                <span className={`badge ${d.status}`}>{STATUS_LABEL[d.status]}</span>
                <Link
                  className="btn"
                  to={`/quiz?domain=${d.id}`}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                >
                  Practice
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Drills</h2>
        <div className="grid-2">
          {DRILL_CARDS.map((d) => {
            const meta = DRILL_META[d.key];
            return (
              <Link key={d.key} to={meta.path} className="card card-link">
                <h3>
                  {meta.icon} {d.title}
                </h3>
                <p className="muted">{d.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <p className="disclaimer">
        Not affiliated with CompTIA. Network+ is a registered trademark of CompTIA. Use the
        official exam objectives as the source of truth. This lab is a free study aid, not a full
        course or hands-on hardware replacement.
      </p>
    </>
  );
}
