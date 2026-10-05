export interface ReformFrame {
  readonly id: "form" | "think" | "build";
  readonly word: string;
  readonly label: string;
  readonly line: string;
  readonly copy: string;
}

export const reformFrames = [
  {
    id: "form",
    word: "form",
    label: "A NEW WAY FORWARD",
    line: "The familiar, made remarkable.",
    copy: "AI automation, apps, websites, software, and SaaS. We turn what could be better into what comes next.",
  },
  {
    id: "think",
    word: "think",
    label: "A DIFFERENT PERSPECTIVE",
    line: "Start with a better question.",
    copy: "What if the work could flow differently? What if the idea could become a product? That’s where we begin.",
  },
  {
    id: "build",
    word: "build",
    label: "IDEAS INTO REALITY",
    line: "Make the next version real.",
    copy: "From the first prototype to a working system. Design, engineering, and intelligence, brought together.",
  },
] as const satisfies readonly [ReformFrame, ...ReformFrame[]];
