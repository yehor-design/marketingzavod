"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "@/components/chrome-styles";
import { TextGlitch } from "@/components/motion";
import { CookieSettingsButton } from "@/components/tracking/cookie-settings";
import { COMPANY } from "@/content/bg/company";
import { BG_FOOTER, getPublishedBgFooterColumns } from "@/content/bg/navigation";
import { ui } from "@/content/ui";
import { isBg } from "@/lib/edition";
import { footerColumns, socialLinks } from "@/lib/routes";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function FooterLink({
  href,
  label,
  current,
  badge,
  ctaLocation,
}: {
  href: string;
  label: string;
  current: boolean;
  badge?: ReactNode;
  ctaLocation?: string;
}) {
  const [hot, setHot] = useState(false);

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      data-framer-page-link-current={current ? "true" : undefined}
      data-track={ctaLocation ? "cta_click" : undefined}
      data-track-cta-text={ctaLocation ? label : undefined}
      data-track-cta-location={ctaLocation}
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

function FooterExternalLink({ href, label }: { href: string; label: string }) {
  const [hot, setHot] = useState(false);

  return (
    <a
      href={href}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <TextGlitch active={hot}>{label}</TextGlitch>
    </a>
  );
}

/** Renders nothing where the consent banner cannot appear. */
function CookieSettingsItem({ className }: { className: string }) {
  const button = CookieSettingsButton({ className });
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

function BgSiteFooter({ pathname }: { pathname: string }) {
  const home = pathname === "/";
  const columns = getPublishedBgFooterColumns();

  return (
    <footer className={cx("site-footer")}>
      <div className={cx("footer-inner-bg")}>
        <div className={cx("footer-top-bg")}>
          <div className={cx("footer-brand-bg")}>
            <Link
              href="/"
              className={cx("footer-logo")}
              aria-label={ui.footer.logoAria}
              aria-current={home ? "page" : undefined}
              data-framer-page-link-current={home ? "true" : undefined}
            >
              <img src="/brand/logo.svg" alt="" width={100.31} height={24} />
            </Link>
            <p className={cx("footer-tagline-bg")}>{COMPANY.tagline}</p>
          </div>
          <div className={cx("footer-columns-bg")}>
            {columns.map((column) => (
              <div className={cx("footer-column-bg")} key={column.id} data-footer-column={column.id}>
                <p className={cx("footer-title")}>{column.title}</p>
                <ul>
                  {column.items.map((item) => {
                    if (item.kind === "text") {
                      return (
                        <li key={item.text}>
                          <span className={cx("footer-text-bg")}>{item.text}</span>
                        </li>
                      );
                    }
                    if (item.kind === "email") {
                      return (
                        <li key={item.href}>
                          <FooterExternalLink href={item.href} label={item.label} />
                        </li>
                      );
                    }
                    return (
                      <li key={item.href}>
                        <FooterLink
                          href={item.href}
                          label={item.label}
                          current={isCurrent(pathname, item.href)}
                          ctaLocation={item.ctaLocation}
                        />
                      </li>
                    );
                  })}
                  {column.hasCookieSettings ? (
                    <CookieSettingsItem className={cx("footer-cookie-settings-bg")} />
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className={cx("footer-bottom-bg")}>
          <div className={cx("footer-meta-bg")}>
            <p className={cx("footer-legal-line-bg")}>{COMPANY.footerLegalLine}</p>
            <p className={cx("copyright-bg")}>{COMPANY.copyright}</p>
          </div>
          <ul className={cx("socials")}>
            {BG_FOOTER.socials.map((link) => (
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

export function SiteFooter() {
  const pathname = usePathname();
  if (isBg) {
    return <BgSiteFooter pathname={pathname} />;
  }

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
                    <CookieSettingsItem className={cx("footer-cookie-settings")} />
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
