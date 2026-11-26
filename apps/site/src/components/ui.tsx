import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

/** Mono label like `01 / Projects` that names a section. */
export function SectionLabel({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-label text-subtle uppercase">
      {index ? (
        <>
          <span className="text-muted">{index}</span>
          <span aria-hidden="true">/</span>
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}

/** Small mono status tag. `accent` adds a live dot. */
export function Tag({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-tag uppercase ${
        accent ? "border-accent/30 text-accent" : "border-line-strong text-muted"
      }`}
    >
      {accent ? <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" /> : null}
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
export function PageHeader({
  label,
  title,
  children,
}: {
  label: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-line border-b px-6 pt-20 pb-12 sm:px-10 sm:pt-28 sm:pb-16">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-6 font-semibold text-title text-fg">{title}</h1>
        {children ? (
          <div className="mt-6 max-w-reading text-lead text-muted">{children}</div>
        ) : null}
      </div>
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
