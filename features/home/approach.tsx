"use client";
import { useState } from "react";
import { Container } from "@/components/site/container";
import { SectionLabel } from "@/components/site/section-label";
import { Choice } from "@/components/site/choice";
import { sectionIds, site } from "@/config/site";
import { processSteps } from "@/content/process";
import { processArtifacts } from "@/content/transformations";
import styles from "./approach.module.css";

export function Approach() {
  const [selectedId, setSelectedId] = useState<string>(processSteps[0].id);
  const step =
    processSteps.find((item) => item.id === selectedId) ?? processSteps[0];
  const artifact =
    processArtifacts.find((item) => item.id === step.id) ?? processArtifacts[0];
  const index = processSteps.indexOf(step);
  return (
    <Container
      as="section"
      id={sectionIds.approach}
      className={styles.approach}
    >
      <div className={styles.heading}>
        <SectionLabel>04 — FROM QUESTION TO CREATION</SectionLabel>
        <h2>
          Good things
          <br />
          take <em>revisions.</em>
        </h2>
        <p>
          No mysterious handoffs.
          <br />A shared process you can see and shape.
        </p>
      </div>
      <div className={styles.notebook}>
        <fieldset className={styles.chapters}>
          <legend className="sr-only">Explore the project process</legend>
          {processSteps.map((item, i) => (
            <Choice
              key={item.id}
              type="radio"
              name="process"
              value={item.id}
              checked={item.id === step.id}
              onChange={() => setSelectedId(item.id)}
            >
              <span>0{i + 1}</span>
              <span>{item.title}</span>
            </Choice>
          ))}
        </fieldset>
        <div className={styles.spread}>
          <div className={styles.explanation} aria-live="polite">
            <span className={styles.pageNumber} aria-hidden="true">
              0{index + 1}
              <small>/{String(processSteps.length).padStart(2, "0")}</small>
            </span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <div className={styles.pageFoot}>
              <span>YOU + {site.name}</span>
              <span>IN THE SAME CONVERSATION.</span>
            </div>
          </div>
          <div className={styles.workingPage}>
            <div className={styles.paperHead}>
              <span>{artifact.label}</span>
              <span aria-hidden="true">+</span>
            </div>
            <ol>
              {artifact.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ol>
            <div className={styles.stamp}>
              <span>TAKEAWAY</span>
              <strong>{artifact.output}</strong>
            </div>
            <div className={styles.margin}>A step forward, together.</div>
          </div>
        </div>
      </div>
    </Container>
  );
}
