import { z } from "zod";
import { sanitizeAttribution } from "@/lib/attribution/core";

const text = (max: number) => z.string().trim().min(1, "Required.").max(max, "Too long.");
const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Too long.")
  .pipe(z.email("Enter a valid email."));

const httpUrl = z
  .string()
  .trim()
  .max(500, "Too long.")
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid URL.");

export const CONTACT_REASONS = ["general", "support", "sales", "feedback", "other"] as const;

const contactFields = z.object({
  name: text(120),
  email,
  reason: z.enum(CONTACT_REASONS, "Select a reason for contact."),
  message: text(5000),
});

const waitlistFields = z.object({ email });

const applyFields = z.object({
  name: text(120),
  email,
  website: httpUrl,
  motivation: text(5000),
  experience: text(5000),
  proud_of: text(5000),
  role: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]{1,80}$/, "Unknown role."),
});

const consent = z
  .object({
    statistics: z.boolean().default(false),
    marketing: z.boolean().default(false),
    preferences: z.boolean().default(false),
  })
  .default({ statistics: false, marketing: false, preferences: false });

const shared = {
  /** Honeypot. Real visitors never see or fill it. */
  company_url: z.string().max(200).optional().default(""),
  attribution: z.unknown().optional().transform(sanitizeAttribution),
  consent,
  page_url: z.string().trim().max(500).optional().default(""),
  /** The browser's Amplitude device ID, sent only with statistics consent. */
  amplitude_device_id: z.string().trim().min(5).max(200).optional(),
};

export const leadRequestSchema = z.discriminatedUnion("form_name", [
  z.object({ form_name: z.literal("contact"), fields: contactFields, ...shared }),
  z.object({ form_name: z.literal("waitlist"), fields: waitlistFields, ...shared }),
  z.object({ form_name: z.literal("careers_apply"), fields: applyFields, ...shared }),
]);

export type LeadRequest = z.infer<typeof leadRequestSchema>;

/** Flattens zod issues to { field: message } for the form. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.filter((part) => part !== "fields").join(".") || "form";
    if (!(path in out)) {
      out[path] = issue.message;
    }
  }
  return out;
}

/** Drops the query string and hash from the page URL. They may carry personal data. */
export function cleanPageUrl(raw: string): string {
  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}
