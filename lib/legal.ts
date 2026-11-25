import { legalSlugs } from "@/lib/routes";

export type RichText =
  | { text: string }
  | { text: string; href: string };

export type LegalBlock =
  | { kind: "p"; content: RichText[] }
  | { kind: "h2"; text: string; id?: string }
  | { kind: "list"; items: string[] };

export type LegalDocument = {
  slug: (typeof legalSlugs)[number];
  title: string;
  heading: string;
  description: string;
  version: string;
  date: string;
  blocks: LegalBlock[];
};

function p(text: string): LegalBlock {
  return { kind: "p", content: [{ text }] };
}

/** An id makes the heading a link target, e.g. /legal/privacy-policy#cookies. */
function h2(text: string, id?: string): LegalBlock {
  return id ? { kind: "h2", text, id } : { kind: "h2", text };
}

const terms: LegalDocument = {
  slug: "terms-of-service",
  title: "Terms of Service ",
  heading: "Terms of Service",
  description:
    "The terms that govern your use of the Jet website optimization platform and related services.",
  version: "1.8",
  date: "Jun 7, 2025",
  blocks: [
    p(
      'Welcome to Jet! By using our website optimization platform and related services ("Services"), you agree to these Terms of Service ("Terms"). Please read them carefully.',
    ),
    h2("1. Acceptance of Terms"),
    p(
      "By accessing or using Jet, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use our Services.",
    ),
    h2("2. Eligibility"),
    p(
      "You must be at least 18 years old or have legal capacity in your jurisdiction to use Jet.",
    ),
    h2("3. Account Registration"),
    p(
      "To use some features, you may need to create an account. You are responsible for keeping your login information secure and for all activities under your account.",
    ),
    h2("4. Use of Services"),
    p(
      "You agree to use Jet only for lawful purposes and in accordance with these Terms. You may not misuse the Services or attempt to access them in unauthorized ways.",
    ),
    h2("5. Payment & Subscriptions"),
    p(
      "Some features may require payment. By subscribing, you agree to pay the applicable fees and taxes. All payments are non-refundable except as required by law.",
    ),
    h2("6. Intellectual Property"),
    p(
      "All content, trademarks, and technology on Jet are owned by us or our licensors. You may not copy, modify, distribute, or create derivative works without our written permission.",
    ),
    h2("7. User Content"),
    p(
      "You retain ownership of content you submit to Jet. By submitting content, you grant us a license to use, host, and display it as needed to provide our Services.",
    ),
    h2("8. Termination"),
    p(
      "We may suspend or terminate your access to Jet at any time for violation of these Terms or for any reason. You may stop using Jet at any time.",
    ),
    h2("9. Disclaimers"),
    p(
      'Jet is provided "as is" without warranties of any kind. We do not guarantee that the Services will be error-free or uninterrupted.',
    ),
    h2("10. Limitation of Liability"),
    p(
      "To the maximum extent permitted by law, Jet and its affiliates are not liable for any indirect, incidental, or consequential damages arising out of your use of the Services.",
    ),
    h2("11. Changes to Terms"),
    p(
      "We may update these Terms from time to time. We\u2019ll notify you of significant changes. Continued use of Jet means you accept the new Terms.",
    ),
    h2("12. Contact"),
    {
      kind: "p",
      content: [
        { text: "If you have questions about these Terms, contact us at " },
        { text: "support@jet.com", href: "mailto:support@jet.com" },
        { text: "." },
      ],
    },
  ],
};

