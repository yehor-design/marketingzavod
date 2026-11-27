"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Announcement } from "@/components/announcement";
import { AnnouncementBar } from "@/components/blocks/announcement-bar";
import { cx } from "@/components/chrome-styles";
import { TravelingDashes } from "@/components/motion/traveling-dashes";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isBg } from "@/lib/edition";

const ANNOUNCEMENT_HIDDEN_PREFIX = "/proverka-na-akaunti";

const BG_FLUSH_PATHS = new Set([
  "/smyana-na-agentsiya",
  "/onlayn-magazini",
  "/uslugi-i-b2b",
  "/hoteli",
  "/nedvizhimi-imoti",
]);

function isAnnouncementHiddenRoute(pathname: string) {
  return (
    pathname === ANNOUNCEMENT_HIDDEN_PREFIX ||
    pathname.startsWith(`${ANNOUNCEMENT_HIDDEN_PREFIX}/`)
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/checkout") {
    return <div className={cx("checkout-shell")}>{children}</div>;
  }

  const home = pathname === "/";
  const about = pathname === "/about";
  const flush =
    home ||
    about ||
    (isBg && BG_FLUSH_PATHS.has(pathname)) ||
    pathname === "/pricing" ||
    pathname === "/contact" ||
    pathname === "/waitlist" ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/careers") ||
    pathname.startsWith("/legal") ||
    pathname.startsWith("/updates");

  return (
    <div className={cx("site-shell")}>
      <TravelingDashes />
      <SiteHeader />
      <div className={cx("site-body") + (home || about ? " pt-0!" : "") + (home ? " relative" : "")}>
        {isBg ? (
          isAnnouncementHiddenRoute(pathname) ? null : (
            <AnnouncementBar variant="global" flushTop={home || about} />
          )
        ) : (
          <Announcement />
        )}
        <main className={flush ? cx("site-main") + " p-0! min-[810px]:p-0! min-[1200px]:px-0!" : cx("site-main")}>{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
