import type { Beat, Taal, TaalName, TaalPatternVariant, TaalStylePack, ThaatName } from "@/types";

interface TaalDefinition {
  name: TaalName;
  vibhags: number[];
  khaliVibhags: number[];
  description: string;
  bols: string[];
}

function makePattern(vibhags: number[], bols: string[], khaliVibhags: number[]): Beat[] {
  const totalBeats = vibhags.reduce((sum, value) => sum + value, 0);
  const pattern: Beat[] = [];

  let vibhagIndex = 0;
  let beatInCurrentVibhag = 0;
  let nextVibhagBoundary = vibhags[0] ?? totalBeats;

  for (let index = 0; index < totalBeats; index += 1) {
    if (index >= nextVibhagBoundary) {
      vibhagIndex += 1;
      beatInCurrentVibhag = 0;
      nextVibhagBoundary += vibhags[vibhagIndex] ?? 0;
    }

    const isSam = index === 0;
    const isKhali = khaliVibhags.includes(vibhagIndex);
    const accent: Beat["accent"] = beatInCurrentVibhag === 0
      ? (isKhali ? "weak" : "strong")
      : (isKhali ? "weak" : "medium");

    pattern.push({
      index,
      vibhag: vibhagIndex,
      syllable: bols[index] ?? "Na",
      isSam,
      isKhali,
      accent,
    });

    beatInCurrentVibhag += 1;
  }

  return pattern;
}

const TAAL_DEFINITIONS: TaalDefinition[] = [
  {
    name: "Teentaal",
    vibhags: [4, 4, 4, 4],
    khaliVibhags: [2],
    description: "16 matras • 4 vibhags • Canonical khayal/instrumental cycle",
    bols: ["Dha", "Dhin", "Dhin", "Dha", "Dha", "Dhin", "Dhin", "Dha", "Dha", "Tin", "Tin", "Ta", "Ta", "Dhin", "Dhin", "Dha"],
  },
  {
    name: "Dadra",
    vibhags: [3, 3],
    khaliVibhags: [1],
    description: "6 matras • 2 vibhags • Light-classical and thumri staple",
    bols: ["Dha", "Dhin", "Na", "Dha", "Tin", "Na"],
  },
  {
    name: "Keharwa",
    vibhags: [4, 4],
    khaliVibhags: [1],
    description: "8 matras • 2 vibhags • Folk, bhajan, and semi-classical base groove",
    bols: ["Dha", "Ge", "Na", "Ti", "Na", "Ke", "Dhin", "Na"],
  },
  {
    name: "Rupak",
    vibhags: [3, 2, 2],
    khaliVibhags: [0],
    description: "7 matras • 3 vibhags • Begins on khali",
    bols: ["Tin", "Tin", "Na", "Dhin", "Na", "Dhin", "Na"],
  },
  {
    name: "Ektaal",
    vibhags: [2, 2, 2, 2, 2, 2],
    khaliVibhags: [2, 3],
    description: "12 matras • 6 vibhags • Popular in vilambit and madhya laya",
    bols: ["Dhin", "Dhin", "Dha", "Ge", "Ti", "Re", "Ki", "Ta", "Tu", "Na", "Ka", "Ta"],
  },
  {
    name: "Jhaptaal",
    vibhags: [2, 3, 2, 3],
    khaliVibhags: [2],
    description: "10 matras • 4 vibhags • Distinct asymmetrical phrasing",
    bols: ["Dhi", "Na", "Dhi", "Dhi", "Na", "Ti", "Na", "Dhi", "Dhi", "Na"],
  },
  {
    name: "Deepchandi",
    vibhags: [3, 4, 3, 4],
    khaliVibhags: [2],
    description: "14 matras • 4 vibhags • Often used in thumri and hori",
    bols: ["Dha", "Dhin", "Na", "Dha", "Tin", "Tin", "Na", "Ta", "Dhin", "Dhin", "Dha", "Dha", "Tin", "Na"],
  },
  {
    name: "Chautaal",
    vibhags: [2, 2, 2, 2, 2, 2],
    khaliVibhags: [2, 4],
    description: "12 matras • 6 vibhags • Dhrupad-oriented framework",
    bols: ["Dha", "Dha", "Din", "Ta", "Ki", "Ta", "Tun", "Na", "Kat", "Ta", "Dhin", "Na"],
  },
  {
    name: "Tilwada",
    vibhags: [4, 4, 4, 4],
    khaliVibhags: [2],
    description: "16 matras • 4 vibhags • Vilambit khayal support cycle",
    bols: ["Dha", "Dhin", "Dhin", "Dha", "Dha", "Tin", "Tin", "Ta", "Ta", "Dhin", "Dhin", "Dha", "Dha", "Tin", "Tin", "Ta"],
  },
];

