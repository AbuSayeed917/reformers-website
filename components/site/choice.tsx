import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./choice.module.css";

type ChoiceProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> & {
  type: "radio" | "checkbox";
  children: ReactNode;
  tone?: "light" | "dark";
};

/** Native inputs retain keyboard/group behavior; the label supplies the visual treatment. */
export function Choice({ children, tone = "light", ...input }: ChoiceProps) {
  return (
    <label className={styles.choice} data-tone={tone}>
      <input {...input} />
      <span>{children}</span>
    </label>
  );
}
