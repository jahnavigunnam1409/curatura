// ── Image imports ────────────────────────────────────────────────────────────
import img1  from "../images/1.webp";
import img2  from "../images/2.jpeg";
import img3  from "../images/3.jpeg";
import img4  from "../images/4.jpg";
import img5  from "../images/5.jpg";
import img6  from "../images/6.jpeg";
import img7  from "../images/7.jpeg";
import img8  from "../images/8.webp";
import img9  from "../images/9.jpeg";
import img10 from "../images/10.jpg";
import img11 from "../images/11.jpeg";
import img12 from "../images/12.jpeg";
import img13 from "../images/13.jpeg";
import img14 from "../images/14.jpeg";
import img15 from "../images/15.jpg";
import img16 from "../images/16.jpg";
import img17 from "../images/17.jpeg";
import img18 from "../images/18.jpeg";
import img19 from "../images/19.jpeg";
import img20 from "../images/20.jpeg";
import img21 from "../images/21.jpeg";
import img22 from "../images/22.jpg";
import img23 from "../images/23.jpg";
import img24 from "../images/24.jpeg";
import img25 from "../images/25.jpg";
import img26 from "../images/26.jpeg";
import img27 from "../images/27.jpeg";
import img28 from "../images/28.jpeg";
import img29 from "../images/29.jpeg";
import img30 from "../images/30.jpeg";
import img31 from "../images/31.jpeg";
import img32 from "../images/32.webp";
import img33 from "../images/33.jpg";
import img34 from "../images/34.jpeg";
import img35 from "../images/35.jpeg";
import img36 from "../images/36.jpg";
import img37 from "../images/37.jpeg";
import img38 from "../images/38.jpeg";
import img39 from "../images/39.jpeg";
import img40 from "../images/40.jpeg";
import img41 from "../images/41.jpeg";
import img42 from "../images/42.jpeg";
import img43 from "../images/43.jpeg";
import img44 from "../images/44.jpeg";
import img45 from "../images/45.jpeg";
import img46 from "../images/46.jpeg";
import img47 from "../images/47.jpeg";
import img48 from "../images/48.jpeg";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  theme: string;
  storyLine: string;
  color: string; // gradient fallback
  imageUrl: string; // real image
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

