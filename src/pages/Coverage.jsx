import { DOMAINS, STATUS_LABEL } from '../data/domains';
import { countByDomain, QUESTIONS } from '../data/questions';
import { SCENARIOS } from '../data/scenarios';
import { PORTS } from '../data/ports';
import { TOOL_PROMPTS } from '../data/tools';
import { EXAM_META } from '../data/objectives';
import { coverageSummary } from '../lib/coverageAudit';
import { useMemo } from 'react';
import PageHeader from '../components/PageHeader';

export default function Coverage() {
  const counts = countByDomain();
  const summary = useMemo(() => coverageSummary(), []);

  return (
    <>
      <PageHeader eyebrow="N10-009 · Factual scope" title="What this lab covers">
        <p>
          Mapped to CompTIA Network+ ({EXAM_META.code} / {EXAM_META.version}). Study aid only —
          not official CompTIA material. Use the official objectives PDF as the final checklist.
        </p>
      </PageHeader>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2>Exam facts (official outline)</h2>
        <table className="table">
          <tbody>
            <tr>
              <td>Exam code</td>
              <td className="mono">
                {EXAM_META.code} ({EXAM_META.version})
              </td>
            </tr>
            <tr>
              <td>Launch</td>
              <td>{EXAM_META.launch}</td>
            </tr>
            <tr>
              <td>Length</td>
              <td>
                {EXAM_META.durationMin} minutes · up to {EXAM_META.maxQuestions} questions
              </td>
            </tr>
            <tr>
              <td>Format</td>
              <td>{EXAM_META.format}</td>
            </tr>
            <tr>
              <td>Passing score</td>
              <td>
                {EXAM_META.passingScore} ({EXAM_META.scoreScale})
              </td>
            </tr>
          </tbody>
        </table>
        <p className="muted" style={{ marginTop: '0.75rem' }}>
          {EXAM_META.disclaimer}
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2>Content inventory</h2>
        <div className="stat-row">
          <div className="stat">
            <span className="label">Quiz items</span>
            <span className="value">{summary.questionTotal}</span>
          </div>
          <div className="stat">
            <span className="label">Scenarios</span>
            <span className="value">{SCENARIOS.length}</span>
          </div>
          <div className="stat">
            <span className="label">Ports</span>
            <span className="value">{PORTS.length}</span>
          </div>
          <div className="stat">
            <span className="label">Tool prompts</span>
            <span className="value">{TOOL_PROMPTS.length}</span>
          </div>
          <div className="stat">
            <span className="label">Topics ≥3 Q</span>
            <span className="value">{summary.strong}</span>
          </div>
          <div className="stat">
            <span className="label">Topics thin (0 Q)</span>
            <span className="value">{summary.thin}</span>
          </div>
        </div>
        <p className="muted" style={{ marginTop: '0.75rem' }}>
          Domain quiz counts: D1 {counts[1]} · D2 {counts[2]} · D3 {counts[3]} · D4 {counts[4]} ·
          D5 {counts[5]} (total {QUESTIONS.length})
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2>Domain weights (exam)</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Weight</th>
              <th>Lab quiz items</th>
              <th>Lab depth</th>
            </tr>
          </thead>
          <tbody>
            {DOMAINS.map((d) => (
              <tr key={d.id}>
                <td>
                  {d.id}. {d.name}
                </td>
                <td className="mono">{d.weight}%</td>
                <td className="mono">{counts[d.id]}</td>
                <td>
                  <span className={`badge ${d.status}`}>{STATUS_LABEL[d.status]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2>Topic map vs quiz bank</h2>
        <p className="muted">
          Strong = 3+ tagged questions · Partial = 1–2 · Thin = none yet. Drills (subnet, OSI,
          ports, scenarios) cover some thin quiz cells in practice.
        </p>
        {summary.rows.map((domain) => (
          <div key={domain.domain} style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>
              {domain.domain}. {domain.name} ({domain.weight}%)
            </h3>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Topic</th>
                  <th>Qs</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {domain.topics.map((t) => (
                  <tr key={t.id}>
                    <td className="mono">{t.id}</td>
                    <td>{t.title}</td>
                    <td className="mono">{t.count}</td>
                    <td>
                      <span className={`badge ${t.status}`}>{STATUS_LABEL[t.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>What this lab cannot fully replace</h2>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
          <li>Official CompTIA objectives PDF (authoritative checklist)</li>
          <li>Hands-on labs (real gear, Packet Tracer, vendor sims)</li>
          <li>Performance-based exam UI (PBQs)</li>
          <li>Vendor-specific CLI syntax depth beyond concepts</li>
        </ul>
        <p className="muted" style={{ marginTop: '0.75rem' }}>
          Source:{' '}
          <a
            href="https://www.comptia.org/en-us/certifications/network/"
            target="_blank"
            rel="noreferrer"
          >
            CompTIA Network+ page
          </a>
          . Download the full objectives PDF from CompTIA for the complete bullet list.
        </p>
      </div>

      <p className="disclaimer">{EXAM_META.disclaimer}</p>
    </>
  );
}
