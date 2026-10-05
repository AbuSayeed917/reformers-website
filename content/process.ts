export interface ProcessStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}
export const processSteps = [
  {
    id: "step-01",
    title: "Challenge the brief.",
    description:
      "We get to know your business, your users, and what needs to change. Together, we define what a better outcome looks like.",
  },
  {
    id: "step-02",
    title: "Find the right form.",
    description:
      "We explore directions, map the experience, and make prototypes. You can see and shape the idea before we build it.",
  },
  {
    id: "step-03",
    title: "Make it work.",
    description:
      "We develop in focused iterations, test the details, and keep you close to the progress. Design and engineering move together.",
  },
  {
    id: "step-04",
    title: "Move it forward.",
    description:
      "We prepare for launch and a clear handover, then agree on the support and improvements your next chapter needs.",
  },
] as const satisfies readonly ProcessStep[];
