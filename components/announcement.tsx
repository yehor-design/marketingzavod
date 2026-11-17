import { cx } from "@/components/chrome-styles";
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
      <Link className={cx("announcement")} href="/updates/june-jetstream-update">
        <span className={cx("shimmer-text")}>
          NEW: 2025 JUNE UPDATE
          <span className={cx("shimmer-text-glow")} aria-hidden="true">
            NEW: 2025 JUNE UPDATE
          </span>
        </span>
        <span className={cx("announcement-icon")}>
          <ArrowIcon />
        </span>
      </Link>
    </div>
  );
}
