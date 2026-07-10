import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { DRILL_META } from '../data/domains';
import { getLearnStats, loadProgress } from '../lib/progress';
import { getPathStatus } from '../lib/coach';
import { useEffect, useMemo, useState } from 'react';
import ScrollToTop from './ScrollToTop';

const LEARN = ['home', 'path', 'review'];
const PRACTICE = ['subnet', 'ports', 'osi', 'quiz', 'mock', 'scenarios', 'tools'];
const REF = ['sheets', 'coverage'];

function NavSection({ title, keys, badgeFor, onNavigate }) {
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
            onClick={onNavigate}
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
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  // Recompute on every route change so badges stay fresh
  const { missCount, pathPercent } = useMemo(() => {
    try {
      loadProgress();
      const learn = getLearnStats();
      const path = getPathStatus();
      return { missCount: learn.activeCount, pathPercent: path.percent };
    } catch {
      return { missCount: 0, pathPercent: 0 };
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  return (
    <div className={`app-shell ${navOpen ? 'nav-open' : ''}`}>
      <ScrollToTop />
      <header className="mobile-bar">
        <button
          type="button"
          className="btn mobile-menu-btn"
          aria-expanded={navOpen}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setNavOpen((o) => !o)}
        >
          {navOpen ? 'Close' : 'Menu'}
        </button>
        <NavLink to="/" className="mobile-brand" onClick={() => setNavOpen(false)}>
          <strong>NetPlus Lab</strong>
          <span>Coach · {pathPercent}% path</span>
        </NavLink>
        {missCount > 0 && (
          <NavLink to="/review" className="mobile-miss" onClick={() => setNavOpen(false)}>
            {missCount} misses
          </NavLink>
        )}
      </header>

      {navOpen && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
        />
      )}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">N+</div>
          <div className="brand-text">
            <strong>NetPlus Lab</strong>
            <span>Personal coach</span>
          </div>
        </div>

        <div className="sidebar-status">
          <div className="sidebar-status-row">
            <span>Path</span>
            <strong className="mono">{pathPercent}%</strong>
          </div>
          <div className="progress-bar">
            <span style={{ width: `${pathPercent}%` }} />
          </div>
          <p className="sidebar-status-hint">Saved in this browser only</p>
        </div>

        <nav className="nav">
          <NavSection
            title="Learn"
            keys={LEARN}
            badgeFor={(key) => (key === 'review' ? missCount : null)}
            onNavigate={() => setNavOpen(false)}
          />
          <NavSection title="Practice" keys={PRACTICE} onNavigate={() => setNavOpen(false)} />
          <NavSection title="Reference" keys={REF} onNavigate={() => setNavOpen(false)} />
        </nav>
        <p className="sidebar-hint">
          Start on <strong>Home · Coach</strong> for what to do next. After each session, review
          misses, then return to the coach.
        </p>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