const privacy: LegalDocument = {
  slug: "privacy-policy",
  title: "Privacy Policy ",
  heading: "Privacy Policy",
  description:
    "How Jet collects, uses and protects personal data, including the cookies and analytics services used on this website.",
  version: "1.9",
  date: "Nov 25, 2026",
  blocks: [
    p(
      "Jet respects your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights.",
    ),
    h2("1. Information We Collect"),
    {
      kind: "list",
      items: [
        "Account Information: Name, email, and other details you provide when registering.",
        "Usage Data: How you use Jet, including analytics and cookies.",
        "Communications: Messages or feedback you send us.",
      ],
    },
    h2("2. How We Use Your Information"),
    {
      kind: "list",
      items: [
        "To provide and improve our Services",
        "To respond to your requests and support needs",
        "To send important updates and communications",
        "For security, analytics, and legal compliance",
      ],
    },
    h2("3. Sharing Your Information"),
    p(
      "We do not sell your personal information. We may share data with trusted third-party service providers as needed to operate Jet, or if required by law.",
    ),
    h2("4. Cookies & Tracking", "cookies"),
    p(
      "We use cookies and similar technologies only with your consent, except for the one cookie that is strictly necessary to remember your choice. When you first visit, a banner lets you choose in one click: \u201cAccept all\u201d or \u201cNecessary only\u201d. \u201cSettings\u201d lets you choose each category separately. Nothing in the statistics or marketing categories is loaded or stored on your device before you choose, and refusing is as easy as accepting.",
    ),
    p(
      "We keep your choice for 180 days and then ask again. We also ask again if we add a service or a purpose. You can change or withdraw your consent at any time through the \u201cCookie settings\u201d link in the footer of every page. When you withdraw consent, we stop the services in that category, delete the cookies and stored data they set on our website, and reload the page. Cookies that partners set on their own domains, such as linkedin.com or facebook.com, can only be removed in your browser settings.",
    ),
    {
      kind: "list",
      items: [
        "Necessary: the mz_consent cookie remembers your choice. It holds only the categories you chose, the date and a random ID.",
        "Statistics: Google Analytics 4 and Amplitude help us understand how the website is used, and Amplitude records sessions in which form fields are masked. Vercel Speed Insights measures how fast our pages load. We also remember the campaign that brought you here (UTM parameters) for up to 90 days.",
        "Marketing: Google Ads, Meta and LinkedIn measure whether our advertising leads to enquiries. With your consent we may share a hashed version of the email address you submit in a form, together with advertising click identifiers, with Google and Meta for conversion measurement.",
      ],
    },
    p(
      "To be able to show that consent was given, we keep a record of each choice: the random ID from the mz_consent cookie, the categories you chose, whether you chose in the banner or in the settings, the version of this notice and the time. The record contains no IP address, browser details or other information that identifies you, and is stored with Amplitude.",
    ),
    p(
      "If you submit a form without consenting to statistics or marketing, we still receive your message and the campaign name from the link you followed, but no advertising identifiers and no cookies are used.",
    ),
    p(
      "Form submissions are stored in our customer relationship management system (HubSpot) so that we can reply to you.",
    ),
    p(
      "After you consent, Google Tag Manager loads the Google Analytics, Google Ads, Meta and LinkedIn tags in your browser, only for the categories you consented to. When you send a form with marketing consent, our server also reports it to Meta\u2019s Conversions API, so that the enquiry is counted once even if the browser blocks the Meta script.",
    ),
    h2("5. Data Security"),
    p(
      "We use industry-standard security measures to protect your data. However, no system is 100% secure.",
    ),
    h2("6. Your Rights"),
    p(
      "You may access, update, or delete your personal information by contacting us. You can also unsubscribe from marketing emails at any time.",
    ),
    h2("7. Data Retention"),
    p(
      "We retain your information as long as needed to provide our Services and meet legal obligations.",
    ),
    h2("8. Children\u2019s Privacy"),
    p(
      "Jet is not intended for children under 13. We do not knowingly collect personal information from children.",
    ),
    h2("9. Changes to This Policy"),
    p(
      "We may update this Privacy Policy. Significant changes will be communicated. Continued use of Jet means you accept the new policy.",
    ),
    h2("10. Contact"),
    {
      kind: "p",
      content: [
        { text: "For privacy questions or requests, email us at " },
        { text: "privacy@jet.com", href: "mailto:privacy@jet.com" },
        { text: "." },
      ],
    },
  ],
};

export const legalDocuments = [terms, privacy] as const;

export function getLegal(slug: string): LegalDocument | undefined {
  return legalDocuments.find((document) => document.slug === slug);
}
