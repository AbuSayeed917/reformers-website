import type { Metadata } from "next";
import { BriefWorkspace } from "@/features/brief/workspace";
export const metadata: Metadata = {
  title: "re:brief — Enquiry to clarity | reformer'S",
  description:
    "Turn a customer enquiry into a clear project brief, useful questions and a reply draft.",
};
export default function BriefPage() {
  return <BriefWorkspace />;
}
