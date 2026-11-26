import { cx } from "@/components/chrome-styles";
import { ui } from "@/content/ui";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <g
        transform="translate(8 8)"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 8 L7.784 0" />
        <path d="M1.773 0 H8 V6.4" />
      </g>
    </svg>
  );
}

export function Announcement() {
  return (
    <div className={cx("announcement-wrap")}>
      <Link className={cx("announcement")} href={ui.announcement.href}>
        <span className={cx("shimmer-text")}>
          {ui.announcement.text}
          <span className={cx("shimmer-text-glow")} aria-hidden="true">
            {ui.announcement.text}
          </span>
        </span>
        <span className={cx("announcement-icon")}>
          <ArrowIcon />
        </span>
      </Link>
    </div>
  );
}
