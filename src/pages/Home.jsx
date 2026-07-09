import { Link } from 'react-router-dom';
import { DOMAINS, STATUS_LABEL, DRILL_META } from '../data/domains';
import { QUESTIONS, countByDomain } from '../data/questions';
import { SCENARIOS } from '../data/scenarios';
import { PORTS } from '../data/ports';
import { loadProgress, accuracy, resetProgress } from '../lib/progress';
import { useMemo, useState } from 'react';

const DRILL_CARDS = [
  {
    key: 'subnet',
    title: 'Subnetting trainer',
    blurb: 'CIDR, masks, broadcast, usable hosts. The Network+ pain point.',
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
    blurb: 'Domain-tagged multiple choice across all five domains.',
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
];

export default function Home() {
  const [progress, setProgress] = useState(() => loadProgress());
  const counts = useMemo(() => countByDomain(), []);

  function handleReset() {
    if (window.confirm('Reset all local progress?')) {
      setProgress(resetProgress());
    }
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">CompTIA Network+ practice lab</span>
        <h1>Train the skills the exam actually hits</h1>
        <p>
          Free, local-first drills for N10-009. Strong on concepts, subnetting, ports, and
          troubleshooting. Honest about partial coverage elsewhere.
        </p>
      </header>

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
            <Link className="btn btn-primary" to="/subnet">
              Start subnetting
            </Link>
            <Link className="btn" to="/quiz">
              Take a quiz
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
          <div className="btn-row">
            <Link className="btn" to="/coverage">
              Full coverage matrix
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
                <p>{d.blurb}</p>
              </div>
              <span className={`badge ${d.status}`}>{STATUS_LABEL[d.status]}</span>
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
