import { site } from "@/site";
import { ArrowUpRight } from "./icons";

const links = [
  { href: `mailto:${site.email}`, label: "Email", external: false },
  { href: site.links.github, label: "GitHub", external: true },
  { href: site.links.linkedin, label: "LinkedIn", external: true },
] as const;

export function Footer() {
  return (
    <footer className="border-line border-t">
      <div className="flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p className="font-mono text-label text-subtle uppercase">
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex flex-wrap items-center gap-6 sm:gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group inline-flex items-center gap-1 font-mono text-label text-muted uppercase transition-colors duration-fast hover:text-fg"
              >
                {link.label}
                {link.external ? (
                  <ArrowUpRight className="size-3 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
