// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ANNOUNCEMENT_DISMISSED_KEY,
  AnnouncementBar,
} from "@/components/blocks/announcement-bar";
import { bgUi } from "@/content/bg/ui";

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
  window.localStorage.clear();
  delete document.documentElement.dataset.announcementDismissed;
});

beforeEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
  delete document.documentElement.dataset.announcementDismissed;
});

describe("AnnouncementBar (DS-21, DS-23, GL-01..GL-04)", () => {
  it("renders global dismissible variant with verbatim link, cta_location=announcement, and dismiss button without arrow icon", () => {
    const { container } = render(
      <AnnouncementBar
        variant="global"
        text={bgUi.announcement.text}
        href={bgUi.announcement.href}
        closeAria={bgUi.announcement.closeAria}
      />,
    );

    const link = screen.getByRole("link", { name: bgUi.announcement.text });
    expect(link.getAttribute("href")).toBe("/proverka-na-akaunti");
    expect(link.getAttribute("data-track")).toBe("cta_click");
    expect(link.getAttribute("data-track-cta-location")).toBe("announcement");

    const closeButton = screen.getByRole("button", { name: bgUi.announcement.closeAria });
    expect(closeButton).toBeTruthy();
    // Only the close icon SVG is rendered (no duplicate arrow icon inside link)
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(link.querySelector("svg")).toBeNull();
  });

  it("persists dismissal only in sessionStorage (never localStorage) and marks html before unmount", () => {
    render(
      <AnnouncementBar
        variant="global"
        text={bgUi.announcement.text}
        href={bgUi.announcement.href}
        closeAria={bgUi.announcement.closeAria}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: bgUi.announcement.closeAria }));

    expect(screen.queryByRole("link", { name: bgUi.announcement.text })).toBeNull();
    expect(window.sessionStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY)).toBe("1");
    expect(window.localStorage.length).toBe(0);
    expect(document.documentElement.dataset.announcementDismissed).toBe("true");
  });

  it("preserves inline Jet announcement structure with arrow icon and no close button", () => {
    const { container } = render(
      <AnnouncementBar variant="inline" text="Introducing Jet 2.0" href="/updates" />,
    );

    expect(screen.getByRole("link", { name: "Introducing Jet 2.0" }).getAttribute("href")).toBe(
      "/updates",
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector(".announcement-icon svg")).not.toBeNull();
  });
});
