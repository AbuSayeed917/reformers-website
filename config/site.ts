import { brandName } from "./brand";

export const sectionIds = {
  main: "main",
  studio: "studio",
  expertise: "expertise",
  products: "products",
  approach: "approach",
  contact: "contact",
} as const;

export const site = {
  name: brandName,
  email: "muhammadabusayeed084@gmail.com",
  title: `${brandName} — Change takes shape.`,
  description: `${brandName} builds AI automation systems, mobile and web apps, websites, custom software, and SaaS products. From idea to launch and beyond.`,
  navigation: [
    { label: "What we do", href: `#${sectionIds.expertise}` },
    { label: "Demos", href: `#${sectionIds.products}` },
    { label: "Who we are", href: `#${sectionIds.studio}` },
    { label: "How we work", href: `#${sectionIds.approach}` },
  ],
} as const;
