import { NavLink, Outlet } from 'react-router-dom';
import { DRILL_META } from '../data/domains';

const LINKS = [
  'home',
  'subnet',
  'ports',
  'osi',
  'quiz',
  'mock',
  'scenarios',
  'tools',
  'sheets',
  'coverage',
];

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">N+</div>
          <div className="brand-text">
            <strong>NetPlus Lab</strong>
            <span>N10-009 drills</span>
          </div>
        </div>
        <nav className="nav">
          {LINKS.map((key) => {
            const item = DRILL_META[key];
            return (
              <NavLink
                key={key}
                to={item.path}
                end={key === 'home'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
