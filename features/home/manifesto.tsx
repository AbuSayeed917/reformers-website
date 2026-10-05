"use client";
import { useState } from "react";
import { Container } from "@/components/site/container";
import { SectionLabel } from "@/components/site/section-label";
import { sectionIds, site } from "@/config/site";
import { transformations } from "@/content/transformations";
import styles from "./manifesto.module.css";

export function Manifesto() {
  const [reformed, setReformed] = useState(false);
  return (
    <Container as="section" id={sectionIds.studio} className={styles.manifesto}>
      <div className={styles.intro}>
        <SectionLabel>01 — A DIFFERENT STARTING POINT</SectionLabel>
        <h2>
          Nothing is
          <br />
          <em>set in stone.</em>
        </h2>
        <p>
          At {site.name}, we start with a simple question: does it have to work
          this way?
        </p>
      </div>
      <div className={styles.revision} data-reformed={reformed}>
        <div className={styles.sheetHeader}>
          <span>THE EVERYDAY / REVISED</span>
          <span aria-hidden="true">✳</span>
        </div>
        <div className={styles.lines} aria-live="polite">
          {transformations.map((line, index) => (
            <div className={styles.line} key={line.before}>
              <span className={styles.lineNumber}>0{index + 1}</span>
              <span className={styles.old}>{line.before}</span>
              <span className={styles.new} aria-hidden={!reformed}>
                {line.after}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.sheetFooter}>
          <span>
            {reformed
              ? "A different perspective changes everything."
              : "Familiar doesn’t have to mean final."}
          </span>
          <button
            type="button"
            aria-pressed={reformed}
            onClick={() => setReformed((value) => !value)}
          >
            {reformed ? "See the starting point" : "See it differently"}
            <span aria-hidden="true">↻</span>
          </button>
        </div>
      </div>
      <p className={styles.marginNote}>
        Same challenge.
        <br />
        <span>A better possibility.</span>
      </p>
    </Container>
  );
}
