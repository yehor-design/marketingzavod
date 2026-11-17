"use client";

import { cx } from "@/components/chrome-styles";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Announcement } from "@/components/announcement";
import { TravelingDashes } from "@/components/motion/traveling-dashes";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

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
        <Announcement />
        <main className={flush ? cx("site-main") + " p-0! min-[810px]:p-0! min-[1200px]:px-0!" : cx("site-main")}>{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
