import { NavLink, Outlet } from 'react-router-dom';
import { DRILL_META } from '../data/domains';
import { getLearnStats, loadProgress } from '../lib/progress';
import { useMemo } from 'react';

const LEARN = ['home', 'path', 'review'];
const PRACTICE = ['subnet', 'ports', 'osi', 'quiz', 'mock', 'scenarios', 'tools'];
const REF = ['sheets', 'coverage'];

function NavSection({ title, keys, badgeFor }) {
  return (
    <div className="nav-section">
      <div className="nav-section-label">{title}</div>
      {keys.map((key) => {
        const item = DRILL_META[key];
        if (!item) return null;
        const badge = badgeFor?.(key);
        return (
          <NavLink
            key={key}
            to={item.path}
            end={key === 'home'}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {badge != null && badge > 0 && <span className="nav-badge">{badge}</span>}
          </NavLink>
        );
      })}
    </div>
  );
}

export default function Layout() {
  const missCount = useMemo(() => {
    try {
      loadProgress();
      return getLearnStats().activeCount;
    } catch {
      return 0;
    }
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">N+</div>
          <div className="brand-text">
            <strong>NetPlus Lab</strong>
            <span>Personal coach</span>
          </div>
        </div>
        <nav className="nav">
          <NavSection
            title="Learn"
            keys={LEARN}
            badgeFor={(key) => (key === 'review' ? missCount : null)}
          />
          <NavSection title="Practice" keys={PRACTICE} />
          <NavSection title="Reference" keys={REF} />
        </nav>
        <p className="sidebar-hint">
          Start on Home for “what next.” Progress saves automatically in this browser.
        </p>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
