"use client";

import { useState } from "react";
import { Field, FieldError, FieldGroup, FieldLabel, useFieldControl } from "@ui-sdk/react/field";
import { Input, Textarea } from "@/components/forms/bound-controls";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBMIT_ERROR_TEXT, submitLead } from "@/lib/leads/submit";
import styles from "@/components/contact/contact-styles";


const REASONS = [
  { value: "general", label: "General" },
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

type BoundControl = {
  id?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

function ReasonSelect({
  value,
  onValueChange,
  invalid,
}: {
  value: string;
  onValueChange: (value: string) => void;
  invalid: boolean;
}) {
  const field = useFieldControl();
  const bound = (field?.props({}) ?? {}) as BoundControl;

  return (
    <Select
      items={REASONS}
      name="Inquiry type"
      required
      disabled={field?.disabled}
      value={value === "" ? null : value}
      onValueChange={(next) => onValueChange(next ?? "")}
    >
      <SelectTrigger
        id={bound.id}
        className="w-full"
        aria-labelledby={bound["aria-labelledby"]}
        aria-describedby={bound["aria-describedby"]}
        aria-invalid={invalid ? true : undefined}
      >
        <SelectValue placeholder="Select…" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {REASONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

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
                <ReasonSelect
                  value={reason}
                  invalid={Boolean(errors.reason)}
                  onValueChange={setReason}
                />
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
                {pending ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Get in touch
                  </>
                ) : (
                  "Get in touch"
                )}
              </Button>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
