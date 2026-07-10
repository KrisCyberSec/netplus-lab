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
import { usePathVisit } from '../hooks/usePathVisit';
import PageHeader from '../components/PageHeader';
import SessionDone from '../components/SessionDone';

function wrapSet(raw) {
  return raw.map((q) => ({ ...q, choices: prepareChoices(q) }));
}

export default function ReviewMisses() {
  usePathVisit('review-loop', 'review');
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
        <PageHeader eyebrow="Study loop" title="Review misses">
          <p>
            Nothing here yet. Wrong answers from quizzes and mocks land in this bank. Get each
            item right <strong>twice in a row</strong> to master it.
          </p>
        </PageHeader>
        <div className="card">
          <h2>How to fill the bank</h2>
          <ol className="how-list">
            <li>Take a practice quiz or mock exam.</li>
            <li>Misses are saved automatically (this browser only).</li>
            <li>Come back here and re-drill until mastered.</li>
            <li>Then return to the coach for the next path step.</li>
          </ol>
          <SessionDone
            primaryTo="/quiz"
            primaryLabel="Practice quiz"
            secondaryTo="/mock"
            secondaryLabel="Mock exam"
          />
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
        <PageHeader eyebrow="Review complete" title={`${session.correct}/${session.answered} (${pct}%)`}>
          <p>
            {session.masteredNow > 0
              ? `Mastered ${session.masteredNow} item(s) this round. `
              : 'Items master after 2 correct in a row. '}
            {remaining} still active in your miss bank.
          </p>
        </PageHeader>
        <div className="card">
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={startAll}
              disabled={remaining === 0}
            >
              Review more misses
            </button>
          </div>
          <SessionDone
            primaryTo="/"
            primaryLabel="Back to coach"
            secondaryTo="/quiz"
            secondaryLabel="Mixed practice"
            showCoach={false}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Study loop · Learn from mistakes" title="Review misses">
        <p>
          Active: {stats.activeCount} · Mastered: {stats.masteredCount}
          {sessionOnly ? ' · Last session only' : ''}
          . Keys: 1–4, Enter next.
        </p>
      </PageHeader>

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
