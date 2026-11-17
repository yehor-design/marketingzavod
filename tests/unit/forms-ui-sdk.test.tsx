/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { afterEach, expect, test } from "vitest";
import { ApplyForm } from "@/components/careers/apply-form";
import { ContactPage } from "@/components/contact/contact-page";
import { WaitlistPage } from "@/components/waitlist/waitlist-page";

declare global {
  var __UI_SDK_STRICT__: boolean | undefined;
}

globalThis.__UI_SDK_STRICT__ = true;

HTMLElement.prototype.showPopover = function () {};
HTMLElement.prototype.hidePopover = function () {};
Element.prototype.getAnimations = () => [];
Element.prototype.scrollIntoView = function () {};
Element.prototype.checkVisibility = () => true;
Element.prototype.getClientRects = () => [] as unknown as DOMRectList;
document.elementFromPoint = () => null;
document.elementsFromPoint = () => [];
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

afterEach(cleanup);

const agent = createAgent();

function namedLabels() {
  return agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more")
    .map((entry) => entry.label);
}

test("an agent can find and fill the contact form", async () => {
  render(<ContactPage />);

  const labels = namedLabels();
  for (const label of ["Full name", "Email", "Reason for contact", "How can we help?", "Get in touch"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const reason = agent.snapshot().find((entry) => entry.label === "Reason for contact");
  const choice = reason?.items?.find((item) => item.label === "General")?.value ?? "General";
  const result = await agent.act({
    steps: [
      { ref: "Full name", action: "setValue", args: ["Ada Lovelace"] },
      { ref: "Email", action: "setValue", args: ["ada@example.com"] },
      { ref: "Reason for contact", action: "setValue", args: [choice] },
      { ref: "How can we help?", action: "setValue", args: ["Need a faster site."] },
    ],
  });

  expect(result.ok, result.error?.message).toBe(true);
  expect(screen.getByLabelText<HTMLInputElement>("Full name").value).toBe("Ada Lovelace");
  expect(screen.getByLabelText<HTMLInputElement>("Email").value).toBe("ada@example.com");
  expect(screen.getByLabelText<HTMLTextAreaElement>("How can we help?").value).toBe("Need a faster site.");
});

test("an empty contact form reports the same native fields", () => {
  render(<ContactPage />);
  const form = document.querySelector("form");
  expect(form).toBeTruthy();
  const seen: string[] = [];
  form!.addEventListener(
    "invalid",
    (event) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        seen.push(target.name);
      } else {
        seen.push(`other:${(target as Element).tagName}`);
      }
    },
    true,
  );
  form!.requestSubmit();
  expect(seen).toEqual(["Full name", "Email", "Inquiry type", "Message"]);
});

test("an agent can find the waitlist email field", async () => {
  render(<WaitlistPage />);
  const labels = namedLabels();
  for (const label of ["Email", "Join now"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }
  const result = await agent.act({
    steps: [{ ref: "Email", action: "setValue", args: ["ada@example.com"] }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(screen.getByLabelText<HTMLInputElement>("Email").value).toBe("ada@example.com");
});

test("an agent can find the careers application fields", async () => {
  render(<ApplyForm title="Design Engineer" slug="design-engineer" />);
  const labels = namedLabels();
  for (const label of [
    "Full name",
    "Email",
    "Website/Portfolio (URL)",
    "Why do you want to join?",
    "Tell us about your relevant experience",
    "Tell us about the work you’re most proud of",
    "Apply for Design Engineer",
  ]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }
});
