import { useEffect, useRef } from "react";
import { token, type Theme } from "../lib/theme";
import { LAND, LAND_H, LAND_W } from "../data/land";

const RAD = Math.PI / 180;
const TILT = 18 * RAD;
const LEVELS = 8;
// The sphere sits this far (as a share of its radius) below the top edge, so a little of its crown shows.
const DROP = 0.2;

// Dots on an even-ish lat/lon grid; land dots are bright, sea dots barely there.
const bits = Uint8Array.from(atob(LAND), (c) => c.charCodeAt(0));
const isLand = (lat: number, lon: number) => {
  const r = Math.min(LAND_H - 1, Math.floor(((90 - lat) / 180) * LAND_H));
  const c = Math.min(LAND_W - 1, Math.floor(((lon + 180) / 360) * LAND_W));
  const i = r * LAND_W + c;
  return (bits[i >> 3] >> (i & 7)) & 1;
};
// Some land dots glow in the brand orange.
const hash = (a: number, b: number) => Math.abs(Math.sin(a * 12.9898 + b * 78.233) * 43758.5453) % 1;
const dots: { sp: number; cp: number; lon: number; land: number; hot: boolean }[] = [];
for (let lat = -84; lat <= 84; lat += 1.15) {
  const step = 1.15 / Math.max(Math.cos(lat * RAD), 0.15);
  for (let lon = -180; lon < 180; lon += step) {
    const land = isLand(lat, lon);
    dots.push({ sp: Math.sin(lat * RAD), cp: Math.cos(lat * RAD), lon: lon * RAD, land, hot: !!land && hash(lat, lon) < 0.3 });
  }
}

// Network: well-spread land "hubs", each wired to its nearest neighbours.
const unit = (d: { sp: number; cp: number; lon: number }) => [d.cp * Math.cos(d.lon), d.cp * Math.sin(d.lon), d.sp];
const hubs: (typeof dots)[number][] = [];
const hubVec: number[][] = [];
const MIN_GAP = Math.cos(9 * RAD);
for (const d of dots.filter((d) => d.land).sort((a, b) => hash(a.lon, a.sp) - hash(b.lon, b.sp))) {
  const v = unit(d);
  if (hubVec.some((h) => h[0] * v[0] + h[1] * v[1] + h[2] * v[2] > MIN_GAP)) continue;
  hubs.push(d);
  hubVec.push(v);
}
const links: [number, number][] = [];
const MAX_LINK = Math.cos(24 * RAD);
hubVec.forEach((a, i) => {
  hubVec
    .map((b, j) => [j, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]] as const)
    .filter(([j, c]) => j > i && c > MAX_LINK)
    .sort((p, q) => q[1] - p[1])
    .slice(0, 2)
    .forEach(([j]) => links.push([i, j]));
});
// Each link fires a pulse now and then, at its own offset, so traffic looks live rather than in sync.
const pulses = links.map(([i, j]) => ({ off: hash(i, j) * 7, period: 3 + hash(j, i) * 5, rev: hash(i + j, i) < 0.5 }));

/** Dotted globe with an orange network, centred just below the top-right corner so only its left side shows. Spins slowly. */
export default function Globe({ theme, still }: { theme: Theme; still: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const canvas = document.createElement("canvas");
    el.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    let size = 0;
    const resize = () => {
      size = el.clientWidth;
      canvas.width = canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) draw(start);
    };

    // Opens with India in view; the visible quarter sits about 45° west of the centre meridian.
    const start = 120 * RAD;
    const stroke = token("--bone");
    const signal = token("--signal");
    const st = Math.sin(TILT);
    const ct = Math.cos(TILT);
    const buckets: number[][] = Array.from({ length: LEVELS * 2 }, () => []); // [bone levels..., orange levels...]

    // Orthographic projection; null when the point faces away or falls right of the centre (off screen).
    const project = (d: { sp: number; cp: number; lon: number }, rot: number) => {
      const dl = d.lon - rot;
      const cl = Math.cos(dl);
      const depth = st * d.sp + ct * d.cp * cl;
      const x = d.cp * Math.sin(dl);
      if (depth <= 0 || x > 0) return null;
      return [size + x * size, size * DROP - (ct * d.sp - st * d.cp * cl) * size, depth] as const;
    };

    const draw = (rot: number, t = -1) => {
      for (const b of buckets) b.length = 0;
      for (const d of dots) {
        const p = project(d, rot);
        if (!p || p[1] < 0 || p[1] > size) continue;
        const a = (d.land ? 1 : 0.38) * (0.3 + 0.7 * p[2]);
        buckets[Math.min(LEVELS - 1, Math.floor(a * LEVELS)) + (d.hot ? LEVELS : 0)].push(p[0], p[1], d.land ? 1.6 : 1.1);
      }
      ctx.clearRect(0, 0, size, size);

      // Links first, so the dots sit on top of them.
      const pts = hubs.map((h) => project(h, rot));
      ctx.strokeStyle = signal;
      ctx.lineWidth = 0.8;
      for (const [i, j] of links) {
        const a = pts[i];
        const b = pts[j];
        if (!a || !b) continue;
        ctx.globalAlpha = 0.3 * Math.min(a[2], b[2]);
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
      // Shooting-star pulses: a bright head with a tail that fades out behind it.
      if (t >= 0) {
        ctx.lineCap = "round";
        links.forEach(([i, j], k) => {
          const pl = pulses[k];
          const [a, b] = pl.rev ? [pts[j], pts[i]] : [pts[i], pts[j]];
          if (!a || !b) return;
          const head = ((t + pl.off) % pl.period) / 1.2; // 1.2 s to cross, then idle for the rest of the period
          if (head > 1.35) return;
          const depth = Math.min(a[2], b[2]);
          const at = (f: number) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
          for (let seg = 0; seg < 6; seg++) {
            const f1 = Math.min(1, head - seg * 0.06);
            const f0 = Math.min(1, head - (seg + 1) * 0.06);
            if (f1 <= 0 || f0 >= 1) continue;
            const [x0, y0] = at(Math.max(0, f0));
            const [x1, y1] = at(f1);
            ctx.globalAlpha = depth * (1 - seg / 6) * 0.9;
            ctx.lineWidth = 1.8 - seg * 0.2;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
          }
          if (head <= 1) {
            const [hx, hy] = at(head);
            ctx.fillStyle = signal;
            ctx.globalAlpha = depth;
            ctx.beginPath();
            ctx.arc(hx, hy, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      ctx.fillStyle = signal;
      for (const p of pts) {
        if (!p) continue;
        ctx.globalAlpha = 0.4 + 0.6 * p[2];
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      buckets.forEach((b, i) => {
        if (!b.length) return;
        ctx.fillStyle = i < LEVELS ? stroke : signal;
        ctx.globalAlpha = ((i % LEVELS) + 1) / LEVELS;
        ctx.beginPath();
        for (let i = 0; i < b.length; i += 3) ctx.rect(b[i], b[i + 1], b[i + 2], b[i + 2]);
        ctx.fill();
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) draw(start - ms / 1000 * 0.06, ms / 1000);
    };
    if (!still) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.remove();
    };
  }, [theme, still]);

  return <div ref={host} className="globe" aria-hidden="true" />;
}
