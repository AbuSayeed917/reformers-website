import { brand } from "@/config/brand";
import styles from "./brand.module.css";

export function Wordmark() {
  const { stem, punctuation, suffix } = brand.wordmark;
  return (
    <span className={styles.wordmark}>
      {stem}
      <span className={styles["brand-apostrophe"]}>{punctuation}</span>
      {suffix}
    </span>
  );
}
