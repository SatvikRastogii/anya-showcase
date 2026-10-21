import { hires } from "../data/employees";
import { toggle, usePlaying } from "../lib/audio";

function Bars() {
  return (
    <span className="eq" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

export default function Team() {
  const playing = usePlaying();

  return (
    <section className="team-s" id="employees" aria-labelledby="team-title">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="team-title" className="section-title">One team. As many employees as you need.</h2>
          <p className="section-lede">
            Each employee has its own name, voice, languages and job. Start with one for sales, then add a
            receptionist, a reminder caller, a feedback caller. They all report to one dashboard.
          </p>
        </div>

        <ul className="hires">
          {hires.map((h) => (
            <li key={h.name} className={`hire-card ${h.clips ? "has-voice" : ""}`}>
              <div className="hire-card__top">
                <span className="hire-card__avatar" aria-hidden="true">{h.name[0]}</span>
                <div>
                  <h3>{h.name}</h3>
                  <p className="dim">{h.job}</p>
                </div>
                {!h.clips && <span className="hire-card__tag mono">Template</span>}
              </div>
              <blockquote>“{h.opening}”</blockquote>
              <div className="hire-card__foot">
                <span className="dim">{h.business}</span>
                <span className="hire-card__langs">{h.languages.join(" · ")}</span>
              </div>
              {h.clips && (
                <div className="hire-card__play">
                  {h.clips.map((c) => {
                    const on = playing === c.src;
                    return (
                      <button key={c.src} className={on ? "is-on" : ""} onClick={() => toggle(c.src)} aria-label={`${on ? "Stop" : "Hear"} ${h.name} in ${c.label}`}>
                        {on ? <Bars /> : <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 1.5l9 5.5-9 5.5z" fill="currentColor" /></svg>}
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { Bars };
