import { useState, useEffect, useCallback } from 'react';
import { PORTS } from '../data/ports';
import { shuffle } from '../lib/shuffle';
import { loadProgress, recordResult, accuracy } from '../lib/progress';
import { usePathVisit } from '../hooks/usePathVisit';
import { useChoiceKeys } from '../hooks/useChoiceKeys';
import PageHeader from '../components/PageHeader';

function buildRound() {
  const item = PORTS[Math.floor(Math.random() * PORTS.length)];
  const mode = Math.random() < 0.5 ? 'port-to-name' : 'name-to-port';
  let choices;
  if (mode === 'port-to-name') {
    const others = shuffle(PORTS.filter((p) => p.name !== item.name)).slice(0, 3);
    choices = shuffle([item, ...others]).map((p) => p.name);
  } else {
    const others = shuffle(PORTS.filter((p) => p.port !== item.port)).slice(0, 3);
    choices = shuffle([item, ...others]).map((p) => String(p.port));
  }
  return { item, mode, choices };
}

export default function PortsDrill() {
  usePathVisit('ports');
  const [round, setRound] = useState(() => buildRound());
  const [picked, setPicked] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [round]);

  const next = useCallback(() => {
    setRound(buildRound());
    setPicked(null);
    setSeconds(0);
  }, []);

  const selectByIndex = useCallback(
    (displayIndex) => {
      if (picked != null) return;
      const choice = round.choices[displayIndex];
      if (choice == null) return;
      const correct =
        round.mode === 'port-to-name'
          ? choice === round.item.name
          : Number(choice) === round.item.port;
      setPicked({ choice, correct });
      setProgress(recordResult('ports', { correct }));
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

  const prompt =
    round.mode === 'port-to-name'
      ? `Port ${round.item.port} (${round.item.protocol}) is which service?`
      : `Which port number is ${round.item.name}?`;

  const correctAnswer =
    round.mode === 'port-to-name' ? round.item.name : String(round.item.port);

  return (
    <>
      <PageHeader eyebrow="Domain 1 · Lightning round" title="Ports & protocols">
        <p>
          Streak {progress.ports.streak || 0} · Best {progress.ports.bestStreak || 0} · Accuracy{' '}
          {accuracy(progress.ports) != null ? `${accuracy(progress.ports)}%` : '—'} ·{' '}
          <span className="timer">{seconds}s</span> · Keys 1–4, Enter next
        </p>
      </PageHeader>

      <div className="card">
        <div className="prompt-box">{prompt}</div>
        <div className="choice-list">
          {round.choices.map((c, i) => {
            let cls = 'choice';
            if (picked) {
              if (c === correctAnswer) cls += ' correct';
              else if (c === picked.choice && !picked.correct) cls += ' wrong';
            }
            return (
              <button
                key={c}
                type="button"
                className={cls}
                disabled={!!picked}
                onClick={() => selectByIndex(i)}
              >
                <span className="key-hint">{i + 1}</span>
                {c}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={`feedback ${picked.correct ? 'good' : 'bad'}`}>
            {picked.correct ? 'Correct.' : `Incorrect. Answer: ${correctAnswer}`}
            <span className="explain">
              {round.item.name} · {round.item.port}/{round.item.protocol} — {round.item.note}
            </span>
          </div>
        )}

        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={next}>
            Next{picked ? ' · Enter' : ''}
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>Reference ({PORTS.length} ports)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Port</th>
                <th>Proto</th>
                <th>Service</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {PORTS.map((p) => (
                <tr key={`${p.port}-${p.name}`}>
                  <td className="mono">{p.port}</td>
                  <td>{p.protocol}</td>
                  <td>{p.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
