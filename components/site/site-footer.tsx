import { Wordmark } from "@/components/brand/wordmark";
import { BrandMark } from "@/components/brand/brand-mark";
import { brand } from "@/config/brand";
import { sectionIds, site } from "@/config/site";
import { Container } from "./container";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <Container as="footer" className={styles.footer}>
      <div className={styles.signature}>
        <BrandMark />
        <div>
          <span className={styles.endnote}>
            END OF PAGE. START OF SOMETHING.
          </span>
          <a href="#" aria-label={`${site.name} home`}>
            <Wordmark />
          </a>
        </div>
        <a className={styles.returnLink} href={`#${sectionIds.main}`}>
          <span aria-hidden="true">↻</span>Back to the beginning
        </a>
      </div>
      <div className={styles.footnote}>
        <span>{brand.tagline}</span>
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
      </div>
    </Container>
  );
}
