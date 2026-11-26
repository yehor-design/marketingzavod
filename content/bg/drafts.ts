import type { DraftEntry } from "./types";

/**
 * Structured registry of Bulgarian UI/service drafts from Spec 3A §6, 3B §6,
 * 4 §6, 5 §6 and 01-globalni-elementi.md cookie banner draft (ZAV-62).
 * Every string used in content/bg/ui.ts that is not verbatim in docs/site-texts/
 * must be registered here with its spec reference and date.
 */
export const BG_DRAFTS = {
  // Spec 3A §6 — Global chrome & pricing tables
  announcementCloseAria: {
    value: "Затваряне на съобщението",
    spec: "Специфікація 3А §6",
    date: "2026-11-20",
  },
  primaryNavAria: {
    value: "Основна навигация",
    spec: "Специфікація 3А §6",
    date: "2026-11-20",
  },
  openMenuAria: {
    value: "Отваряне на менюто",
    spec: "Специфікація 3А §6",
    date: "2026-11-20",
  },
  closeMenuAria: {
    value: "Затваряне на менюто",
    spec: "Специфікація 3А §6",
    date: "2026-11-20",
  },
  logoHomeAria: {
    value: "Маркетинг Завод — начало",
    spec: "Специфікація 3А §6",
    date: "2026-11-25",
  },
  founderLinkedinAria: {
    value: "LinkedIn на Егор Гончаренко",
    spec: "Специфікація 3А §6",
    date: "2026-11-20",
  },
  tableIncludedSr: {
    value: "Включено",
    spec: "Специфікація 3А §6",
    date: "2026-11-20",
  },
  tableNotIncludedSr: {
    value: "Не е включено",
    spec: "Специфікація 3А §6",
    date: "2026-11-20",
  },
  pricingTabsAria: {
    value: "Изберете пакет",
    spec: "Специфікація 3А §6",
    date: "2026-11-20",
  },
  alternativesTabsAria: {
    value: "Изберете вариант",
    spec: "Специфікація 3А §6",
    date: "2026-11-20",
  },

  // Spec 3B §6 — Checklist, blog & global error
  checklistIncompletePrefix: {
    value: "Отговорете на всички въпроси, за да видите резултата. Отговорени:",
    spec: "Специфікація 3Б §6",
    date: "2026-11-20",
  },
  checklistIncompleteSuffix: {
    value: "от 13.",
    spec: "Специфікація 3Б §6",
    date: "2026-11-20",
  },
  checklistNoneUsed: {
    value:
      "Не използвате нито една от тези услуги. Ако започнете реклама, върнете се към чеклиста.",
    spec: "Специфікація 3Б §6",
    date: "2026-11-20",
  },
  checklistReset: {
    value: "Започнете отначало",
    spec: "Специфікація 3Б §6",
    date: "2026-11-20",
  },
  authorAvatarAlt: {
    value: "Егор Гончаренко",
    spec: "Специфікація 3Б §6",
    date: "2026-11-20",
  },
  blogLoadedMoreLive: {
    value: "Заредени са още статии.",
    spec: "Специфікація 3Б §6",
    date: "2026-11-20",
  },
  globalErrorTitle: {
    value: "Нещо се обърка.",
    spec: "Специфікація 3Б §6",
    date: "2026-11-20",
  },
  globalErrorBody: {
    value: "Опитайте да презаредите страницата.",
    spec: "Специфікація 3Б §6",
    date: "2026-11-20",
  },
  globalErrorReload: {
    value: "Презареждане",
    spec: "Специфікація 3Б §6",
    date: "2026-11-20",
  },

  // Spec 4 §6 — Form validation, submit states & transactional emails
  validationNameRequired: {
    value: "Въведете име.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  validationEmailInvalid: {
    value: "Въведете валиден имейл.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  validationPhoneInvalid: {
    value: "Въведете валиден телефонен номер.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  validationWebsiteInvalid: {
    value: "Въведете валиден адрес на сайт.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  validationTooLong: {
    value: "Текстът е твърде дълъг.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  validationNewsletterConsent: {
    value: "Отбележете полето, за да се абонирате.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  submitPending: {
    value: "Изпращане…",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  submitRateLimited: {
    value: "Изпратихте няколко съобщения подред. Опитайте отново след минута.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  submitNetworkError: {
    value: "Няма връзка. Проверете интернета и опитайте отново.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  submitServerError: {
    value: "Нещо се обърка. Опитайте отново или ни пишете на имейл.",
    spec: "Специфікація 4 §6",
    date: "2026-11-25",
  },
  newsletterSuccess: {
    value: "Почти готово: проверете имейла си и потвърдете абонамента.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  emailPdfSubject: {
    value: "Чеклист: кой притежава рекламните ви акаунти",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  emailPdfBodyBeforeLink: {
    value:
      "Здравейте! Изпращаме чеклиста, който поискахте — ето го в прикачения файл. Ако нещо не е на ваше име, пишете ни по имейл или запазете безплатен разговор:",
    spec: "Специфікація 4 §6",
    date: "2026-11-25",
  },
  emailPdfBodySignoff: {
    value: "Егор, Маркетинг Завод",
    spec: "Специфікація 4 §6",
    date: "2026-11-25",
  },
  emailConfirmSubject: {
    value: "Потвърдете абонамента за бележките на Маркетинг Завод",
    spec: "Специфікація 4 §6",
    date: "2026-11-25",
  },
  emailConfirmBody: {
    value:
      "Натиснете бутона, за да потвърдите, че искате да получавате бележките веднъж месечно. Ако не сте вие, просто игнорирайте това писмо.",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },
  emailConfirmButton: {
    value: "Потвърждавам",
    spec: "Специфікація 4 §6",
    date: "2026-11-20",
  },

  // Spec 5 §6 — Consent banner & settings panel
  consentBannerTitleSr: {
    value: "Съгласие за бисквитки",
    spec: "Специфікація 5 §6",
    date: "2026-11-20",
  },
  consentSettingsDescription: {
    value:
      "Необходимите бисквитки поддържат работата на сайта и винаги са включени. Всички останали са изключени, докато не ги включите.",
    spec: "Специфікація 5 §6",
    date: "2026-11-20",
  },
  consentSettingsCloseAria: {
    value: "Затваряне",
    spec: "Специфікація 5 §6",
    date: "2026-11-20",
  },
  consentNecessaryPurpose: {
    value: "Запомнят избора ви за бисквитките.",
    spec: "Специфікація 5 §6",
    date: "2026-11-20",
  },
  consentNecessaryServices: {
    value: "Маркетинг Завод",
    spec: "Специфікація 5 §6",
    date: "2026-11-25",
  },
  consentStatisticsPurpose: {
    value:
      "Показват ни как посетителите използват сайта и колко бързо се зарежда, включително записи на сесии със скрити полета на формите. Запомнят кампанията, от която сте дошли, за 90 дни.",
    spec: "Специфікація 5 §6",
    date: "2026-11-20",
  },
  consentStatisticsServices: {
    value: "Google Analytics, PostHog, Amplitude, Vercel Speed Insights",
    spec: "Специфікація 5 §6",
    date: "2026-11-20",
  },
  consentMarketingPurpose: {
    value: "Измерват дали рекламите ни водят до запитвания.",
    spec: "Специфікація 5 §6",
    date: "2026-11-20",
  },
  consentMarketingServices: {
    value: "Google Ads, Meta, LinkedIn",
    spec: "Специфікація 5 §6",
    date: "2026-11-20",
  },
  consentPreferencesPurpose: {
    value: "Запомнят затворения банер и отговорите в чеклиста за 30 дни.",
    spec: "Специфікація 5 §6",
    date: "2026-11-20",
  },
  consentPreferencesServices: {
    value: "Маркетинг Завод",
    spec: "Специфікація 5 §6",
    date: "2026-11-25",
  },
} as const satisfies Record<string, DraftEntry>;

export type BgDraftKey = keyof typeof BG_DRAFTS;
