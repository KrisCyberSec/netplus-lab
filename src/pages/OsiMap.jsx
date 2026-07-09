import { useState } from 'react';
import { OSI_LAYERS, OSI_QUIZ } from '../data/osi';
import { shuffle } from '../lib/shuffle';
import { loadProgress, recordResult, accuracy } from '../lib/progress';

export default function OsiMap() {
  const [active, setActive] = useState(OSI_LAYERS[0]);
  const [quiz, setQuiz] = useState(() => shuffle(OSI_QUIZ)[0]);
  const [picked, setPicked] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());

  function answer(layerNum) {
    if (picked != null) return;
    const correct = layerNum === quiz.answer;
    setPicked({ layerNum, correct });
    setProgress(recordResult('osi', { correct }));
  }

  function nextQuiz() {
    setQuiz(shuffle(OSI_QUIZ)[0]);
    setPicked(null);
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Domain 1 · Interactive</span>
        <h1>OSI model map</h1>
        <p>
          Explore each layer, then lock in with quick layer ID quizzes. Accuracy:{' '}
          {accuracy(progress.osi) != null ? `${accuracy(progress.osi)}%` : '—'}
        </p>
      </header>

      <div className="grid-2">
        <div className="card">
          <h2>Layers (7 → 1)</h2>
          <div className="osi-stack">
            {OSI_LAYERS.map((layer) => (
              <button
                key={layer.layer}
                type="button"
                className={`osi-layer ${active.layer === layer.layer ? 'active' : ''}`}
                onClick={() => setActive(layer)}
              >
                <div className="osi-num">{layer.layer}</div>
                <div className="osi-body">
                  <strong>{layer.name}</strong>
                  <span>PDU: {layer.pdu}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card osi-detail">
          <div className="eyebrow">Layer {active.layer}</div>
          <h2 style={{ marginTop: 0 }}>{active.name}</h2>
          <dl>
            <dt>Job</dt>
            <dd>{active.job}</dd>
            <dt>PDU</dt>
            <dd>{active.pdu}</dd>
            <dt>Devices</dt>
            <dd>{active.devices}</dd>
            <dt>Examples</dt>
            <dd>{active.examples}</dd>
          </dl>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>Quick quiz</h2>
        <div className="prompt-box">{quiz.q}</div>
        <div className="choice-list">
          {quiz.options.map((n) => {
            const layer = OSI_LAYERS.find((l) => l.layer === n);
            let cls = 'choice';
            if (picked) {
              if (n === quiz.answer) cls += ' correct';
              else if (n === picked.layerNum && !picked.correct) cls += ' wrong';
            }
            return (
              <button key={n} type="button" className={cls} disabled={!!picked} onClick={() => answer(n)}>
                Layer {n} — {layer?.name}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className={`feedback ${picked.correct ? 'good' : 'bad'}`}>
            {picked.correct ? 'Correct.' : `Layer ${quiz.answer} is the answer.`}
          </div>
        )}
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={nextQuiz}>
            Next question
          </button>
        </div>
      </div>
    </>
  );
}
