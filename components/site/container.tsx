import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "header" | "footer";
};

export function Container({
  as: Element = "div",
  className,
  ...props
}: ContainerProps) {
  return <Element className={cn(styles.shell, className)} {...props} />;
}
