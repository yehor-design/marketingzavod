import { expect, test } from "@playwright/test";
import { dataLayer, events, freezeNavigation, prepare, UUID } from "./helpers";

test.beforeEach(async ({ page }) => {
  await prepare(page);
});

test("home: one page_view per route, CTA, FAQ and outbound clicks", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  const [view] = await events(page, "page_view");
  expect(view).toMatchObject({ page_path: "/", page_title: "Jet – Lightning-Fast Website Optimization" });
  expect(view.page_location).toContain("http://localhost");
  expect(view.event_id).toBeTruthy();

  // FAQ: opening reports once, closing reports nothing.
  const question = page.locator('[data-track="faq_open"]').first();
  await question.scrollIntoViewIfNeeded();
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "false");
  const faq = await events(page, "faq_open");
  expect(faq).toHaveLength(1);
  expect(faq[0].question).toBe(await question.locator("span").first().innerText());

  // Outbound: a social link in the footer.
  await freezeNavigation(page);
  await page.locator(".socials a").first().click();
  expect(await events(page, "outbound_click")).toEqual([
    expect.objectContaining({ link_domain: "facebook.com", link_url: "https://facebook.com/" }),
  ]);

  // CTA in the hero, then the route change it causes.
  await page.reload();
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);
  await page.locator('main [data-track-cta-location="hero"]', { hasText: "Join" }).first().click();
  await expect(page).toHaveURL(/\/waitlist$/);
  expect(await events(page, "cta_click")).toEqual([
    expect.objectContaining({ cta_text: "Join waitlist", cta_location: "hero", destination: "/waitlist" }),
  ]);
  await expect.poll(() => events(page, "page_view")).toHaveLength(2);
  const views = await events(page, "page_view");
  expect(views[1]).toMatchObject({ page_path: "/waitlist", page_title: "Waitlist – Jet" });
  expect(views[1].event_id).not.toBe(views[0].event_id);
});

test("pricing: view_pricing on open and on a billing switch, plan CTA", async ({ page }) => {
  await page.goto("/pricing");
  await expect.poll(() => events(page, "view_pricing")).toHaveLength(1);
  expect((await events(page, "view_pricing"))[0]).toMatchObject({ billing_period: "yearly" });
  expect(await events(page, "page_view")).toHaveLength(1);

  // Yearly is already selected, so pressing it again is not a new view.
  await page.getByRole("button", { name: /Yearly/ }).click();
  await page.getByRole("button", { name: "Monthly" }).click();
  await page.getByRole("button", { name: "Monthly" }).click();
  const pricing = await events(page, "view_pricing");
  expect(pricing.map((entry) => entry.billing_period)).toEqual(["yearly", "monthly"]);

  await page.locator('[data-track-cta-location="pricing_card_pro"]').click();
  await expect(page).toHaveURL(/\/checkout$/);
  expect(await events(page, "cta_click")).toEqual([
    expect.objectContaining({ cta_text: "Get started", cta_location: "pricing_card_pro", destination: "/checkout" }),
  ]);
  await expect.poll(() => events(page, "begin_checkout")).toHaveLength(1);
  expect((await events(page, "begin_checkout"))[0]).toMatchObject({ plan: "once", value: 149, currency: "USD" });
  expect(await events(page, "page_view")).toHaveLength(2);
});

test("contact: form_start, form_error, generate_lead and no personal data", async ({ page }) => {
  await page.goto("/contact");
  await expect.poll(() => events(page, "page_view")).toHaveLength(1);

  await page.getByLabel("Full name").focus();
  await page.getByLabel("Email").focus();
  expect(await events(page, "form_start")).toEqual([expect.objectContaining({ form_name: "contact" })]);

  // An empty submit stops in the browser and reports each invalid field.
  await page.getByRole("button", { name: "Get in touch" }).click();
  const errors = await events(page, "form_error");
  expect(errors.map((entry) => entry.field)).toEqual(["full_name", "email", "inquiry_type", "message"]);
  expect(await events(page, "generate_lead")).toHaveLength(0);

  await page.getByLabel("Full name").fill("Quality Tester");
  await page.getByLabel("Email").fill("qa.tester@example.com");
  await page.getByLabel("Reason for contact").selectOption("sales");
  await page.getByLabel("How can we help?").fill("A private message that must not leak.");
  await page.getByRole("button", { name: "Get in touch" }).click();

  await expect(page.locator('[data-form-success="contact"]')).toBeVisible();
  await expect(page.locator('form[data-track-form="contact"]')).toHaveAttribute("data-form-state", "success");

  const leads = await events(page, "generate_lead");
  expect(leads).toHaveLength(1);
  expect(leads[0]).toMatchObject({ form_name: "contact" });
  expect(String(leads[0].lead_id)).toMatch(UUID);
  expect(String(leads[0].event_id)).toMatch(UUID);
  expect(await events(page, "join_waitlist")).toHaveLength(0);

  const dump = JSON.stringify(await dataLayer(page)).toLowerCase();
  for (const secret of ["qa.tester@example.com", "quality tester", "private message", "user_data"]) {
    expect(dump).not.toContain(secret);
  }
  expect(page.url()).not.toContain("example.com");
});

test("waitlist: generate_lead and join_waitlist share one event_id", async ({ page }) => {
  await page.goto("/waitlist");
  await page.getByPlaceholder("Enter your email").fill("waitlist.tester@example.com");
  await page.getByRole("button", { name: "Join now" }).click();
  await expect(page.locator('[data-form-success="waitlist"]')).toBeVisible();

  const [lead] = await events(page, "generate_lead");
  const [joined] = await events(page, "join_waitlist");
  expect(lead).toMatchObject({ form_name: "waitlist" });
  expect(joined.event_id).toBe(lead.event_id);
  expect(joined.lead_id).toBe(lead.lead_id);
  expect(JSON.stringify(await dataLayer(page))).not.toContain("waitlist.tester");
});

test("privacy: a mailto link reports contact_click", async ({ page }) => {
  await page.goto("/legal/privacy-policy");
  await freezeNavigation(page);
  await page.locator('a[href^="mailto:"]').click();
  expect(await events(page, "contact_click")).toEqual([expect.objectContaining({ method: "email" })]);
  expect(await events(page, "outbound_click")).toHaveLength(0);
});
