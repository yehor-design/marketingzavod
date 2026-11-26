export type ValidationErrorCode =
  | "required"
  | "too_long"
  | "invalid_email"
  | "invalid_url"
  | "invalid_reason"
  | "invalid_role"
  | "invalid_phone"
  | "contact_channel_required"
  | "newsletter_consent";

export type SubmitErrorKey = "rate_limited" | "network" | "server";

export type ConsentCategoryUi = {
  readonly name: string;
  readonly purpose: string;
  readonly services: string;
};

export type UiDictionary = {
  readonly header: {
    readonly logoAlt: string;
    readonly primaryNavAria: string;
    readonly openMenuAria: string;
    readonly closeMenuAria: string;
    readonly secondaryCtaText: string;
    readonly secondaryCtaHref: string;
    readonly primaryCtaText: string;
    readonly primaryCtaHref: string;
  };
  readonly footer: {
    readonly logoAria: string;
    readonly hiringBadge: string;
    readonly copyrightLine1: string;
    readonly copyrightLine2: string;
    readonly legalColumnTitle: string;
  };
  readonly announcement: {
    readonly text: string;
    readonly href: string;
    readonly closeAria: string;
  };
  readonly consent: {
    readonly cookieSettingsButton: string;
    readonly cookiesHref: string;
    readonly bannerTitleSr: string;
    readonly bannerText: string;
    readonly learnMore: string;
    readonly learnMoreAria: string;
    readonly necessaryOnly: string;
    readonly acceptAll: string;
    readonly settings: string;
    readonly settingsTitle: string;
    readonly settingsDescription: string;
    readonly closeAria: string;
    readonly saveChoices: string;
    readonly categories: {
      readonly necessary: ConsentCategoryUi;
      readonly statistics: ConsentCategoryUi;
      readonly marketing: ConsentCategoryUi;
    };
  };
  readonly contact: {
    readonly title: string;
    readonly description: string;
    readonly formHeading: string;
    readonly formSubheading: string;
    readonly nameLabel: string;
    readonly namePlaceholder: string;
    readonly emailLabel: string;
    readonly emailPlaceholder: string;
    readonly reasonLabel: string;
    readonly reasonPlaceholder: string;
    readonly reasons: {
      readonly general: string;
      readonly support: string;
      readonly sales: string;
      readonly feedback: string;
      readonly other: string;
    };
    readonly messageLabel: string;
    readonly messagePlaceholder: string;
    readonly submitLabel: string;
    readonly submittingLabel: string;
    readonly successMessage: string;
    readonly honeypotLabel: string;
  };
  readonly validation: Record<ValidationErrorCode, string>;
  readonly submitErrors: Record<SubmitErrorKey, string>;
  readonly notFound: {
    readonly metaTitle: string;
    readonly body: string;
    readonly homeCta: string;
    readonly contactCta: string;
    readonly contactHref: string;
  };
  readonly globalError: {
    readonly lang: string;
    readonly title: string;
    readonly body: string;
    readonly reload: string;
  };
};
