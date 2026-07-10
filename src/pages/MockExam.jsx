import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildWeightedMock } from '../data/questions';
import { DOMAINS } from '../data/domains';
import { shuffle } from '../lib/shuffle';
import {
  loadProgress,
  recordMockExam,
  recordQuizAnswer,
  recordLearnEvent,
  recordStudySession,
  getLearnStats,
} from '../lib/progress';
import { useChoiceKeys } from '../hooks/useChoiceKeys';
import { usePathVisit } from '../hooks/usePathVisit';
import PageHeader from '../components/PageHeader';
import SessionDone from '../components/SessionDone';

function prepareQuestions(n) {
  return buildWeightedMock(n).map((q) => ({
    ...q,
    choices: shuffle(q.choices.map((text, i) => ({ text, i }))).map((c) => ({
      text: c.text,
      originalIndex: c.i,
    })),
  }));
}

const PRESETS = [
  { id: 'quick', label: 'Quick 20', count: 20, minutes: 25 },
  { id: 'standard', label: 'Standard 40', count: 40, minutes: 50 },
  { id: 'long', label: 'Long 60', count: 60, minutes: 75 },
];

export default function MockExam() {
  usePathVisit('mock-baseline', 'mock-improve', 'mock');
  const [preset, setPreset] = useState(PRESETS[1]);
  const [phase, setPhase] = useState('setup'); // setup | exam | results
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // id -> originalIndex
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [progress, setProgress] = useState(() => loadProgress());

  const current = questions[index];
  const answeredCount = Object.keys(answers).length;

  const start = () => {
    const qs = prepareQuestions(preset.count);
    setQuestions(qs);
    setAnswers({});
    setIndex(0);
    setSecondsLeft(preset.minutes * 60);
    setPhase('exam');
  };

  const finish = useCallback(() => {
    let correct = 0;
    const byDomain = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const byDomainCorrect = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const missedIds = [];

    for (const q of questions) {
      byDomain[q.domain] += 1;
      const picked = answers[q.id];
      const ok = picked === q.answer;
      if (ok) {
        correct += 1;
        byDomainCorrect[q.domain] += 1;
      } else {
        missedIds.push(q.id);
      }
      recordQuizAnswer(q.domain, ok);
      recordLearnEvent({
        id: q.id,
        domain: q.domain,
        kind: 'quiz',
        correct: ok,
        prompt: q.question,
      });
    }

    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    recordMockExam({
      score: pct,
      correct,
      total: questions.length,
      byDomain,
      byDomainCorrect,
    });
    setProgress(
      recordStudySession({
        source: 'mock',
        missedIds,
        correct,
        total: questions.length,
      }),
    );
    setPhase('results');
  }, [answers, questions]);

  useEffect(() => {
    if (phase !== 'exam') return undefined;
    if (secondsLeft <= 0) {
      finish();
      return undefined;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secondsLeft, finish]);

  function selectChoice(displayIndex) {
    if (!current || phase !== 'exam') return;
    const c = current.choices[displayIndex];
    if (!c) return;
    setAnswers((a) => ({ ...a, [current.id]: c.originalIndex }));
  }

  function selectByOriginal(originalIndex) {
    if (!current) return;
    setAnswers((a) => ({ ...a, [current.id]: originalIndex }));
  }

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  }, [questions.length]);

  useChoiceKeys({
    choiceCount: current?.choices?.length || 4,
    onSelect: selectChoice,
    onNext: goNext,
    enabled: phase === 'exam',
    answered: current ? answers[current.id] != null : false,
  });

  const domainBreakdown = useMemo(() => {
    if (phase !== 'results') return [];
    return DOMAINS.map((d) => {
      const total = questions.filter((q) => q.domain === d.id).length;
      const correct = questions.filter((q) => q.domain === d.id && answers[q.id] === q.answer).length;
      return { ...d, total, correct, pct: total ? Math.round((correct / total) * 100) : 0 };
    });
  }, [phase, questions, answers]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const lowTime = secondsLeft > 0 && secondsLeft < 120;

  if (phase === 'setup') {
    return (
      <>
        <PageHeader eyebrow="Domain-weighted · Timed" title="Mock exam">
          <p>
            Mixed questions weighted like N10-009. Timer ends = auto-submit. Best after foundations
            and a clear miss bank. Keys: 1–4, Enter next.
          </p>
        </PageHeader>

        <div className="card">
          <h2>Choose a length</h2>
          <div className="pill-row">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pill ${preset.id === p.id ? 'active' : ''}`}
                onClick={() => setPreset(p)}
              >
                {p.label} · {p.minutes} min
              </button>
            ))}
          </div>
          <p className="muted">
            Approx mix: D1 23% · D2 20% · D3 19% · D4 14% · D5 24%. Not an official CompTIA exam.
          </p>
          {progress.mock?.lastScore != null && (
            <p className="muted" style={{ marginTop: '0.75rem' }}>
              Last score: {progress.mock.lastScore}% · Best: {progress.mock.bestScore}% · Attempts:{' '}
              {progress.mock.attempts}
            </p>
          )}
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={start}>
              Start {preset.label}
            </button>
          </div>
        </div>
      </>
    );
  }

  if (phase === 'results') {
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    const missed = questions.length - correct;
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const learn = getLearnStats();
    return (
      <>
        <PageHeader eyebrow="Results" title={`${pct}% · ${correct}/${questions.length}`}>
          <p>
            {pct >= 80
              ? 'Strong pass-range for a study mock. Keep reviewing misses so it sticks.'
              : pct >= 70
                ? 'Borderline. Review misses and drill weak domains next.'
                : 'Review misses first — that is how scores climb.'}
          </p>
        </PageHeader>

        {missed > 0 && (
          <div className="card study-cta" style={{ marginBottom: '1rem' }}>
            <h3>Recommended next</h3>
            <p className="muted">
              {missed} miss{missed === 1 ? '' : 'es'} from this exam ({learn.activeCount} active in
              bank). Review before starting new content.
            </p>
            <SessionDone
              primaryTo="/review?session=1"
              primaryLabel="Review these misses"
              secondaryTo="/"
              secondaryLabel="Back to coach"
              showCoach={false}
            />
          </div>
        )}

        {missed === 0 && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <SessionDone primaryTo="/" primaryLabel="Back to coach" showCoach={false} />
          </div>
        )}

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2>By domain</h2>
          <div className="domain-cards">
            {domainBreakdown.map((d) => (
              <div key={d.id} className="domain-card">
                <div className="domain-weight">{d.pct}%</div>
                <div>
                  <h3>
                    D{d.id} {d.name}
                  </h3>
                  <p>
                    {d.correct}/{d.total} correct
                  </p>
                </div>
                {d.pct < 70 && d.total > 0 && (
                  <Link
                    className="btn"
                    to={`/quiz?domain=${d.id}`}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                  >
                    Drill D{d.id}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="btn-row">
            <button type="button" className="btn" onClick={() => setPhase('setup')}>
              Back to setup
            </button>
            <button type="button" className="btn" onClick={start}>
              Retake same length
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Review misses</h2>
          {questions.filter((q) => answers[q.id] !== q.answer).length === 0 ? (
            <p className="muted">No misses. Clean run.</p>
          ) : (
            <ul className="review-list">
              {questions
                .filter((q) => answers[q.id] !== q.answer)
                .map((q) => (
                  <li key={q.id}>
                    <strong>D{q.domain}</strong> {q.question}
                    <span className="explain">
                      Answer: {q.choices.find((c) => c.originalIndex === q.answer)?.text ?? q.choices[q.answer]} —{' '}
                      {q.explain}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </>
    );
  }

  // exam phase
  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Mock exam in progress</span>
        <h1>
          Question {index + 1}
          <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1.1rem' }}>
            {' '}
            / {questions.length}
          </span>
        </h1>
        <p>
          Answered {answeredCount}/{questions.length}
          <span className={`exam-timer ${lowTime ? 'low' : ''}`}>
            {' '}
            · {mm}:{ss}
          </span>
        </p>
      </header>

      <div className="progress-bar" style={{ marginBottom: '1rem' }}>
        <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      {current && (
        <div className="card">
          <div className="eyebrow">
            Domain {current.domain}
            {current.objective ? ` · ${current.objective}` : ''}
          </div>
          <p style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>{current.question}</p>
          <div className="choice-list">
            {current.choices.map((c, i) => {
              const selected = answers[current.id] === c.originalIndex;
              return (
                <button
                  key={c.text}
                  type="button"
                  className={`choice ${selected ? 'selected' : ''}`}
                  onClick={() => selectByOriginal(c.originalIndex)}
                >
                  <span className="key-hint">{i + 1}</span>
                  {c.text}
                </button>
              );
            })}
          </div>
          <div className="btn-row">
            <button
              type="button"
              className="btn"
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn"
              disabled={index >= questions.length - 1}
              onClick={goNext}
            >
              Next
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const unanswered = questions.length - Object.keys(answers).length;
                if (
                  unanswered > 0 &&
                  !window.confirm(
                    `${unanswered} unanswered question${unanswered === 1 ? '' : 's'} will count as wrong. Submit anyway?`,
                  )
                ) {
                  return;
                }
                finish();
              }}
            >
              Submit exam
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '0.95rem' }}>Jump to</h2>
        <div className="pill-row">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              className={`pill ${i === index ? 'active' : ''} ${answers[q.id] != null ? 'answered' : ''}`}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
