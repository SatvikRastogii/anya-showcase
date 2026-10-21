import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { fmtDuration, fmtTime, type Call } from "../data/calls";
import { Badge, Pill } from "./components/Badge";
import Scrubber from "./components/Scrubber";

const answerLabels: [keyof Call["answers"], string][] = [
  ["calls", "Calls to automate"],
  ["volume", "Calls a day"],
  ["timeline", "When"],
  ["deciders", "Who decides"],
  ["budget", "Budget"],
];

export default function CallDetail({ call }: { call: Call }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const onTick = useCallback((v: number) => {
    setT(v);
    if (v >= call.durationS) setPlaying(false);
  }, [call.durationS]);

  const current = [...call.transcript].reverse().find((l) => l.t <= t);
  const answered = answerLabels.filter(([k]) => call.answers[k]);

  return (
    <article className="cd">
      <Link to="/app/calls" className="cd__back mono">← All calls</Link>
      <header className="cd__head">
        <div>
          <h2>{call.lead}</h2>
          <p className="dim">{call.company} · {call.phone} · {call.source}</p>
        </div>
        <div className="cd__meta">
          <Badge outcome={call.outcome} />
          <span className="mono dim tnum">Today {fmtTime(call.startedAt)} · {call.durationS ? fmtDuration(call.durationS) : "not answered"}</span>
        </div>
      </header>

      <section className="cd__summary">
        <div className="cd__summary-text">
          <span className="mono dim">AI summary</span>
          <p>{call.summary}</p>
        </div>
        <div className="cd__next">
          <span className="mono dim">Next step</span>
          <p>{call.nextStep}</p>
          <Pill tone={call.sentiment === "positive" ? "ok" : call.sentiment === "negative" ? "bad" : "mute"}>
            {call.sentiment === "positive" ? "Positive" : call.sentiment === "negative" ? "Frustrated" : "Neutral"}
          </Pill>
        </div>
      </section>

      {call.durationS > 0 && call.path.length > 0 && (
        <Scrubber
          id={call.id}
          duration={call.durationS}
          path={call.path}
          t={t}
          playing={playing}
          onSeek={setT}
          onTick={onTick}
          onToggle={() => {
            if (t >= call.durationS) setT(0);
            setPlaying((p) => !p);
          }}
        />
      )}

      <div className="cd__grid">
        <section className="cd__block">
          <h3>Transcript</h3>
          {call.transcript.length === 0 ? (
            <p className="dim">{call.outcome === "error" ? "The call ended before anyone spoke." : "Nobody picked up, so there's nothing to show."}</p>
          ) : (
            <ol className="tx">
              {call.transcript.map((l) => (
                <li key={l.t} className={`tx__line is-${l.who} ${current === l && playing ? "is-now" : ""}`}>
                  <button className="mono tnum dim" onClick={() => setT(l.t)} aria-label={`Jump to ${fmtDuration(l.t)}`}>{fmtDuration(l.t)}</button>
                  <span className="mono tx__who">{l.who === "anya" ? "Anya" : call.lead.split(" ")[0]}</span>
                  <p>{l.text}</p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside className="cd__side">
          <section className="cd__block">
            <h3>Answers</h3>
            {answered.length ? (
              <dl className="kv">
                {answered.map(([k, label]) => (
                  <div key={k}><dt className="dim">{label}</dt><dd>{call.answers[k]}</dd></div>
                ))}
              </dl>
            ) : (
              <p className="dim">No questions were asked on this call.</p>
            )}
          </section>

          <section className="cd__block">
            <h3>Agent path</h3>
            {call.path.length ? (
              <ol className="path">
                {call.path.map((p) => (
                  <li key={p.agent + p.at}>
                    <span className="mono tnum dim">{fmtDuration(p.at)}</span>
                    <div>
                      <strong>{p.agent}</strong>
                      {p.reason && <span className="dim">{p.reason}</span>}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="dim">The call never connected, so no agent ran.</p>
            )}
          </section>

          {call.errors.length > 0 && (
            <section className="cd__block cd__errors">
              <h3>Errors</h3>
              <ul>{call.errors.map((e) => <li key={e} className="mono">{e}</li>)}</ul>
            </section>
          )}

          <dl className="kv kv--meta mono">
            <div><dt className="dim">Call ID</dt><dd>{call.id}</dd></div>
            <div><dt className="dim">LLM requests</dt><dd className={call.llmRequests === 0 ? "is-zero" : ""}>{call.llmRequests}</dd></div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
