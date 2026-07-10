import { Link } from 'react-router-dom';

/** Standard end-of-session actions so every drill ends the same way. */
export default function SessionDone({
  primaryTo,
  primaryLabel,
  secondaryTo,
  secondaryLabel,
  showCoach = true,
  extra,
}) {
  return (
    <div className="session-done-actions">
      {extra}
      <div className="btn-row">
        {primaryTo && (
          <Link className="btn btn-primary" to={primaryTo}>
            {primaryLabel}
          </Link>
        )}
        {secondaryTo && (
          <Link className="btn" to={secondaryTo}>
            {secondaryLabel}
          </Link>
        )}
        {showCoach && (
          <Link className="btn" to="/">
            Back to coach
          </Link>
        )}
      </div>
      <p className="save-note">Progress saved in this browser.</p>
    </div>
  );
}
