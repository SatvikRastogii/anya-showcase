import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../lib/theme";
import { signOut } from "../Login";
import CommandPalette from "./CommandPalette";
import { calls } from "../data/calls";
import { leads } from "../data/leads";
import { callingWindow } from "../lib/ist";
import "./app.css";

const titles: [string, string][] = [
  ["/app/team/new", "Hire an employee"],
  ["/app/calls", "Calls"],
  ["/app/leads", "Leads"],
  ["/app/team", "Team"],
];

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const icons = {
  calls: "M3 12h3l2-6 4 12 3-9 2 3h4",
  leads: "M4 6h16M4 12h10M4 18h7",
  team: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6M2 20c0-3 3-5 6-5s6 2 6 5m2-5c3 0 6 2 6 5",
  hire: "M12 5v14M5 12h14",
};

export default function Shell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [win, setWin] = useState(callingWindow);
  const title = titles.find(([p]) => pathname.startsWith(p))?.[1] ?? "Not found";
  const due = leads.filter((l) => l.status === "due").length;

  useEffect(() => {
    const id = window.setInterval(() => setWin(callingWindow()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.title = `${title} · Anya`;
  }, [title]);

  return (
    <div className="app">
      <aside className="side">
        <Link to="/" className="side__mark" aria-label="Anya by Texnoid, back to the site">
          <svg width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M3 16h5l3-8 4 16 4-12 3 4h7" fill="none" stroke="var(--signal)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Anya
        </Link>
        <nav className="side__nav" aria-label="Dashboard">
          <NavLink to="/app/calls"><Icon d={icons.calls} /><span>Calls</span><em className="mono">{calls.length}</em></NavLink>
          <NavLink to="/app/leads"><Icon d={icons.leads} /><span>Leads</span><em className="mono">{due} due</em></NavLink>
          <NavLink to="/app/team" end><Icon d={icons.team} /><span>Team</span></NavLink>
          <NavLink to="/app/team/new" className="side__hire"><Icon d={icons.hire} /><span>Hire</span></NavLink>
        </nav>
        <div className="side__foot">
          <div className="side__org">
            <span className="side__avatar" aria-hidden="true">T</span>
            <div>
              <div>Texnoid</div>
              <div className="mono dim">Demo workspace</div>
            </div>
            <button className="side__out mono" onClick={() => { signOut(); navigate("/"); }}>Log out</button>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="top">
          <h1 className="top__title">{title}</h1>
          <span className={`top__window mono ${win.open ? "is-open" : ""}`} title="Anya only dials between 09:00 and 20:30 IST">
            <i className={`dot ${win.open ? "dot--live" : ""}`} />
            {win.open ? `Calling window open, closes in ${win.until}` : `Calling window closed, opens in ${win.until}`}
          </span>
          <button className="top__search" onClick={() => setPaletteOpen(true)} aria-label="Search (Ctrl K)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <span>Search</span>
            <kbd className="mono">⌘K</kbd>
          </button>
          <ThemeToggle />
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}
