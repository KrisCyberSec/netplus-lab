import { useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { loadProgress, recordScenario, accuracy } from '../lib/progress';

export default function Scenarios() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());

  const item = SCENARIOS[index];
  const completed = new Set(progress.scenarios.completedIds || []);

  function select(i) {
    if (picked != null) return;
    const correct = i === item.answer;
    setPicked({ i, correct });
    setProgress(recordScenario(item.id, correct));
  }

  function go(delta) {
    setIndex((i) => (i + delta + SCENARIOS.length) % SCENARIOS.length);
    setPicked(null);
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Domain 5 · Scenarios</span>
        <h1>Fault scenarios</h1>
        <p>
          Read the symptoms, pick the most likely cause. Cleared:{' '}
          {completed.size}/{SCENARIOS.length} · Accuracy{' '}
          {accuracy(progress.scenarios) != null ? `${accuracy(progress.scenarios)}%` : '—'}
        </p>
      </header>

      <div className="pill-row" style={{ marginBottom: '1rem' }}>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`pill ${i === index ? 'active' : ''}`}
            onClick={() => {
              setIndex(i);
              setPicked(null);
            }}
            title={s.title}
          >
            {completed.has(s.id) ? '✓' : ''} {i + 1}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="eyebrow">
          Domain {item.domain} · {index + 1}/{SCENARIOS.length}
        </div>
        <h2 style={{ marginTop: 0 }}>{item.title}</h2>
        <div className="prompt-box" style={{ marginBottom: '1rem' }}>
          {item.symptoms}
        </div>
        <p style={{ fontWeight: 600 }}>{item.question}</p>
        <div className="choice-list">
          {item.choices.map((c, i) => {
            let cls = 'choice';
            if (picked) {
              if (i === item.answer) cls += ' correct';
              else if (i === picked.i && !picked.correct) cls += ' wrong';
            }
            return (
              <button
                key={c}
                type="button"
                className={cls}
                disabled={!!picked}
                onClick={() => select(i)}
              >
                {c}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className={`feedback ${picked.correct ? 'good' : 'bad'}`}>
            {picked.correct ? 'Solid troubleshooting.' : 'Not quite.'}
            <span className="explain">{item.explain}</span>
          </div>
        )}
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => go(-1)}>
            Previous
          </button>
          <button type="button" className="btn btn-primary" onClick={() => go(1)}>
            Next scenario
          </button>
        </div>
      </div>
    </>
  );
}
