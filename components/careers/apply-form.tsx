"use client";

import { useState } from "react";
import { RollSubmit } from "@/components/careers/roll-link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { posthogCapture, posthogLogInfo } from "@/lib/tracking/posthog";
import { SUBMIT_ERROR_TEXT, submitLead } from "@/lib/leads/submit";
import styles from "@/components/careers/careers.module.css";


const FIELDS = [
  {
    name: "Full name",
    label: "Full name",
    type: "text",
    placeholder: "Jane Smith",
    autoComplete: "name",
    wide: false,
  },
  {
    name: "Email",
    label: "Email",
    type: "email",
    placeholder: "orin@framer.com",
    autoComplete: "email",
    wide: false,
  },
  {
    name: "Website/Portfolio",
    label: "Website/Portfolio (URL)",
    type: "url",
    placeholder: "https://...",
    autoComplete: "url",
    wide: true,
  },
  {
    name: "Why do you want to join",
    label: "Why do you want to join?",
    type: "textarea",
    placeholder: "Tell us about your motivations...",
    autoComplete: "off",
    wide: true,
  },
  {
    name: "Relevant experience",
    label: "Tell us about your relevant experience",
    type: "textarea",
    placeholder: "Briefly highlight your background and key strengths...",
    autoComplete: "off",
    wide: true,
  },
  {
    name: "Most proud of",
    label: "Tell us about the work you’re most proud of",
    type: "textarea",
    placeholder: "Share your proudest achievement or project…",
    autoComplete: "off",
    wide: true,
  },
] as const;

/** Form control name to the field name the lead API expects. */
const API_FIELD: Record<string, string> = {
  "Full name": "name",
  Email: "email",
  "Website/Portfolio": "website",
  "Why do you want to join": "motivation",
  "Relevant experience": "experience",
  "Most proud of": "proud_of",
};

export function ApplyForm({ title, slug }: { title: string; slug: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <form
      className={styles.form}
      data-track-form="careers_apply"
      data-form-state={done ? "success" : pending ? "pending" : "idle"}
      data-private=""
      onSubmit={async (event) => {
        event.preventDefault();
        if (pending || done) {
          return;
        }
        const data = new FormData(event.currentTarget);
        const fields: Record<string, string> = { role: slug };
        for (const [control, key] of Object.entries(API_FIELD)) {
          fields[key] = String(data.get(control) ?? "").trim();
        }
        setErrors({});
        setPending(true);
        const result = await submitLead("careers_apply", fields, String(data.get("company_url") ?? ""));
        setPending(false);
        if (result.ok) {
          posthogCapture("career_application_submitted", { role_slug: slug });
          posthogLogInfo("career_application_submitted", { role_slug: slug });
          setDone(true);
        } else if (result.error === "validation") {
          const next: Record<string, string> = {};
          for (const [control, key] of Object.entries(API_FIELD)) {
            if (result.errors[key]) {
              next[control] = result.errors[key];
            }
          }
          setErrors(Object.keys(next).length > 0 ? next : { form: SUBMIT_ERROR_TEXT.server });
        } else {
          setErrors({ form: SUBMIT_ERROR_TEXT[result.error] });
        }
      }}
    >
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor={`${slug}-company-url`}>Company URL</label>
        <input id={`${slug}-company-url`} name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <FieldGroup className="w-full sm:flex-row sm:flex-wrap">
        {FIELDS.map((field) => {
          const error = errors[field.name];
          const errorId = error ? `${slug}-${field.name}-error` : undefined;
          const controlId = `${slug}-${field.name}`;
          const invalid = error ? true : undefined;
          return (
            <Field
              key={field.name}
              className={field.wide ? "sm:basis-full" : "sm:min-w-0 sm:flex-1"}
              data-invalid={invalid}
              data-disabled={done || pending ? true : undefined}
            >
              <FieldLabel htmlFor={controlId}>{field.label}</FieldLabel>
              {field.type === "textarea" ? (
                <Textarea
                  id={controlId}
                  name={field.name}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required
                  aria-invalid={invalid}
                  aria-describedby={errorId}
                  disabled={done || pending}
                />
              ) : (
                <Input
                  id={controlId}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required
                  aria-invalid={invalid}
                  aria-describedby={errorId}
                  disabled={done || pending}
                />
              )}
              {error ? <FieldError id={errorId}>{error}</FieldError> : null}
            </Field>
          );
        })}
      </FieldGroup>
      <input type="hidden" name="Role" value={slug} />
      {errors.form ? (
        <Alert variant="destructive">
          <AlertDescription>{errors.form}</AlertDescription>
        </Alert>
      ) : null}
      {done ? (
        <p className={styles.success} role="status" data-form-success="careers_apply">
          Thanks for your application!
        </p>
      ) : (
        <RollSubmit className={styles.submit} text={`Apply for ${title}`} />
      )}
    </form>
  );
}
