"use client";

import { cx } from "@/components/chrome-styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties, type ReactNode } from "react";
import { TextGlitch } from "@/components/motion";
import { CookieSettingsButton } from "@/components/tracking/cookie-settings";
import { ui } from "@/content/ui";
import { footerColumns, socialLinks } from "@/lib/routes";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function FooterLink({
  href,
  label,
  current,
  badge,
}: {
  href: string;
  label: string;
  current: boolean;
  badge?: ReactNode;
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
      {badge}
    </Link>
  );
}

/** Renders nothing where the consent banner cannot appear. */
function CookieSettingsItem() {
  const button = CookieSettingsButton({ className: cx("footer-cookie-settings") });
  return button ? <li>{button}</li> : null;
}

function HiringMark() {
  return (
    <span className={cx("hiring-badge")}>
      {ui.footer.hiringBadge}
      <span className={cx("shimmer-text-glow")} aria-hidden="true">
        {ui.footer.hiringBadge}
      </span>
    </span>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const home = pathname === "/";

  return (
    <footer className={cx("site-footer")}>
      <div className={cx("footer-inner")}>
        <div className={cx("footer-top")}>
          <Link
            href="/"
            className={cx("footer-logo")}
            aria-label={ui.footer.logoAria}
            aria-current={home ? "page" : undefined}
            data-framer-page-link-current={home ? "true" : undefined}
          >
            <img src="/brand/logo.svg" alt="" width={100.31} height={24} />
          </Link>
          <div className={cx("footer-columns")}>
            {footerColumns.map((column) => (
              <div className={cx("footer-column")} key={column.title}>
                <p className={cx("footer-title")}>{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <FooterLink
                        href={link.href}
                        label={link.label}
                        current={isCurrent(pathname, link.href)}
                        badge={"badge" in link ? <HiringMark /> : undefined}
                      />
                    </li>
                  ))}
                  {column.title === "Legal" || column.title === ui.footer.legalColumnTitle ? (
                    <CookieSettingsItem />
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className={cx("footer-bottom")}>
          <p className={cx("copyright")}>
            {ui.footer.copyrightLine1}
            {ui.footer.copyrightLine2 ? (
              <>
                <br />
                {ui.footer.copyrightLine2}
              </>
            ) : null}
          </p>
          <ul className={cx("socials")}>
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <span
                    className={cx("social-icon")}
                    style={{ "--icon": `url(/icons/${link.icon}.svg)` } as CSSProperties}
                    aria-hidden="true"
                  />
                  <span className="sr-only">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
