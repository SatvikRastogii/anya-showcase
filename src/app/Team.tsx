import { useState } from "react";
import { Link } from "react-router-dom";
import { team } from "../data/team";
import { Pill } from "./components/Badge";

const statusTone = { live: "ok", paused: "warn", draft: "mute" } as const;
const statusText = { live: "Taking calls", paused: "Paused", draft: "Draft" };

export default function Team() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="team">
      {note && <p className="note mono" role="status">{note}</p>}
      <ul className="team__list">
        {team.map((e) => (
          <li key={e.id} className="emp">
            <div className="emp__id">
              <span className={`emp__avatar ${e.status === "live" ? "is-live" : ""}`} aria-hidden="true">{e.name[0]}</span>
              <div>
                <h2>{e.name}</h2>
                <p className="dim">{e.role}</p>
              </div>
            </div>
            <blockquote className="emp__quote">“{e.opening}”</blockquote>
            <dl className="emp__facts">
              <div><dt className="mono dim">Voice</dt><dd>{e.voice}</dd></div>
              <div><dt className="mono dim">Speaks</dt><dd>{e.languages.join(", ")}</dd></div>
              <div><dt className="mono dim">Today</dt><dd className="tnum">{e.callsToday} calls, {e.booked} booked</dd></div>
            </dl>
            <div className="emp__end">
              <Pill tone={statusTone[e.status]}>{statusText[e.status]}</Pill>
              <button className="btn btn--sm" onClick={() => setNote(`Test calls are switched off in this demo. ${e.name} would ring your phone now.`)}>
                Test call
              </button>
            </div>
          </li>
        ))}
        <li>
          <Link to="/app/team/new" className="emp emp--new">
            <span className="emp__avatar" aria-hidden="true">+</span>
            <div>
              <h2>Hire an employee</h2>
              <p className="dim">Describe the job in a sentence or two. Anya drafts the voice, the opening line and the questions.</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
