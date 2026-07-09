import { useState, useCallback } from 'react';
import { TOOLS, TOOL_PROMPTS } from '../data/tools';
import { shuffle } from '../lib/shuffle';
import { loadProgress, recordResult, accuracy } from '../lib/progress';
import { usePathVisit } from '../hooks/usePathVisit';

function buildRound() {
  const prompt = TOOL_PROMPTS[Math.floor(Math.random() * TOOL_PROMPTS.length)];
  const answer = TOOLS.find((t) => t.id === prompt.answerId);
  const others = shuffle(TOOLS.filter((t) => t.id !== prompt.answerId)).slice(0, 3);
  const choices = shuffle([answer, ...others]);
  return { prompt, answer, choices };
}

export default function ToolsDrill() {
  usePathVisit('tools');
  const [round, setRound] = useState(() => buildRound());
  const [picked, setPicked] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());

  const next = useCallback(() => {
    setRound(buildRound());
    setPicked(null);
  }, []);

  function select(id) {
    if (picked != null) return;
    const correct = id === round.answer.id;
    setPicked({ id, correct });
    setProgress(recordResult('tools', { correct }));
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Domains 3 · 5 · Tool selection</span>
        <h1>Tool picker</h1>
        <p>
          Match the job to the right CLI or hardware tool. Accuracy:{' '}
          {accuracy(progress.tools) != null ? `${accuracy(progress.tools)}%` : '—'}
        </p>
      </header>

      <div className="card">
        <div className="prompt-box">{round.prompt.prompt}</div>
        <div className="choice-list">
          {round.choices.map((t) => {
            let cls = 'choice';
            if (picked) {
              if (t.id === round.answer.id) cls += ' correct';
              else if (t.id === picked.id && !picked.correct) cls += ' wrong';
            }
            return (
              <button
                key={t.id}
                type="button"
                className={cls}
                disabled={!!picked}
                onClick={() => select(t.id)}
              >
                <strong>{t.name}</strong>
                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {t.category}
                </span>
              </button>
            );
          })}
        </div>
        {picked && (
          <div className={`feedback ${picked.correct ? 'good' : 'bad'}`}>
            {picked.correct ? 'Correct tool.' : `Use ${round.answer.name}.`}
            <span className="explain">{round.prompt.explain}</span>
          </div>
        )}
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={next}>
            Next
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>Tool locker</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Category</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((t) => (
                <tr key={t.id}>
                  <td className="mono">{t.name}</td>
                  <td>{t.category}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
