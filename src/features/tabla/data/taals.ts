import type { Taal, Beat } from "@/types";

function b(
  index: number,
  vibhag: number,
  syllable: string,
  isSam = false,
  isKhali = false,
  accent: Beat["accent"] = "medium"
): Beat {
  return { index, vibhag, syllable, isSam, isKhali, accent };
}

export const TAALS: Record<string, Taal> = {
  Teentaal: {
    name: "Teentaal",
    beats: 16,
    vibhags: [4, 4, 4, 4],
    description: "16 beats • 4 vibhags • Most popular taal in Hindustani music",
    pattern: [
      b(0, 0, "Dha", true, false, "strong"),
      b(1, 0, "Dhin", false, false, "medium"),
      b(2, 0, "Dhin", false, false, "medium"),
      b(3, 0, "Dha", false, false, "medium"),
      b(4, 1, "Dha", false, false, "strong"),
      b(5, 1, "Dhin", false, false, "medium"),
      b(6, 1, "Dhin", false, false, "medium"),
      b(7, 1, "Dha", false, false, "medium"),
      b(8, 2, "Dha", false, true, "weak"),
      b(9, 2, "Tin", false, true, "weak"),
      b(10, 2, "Tin", false, true, "weak"),
      b(11, 2, "Ta", false, true, "weak"),
      b(12, 3, "Dha", false, false, "strong"),
      b(13, 3, "Dhin", false, false, "medium"),
      b(14, 3, "Dhin", false, false, "medium"),
      b(15, 3, "Dha", false, false, "medium"),
    ],
  },

  Dadra: {
    name: "Dadra",
    beats: 6,
    vibhags: [3, 3],
    description: "6 beats • 2 vibhags • Common in light music & thumri",
    pattern: [
      b(0, 0, "Dha", true, false, "strong"),
      b(1, 0, "Dhin", false, false, "medium"),
      b(2, 0, "Na", false, false, "weak"),
      b(3, 1, "Dha", false, true, "medium"),
      b(4, 1, "Tin", false, true, "weak"),
      b(5, 1, "Na", false, true, "weak"),
    ],
  },

  Keharwa: {
    name: "Keharwa",
    beats: 8,
    vibhags: [4, 4],
    description: "8 beats • 2 vibhags • Popular in bhajans & folk music",
    pattern: [
      b(0, 0, "Dha", true, false, "strong"),
      b(1, 0, "Ge", false, false, "medium"),
      b(2, 0, "Na", false, false, "weak"),
      b(3, 0, "Ti", false, false, "medium"),
      b(4, 1, "Na", false, true, "medium"),
      b(5, 1, "Ke", false, true, "weak"),
      b(6, 1, "Dhin", false, true, "medium"),
      b(7, 1, "Na", false, true, "weak"),
    ],
  },

  Rupak: {
    name: "Rupak",
    beats: 7,
    vibhags: [3, 2, 2],
    description: "7 beats • 3 vibhags • Begins on khali, unique among taals",
    pattern: [
      b(0, 0, "Ti", true, true, "medium"),
      b(1, 0, "Ti", false, true, "weak"),
      b(2, 0, "Ta", false, true, "weak"),
      b(3, 1, "Dhin", false, false, "strong"),
      b(4, 1, "Na", false, false, "medium"),
      b(5, 2, "Dhin", false, false, "strong"),
      b(6, 2, "Na", false, false, "medium"),
    ],
  },

  Ektaal: {
    name: "Ektaal",
    beats: 12,
    vibhags: [2, 2, 2, 2, 2, 2],
    description: "12 beats • 6 vibhags • Used in khayal & instrumental music",
    pattern: [
      b(0, 0, "Dhin", true, false, "strong"),
      b(1, 0, "Dhin", false, false, "medium"),
      b(2, 1, "Dha", false, false, "strong"),
      b(3, 1, "Ge", false, false, "medium"),
      b(4, 2, "Na", false, true, "weak"),
      b(5, 2, "Ti", false, true, "weak"),
      b(6, 3, "Na", false, true, "weak"),
      b(7, 3, "Ke", false, true, "weak"),
      b(8, 4, "Dhin", false, false, "strong"),
      b(9, 4, "Dhin", false, false, "medium"),
      b(10, 5, "Dha", false, false, "strong"),
      b(11, 5, "Ge", false, false, "medium"),
    ],
  },
};

export const TAAL_LIST = Object.values(TAALS);
