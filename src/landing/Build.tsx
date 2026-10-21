import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";
import { toggle, usePlaying } from "../lib/audio";
import "./build.css";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_S = 112; // 1:52
const steps = [
  { title: "Describe the job", body: "One or two sentences, typed or said out loud. Who to call, what to ask, what counts as a win." },
  { title: "It reads your website", body: "Prices, timings, locations and FAQs come from your site and documents, so answers stay accurate." },
  { title: "Pick a voice and languages", body: "Fourteen Indian voices. She starts in your main language and switches when the caller does." },
  { title: "Take a test call", body: "Your phone rings. Talk to her like a lead would, and change anything that doesn't sound right." },
  { title: "Go live", body: "New leads get a call within seconds, on an Indian number, during the hours you choose." },
];

const brief =
  "Call everyone who fills the form on our website within a minute. Ask what they want to automate, how many calls a day, and when. Book a 30-minute demo on my calendar. English and Hindi.";
const facts = ["Plans start at ₹2,999 a month", "Works in 11 Indian languages", "Demos are 30 minutes, Mon to Sat", "Office in Bengaluru, team of 14", "Integrates with Zoho and HubSpot"];
const voices = ["Ritu", "Priya", "Kavya", "Shreya"];
const langs = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "मराठी"];
const leads = [
  { name: "Rhea Joshi", co: "Joshi Opticals" },
  { name: "Aditya Rao", co: "Rao Fitness" },
  { name: "Sana Qureshi", co: "Bloom Dental" },
];
const clip = "/voices/anya-en-greeting.mp3";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Screen({ step, lp }: { step: number; lp: number }) {
  const playing = usePlaying() === clip;

  if (step === 0)
    return (
      <div className="scr">
        <span className="scr__label">What should this employee do?</span>
        <div className="scr__field scr__field--tall">
          {brief.slice(0, Math.round(brief.length * Math.min(1, lp * 1.25)))}
          <i className="scr__caret" />
        </div>
        <div className="scr__row">
          <span className="scr__pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg> Or say it</span>
          <span className="scr__hint">Hindi, Tamil or English all work</span>
        </div>
      </div>
    );

  if (step === 1) {
    const n = Math.min(facts.length, Math.floor(lp * (facts.length + 1)));
    return (
      <div className="scr">
        <span className="scr__label">Your website</span>
        <div className="scr__field">texnoid.com</div>
        <span className="scr__label">What she learned <em className="tnum">{Math.round(lp * 12)} of 12 pages</em></span>
        <ul className="scr__facts">
          {facts.map((f, i) => (
            <li key={f} className={i < n ? "is-on" : ""}><span className="scr__tick" aria-hidden="true" />{f}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (step === 2) {
    const v = Math.min(voices.length - 1, Math.floor(lp * voices.length));
    const l = Math.min(langs.length, 1 + Math.floor(lp * 2.2));
    return (
      <div className="scr">
        <span className="scr__label">Name</span>
        <div className="scr__field">Anya</div>
        <span className="scr__label">Voice</span>
        <div className="scr__voices">
          {voices.map((x, i) => (
            <span key={x} className={i === v ? "is-on" : ""}>{x}</span>
          ))}
        </div>
        <span className="scr__label">Languages</span>
        <div className="scr__chips">
          {langs.map((x, i) => (
            <span key={x} className={i < l ? "is-on" : ""}>{x}</span>
          ))}
        </div>
        <button className="scr__listen" onClick={() => toggle(clip)}>{playing ? "Stop" : "Hear this voice"}</button>
      </div>
    );
  }

  if (step === 3) {
    const connected = lp > 0.45;
    return (
      <div className="scr scr--phone">
        <div className={`phone ${connected ? "is-live" : "is-ringing"}`}>
          <span className="phone__state">{connected ? `Connected ${clock(Math.max(0, (lp - 0.45) * 30))}` : "Incoming call"}</span>
          <span className="phone__who">Anya</span>
          <span className="phone__from">Texnoid · +91 80•• ••2290</span>
          <p className="phone__line">{connected ? "“Hi, this is Anya from Texnoid. You recently enquired on our website…”" : ""}</p>
          <button className="scr__listen" onClick={() => toggle(clip)}>{playing ? "Stop" : "Hear the test call"}</button>
        </div>
      </div>
    );
  }

  const states = ["Calling", "Talking", "Booked"];
  return (
    <div className="scr">
      <div className="scr__live">
        <span className="scr__switch is-on" aria-hidden="true"><i /></span>
        <strong>Anya is live</strong>
        <span className="scr__hint">Calls 09:00 to 20:30 IST</span>
      </div>
      <ul className="scr__leads">
        {leads.map((x, i) => {
          const s = Math.min(2, Math.max(-1, Math.floor(lp * 4) - i));
          return (
            <li key={x.name}>
              <span><strong>{x.name}</strong> <span className="scr__hint">{x.co}</span></span>
              <span className={`scr__status s${s}`}>{s < 0 ? "New lead" : states[s]}</span>
            </li>
          );
        })}
      </ul>
      <p className="scr__hint">First call went out 9 seconds after the form was filled.</p>
    </div>
  );
}

export default function Build() {
  const root = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [stacked, setStacked] = useState(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setStacked(true);
      return;
    }
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        setStacked(false);
        ScrollTrigger.create({
          trigger: ".build__pin",
          start: "top top",
          end: "+=420%",
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => setP(self.progress),
        });
      });
      mm.add("(max-width: 899px)", () => setStacked(true));
    }, root);
    return () => ctx.revert();
  }, []);

  const raw = Math.min(0.9999, p) * steps.length;
  const step = Math.floor(raw);
  const lp = raw - step;

  return (
    <section className="build" id="build" ref={root} aria-labelledby="build-title">
      <div className="build__pin">
        <div className="wrap build__grid">
          <div className="build__text">
            <h2 id="build-title" className="section-title">From a sentence to a live employee.</h2>
            {!stacked && (
              <div className="build__clock" aria-hidden="true">
                <span className="tnum">{clock(p * TOTAL_S)}</span>
                <span className="dim">of 2:00</span>
              </div>
            )}
            <ol className="build__steps">
              {steps.map((s, i) => (
                <li key={s.title} className={stacked || i === step ? "is-on" : i < step ? "is-past" : ""}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  {stacked && <div className="build__window build__window--inline"><Screen step={i} lp={1} /></div>}
                </li>
              ))}
            </ol>
          </div>
          {!stacked && (
            <div className="build__window" aria-live="polite">
              <div className="build__bar mono">
                <span>texnoid.app / team / new</span>
                <span className="dim">Step {step + 1} of {steps.length}</span>
              </div>
              <div className="build__progress" aria-hidden="true"><i style={{ transform: `scaleX(${p})` }} /></div>
              <Screen step={step} lp={lp} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
