import { Link } from "react-router-dom";

export default function Closing() {
  return (
    <>
      <section className="closing" aria-labelledby="closing-title">
        <div className="wrap">
          <h2 id="closing-title" className="closing__title">Your next hire takes two minutes.</h2>
          <div className="closing__row">
            <p className="dim">Start with 50 free minutes. Hear her call your own phone before a single lead does.</p>
            <div className="hero__ctas">
              <Link className="btn btn--signal" to="/login">Start free</Link>
              <Link className="btn" to="/login">See the dashboard</Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="foot">
        <div className="wrap foot__row">
          <span className="foot__mark">Anya <span className="dim">by Texnoid</span></span>
          <span className="mono dim">A product demo. Leads, calls and prices on this site are illustrative.</span>
          <span className="mono dim">© 2026 Texnoid</span>
        </div>
      </footer>
    </>
  );
}
