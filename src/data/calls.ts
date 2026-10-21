// Mock calls shaped after src/anya_core/call_record.py (CallRecord / AgentTurn).

export type Outcome =
  | "qualified"
  | "disqualified"
  | "callback_requested"
  | "no_answer"
  | "voicemail"
  | "transferred"
  | "abandoned"
  | "error";

export type Agent = "Greeter" | "Qualifier" | "Scheduler" | "Fallback";

export interface AgentTurn {
  agent: Agent;
  at: number; // seconds into the call
  until: number;
  reason?: string;
}

export interface Line {
  who: "anya" | "lead";
  t: number;
  text: string;
}

export interface Answers {
  calls?: string;
  volume?: string;
  timeline?: string;
  deciders?: string;
  budget?: string;
}

export interface Call {
  id: string;
  startedAt: string; // ISO, IST
  durationS: number;
  lead: string;
  company: string;
  phone: string;
  source: "Website" | "Meta lead ad" | "CSV upload";
  outcome: Outcome;
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
  nextStep: string;
  path: AgentTurn[];
  answers: Answers;
  transcript: Line[];
  llmRequests: number;
  errors: string[];
}

export const outcomeLabel: Record<Outcome, string> = {
  qualified: "Booked",
  disqualified: "Not a fit",
  callback_requested: "Callback",
  no_answer: "No answer",
  voicemail: "Voicemail",
  transferred: "Transferred",
  abandoned: "Hung up",
  error: "Error",
};

const qualifiedTranscript: Line[] = [
  { who: "anya", t: 0, text: "Hi, this is Anya from Texnoid. You recently enquired on our website about automating your business calls. Do you have two minutes for a few quick questions?" },
  { who: "lead", t: 9, text: "Yes, go ahead." },
  { who: "anya", t: 11, text: "Which calls would you like to automate first?" },
  { who: "lead", t: 15, text: "Mostly the inbound support calls. Order status, delivery dates, that kind of thing." },
  { who: "anya", t: 21, text: "Got it, the order and delivery questions. Roughly how many calls do you get a day?" },
  { who: "lead", t: 26, text: "Around fifty, sometimes more on Mondays." },
  { who: "anya", t: 29, text: "So around fifty calls a day, got it. When would you like this running?" },
  { who: "lead", t: 34, text: "Ideally before Diwali, so this month." },
  { who: "anya", t: 37, text: "This month, noted. Who else is involved in deciding?" },
  { who: "lead", t: 41, text: "Just me and my co-founder." },
  { who: "anya", t: 44, text: "Perfect, let me just pull up our calendar. Would Wednesday the 21st or Thursday the 22nd work better?" },
  { who: "lead", t: 51, text: "Thursday, around five." },
  { who: "anya", t: 54, text: "And which email should the invite go to?" },
  { who: "lead", t: 57, text: "priya at gmail dot com." },
  { who: "anya", t: 61, text: "One moment, let me note that down. So that's Thursday, the 22nd of October 2026 at 5 pm, and the invite goes to priya at gmail dot com. Is that right?" },
  { who: "lead", t: 71, text: "Yes, that's right." },
  { who: "anya", t: 73, text: "Done. You'll get the invite in a minute. Thank you, have a good evening." },
];

