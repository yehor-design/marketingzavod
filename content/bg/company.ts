import type { ContentSource } from "./types";

/**
 * Single source of truth for temporary individual-trader legal and contact
 * details (00-README.md decision 9, AB-04, GL-09, GL-11, LG-04).
 */
export const COMPANY = {
  source: {
    file: "01-globalni-elementi.md",
    block: "Footer",
  } satisfies ContentSource,
  brandName: "Маркетинг Завод",
  founderName: "Егор Гончаренко",
  domain: "marketingzavod.com",
  email: "zavodzamarketing@gmail.com",
  emailHref: "mailto:zavodzamarketing@gmail.com",
  linkedinHref: "https://www.linkedin.com/in/yehor-honcharenko",
  city: "Варна, България",
  meetingsLine: "Варна — срещи по уговорка",
  tagline: "Агенция от Варна за цяла България.",
  footerLegalLine:
    "Маркетинг Завод — търговско наименование на Егор Гончаренко · Варна, България · zavodzamarketing@gmail.com · Не сме регистрирани по ДДС.",
  copyright: "© 2026 Маркетинг Завод. Всички права запазени.",
} as const;

export const COMPANY_ABOUT_DETAILS = {
  source: {
    file: "14-za-nas.md",
    block: "Данни за фирмата",
  } satisfies ContentSource,
  text: "Маркетинг Завод е търговско наименование на Егор Гончаренко, Варна, България · zavodzamarketing@gmail.com. Не сме регистрирани по ДДС. Данните на фирмата ще публикуваме тук след регистрацията ѝ.",
} as const;

export const COMPANY_LEGAL_DETAILS = {
  source: {
    file: "27-legal-obshti-usloviya.md",
    block: "1. Кои сме ние",
  } satisfies ContentSource,
  providerName: "Егор Гончаренко, търговско наименование „Маркетинг Завод“",
  address: "Варна, България",
  email: "zavodzamarketing@gmail.com",
  vatStatus: "не сме регистрирани по ДДС",
} as const;
