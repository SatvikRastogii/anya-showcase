// Real recordings, taken from data/tts_cache (matched by sha256 of voice key + text).

export interface Greeting {
  id: "en" | "hi" | "ta";
  tab: string;
  speaker: string;
  voice: string;
  src: string;
  text: string;
}

export const greetings: Greeting[] = [
  {
    id: "en",
    tab: "English",
    speaker: "Anya",
    voice: "Sarvam · Ritu",
    src: "/voices/anya-en-greeting.mp3",
    text: "Hi, this is Anya from Texnoid. You recently enquired on our website about automating your business calls. Do you have two minutes for a few quick questions?",
  },
  {
    id: "hi",
    tab: "हिन्दी",
    speaker: "Anya",
    voice: "ElevenLabs",
    src: "/voices/anya-hi-greeting.mp3",
    text: "Hi, Anya बोल रही हूँ Texnoid से. आपने हमारी website पर form भरा था. अभी बात करना convenient है?",
  },
  {
    id: "ta",
    tab: "தமிழ்",
    speaker: "Kavya",
    voice: "ElevenLabs",
    src: "/voices/kavya-ta-greeting.mp3",
    text: "ஹலோ, AK Propertiesல இருந்து Kavya பேசுறேன். நான் Tamil, English, Hindi பேசுவேன். நீங்க Golden Avenue property பற்றி enquiry பண்ணிருந்தீங்க, அதுக்காக quick call பண்ணேன். ரெண்டு நிமிஷம் பேசலாமா?",
  },
];

export type Engine = "sarvam" | "eleven";

export interface Phrase {
  text: string;
  lang: "English" | "हिन्दी" | "Hinglish";
  when: string;
  src: Partial<Record<Engine, string>>;
}

export const phrases: Phrase[] = [
  { text: "One moment, let me note that down.", lang: "English", when: "Before she reads a booking back", src: { sarvam: "/voices/note-sarvam.mp3", eleven: "/voices/note-eleven.mp3" } },
  { text: "Which day would suit you best?", lang: "English", when: "Offering a slot", src: { sarvam: "/voices/day-sarvam.mp3", eleven: "/voices/day-eleven.mp3" } },
  { text: "एक सेकंड, मैं note कर लेती हूँ.", lang: "Hinglish", when: "Same moment, in Hindi", src: { sarvam: "/voices/note-hi-sarvam.mp3", eleven: "/voices/note-hi-eleven.mp3" } },
  { text: "Sorry, one moment.", lang: "English", when: "When she needs a second", src: { sarvam: "/voices/sorry-sarvam.mp3", eleven: "/voices/sorry-eleven.mp3" } },
  { text: "No problem at all. Thank you for your time, have a good day.", lang: "English", when: "When they're not interested", src: { sarvam: "/voices/noproblem-sarvam.mp3" } },
  { text: "कोई बात नहीं. Thank you for your time, अच्छा दिन हो आपका.", lang: "Hinglish", when: "The same, in Hinglish", src: { eleven: "/voices/noproblem-hi-eleven.mp3" } },
  { text: "Hello, is anyone there?", lang: "English", when: "When the line goes quiet", src: { sarvam: "/voices/anyone-sarvam.mp3" } },
  { text: "आपका दिन अच्छा रहे!", lang: "हिन्दी", when: "Signing off", src: { eleven: "/voices/goodday-hi-eleven.mp3" } },
];

export const engineName: Record<Engine, string> = { sarvam: "Voice A · Sarvam", eleven: "Voice B · ElevenLabs" };

export const languages = [
  "English", "हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "മലയാളം", "मराठी", "বাংলা", "ગુજરાતી", "ਪੰਜਾਬੀ", "ଓଡ଼ିଆ",
];
