"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, Copy } from "./icons";

/** How long "Copied" stays before the button shows the address again. */
const copiedFor = 4000;

/**
 * The hero Contact button. The first click opens it into the email address with a copy icon; the
 * next click copies the address and shows a check with "Copied", then returns to the address.
 *
 * Opening animates the pill's width. The button sits in a slot that takes the open width at once,
 * so the row reflows a single time on the click (on a phone the open button drops to its own line)
 * and the button then glides from where it was to where it lands while it widens.
 */
export function ContactButton({ email }: { email: string }) {
  const [state, setState] = useState<"closed" | "open" | "copied">("closed");
  const [copies, setCopies] = useState(0);
  const slot = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const address = useRef<HTMLSpanElement>(null);
  const closedRect = useRef<DOMRect | null>(null);

  useLayoutEffect(() => {
    const el = button.current;
    const from = closedRect.current;
    if (state !== "open" || !el || !slot.current || !from) return;
    closedRect.current = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const to = el.getBoundingClientRect();
    const holder = slot.current;
    holder.style.width = `${to.width}px`;

    el.style.transition = "none";
    el.style.width = `${from.width}px`;
    el.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px)`;
    el.getBoundingClientRect();
    el.style.transition = "width 450ms var(--ease-out-expo), transform 450ms var(--ease-out-expo)";
    el.style.width = `${to.width}px`;
    el.style.transform = "";
    const done = () => {
      el.style.transition = "";
      el.style.width = "";
      holder.style.width = "";
    };
    el.addEventListener("transitionend", done, { once: true });
    return () => el.removeEventListener("transitionend", done);
  }, [state]);

  useEffect(() => {
    if (copies === 0) return;
    const timer = setTimeout(() => setState("open"), copiedFor);
    return () => clearTimeout(timer);
  }, [copies]);

  async function onClick() {
    if (state === "closed") {
      closedRect.current = button.current?.getBoundingClientRect() ?? null;
      setState("open");
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
      setCopies((count) => count + 1);
    } catch {
      // Clipboard can be blocked (permissions, insecure context). Select the text so a manual copy is one keystroke.
      const selection = window.getSelection();
      if (state === "open" && selection && address.current) {
        selection.selectAllChildren(address.current);
      }
    }
  }

  return (
    <span ref={slot} className="inline-flex">
      <button
        ref={button}
        type="button"
        onClick={onClick}
        aria-label={state === "closed" ? undefined : `Copy email address ${email}`}
        className="group inline-flex h-11 shrink-0 items-center overflow-hidden whitespace-nowrap rounded-full border border-line-strong px-5 font-medium text-[0.9375rem] text-fg transition-colors duration-fast hover:border-muted hover:bg-raised"
      >
        {state === "closed" ? (
          "Contact"
        ) : (
          // Both faces share one grid cell, so "Copied" sits centered in the width the address set.
          <span className="grid">
            <span
              className={`col-start-1 row-start-1 inline-flex items-center gap-2 ${
                state === "open" ? "animate-reveal" : "invisible"
              }`}
            >
              <Copy className="size-4 text-muted transition-colors duration-fast group-hover:text-fg" />
              <span ref={address} className="select-text">
                {email}
              </span>
            </span>
            {state === "copied" ? (
              <span className="col-start-1 row-start-1 inline-flex animate-reveal items-center justify-center gap-2">
                <Check className="size-4 text-accent" />
                Copied
              </span>
            ) : null}
          </span>
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Email address copied" : ""}
      </span>
    </span>
  );
}
