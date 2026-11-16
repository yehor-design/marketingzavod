"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { posthogLog } from "@/lib/posthog-logs";
import { SUBMIT_ERROR_TEXT, submitLead } from "@/lib/leads/submit";
import styles from "@/components/contact/contact.module.css";

const posthogEnabled = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

const REASONS = [
  { value: "general", label: "General" },
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
] as const;

type Errors = {
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
  form?: string;
};

export function ContactPage() {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <div className={styles.page}>
      <section className={styles.frame} aria-labelledby="contact-title">
        <div className={styles.intro}>
          <div className={styles.introCopy}>
            <h1 id="contact-title">Get in touch with Jet</h1>
            <p>
              We’re here to help—whether you have a question, or need support. Reach out and our
              team will get back to you as soon as possible.
            </p>
          </div>
        </div>
        <div className={styles.panel}>
          <form
            className={styles.form}
            data-track-form="contact"
            data-form-state={done ? "success" : pending ? "pending" : "idle"}
            data-private=""
            data-clarity-mask="true"
            onSubmit={async (event) => {
              event.preventDefault();
              if (pending || done) {
                return;
              }
              const data = new FormData(event.currentTarget);
              const value = (name: string) => String(data.get(name) ?? "").trim();
              setErrors({});
              setPending(true);
              const result = await submitLead(
                "contact",
                {
                  name: value("Full name"),
                  email: value("Email"),
                  reason: value("Inquiry type"),
                  message: value("Message"),
                },
                value("company_url"),
              );
              setPending(false);
              if (result.ok) {
                if (posthogEnabled) {
                  posthog.capture("contact_form_submitted", { inquiry_type: reason });
                  posthogLog.info("contact_form_submitted", { inquiry_type: reason });
                }
                setDone(true);
              } else if (result.error === "validation") {
                setErrors(result.errors);
              } else {
                setErrors({ form: SUBMIT_ERROR_TEXT[result.error] });
              }
            }}
          >
            <div className="visually-hidden" aria-hidden="true">
              <label htmlFor="contact-company-url">Company URL</label>
              <input
                id="contact-company-url"
                name="company_url"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className={styles.heading}>
              <h2>Send us a message</h2>
              <p>We’d love to hear from you.</p>
            </div>
            <div className={styles.split}>
              <label className={styles.field} htmlFor="contact-name">
                <span>Full name</span>
                <input
                  id="contact-name"
                  name="Full name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  required
                  disabled={done || pending}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                />
                {errors.name ? (
                  <span className={styles.fieldError} id="contact-name-error" role="alert">
                    {errors.name}
                  </span>
                ) : null}
              </label>
              <label className={styles.field} htmlFor="contact-email">
                <span>Email</span>
                <input
                  id="contact-email"
                  name="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="orin@framer.com"
                  required
                  disabled={done || pending}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                />
                {errors.email ? (
                  <span className={styles.fieldError} id="contact-email-error" role="alert">
                    {errors.email}
                  </span>
                ) : null}
              </label>
            </div>
            <label className={styles.field} htmlFor="contact-reason">
              <span>Reason for contact</span>
              <select
                id="contact-reason"
                name="Inquiry type"
                required
                disabled={done || pending}
                value={reason}
                data-empty={reason ? undefined : "true"}
                aria-invalid={errors.reason ? true : undefined}
                aria-describedby={errors.reason ? "contact-reason-error" : undefined}
                onChange={(event) => setReason(event.target.value)}
              >
                <option value="" disabled>
                  Select…
                </option>
                {REASONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              {errors.reason ? (
                <span className={styles.fieldError} id="contact-reason-error" role="alert">
                  {errors.reason}
                </span>
              ) : null}
            </label>
            <label className={styles.field} htmlFor="contact-message">
              <span>How can we help?</span>
              <textarea
                id="contact-message"
                name="Message"
                placeholder="Tell us what you need help with…"
                required
                disabled={done || pending}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
              />
              {errors.message ? (
                <span className={styles.fieldError} id="contact-message-error" role="alert">
                  {errors.message}
                </span>
              ) : null}
            </label>
            {errors.form ? (
              <p className={styles.fieldError} role="alert">
                {errors.form}
              </p>
            ) : null}
            {done ? (
              <p className={styles.success} role="status" data-form-success="contact">
                We&apos;ll get back to you soon!
              </p>
            ) : (
              <button className={styles.submit} type="submit" disabled={pending} aria-busy={pending}>
                Get in touch
              </button>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
