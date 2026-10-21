import { useState } from "react";
import { engineName, phrases, type Engine } from "../data/voices";
import { toggle, usePlaying } from "../lib/audio";
import { Bars } from "./Team";

export default function Phrases() {
  const [engine, setEngine] = useState<Engine>("sarvam");
  const playing = usePlaying();

  return (
    <section className="phr" id="voices" aria-labelledby="phr-title">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="phr-title" className="section-title">She sounds like someone on your team.</h2>
          <div className="phr__side">
            <p className="section-lede">
              Short, warm, unhurried. These are the exact recordings she plays on calls. Tap any of them.
            </p>
            <div className="seg" role="radiogroup" aria-label="Voice">
              {(Object.keys(engineName) as Engine[]).map((e) => (
                <button key={e} role="radio" aria-checked={engine === e} className={engine === e ? "is-on" : ""} onClick={() => setEngine(e)}>
                  {engineName[e]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="phr__grid">
          {phrases.map((ph) => {
            const src = ph.src[engine] ?? (Object.values(ph.src)[0] as string);
            const other = !ph.src[engine];
            const on = playing === src;
            return (
              <li key={ph.text}>
                <button className={`phr__tile ${on ? "is-on" : ""}`} onClick={() => toggle(src)} aria-label={`${on ? "Stop" : "Play"}: ${ph.text}`}>
                  <span className="phr__icon">
                    {on ? <Bars /> : <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 1.5l9 5.5-9 5.5z" fill="currentColor" /></svg>}
                  </span>
                  <span className="phr__text">{ph.text}</span>
                  <span className="phr__meta">
                    <span>{ph.when}</span>
                    <span className="mono">{other ? `Only in ${engineName[engine === "sarvam" ? "eleven" : "sarvam"].split(" · ")[0]}` : ph.lang}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
