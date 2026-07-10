import { Link } from 'react-router-dom';

/**
 * Consistent page chrome: eyebrow, title, help text, back-to-coach link.
 */
export default function PageHeader({
  eyebrow,
  title,
  children,
  showCoachLink = true,
  coachLabel = '← Coach',
}) {
  return (
    <header className="page-header">
      <div className="page-header-top">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {showCoachLink && (
          <Link to="/" className="coach-link">
            {coachLabel}
          </Link>
        )}
      </div>
      <h1>{title}</h1>
      {children && <div className="page-header-body">{children}</div>}
    </header>
  );
}
