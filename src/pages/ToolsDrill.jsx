import { useState, useCallback } from 'react';
import { TOOLS, TOOL_PROMPTS } from '../data/tools';
import { shuffle } from '../lib/shuffle';
import { loadProgress, recordResult, accuracy } from '../lib/progress';
import { usePathVisit } from '../hooks/usePathVisit';
import { useChoiceKeys } from '../hooks/useChoiceKeys';
import PageHeader from '../components/PageHeader';

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

  const selectByIndex = useCallback(
    (displayIndex) => {
      if (picked != null) return;
      const t = round.choices[displayIndex];
      if (!t) return;
      const correct = t.id === round.answer.id;
      setPicked({ id: t.id, correct });
      setProgress(recordResult('tools', { correct }));
    },
    [picked, round],
  );

  useChoiceKeys({
    choiceCount: round.choices.length,
    onSelect: selectByIndex,
    onNext: next,
    enabled: true,
    answered: picked != null,
  });

  return (
    <>
      <PageHeader eyebrow="Domains 3 · 5 · Tool selection" title="Tool picker">
        <p>
          Match the job to the right tool. Path goal: 10+ at ≥70%. Accuracy:{' '}
          {accuracy(progress.tools) != null ? `${accuracy(progress.tools)}%` : '—'} · Keys 1–4,
          Enter
        </p>
      </PageHeader>

      <div className="card">
        <div className="prompt-box">{round.prompt.prompt}</div>
        <div className="choice-list">
          {round.choices.map((t, i) => {
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
                onClick={() => selectByIndex(i)}
              >
                <span className="key-hint">{i + 1}</span>
                <span>
                  <strong>{t.name}</strong>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {t.category}
                  </span>
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
