import { Fragment } from "react";
import { services } from "@/content/services";
import styles from "./capabilities-strip.module.css";

export function CapabilitiesStrip() {
  return (
    <div className={styles["discipline-strip"]} aria-label="Our capabilities">
      {services.map((service, index) => (
        <Fragment key={service.id}>
          {index > 0 && <b aria-hidden="true">✳</b>}
          <span>{service.shortLabel}</span>
        </Fragment>
      ))}
    </div>
  );
}
