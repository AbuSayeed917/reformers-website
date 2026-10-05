export interface Service {
  readonly id: string;
  readonly shortLabel: string;
  readonly title: string;
  readonly tag: string;
  readonly text: string;
  readonly items: readonly string[];
  readonly detail: string;
  readonly enquiry: string;
}

export const services = [
  {
    id: "automation",
    shortLabel: "AI AUTOMATION",
    title: "AI that gets things done.",
    tag: "AI AUTOMATION SYSTEMS",
    text: "Connect your tools, automate repetitive work, and put intelligence into the workflows that keep your business moving.",
    items: [
      "AI agents & assistants",
      "Workflow automation",
      "Connected business systems",
    ],
    detail:
      "We map the workflow, connect the right tools, and build automation around a clear outcome. Human review, error handling, and visibility are part of the system—not an afterthought.",
    enquiry: "your automation system",
  },
  {
    id: "apps",
    shortLabel: "APPS",
    title: "Apps people come back to.",
    tag: "APP DEVELOPMENT",
    text: "Bring your idea into people’s hands with mobile and web apps designed around the way they actually use them.",
    items: [
      "iOS & Android apps",
      "Cross-platform development",
      "Web applications",
    ],
    detail:
      "From early prototypes to a usable first release, we shape the experience, build the application, and connect the services behind it. Every screen has a purpose.",
    enquiry: "your app",
  },
  {
    id: "websites",
    shortLabel: "WEBSITES",
    title: "Websites with presence.",
    tag: "WEBSITES & E-COMMERCE",
    text: "A clear story. A distinctive experience. A website that makes your business feel like itself.",
    items: [
      "Company websites",
      "E-commerce stores",
      "Customer-facing platforms",
    ],
    detail:
      "We bring design and development together, from the first wireframe to the final interaction. The focus is an experience that is easy to navigate, quick to use, and ready to grow.",
    enquiry: "your website",
  },
  {
    id: "software",
    shortLabel: "SOFTWARE",
    title: "Software built around you.",
    tag: "CUSTOM SOFTWARE",
    text: "Replace disconnected tools and workarounds with software that fits how your business operates.",
    items: [
      "Internal tools & dashboards",
      "Business management systems",
      "APIs & integrations",
    ],
    detail:
      "We start with the people using the system, then design the workflows, interfaces, and integrations around them. Practical software for specific business needs.",
    enquiry: "your software",
  },
  {
    id: "saas",
    shortLabel: "SAAS PRODUCTS",
    title: "Ideas become products.",
    tag: "SAAS PRODUCTS",
    text: "Turn a useful idea into a product people can subscribe to, use every day, and grow with.",
    items: [
      "MVPs & product development",
      "Subscription platforms",
      "Product evolution",
    ],
    detail:
      "We design and build SaaS products, from validating the core experience to accounts, subscription billing, and the features users need. A focused first version creates a foundation for the next.",
    enquiry: "your SaaS product",
  },
] as const satisfies readonly Service[];
