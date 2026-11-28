import { site } from "@/site";
import { CopyEmail } from "./copy-email";
import { ArrowUpRight } from "./icons";

const links = [
  { href: site.links.github, label: "GitHub" },
  { href: site.links.linkedin, label: "LinkedIn" },
] as const;

export function Footer() {
  return (
    <footer className="border-line border-t">
      <div className="flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p id="contact" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="text-subtle">Contact:</span>
          <CopyEmail email={site.email} />
        </p>
        <ul className="flex flex-wrap items-center gap-6 sm:gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group -my-3 inline-flex items-center gap-1 py-3 text-muted text-sm transition-colors duration-fast hover:text-fg"
              >
                {link.label}
                <ArrowUpRight className="size-3 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
