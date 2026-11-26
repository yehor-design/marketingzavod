import { COMPANY } from "@/content/bg/company";
import { BG_DRAFTS } from "@/content/bg/drafts";
import { SHARED_FORMULATIONS } from "@/content/bg/shared";
import type { UiDictionary } from "@/content/ui-types";

export const BG_UI_SOURCE_FILES = [
  "00-README.md",
  "01-globalni-elementi.md",
  "02-nachalo.md",
  "24-kontakt.md",
  "26-404.md",
] as const;

export const bgUi: UiDictionary = {
  header: {
    logoAlt: BG_DRAFTS.logoHomeAria.value,
    primaryNavAria: BG_DRAFTS.primaryNavAria.value,
    openMenuAria: BG_DRAFTS.openMenuAria.value,
    closeMenuAria: BG_DRAFTS.closeMenuAria.value,
    secondaryCtaText: "Запазете безплатен разговор",
    secondaryCtaHref: "/kontakt",
    primaryCtaText: "Безплатен разговор",
    primaryCtaHref: "/kontakt",
  },
  footer: {
    logoAria: BG_DRAFTS.logoHomeAria.value,
    hiringBadge: "Пилот 30 дни",
    copyrightLine1: COMPANY.copyright,
    copyrightLine2: "",
    legalColumnTitle: "Правни",
  },
  announcement: {
    text: "Рекламните акаунти на фирмата ви на ваше име ли са? Проверете с безплатния ни чеклист →",
    href: "/proverka-na-akaunti",
    closeAria: BG_DRAFTS.announcementCloseAria.value,
  },
  consent: {
    cookieSettingsButton: "Настройки за бисквитки",
    cookiesHref: "/legal/biskvitki",
    bannerTitleSr: BG_DRAFTS.consentBannerTitleSr.value,
    bannerText:
      "Използваме бисквитки за анализ и реклама — някои от тях са на наши партньори.",
    learnMore: "Научете повече",
    learnMoreAria: "Научете повече за бисквитките",
    necessaryOnly: "Само необходимите",
    acceptAll: "Приемам всички",
    settings: "Настройки",
    settingsTitle: "Настройки за бисквитки",
    settingsDescription: BG_DRAFTS.consentSettingsDescription.value,
    closeAria: BG_DRAFTS.consentSettingsCloseAria.value,
    saveChoices: "Запазване на избора",
    categories: {
      necessary: {
        name: "Необходими",
        purpose: BG_DRAFTS.consentNecessaryPurpose.value,
        services: BG_DRAFTS.consentNecessaryServices.value,
      },
      statistics: {
        name: "Статистически",
        purpose: BG_DRAFTS.consentStatisticsPurpose.value,
        services: BG_DRAFTS.consentStatisticsServices.value,
      },
      marketing: {
        name: "Маркетингови",
        purpose: BG_DRAFTS.consentMarketingPurpose.value,
        services: BG_DRAFTS.consentMarketingServices.value,
      },
    },
  },
  contact: {
    title: "Да видим цифрите ви.",
    description:
      "Разкажете ни накратко за фирмата. Ще се свържем до 1 работен ден, за да изберем удобен час. Без ангажимент.",
    formHeading: "Да видим цифрите ви.",
    formSubheading: "Без ангажимент. Отговаряме до 1 работен ден.",
    nameLabel: "Име",
    namePlaceholder: "Име",
    emailLabel: "Имейл",
    emailPlaceholder: COMPANY.email,
    reasonLabel: "Тема",
    reasonPlaceholder: "Друго",
    reasons: {
      general: "Друго",
      support: "Смяна на агенция",
      sales: "Пилот 30 дни",
      feedback: "Партньорство",
      other: "Само одит",
    },
    messageLabel: "Какво искате да подобрите?",
    messagePlaceholder:
      "Например: плащаме за реклама в Meta от година, но не знаем колко ни струва един клиент.",
    submitLabel: "Изпратете",
    submittingLabel: BG_DRAFTS.submitPending.value,
    successMessage: SHARED_FORMULATIONS.responseTime,
    honeypotLabel: "Сайт на фирмата",
  },
  validation: {
    required: BG_DRAFTS.validationNameRequired.value,
    too_long: BG_DRAFTS.validationTooLong.value,
    invalid_email: BG_DRAFTS.validationEmailInvalid.value,
    invalid_url: BG_DRAFTS.validationWebsiteInvalid.value,
    invalid_reason: BG_DRAFTS.validationNameRequired.value,
    invalid_role: BG_DRAFTS.submitServerError.value,
    invalid_phone: BG_DRAFTS.validationPhoneInvalid.value,
    contact_channel_required:
      "Оставете телефон, Viber или имейл, за да можем да ви отговорим.",
    newsletter_consent: BG_DRAFTS.validationNewsletterConsent.value,
  },
  submitErrors: {
    rate_limited: BG_DRAFTS.submitRateLimited.value,
    network: BG_DRAFTS.submitNetworkError.value,
    server: BG_DRAFTS.submitServerError.value,
  },
  notFound: {
    metaTitle: "Страницата не е намерена | Маркетинг Завод",
    body: "Може би адресът е сгрешен или страницата е преместена. Ето откъде да продължите:",
    homeCta: "Към началото",
    contactCta: "Безплатен разговор",
    contactHref: "/kontakt",
  },
  globalError: {
    lang: "bg",
    title: BG_DRAFTS.globalErrorTitle.value,
    body: BG_DRAFTS.globalErrorBody.value,
    reload: BG_DRAFTS.globalErrorReload.value,
  },
};
