import type { ComponentPropsWithoutRef } from "react";
import { site } from "@/config/site";
import { createMailto } from "@/lib/enquiry";
import { TextLink } from "./text-link";

type EnquiryLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  subject?: string;
  variant?: "plain" | "text";
};

export function EnquiryLink({
  subject,
  variant = "plain",
  ...props
}: EnquiryLinkProps) {
  const href = createMailto(site.email, subject);
  return variant === "text" ? (
    <TextLink href={href} {...props} />
  ) : (
    <a href={href} {...props} />
  );
}