export const calls: Call[] = [
  {
    id: "a41f09c2be73",
    startedAt: "2026-10-15T17:42:10+05:30",
    durationS: 78,
    lead: "Priya Raman",
    company: "Kettle & Crumb",
    phone: "+91 98•• ••4210",
    source: "Website",
    outcome: "qualified",
    sentiment: "positive",
    summary: "Wants inbound order and delivery calls handled before Diwali. About 50 calls a day. Decides with her co-founder.",
    nextStep: "Demo booked for Thu 22 Oct, 5:00 pm. Invite sent to priya@gmail.com.",
    path: [
      { agent: "Greeter", at: 0, until: 10, reason: "Identity confirmed" },
      { agent: "Qualifier", at: 10, until: 44, reason: "All four answers recorded" },
      { agent: "Scheduler", at: 44, until: 78, reason: "Slot confirmed after read-back" },
    ],
    answers: { calls: "Inbound support: order status, delivery dates", volume: "~50 a day", timeline: "This month", deciders: "Founder and co-founder" },
    transcript: qualifiedTranscript,
    llmRequests: 9,
    errors: [],
  },
  {
    id: "7c2d5e81f0aa",
    startedAt: "2026-10-15T17:31:48+05:30",
    durationS: 22,
    lead: "Arjun Mehta",
    company: "Mehta Logistics",
    phone: "+91 99•• ••0381",
    source: "Meta lead ad",
    outcome: "voicemail",
    sentiment: "neutral",
    summary: "Carrier voicemail detected 2.1 s into the call. Hung up before Anya spoke.",
    nextStep: "Retry in 2 hours (attempt 2 of 3).",
    path: [{ agent: "Greeter", at: 0, until: 3, reason: "Voicemail detected, no LLM request" }],
    answers: {},
    transcript: [{ who: "lead", t: 0, text: "The person you are calling is not available. Please leave a message after the tone." }],
    llmRequests: 0,
    errors: [],
  },
  {
    id: "e93b1a7d4c05",
    startedAt: "2026-10-15T16:58:02+05:30",
    durationS: 41,
    lead: "Sana Qureshi",
    company: "Bloom Dental",
    phone: "+91 97•• ••7752",
    source: "Website",
    outcome: "callback_requested",
    sentiment: "neutral",
    summary: "In a clinic session. Asked to be called back tomorrow morning.",
    nextStep: "Callback Fri 16 Oct, 11:00 am.",
    path: [
      { agent: "Greeter", at: 0, until: 12, reason: "Caller busy" },
      { agent: "Fallback", at: 12, until: 41, reason: "Callback time captured" },
    ],
    answers: {},
    transcript: [
      { who: "anya", t: 0, text: "Hi, this is Anya from Texnoid. You recently enquired on our website about automating your business calls. Do you have two minutes for a few quick questions?" },
      { who: "lead", t: 9, text: "I'm with a patient right now. Can you call tomorrow?" },
      { who: "anya", t: 13, text: "Of course. What time tomorrow works for you?" },
      { who: "lead", t: 17, text: "Around eleven." },
      { who: "anya", t: 19, text: "Tomorrow at 11 am then. Thank you, talk soon." },
    ],
    llmRequests: 3,
    errors: [],
  },
  {
    id: "1f8a6c3e92d4",
    startedAt: "2026-10-15T16:20:44+05:30",
    durationS: 96,
    lead: "Rohit Bansal",
    company: "Bansal Realty",
    phone: "+91 98•• ••1190",
    source: "Meta lead ad",
    outcome: "transferred",
    sentiment: "negative",
    summary: "Asked twice to speak to a person. Frustration detected; transferred to sales.",
    nextStep: "Handed to Karan (sales). No further automated calls.",
    path: [
      { agent: "Greeter", at: 0, until: 11, reason: "Identity confirmed" },
      { agent: "Qualifier", at: 11, until: 52, reason: "Caller asked for a human" },
      { agent: "Fallback", at: 52, until: 96, reason: "Warm transfer to sales" },
    ],
    answers: { calls: "Site-visit bookings", volume: "~120 a day" },
    transcript: [
      { who: "anya", t: 0, text: "Hi, this is Anya from Texnoid. You recently enquired on our website about automating your business calls. Do you have two minutes for a few quick questions?" },
      { who: "lead", t: 9, text: "Okay." },
      { who: "anya", t: 11, text: "Which calls would you like to automate first?" },
      { who: "lead", t: 15, text: "Site visit bookings. Look, is there a person I can talk to?" },
      { who: "anya", t: 22, text: "Site visit bookings, got it. Roughly how many calls do you get a day?" },
      { who: "lead", t: 27, text: "Maybe a hundred and twenty. I really want to speak to someone." },
      { who: "anya", t: 52, text: "Of course. I'm connecting you to Karan from our team now. One moment." },
    ],
    llmRequests: 6,
    errors: [],
  },
  {
    id: "5b0e4d27a8c1",
    startedAt: "2026-10-15T15:47:19+05:30",
    durationS: 19,
    lead: "Neha Kapoor",
    company: "Studio Kapoor",
    phone: "+91 90•• ••6604",
    source: "Website",
    outcome: "disqualified",
    sentiment: "neutral",
    summary: "Not interested. Thanked and hung up straight away.",
    nextStep: "None. Marked closed.",
    path: [
      { agent: "Greeter", at: 0, until: 13, reason: "Not interested" },
      { agent: "Fallback", at: 13, until: 19, reason: "Polite close" },
    ],
    answers: {},
    transcript: [
      { who: "anya", t: 0, text: "Hi, this is Anya from Texnoid. You recently enquired on our website about automating your business calls. Do you have two minutes for a few quick questions?" },
      { who: "lead", t: 9, text: "No, we sorted it already. Not interested." },
      { who: "anya", t: 13, text: "No problem at all. Thank you for your time." },
    ],
    llmRequests: 1,
    errors: [],
  },
  {
    id: "c6d93a10e7f2",
    startedAt: "2026-10-15T15:12:55+05:30",
    durationS: 0,
    lead: "Vikram Iyer",
    company: "Iyer Auto Parts",
    phone: "+91 96•• ••3308",
    source: "CSV upload",
    outcome: "no_answer",
    sentiment: "neutral",
    summary: "Rang for 30 seconds. Not answered.",
    nextStep: "Retry tomorrow at 10:00 am (attempt 3 of 3).",
    path: [],
    answers: {},
    transcript: [],
    llmRequests: 0,
    errors: [],
  },
  {
    id: "9e2f7b5c1d38",
    startedAt: "2026-10-15T14:36:27+05:30",
    durationS: 84,
    lead: "Ananya Das",
    company: "Das Diagnostics",
    phone: "+91 98•• ••5521",
    source: "Website",
    outcome: "qualified",
    sentiment: "positive",
    summary: "Wants appointment-reminder calls in Hindi and Bengali. About 200 a day, starting next month.",
    nextStep: "Demo booked for Wed 21 Oct, 11:30 am.",
    path: [
      { agent: "Greeter", at: 0, until: 9, reason: "Identity confirmed" },
      { agent: "Qualifier", at: 9, until: 51, reason: "All four answers recorded" },
      { agent: "Scheduler", at: 51, until: 84, reason: "Slot confirmed after read-back" },
    ],
    answers: { calls: "Appointment reminders (Hindi, Bengali)", volume: "~200 a day", timeline: "Next month", deciders: "Operations head", budget: "Mentioned ₹40k/month" },
    transcript: qualifiedTranscript.slice(0, 6),
    llmRequests: 10,
    errors: [],
  },
  {
    id: "3a71c8e5f6b9",
    startedAt: "2026-10-15T13:58:03+05:30",
    durationS: 14,
    lead: "Farhan Ali",
    company: "Ali Textiles",
    phone: "+91 93•• ••8847",
    source: "Meta lead ad",
    outcome: "voicemail",
    sentiment: "neutral",
    summary: "Carrier message: number switched off. Hung up without any LLM request.",
    nextStep: "Retry in 2 hours (attempt 2 of 3).",
    path: [{ agent: "Greeter", at: 0, until: 2, reason: "Carrier message detected, no LLM request" }],
    answers: {},
    transcript: [{ who: "lead", t: 0, text: "The number you have dialled is currently switched off." }],
    llmRequests: 0,
    errors: [],
  },
  {
    id: "f0b4e6a2c913",
    startedAt: "2026-10-15T12:44:31+05:30",
    durationS: 33,
    lead: "Meera Pillai",
    company: "Coastline Homestays",
    phone: "+91 94•• ••2275",
    source: "Website",
    outcome: "abandoned",
    sentiment: "neutral",
    summary: "Caller went silent. Anya checked in three times, then ended the call.",
    nextStep: "Retry in 2 hours (attempt 2 of 3).",
    path: [{ agent: "Greeter", at: 0, until: 33, reason: "Silence timeout" }],
    answers: {},
    transcript: [
      { who: "anya", t: 0, text: "Hi, this is Anya from Texnoid. You recently enquired on our website about automating your business calls. Do you have two minutes for a few quick questions?" },
      { who: "anya", t: 17, text: "Hello, is anyone there?" },
      { who: "anya", t: 24, text: "Hello, is anyone there?" },
      { who: "anya", t: 31, text: "I can't hear anything from your side. Please call us back on this same number to know more. Thank you." },
    ],
    llmRequests: 0,
    errors: [],
  },
  {
    id: "2d58f1b7e04c",
    startedAt: "2026-10-15T11:20:09+05:30",
    durationS: 6,
    lead: "Kabir Sethi",
    company: "Sethi & Sons",
    phone: "+91 98•• ••9013",
    source: "CSV upload",
    outcome: "error",
    sentiment: "neutral",
    summary: "Speech provider out of credits. Ended the call instead of leaving dead air.",
    nextStep: "Retry in 2 hours once credits are topped up.",
    path: [{ agent: "Greeter", at: 0, until: 6, reason: "Provider failure" }],
    answers: {},
    transcript: [],
    llmRequests: 0,
    errors: ["sarvam.tts: 402 Credits exhausted", "Fallback TTS not configured; ending call"],
  },
  {
    id: "b7c03e9a5f21",
    startedAt: "2026-10-15T10:05:46+05:30",
    durationS: 88,
    lead: "Ishaan Gupta",
    company: "Gupta Hardware",
    phone: "+91 99•• ••6648",
    source: "Website",
    outcome: "qualified",
    sentiment: "positive",
    summary: "Wants to automate dealer enquiry calls. About 80 a day, in two weeks.",
    nextStep: "Demo booked for Mon 19 Oct, 3:00 pm.",
    path: [
      { agent: "Greeter", at: 0, until: 10, reason: "Identity confirmed" },
      { agent: "Qualifier", at: 10, until: 55, reason: "All four answers recorded" },
      { agent: "Scheduler", at: 55, until: 88, reason: "Slot confirmed after read-back" },
    ],
    answers: { calls: "Dealer enquiries", volume: "~80 a day", timeline: "In two weeks", deciders: "Himself" },
    transcript: qualifiedTranscript.slice(0, 8),
    llmRequests: 9,
    errors: [],
  },
  {
    id: "64e1a9d2c8b0",
    startedAt: "2026-10-15T09:14:22+05:30",
    durationS: 27,
    lead: "Lakshmi Narayan",
    company: "LN Caterers",
    phone: "+91 97•• ••4436",
    source: "Meta lead ad",
    outcome: "disqualified",
    sentiment: "negative",
    summary: "Asked to remove her number. Removed; she will never be called again.",
    nextStep: "Added to do-not-call.",
    path: [
      { agent: "Greeter", at: 0, until: 14, reason: "Remove my number" },
      { agent: "Fallback", at: 14, until: 27, reason: "Do-not-call recorded" },
    ],
    answers: {},
    transcript: [
      { who: "anya", t: 0, text: "Hi, this is Anya from Texnoid. You recently enquired on our website about automating your business calls. Do you have two minutes for a few quick questions?" },
      { who: "lead", t: 9, text: "Please remove my number from your list." },
      { who: "anya", t: 13, text: "Done, your number has been removed and you won't be called again. Sorry for the trouble." },
    ],
    llmRequests: 1,
    errors: [],
  },
];

export const findCall = (id: string | undefined) => calls.find((c) => c.id === id);

export const fmtDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export const fmtTime = (iso: string) => iso.slice(11, 16);
