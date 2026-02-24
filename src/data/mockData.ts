export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  theme: string;
  storyLine: string;
  color: string; // gradient placeholder
  aspectRatio: "portrait" | "landscape" | "square";
}

export interface Frame {
  id: string;
  title: string;
  artworkIds: string[];
}

export interface CuratedWall {
  id: string;
  title: string;
  curator: string;
  frames: Frame[];
}

// 20 artworks with story lines and gradient placeholders
export const artworks: Artwork[] = [
  {
    id: "art-1",
    title: "The Silent Hour",
    artist: "Elena Voss",
    year: 2019,
    theme: "solitude",
    storyLine: "In the quiet between breaths, the world reveals its hidden geometry.",
    color: "linear-gradient(135deg, #2d1b4e 0%, #1a3a5c 100%)",
    aspectRatio: "portrait",
  },
  {
    id: "art-2",
    title: "Meridian",
    artist: "Tomás Reyes",
    year: 2021,
    theme: "journey",
    storyLine: "Every horizon is both an ending and an invitation to cross.",
    color: "linear-gradient(135deg, #c9a96e 0%, #8b5e3c 100%)",
    aspectRatio: "landscape",
  },
  {
    id: "art-3",
    title: "Fracture Garden",
    artist: "Yuki Tanaka",
    year: 2020,
    theme: "growth",
    storyLine: "Through the cracks in certainty, wildflowers find their way.",
    color: "linear-gradient(135deg, #3a5c3a 0%, #1a2f1a 100%)",
    aspectRatio: "square",
  },
  {
    id: "art-4",
    title: "Blue Archive",
    artist: "Sophie Mercier",
    year: 2018,
    theme: "memory",
    storyLine: "Memory is not a photograph — it is a watercolor left in the rain.",
    color: "linear-gradient(135deg, #1a3a6c 0%, #0d1f3c 100%)",
    aspectRatio: "portrait",
  },
  {
    id: "art-5",
    title: "Ember Field",
    artist: "Kofi Asante",
    year: 2022,
    theme: "passion",
    storyLine: "What burns brightest often begins as the smallest spark.",
    color: "linear-gradient(135deg, #8b3a1a 0%, #c45a2a 100%)",
    aspectRatio: "landscape",
  },
  {
    id: "art-6",
    title: "Still Water",
    artist: "Linnéa Berg",
    year: 2020,
    theme: "peace",
    storyLine: "Stillness is not absence — it is the presence of everything at once.",
    color: "linear-gradient(135deg, #4a6a7a 0%, #2a3a4a 100%)",
    aspectRatio: "square",
  },
  {
    id: "art-7",
    title: "Nocturne VII",
    artist: "Marco Rossi",
    year: 2021,
    theme: "darkness",
    storyLine: "The night does not hide — it reveals what daylight obscures.",
    color: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    aspectRatio: "portrait",
  },
  {
    id: "art-8",
    title: "Tessellation",
    artist: "Aisha Patel",
    year: 2019,
    theme: "pattern",
    storyLine: "In repetition, the eye discovers difference.",
    color: "linear-gradient(135deg, #5a4a3a 0%, #8a7a6a 100%)",
    aspectRatio: "landscape",
  },
  {
    id: "art-9",
    title: "Woven Light",
    artist: "Clara Dubois",
    year: 2022,
    theme: "connection",
    storyLine: "Every thread of light connects two darknesses.",
    color: "linear-gradient(135deg, #c9a96e 0%, #e8d5b0 100%)",
    aspectRatio: "portrait",
  },
  {
    id: "art-10",
    title: "Drift",
    artist: "Henrik Sørensen",
    year: 2020,
    theme: "change",
    storyLine: "To drift is not to be lost — it is to trust the current.",
    color: "linear-gradient(135deg, #6a8a9a 0%, #3a5a6a 100%)",
    aspectRatio: "square",
  },
  {
    id: "art-11",
    title: "Threshold",
    artist: "Mia Chen",
    year: 2021,
    theme: "transition",
    storyLine: "Every door holds two worlds, neither fully visible from the other.",
    color: "linear-gradient(135deg, #4a3a5a 0%, #2a1a3a 100%)",
    aspectRatio: "landscape",
  },
  {
    id: "art-12",
    title: "Cartography of Absence",
    artist: "Diego Fuentes",
    year: 2018,
    theme: "loss",
    storyLine: "What is missing draws the most precise map of what once was.",
    color: "linear-gradient(135deg, #3a3a3a 0%, #5a5a5a 100%)",
    aspectRatio: "portrait",
  },
  {
    id: "art-13",
    title: "Verdant Echo",
    artist: "Nora Kim",
    year: 2022,
    theme: "nature",
    storyLine: "The forest remembers every footfall, every whisper, every season.",
    color: "linear-gradient(135deg, #2a4a2a 0%, #4a7a4a 100%)",
    aspectRatio: "landscape",
  },
  {
    id: "art-14",
    title: "Pulse",
    artist: "Raj Mehta",
    year: 2020,
    theme: "life",
    storyLine: "Beneath every surface, something is beating.",
    color: "linear-gradient(135deg, #8a2a2a 0%, #5a1a1a 100%)",
    aspectRatio: "square",
  },
  {
    id: "art-15",
    title: "Cipher",
    artist: "Anya Volkov",
    year: 2021,
    theme: "mystery",
    storyLine: "The most beautiful messages are the ones we almost understand.",
    color: "linear-gradient(135deg, #1a2a3a 0%, #3a4a5a 100%)",
    aspectRatio: "portrait",
  },
  {
    id: "art-16",
    title: "Bloom Sequence",
    artist: "Iris Zhang",
    year: 2019,
    theme: "growth",
    storyLine: "Opening is the bravest act a petal can perform.",
    color: "linear-gradient(135deg, #9a6a8a 0%, #5a3a4a 100%)",
    aspectRatio: "landscape",
  },
  {
    id: "art-17",
    title: "Monument to Nothing",
    artist: "Leo Brandt",
    year: 2022,
    theme: "void",
    storyLine: "Sometimes the most powerful statement is the space between statements.",
    color: "linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%)",
    aspectRatio: "square",
  },
  {
    id: "art-18",
    title: "Golden Ratio",
    artist: "Fatima Al-Rashid",
    year: 2020,
    theme: "harmony",
    storyLine: "In mathematics, the divine speaks through proportion.",
    color: "linear-gradient(135deg, #b8952a 0%, #7a6a1a 100%)",
    aspectRatio: "portrait",
  },
  {
    id: "art-19",
    title: "Afterglow",
    artist: "James Okafor",
    year: 2021,
    theme: "memory",
    storyLine: "The most beautiful light arrives after the source has gone.",
    color: "linear-gradient(135deg, #c47a3a 0%, #8a4a1a 100%)",
    aspectRatio: "landscape",
  },
  {
    id: "art-20",
    title: "Silence in Motion",
    artist: "Hana Yoshida",
    year: 2022,
    theme: "stillness",
    storyLine: "Even the spinning earth is silent from within.",
    color: "linear-gradient(135deg, #5a6a7a 0%, #2a3a4a 100%)",
    aspectRatio: "square",
  },
];

