"use client";

import { staticDeployment } from "@/config/deployment";
import Link from "next/link";
import { z } from "zod";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  MoveRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/wordmark";
import { samples } from "./samples";
import {
  briefSchema,
  enquirySchema,
  exportBrief,
  MAX_ENQUIRY_LENGTH,
  type BriefResult,
} from "./schema";
import styles from "./workspace.module.css";
import { Chatbot } from "./chatbot";

export function BriefWorkspace() {
  const [available, setAvailable] = useState<boolean | null>(
    staticDeployment ? false : null,
  );
  const [message, setMessage] = useState(samples[0].message);
  const [result, setResult] = useState<BriefResult | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (staticDeployment) return;
    const controller = new AbortController();
    fetch("/api/brief", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) =>
        setAvailable(
          z.object({ available: z.boolean() }).parse(data).available,
        ),
      )
      .catch(() => {
        if (!controller.signal.aborted) setAvailable(false);
      });
    return () => controller.abort();
  }, []);
  const sample = samples.find((item) => item.message === message);
  function changeMessage(value: string) {
    setMessage(value);
    setResult(null);
    setReply("");
    setError("");
    setNotice("");
  }
  function showResult(next: BriefResult) {
    setResult(next);
    setReply(next.brief.reply);
    setNotice("Your brief is ready. Review it before using the reply.");
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (sample) {
      showResult({ brief: sample.brief, source: "sample" });
      return;
    }
    const parsed = enquirySchema.safeParse({ message });
    if (!parsed.success) {
      setError("Add an enquiry between 30 and 6,000 characters.");
      return;
    }
    if (!available) {
      setError(
        "Live AI is not connected yet. Choose a sample above to explore the complete workflow.",
      );
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(55000),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          z.object({ error: z.string() }).safeParse(data).data?.error ||
            "Could not create a brief. Please try again.",
        );
      showResult({
        brief: z.object({ brief: briefSchema }).parse(data).brief,
        source: "ai",
      });
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name !== "TimeoutError"
          ? cause.message
          : "This is taking longer than expected. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function copyReply() {
    try {
      await navigator.clipboard.writeText(reply);
      setNotice("Reply copied.");
    } catch {
      setNotice(
        "Copy was unavailable. Select the reply text and copy it manually.",
      );
    }
  }
  function download() {
    if (!result) return;
    const url = URL.createObjectURL(
      new Blob([exportBrief(result.brief, reply)], {
        type: "text/plain;charset=utf-8",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rebrief-project-brief.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Brief downloaded.");
  }
  return (
    <div className={styles.app}>
      <a href="#workspace" className={styles.skip}>
        Skip to workspace
      </a>
      <header className={styles.header}>
        <Link href="/" aria-label="reformer'S home">
          <Wordmark />
        </Link>
        <span className={styles.edition}>PRODUCT EXPERIMENT / 001</span>
        <Link href="/#products" className={styles.back}>
          All demos <ArrowUpRight size={16} />
        </Link>
      </header>
      <main id="workspace" className={styles.main}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>THE ENQUIRY ASSISTANT</p>
            <h1>
              re<span>:</span>
              <em>brief.</em>
            </h1>
          </div>
          <div className={styles.promise}>
            <h2>
              A little less back-and-forth.
              <br />
              <em>A clearer next step.</em>
            </h2>
            <p>
              One enquiry. A project brief, the right questions,
              <br className={styles.desktopBreak} /> and a reply you can make
              your own.
            </p>
          </div>
          <span className={styles.mark} aria-hidden="true">
            ↳
          </span>
        </div>
        <div className={styles.statusbar}>
          <span>
            <span className={styles.dot} />
            {available === null
              ? "Checking connection…"
              : available
                ? "GEMINI FLASH-LITE CONNECTED"
                : "INTERACTIVE SAMPLE DEMO"}
          </span>
          <span>
            {available
              ? "Custom enquiries use AI. Samples are pre-written."
              : "This public preview uses samples. Live AI requires a server."}
          </span>
        </div>
        <div className={styles.workbench}>
          <form className={styles.inputPanel} onSubmit={submit}>
            <div className={styles.panelHeading}>
              <span className={styles.step}>01 / INCOMING</span>
              <span aria-hidden="true">↘</span>
            </div>
            <h2>Start with their words.</h2>
            <p className={styles.helper}>
              Choose a sample, or paste a customer enquiry.
            </p>
            <div
              className={styles.samples}
              role="group"
              aria-label="Sample enquiries"
            >
              {samples.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant="outline"
                  className={styles.sampleButton}
                  disabled={busy}
                  aria-pressed={sample?.id === item.id}
                  onClick={() => changeMessage(item.message)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <label htmlFor="enquiry" className={styles.fieldLabel}>
              Customer enquiry
            </label>
            <textarea
              id="enquiry"
              value={message}
              onChange={(event) => changeMessage(event.target.value)}
              disabled={busy}
              maxLength={MAX_ENQUIRY_LENGTH}
              placeholder="Hi, we’re looking for help with…"
              className={styles.enquiry}
              aria-describedby="enquiry-note"
            />
            <div className={styles.inputFooter}>
              <span>
                {sample ? "Fictional sample enquiry" : "Your enquiry"}
              </span>
              <span>{message.length.toLocaleString()} / 6,000</span>
            </div>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className={styles.primaryButton}
              disabled={
                busy || !message.trim() || (!sample && available === null)
              }
            >
              {busy
                ? "Finding the clear next step…"
                : sample
                  ? "Explore sample brief"
                  : "Create project brief"}
              <MoveRight size={20} aria-hidden="true" />
            </Button>
            <p id="enquiry-note" className={styles.privacy}>
              {sample
                ? "Sample results are pre-written and stay in this browser."
                : available
                  ? "Submitting sends this enquiry to Google Gemini. Free-tier content may be used to improve Google products. Use fictional or non-sensitive enquiries; the app does not save them."
                  : "You can draft here. Custom enquiry analysis needs the live AI connection."}{" "}
              No email is sent.
            </p>
            <Button
              type="button"
              variant="ghost"
              className={styles.resetButton}
              disabled={busy}
              onClick={() => changeMessage("")}
            >
              <RotateCcw size={14} /> Clear workspace
            </Button>
          </form>
          <section
            className={styles.outputPanel}
            aria-label="Project brief"
            aria-busy={busy}
          >
            <div className={styles.panelHeading}>
              <span className={styles.step}>02 / A LITTLE CLARITY</span>
              <span aria-hidden="true">✳</span>
            </div>
            {result ? (
              <>
                <div className={styles.resultHeader}>
                  <span className={styles.badge}>
                    {result.source === "sample"
                      ? "PRE-WRITTEN SAMPLE"
                      : "AI-GENERATED · REVIEW BEFORE USE"}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    className={styles.actionButton}
                    onClick={download}
                  >
                    <Download size={15} /> Download
                  </Button>
                </div>
                <h2 className={styles.resultTitle}>{result.brief.title}</h2>
                <p className={styles.summary}>{result.brief.summary}</p>
                <div className={styles.tags}>
                  {result.brief.services.map((service) => (
                    <span key={service}>{service}</span>
                  ))}
                </div>
                <dl className={styles.facts}>
                  <div>
                    <dt>Budget</dt>
                    <dd>{result.brief.budget}</dd>
                  </div>
                  <div>
                    <dt>Timing</dt>
                    <dd>{result.brief.timeline}</dd>
                  </div>
                </dl>
                <h3 className={styles.sectionTitle}>The shape of the work</h3>
                <ul className={styles.deliverables}>
                  {result.brief.deliverables.map((item) => (
                    <li key={item}>
                      <Check size={15} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className={styles.questions}>
                  <h3>
                    Before we begin<span aria-hidden="true">?</span>
                  </h3>
                  <ol>
                    {result.brief.questions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </div>
                <div className={styles.replyHeading}>
                  <label htmlFor="reply">Your reply, with a head start.</label>
                  <Button
                    type="button"
                    variant="ghost"
                    className={styles.actionButton}
                    onClick={copyReply}
                  >
                    <Copy size={15} /> Copy
                  </Button>
                </div>
                <textarea
                  id="reply"
                  className={styles.reply}
                  value={reply}
                  onChange={(event) => {
                    setReply(event.target.value);
                    setNotice("");
                  }}
                  aria-describedby="reply-note"
                />
                <p id="reply-note" className={styles.helper}>
                  Editable draft. Review the details and tone before sending.
                </p>
              </>
            ) : (
              <div className={styles.empty}>
                <div className={styles.paperStack} aria-hidden="true">
                  <span>“what if…”</span>
                  <ArrowDown size={22} />
                  <strong>a clear brief.</strong>
                </div>
                <h2>
                  {busy
                    ? "Making sense of the message."
                    : "The next step starts here."}
                </h2>
                <p>
                  {busy
                    ? "Your brief, questions, and draft reply are on their way."
                    : "Turn a loose enquiry into something you can act on. Choose a sample to see the full flow."}
                </p>
                <div className={styles.outputList}>
                  <span>
                    <Check size={14} /> Project brief
                  </span>
                  <span>
                    <Check size={14} /> Follow-up questions
                  </span>
                  <span>
                    <Check size={14} /> Editable reply
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>
        <p role="status" className={styles.notice}>
          {notice}
        </p>
      </main>
      {!staticDeployment && (
        <Chatbot
          context={[
            "Enquiry:",
            message,
            result
              ? exportBrief(result.brief, reply)
              : "No brief generated yet.",
          ].join("\n\n")}
        />
      )}
      <footer className={styles.footer}>
        <span>
          <Sparkles size={15} /> A small product. A better starting point.
        </span>
        <span>Built by reformer&apos;S · re:brief / 01</span>
      </footer>
    </div>
  );
}
