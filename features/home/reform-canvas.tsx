"use client";

import { useState } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/site/container";
import { TextLink } from "@/components/site/text-link";
import { reformFrames } from "@/content/reform-frames";
import { sectionIds } from "@/config/site";
import styles from "./reform-canvas.module.css";

export function ReformCanvas() {
  const [frameIndex, setFrameIndex] = useState(0);
  const current = reformFrames[frameIndex];

  function advanceFrame() {
    setFrameIndex((index) => (index + 1) % reformFrames.length);
  }

  return (
    <Container
      as="section"
      className={styles["reform-canvas"]}
      data-frame={current.id}
      aria-labelledby="hero-title"
    >
      <div className={styles["canvas-meta"]}>
        <span>A COMPANY FOR WHAT COMES NEXT.</span>
        <span>DESIGN × ENGINEERING × INTELLIGENCE</span>
      </div>
      <div className={styles["canvas-grid"]}>
        <h1 id="hero-title" className={styles["canvas-title"]}>
          <span className={styles["re-prefix"]}>
            re<span className={styles["re-colon"]}>:</span>
          </span>
          <span className={styles["re-verb"]} key={current.id}>
            {current.word}
            <span className={styles.fullstop}>.</span>
          </span>
        </h1>
        <div className={styles["canvas-note"]}>
          <span className={styles.micro}>{current.label}</span>
          <p>{current.line}</p>
          <span className={styles["note-cross"]} aria-hidden="true">
            +
          </span>
        </div>
        <div className={styles["identity-tile"]} aria-hidden="true">
          <BrandMark />
          <span>
            THE SAME PIECES.
            <br />
            NEW POSSIBILITIES.
          </span>
        </div>
        <div className={styles["canvas-description"]}>
          <p>{current.copy}</p>
          <TextLink href={`#${sectionIds.expertise}`}>
            Explore what we build
          </TextLink>
        </div>
      </div>
      <div className={styles["canvas-controls"]}>
        <span className={styles["canvas-caption"]}>
          NOTHING GREAT STAYS THE SAME.
        </span>
        <button
          className={styles["reform-button"]}
          type="button"
          onClick={advanceFrame}
          aria-label="Reform the canvas"
        >
          <span className={styles["button-orbit"]} aria-hidden="true">
            ↻
          </span>
          Reform the canvas
          <span className={styles["frame-count"]}>
            {String(frameIndex + 1).padStart(2, "0")} /{" "}
            {String(reformFrames.length).padStart(2, "0")}
          </span>
        </button>
        <span className="sr-only" role="status" aria-atomic="true">
          {current.word}. {current.line}
        </span>
      </div>
    </Container>
  );
}