// Pre-curated walls
export const curatedWalls: CuratedWall[] = [
  {
    id: "wall-1",
    title: "Echoes of Solitude",
    curator: "Gallery Curatura",
    frames: [
      { id: "frame-1", title: "Introspection", artworkIds: ["art-1", "art-4", "art-7"] },
      { id: "frame-2", title: "Horizons", artworkIds: ["art-2", "art-5", "art-8"] },
      { id: "frame-3", title: "Nature's Whisper", artworkIds: ["art-3", "art-6", "art-10"] },
      { id: "frame-4", title: "Hidden Light", artworkIds: ["art-9", "art-18", "art-19"] },
      { id: "frame-5", title: "The Void Speaks", artworkIds: ["art-12", "art-15", "art-17"] },
      { id: "frame-6", title: "Bloom & Decay", artworkIds: ["art-13", "art-14", "art-16"] },
    ],
  },
];

export const frameStructures = [
  { id: "struct-3", label: "3 Frames", count: 3 },
  { id: "struct-4", label: "4 Frames", count: 4 },
  { id: "struct-5", label: "5 Frames", count: 5 },
];

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find((a) => a.id === id);
}

export function generateNarrative(artworkIds: string[]): string {
  return artworkIds
    .map((id) => getArtworkById(id))
    .filter(Boolean)
    .map((a) => a!.storyLine)
    .join(" ");
}
