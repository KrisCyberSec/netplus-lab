import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QUESTIONS } from '../data/questions';
import { DOMAINS } from '../data/domains';
import { shuffle, pickN } from '../lib/shuffle';
import {
  loadProgress,
  recordQuizAnswer,
  recordLearnEvent,
  recordStudySession,
  accuracy,
  getLearnStats,
  markPathVisit,
} from '../lib/progress';
import { getWeakDomains } from '../lib/weakDomains';
import { useChoiceKeys } from '../hooks/useChoiceKeys';
import { prepareChoices } from '../lib/study';
import { usePathVisit } from '../hooks/usePathVisit';

function buildSet(domainFilter, count) {
  const pool =
    domainFilter === 'all'
      ? QUESTIONS
      : QUESTIONS.filter((q) => q.domain === Number(domainFilter));
  return pickN(pool, Math.min(count, pool.length)).map((q) => ({
    ...q,
    choices: prepareChoices(q),
  }));
}

export default function Quiz() {
  const [params, setParams] = useSearchParams();
  const paramDomain = params.get('domain');
  const paramMode = params.get('mode'); // weak | normal
  usePathVisit('mixed-quiz', paramDomain ? `quiz-d${paramDomain}` : 'quiz');

  const [domain, setDomain] = useState(() => {
    if (paramDomain && ['1', '2', '3', '4', '5'].includes(paramDomain)) return paramDomain;
    if (paramMode === 'weak') {
      const w = getWeakDomains(2).ranked[0];
      return w ? String(w.id) : 'all';
    }
    return 'all';
  });
  const [count, setCount] = useState(10);
  const [set, setSet] = useState(() => buildSet(domain, 10));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [session, setSession] = useState({ correct: 0, answered: 0, missedIds: [] });
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(() => loadProgress());

  // Apply URL domain when it changes (e.g. from dashboard link)
  useEffect(() => {
    if (paramDomain && ['1', '2', '3', '4', '5'].includes(paramDomain)) {
      setDomain(paramDomain);
      const next = buildSet(paramDomain, count);
      setSet(next);
      setIndex(0);
      setPicked(null);
      setSession({ correct: 0, answered: 0, missedIds: [] });
      setDone(false);
    } else if (paramMode === 'weak') {
      const w = getWeakDomains(2).ranked[0];
      if (w) {
        setDomain(String(w.id));
        setSet(buildSet(String(w.id), count));
        setIndex(0);
        setPicked(null);
        setSession({ correct: 0, answered: 0, missedIds: [] });
        setDone(false);
      }
    }
  }, [paramDomain, paramMode]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setSession({ correct: 0, answered: 0, missedIds: [] });
    setDone(false);
    // Keep URL in sync for shareable weak-domain links
    const next = new URLSearchParams();
    if (domain !== 'all') {
      next.set('domain', domain);
      markPathVisit(`quiz-d${domain}`);
    } else {
      markPathVisit('mixed-quiz');
    }
    setParams(next, { replace: true });
  }

  const select = useCallback(
    (originalIndex) => {
      if (picked != null || !current) return;
      const correct = originalIndex === current.answer;
      setPicked({ originalIndex, correct });
      setSession((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        answered: s.answered + 1,
        missedIds: correct ? s.missedIds : [...s.missedIds, current.id],
      }));
      recordQuizAnswer(current.domain, correct);
      setProgress(
        recordLearnEvent({
          id: current.id,
          domain: current.domain,
          kind: 'quiz',
          correct,
          prompt: current.question,
        }),
      );
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

  useEffect(() => {
    if (!done) return;
    setProgress(
      recordStudySession({
        source: 'quiz',
        missedIds: session.missedIds,
        correct: session.correct,
        total: session.answered,
        domain: domain === 'all' ? null : Number(domain),
      }),
    );
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

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
    const learn = getLearnStats();
    return (
      <>
        <header className="page-header">
          <span className="eyebrow">Practice quiz</span>
          <h1>Session complete</h1>
          <p>
            {session.correct}/{session.answered} correct ({pct}%) · {domainLabel}
          </p>
        </header>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="stat-row">
            <div className="stat">
              <span className="label">This run</span>
              <span className="value">{pct}%</span>
            </div>
            <div className="stat">
              <span className="label">Missed here</span>
              <span className="value">{session.missedIds.length}</span>
            </div>
            <div className="stat">
              <span className="label">Bank active</span>
              <span className="value">{learn.activeCount}</span>
            </div>
          </div>

          {session.missedIds.length > 0 ? (
            <div className="study-cta">
              <h3>Learn from this session</h3>
              <p className="muted">
                You missed {session.missedIds.length} question
                {session.missedIds.length === 1 ? '' : 's'}. Review them now while the explanation
                is fresh — two correct in a row masters each item.
              </p>
              <div className="btn-row">
                <Link className="btn btn-primary" to="/review?session=1">
                  Review these misses
                </Link>
                <Link className="btn" to="/review">
                  Full miss bank
                </Link>
              </div>
            </div>
          ) : (
            <p className="muted" style={{ marginTop: '1rem' }}>
              Clean run — nothing new added to the miss bank.
            </p>
          )}

          <div className="btn-row">
            <button type="button" className="btn" onClick={start}>
              Run again
            </button>
            <Link className="btn" to="/">
              Dashboard
            </Link>
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
          Wrong answers feed your miss bank. Keys: 1–4 select, Enter next. All-time accuracy:{' '}
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
          <Link className="btn btn-ghost" to="/review">
            Review misses
          </Link>
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
              {picked.correct ? 'Correct.' : 'Saved to miss bank for review.'}
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