export const TAALS: Record<string, Taal> = Object.fromEntries(
  TAAL_DEFINITIONS.map((definition) => [
    definition.name,
    {
      name: definition.name,
      beats: definition.vibhags.reduce((sum, value) => sum + value, 0),
      vibhags: definition.vibhags,
      description: definition.description,
      pattern: makePattern(definition.vibhags, definition.bols, definition.khaliVibhags),
    },
  ])
);

export const TAAL_LIST = Object.values(TAALS);

export const THAAT_LIST: ThaatName[] = [
  "Bilawal",
  "Khamaj",
  "Kafi",
  "Asavari",
  "Bhairav",
  "Bhairavi",
  "Todi",
  "Marwa",
  "Poorvi",
  "Kalyan",
];

function createVariant(
  taalName: TaalName,
  id: string,
  name: string,
  level: "basic" | "medium" | "advanced",
  kind: "theka" | "fill" | "rela" | "kaida",
  description: string,
  bols: string[]
): TaalPatternVariant {
  const definition = TAAL_DEFINITIONS.find((entry) => entry.name === taalName);
  if (!definition) {
    return {
      id,
      name,
      level,
      kind,
      description,
      pattern: [],
    };
  }

  return {
    id,
    name,
    level,
    kind,
    description,
    pattern: makePattern(definition.vibhags, bols, definition.khaliVibhags),
  };
}

