import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calls, outcomeLabel } from "../data/calls";

interface Item { label: string; hint: string; to: string }

const base: Item[] = [
  { label: "Calls", hint: "Go to", to: "/app/calls" },
  { label: "Leads", hint: "Go to", to: "/app/leads" },
  { label: "Team", hint: "Go to", to: "/app/team" },
  { label: "Hire an employee", hint: "Create", to: "/app/team/new" },
  { label: "Back to the site", hint: "Go to", to: "/" },
];
const items: Item[] = [
  ...base,
  ...calls.map((c) => ({ label: `${c.lead}, ${c.company}`, hint: outcomeLabel[c.outcome], to: `/app/calls/${c.id}` })),
];

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((it) => it.label.toLowerCase().includes(s)) : items.slice(0, 9);
  }, [q]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    input.current?.focus();
    return () => prev?.focus();
  }, []);

  useEffect(() => setI(0), [q]);

  const go = (it: Item | undefined) => {
    if (!it) return;
    onClose();
    navigate(it.to);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setI((v) => Math.min(v + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setI((v) => Math.max(v - 1, 0)); }
    else if (e.key === "Enter") go(results[i]);
  };

  return (
    <div className="pal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pal__box" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={onKey}>
        <input
          ref={input}
          className="pal__input"
          placeholder="Search calls, leads, pages…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          role="combobox"
          aria-expanded="true"
          aria-controls="pal-list"
          aria-activedescendant={results[i] ? `pal-${i}` : undefined}
        />
        <ul className="pal__list" id="pal-list" role="listbox">
          {results.length === 0 && <li className="pal__empty dim">Nothing matches “{q}”. Try a lead's name or company.</li>}
          {results.map((it, k) => (
            <li
              key={it.to}
              id={`pal-${k}`}
              role="option"
              aria-selected={k === i}
              className={k === i ? "is-on" : ""}
              onMouseEnter={() => setI(k)}
              onClick={() => go(it)}
            >
              <span>{it.label}</span>
              <span className="mono dim">{it.hint}</span>
            </li>
          ))}
        </ul>
        <div className="pal__foot mono dim">↑↓ to move · Enter to open · Esc to close</div>
      </div>
    </div>
  );
}