// ── 48 artworks ──────────────────────────────────────────────────────────────
// Introspection (1–8)
export const artworks: Artwork[] = [
  {
    id: "art-1", title: "Reverie", artist: "Elena Voss", year: 2019,
    theme: "introspection",
    storyLine: "In the quiet between breaths, the mind discovers its truest architecture.",
    color: "linear-gradient(135deg,#2d1b4e 0%,#1a3a5c 100%)", imageUrl: img1, aspectRatio: "portrait",
  },
  {
    id: "art-2", title: "Inner Cartography", artist: "Tomás Reyes", year: 2021,
    theme: "introspection",
    storyLine: "Every scar is a contour line on the map of a life fully lived.",
    color: "linear-gradient(135deg,#3a2a5c 0%,#1a1a3a 100%)", imageUrl: img2, aspectRatio: "square",
  },
  {
    id: "art-3", title: "The Weight of Seeing", artist: "Yuki Tanaka", year: 2020,
    theme: "introspection",
    storyLine: "To truly look at something is to carry it with you forever.",
    color: "linear-gradient(135deg,#1a2f4a 0%,#0d1828 100%)", imageUrl: img3, aspectRatio: "portrait",
  },
  {
    id: "art-4", title: "Soliloquy", artist: "Sophie Mercier", year: 2018,
    theme: "introspection",
    storyLine: "The longest conversations are the ones we have only with ourselves.",
    color: "linear-gradient(135deg,#1a3a6c 0%,#0d1f3c 100%)", imageUrl: img4, aspectRatio: "landscape",
  },
  {
    id: "art-5", title: "Contemplation in Blue", artist: "Mia Chen", year: 2022,
    theme: "introspection",
    storyLine: "Blue is the colour of thoughts that have no words yet.",
    color: "linear-gradient(135deg,#1a3a6c 0%,#2a5a8c 100%)", imageUrl: img5, aspectRatio: "portrait",
  },
  {
    id: "art-6", title: "Beneath the Surface", artist: "Linnéa Berg", year: 2020,
    theme: "introspection",
    storyLine: "Stillness is not absence — it is the presence of everything at once.",
    color: "linear-gradient(135deg,#4a6a7a 0%,#2a3a4a 100%)", imageUrl: img6, aspectRatio: "square",
  },
  {
    id: "art-7", title: "The Examined Life", artist: "Marco Rossi", year: 2021,
    theme: "introspection",
    storyLine: "Socrates was right: the unexamined life leaves no art in its wake.",
    color: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)", imageUrl: img7, aspectRatio: "portrait",
  },
  {
    id: "art-8", title: "Mirror Without Reflection", artist: "Aisha Patel", year: 2019,
    theme: "introspection",
    storyLine: "What we see in others is only the light we have not yet claimed as our own.",
    color: "linear-gradient(135deg,#2a2a4a 0%,#4a4a6a 100%)", imageUrl: img8, aspectRatio: "landscape",
  },

  // Horizons (9–16)
  {
    id: "art-9", title: "Meridian Line", artist: "Clara Dubois", year: 2022,
    theme: "horizon",
    storyLine: "Every horizon is both an ending and an invitation to cross.",
    color: "linear-gradient(135deg,#c9a96e 0%,#e8d5b0 100%)", imageUrl: img9, aspectRatio: "landscape",
  },
  {
    id: "art-10", title: "Beyond the Edge", artist: "Henrik Sørensen", year: 2020,
    theme: "horizon",
    storyLine: "To drift is not to be lost — it is to trust the current.",
    color: "linear-gradient(135deg,#6a8a9a 0%,#3a5a6a 100%)", imageUrl: img10, aspectRatio: "landscape",
  },
  {
    id: "art-11", title: "Drift Toward Dawn", artist: "Kofi Asante", year: 2022,
    theme: "horizon",
    storyLine: "It is always darkest exactly one moment before the palette shifts.",
    color: "linear-gradient(135deg,#1a2a4a 0%,#c87941 100%)", imageUrl: img11, aspectRatio: "landscape",
  },
  {
    id: "art-12", title: "Open Road", artist: "Diego Fuentes", year: 2018,
    theme: "horizon",
    storyLine: "The road does not end; it simply turns its face away from you.",
    color: "linear-gradient(135deg,#8a7a5a 0%,#4a3a2a 100%)", imageUrl: img12, aspectRatio: "landscape",
  },
  {
    id: "art-13", title: "The Far Country", artist: "Nora Kim", year: 2022,
    theme: "horizon",
    storyLine: "The forest remembers every horizon you have ever walked toward.",
    color: "linear-gradient(135deg,#2a4a2a 0%,#4a7a4a 100%)", imageUrl: img13, aspectRatio: "landscape",
  },
  {
    id: "art-14", title: "Vanishing Point", artist: "Raj Mehta", year: 2020,
    theme: "horizon",
    storyLine: "All lines converge. Only the ones we walk feel infinite.",
    color: "linear-gradient(135deg,#3a3a5a 0%,#5a5a7a 100%)", imageUrl: img14, aspectRatio: "landscape",
  },
  {
    id: "art-15", title: "Last Light on Water", artist: "Anya Volkov", year: 2021,
    theme: "horizon",
    storyLine: "The most beautiful light arrives after the source has gone.",
    color: "linear-gradient(135deg,#c47a3a 0%,#8a4a1a 100%)", imageUrl: img15, aspectRatio: "landscape",
  },
  {
    id: "art-16", title: "Threshold of Sky", artist: "Iris Zhang", year: 2019,
    theme: "horizon",
    storyLine: "Opening is the bravest act a horizon can perform.",
    color: "linear-gradient(135deg,#6a9a9a 0%,#3a6a7a 100%)", imageUrl: img16, aspectRatio: "landscape",
  },

  // Nature's Whisper (17–24)
  {
    id: "art-17", title: "Fernlight", artist: "Leo Brandt", year: 2022,
    theme: "nature",
    storyLine: "Even the spinning earth holds its breath when the fern unfurls.",
    color: "linear-gradient(135deg,#2a4a2a 0%,#1a2a1a 100%)", imageUrl: img17, aspectRatio: "square",
  },
  {
    id: "art-18", title: "Morning Dew Archive", artist: "Fatima Al-Rashid", year: 2020,
    theme: "nature",
    storyLine: "In mathematics, the divine speaks through the drop's perfect sphere.",
    color: "linear-gradient(135deg,#b8952a 0%,#7a6a1a 100%)", imageUrl: img18, aspectRatio: "portrait",
  },
  {
    id: "art-19", title: "The Patient Root", artist: "James Okafor", year: 2021,
    theme: "nature",
    storyLine: "Beneath every surface, something ancient is reaching.",
    color: "linear-gradient(135deg,#5a4a3a 0%,#3a2a1a 100%)", imageUrl: img19, aspectRatio: "portrait",
  },
  {
    id: "art-20", title: "Wild Geometry", artist: "Hana Yoshida", year: 2022,
    theme: "nature",
    storyLine: "Nature computes in spirals; we only recently learned to read its proofs.",
    color: "linear-gradient(135deg,#3a5a3a 0%,#5a7a5a 100%)", imageUrl: img20, aspectRatio: "square",
  },
  {
    id: "art-21", title: "Lichen and Memory", artist: "Priya Nair", year: 2019,
    theme: "nature",
    storyLine: "Slow growth is still growth — the stone will attest to that.",
    color: "linear-gradient(135deg,#4a5a3a 0%,#2a3a1a 100%)", imageUrl: img21, aspectRatio: "landscape",
  },
  {
    id: "art-22", title: "Understory", artist: "Luca Ferrara", year: 2020,
    theme: "nature",
    storyLine: "The trees we cannot see from the canopy hold the forest's oldest conversation.",
    color: "linear-gradient(135deg,#1a3a1a 0%,#2a5a2a 100%)", imageUrl: img22, aspectRatio: "portrait",
  },
  {
    id: "art-23", title: "Stone and Moss", artist: "Amara Osei", year: 2021,
    theme: "nature",
    storyLine: "The rock consents to the moss. Patience becomes tenderness.",
    color: "linear-gradient(135deg,#4a4a3a 0%,#6a6a5a 100%)", imageUrl: img23, aspectRatio: "landscape",
  },
  {
    id: "art-24", title: "Photosynthesis Dreams", artist: "Kenji Watanabe", year: 2022,
    theme: "nature",
    storyLine: "Every leaf is a solar panel dreaming of light.",
    color: "linear-gradient(135deg,#2a5a1a 0%,#4a8a2a 100%)", imageUrl: img24, aspectRatio: "square",
  },

  // Hidden Light (25–32)
  {
    id: "art-25", title: "Penumbra", artist: "Cecilia Montoya", year: 2019,
    theme: "light",
    storyLine: "The most truthful light is the one that admits it cannot reach everywhere.",
    color: "linear-gradient(135deg,#2a1a3a 0%,#5a4a6a 100%)", imageUrl: img25, aspectRatio: "portrait",
  },
  {
    id: "art-26", title: "Shadow Atlas", artist: "Nikolai Petrov", year: 2021,
    theme: "light",
    storyLine: "Map every shadow and you will know the exact position of every light.",
    color: "linear-gradient(135deg,#3a3a4a 0%,#5a5a6a 100%)", imageUrl: img26, aspectRatio: "landscape",
  },
  {
    id: "art-27", title: "The Lit Room", artist: "Amelia Foster", year: 2020,
    theme: "light",
    storyLine: "Someone left a lamp on. The whole house remembers them by it.",
    color: "linear-gradient(135deg,#7a5a1a 0%,#c9a13a 100%)", imageUrl: img27, aspectRatio: "square",
  },
  {
    id: "art-28", title: "Contre-Jour", artist: "Baptiste Lefèvre", year: 2018,
    theme: "light",
    storyLine: "To photograph into the light is to choose the silhouette over the feature.",
    color: "linear-gradient(135deg,#1a1a2a 0%,#c8aa6a 100%)", imageUrl: img28, aspectRatio: "portrait",
  },
  {
    id: "art-29", title: "Chiaroscuro Study", artist: "Valeria Conti", year: 2022,
    theme: "light",
    storyLine: "Caravaggio knew: darkness is not the enemy, it is the collaborator.",
    color: "linear-gradient(135deg,#1a1a1a 0%,#6a4a2a 100%)", imageUrl: img29, aspectRatio: "landscape",
  },
  {
    id: "art-30", title: "A Single Candle", artist: "Elif Şahin", year: 2019,
    theme: "light",
    storyLine: "One flame is enough to make the darkness retreat entirely.",
    color: "linear-gradient(135deg,#3a1a0a 0%,#c87a3a 100%)", imageUrl: img30, aspectRatio: "portrait",
  },
  {
    id: "art-31", title: "Refracted Afternoon", artist: "Sun Wei", year: 2021,
    theme: "light",
    storyLine: "When light bends, it is showing us that physics too can be lyrical.",
    color: "linear-gradient(135deg,#c9a96e 0%,#f5dfa0 100%)", imageUrl: img31, aspectRatio: "square",
  },
  {
    id: "art-32", title: "Dark Matter", artist: "Omar Hassan", year: 2020,
    theme: "light",
    storyLine: "Most of the universe is invisible — and it holds everything together.",
    color: "linear-gradient(135deg,#0a0a1a 0%,#1a1a2e 100%)", imageUrl: img32, aspectRatio: "landscape",
  },

  // The Void Speaks (33–40)
  {
    id: "art-33", title: "Nothing is Missing", artist: "Ingrid Holm", year: 2022,
    theme: "void",
    storyLine: "The most powerful statement is the space between statements.",
    color: "linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%)", imageUrl: img33, aspectRatio: "square",
  },
  {
    id: "art-34", title: "Negative Space Elegy", artist: "Carlos Ibáñez", year: 2020,
    theme: "void",
    storyLine: "Absence draws the most precise map of what once was.",
    color: "linear-gradient(135deg,#2a2a2a 0%,#4a4a4a 100%)", imageUrl: img34, aspectRatio: "landscape",
  },
  {
    id: "art-35", title: "The Sound of Absence", artist: "Haruki Mori", year: 2021,
    theme: "void",
    storyLine: "Silence is the most fluent language; few ever learn to speak it.",
    color: "linear-gradient(135deg,#1a1a2e 0%,#0a0a16 100%)", imageUrl: img35, aspectRatio: "portrait",
  },
  {
    id: "art-36", title: "Monument to Silence", artist: "Zoë Chambers", year: 2019,
    theme: "void",
    storyLine: "We build monuments to things that shout. What of the things that keep still?",
    color: "linear-gradient(135deg,#2a2a2a 0%,#0a0a0a 100%)", imageUrl: img36, aspectRatio: "square",
  },
  {
    id: "art-37", title: "Null Space", artist: "Piotr Wiśniewski", year: 2022,
    theme: "void",
    storyLine: "In mathematics, zero is the most radical invention.",
    color: "linear-gradient(135deg,#1a1a1a 0%,#3a3a3a 100%)", imageUrl: img37, aspectRatio: "landscape",
  },
  {
    id: "art-38", title: "Erasure", artist: "Thandiwe Dube", year: 2020,
    theme: "void",
    storyLine: "To erase is not to destroy; it is to make room for what is essential.",
    color: "linear-gradient(135deg,#1a1a2a 0%,#2a2a3a 100%)", imageUrl: img38, aspectRatio: "portrait",
  },
  {
    id: "art-39", title: "Interstitial", artist: "Fumiko Abe", year: 2021,
    theme: "void",
    storyLine: "The space between the notes is where the music breathes.",
    color: "linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%)", imageUrl: img39, aspectRatio: "landscape",
  },
  {
    id: "art-40", title: "The Unmarked Hour", artist: "Rafael Vargas", year: 2018,
    theme: "void",
    storyLine: "The clock without hands has liberated every moment.",
    color: "linear-gradient(135deg,#2a2a3a 0%,#1a1a2a 100%)", imageUrl: img40, aspectRatio: "portrait",
  },

  // Bloom & Decay (41–48)
  {
    id: "art-41", title: "Petals After Rain", artist: "Saoirse Ó'Brien", year: 2022,
    theme: "bloom",
    storyLine: "Every storm is a gardener; it arranges what it cannot uproot.",
    color: "linear-gradient(135deg,#8a5a7a 0%,#5a3a4a 100%)", imageUrl: img41, aspectRatio: "square",
  },
  {
    id: "art-42", title: "The Last Bloom", artist: "Yemi Adeleke", year: 2020,
    theme: "bloom",
    storyLine: "The flower that blooms in autumn knows something the spring flowers do not.",
    color: "linear-gradient(135deg,#7a3a5a 0%,#5a1a3a 100%)", imageUrl: img42, aspectRatio: "portrait",
  },
  {
    id: "art-43", title: "Entropy Garden", artist: "Mei-Lin Tao", year: 2021,
    theme: "bloom",
    storyLine: "The garden that accepts its own decay is the most honest place on earth.",
    color: "linear-gradient(135deg,#4a5a2a 0%,#7a8a3a 100%)", imageUrl: img43, aspectRatio: "landscape",
  },
  {
    id: "art-44", title: "Faded Archive", artist: "Siobhan Walsh", year: 2019,
    theme: "bloom",
    storyLine: "Pressed flowers are a library. Touch the page and the year comes back.",
    color: "linear-gradient(135deg,#9a8a6a 0%,#6a5a4a 100%)", imageUrl: img44, aspectRatio: "square",
  },
  {
    id: "art-45", title: "Beautiful Ruin", artist: "Dimitri Alexiou", year: 2022,
    theme: "bloom",
    storyLine: "What decays does so in its own particular beauty.",
    color: "linear-gradient(135deg,#7a5a3a 0%,#5a3a1a 100%)", imageUrl: img45, aspectRatio: "portrait",
  },
  {
    id: "art-46", title: "Petal Collapse", artist: "Ananya Krishnan", year: 2021,
    theme: "bloom",
    storyLine: "The petal falls not from weakness but from the completion of purpose.",
    color: "linear-gradient(135deg,#8a6a8a 0%,#6a4a6a 100%)", imageUrl: img46, aspectRatio: "landscape",
  },
  {
    id: "art-47", title: "Senescing", artist: "Björn Halvorsen", year: 2020,
    theme: "bloom",
    storyLine: "The leaf turns gold only when it has decided to let go.",
    color: "linear-gradient(135deg,#9a6a1a 0%,#c8942a 100%)", imageUrl: img47, aspectRatio: "portrait",
  },
  {
    id: "art-48", title: "Season's Final Word", artist: "Chidinma Eze", year: 2022,
    theme: "bloom",
    storyLine: "Autumn is the year's best sentence — long, unhurried, irrevocably closing.",
    color: "linear-gradient(135deg,#7a4a1a 0%,#c86a2a 100%)", imageUrl: img48, aspectRatio: "landscape",
  },
];