export const CORE_PATTERN_LIBRARY: Record<string, TaalPatternVariant[]> = {
  Teentaal: [
    createVariant("Teentaal", "core-teentaal-basic", "Basic Theka", "basic", "theka", "Canonical slow practice theka.", ["Dha", "Dhin", "Dhin", "Dha", "Dha", "Dhin", "Dhin", "Dha", "Dha", "Tin", "Tin", "Ta", "Ta", "Dhin", "Dhin", "Dha"]),
    createVariant("Teentaal", "core-teentaal-medium", "Medium Theka", "medium", "theka", "Slightly denser balancing bol movement.", ["Dha", "Dhin", "Na", "Dha", "Dha", "Dhin", "Na", "Dha", "Dha", "Tin", "Na", "Ta", "Ta", "Dhin", "Na", "Dha"]),
    createVariant("Teentaal", "core-teentaal-fill", "Fill Variant", "advanced", "fill", "Includes phrase fill before sam.", ["Dha", "Dhin", "Dhin", "Dha", "Dha", "Ge", "Na", "Dha", "Ti", "Na", "Ke", "Ta", "Ta", "Dhin", "Dhin", "Dha"]),
    createVariant("Teentaal", "core-teentaal-rela", "Rela Flow", "advanced", "rela", "Fast-flow rela-inspired articulation.", ["Dha", "Ti", "Re", "Ki", "Ta", "Ti", "Re", "Ki", "Dha", "Ti", "Re", "Ki", "Ta", "Ti", "Re", "Ki"]),
  ],
  Dadra: [
    createVariant("Dadra", "core-dadra-basic", "Basic Theka", "basic", "theka", "Foundational dadra groove.", ["Dha", "Dhin", "Na", "Dha", "Tin", "Na"]),
    createVariant("Dadra", "core-dadra-medium", "Light Folk", "medium", "theka", "Common light-song phrasing.", ["Na", "Dhin", "Na", "Dha", "Tin", "Na"]),
    createVariant("Dadra", "core-dadra-fill", "Fill Variant", "advanced", "fill", "Adds passing bol before sam.", ["Dha", "Ge", "Na", "Dha", "Tin", "Na"]),
  ],
  Keharwa: [
    createVariant("Keharwa", "core-keharwa-basic", "Basic Theka", "basic", "theka", "Most used keharwa pattern.", ["Dha", "Ge", "Na", "Ti", "Na", "Ke", "Dhin", "Na"]),
    createVariant("Keharwa", "core-keharwa-medium", "Pop Groove", "medium", "theka", "Balanced modern accompaniment style.", ["Dha", "Ge", "Na", "Ti", "Na", "Ka", "Dhin", "Na"]),
    createVariant("Keharwa", "core-keharwa-kaida", "Kaida Touch", "advanced", "kaida", "Kaida-like movement for advanced practice.", ["Dha", "Ti", "Na", "Ka", "Ta", "Ke", "Dhin", "Na"]),
  ],
  Rupak: [
    createVariant("Rupak", "core-rupak-basic", "Basic Theka", "basic", "theka", "Classic rupak base.", ["Tin", "Tin", "Na", "Dhin", "Na", "Dhin", "Na"]),
    createVariant("Rupak", "core-rupak-medium", "Open Variant", "medium", "theka", "More open khali phrasing.", ["Tin", "Na", "Na", "Dhin", "Na", "Dhin", "Na"]),
  ],
  Ektaal: [
    createVariant("Ektaal", "core-ektaal-basic", "Basic Theka", "basic", "theka", "12-beat ektaal structure.", ["Dhin", "Dhin", "Dha", "Ge", "Ti", "Re", "Ki", "Ta", "Tu", "Na", "Ka", "Ta"]),
    createVariant("Ektaal", "core-ektaal-medium", "Madhya Variant", "medium", "theka", "Clearer contrast across vibhags.", ["Dhin", "Na", "Dha", "Ge", "Ti", "Re", "Ki", "Ta", "Tu", "Na", "Ka", "Ta"]),
  ],
  Jhaptaal: [
    createVariant("Jhaptaal", "core-jhaptaal-basic", "Basic Theka", "basic", "theka", "Traditional 2-3-2-3 contour.", ["Dhi", "Na", "Dhi", "Dhi", "Na", "Ti", "Na", "Dhi", "Dhi", "Na"]),
    createVariant("Jhaptaal", "core-jhaptaal-fill", "Fill Variant", "advanced", "fill", "Adds leading phrases into sam.", ["Dhi", "Na", "Ti", "Re", "Ki", "Ti", "Na", "Dhi", "Dhi", "Na"]),
  ],
  Deepchandi: [
    createVariant("Deepchandi", "core-deepchandi-basic", "Basic Theka", "basic", "theka", "Main deepchandi phrase.", ["Dha", "Dhin", "Na", "Dha", "Tin", "Tin", "Na", "Ta", "Dhin", "Dhin", "Dha", "Dha", "Tin", "Na"]),
  ],
  Chautaal: [
    createVariant("Chautaal", "core-chautaal-basic", "Basic Theka", "basic", "theka", "Dhrupad-style chautaal arrangement.", ["Dha", "Dha", "Din", "Ta", "Ki", "Ta", "Tun", "Na", "Kat", "Ta", "Dhin", "Na"]),
  ],
  Tilwada: [
    createVariant("Tilwada", "core-tilwada-basic", "Basic Theka", "basic", "theka", "Vilambit support framework.", ["Dha", "Dhin", "Dhin", "Dha", "Dha", "Tin", "Tin", "Ta", "Ta", "Dhin", "Dhin", "Dha", "Dha", "Tin", "Tin", "Ta"]),
  ],
};

