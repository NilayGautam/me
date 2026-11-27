import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

/** Visible section heading. The heading carries the section; no labels or numbers above it. */
export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-bold font-display text-3xl text-fg tracking-tight">
      {children}
    </h2>
  );
}

/**
 * Status set as a line of data beside the dates, not as a chip: small tracked caps with no container.
 * `accent` marks a live status with a small square in the accent color.
 */
export function Tag({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-medium text-tag uppercase ${
        accent ? "text-accent" : "text-subtle"
      }`}
    >
      {accent ? <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" /> : null}
      {children}
    </span>
  );
}

const buttonBase =
  "group inline-flex h-11 items-center gap-2 rounded-full px-5 font-medium text-[0.9375rem] transition-colors duration-fast";
const buttonVariants = {
  primary: "bg-fg text-bg hover:bg-white",
  secondary: "border border-line-strong text-fg hover:border-muted hover:bg-raised",
} as const;

type ButtonProps = {
  children: ReactNode;
  variant?: keyof typeof buttonVariants;
  arrow?: boolean;
};

function ButtonContent({ children, arrow }: { children: ReactNode; arrow: boolean }) {
  return (
    <>
      {children}
      {arrow ? (
        <ArrowRight className="size-4 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5" />
      ) : null}
    </>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = false,
}: ButtonProps & { href: Route }) {
  return (
    <Link href={href} className={`${buttonBase} ${buttonVariants[variant]}`}>
      <ButtonContent arrow={arrow}>{children}</ButtonContent>
    </Link>
  );
}

export function ButtonAnchor({
  href,
  children,
  variant = "primary",
  arrow = false,
}: ButtonProps & { href: string }) {
  return (
    <a href={href} className={`${buttonBase} ${buttonVariants[variant]}`}>
      <ButtonContent arrow={arrow}>{children}</ButtonContent>
    </a>
  );
}

/** Title block at the top of every inner page. */
export function PageHeader({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <header className="border-line border-b px-6 pt-20 pb-12 sm:px-10 sm:pt-28 sm:pb-16">
      <h1 className="font-bold font-display text-title text-fg">{title}</h1>
      {children ? <div className="mt-6 max-w-reading text-lead text-muted">{children}</div> : null}
    </header>
  );
}

/** Padded section with a top rule, the basic unit of every page. */
export function Section({
  children,
  className = "",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`px-6 py-16 sm:px-10 sm:py-24 ${className}`}
    >
      {children}
    </section>
  );
}
