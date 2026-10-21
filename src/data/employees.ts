export interface Hire {
  name: string;
  job: string;
  business: string;
  languages: string[];
  opening: string;
  clips?: { label: string; src: string }[];
}

// Anya and Kavya are real employees with real recordings. The rest are templates.
export const hires: Hire[] = [
  {
    name: "Anya",
    job: "Follows up on new leads",
    business: "Texnoid, B2B software",
    languages: ["English", "Hindi"],
    opening: "Hi, this is Anya from Texnoid. You recently enquired on our website about automating your business calls.",
    clips: [
      { label: "English", src: "/voices/anya-en-greeting.mp3" },
      { label: "हिन्दी", src: "/voices/anya-hi-greeting.mp3" },
    ],
  },
  {
    name: "Kavya",
    job: "Books site visits",
    business: "AK Properties, real estate, Chennai",
    languages: ["Tamil", "English", "Hindi"],
    opening: "ஹலோ, AK Propertiesல இருந்து Kavya பேசுறேன்…",
    clips: [{ label: "தமிழ்", src: "/voices/kavya-ta-greeting.mp3" }],
  },
  {
    name: "Meera",
    job: "Answers the clinic phone",
    business: "Dental and skin clinics",
    languages: ["English", "Hindi", "Telugu"],
    opening: "Good morning, Smile Dental. This is Meera, how can I help you today?",
  },
  {
    name: "Kabir",
    job: "Reminds customers about dues",
    business: "NBFCs, distributors, schools",
    languages: ["Hindi", "Marathi", "English"],
    opening: "Namaste, main Kabir bol raha hoon. Aapki EMI ki date paanch tareekh hai, bas yaad dilane ke liye call kiya.",
  },
  {
    name: "Riya",
    job: "Collects feedback after delivery",
    business: "D2C brands, restaurants",
    languages: ["English", "Hindi", "Bengali"],
    opening: "Hi, Riya here from Kettle & Crumb. Your order reached you yesterday. Can I ask two quick questions about it?",
  },
  {
    name: "Dev",
    job: "Confirms tomorrow's appointments",
    business: "Salons, service centres, coaching",
    languages: ["English", "Kannada", "Hindi"],
    opening: "Hello, Dev from Urban Cuts. Just confirming your haircut tomorrow at 11. Shall I keep the slot?",
  },
];