export const STYLE_PACKS: TaalStylePack[] = [
  {
    id: "pack-teentaal-farukhabad",
    name: "Farukhabad Inspired",
    description: "Phrase-driven phrasing for concert accompaniment feel.",
    taalName: "Teentaal",
    source: "gharana",
    variants: [
      createVariant("Teentaal", "pack-teentaal-farukhabad-v1", "Concert Flow", "medium", "theka", "Smoother movement with open bols.", ["Dha", "Ge", "Dhin", "Na", "Dha", "Ge", "Dhin", "Na", "Dha", "Tin", "Tin", "Na", "Ta", "Dhin", "Dhin", "Dha"]),
      createVariant("Teentaal", "pack-teentaal-farukhabad-v2", "Fill Accent", "advanced", "fill", "Fill-heavy turnaround before sam.", ["Dha", "Ge", "Dhin", "Na", "Dha", "Ti", "Re", "Ki", "Dha", "Tin", "Na", "Ta", "Ti", "Re", "Ki", "Ta"]),
    ],
  },
  {
    id: "pack-keharwa-bhajan",
    name: "Bhajan Support",
    description: "Soft supportive keharwa variants for devotional practice.",
    taalName: "Keharwa",
    source: "genre",
    variants: [
      createVariant("Keharwa", "pack-keharwa-bhajan-v1", "Soft Support", "basic", "theka", "Low-density support groove.", ["Dha", "-", "Na", "Ti", "Na", "-", "Dhin", "Na"]),
      createVariant("Keharwa", "pack-keharwa-bhajan-v2", "Step Fill", "medium", "fill", "Gentle mid-cycle fill.", ["Dha", "Ge", "Na", "Ti", "Na", "Ka", "Ti", "Na"]),
    ],
  },
  {
    id: "pack-dadra-thumri",
    name: "Thumri Dadra",
    description: "Ornamented dadra phrasing suitable for thumri practice.",
    taalName: "Dadra",
    source: "genre",
    variants: [
      createVariant("Dadra", "pack-dadra-thumri-v1", "Lilt Variant", "medium", "theka", "Lilted phrasing with open khali feel.", ["Dha", "Ge", "Na", "Dha", "Ti", "Na"]),
      createVariant("Dadra", "pack-dadra-thumri-v2", "Rela Touch", "advanced", "rela", "Faster internal subdivision.", ["Dha", "Ti", "Na", "Dha", "Ti", "Na"]),
    ],
  },
  {
    id: "pack-ektaal-vilambit",
    name: "Vilambit Builder",
    description: "Slow-tempo support with spacious articulation.",
    taalName: "Ektaal",
    source: "speed",
    variants: [
      createVariant("Ektaal", "pack-ektaal-vilambit-v1", "Spacious Theka", "basic", "theka", "Extra space between articulated bols.", ["Dhin", "-", "Dha", "Ge", "Ti", "-", "Ki", "Ta", "Tu", "-", "Ka", "Ta"]),
      createVariant("Ektaal", "pack-ektaal-vilambit-v2", "Kaida Prep", "advanced", "kaida", "Progressive kaida-like phrasing.", ["Dhin", "Na", "Dha", "Ge", "Ti", "Re", "Ki", "Ta", "Tu", "Na", "Ka", "Ta"]),
    ],
  },
];

export function getCoreVariantsForTaal(taalName: TaalName): TaalPatternVariant[] {
  return CORE_PATTERN_LIBRARY[taalName] ?? [];
}

export function getStylePacksForTaal(taalName: TaalName): TaalStylePack[] {
  return STYLE_PACKS.filter((pack) => pack.taalName === taalName);
}

export function resolveTablaVariant(
  taalName: TaalName,
  layer: "core" | "style-pack",
  variantId: string,
  stylePackId: string | null
): { variant: TaalPatternVariant | null; stylePack: TaalStylePack | null } {
  if (layer === "style-pack") {
    const selectedPack = STYLE_PACKS.find((pack) => pack.id === stylePackId && pack.taalName === taalName) ?? null;
    const styleVariant = selectedPack?.variants.find((entry) => entry.id === variantId) ?? selectedPack?.variants[0] ?? null;

    if (styleVariant) {
      return { variant: styleVariant, stylePack: selectedPack };
    }
  }

  const coreVariants = getCoreVariantsForTaal(taalName);
  const coreVariant = coreVariants.find((entry) => entry.id === variantId) ?? coreVariants[0] ?? null;
  return { variant: coreVariant, stylePack: null };
}
