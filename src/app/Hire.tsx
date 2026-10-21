import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LANGS = ["English", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada"];
const VOICES = ["Bulbul v3 · Kavya", "Bulbul v3 · Priya", "Bulbul v3 · Rohan", "ElevenLabs · Arjun"];
const STEPS = ["Reading your description", "Looking up bloomdental.in", "Writing the opening line", "Choosing four questions", "Setting the rules"];

const example =
  "A receptionist for Bloom Dental in Chennai. Answers calls, books cleaning and check-up appointments, and tells people our timings. Speaks Tamil and English.";

type Stage = "form" | "drafting" | "done";

export default function Hire() {
  const [text, setText] = useState("");
  const [langs, setLangs] = useState<string[]>(["English", "Tamil"]);
  const [voice, setVoice] = useState(VOICES[0]);
  const [stage, setStage] = useState<Stage>("form");
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (stage !== "drafting") return;
    setStep(0);
    const ids = STEPS.map((_, i) => window.setTimeout(() => setStep(i + 1), 340 * (i + 1)));
    ids.push(window.setTimeout(() => setStage("done"), 340 * STEPS.length + 350));
    return () => ids.forEach(window.clearTimeout);
  }, [stage]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 20) {
      setError("Describe the job in at least one full sentence, so there's enough to draft from.");
      return;
    }
    setError("");
    setStage("drafting");
  };

  const toggle = (l: string) => setLangs((xs) => (xs.includes(l) ? xs.filter((x) => x !== l) : [...xs, l]));

  return (
    <div className="hire">
      <form className="hire__form" onSubmit={submit} noValidate>
        <label className="field">
          <span>What should this employee do?</span>
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={example}
            aria-invalid={!!error}
            aria-describedby={error ? "hire-err" : undefined}
            disabled={stage === "drafting"}
          />
          {error ? (
            <span id="hire-err" className="field__err">{error}</span>
          ) : (
            <button type="button" className="field__hint" onClick={() => setText(example)}>Use the example</button>
          )}
        </label>

        <fieldset className="field">
          <legend>Languages</legend>
          <div className="chips">
            {LANGS.map((l) => (
              <button type="button" key={l} className={`chip ${langs.includes(l) ? "is-on" : ""}`} aria-pressed={langs.includes(l)} onClick={() => toggle(l)}>
                {l}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>Voice</span>
          <select value={voice} onChange={(e) => setVoice(e.target.value)}>
            {VOICES.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>

        <div className="hire__actions">
          <button className="btn btn--signal" type="submit" disabled={stage === "drafting"}>
            {stage === "done" ? "Draft again" : stage === "drafting" ? "Drafting…" : "Draft employee"}
          </button>
          <Link to="/app/team" className="btn">Cancel</Link>
        </div>
      </form>

      <section className={`hire__out stage-${stage}`} aria-live="polite">
        {stage === "form" && (
          <div className="hire__empty">
            <p className="dim">The draft shows up here: a name, the opening line, the questions and the rules. You can change any of it before they take a call.</p>
          </div>
        )}
        {stage === "drafting" && (
          <ol className="hire__log mono">
            {STEPS.map((s, i) => (
              <li key={s} className={i < step ? "is-done" : i === step ? "is-now" : ""}>
                <span>{i < step ? "done" : i === step ? "…" : ""}</span>
                {s}
              </li>
            ))}
          </ol>
        )}
        {stage === "done" && (
          <div className="plan">
            <div className="plan__head">
              <span className="emp__avatar is-live" aria-hidden="true">M</span>
              <div>
                <h2>Meera</h2>
                <p className="dim">Receptionist, Bloom Dental · {voice} · {langs.join(", ") || "English"}</p>
              </div>
            </div>
            <div>
              <span className="mono dim">Opening line</span>
              <blockquote className="emp__quote">“Good morning, Bloom Dental. This is Meera, how can I help you today?”</blockquote>
            </div>
            <div>
              <span className="mono dim">Questions, in order</span>
              <ol className="plan__qs">
                <li>Is this for a cleaning, a check-up, or something that hurts?</li>
                <li>Have you visited us before?</li>
                <li>Which day suits you this week?</li>
                <li>Morning or evening?</li>
              </ol>
            </div>
            <div>
              <span className="mono dim">Rules</span>
              <ul className="plan__rules">
                <li>Pain or swelling today goes straight to the front desk.</li>
                <li>Never quotes treatment prices; offers a call from the clinic instead.</li>
                <li>Timings: Mon–Sat, 9:30 to 19:00.</li>
              </ul>
            </div>
            <div className="hire__actions">
              <button className="btn btn--signal" type="button" onClick={() => setSaved(true)}>{saved ? "Saved as draft" : "Save as draft"}</button>
              {saved && <span className="mono dim" role="status">Saving is local to this demo. Nothing left your browser.</span>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
