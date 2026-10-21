import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../lib/theme";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="wrap nav__row">
        <a href="#top" className="nav__mark" aria-label="Anya by Texnoid, back to top">
          <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true"><path d="M3 16h5l3-8 4 16 4-12 3 4h7" fill="none" stroke="var(--signal)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Anya <span className="dim">by Texnoid</span>
        </a>
        <nav className="nav__links" aria-label="Sections">
          <a href="#build">How it works</a>
          <a href="#employees">Employees</a>
          <a href="#voices">Voices</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav__end">
          <ThemeToggle />
          <Link className="nav__login" to="/login">Log in</Link>
          <Link className="btn btn--sm btn--signal" to="/login">Start free</Link>
        </div>
      </div>
    </header>
  );
}
