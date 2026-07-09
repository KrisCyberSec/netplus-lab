import { useState } from 'react';
import { CHEATSHEETS } from '../data/cheatsheets';

export default function Cheatsheets() {
  const [active, setActive] = useState(CHEATSHEETS[0].id);
  const sheet = CHEATSHEETS.find((s) => s.id === active) || CHEATSHEETS[0];

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Quick reference</span>
        <h1>Cheatsheets</h1>
        <p>
          High-yield tables for ports, subnet math, cabling, Wi-Fi, OSI, and the troubleshooting
          methodology. Great for last-minute review.
        </p>
      </header>

      <div className="pill-row" style={{ marginBottom: '1rem' }}>
        {CHEATSHEETS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`pill ${active === s.id ? 'active' : ''}`}
            onClick={() => setActive(s.id)}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>{sheet.title}</h2>
        <p className="muted">{sheet.blurb}</p>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table className="table">
            <thead>
              <tr>
                {sheet.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheet.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, i) => (
                    <td key={i} className={i === 0 ? 'mono' : undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
