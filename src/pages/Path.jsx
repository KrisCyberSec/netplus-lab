import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { loadProgress } from '../lib/progress';
import { getPathStatus } from '../lib/coach';
import PageHeader from '../components/PageHeader';

export default function Path() {
  const [tick, setTick] = useState(0);
  const progress = useMemo(() => loadProgress(), [tick]);
  const path = useMemo(() => getPathStatus(progress), [progress]);

  return (
    <>
      <PageHeader eyebrow="Curriculum" title="Study path">
        <p>
          Four phases from foundations to mock exams. Steps complete automatically when you hit
          each goal (not just by visiting). Work top to bottom; jump ahead anytime.
        </p>
      </PageHeader>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="eyebrow">Overall</div>
            <strong style={{ fontSize: '1.25rem' }}>
              {path.completed}/{path.total} steps · {path.percent}%
            </strong>
          </div>
          {path.nextStep && (
            <Link className="btn btn-primary" to={path.nextStep.href}>
              Continue: {path.nextStep.title}
            </Link>
          )}
        </div>
        <div className="progress-bar" style={{ marginTop: '0.85rem' }}>
          <span style={{ width: `${path.percent}%` }} />
        </div>
        <button type="button" className="btn btn-ghost" style={{ marginTop: '0.75rem' }} onClick={() => setTick((t) => t + 1)}>
          Refresh completion
        </button>
      </div>

      {path.phases.map((phase, idx) => (
        <section key={phase.id} className="card path-phase-detail" style={{ marginBottom: '1rem' }}>
          <div className="path-phase-top">
            <div>
              <div className="eyebrow">Phase {idx + 1}</div>
              <h2 style={{ margin: '0.15rem 0' }}>{phase.title.replace(/^Phase \d+ · /, '')}</h2>
              <p className="muted" style={{ margin: 0 }}>
                {phase.goal}
              </p>
            </div>
            <span className={`badge ${phase.complete ? 'strong' : 'partial'}`}>
              {phase.done}/{phase.total}
            </span>
          </div>

          <div className="path-steps">
            {phase.steps.map((step, i) => (
              <div
                key={step.id}
                className={`path-step-row ${step.complete ? 'complete' : ''} ${
                  path.nextStep?.id === step.id ? 'current' : ''
                }`}
              >
                <div className="path-step-index mono">
                  {step.complete ? '✓' : i + 1}
                </div>
                <div className="path-step-body">
                  <h3>
                    {step.title}
                    {path.nextStep?.id === step.id && (
                      <span className="badge partial" style={{ marginLeft: '0.5rem' }}>
                        next
                      </span>
                    )}
                  </h3>
                  <p className="muted">{step.why}</p>
                  <p className="goal-line">Goal: {step.goalLabel}</p>
                  <div className="progress-bar" style={{ marginTop: '0.5rem', maxWidth: '16rem' }}>
                    <span style={{ width: `${Math.round(step.progress * 100)}%` }} />
                  </div>
                </div>
                <div className="path-step-actions">
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    ~{step.estimate}
                  </span>
                  <Link className="btn" to={step.href}>
                    {step.complete ? 'Practice again' : 'Start'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <p className="footer-note">
        Tip: If the coach sends you to Review, do that before forcing the next path step. Closing
        the miss bank is how scores actually rise.
      </p>
    </>
  );
}
