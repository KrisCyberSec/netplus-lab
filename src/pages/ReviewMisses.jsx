import { useCallback, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  loadProgress,
  getLearnStats,
  getReviewQueue,
  recordLearnEvent,
  recordQuizAnswer,
  clearMasteredFromBank,
} from '../lib/progress';
import { buildMissReviewSet, buildSessionMissSet, prepareChoices } from '../lib/study';
import { DOMAINS } from '../data/domains';
import { useChoiceKeys } from '../hooks/useChoiceKeys';

function wrapSet(raw) {
  return raw.map((q) => ({ ...q, choices: prepareChoices(q) }));
}

export default function ReviewMisses() {
  const [params] = useSearchParams();
  const sessionOnly = params.get('session') === '1';

  const [progress, setProgress] = useState(() => loadProgress());
  const stats = useMemo(() => getLearnStats(), [progress]);
  const queue = useMemo(() => getReviewQueue(), [progress]);

  const initialSet = useMemo(() => {
    if (sessionOnly && progress.learn?.lastSession?.missedIds?.length) {
      return wrapSet(buildSessionMissSet(progress.learn.lastSession.missedIds));
    }
    return wrapSet(buildMissReviewSet(20));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- start once

  const [set, setSet] = useState(initialSet);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [session, setSession] = useState({ correct: 0, answered: 0, masteredNow: 0 });
  const [done, setDone] = useState(false);

  const current = set[index];
  const learnMeta = current
    ? progress.learn?.bank?.[current.id] || current._learn
    : null;

  const startAll = () => {
    const next = wrapSet(buildMissReviewSet(20));
    setSet(next);
    setIndex(0);
    setPicked(null);
    setSession({ correct: 0, answered: 0, masteredNow: 0 });
    setDone(false);
    setProgress(loadProgress());
  };

  const startSession = () => {
    const ids = loadProgress().learn?.lastSession?.missedIds || [];
    const next = wrapSet(buildSessionMissSet(ids));
    setSet(next);
    setIndex(0);
    setPicked(null);
    setSession({ correct: 0, answered: 0, masteredNow: 0 });
    setDone(false);
    setProgress(loadProgress());
  };

  const selectDisplay = useCallback(
    (displayIndex) => {
      if (picked != null || !current) return;
      const c = current.choices[displayIndex];
      if (!c) return;
      const correct = c.originalIndex === current.answer;
      setPicked({ originalIndex: c.originalIndex, correct });
      recordQuizAnswer(current.domain, correct);
      const state = recordLearnEvent({
        id: current.id,
        domain: current.domain,
        kind: 'quiz',
        correct,
        prompt: current.question,
      });
      setProgress(state);
      const becameMastered = state.learn?.bank?.[current.id]?.mastered;
      setSession((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        answered: s.answered + 1,
        masteredNow: s.masteredNow + (becameMastered && correct ? 1 : 0),
      }));
    },
    [picked, current],
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
    enabled: !done && set.length > 0,
    answered: picked != null,
  });

  if (set.length === 0 && !done) {
    return (
      <>
        <header className="page-header">
          <span className="eyebrow">Study loop</span>
          <h1>Review misses</h1>
          <p>
            Nothing in your miss bank yet. Misses from practice quizzes and mock exams show up
            here so you can re-drill until they stick (2 correct in a row masters an item).
          </p>
        </header>
        <div className="card">
          <h2>How learning works here</h2>
          <ol className="how-list">
            <li>Answer quizzes or mock exams as usual.</li>
            <li>Every wrong answer is saved to your personal miss bank (local only).</li>
            <li>Review here. Get it right twice in a row to mark it mastered.</li>
            <li>Dashboard tracks active misses by domain so you know what to study.</li>
          </ol>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/quiz">
              Practice quiz
            </Link>
            <Link className="btn" to="/mock">
              Mock exam
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (done) {
    const pct = session.answered
      ? Math.round((session.correct / session.answered) * 100)
      : 0;
    const remaining = getLearnStats().activeCount;
    return (
      <>
        <header className="page-header">
          <span className="eyebrow">Review complete</span>
          <h1>
            {session.correct}/{session.answered} ({pct}%)
          </h1>
          <p>
            {session.masteredNow > 0
              ? `Mastered ${session.masteredNow} item(s) this round. `
              : 'Keep going — items master after 2 correct in a row. '}
            {remaining} still active in your miss bank.
          </p>
        </header>
        <div className="card">
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={startAll} disabled={remaining === 0}>
              Review more misses
            </button>
            <Link className="btn" to="/quiz">
              Mixed practice
            </Link>
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
        <span className="eyebrow">Study loop · Learn from mistakes</span>
        <h1>Review misses</h1>
        <p>
          Active misses: {stats.activeCount} · Mastered: {stats.masteredCount}
          {sessionOnly ? ' · Showing last session only' : ''}
          . Keys: 1–4, Enter next.
        </p>
      </header>

      <div className="card study-banner" style={{ marginBottom: '1rem' }}>
        <div className="stat-row">
          {DOMAINS.map((d) => (
            <div key={d.id} className="stat">
              <span className="label">D{d.id} misses</span>
              <span className="value">{stats.byDomain[d.id] || 0}</span>
            </div>
          ))}
        </div>
        <div className="btn-row">
          <button type="button" className="btn" onClick={startAll}>
            Full miss bank
          </button>
          <button
            type="button"
            className="btn"
            onClick={startSession}
            disabled={!stats.lastSession?.missedIds?.length}
          >
            Last session misses
            {stats.lastSession?.missedIds?.length
              ? ` (${stats.lastSession.missedIds.length})`
              : ''}
          </button>
          {stats.masteredCount > 0 && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setProgress(clearMasteredFromBank());
              }}
            >
              Clear mastered from bank
            </button>
          )}
        </div>
      </div>

      {current && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="eyebrow">
              {index + 1}/{set.length} · Domain {current.domain}
              {current.objective ? ` · ${current.objective}` : ''}
            </span>
            <span className="timer">
              Missed {learnMeta?.missCount || '?'}×
              {learnMeta?.correctStreak
                ? ` · streak ${learnMeta.correctStreak}/2 to master`
                : ' · streak 0/2 to master'}
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
                  onClick={() => selectDisplay(i)}
                >
                  <span className="key-hint">{i + 1}</span>
                  {c.text}
                </button>
              );
            })}
          </div>
          {picked && (
            <div className={`feedback ${picked.correct ? 'good' : 'bad'}`}>
              {(() => {
                if (!picked.correct) return 'Still learning this one. Saved back to the bank.';
                const entry = progress.learn?.bank?.[current.id];
                if (entry?.mastered) return 'Correct — mastered. This one is sticking.';
                if ((entry?.correctStreak || 0) >= 1)
                  return 'Correct — one more right in a row will master it.';
                return 'Correct.';
              })()}
              <span className="explain">{current.explain}</span>
            </div>
          )}
          <div className="btn-row">
            <button type="button" className="btn btn-primary" disabled={!picked} onClick={next}>
              {index + 1 >= set.length ? 'Finish review' : 'Next miss'}
            </button>
          </div>
        </div>
      )}

      {queue.length > 0 && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2>Queue preview</h2>
          <p className="muted">Highest-priority items in your bank (not necessarily this set order).</p>
          <ul className="review-list" style={{ marginTop: '0.75rem' }}>
            {queue.slice(0, 8).map((i) => (
              <li key={i.id}>
                <strong>D{i.domain}</strong> · missed {i.missCount}×
                {i.correctStreak ? ` · streak ${i.correctStreak}` : ''}
                <span className="explain">{i.prompt || i.id}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
