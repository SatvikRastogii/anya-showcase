import { outcomeLabel, type Outcome } from "../../data/calls";

const tone: Record<Outcome, string> = {
  qualified: "ok",
  callback_requested: "warn",
  transferred: "warn",
  disqualified: "mute",
  no_answer: "mute",
  voicemail: "mute",
  abandoned: "mute",
  error: "bad",
};

export function Badge({ outcome }: { outcome: Outcome }) {
  return <span className={`badge badge--${tone[outcome]}`}>{outcomeLabel[outcome]}</span>;
}

export function Pill({ children, tone: t = "mute" }: { children: React.ReactNode; tone?: "ok" | "warn" | "bad" | "mute" | "signal" }) {
  return <span className={`badge badge--${t}`}>{children}</span>;
}
