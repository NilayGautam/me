"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/site";

const experience = { href: "/experience", label: "Experience" } as const;
const essays = { href: "/essays", label: "Essays" } as const;

/** `showEssays` stays false until a real essay is published, so visitors never land on an empty list. */
export function Header({ showEssays }: { showEssays: boolean }) {
  const pathname = usePathname();
  const nav = showEssays ? [experience, essays] : [experience];

  return (
    <header className="sticky top-0 z-40 border-line border-b bg-bg/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 sm:px-10">
        <Link href="/" className="font-medium text-fg tracking-tight">
          {pathname === "/" ? "Home" : site.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-6 sm:gap-8">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm transition-colors duration-fast ${
                      active ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
