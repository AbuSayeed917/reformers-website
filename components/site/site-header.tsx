import { BrandMark } from "@/components/brand/brand-mark";
import { Wordmark } from "@/components/brand/wordmark";
import { sectionIds, site } from "@/config/site";
import { Container } from "./container";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <>
      <a href={`#${sectionIds.main}`} className={styles.skip}>
        Skip to content
      </a>
      <Container as="header" className={styles["site-header"]}>
        <a href="#" aria-label={`${site.name} home`} className={styles.brand}>
          <BrandMark width="30" height="34" />
          <Wordmark />
        </a>
        <nav aria-label="Main navigation">
          {site.navigation.map(({ label, href }) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a href={`#${sectionIds.contact}`} className={styles["header-cta"]}>
          Let’s make a change<span aria-hidden="true">+</span>
        </a>
      </Container>
    </>
  );
}
