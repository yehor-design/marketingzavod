import type { ContentBlock } from "./types";

export type HomeHeroData = {
  readonly title: string;
  readonly description: string;
  readonly primaryCta: {
    readonly text: string;
    readonly href: string;
  };
  readonly secondaryCta: {
    readonly text: string;
    readonly href: string;
  };
};

/** Sample Bulgarian page content block (Hero from 02-nachalo.md) verified by bg-content.test.ts. */
export const HOME_HERO: ContentBlock<HomeHeroData> = {
  source: {
    file: "02-nachalo.md",
    block: "Hero",
  },
  wave: 1,
  data: {
    title: "Повече клиенти от същия бюджет. С цифри, които виждате.",
    description:
      "Маркетинг Завод е агенция от Варна за фирми с 11–200 души в цяла България. Започваме от базова линия, работим на фиксирана цена и отчитаме на езика на продажбите. AI ни дава скорост, а за резултата отговаря човек.",
    primaryCta: {
      text: "Запазете безплатен разговор",
      href: "/kontakt",
    },
    secondaryCta: {
      text: "Вижте как работим",
      href: "/kak-rabotim",
    },
  },
};
