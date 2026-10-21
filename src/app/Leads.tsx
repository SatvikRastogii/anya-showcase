import { useState } from "react";
import { leads, statusLabel, type LeadStatus } from "../data/leads";
import { Pill } from "./components/Badge";

const filters: { label: string; match: LeadStatus[] }[] = [
  { label: "All", match: [] },
  { label: "Due now", match: ["due"] },
  { label: "Retrying", match: ["retry_2h", "retry_1d"] },
  { label: "Callbacks", match: ["callback"] },
  { label: "Booked", match: ["booked"] },
  { label: "Blocked", match: ["dnd_blocked", "do_not_call"] },
];

const tone = (s: LeadStatus) =>
  s === "booked" ? "ok" : s === "due" ? "signal" : s === "callback" || s.startsWith("retry") ? "warn" : "bad";

export default function Leads() {
  const [f, setF] = useState(0);
  const [note, setNote] = useState("");
  const rows = f === 0 ? leads : leads.filter((l) => filters[f].match.includes(l.status));

  return (
    <div className="leads">
      <div className="leads__bar">
        <div className="chips" role="group" aria-label="Filter leads">
          {filters.map((x, i) => {
            const n = i === 0 ? leads.length : leads.filter((l) => x.match.includes(l.status)).length;
            return (
              <button key={x.label} className={`chip ${f === i ? "is-on" : ""}`} aria-pressed={f === i} onClick={() => setF(i)}>
                {x.label} <span className="mono">{n}</span>
              </button>
            );
          })}
        </div>
        <div className="leads__actions">
          <button className="btn btn--sm" onClick={() => setNote("Uploads are switched off in this demo.")}>Upload a list</button>
          <button className="btn btn--sm btn--signal" onClick={() => setNote("Adding leads is switched off in this demo.")}>Add lead</button>
        </div>
      </div>
      {note && <p className="note mono" role="status">{note}</p>}

      <div className="ladder" aria-label="Retry rules">
        <span className="mono dim">When nobody answers</span>
        <ol>
          <li>Call</li>
          <li>Retry after 2 hours</li>
          <li>Retry after 1 day</li>
          <li className="is-end">DND list, never dialled again</li>
        </ol>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Lead</th>
            <th>Phone</th>
            <th>Source</th>
            <th>Status</th>
            <th className="num">Tries</th>
            <th>Next call</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l.phone}>
              <td data-label="Lead"><div className="lead-cell"><strong>{l.name}</strong><span className="dim">{l.company}</span></div></td>
              <td data-label="Phone" className="mono tnum">{l.phone}</td>
              <td data-label="Source" className="dim">{l.source}</td>
              <td data-label="Status"><Pill tone={tone(l.status)}>{statusLabel[l.status]}</Pill></td>
              <td data-label="Tries" className="num mono tnum">{l.attempts}/3</td>
              <td data-label="Next call" className={l.next === "Never" ? "dim" : ""}>{l.next}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
