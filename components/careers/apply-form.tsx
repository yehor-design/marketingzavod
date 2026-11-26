"use client";

import { useState } from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui-sdk/react/field";
import { Input, Textarea } from "@/components/forms/bound-controls";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { SUBMIT_ERROR_TEXT, submitLead } from "@/lib/leads/submit";
import styles from "@/components/careers/careers-styles";


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
      {/* Spam trap: a native input so it is not a named control. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${slug}-company-url`}>Company URL</label>
        <input id={`${slug}-company-url`} name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <FieldGroup className="flex w-full flex-col gap-5 sm:flex-row sm:flex-wrap">
        {FIELDS.map((field) => {
          const error = errors[field.name];
          return (
            <Field
              key={field.name}
              className={field.wide ? "w-full sm:basis-full" : "w-full sm:min-w-0 sm:flex-1"}
              name={field.name}
              disabled={done || pending}
              invalid={error ? true : undefined}
            >
              <FieldLabel className="text-sm text-muted-foreground">{field.label}</FieldLabel>
              {field.type === "textarea" ? (
                <Textarea
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required
                />
              ) : (
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required
                />
              )}
              {error ? <FieldError match>{error}</FieldError> : null}
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
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? (
            <>
              <Spinner data-icon="inline-start" />
              {`Apply for ${title}`}
            </>
          ) : (
            `Apply for ${title}`
          )}
        </Button>
      )}
    </form>
  );
}
