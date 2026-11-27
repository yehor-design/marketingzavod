"use client";

import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/components/chrome-styles";
import { TextGlitch } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { CtaLink } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { BG_HEADER_NAV, getPublishedBgSolutionsLinks } from "@/content/bg/navigation";
import { ui } from "@/content/ui";
import { isBg } from "@/lib/edition";
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

function BgDesktopNavLink({
  href,
  label,
  current,
  className,
  closeOnClick,
  onNavigate,
}: {
  href: string;
  label: string;
  current: boolean;
  className: string;
  closeOnClick?: boolean;
  onNavigate?: () => void;
}) {
  const [hot, setHot] = useState(false);

  return (
    <NavigationMenuLink
      active={current}
      closeOnClick={closeOnClick}
      className={className}
      render={
        <Link
          href={href}
          aria-current={current ? "page" : undefined}
          data-framer-page-link-current={current ? "true" : undefined}
          onClick={onNavigate}
          onPointerEnter={() => setHot(true)}
          onPointerLeave={() => setHot(false)}
          onFocus={() => setHot(true)}
          onBlur={() => setHot(false)}
        />
      }
    >
      <TextGlitch active={hot}>{label}</TextGlitch>
    </NavigationMenuLink>
  );
}

function BgDesktopNav({ pathname }: { pathname: string }) {
  const [menuValue, setMenuValue] = useState<string | null>(null);
  const [solutionsHot, setSolutionsHot] = useState(false);
  const solutions = getPublishedBgSolutionsLinks();
  const isSolutionsCurrent = solutions.some((link) => isCurrent(pathname, link.href));

  useEffect(() => {
    setMenuValue(null);
  }, [pathname]);

  return (
    <NavigationMenu
      value={menuValue}
      onValueChange={setMenuValue}
      aria-label={ui.header.primaryNavAria}
      className={cx("desktop-nav-bg")}
      popupClassName={cx("desktop-nav-popup-bg")}
    >
      <NavigationMenuList className={cx("desktop-nav-list-bg")}>
        {solutions.length > 0 ? (
          <NavigationMenuItem value="solutions">
            <NavigationMenuTrigger
              className={cx("desktop-nav-trigger-bg")}
              data-framer-page-link-current={isSolutionsCurrent ? "true" : undefined}
              onPointerEnter={() => setSolutionsHot(true)}
              onPointerLeave={() => setSolutionsHot(false)}
              onFocus={() => setSolutionsHot(true)}
              onBlur={() => setSolutionsHot(false)}
            >
              <TextGlitch active={solutionsHot || menuValue === "solutions"}>
                {BG_HEADER_NAV.solutionsLabel}
              </TextGlitch>
            </NavigationMenuTrigger>
            <NavigationMenuContent className={cx("desktop-nav-content-bg")}>
              <ul className={cx("desktop-nav-dropdown-list-bg")}>
                {solutions.map((link) => (
                  <li key={link.href}>
                    <BgDesktopNavLink
                      href={link.href}
                      label={link.label}
                      current={isCurrent(pathname, link.href)}
                      className={cx("desktop-nav-dropdown-link-bg")}
                      closeOnClick
                      onNavigate={() => setMenuValue(null)}
                    />
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ) : null}
        {BG_HEADER_NAV.links.map((link) => (
          <NavigationMenuItem key={link.href}>
            <BgDesktopNavLink
              href={link.href}
              label={link.label}
              current={isCurrent(pathname, link.href)}
              className={cx("desktop-nav-link-bg")}
            />
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);
  const home = pathname === "/";
  const publishedSolutions = isBg ? getPublishedBgSolutionsLinks() : [];

  function closeSoon() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setSolutionsOpen(false);
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
    setSolutionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1200px)");
    const onChange = () => {
      if (desktop.matches) {
        setOpen(false);
        setSolutionsOpen(false);
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
        menuToggleRef.current?.focus();
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
          {isBg ? (
            <BgDesktopNav pathname={pathname} />
          ) : (
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
          )}
          <div className={cx("desktop-actions")}>
            {isBg ? (
              <CtaLink
                href={BG_HEADER_NAV.primaryCta.href}
                text={BG_HEADER_NAV.primaryCta.label}
                location="header"
              />
            ) : (
              <>
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
              </>
            )}
          </div>
          <button
            ref={menuToggleRef}
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
            {isBg ? (
              <ul className={cx("mobile-links")}>
                {publishedSolutions.length > 0 ? (
                  <li>
                    <Collapsible open={solutionsOpen} onOpenChange={setSolutionsOpen}>
                      <CollapsibleTrigger className={cx("mobile-solutions-trigger-bg")}>
                        <span>{BG_HEADER_NAV.solutionsLabel}</span>
                        <ChevronDownIcon
                          className="size-[18px] text-muted-foreground transition-transform duration-200 motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className={cx("mobile-solutions-list-bg")}>
                          {publishedSolutions.map((link) => {
                            const current = isCurrent(pathname, link.href);
                            return (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className={cx("mobile-solutions-link-bg")}
                                  aria-current={current ? "page" : undefined}
                                  data-framer-page-link-current={current ? "true" : undefined}
                                  onClick={closeSoon}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  </li>
                ) : null}
                {BG_HEADER_NAV.links.map((link) => {
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
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
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
            )}
          </nav>
          <CtaLink
            href={isBg ? BG_HEADER_NAV.primaryCta.href : ui.header.primaryCtaHref}
            text={isBg ? BG_HEADER_NAV.primaryCta.label : ui.header.primaryCtaText}
            location="mobile_menu"
            onClick={closeSoon}
          />
        </div>
      ) : null}
    </header>
  );
}
