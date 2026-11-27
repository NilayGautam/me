"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "./icons";

/** The email as text that copies itself on click. No mailto: the address stays visible and selectable. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (permissions, insecure context). Select the text so a manual copy is one keystroke.
      const selection = window.getSelection();
      const node = document.getElementById("contact-email");
      if (selection && node) selection.selectAllChildren(node);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy email address ${email}`}
      className="group inline-flex select-text items-center gap-2 text-fg transition-colors duration-fast hover:text-white"
    >
      <span
        id="contact-email"
        className="underline decoration-line-strong underline-offset-4 transition-colors duration-fast group-hover:decoration-accent"
      >
        {email}
      </span>
      {copied ? (
        <Check className="size-3.5 text-accent" />
      ) : (
        <Copy className="size-3.5 text-muted transition-colors duration-fast group-hover:text-fg" />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
      <span
        aria-hidden="true"
        className={`text-accent text-sm transition-opacity duration-fast ${copied ? "opacity-100" : "opacity-0"}`}
      >
        Copied
      </span>
    </button>
  );
}
