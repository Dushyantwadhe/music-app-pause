export const STARTER_SESSIONS = [
  {
    id: "harmonium-warmup",
    title: "Harmonium warm-up",
    duration: "10 min",
    description: "Set a gentle Tanpura Sa, then ease into your fingers and sargam.",
    instrument: "Harmonium",
  },
  {
    id: "teentaal-lay",
    title: "Teentaal lay practice",
    duration: "15 min",
    description: "Build steady rhythm with a relaxed Teentaal cycle at 60 BPM.",
    instrument: "Tabla",
  },
  {
    id: "voice-and-rhythm",
    title: "Voice & rhythm",
    duration: "20 min",
    description: "Set Tanpura to Sa + Pa, then practise with a simple Teentaal pulse.",
    instrument: "Mixed",
  },
] as const;

export type StarterSessionId = (typeof STARTER_SESSIONS)[number]["id"];
