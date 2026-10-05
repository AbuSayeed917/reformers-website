export type DemoProduct = {
  id: string;
  name: string;
  monogram: string;
  tone: "paper" | "ink";
  category?: string;
  logo?: string;
  nameStyle?: "serif-bold" | "serif-soft" | "arcade";
  description?: string;
  demoUrl?: string;
};

// External product details verified against the owner’s GitHub READMEs.
// Native apps have no verified public demo URL; use the enquiry fallback.
export const demoProducts: readonly DemoProduct[] = [
  {
    id: "mihraya",
    logo: "/products/mihraya.png",
    nameStyle: "serif-bold",
    name: "Mihraya",
    monogram: "M",
    tone: "ink",
    category: "iOS APP · WORSHIP",
    description:
      "A companion for everyday worship. Prayer times, Qur’an, dhikr, reminders, and personal worship tools come together in one native iPhone app.",
  },
  {
    id: "bloom-notes",
    logo: "/products/bloom-notes.png",
    nameStyle: "serif-soft",
    name: "Bloom Notes",
    monogram: "B",
    tone: "paper",
    category: "iPHONE & iPAD · NOTES",
    description:
      "A calm place for your thoughts. Write among animated nature scenes, organize notes with collections and tags, and keep your library stored on your device.",
  },
  {
    id: "bottle-raid",
    logo: "/products/bottle-raid.png",
    nameStyle: "arcade",
    name: "Bottle Raid",
    monogram: "BR",
    tone: "ink",
    category: "iPHONE GAME · 3D ARCADE",
    description:
      "Aim, fire, and set off a chain reaction. Command a cannon across eight pirate coves in a 3D physics game with explosive bottles, collapsing towers, and midair shockwaves.",
  },
  {
    id: "reflow",
    name: "re:flow",
    monogram: "→",
    tone: "paper",
    description:
      "A visual automation studio. Follow an enquiry through AI routing, reply drafting, and human approval. Run a sample or try live AI.",
    demoUrl: "/demo/flow",
  },
  {
    id: "rebrief",
    name: "re:brief",
    monogram: "re:",
    tone: "ink",
    description:
      "An enquiry assistant that turns a customer message into a project brief, follow-up questions, and an editable reply. Explore the interactive sample demo.",
    demoUrl: "/demo/brief",
  },
  {
    id: "prescriba",
    name: "Prescriba",
    monogram: "P",
    tone: "paper",
    description:
      "Electronic prescriptions and patient tracking for Bangladeshi doctors. Bring prescriptions, visit histories, and follow-ups into one workflow.",
    demoUrl: "https://biomedai.vercel.app/prescriba",
  },
  {
    id: "human-atlas",
    name: "Human Atlas",
    monogram: "HA",
    tone: "ink",
    description:
      "Explore human anatomy in 3D. Browse structures by system or region, switch layers, and isolate structures for a closer look.",
    demoUrl: "https://biomedai.vercel.app/biomedaihuman",
  },
];
