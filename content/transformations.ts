/** Conceptual examples, not claims about completed client projects. */
export const transformations = [
  { before: "Repeat the task.", after: "Reclaim the time." },
  { before: "Work around the tool.", after: "Build around the work." },
  { before: "Keep the idea waiting.", after: "Make the first version." },
] as const;

export const serviceFlows = {
  automation: [
    "A repetitive task",
    "Connected intelligence",
    "Time for better work",
  ],
  apps: ["A useful idea", "An intuitive experience", "An everyday companion"],
  websites: [
    "A business story",
    "A distinctive presence",
    "A meaningful connection",
  ],
  software: [
    "Scattered processes",
    "A purpose-built system",
    "A clearer way to work",
  ],
  saas: [
    "A real customer need",
    "A focused first product",
    "A platform to grow",
  ],
} as const;

export const processArtifacts = [
  {
    id: "step-01",
    label: "THE QUESTION",
    output: "A clear direction",
    notes: [
      "Who is this for?",
      "What needs to change?",
      "What does better look like?",
    ],
  },
  {
    id: "step-02",
    label: "THE EXPLORATION",
    output: "A tangible prototype",
    notes: [
      "Map the experience",
      "Try different directions",
      "Put the idea in people’s hands",
    ],
  },
  {
    id: "step-03",
    label: "THE MAKING",
    output: "A working product",
    notes: [
      "Build in focused iterations",
      "Test the important details",
      "Review and refine together",
    ],
  },
  {
    id: "step-04",
    label: "THE NEXT CHAPTER",
    output: "A confident launch",
    notes: [
      "Prepare the release",
      "Share a clear handover",
      "Agree on what comes next",
    ],
  },
] as const;