// ── Pre-curated walls ─────────────────────────────────────────────────────────
export const curatedWalls: CuratedWall[] = [
  {
    id: "wall-1",
    title: "Echoes of Solitude",
    curator: "Gallery Curatura",
    frames: [
      {
        id: "frame-1",
        title: "Introspection",
        artworkIds: ["art-1", "art-2", "art-3", "art-4", "art-5", "art-6", "art-7", "art-8"],
      },
      {
        id: "frame-2",
        title: "Horizons",
        artworkIds: ["art-9", "art-10", "art-11", "art-12", "art-13", "art-14", "art-15", "art-16"],
      },
      {
        id: "frame-3",
        title: "Nature's Whisper",
        artworkIds: ["art-17", "art-18", "art-19", "art-20", "art-21", "art-22", "art-23", "art-24"],
      },
      {
        id: "frame-4",
        title: "Hidden Light",
        artworkIds: ["art-25", "art-26", "art-27", "art-28", "art-29", "art-30", "art-31", "art-32"],
      },
      {
        id: "frame-5",
        title: "The Void Speaks",
        artworkIds: ["art-33", "art-34", "art-35", "art-36", "art-37", "art-38", "art-39", "art-40"],
      },
      {
        id: "frame-6",
        title: "Bloom & Decay",
        artworkIds: ["art-41", "art-42", "art-43", "art-44", "art-45", "art-46", "art-47", "art-48"],
      },
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
