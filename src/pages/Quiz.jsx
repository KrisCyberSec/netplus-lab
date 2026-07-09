import { useCallback, useMemo, useState } from 'react';
import { QUESTIONS } from '../data/questions';
import { DOMAINS } from '../data/domains';
import { shuffle, pickN } from '../lib/shuffle';
import { loadProgress, recordQuizAnswer, accuracy } from '../lib/progress';
import { useChoiceKeys } from '../hooks/useChoiceKeys';

function buildSet(domainFilter, count) {
  const pool =
    domainFilter === 'all'
      ? QUESTIONS
      : QUESTIONS.filter((q) => q.domain === Number(domainFilter));
  return pickN(pool, count).map((q) => ({
    ...q,
    choices: shuffle(q.choices.map((text, i) => ({ text, i }))).map((c) => ({
      text: c.text,
      originalIndex: c.i,
    })),
  }));
}

export default function Quiz() {
  const [domain, setDomain] = useState('all');
  const [count, setCount] = useState(10);
  const [set, setSet] = useState(() => buildSet('all', 10));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [session, setSession] = useState({ correct: 0, answered: 0 });
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(() => loadProgress());

  const current = set[index];

  const domainLabel = useMemo(() => {
    if (domain === 'all') return 'All domains';
    const d = DOMAINS.find((x) => x.id === Number(domain));
    return d ? `D${d.id} ${d.name}` : '';
  }, [domain]);

  function start() {
    setSet(buildSet(domain, count));
    setIndex(0);
    setPicked(null);
    setSession({ correct: 0, answered: 0 });
    setDone(false);
  }

  const select = useCallback(
    (originalIndex) => {
      if (picked != null || !current) return;
      const correct = originalIndex === current.answer;
      setPicked({ originalIndex, correct });
      setSession((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        answered: s.answered + 1,
      }));
      setProgress(recordQuizAnswer(current.domain, correct));
    },
    [picked, current],
  );

  const selectDisplay = useCallback(
    (displayIndex) => {
      if (!current) return;
      const c = current.choices[displayIndex];
      if (c) select(c.originalIndex);
    },
    [current, select],
  );

  const next = useCallback(() => {
    if (index + 1 >= set.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }, [index, set.length]);

  useChoiceKeys({
    choiceCount: current?.choices?.length || 4,
    onSelect: selectDisplay,
    onNext: next,
    enabled: !done && !!current,
    answered: picked != null,
  });

  if (done) {
    const pct = session.answered
      ? Math.round((session.correct / session.answered) * 100)
      : 0;
    return (
      <>
        <header className="page-header">
          <span className="eyebrow">Practice quiz</span>
          <h1>Session complete</h1>
          <p>
            {session.correct}/{session.answered} correct ({pct}%) · {domainLabel}
          </p>
        </header>
        <div className="card">
          <div className="stat-row">
            <div className="stat">
              <span className="label">This run</span>
              <span className="value">{pct}%</span>
            </div>
            <div className="stat">
              <span className="label">All-time quiz</span>
              <span className="value">
                {accuracy(progress.quiz) != null ? `${accuracy(progress.quiz)}%` : '—'}
              </span>
            </div>
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={start}>
              Run again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Domains 1–5 · {QUESTIONS.length} questions</span>
        <h1>Practice quiz</h1>
        <p>
          Domain-tagged multiple choice. Keys: 1–4 select, Enter next. All-time accuracy:{' '}
          {accuracy(progress.quiz) != null ? `${accuracy(progress.quiz)}%` : '—'}
        </p>
      </header>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="pill-row">
          <button
            type="button"
            className={`pill ${domain === 'all' ? 'active' : ''}`}
            onClick={() => setDomain('all')}
          >
            All
          </button>
          {DOMAINS.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`pill ${domain === String(d.id) ? 'active' : ''}`}
              onClick={() => setDomain(String(d.id))}
            >
              D{d.id}
            </button>
          ))}
        </div>
        <div className="pill-row">
          {[5, 10, 15, 20].map((n) => (
            <button
              key={n}
              type="button"
              className={`pill ${count === n ? 'active' : ''}`}
              onClick={() => setCount(n)}
            >
              {n} Q
            </button>
          ))}
        </div>
        <div className="btn-row">
          <button type="button" className="btn" onClick={start}>
            New set ({domainLabel}, {count} Q)
          </button>
        </div>
      </div>

      {current && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span className="eyebrow">
              Question {index + 1}/{set.length} · Domain {current.domain}
              {current.objective ? ` · ${current.objective}` : ''}
            </span>
            <span className="timer">
              {session.correct}/{session.answered} this run
            </span>
          </div>
          <div className="progress-bar">
            <span style={{ width: `${((index + (picked ? 1 : 0)) / set.length) * 100}%` }} />
          </div>
          <p style={{ marginTop: '1rem', fontSize: '1.05rem' }}>{current.question}</p>
          <div className="choice-list">
            {current.choices.map((c, i) => {
              let cls = 'choice';
              if (picked) {
                if (c.originalIndex === current.answer) cls += ' correct';
                else if (c.originalIndex === picked.originalIndex && !picked.correct)
                  cls += ' wrong';
              }
              return (
                <button
                  key={c.text}
                  type="button"
                  className={cls}
                  disabled={!!picked}
                  onClick={() => select(c.originalIndex)}
                >
                  <span className="key-hint">{i + 1}</span>
                  {c.text}
                </button>
              );
            })}
          </div>
          {picked && (
            <div className={`feedback ${picked.correct ? 'good' : 'bad'}`}>
              {picked.correct ? 'Correct.' : 'Incorrect.'}
              <span className="explain">{current.explain}</span>
            </div>
          )}
          <div className="btn-row">
            <button type="button" className="btn btn-primary" disabled={!picked} onClick={next}>
              {index + 1 >= set.length ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
