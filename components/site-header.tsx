"use client";

import { cx } from "@/components/chrome-styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TextGlitch } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { CtaLink } from "@/components/ui/button";
import { ui } from "@/content/ui";
import { navLinks } from "@/lib/routes";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItem({
  href,
  label,
  current,
  badge,
}: {
  href: string;
  label: string;
  current: boolean;
  badge?: string;
}) {
  const [hot, setHot] = useState(false);

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      data-framer-page-link-current={current ? "true" : undefined}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <TextGlitch active={hot}>{label}</TextGlitch>
      {badge ? (
        <Badge variant="secondary" className={cx("count-badge")}>
          {badge}
        </Badge>
      ) : null}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const home = pathname === "/";

  function closeSoon() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 50);
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1200px)");
    const onChange = () => {
      if (desktop.matches) {
        setOpen(false);
      }
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1200px)");
    if (!open || desktop.matches) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const inertTargets = document.querySelectorAll(".site-body, .site-footer");
    inertTargets.forEach((node) => node.setAttribute("inert", ""));
    return () => {
      document.body.style.overflow = previous;
      inertTargets.forEach((node) => node.removeAttribute("inert"));
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSoon();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={open ? cx("site-header", "is-open") : cx("site-header")}>
      <div className={cx("header-bar")}>
        <div className={cx("header-inner")}>
          <Link
            href="/"
            className={cx("logo")}
            aria-current={home ? "page" : undefined}
            data-framer-page-link-current={home ? "true" : undefined}
            onClick={() => {
              if (open) {
                closeSoon();
              }
            }}
          >
            <img
              src="/brand/logo.svg"
              alt={ui.header.logoAlt}
              width={100.31}
              height={24}
            />
          </Link>
          <nav className={cx("desktop-nav")} aria-label={ui.header.primaryNavAria}>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavItem
                    href={link.href}
                    label={link.label}
                    current={isCurrent(pathname, link.href)}
                    badge={"badge" in link ? link.badge : undefined}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <div className={cx("desktop-actions")}>
            <CtaLink
              href={ui.header.secondaryCtaHref}
              text={ui.header.secondaryCtaText}
              variant="secondary"
              location="header"
            />
            <CtaLink
              href={ui.header.primaryCtaHref}
              text={ui.header.primaryCtaText}
              location="header"
            />
          </div>
          <button
            type="button"
            className={cx("menu-toggle")}
            aria-label={open ? ui.header.closeMenuAria : ui.header.openMenuAria}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              if (open) {
                closeSoon();
              } else {
                if (closeTimer.current !== null) {
                  window.clearTimeout(closeTimer.current);
                  closeTimer.current = null;
                }
                setOpen(true);
              }
            }}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      {open ? (
        <div id="mobile-menu" className={cx("mobile-panel")}>
          <nav aria-label={ui.header.primaryNavAria}>
            <ul className={cx("mobile-links")}>
              {navLinks.map((link) => {
                const current = isCurrent(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      data-framer-page-link-current={current ? "true" : undefined}
                      onClick={closeSoon}
                    >
                      {link.label}
                      {"badge" in link ? (
                        <Badge variant="secondary" className={cx("count-badge")}>
                          {link.badge}
                        </Badge>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <CtaLink
            href={ui.header.primaryCtaHref}
            text={ui.header.primaryCtaText}
            location="mobile_menu"
            onClick={closeSoon}
          />
        </div>
      ) : null}
    </header>
  );
}
