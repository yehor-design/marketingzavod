"use client";

import { useState, type HTMLAttributes } from "react";
import { Field, FieldError, FieldGroup, FieldLabel, useFieldControl } from "@ui-sdk/react/field";
import { Input, Textarea } from "@/components/forms/bound-controls";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { SUBMIT_ERROR_TEXT, submitLead } from "@/lib/leads/submit";
import type { FormName } from "@/lib/tracking";
import { cx } from "@/components/blocks/contact-form/contact-form-styles";

export type ContactSelectOption = {
  value: string;
  label: string;
};

export type ContactFieldConfig =
  | {
      kind: "text" | "email" | "tel" | "url";
      key: string;
      name: string;
      label: string;
      placeholder?: string;
      autoComplete?: string;
      inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
      required?: boolean;
      defaultValue?: string;
    }
  | {
      kind: "select";
      key: string;
      name: string;
      label: string;
      placeholder: string;
      options: readonly ContactSelectOption[];
      required?: boolean;
      defaultValue?: string;
    }
  | {
      kind: "textarea";
      key: string;
      name: string;
      label: string;
      placeholder?: string;
      required?: boolean;
      defaultValue?: string;
    };

export type ContactFieldRow = ContactFieldConfig | readonly ContactFieldConfig[];

export type ContactFormProps = {
  formName?: FormName;
  heading: string;
  subheading?: string;
  fields: readonly ContactFieldRow[];
  submitLabel: string;
  successMessage: string;
  honeypotId?: string;
  honeypotLabel?: string;
  errorMessages?: Record<"rate_limited" | "network" | "server", string>;
  previewState?: "normal" | "error" | "submitting";
  previewErrors?: Record<string, string>;
  className?: string;
};

type BoundControl = {
  id?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

function BoundSelect({
  name,
  options,
  placeholder,
  required,
  value,
  onValueChange,
  invalid,
}: {
  name: string;
  options: readonly ContactSelectOption[];
  placeholder: string;
  required?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  invalid: boolean;
}) {
  const field = useFieldControl();
  const bound = (field?.props({}) ?? {}) as BoundControl;

  return (
    <Select
      items={options as ContactSelectOption[]}
      name={name}
      required={required}
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
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function isRowGroup(row: ContactFieldRow): row is readonly ContactFieldConfig[] {
  return Array.isArray(row);
}

function flattenFields(rows: readonly ContactFieldRow[]): ContactFieldConfig[] {
  const out: ContactFieldConfig[] = [];
  for (const row of rows) {
    if (isRowGroup(row)) {
      out.push(...row);
    } else {
      out.push(row);
    }
  }
  return out;
}

export function ContactForm({
  formName = "contact",
  heading,
  subheading,
  fields,
  submitLabel,
  successMessage,
  honeypotId = "contact-company-url",
  honeypotLabel = "Company URL",
  errorMessages = SUBMIT_ERROR_TEXT,
  previewState,
  previewErrors,
  className,
}: ContactFormProps) {
  const flatFields = flattenFields(fields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const item of flatFields) {
      if (item.kind === "select") {
        initial[item.key] = item.defaultValue ?? "";
      }
    }
    return initial;
  });

  const activeErrors = previewState === "error" ? (previewErrors ?? {}) : errors;
  const isPending = previewState === "submitting" || pending;
  const isDisabled = done || isPending;

  function renderField(item: ContactFieldConfig, inGroup: boolean) {
    const error = activeErrors[item.key];
    const fieldClass = inGroup ? "min-w-0 flex-1" : undefined;

    if (item.kind === "select") {
      return (
        <Field
          key={item.key}
          className={fieldClass}
          disabled={isDisabled}
          invalid={error ? true : undefined}
        >
          <FieldLabel className="text-sm text-muted-foreground">{item.label}</FieldLabel>
          <BoundSelect
            name={item.name}
            options={item.options}
            placeholder={item.placeholder}
            required={item.required}
            value={selectValues[item.key] ?? ""}
            invalid={Boolean(error)}
            onValueChange={(next) =>
              setSelectValues((prev) => ({
                ...prev,
                [item.key]: next,
              }))
            }
          />
          {error ? <FieldError match>{error}</FieldError> : null}
        </Field>
      );
    }

    if (item.kind === "textarea") {
      return (
        <Field
          key={item.key}
          className={fieldClass}
          name={item.name}
          disabled={isDisabled}
          invalid={error ? true : undefined}
        >
          <FieldLabel className="text-sm text-muted-foreground">{item.label}</FieldLabel>
          <Textarea
            placeholder={item.placeholder}
            defaultValue={item.defaultValue}
            required={item.required}
          />
          {error ? <FieldError match>{error}</FieldError> : null}
        </Field>
      );
    }

    return (
      <Field
        key={item.key}
        className={fieldClass}
        name={item.name}
        disabled={isDisabled}
        invalid={error ? true : undefined}
      >
        <FieldLabel className="text-sm text-muted-foreground">{item.label}</FieldLabel>
        <Input
          type={item.kind}
          inputMode={item.inputMode}
          autoComplete={item.autoComplete}
          placeholder={item.placeholder}
          defaultValue={item.defaultValue}
          required={item.required}
        />
        {error ? <FieldError match>{error}</FieldError> : null}
      </Field>
    );
  }

  return (
    <form
      className={cx("form", className)}
      data-block="contact-form"
      data-track-form={previewState ? undefined : formName}
      data-form-state={done ? "success" : isPending ? "pending" : "idle"}
      data-private=""
      onSubmit={async (event) => {
        event.preventDefault();
        if (previewState || isPending || done) {
          return;
        }
        const data = new FormData(event.currentTarget);
        const value = (name: string) => String(data.get(name) ?? "").trim();
        const payload: Record<string, string> = {};
        for (const item of flatFields) {
          payload[item.key] = value(item.name);
        }
        setErrors({});
        setPending(true);
        const result = await submitLead(formName, payload, value("company_url"));
        setPending(false);
        if (result.ok) {
          setDone(true);
        } else if (result.error === "validation") {
          setErrors(result.errors);
        } else {
          setErrors({ form: errorMessages[result.error] });
        }
      }}
    >
      {/* Spam trap: a native input so it is not a named control. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={honeypotId}>{honeypotLabel}</label>
        <input
          id={honeypotId}
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h2>{heading}</h2>
        {subheading ? <p className="text-muted-foreground">{subheading}</p> : null}
      </div>
      <FieldGroup className="flex w-full flex-col gap-5">
        {fields.map((row, rowIndex) =>
          isRowGroup(row) ? (
            <FieldGroup
              key={`row-${rowIndex}-${row.map((f) => f.key).join("-")}`}
              className="flex w-full flex-col gap-5 sm:flex-row"
            >
              {row.map((item) => renderField(item, true))}
            </FieldGroup>
          ) : (
            renderField(row, false)
          ),
        )}
      </FieldGroup>
      {activeErrors.form ? (
        <Alert variant="destructive">
          <AlertDescription>{activeErrors.form}</AlertDescription>
        </Alert>
      ) : null}
      {done ? (
        <p className="text-brand" role="status" data-form-success={formName}>
          {successMessage}
        </p>
      ) : (
        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" />
              {submitLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      )}
    </form>
  );
}
