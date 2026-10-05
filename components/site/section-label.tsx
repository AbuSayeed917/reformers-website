import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export function SectionLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return <p className={cn(styles["section-index"], className)} {...props} />;
}
