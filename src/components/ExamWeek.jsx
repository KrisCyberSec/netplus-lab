import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  loadProgress,
  setExamDate,
  getExamCountdown,
  localDayKey,
} from '../lib/progress';
import { EXAM_WEEK_PLAN, planForDaysUntil } from '../data/examWeek';

export default function ExamWeek({ onChange }) {
  const [tick, setTick] = useState(0);
  const progress = useMemo(() => loadProgress(), [tick]);
  const countdown = useMemo(() => getExamCountdown(progress), [progress]);
  const plan = useMemo(
    () => planForDaysUntil(countdown?.daysUntil),
    [countdown?.daysUntil],
  );

  function saveDate(value) {
    setExamDate(value || null);
    setTick((t) => t + 1);
    onChange?.();
  }

  const today = localDayKey();

  return (
    <section className="card exam-week-card">
      <div className="eyebrow">Exam week plan</div>
      <h2 style={{ marginTop: 0 }}>7 days out</h2>
      <p className="muted">
        Optional exam date unlocks a focused countdown plan. Leave blank to browse the full
        template.
      </p>

      <div className="field" style={{ maxWidth: '16rem' }}>
        <label htmlFor="exam-date">Exam date (local)</label>
        <input
          id="exam-date"
          type="date"
          value={progress.examDate || ''}
          min={today}
          onChange={(e) => saveDate(e.target.value)}
        />
      </div>

      {countdown && !countdown.past && (
        <p className="goal-line" style={{ marginTop: '0.5rem' }}>
          {countdown.daysUntil === 0
            ? `Exam day — ${countdown.label}`
            : `${countdown.daysUntil} day${countdown.daysUntil === 1 ? '' : 's'} until ${countdown.label}`}
        </p>
      )}
      {countdown?.past && (
        <p className="muted" style={{ marginTop: '0.5rem' }}>
          Exam date is in the past. Update it if you rescheduled.
        </p>
      )}

      <div className="exam-plan-list">
        {(countdown?.inExamWeek || !countdown ? plan : EXAM_WEEK_PLAN).map((day) => {
          const isToday =
            countdown && !countdown.past && countdown.daysUntil === day.offset;
          return (
            <div key={day.offset} className={`exam-plan-day ${isToday ? 'today' : ''}`}>
              <div className="exam-plan-head">
                <strong>{day.title}</strong>
                {isToday && <span className="badge partial">focus</span>}
              </div>
              <ul>
                {day.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link className="btn" to={day.href} style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                Open →
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
