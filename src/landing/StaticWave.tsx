// Fallback for no WebGL / reduced motion: one frozen utterance.
const N = 140;
const bars = Array.from({ length: N }, (_, i) => {
  const x = (i / (N - 1)) * 2 - 1;
  const bell = Math.exp(-Math.pow(x * 1.45, 2));
  const w = Math.abs(Math.sin(x * 17) * 0.5 + Math.sin(x * 43 + 1) * 0.22 + Math.sin(x * 6 + 2) * 0.38);
  return Math.max(0.02, w * bell);
});

export default function StaticWave() {
  return (
    <svg className="wavefield wavefield--static" viewBox={`0 0 ${N * 6} 200`} preserveAspectRatio="none" aria-hidden="true">
      {bars.map((h, i) => (
        <rect key={i} x={i * 6 + 1} y={100 - h * 90} width="2" height={h * 180} rx="1" fill={h > 0.35 ? "var(--signal)" : "var(--bone)"} opacity={0.35 + h} />
      ))}
    </svg>
  );
}
