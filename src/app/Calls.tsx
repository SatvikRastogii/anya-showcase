import { Link, NavLink, useParams } from "react-router-dom";
import { calls, findCall, fmtDuration, fmtTime, outcomeLabel, type Outcome } from "../data/calls";
import { Badge } from "./components/Badge";
import CallDetail from "./CallDetail";

const OPEN = 9 * 60;
const CLOSE = 20 * 60 + 30;
const minutes = (iso: string) => +iso.slice(11, 13) * 60 + +iso.slice(14, 16);

const booked = calls.filter((c) => c.outcome === "qualified").length;
const cut = calls.filter((c) => c.outcome === "voicemail").length;
const talkS = calls.reduce((s, c) => s + c.durationS, 0);

const toneOf = (o: Outcome) => (o === "qualified" ? "ok" : o === "error" ? "bad" : o === "callback_requested" || o === "transferred" ? "warn" : "mute");

function DayStrip({ active }: { active?: string }) {
  return (
    <section className="day" aria-label="Today's calls on the calling window">
      <div className="day__stats">
        <div><strong className="tnum">{calls.length}</strong><span className="dim">calls today</span></div>
        <div><strong className="tnum">{booked}</strong><span className="dim">demos booked</span></div>
        <div><strong className="tnum">{cut}</strong><span className="dim">voicemails cut, 0 tokens</span></div>
        <div><strong className="tnum">{fmtDuration(talkS)}</strong><span className="dim">total talk time</span></div>
      </div>
      <div className="day__axis">
        {calls.map((c) => (
          <Link
            key={c.id}
            to={`/app/calls/${c.id}`}
            className={`day__tick tone-${toneOf(c.outcome)} ${active === c.id ? "is-on" : ""}`}
            style={{ left: `${((minutes(c.startedAt) - OPEN) / (CLOSE - OPEN)) * 100}%` }}
            aria-label={`${fmtTime(c.startedAt)}, ${c.lead}, ${outcomeLabel[c.outcome]}`}
            title={`${fmtTime(c.startedAt)} · ${c.lead} · ${outcomeLabel[c.outcome]}`}
          />
        ))}
      </div>
      <div className="day__labels mono dim" aria-hidden="true">
        <span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>20:30</span>
      </div>
    </section>
  );
}

export default function Calls() {
  const { id } = useParams();
  const selected = id ? findCall(id) : calls[0];

  return (
    <div className={`calls ${id ? "has-detail" : ""}`}>
      <DayStrip active={selected?.id} />
      <div className="calls__split">
        <nav className="calls__list" aria-label="Calls">
          {calls.map((c) => (
            <NavLink key={c.id} to={`/app/calls/${c.id}`} className={({ isActive }) => `crow ${isActive || (!id && c === calls[0]) ? "is-on" : ""}`}>
              <span className="mono tnum dim crow__time">{fmtTime(c.startedAt)}</span>
              <span className="crow__who">
                <strong>{c.lead}</strong>
                <span className="dim">{c.company}</span>
              </span>
              <span className="crow__end">
                <Badge outcome={c.outcome} />
                <span className="mono tnum dim">{c.durationS ? fmtDuration(c.durationS) : "–"}</span>
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="calls__detail">
          {selected ? (
            <CallDetail key={selected.id} call={selected} />
          ) : (
            <div className="empty">
              <h2>Call not found</h2>
              <p className="dim">There's no call with the ID “{id}”. It may be from another workspace.</p>
              <Link className="btn btn--sm" to="/app/calls">Show all calls</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
