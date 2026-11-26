"use client";

import {
  ContactForm,
  contactFormStyles,
  type ContactFieldRow,
} from "@/components/blocks/contact-form";
import { ui } from "@/content/ui";

const REASONS = [
  { value: "general", label: ui.contact.reasons.general },
  { value: "support", label: ui.contact.reasons.support },
  { value: "sales", label: ui.contact.reasons.sales },
  { value: "feedback", label: ui.contact.reasons.feedback },
  { value: "other", label: ui.contact.reasons.other },
] as const;

const CONTACT_FIELDS: readonly ContactFieldRow[] = [
  [
    {
      kind: "text",
      key: "name",
      name: "Full name",
      label: ui.contact.nameLabel,
      placeholder: ui.contact.namePlaceholder,
      autoComplete: "name",
      required: true,
    },
    {
      kind: "email",
      key: "email",
      name: "Email",
      label: ui.contact.emailLabel,
      placeholder: ui.contact.emailPlaceholder,
      inputMode: "email",
      autoComplete: "email",
      required: true,
    },
  ],
  {
    kind: "select",
    key: "reason",
    name: "Inquiry type",
    label: ui.contact.reasonLabel,
    placeholder: ui.contact.reasonPlaceholder,
    options: REASONS,
    required: true,
  },
  {
    kind: "textarea",
    key: "message",
    name: "Message",
    label: ui.contact.messageLabel,
    placeholder: ui.contact.messagePlaceholder,
    required: true,
  },
];

export function ContactPage() {
  return (
    <div className={contactFormStyles.page}>
      <section className={contactFormStyles.frame} aria-labelledby="contact-title">
        <div className={contactFormStyles.intro}>
          <div className={contactFormStyles.introCopy}>
            <h1 id="contact-title">{ui.contact.title}</h1>
            <p>{ui.contact.description}</p>
          </div>
        </div>
        <div className={contactFormStyles.panel}>
          <ContactForm
            formName="contact"
            heading={ui.contact.formHeading}
            subheading={ui.contact.formSubheading}
            fields={CONTACT_FIELDS}
            submitLabel={ui.contact.submitLabel}
            submittingLabel={ui.contact.submittingLabel}
            successMessage={ui.contact.successMessage}
            honeypotLabel={ui.contact.honeypotLabel}
          />
        </div>
      </section>
    </div>
  );
}
