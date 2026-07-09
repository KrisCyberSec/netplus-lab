import { useState, useCallback } from 'react';
import { generateSubnetProblem, checkSubnetAnswers } from '../lib/subnet';
import { loadProgress, recordResult, accuracy } from '../lib/progress';

const EMPTY = { broadcast: '', mask: '', usableHosts: '', firstHost: '', lastHost: '' };

export default function SubnetDrill() {
  const [problem, setProblem] = useState(() => generateSubnetProblem());
  const [answers, setAnswers] = useState(EMPTY);
  const [checked, setChecked] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [progress, setProgress] = useState(() => loadProgress());

  const next = useCallback(() => {
    setProblem(generateSubnetProblem());
    setAnswers(EMPTY);
    setChecked(null);
    setShowSolution(false);
  }, []);

  function update(field, value) {
    setAnswers((a) => ({ ...a, [field]: value }));
    setChecked(null);
  }

  function onCheck(e) {
    e.preventDefault();
    const result = checkSubnetAnswers(problem, answers);
    setChecked(result);
    setProgress(recordResult('subnet', { correct: result.allCorrect }));
  }

  function reveal() {
    setShowSolution(true);
    setAnswers({
      broadcast: problem.broadcast,
      mask: problem.mask,
      usableHosts: String(problem.usableHosts),
      firstHost: problem.firstHost,
      lastHost: problem.lastHost,
    });
  }

  const fieldClass = (key) => {
    if (!checked?.results || checked.results[key] === undefined) return '';
    return checked.results[key] ? 'ok' : 'bad';
  };

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Domain 1 · 5 · MVP hero</span>
        <h1>Subnetting trainer</h1>
        <p>
          Given a network and prefix, fill in mask, broadcast, host range, and usable host count.
          Streak: {progress.subnet.streak || 0} · Best: {progress.subnet.bestStreak || 0} · Accuracy:{' '}
          {accuracy(progress.subnet) != null ? `${accuracy(progress.subnet)}%` : '—'}
        </p>
      </header>

      <div className="card">
        <div className="eyebrow">Problem</div>
        <p className="cidr-hero">{problem.cidr}</p>
        <p className="muted" style={{ marginBottom: '1rem' }}>
          Network address and CIDR prefix. Classic private-range style problems.
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
            <button type="button" className="btn" onClick={next}>
              New problem
            </button>
            <button type="button" className="btn btn-ghost" onClick={reveal}>
              Reveal solution
            </button>
          </div>
        </form>

        {checked && (
          <div className={`feedback ${checked.allCorrect ? 'good' : 'bad'}`}>
            {checked.allCorrect
              ? 'All correct. Nice subnetting.'
              : `${checked.correct}/${checked.total} fields correct. Fix the red fields or reveal.`}
          </div>
        )}

        {showSolution && (
          <div className="feedback good" style={{ marginTop: '0.75rem' }}>
            <strong>Solution</strong>
            <span className="explain mono" style={{ display: 'block', marginTop: '0.5rem' }}>
              Mask {problem.mask} · Broadcast {problem.broadcast} · Hosts {problem.firstHost} –{' '}
              {problem.lastHost} · Usable {problem.usableHosts} (total addresses {problem.totalHosts})
            </span>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>Quick tips</h2>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          <li>Usable hosts ≈ 2^(host bits) − 2 (except special /31 and /32 cases).</li>
          <li>Broadcast = last address in the block; network = first.</li>
          <li>/30 is common on point-to-point links (2 usable hosts).</li>
        </ul>
      </div>
    </>
  );
}
