import type { Brief } from "./schema.ts";

export type Sample = {
  id: string;
  label: string;
  message: string;
  brief: Brief;
};
export const samples: readonly Sample[] = [
  {
    id: "website",
    label: "A website enquiry",
    message:
      "Hi! I run a small architecture studio. Our website feels dated and doesn't show our recent work. We'd like a clean portfolio, an easy way to add projects, and a contact form. Our budget is around £4,000–£6,000, and we'd love to launch in 8 weeks. Can you help? — Maya",
    brief: {
      title: "A new home for an architecture studio",
      summary:
        "Maya wants to replace a dated website with a clean portfolio that showcases recent architectural work and makes it easier to enquire.",
      services: ["Website design", "CMS development"],
      budget: "£4,000–£6,000",
      timeline: "Desired launch in 8 weeks",
      deliverables: [
        "A portfolio of recent projects",
        "A content editor for adding projects",
        "A project enquiry form",
      ],
      questions: [
        "How many projects should be included at launch?",
        "Are photography, project descriptions, and brand assets ready?",
        "Which platform is the current website built on?",
      ],
      reply:
        "Hi Maya,\n\nThanks for reaching out. A clean portfolio with an easy way to add projects sounds like a useful next step for your studio.\n\nYou mentioned a budget of £4,000–£6,000 and an ideal launch in 8 weeks. Before we confirm scope and timing, could you share your current website, the number of projects you want to feature, and whether your photography and copy are ready?\n\nFrom there, we can suggest a clear plan for the portfolio, content editor, and enquiry form.\n\nBest,\nreformer'S",
    },
  },
  {
    id: "automation",
    label: "An automation enquiry",
    message:
      "We get about 40 enquiries a day through our website and email. My team copies them into a spreadsheet and often forgets to follow up. Could you connect this to HubSpot and help us draft replies? We need a person to approve every email before it goes out. I'm not sure about budget yet. — Sam",
    brief: {
      title: "Less copying. More following up.",
      summary:
        "Sam's team needs a connected enquiry workflow to reduce manual spreadsheet work and missed follow-ups, while keeping a person in control of outgoing emails.",
      services: [
        "Workflow automation",
        "AI-assisted drafting",
        "CRM integration",
      ],
      budget: "Not decided",
      timeline: "Not specified",
      deliverables: [
        "Connect website and email enquiries to HubSpot",
        "Prepare reply drafts for human approval",
        "Support follow-up tracking",
      ],
      questions: [
        "Which email provider and website form do you use?",
        "How should enquiries be assigned to team members?",
        "What should trigger a follow-up, and when?",
        "What budget range and target start date would work for you?",
      ],
      reply:
        "Hi Sam,\n\nThanks for describing the workflow. Connecting enquiries to HubSpot and preparing replies for your team's approval could help reduce the copying and missed follow-ups.\n\nTo understand the integration, which email provider and website form do you use? It would also help to know how you assign enquiries and when a follow-up should happen.\n\nWe can then outline a focused first version and discuss budget and timing. Every outgoing reply would stay subject to human approval.\n\nBest,\nreformer'S",
    },
  },
  {
    id: "saas",
    label: "A SaaS enquiry",
    message:
      "I have an idea for a subscription app for independent tutors. They should be able to manage students, schedule lessons and track payments. I'd like to test it with 10 tutors before investing in a full launch. Can we start with an MVP? — Alex",
    brief: {
      title: "A focused first product for tutors",
      summary:
        "Alex wants to validate a subscription product with 10 independent tutors before committing to a wider launch.",
      services: ["SaaS product development", "MVP planning"],
      budget: "Not specified",
      timeline: "Not specified",
      deliverables: [
        "Student management",
        "Lesson scheduling",
        "Payment tracking",
        "An MVP pilot for 10 tutors",
      ],
      questions: [
        "Should the MVP collect payments or only record them?",
        "Have the 10 pilot tutors already agreed to participate?",
        "What budget and pilot date do you have in mind?",
        "Which single problem is most important to validate first?",
      ],
      reply:
        "Hi Alex,\n\nStarting with a small tutor pilot is a useful way to test the idea before a full launch. We can explore a focused MVP around students, lessons, and payment tracking.\n\nWould payment tracking mean recording payments or collecting them in the app? Have you lined up the 10 tutors, and do you have a budget or pilot date in mind?\n\nThose details will help us define the smallest useful version and what we want to learn from it.\n\nBest,\nreformer'S",
    },
  },
];
