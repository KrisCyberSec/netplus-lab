import { useState, useCallback, useEffect } from 'react';
import {
  generateSubnetProblem,
  checkSubnetAnswers,
} from '../lib/subnet';
import {
  loadProgress,
  recordResult,
  recordSubnetTimed,
  accuracy,
} from '../lib/progress';
import { usePathVisit } from '../hooks/usePathVisit';

const EMPTY = { broadcast: '', mask: '', usableHosts: '', firstHost: '', lastHost: '' };

const TIMED_TOTAL = 10;
const TIMED_SECONDS = 5 * 60;

export default function SubnetDrill() {
  usePathVisit('subnet', 'subnet-timed');
  const [mode, setMode] = useState('practice'); // practice | timed | timed-done
  const [problem, setProblem] = useState(() => generateSubnetProblem());
  const [answers, setAnswers] = useState(EMPTY);
  const [checked, setChecked] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [progress, setProgress] = useState(() => loadProgress());
  const [timed, setTimed] = useState({
    index: 0,
    correct: 0,
    secondsLeft: TIMED_SECONDS,
  });

  const next = useCallback(() => {
    setProblem(generateSubnetProblem());
    setAnswers(EMPTY);
    setChecked(null);
    setShowSolution(false);
  }, []);

  useEffect(() => {
    if (mode !== 'timed') return undefined;
    if (timed.secondsLeft <= 0) {
      setProgress(
        recordSubnetTimed({
          correct: timed.correct,
          total: timed.index,
          seconds: TIMED_SECONDS,
        }),
      );
      setMode('timed-done');
      return undefined;
    }
    const t = setTimeout(() => {
      setTimed((s) => ({ ...s, secondsLeft: s.secondsLeft - 1 }));
    }, 1000);
    return () => clearTimeout(t);
  }, [mode, timed.secondsLeft, timed.correct, timed.index]);

  function update(field, value) {
    setAnswers((a) => ({ ...a, [field]: value }));
    setChecked(null);
  }

  function onCheck(e) {
    e.preventDefault();
    const result = checkSubnetAnswers(problem, answers);
    setChecked(result);
    setProgress(recordResult('subnet', { correct: result.allCorrect }));

    if (mode === 'timed') {
      const nextCorrect = timed.correct + (result.allCorrect ? 1 : 0);
      const nextIndex = timed.index + 1;
      if (nextIndex >= TIMED_TOTAL) {
        const elapsed = TIMED_SECONDS - timed.secondsLeft;
        setProgress(
          recordSubnetTimed({
            correct: nextCorrect,
            total: TIMED_TOTAL,
            seconds: elapsed,
          }),
        );
        setTimed((s) => ({ ...s, index: nextIndex, correct: nextCorrect }));
        setMode('timed-done');
      } else {
        setTimed((s) => ({
          ...s,
          index: nextIndex,
          correct: nextCorrect,
        }));
        // Auto-advance after short beat
        setTimeout(() => {
          setProblem(generateSubnetProblem());
          setAnswers(EMPTY);
          setChecked(null);
          setShowSolution(false);
        }, 600);
      }
    }
  }

  function reveal() {
    if (mode === 'timed') return;
    setShowSolution(true);
    setAnswers({
      broadcast: problem.broadcast,
      mask: problem.mask,
      usableHosts: String(problem.usableHosts),
      firstHost: problem.firstHost,
      lastHost: problem.lastHost,
    });
  }

  function startTimed() {
    setMode('timed');
    setTimed({ index: 0, correct: 0, secondsLeft: TIMED_SECONDS });
    setProblem(generateSubnetProblem());
    setAnswers(EMPTY);
    setChecked(null);
    setShowSolution(false);
  }

  const fieldClass = (key) => {
    if (!checked?.results || checked.results[key] === undefined) return '';
    return checked.results[key] ? 'ok' : 'bad';
  };

  const mm = String(Math.floor(timed.secondsLeft / 60)).padStart(2, '0');
  const ss = String(timed.secondsLeft % 60).padStart(2, '0');

  if (mode === 'timed-done') {
    const total = Math.max(timed.index, 1);
    const pct = Math.round((timed.correct / Math.min(total, TIMED_TOTAL)) * 100);
    return (
      <>
        <header className="page-header">
          <span className="eyebrow">Timed challenge</span>
          <h1>
            {timed.correct}/{Math.min(timed.index, TIMED_TOTAL)} correct
          </h1>
          <p>
            Score {pct}%.
            {progress.subnet.timedBest
              ? ` Best: ${progress.subnet.timedBest.score}% (${progress.subnet.timedBest.correct}/${progress.subnet.timedBest.total}).`
              : ''}
          </p>
        </header>
        <div className="card">
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={startTimed}>
              Try again
            </button>
            <button type="button" className="btn" onClick={() => setMode('practice')}>
              Back to practice
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Domain 1 · 5 · {mode === 'timed' ? 'Timed' : 'Practice'}</span>
        <h1>Subnetting trainer</h1>
        <p>
          {mode === 'timed' ? (
            <>
              Problem {timed.index + 1}/{TIMED_TOTAL} · Correct {timed.correct} ·{' '}
              <span className={`exam-timer ${timed.secondsLeft < 60 ? 'low' : ''}`}>
                {mm}:{ss}
              </span>
            </>
          ) : (
            <>
              Streak: {progress.subnet.streak || 0} · Best: {progress.subnet.bestStreak || 0} ·
              Accuracy:{' '}
              {accuracy(progress.subnet) != null ? `${accuracy(progress.subnet)}%` : '—'}
              {progress.subnet.timedBest
                ? ` · Timed best ${progress.subnet.timedBest.score}%`
                : ''}
            </>
          )}
        </p>
      </header>

      <div className="pill-row" style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          className={`pill ${mode === 'practice' ? 'active' : ''}`}
          onClick={() => setMode('practice')}
          disabled={mode === 'timed'}
        >
          Practice
        </button>
        <button
          type="button"
          className={`pill ${mode === 'timed' ? 'active' : ''}`}
          onClick={startTimed}
        >
          Timed · {TIMED_TOTAL} in {TIMED_SECONDS / 60}m
        </button>
      </div>

      <div className="card">
        <div className="eyebrow">Problem</div>
        <p className="cidr-hero">{problem.cidr}</p>
        <p className="muted" style={{ marginBottom: '1rem' }}>
          {mode === 'timed'
            ? 'Fill every field. Check advances automatically.'
            : 'Network address and CIDR prefix. Classic private-range style problems.'}
        </p>

        <form onSubmit={onCheck}>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="mask">Subnet mask</label>
              <input
                id="mask"
                className={fieldClass('mask')}
                value={answers.mask}
                onChange={(e) => update('mask', e.target.value)}
                placeholder="255.255.255.0"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="field">
              <label htmlFor="broadcast">Broadcast address</label>
              <input
                id="broadcast"
                className={fieldClass('broadcast')}
                value={answers.broadcast}
                onChange={(e) => update('broadcast', e.target.value)}
                placeholder="x.x.x.x"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="field">
              <label htmlFor="first">First usable host</label>
              <input
                id="first"
                className={fieldClass('firstHost')}
                value={answers.firstHost}
                onChange={(e) => update('firstHost', e.target.value)}
                placeholder="x.x.x.x"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="field">
              <label htmlFor="last">Last usable host</label>
              <input
                id="last"
                className={fieldClass('lastHost')}
                value={answers.lastHost}
                onChange={(e) => update('lastHost', e.target.value)}
                placeholder="x.x.x.x"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="field">
              <label htmlFor="usable">Usable host count</label>
              <input
                id="usable"
                className={fieldClass('usableHosts')}
                value={answers.usableHosts}
                onChange={(e) => update('usableHosts', e.target.value)}
                placeholder="e.g. 254"
                autoComplete="off"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn btn-primary">
              Check answers
            </button>
            {mode === 'practice' && (
              <>
                <button type="button" className="btn" onClick={next}>
                  New problem
                </button>
                <button type="button" className="btn btn-ghost" onClick={reveal}>
                  Reveal solution
                </button>
              </>
            )}
          </div>
        </form>

        {checked && (
          <div className={`feedback ${checked.allCorrect ? 'good' : 'bad'}`}>
            {checked.allCorrect
              ? 'All correct. Nice subnetting.'
              : `${checked.correct}/${checked.total} fields correct. Fix the red fields or reveal.`}
          </div>
        )}

        {showSolution && mode === 'practice' && (
          <div className="feedback good" style={{ marginTop: '0.75rem' }}>
            <strong>Solution</strong>
            <span className="explain mono" style={{ display: 'block', marginTop: '0.5rem' }}>
              Mask {problem.mask} · Broadcast {problem.broadcast} · Hosts {problem.firstHost} –{' '}
              {problem.lastHost} · Usable {problem.usableHosts} (total addresses {problem.totalHosts})
            </span>
          </div>
        )}
      </div>

      {mode === 'practice' && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2>Quick tips</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            <li>Usable hosts ≈ 2^(host bits) − 2 (except special /31 and /32 cases).</li>
            <li>Broadcast = last address in the block; network = first.</li>
            <li>/30 is common on point-to-point links (2 usable hosts).</li>
            <li>Use Timed mode to pressure-test speed before exam day.</li>
          </ul>
        </div>
      )}
    </>
  );
}
