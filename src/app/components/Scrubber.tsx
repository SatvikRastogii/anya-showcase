import { useEffect, useMemo, useRef } from "react";
import type { AgentTurn } from "../../data/calls";
import { fmtDuration } from "../../data/calls";

// Deterministic "recording" bars per call, so each call has its own shape.
function bars(seed: string, n: number) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: n }, (_, i) => {
    h = (h * 1664525 + 1013904223) >>> 0;
    const r = h / 2 ** 32;
    const env = 0.35 + 0.65 * Math.abs(Math.sin(i / 7.3 + r));
    return Math.max(0.06, r * env);
  });
}

interface Props {
  id: string;
  duration: number;
  path: AgentTurn[];
  t: number;
  playing: boolean;
  onSeek: (t: number) => void;
  onTick: (t: number) => void;
  onToggle: () => void;
}

export default function Scrubber({ id, duration, path, t, playing, onSeek, onTick, onToggle }: Props) {
  const data = useMemo(() => bars(id, 140), [id]);
  const track = useRef<HTMLDivElement>(null);
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const next = tRef.current + (now - last) / 1000;
      last = now;
      onTick(Math.min(next, duration));
      if (next < duration) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, onTick]);

  const seekFrom = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * duration);
  };
  const pct = duration ? (t / duration) * 100 : 0;

  return (
    <div className="scrub">
      <div className="scrub__row">
        <button className="scrub__play" onClick={onToggle} aria-label={playing ? "Pause recording" : "Play recording"}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" fill="currentColor" /><rect x="8.5" y="1" width="3.5" height="12" fill="currentColor" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1l10 6-10 6z" fill="currentColor" /></svg>
          )}
        </button>
        <div
          className="scrub__track"
          ref={track}
          role="slider"
          tabIndex={0}
          aria-label="Recording position"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={Math.round(t)}
          aria-valuetext={`${fmtDuration(Math.round(t))} of ${fmtDuration(duration)}`}
          onPointerDown={(e) => seekFrom(e.clientX)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") onSeek(Math.min(duration, t + 5));
            if (e.key === "ArrowLeft") onSeek(Math.max(0, t - 5));
          }}
        >
          <div className="scrub__bars" aria-hidden="true">
            {data.map((h, i) => (
              <span key={i} className={(i / data.length) * 100 <= pct ? "is-played" : ""} style={{ transform: `scaleY(${h})` }} />
            ))}
          </div>
          <div className="scrub__head" style={{ left: `${pct}%` }} aria-hidden="true" />
          <div className="scrub__agents" aria-hidden="true">
            {path.map((p) => (
              <span
                key={p.agent + p.at}
                className={`scrub__seg is-${p.agent.toLowerCase()}`}
                style={{ left: `${(p.at / duration) * 100}%`, width: `${((p.until - p.at) / duration) * 100}%` }}
              >
                {p.agent}
              </span>
            ))}
          </div>
        </div>
        <span className="mono tnum scrub__time">{fmtDuration(Math.round(t))} / {fmtDuration(duration)}</span>
      </div>
    </div>
  );
}
