import { useMemo, useState } from 'react';
import { OBJECTIVE_MAP, EXAM_META } from '../data/objectives';
import {
  loadProgress,
  setChecklistStatus,
  getChecklistStats,
} from '../lib/progress';
import PageHeader from '../components/PageHeader';
import { allTopicIds } from '../data/objectives';

export default function Checklist() {
  const [tick, setTick] = useState(0);
  const progress = useMemo(() => loadProgress(), [tick]);
  const stats = useMemo(() => getChecklistStats(), [tick]);
  const total = allTopicIds().length;
  const pct = total ? Math.round((stats.done / total) * 100) : 0;

  function cycle(id) {
    const cur = progress.checklist?.[id];
    const next = !cur ? 'learning' : cur === 'learning' ? 'done' : null;
    setChecklistStatus(id, next);
    setTick((t) => t + 1);
  }

  return (
    <>
      <PageHeader eyebrow="N10-009 · Official topic map" title="Objectives checklist">
        <p>
          Tick topics as you learn them. Based on CompTIA’s public Network+ ({EXAM_META.code})
          summary — still verify against the official PDF before exam day.
        </p>
      </PageHeader>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="stat-row">
          <div className="stat">
            <span className="label">Done</span>
            <span className="value">
              {stats.done}/{total}
            </span>
          </div>
          <div className="stat">
            <span className="label">Learning</span>
            <span className="value">{stats.learning}</span>
          </div>
          <div className="stat">
            <span className="label">Coverage</span>
            <span className="value">{pct}%</span>
          </div>
        </div>
        <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className="muted" style={{ marginTop: '0.65rem', fontSize: '0.85rem' }}>
          Click a row to cycle: empty → learning → done → empty. Saved in this browser.
        </p>
      </div>

      {OBJECTIVE_MAP.map((domain) => (
        <section key={domain.domain} className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.05rem' }}>
            {domain.domain}. {domain.name}{' '}
            <span className="muted" style={{ fontWeight: 500 }}>
              ({domain.weight}%)
            </span>
          </h2>
          <ul className="checklist">
            {domain.topics.map((t) => {
              const status = progress.checklist?.[t.id] || null;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`checklist-row ${status || 'empty'}`}
                    onClick={() => cycle(t.id)}
                  >
                    <span className="check-box" aria-hidden>
                      {status === 'done' ? '✓' : status === 'learning' ? '…' : '○'}
                    </span>
                    <span className="mono check-id">{t.id}</span>
                    <span className="check-title">{t.title}</span>
                    <span className={`badge ${status === 'done' ? 'strong' : status === 'learning' ? 'partial' : 'thin'}`}>
                      {status === 'done' ? 'Done' : status === 'learning' ? 'Learning' : 'Todo'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="disclaimer">{EXAM_META.disclaimer}</p>
    </>
  );
}
