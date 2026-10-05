"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, RotateCcw } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { ChatMessage } from "./chat-schema";
import styles from "./chatbot.module.css";

export function Chatbot({ context }: { context: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [includeContext, setIncludeContext] = useState(true);
  const controller = useRef<AbortController | null>(null);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, busy, open]);
  const full = messages.length >= 20;
  async function send(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || busy || full) return;
    const next: ChatMessage[] = [
      ...messages,
      { role: "user", text: draft.trim() },
    ];
    setBusy(true);
    setError("");
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 55000);
    try {
      const response = await fetch("/api/brief/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          context: includeContext ? context.slice(0, 16000) : "",
        }),
        signal: abort.signal,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          z.object({ error: z.string() }).safeParse(data).data?.error ??
            "Could not reply. Please try again.",
        );
      const { text } = z.object({ text: z.string().min(1) }).parse(data);
      setMessages([...next, { role: "assistant", text }]);
      setDraft("");
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name !== "AbortError"
          ? cause.message
          : "The reply took too long. Please try again.",
      );
    } finally {
      clearTimeout(timeout);
      setBusy(false);
      controller.current = null;
    }
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className={styles.launcher}>
          <MessageCircle size={19} /> Ask re:brief
        </Button>
      </SheetTrigger>
      <SheetContent className={styles.panel}>
        <SheetHeader className={styles.header}>
          <span className={styles.kicker}>A LITTLE HELP, RIGHT HERE.</span>
          <SheetTitle className={styles.title}>
            Let’s <em>talk it through.</em>
          </SheetTitle>
          <SheetDescription>
            Clarify your project, find the missing details, or refine a reply.
          </SheetDescription>
        </SheetHeader>
        <div
          ref={log}
          className={styles.messages}
          role="log"
          aria-label="Chat conversation"
          aria-live="polite"
        >
          {messages.length === 0 && (
            <div className={styles.welcome}>
              <span aria-hidden="true">✳</span>
              <p>Hi, I’m re:brief. What would make your next step clearer?</p>
              <div className={styles.suggestions}>
                {[
                  "What should I ask this customer?",
                  "Help me define a smaller first version",
                  "Make my reply warmer and shorter",
                ].map((text) => (
                  <Button
                    key={text}
                    variant="outline"
                    disabled={busy}
                    onClick={() => setDraft(text)}
                  >
                    {text}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={styles.message}
              data-role={message.role}
            >
              <span>{message.role === "user" ? "YOU" : "RE:BRIEF · AI"}</span>
              <p>{message.text}</p>
            </div>
          ))}
          {busy && (
            <div className={styles.message} data-role="user">
              <span>YOU · WAITING FOR REPLY</span>
              <p>{draft}</p>
            </div>
          )}
        </div>
        <form className={styles.composer} onSubmit={send}>
          <label className={styles.context}>
            <input
              type="checkbox"
              checked={includeContext}
              disabled={busy}
              onChange={(event) => setIncludeContext(event.target.checked)}
            />
            Include current enquiry, brief and reply
          </label>
          <p className={styles.privacy}>
            Messages and included context go to Google Gemini. Free-tier content
            may improve Google products. Use non-sensitive examples. Chat clears
            on page reload.
          </p>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          <p role="status" className={styles.status}>
            {busy
              ? "re:brief is thinking…"
              : full
                ? "Conversation complete. Start a new chat to continue."
                : ""}
          </p>
          <label htmlFor="chat-message" className="sr-only">
            Your message
          </label>
          <textarea
            id="chat-message"
            value={draft}
            disabled={busy || full}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={6000}
            placeholder="What’s on your mind?"
            rows={3}
          />
          <div className={styles.actions}>
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setMessages([]);
                setDraft("");
                setError("");
              }}
            >
              <RotateCcw size={15} /> New chat
            </Button>
            <Button
              type="submit"
              disabled={busy || full || !draft.trim()}
              className={styles.send}
            >
              {busy ? "Thinking…" : "Send"}
              <Send size={15} />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
