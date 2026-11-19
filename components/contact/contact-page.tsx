"use client";

import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui-sdk/react/field";
import { Input, Textarea } from "@/components/forms/bound-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import { selectOptionClass, selectPopupClass, textControlClass } from "@/components/forms/control-classes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { posthogCapture, posthogLogInfo } from "@/lib/tracking/posthog";
import { SUBMIT_ERROR_TEXT, submitLead } from "@/lib/leads/submit";
import styles from "@/components/contact/contact-styles";


const REASONS = [
  { value: "general", label: "General" },
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

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
            {/* Spam trap: a native input so it is not a named control. */}
            <div className="sr-only" aria-hidden="true">
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
            <FieldGroup className="flex w-full flex-col gap-5">
              <FieldGroup className="flex w-full flex-col gap-5 sm:flex-row">
                <Field className="min-w-0 flex-1" name="Full name" disabled={done || pending} invalid={errors.name ? true : undefined}>
                  <FieldLabel className="text-sm text-muted-foreground">Full name</FieldLabel>
                  <Input
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    required
                  />
                  {errors.name ? <FieldError match>{errors.name}</FieldError> : null}
                </Field>
                <Field className="min-w-0 flex-1" name="Email" disabled={done || pending} invalid={errors.email ? true : undefined}>
                  <FieldLabel className="text-sm text-muted-foreground">Email</FieldLabel>
                  <Input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="orin@framer.com"
                    required
                  />
                  {errors.email ? <FieldError match>{errors.email}</FieldError> : null}
                </Field>
              </FieldGroup>
              <Field disabled={done || pending} invalid={errors.reason ? true : undefined}>
                <FieldLabel className="text-sm text-muted-foreground">Reason for contact</FieldLabel>
                <Select
                  name="Inquiry type"
                  required
                  placeholder="Select…"
                  items={REASONS}
                  value={reason === "" ? null : reason}
                  onValueChange={(next) => setReason(next ?? "")}
                >
                  <SelectTrigger className={textControlClass}>
                    <SelectValue />
                    <ChevronDownIcon aria-hidden="true" />
                  </SelectTrigger>
                  <SelectContent className={selectPopupClass}>
                    {REASONS.map((item) => (
                      <SelectItem key={item.value} className={selectOptionClass} value={item.value}>
                        {item.label}
                        <SelectItemIndicator>
                          <CheckIcon aria-hidden="true" />
                        </SelectItemIndicator>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reason ? <FieldError match>{errors.reason}</FieldError> : null}
              </Field>
              <Field name="Message" disabled={done || pending} invalid={errors.message ? true : undefined}>
                <FieldLabel className="text-sm text-muted-foreground">How can we help?</FieldLabel>
                <Textarea placeholder="Tell us what you need help with…" required />
                {errors.message ? <FieldError match>{errors.message}</FieldError> : null}
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
