import { useState } from "react";
import { Link } from "react-router-dom";
import { comparison, inr, monthly, plans } from "../data/pricing";

const MAX = Math.max(...comparison.map((c) => c.range[1]));

export default function Pricing() {
  const [calls, setCalls] = useState(60);
  const m = monthly(calls);
  const saved = m.theirs - m.ours;

  return (
    <section className="price" id="pricing" aria-labelledby="price-title">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="price-title" className="section-title">Priced for Indian businesses.</h2>
          <p className="section-lede">
            Indian numbers, Indian voices and an Indian phone line mean we pay less per minute, and so do you. You
            only pay for connected minutes; unanswered calls and voicemail cost nothing.
          </p>
        </div>

        <ul className="plans">
          {plans.map((p) => (
            <li key={p.name} className={`plan-card ${p.featured ? "is-featured" : ""}`}>
              <div className="plan-card__head">
                <h3>{p.name}</h3>
                {p.featured && <span className="plan-card__flag mono">Most teams start here</span>}
              </div>
              <div className="plan-card__price">
                <strong className="tnum">{p.price}</strong>
                {p.per && <span className="dim">{p.per}</span>}
              </div>
              <p className="dim">{p.blurb}</p>
              <ul className="plan-card__list">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link className={`btn ${p.featured ? "btn--signal" : ""}`} to="/login">{p.cta}</Link>
            </li>
          ))}
        </ul>

        <div className="price__lower">
          <div className="calc">
            <label className="calc__q" htmlFor="calls">How many calls a day?</label>
            <div className="calc__row">
              <input id="calls" type="range" min={10} max={400} step={10} value={calls} onChange={(e) => setCalls(+e.target.value)} />
              <output htmlFor="calls" className="tnum">{calls}</output>
            </div>
            <dl className="calc__out">
              <div>
                <dt className="dim">With Anya</dt>
                <dd className="tnum">{inr(m.ours)}<span className="dim"> a month</span></dd>
              </div>
              <div>
                <dt className="dim">With {m.people} telecaller{m.people > 1 ? "s" : ""}</dt>
                <dd className="tnum is-them">{inr(m.theirs)}<span className="dim"> a month</span></dd>
              </div>
            </dl>
            <p className="calc__save">
              {saved > 0 ? <>You keep <strong className="tnum">{inr(saved)}</strong> a month, and nobody misses a lead at 8 pm.</> : <>At this volume you're paying for coverage: every lead called in seconds, all day.</>}
            </p>
            <p className="mono dim calc__note">Assumes {m.minutes.toLocaleString("en-IN")} minutes a month (2.5 min a call, 26 days) and ₹20,000 per telecaller.</p>
          </div>

          <div className="cmp">
            <h3>Per connected minute</h3>
            <ul>
              {comparison.map((c) => (
                <li key={c.name} className={c.us ? "is-us" : ""}>
                  <span>{c.name}</span>
                  <span className="cmp__bar" aria-hidden="true">
                    <i style={{ left: `${(c.range[0] / MAX) * 100}%`, width: `${((c.range[1] - c.range[0]) / MAX) * 100}%` }} />
                  </span>
                  <span className="tnum mono">₹{c.range[0]}–{c.range[1]}</span>
                </li>
              ))}
            </ul>
            <p className="mono dim calc__note">Approximate public list prices, October 2026. Others often bill phone line and model usage on top.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
