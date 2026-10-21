// DRAFT prices for the owner to adjust. Competitor figures: public list prices
// gathered Oct 2026 from vendor pages and comparison blogs; approximate.

export interface Plan {
  name: string;
  price: string;
  per: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    name: "Trial",
    price: "₹0",
    per: "for 14 days",
    blurb: "Hear her on your own leads before paying anything.",
    features: ["50 call minutes", "1 employee", "Test calls to your phone", "All 11 languages"],
    cta: "Start free",
  },
  {
    name: "Growth",
    price: "₹2,999",
    per: "a month",
    blurb: "For a team getting a few dozen enquiries a day.",
    features: ["1,000 minutes included", "3 employees", "Indian number included", "Extra minutes ₹3.5 each", "Calendar and CRM sync"],
    cta: "Start with Growth",
    featured: true,
  },
  {
    name: "Scale",
    price: "₹9,999",
    per: "a month",
    blurb: "For sales floors and multi-branch businesses.",
    features: ["4,000 minutes included", "Unlimited employees", "3 Indian numbers", "Extra minutes ₹2.5 each", "Priority support"],
    cta: "Start with Scale",
  },
  {
    name: "Enterprise",
    price: "Let's talk",
    per: "",
    blurb: "Your own numbers, volume pricing and on-call support.",
    features: ["Custom minute rates", "Dedicated numbers and DLT help", "SSO and audit logs", "A named account manager"],
    cta: "Talk to us",
  },
];

/** Per connected minute, in rupees. [low, high]. */
export const comparison: { name: string; range: [number, number]; us?: boolean }[] = [
  { name: "Anya by Texnoid", range: [2.5, 3], us: true },
  { name: "Bolna", range: [5.5, 7] },
  { name: "Ringg AI", range: [6, 7] },
  { name: "Retell, Vapi, Bland", range: [8, 26] },
];

export const MINUTES_PER_CALL = 2.5;
export const WORKING_DAYS = 26;
export const TELECALLER_MONTHLY = 20000;
export const CALLS_PER_TELECALLER_DAY = 120;

/** What a month costs us vs. people, for a given number of calls a day. */
export function monthly(callsPerDay: number) {
  const minutes = Math.round(callsPerDay * MINUTES_PER_CALL * WORKING_DAYS);
  const ours = minutes <= 1000 ? 2999 : minutes <= 4000 ? 9999 : 9999 + (minutes - 4000) * 2.5;
  const people = Math.max(1, Math.ceil(callsPerDay / CALLS_PER_TELECALLER_DAY));
  return { minutes, ours: Math.round(ours), people, theirs: people * TELECALLER_MONTHLY };
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
