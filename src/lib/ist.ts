// Calling window (09:00–20:30 IST), computed from the viewer's clock.
const OPEN = 9 * 60;
const CLOSE = 20 * 60 + 30;

const span = (mins: number) => (mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`);

export function callingWindow(now = new Date()) {
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60_000);
  const mins = ist.getHours() * 60 + ist.getMinutes();
  const open = mins >= OPEN && mins < CLOSE;
  const until = open ? CLOSE - mins : (OPEN - mins + 1440) % 1440;
  return {
    open,
    until: span(until),
    time: `${String(ist.getHours()).padStart(2, "0")}:${String(ist.getMinutes()).padStart(2, "0")}:${String(ist.getSeconds()).padStart(2, "0")}`,
    dayPct: ((mins + ist.getSeconds() / 60) / 1440) * 100,
  };
}
