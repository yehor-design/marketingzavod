/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
Range.prototype.getBoundingClientRect = () => new DOMRect();
window.matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return false;
  },
});
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

test("contact text fields stay labeled and the reason select stays agent-readable", async () => {
  render(<ContactPage />);

  expect(namedLabels(), "Reason for contact is missing from the snapshot").toContain("Reason for contact");
  expect(screen.getByRole("button", { name: "Get in touch" })).toBeTruthy();

  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("How can we help?"), { target: { value: "Need a faster site." } });

  const reason = agent.snapshot().find((entry) => entry.label === "Reason for contact");
  const choice = reason?.items?.find((item) => item.label === "General")?.value ?? "General";
  const result = await agent.act({
    steps: [{ ref: "Reason for contact", action: "setValue", args: [choice] }],
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

test("the waitlist email field stays labeled", () => {
  render(<WaitlistPage />);
  expect(screen.getByRole("button", { name: "Join now" })).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  expect(screen.getByLabelText<HTMLInputElement>("Email").value).toBe("ada@example.com");
});

test("the careers application fields stay labeled", () => {
  render(<ApplyForm title="Design Engineer" slug="design-engineer" />);
  for (const label of [
    "Full name",
    "Email",
    "Website/Portfolio (URL)",
    "Why do you want to join?",
    "Tell us about your relevant experience",
    "Tell us about the work you’re most proud of",
  ]) {
    expect(screen.getByLabelText(label), `${label} is missing`).toBeTruthy();
  }
  expect(screen.getByRole("button", { name: "Apply for Design Engineer" })).toBeTruthy();
});
