import type { Classification } from "./model";
export const sampleMessage =
  "Hi, we’re a fictional design studio. Every website enquiry gets copied by hand into our CRM, and follow-ups are easy to miss. Could you automate this and prepare replies for our team to review? We use HubSpot and Gmail. — Jamie";
export const sampleClassification: Classification = {
  category: "Automation",
  summary:
    "A design studio needs website enquiries connected to HubSpot and Gmail, with follow-up tracking and reply drafts for human review.",
  reason:
    "The main need is to connect existing tools and reduce repetitive work.",
};
export const sampleReply =
  "Hi Jamie,\n\nThanks for getting in touch. Connecting your website enquiries to HubSpot and preparing replies for review could help reduce manual copying and missed follow-ups.\n\nWhich website form do you use, and how should enquiries be assigned to your team? It would also help to understand when you want follow-ups to happen.\n\nWith those details, we can outline a focused first version. Your team would review every reply before it is sent.\n\nBest,\nreformer'S";
