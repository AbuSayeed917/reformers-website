"use client";
import { useState } from "react";
import { Container } from "@/components/site/container";
import { SectionLabel } from "@/components/site/section-label";
import { Choice } from "@/components/site/choice";
import { EnquiryLink } from "@/components/site/enquiry-link";
import { sectionIds, site } from "@/config/site";
import { services } from "@/content/services";
import { serviceFlows } from "@/content/transformations";
import styles from "./expertise.module.css";

export function Expertise() {
  const [selectedId, setSelectedId] = useState<string>(services[0].id);
  const selected =
    services.find((service) => service.id === selectedId) ?? services[0];
  const flow = serviceFlows[selected.id];
  return (
    <section id={sectionIds.expertise} className={styles.expertise}>
      <Container>
        <div className={styles.heading}>
          <SectionLabel className={styles.label}>
            02 — WHAT WE MAKE POSSIBLE
          </SectionLabel>
          <h2>
            Different challenges.
            <br />
            <em>New possibilities.</em>
          </h2>
          <p>
            Choose a direction.
            <br />
            See what we can make of it.
          </p>
        </div>
        <div className={styles.workbench}>
          <fieldset className={styles.selector}>
            <legend className="sr-only">Explore our services</legend>
            {services.map((service, index) => (
              <Choice
                key={service.id}
                type="radio"
                name="service"
                value={service.id}
                checked={service.id === selected.id}
                onChange={() => setSelectedId(service.id)}
                tone="dark"
              >
                <span className={styles.serviceNumber}>0{index + 1}</span>
                <span>{service.shortLabel}</span>
                <span aria-hidden="true">
                  {service.id === selected.id ? "−" : "+"}
                </span>
              </Choice>
            ))}
          </fieldset>
          <div className={styles.preview} aria-live="polite" aria-atomic="true">
            <div className={styles.previewTop}>
              <span>{selected.tag}</span>
              <span aria-hidden="true">
                [ POSSIBILITY / 0{services.indexOf(selected) + 1} ]
              </span>
            </div>
            <div
              className={styles.diagram}
              aria-label={`From ${flow[0]} through ${flow[1]} to ${flow[2]}`}
            >
              <div className={styles.input}>{flow[0]}</div>
              <span className={styles.connector} aria-hidden="true" />
              <div className={styles.engine}>
                <span aria-hidden="true">✳</span>
                <strong>{flow[1]}</strong>
              </div>
              <span className={styles.connector} aria-hidden="true" />
              <div className={styles.output}>{flow[2]}</div>
            </div>
            <h3>{selected.title}</h3>
            <p className={styles.description}>{selected.text}</p>
            <ul className={styles.includes}>
              {selected.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <details className={styles.details}>
              <summary>
                Explore the approach <span aria-hidden="true">+</span>
              </summary>
              <p>{selected.detail}</p>
            </details>
            <EnquiryLink
              variant="text"
              className={styles.enquiry}
              subject={`${site.name}: ${selected.tag}`}
            >
              Talk about {selected.enquiry}
            </EnquiryLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
