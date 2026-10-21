import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import StaticWave from "./StaticWave";
import Globe from "./Globe";
import { canWebGL, useReducedMotion } from "../lib/motion";
import { useTheme } from "../lib/theme";
import { level, toggle, usePlaying } from "../lib/audio";
import { greetings } from "../data/voices";
import "./hero.css";

const WaveField = lazy(() => import("./WaveField"));
const Orb = lazy(() => import("./Orb"));

export default function Hero() {
  const reduced = useReducedMotion();
  const theme = useTheme();
  const [gl] = useState(canWebGL);
  const live = gl && !reduced;
  const envelope = useRef(0.16);
  const root = useRef<HTMLElement>(null);
  const [lang, setLang] = useState(0);
  const g = greetings[lang];
  const playing = usePlaying() === g.src;

  // The wave follows the real voice while it plays and breathes quietly otherwise.
  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const v = level();
      envelope.current = v > 0 ? 0.14 + v * 1.2 : 0.16 + Math.sin(t / 900) * 0.05;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero__line > span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.09, delay: 0.15 });
      gsap.from(".hero__aside, .hero__voice", { opacity: 0, y: 12, duration: 1, ease: "power2.out", delay: 0.6, stagger: 0.1 });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const pick = (i: number) => {
    setLang(i);
    // Switching language while one plays moves straight to the new clip.
    if (playing) toggle(greetings[i].src);
  };


  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero__stage">
        <div className="hero__mesh" aria-hidden="true" />
        <Globe theme={theme} still={reduced} key={`g-${theme}`} />
        {live ? (
          <Suspense fallback={<StaticWave />}>
            <WaveField envelope={envelope} theme={theme} key={theme} />
          </Suspense>
        ) : (
          <StaticWave />
        )}
      </div>

      <div className="hero__voice wrap">
        <div className="hero__controls">
          <button className={`orb ${playing ? "is-on" : ""}`} onClick={() => toggle(g.src)} aria-label={playing ? `Stop ${g.speaker}` : `Hear ${g.speaker} in ${g.tab}`}>
            {live ? (
              <Suspense fallback={<span className="orb__still" />}>
                <Orb envelope={envelope} playing={playing} theme={theme} key={theme} />
              </Suspense>
            ) : (
              <span className="orb__still" />
            )}
            <span className="orb__icon" aria-hidden="true">
              {playing ? (
                <svg width="16" height="16" viewBox="0 0 14 14"><rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 14 14"><path d="M4 2l8 5-8 5z" fill="currentColor" /></svg>
              )}
            </span>
          </button>
          <div className="seg" role="radiogroup" aria-label="Language">
            {greetings.map((x, i) => (
              <button key={x.id} role="radio" aria-checked={i === lang} className={i === lang ? "is-on" : ""} onClick={() => pick(i)}>
                {x.tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hero__copy wrap">
        <h1 id="hero-title" className="hero__title">
          <span className="hero__line"><span>Hire AI voice employees</span></span>
          <span className="hero__line"><span>in 2 minutes.</span></span>
        </h1>
        <div className="hero__aside">
          <p>Voice employees who call your leads in 11 Indian languages, from ₹2.5 a minute.</p>
          <div className="hero__ctas">
            <a className="btn btn--signal" href="#pricing">Start free</a>
            <a className="btn" href="#build">See how it's built</a>
          </div>
        </div>
      </div>
    </section>
  );
}
