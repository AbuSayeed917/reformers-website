"use client";
import { staticDeployment } from "@/config/deployment";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Play,
  RotateCcw,
  Square,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/wordmark";
import {
  classificationSchema,
  draftSchema,
  nodeStatus,
  steps,
  type Classification,
  type Phase,
  type StepId,
} from "./model";
import { sampleMessage, sampleClassification, sampleReply } from "./sample";
import styles from "./workspace.module.css";

type Event = { text: string; time: string };
export function FlowWorkspace() {
  const [mode, setMode] = useState<"sample" | "live">("sample");
  const [message, setMessage] = useState(sampleMessage);
  const [phase, setPhase] = useState<Phase>("idle");
  const [selected, setSelected] = useState<StepId>("trigger");
  const [classification, setClassification] = useState<Classification | null>(
    null,
  );
  const [reply, setReply] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const [failedStep, setFailedStep] = useState<StepId>("classify");
  const active = useRef<AbortController | null>(null);
  const busy = phase === "classifying" || phase === "drafting";
  useEffect(() => () => active.current?.abort(), []);
  function log(text: string) {
    setEvents((current) => [
      ...current,
      {
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    ]);
  }
  function reset() {
    active.current?.abort();
    active.current = null;
    setPhase("idle");
    setClassification(null);
    setReply("");
    setEvents([]);
    setError("");
    setSelected("trigger");
  }
  function setInput(value: string) {
    reset();
    setMessage(value);
  }
  async function requestStep(body: unknown, signal: AbortSignal) {
    const response = await fetch("/api/flow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    const value: unknown = await response.json();
    if (!response.ok)
      throw new Error(
        typeof value === "object" &&
          value &&
          "error" in value &&
          typeof value.error === "string"
          ? value.error
          : "The workflow step failed. Try again.",
      );
    return value;
  }
  async function run() {
    if (busy) return;
    reset();
    if (message.trim().length < 30) {
      setError("Add at least 30 characters to describe the enquiry.");
      return;
    }
    const controller = new AbortController();
    active.current = controller;
    const timer = setTimeout(() => controller.abort(), 100000);
    let step: StepId = "classify";
    try {
      log(
        mode === "sample"
          ? "Sample run started · pre-written outputs"
          : "Live run started · Gemini Flash-Lite",
      );
      log("Incoming enquiry captured");
      setPhase("classifying");
      setSelected("classify");
      const category =
        mode === "sample"
          ? sampleClassification
          : classificationSchema.parse(
              await requestStep(
                { step: "classify", message },
                controller.signal,
              ),
            );
      if (controller.signal.aborted) throw new Error("Run stopped.");
      setClassification(category);
      log(`Routed to ${category.category}`);
      setPhase("drafting");
      setSelected("draft");
      step = "draft";
      const draft =
        mode === "sample"
          ? sampleReply
          : draftSchema.parse(
              await requestStep(
                { step: "draft", message, classification: category },
                controller.signal,
              ),
            ).reply;
      if (controller.signal.aborted) throw new Error("Run stopped.");
      setReply(draft);
      log("Reply draft prepared");
      setPhase("review");
      setSelected("approve");
      log("Paused for human approval · nothing sent");
    } catch (cause) {
      if (active.current !== controller) return;
      const detail = controller.signal.aborted
        ? "Run stopped or timed out. You can run it again."
        : cause instanceof Error
          ? cause.message
          : "This step failed.";
      setError(detail);
      setFailedStep(step);
      setSelected(step);
      setPhase("error");
      log("Run stopped before approval");
    } finally {
      clearTimeout(timer);
      if (active.current === controller) active.current = null;
    }
  }
  function decide(approved: boolean) {
    if (phase !== "review") return;
    setPhase(approved ? "approved" : "rejected");
    log(
      approved
        ? "Draft approved in demo · no email sent"
        : "Draft rejected · workflow stopped",
    );
  }
  function download() {
    const data = {
      mode,
      status: phase,
      enquiry: message,
      classification,
      reply,
      events,
      note: "Demo record only. No email was sent.",
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "reflow-run.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const selectedStep = steps.find((step) => step.id === selected)!;
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link href="/" aria-label="reformer'S home">
          <Wordmark />
        </Link>
        <span>PRODUCT EXPERIMENT / 002</span>
        <Link href="/#products">All demos ↗</Link>
      </header>
      <main className={styles.main}>
        <div className={styles.intro}>
          <div>
            <p>THE AUTOMATION STUDIO</p>
            <h1>
              re<span>:</span>
              <em>flow.</em>
            </h1>
          </div>
          <div>
            <h2>
              Less busywork.
              <br />
              <em>More forward motion.</em>
            </h2>
            <p>
              One enquiry. Four connected steps.
              <br />A person in control of the final move.
            </p>
          </div>
        </div>
        {staticDeployment && (
          <p>
            This public preview runs pre-written samples. Live AI requires a
            server.
          </p>
        )}
        <div className={styles.toolbar}>
          <div className={styles.modes} role="group" aria-label="Run mode">
            {(["sample", "live"] as const).map((value) => (
              <Button
                key={value}
                variant="outline"
                disabled={busy || (staticDeployment && value === "live")}
                aria-pressed={mode === value}
                onClick={() => {
                  reset();
                  setMode(value);
                  setMessage(sampleMessage);
                }}
              >
                {value === "sample" ? "Sample run" : "Live AI"}
              </Button>
            ))}
          </div>
          <span className={styles.modeNote}>
            {mode === "sample"
              ? "Pre-written sample · no AI requests"
              : "Two real AI steps · Gemini Flash-Lite"}
          </span>
          <Button className={styles.run} onClick={run} disabled={busy}>
            <Play size={15} />
            {busy ? "Running…" : "Run workflow"}
          </Button>
          {busy && (
            <Button variant="outline" onClick={() => active.current?.abort()}>
              <Square size={14} />
              Stop
            </Button>
          )}
        </div>
        <section className={styles.canvas} aria-label="Connected workflow">
          <div className={styles.canvasLabel}>
            <span>ENQUIRY → REVIEW / WORKFLOW 01</span>
            <span>Click a step to inspect it</span>
          </div>
          <div className={styles.nodes}>
            {steps.map((step, index) => (
              <div key={step.id} className={styles.nodeGroup}>
                <button
                  type="button"
                  className={styles.node}
                  data-status={nodeStatus(step.id, phase, failedStep)}
                  aria-pressed={selected === step.id}
                  onClick={() => setSelected(step.id)}
                >
                  <span className={styles.nodeTop}>
                    {String(index + 1).padStart(2, "0")}
                    <span>{step.kind}</span>
                  </span>
                  <strong>{step.title}</strong>
                  <span className={styles.nodeDetail}>{step.detail}</span>
                  <span className={styles.nodeStatus}>
                    {nodeStatus(step.id, phase, failedStep) === "done" ? (
                      <Check size={13} />
                    ) : (
                      <span className={styles.dot} />
                    )}{" "}
                    {nodeStatus(step.id, phase, failedStep)}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <ArrowRight className={styles.connector} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
          <p className={styles.canvasFoot}>
            Automation gets you to a decision. <em>You make it.</em>
          </p>
        </section>
        <div className={styles.lower}>
          <section className={styles.inspector} aria-label="Step inspector">
            <div className={styles.sectionHead}>
              <span>STEP INSPECTOR</span>
              <span>{selectedStep.kind}</span>
            </div>
            <h2>{selectedStep.title}</h2>
            {selected === "trigger" ? (
              <>
                <label htmlFor="flow-enquiry">Incoming enquiry</label>
                <textarea
                  id="flow-enquiry"
                  value={message}
                  readOnly={mode === "sample"}
                  disabled={busy}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={6000}
                  rows={7}
                />
                <p className={styles.hint}>
                  {mode === "sample"
                    ? staticDeployment
                      ? "Fictional example with pre-written outputs for this public preview."
                      : "Fictional example. Switch to Live AI to enter your own enquiry."
                    : "Running sends this enquiry to Google Gemini. Free-tier content may improve Google products. Use non-sensitive examples."}
                </p>
              </>
            ) : selected === "classify" ? (
              classification ? (
                <>
                  <span className={styles.category}>
                    {classification.category}
                  </span>
                  <p>{classification.summary}</p>
                  <p className={styles.hint}>{classification.reason}</p>
                </>
              ) : (
                <p className={styles.empty}>
                  {phase === "classifying"
                    ? "AI is reading the enquiry…"
                    : "Run the workflow to see its category and routing reason."}
                </p>
              )
            ) : selected === "draft" || selected === "approve" ? (
              reply ? (
                <>
                  <label htmlFor="flow-reply">
                    Reply draft{" "}
                    {phase === "review" ? "· editable before approval" : ""}
                  </label>
                  <textarea
                    id="flow-reply"
                    value={reply}
                    readOnly={phase !== "review"}
                    onChange={(event) => setReply(event.target.value)}
                    rows={9}
                  />
                  {phase === "review" && (
                    <div className={styles.decisions}>
                      <Button
                        disabled={!reply.trim()}
                        onClick={() => decide(true)}
                      >
                        Approve draft <Check size={15} />
                      </Button>
                      <Button variant="outline" onClick={() => decide(false)}>
                        Reject draft
                      </Button>
                    </div>
                  )}
                  <p className={styles.hint}>
                    {phase === "approved"
                      ? "Approved in this demo. Nothing was sent."
                      : phase === "rejected"
                        ? "Rejected. Run the workflow again to create a new draft."
                        : "Review and edit before approving. Approval records a demo decision; it never sends an email."}
                  </p>
                </>
              ) : (
                <p className={styles.empty}>
                  {phase === "drafting"
                    ? "AI is preparing a reply…"
                    : "The reply will appear after the routing step completes."}
                </p>
              )
            ) : null}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </section>
          <section className={styles.history} aria-label="Run history">
            <div className={styles.sectionHead}>
              <span>RUN LOG</span>
              <span role="status">{phase}</span>
            </div>
            {events.length ? (
              <ol>
                {events.map((event, index) => (
                  <li key={index}>
                    <time>{event.time}</time>
                    <span>{event.text}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className={styles.logEmpty}>
                <span aria-hidden="true">↳</span>
                <p>No steps taken. Yet.</p>
                <p className={styles.hint}>
                  Run the workflow to follow its progress here.
                </p>
              </div>
            )}
            <div className={styles.logActions}>
              <Button variant="ghost" disabled={busy} onClick={reset}>
                <RotateCcw size={15} />
                Reset run
              </Button>
              <Button
                variant="outline"
                disabled={!["approved", "rejected"].includes(phase)}
                onClick={download}
              >
                <Download size={15} />
                Export run
              </Button>
            </div>
          </section>
        </div>
        <p className={styles.footer}>
          A working automation demo by reformer&apos;S. Run history stays in
          this tab and clears on reload.
        </p>
      </main>
    </div>
  );
}
