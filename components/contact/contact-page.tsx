"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { posthogCapture, posthogLogInfo } from "@/lib/tracking/posthog";
import { SUBMIT_ERROR_TEXT, submitLead } from "@/lib/leads/submit";
import styles from "@/components/contact/contact.module.css";


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
                posthogCapture("contact_form_submitted", { inquiry_type: reason });
                posthogLogInfo("contact_form_submitted", { inquiry_type: reason });
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
            <div className="flex flex-col gap-1">
              <h2>Send us a message</h2>
              <p className="text-muted-foreground">We’d love to hear from you.</p>
            </div>
            <FieldGroup className="w-full">
              <FieldGroup className="sm:flex-row">
                <Field data-invalid={errors.name ? true : undefined}>
                  <FieldLabel htmlFor="contact-name">Full name</FieldLabel>
                  <Input
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
                  {errors.name ? <FieldError id="contact-name-error">{errors.name}</FieldError> : null}
                </Field>
                <Field data-invalid={errors.email ? true : undefined}>
                  <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                  <Input
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
                  {errors.email ? <FieldError id="contact-email-error">{errors.email}</FieldError> : null}
                </Field>
              </FieldGroup>
              <Field data-invalid={errors.reason ? true : undefined}>
                <FieldLabel htmlFor="contact-reason">Reason for contact</FieldLabel>
                <NativeSelect
                  className="w-full"
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
                  <NativeSelectOption value="" disabled>
                    Select…
                  </NativeSelectOption>
                  {REASONS.map((item) => (
                    <NativeSelectOption key={item.value} value={item.value}>
                      {item.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {errors.reason ? <FieldError id="contact-reason-error">{errors.reason}</FieldError> : null}
              </Field>
              <Field data-invalid={errors.message ? true : undefined}>
                <FieldLabel htmlFor="contact-message">How can we help?</FieldLabel>
                <Textarea
                  id="contact-message"
                  name="Message"
                  placeholder="Tell us what you need help with…"
                  required
                  disabled={done || pending}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                />
                {errors.message ? <FieldError id="contact-message-error">{errors.message}</FieldError> : null}
              </Field>
            </FieldGroup>
            {errors.form ? (
              <Alert variant="destructive">
                <AlertDescription>{errors.form}</AlertDescription>
              </Alert>
            ) : null}
            {done ? (
              <p className="text-brand" role="status" data-form-success="contact">
                We&apos;ll get back to you soon!
              </p>
            ) : (
              <Button type="submit" disabled={pending} aria-busy={pending}>
                Get in touch
              </Button>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
