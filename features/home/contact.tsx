"use client";
import { useState } from "react";
import { Container } from "@/components/site/container";
import { SectionLabel } from "@/components/site/section-label";
import { Choice } from "@/components/site/choice";
import { EnquiryLink } from "@/components/site/enquiry-link";
import { sectionIds, site } from "@/config/site";
import { services } from "@/content/services";
import { createMailto } from "@/lib/enquiry";
import { createProjectBrief } from "@/lib/project-brief";
import styles from "./contact.module.css";

export function Contact() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [idea, setIdea] = useState("");
  const selectedNames = services
    .filter((service) => selectedIds.includes(service.id))
    .map((service) => service.shortLabel);
  const draftHref = createMailto(
    site.email,
    `A new project with ${site.name}`,
    createProjectBrief(selectedNames, idea),
  );
  function toggleService(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  return (
    <section id={sectionIds.contact} className={styles.contact}>
      <Container>
        <SectionLabel className={styles.label}>
          05 — THE NEXT MOVE IS YOURS.
        </SectionLabel>
        <div className={styles.composition}>
          <div className={styles.invitation}>
            <span className={styles.asterisk} aria-hidden="true">
              ✳
            </span>
            <h2>
              Your
              <br />
              <em>“what if”.</em>
              <br />
              Our next
              <br />
              beginning.
            </h2>
            <p>
              It doesn’t need to be a perfect brief.
              <br />A rough idea is a good place to start.
            </p>
            <EnquiryLink className={styles.email}>{site.email}</EnquiryLink>
          </div>
          <div className={styles.brief}>
            <div className={styles.briefTop}>
              <span>THE FIRST DRAFT</span>
              <span>YOU × {site.name}</span>
            </div>
            <fieldset className={styles.choices}>
              <legend>I’m thinking about…</legend>
              {services.map((service) => (
                <Choice
                  key={service.id}
                  type="checkbox"
                  name="project-services"
                  value={service.id}
                  checked={selectedIds.includes(service.id)}
                  onChange={() => toggleService(service.id)}
                >
                  <span>{service.shortLabel}</span>
                  <span aria-hidden="true">
                    {selectedIds.includes(service.id) ? "✓" : "+"}
                  </span>
                </Choice>
              ))}
            </fieldset>
            <label className={styles.ideaLabel} htmlFor="project-idea">
              What would you like to change or create?
            </label>
            <textarea
              id="project-idea"
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              maxLength={1200}
              rows={4}
              placeholder="What if we could…"
            />
            <div className={styles.draftFooter}>
              <span>
                {selectedIds.length
                  ? `${selectedIds.length} direction${selectedIds.length > 1 ? "s" : ""} to explore`
                  : "There’s no wrong starting point."}
              </span>
              <span>{idea.length}/1200</span>
            </div>
            <a className={styles.sendDraft} href={draftHref}>
              Take the first step<span aria-hidden="true">+</span>
            </a>
            <p className={styles.note}>
              Opens a draft in your email app. Nothing is sent or stored by this
              website.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
