import { Link } from "react-router-dom";

export default function NotFound({ inApp = false }: { inApp?: boolean }) {
  return (
    <div className={`nf ${inApp ? "nf--app" : ""}`}>
      <svg viewBox="0 0 400 60" className="nf__line" aria-hidden="true">
        <path d="M0 30 C 20 0, 30 60, 50 30 S 80 10, 100 30 L 400 30" fill="none" stroke="var(--signal)" strokeWidth="1.5" />
      </svg>
      <h1>This line is dead.</h1>
      <p className="dim">There's nothing at this address. It may have moved, or the link has a typo.</p>
      <Link className="btn btn--signal" to={inApp ? "/app/calls" : "/"}>{inApp ? "Go to calls" : "Back to the site"}</Link>
    </div>
  );
}
