export interface Employee {
  id: string;
  name: string;
  role: string;
  voice: string;
  languages: string[];
  status: "live" | "paused" | "draft";
  callsToday: number;
  booked: number;
  opening: string;
}

export const team: Employee[] = [
  {
    id: "anya",
    name: "Anya",
    role: "Sales: calls new leads, qualifies, books demos",
    voice: "Bulbul v3 · Priya",
    languages: ["English", "Hindi"],
    status: "live",
    callsToday: 47,
    booked: 6,
    opening: "Hi, this is Anya from Texnoid. You recently enquired on our website about automating your business calls.",
  },
  {
    id: "meera",
    name: "Meera",
    role: "Receptionist: answers clinic calls, books appointments",
    voice: "Bulbul v3 · Kavya",
    languages: ["English", "Hindi", "Tamil"],
    status: "paused",
    callsToday: 0,
    booked: 0,
    opening: "Good morning, Bloom Dental. This is Meera, how can I help you today?",
  },
  {
    id: "kabir",
    name: "Kabir",
    role: "Collections: reminds customers about due invoices",
    voice: "ElevenLabs · Arjun",
    languages: ["English", "Hindi", "Marathi"],
    status: "draft",
    callsToday: 0,
    booked: 0,
    opening: "Hello, this is Kabir calling from Gupta Hardware about your invoice from September.",
  },
];
