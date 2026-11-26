"use client";

import {
  ContactForm,
  contactFormStyles,
  type ContactFieldRow,
} from "@/components/blocks/contact-form";

const REASONS = [
  { value: "general", label: "General" },
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
] as const;

const JET_CONTACT_FIELDS: readonly ContactFieldRow[] = [
  [
    {
      kind: "text",
      key: "name",
      name: "Full name",
      label: "Full name",
      placeholder: "Jane Smith",
      autoComplete: "name",
      required: true,
    },
    {
      kind: "email",
      key: "email",
      name: "Email",
      label: "Email",
      placeholder: "orin@framer.com",
      inputMode: "email",
      autoComplete: "email",
      required: true,
    },
  ],
  {
    kind: "select",
    key: "reason",
    name: "Inquiry type",
    label: "Reason for contact",
    placeholder: "Select…",
    options: REASONS,
    required: true,
  },
  {
    kind: "textarea",
    key: "message",
    name: "Message",
    label: "How can we help?",
    placeholder: "Tell us what you need help with…",
    required: true,
  },
];

export function ContactPage() {
  return (
    <div className={contactFormStyles.page}>
      <section className={contactFormStyles.frame} aria-labelledby="contact-title">
        <div className={contactFormStyles.intro}>
          <div className={contactFormStyles.introCopy}>
            <h1 id="contact-title">Get in touch with Jet</h1>
            <p>
              We’re here to help—whether you have a question, or need support. Reach out and our
              team will get back to you as soon as possible.
            </p>
          </div>
        </div>
        <div className={contactFormStyles.panel}>
          <ContactForm
            formName="contact"
            heading="Send us a message"
            subheading="We’d love to hear from you."
            fields={JET_CONTACT_FIELDS}
            submitLabel="Get in touch"
            successMessage="We'll get back to you soon!"
          />
        </div>
      </section>
    </div>
  );
}
