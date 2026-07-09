import { DOMAINS, STATUS_LABEL } from '../data/domains';
import { countByDomain, QUESTIONS } from '../data/questions';
import { SCENARIOS } from '../data/scenarios';
import { PORTS } from '../data/ports';
import { TOOL_PROMPTS } from '../data/tools';

const FEATURES = [
  { name: 'Subnetting trainer', domains: '1, 5', priority: 'MVP' },
  { name: 'Port lightning round', domains: '1', priority: 'MVP' },
  { name: 'OSI interactive map', domains: '1', priority: 'MVP' },
  { name: 'Domain-weighted practice quiz', domains: '1–5', priority: 'MVP' },
  { name: 'Local progress (localStorage)', domains: 'all', priority: 'MVP' },
  { name: 'Troubleshooting scenarios', domains: '5 (+4)', priority: 'MVP' },
  { name: 'Tool picker drill', domains: '3, 5', priority: 'MVP' },
  { name: 'Full objective-tagged bank (3+ per ID)', domains: 'all', priority: 'v1.x' },
  { name: 'Timed mock exam (domain-weighted)', domains: 'all', priority: 'v1.x' },
  { name: 'ACL order puzzles', domains: '4', priority: 'Later' },
  { name: 'Topology / packet-path visual', domains: '1, 2, 5', priority: 'Later' },
  { name: 'Mini CLI sim', domains: '2, 5', priority: 'Later' },
];

export default function Coverage() {
  const counts = countByDomain();

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Honest status</span>
        <h1>Coverage matrix</h1>
        <p>
          What this lab covers today versus the full N10-009 outline. Full topic coverage is a
          content roadmap, not a day-one claim.
        </p>
      </header>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2>Domain status (MVP)</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Quiz items</th>
            </tr>
          </thead>
          <tbody>
            {DOMAINS.map((d) => (
              <tr key={d.id}>
                <td>
                  {d.id}. {d.name}
                </td>
                <td className="mono">{d.weight}%</td>
                <td>
                  <span className={`badge ${d.status}`}>{STATUS_LABEL[d.status]}</span>
                </td>
                <td className="mono">{counts[d.id]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted" style={{ marginTop: '0.75rem' }}>
          Plus {PORTS.length} ports, {SCENARIOS.length} scenarios, {TOOL_PROMPTS.length} tool
          prompts, subnet generator, OSI map. Total quiz bank: {QUESTIONS.length}.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2>Feature roadmap</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Domains</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f) => (
              <tr key={f.name}>
                <td>{f.name}</td>
                <td>{f.domains}</td>
                <td>
                  <span
                    className={`badge ${
                      f.priority === 'MVP' ? 'strong' : f.priority === 'v1.x' ? 'partial' : 'thin'
                    }`}
                  >
                    {f.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>What “full coverage” means later</h2>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
          <li>Every official objective ID has multiple tagged questions</li>
          <li>Mock exam weighting matches domain percentages</li>
          <li>D2 / D3 / D4 banks are no longer thin</li>
          <li>Scenarios span cable, wireless, routing, security, and ops</li>
          <li>Hands-on hardware and Packet Tracer remain external</li>
        </ul>
      </div>

      <p className="disclaimer">
        Not affiliated with CompTIA. See{' '}
        <a
          href="https://www.comptia.org/en-us/certifications/network/"
          target="_blank"
          rel="noreferrer"
        >
          official Network+ page
        </a>{' '}
        for current objectives. Details also live in <code>docs/COVERAGE.md</code>.
      </p>
    </>
  );
}
