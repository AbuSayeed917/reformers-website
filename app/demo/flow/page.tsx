import type { Metadata } from "next";
import { FlowWorkspace } from "@/features/flow/workspace";
export const metadata: Metadata = {
  title: "re:flow — Work, in motion | reformer'S",
  description:
    "Explore an enquiry workflow from AI routing to a human-approved reply.",
};
export default function FlowPage() {
  return <FlowWorkspace />;
}
