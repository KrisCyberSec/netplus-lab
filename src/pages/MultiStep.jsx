import { useState } from 'react';
import { MULTI_STEP_SCENARIOS } from '../data/multiStep';
import { loadProgress, recordMultiStepProgress } from '../lib/progress';
import PageHeader from '../components/PageHeader';
import SessionDone from '../components/SessionDone';
import { usePathVisit } from '../hooks/usePathVisit';

export default function MultiStep() {
  usePathVisit('pbq', 'multi-step');
  const [progress, setProgress] = useState(() => loadProgress());
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [runCorrect, setRunCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const scenario = MULTI_STEP_SCENARIOS[scenarioIndex];
  const step = scenario.steps[stepIndex];
  const completed = new Set(progress.multiStep?.completedIds || []);

  function select(i) {
    if (picked != null) return;
    const correct = i === step.answer;
    setPicked({ i, correct });
    if (correct) setRunCorrect((c) => c + 1);
    const isLast = stepIndex >= scenario.steps.length - 1;
    setProgress(
      recordMultiStepProgress({
        id: scenario.id,
        correct,
        finished: isLast && correct,
      }),
    );
  }

  function next() {
    if (picked == null) return;
    if (stepIndex + 1 >= scenario.steps.length) {
      setFinished(true);
      return;
    }
    setStepIndex((s) => s + 1);
    setPicked(null);
  }

  function startScenario(idx) {
    setScenarioIndex(idx);
    setStepIndex(0);
    setPicked(null);
    setRunCorrect(0);
    setFinished(false);
  }

  if (finished) {
    const total = scenario.steps.length;
    const allCorrect = runCorrect === total;
    return (
      <>
        <PageHeader eyebrow="Multi-step complete" title={scenario.title}>
          <p>
            {runCorrect}/{total} steps correct.
            {allCorrect
              ? ' Full clear — PBQ-style chain complete.'
              : ' Review the explanations and retry when ready.'}
          </p>
        </PageHeader>
        <div className="card">
          <SessionDone
            primaryTo="/pbq"
            primaryLabel="More multi-step"
            secondaryTo="/"
            secondaryLabel="Back to coach"
            showCoach={false}
            extra={
              <div className="btn-row" style={{ marginBottom: '0.5rem' }}>
                <button type="button" className="btn" onClick={() => startScenario(scenarioIndex)}>
                  Retry this scenario
                </button>
              </div>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="PBQ-style practice · Domain-weighted stories" title="Multi-step scenarios">
        <p>
          Sequential decisions like performance-based thinking. Cleared {completed.size}/
          {MULTI_STEP_SCENARIOS.length}. Not official CompTIA PBQs — exam-style practice only.
        </p>
      </PageHeader>

      <div className="pill-row" style={{ marginBottom: '1rem' }}>
        {MULTI_STEP_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`pill ${i === scenarioIndex ? 'active' : ''}`}
            onClick={() => startScenario(i)}
          >
            {completed.has(s.id) ? '✓ ' : ''}
            {i + 1}. {s.title.slice(0, 22)}
            {s.title.length > 22 ? '…' : ''}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="eyebrow">
          Scenario {scenarioIndex + 1}/{MULTI_STEP_SCENARIOS.length} · Domain {scenario.domain}
        </div>
        <h2 style={{ marginTop: 0 }}>{scenario.title}</h2>
        <div className="prompt-box">{scenario.setup}</div>
      </div>

      <div className="card">
        <div className="eyebrow">
          Step {stepIndex + 1}/{scenario.steps.length}
        </div>
        <div className="progress-bar" style={{ margin: '0.5rem 0 1rem' }}>
          <span style={{ width: `${((stepIndex + (picked ? 1 : 0)) / scenario.steps.length) * 100}%` }} />
        </div>
        <p style={{ fontWeight: 600 }}>{step.prompt}</p>
        <div className="choice-list">
          {step.choices.map((c, i) => {
            let cls = 'choice';
            if (picked) {
              if (i === step.answer) cls += ' correct';
              else if (i === picked.i && !picked.correct) cls += ' wrong';
            }
            return (
              <button
                key={c}
                type="button"
                className={cls}
                disabled={!!picked}
                onClick={() => select(i)}
              >
                <span className="key-hint">{i + 1}</span>
                {c}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className={`feedback ${picked.correct ? 'good' : 'bad'}`}>
            {picked.correct ? 'Correct — continue the chain.' : 'Not quite.'}
            <span className="explain">{step.explain}</span>
          </div>
        )}
        <div className="btn-row">
          <button type="button" className="btn btn-primary" disabled={!picked} onClick={next}>
            {stepIndex + 1 >= scenario.steps.length ? 'Finish scenario' : 'Next step'}
          </button>
        </div>
      </div>
    </>
  );
}
