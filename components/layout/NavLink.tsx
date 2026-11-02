"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Paw } from "@/components/ui/Paw";

/** Active when on the page itself or any page below it ("/" only matches itself). */
export function isActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, label, className, onNavigate }: { href: string; label: string; className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = isActive(href, pathname);
  return (
    <Link href={href} aria-current={active ? "page" : undefined} data-active={active} className={className} onNavigate={onNavigate}>
      <span>{label}</span>
      <Paw className="tp-nav-link__paw" />
    </Link>
  );
}
