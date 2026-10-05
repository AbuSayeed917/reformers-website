import { publicPath } from "@/config/deployment";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export function TextLink({
  className,
  href,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      className={cn(styles.underlink, className)}
      {...props}
      href={href ? publicPath(href) : undefined}
    />
  );
}
