import type { ComparisonColumn, ComparisonGroup } from "@/components/blocks/comparison-table";
import type { IlloName } from "@/components/illos";
import { COMPANY } from "./company";
import { BG_DRAFTS } from "./drafts";
import { isGateOpen, type GateKey } from "./gates";
import { FOUNDER_PHOTOS, type ContentBlock } from "./types";

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

export type HomeFeatureGridItemData = {
  readonly title: string;
  readonly body: string;
  readonly illo: IlloName;
};

export type HomeFeatureGridData = {
  readonly title: string;
  readonly items: readonly HomeFeatureGridItemData[];
};

export type HomeProcessStepsData = {
  readonly title: string;
  readonly steps: readonly {
    readonly title: string;
    readonly body: string;
  }[];
  readonly note: string;
};

export type HomeSegmentCardData = {
  readonly title: string;
  readonly body: string;
  readonly ctaLabel: string;
  readonly href: string;
  readonly gate?: GateKey;
};

export type HomeSegmentsData = {
  readonly id: string;
  readonly title: string;
  readonly items: readonly HomeSegmentCardData[];
};

export type HomeBarriersData = {
  readonly title: string;
  readonly items: readonly {
    readonly title: string;
    readonly body: string;
  }[];
};

export type HomeFounderData = {
  readonly title: string;
  readonly bio: string;
  readonly photo: typeof FOUNDER_PHOTOS.square;
  readonly actions: readonly {
    readonly label: string;
    readonly href: string;
    readonly variant: "primary" | "secondary";
    readonly external?: boolean;
  }[];
};

export type HomePilotBannerData = {
  readonly text: string;
  readonly ctaLabel: string;
  readonly href: string;
  readonly location: string;
};

export type HomeMirrorQuestionsData = {
  readonly title: string;
  readonly questions: readonly string[];
  readonly cta: {
    readonly label: string;
    readonly href: string;
    readonly location: string;
  };
};

export type HomeComparisonData = {
  readonly title: string;
  readonly tabsAriaLabel: string;
  readonly columns: readonly ComparisonColumn[];
  readonly groups: readonly ComparisonGroup[];
};

export type HomeFaqData = {
  readonly title: string;
  readonly items: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
};

export type HomeCtaBandData = {
  readonly title: string;
  readonly description: string;
  readonly cta: {
    readonly text: string;
    readonly href: string;
    readonly location: string;
  };
};

/** Block 1: Hero (02-nachalo.md). */
export const HOME_HERO: ContentBlock<HomeHeroData> = {
  source: { file: "02-nachalo.md", block: "Hero" },
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

/** Block 2: Feature grid (02-nachalo.md). */
export const HOME_FEATURE_GRID: ContentBlock<HomeFeatureGridData> = {
  source: { file: "02-nachalo.md", block: "Feature grid" },
  wave: 1,
  data: {
    title: "Какво получавате от първия месец.",
    items: [
      {
        title: "Базова линия",
        body: "Записваме цифрите ви преди старта, за да сравним честно „преди“ и „след“.",
        illo: "hud-monitoring",
      },
      {
        title: "Отчет на езика на продажбите",
        body: "Запитвания, сделки и цена на клиент — не само кликове и обхват.",
        illo: "hud-cost-meter",
      },
      {
        title: "Акаунтите са ваши",
        body: "Рекламните акаунти, пикселът и профилът в Google са на името на фирмата. Ние имаме само достъп.",
        illo: "hud-audit-log",
      },
      {
        title: "Човек, който отговаря",
        body: "Един стратег познава бизнеса ви и отговаря за резултата. AI му дава скорост.",
        illo: "hud-signals",
      },
    ],
  },
};

/** Block 3: Process steps (02-nachalo.md). */
export const HOME_PROCESS_STEPS: ContentBlock<HomeProcessStepsData> = {
  source: { file: "02-nachalo.md", block: "Process steps" },
  wave: 1,
  data: {
    title: "Започнете с 3 стъпки.",
    steps: [
      {
        title: "Безплатен разговор",
        body: "30 минути: разказвате за бизнеса, ние питаме за продажбите.",
      },
      {
        title: "Одит и план за 90 дни",
        body: "Първата седмица: проверяваме рекламата, анализите и пътя до продажбата. Отделно струва от 490 €, в пилота е включен.",
      },
      {
        title: "Пилот 30 дни",
        body: "Първи кампании, фиксирана цена и отчет „преди / след“. Одит и пилот — от 690 € общо.",
      },
    ],
    note: "След пилота решавате. Ако продължим — минимум 3 месеца с плащане месечно предварително. Ако не — спираме, а акаунтите и данните остават ваши.",
  },
};

/** Block 4: Card grid «За кого работим» (02-nachalo.md, #resheniya, HM-02). */
export const HOME_SEGMENTS: ContentBlock<HomeSegmentsData> = {
  source: { file: "02-nachalo.md", block: "Card grid «За кого работим»" },
  wave: 1,
  data: {
    id: "resheniya",
    title: "За кого работим.",
    items: [
      {
        title: "Смяна на агенция",
        body: "Месеци плащате, а продажбите стоят? Сменяме изпълнителя поетапно: проверка на акаунтите и базова линия от първия ден.",
        ctaLabel: "Как сменяме агенция →",
        href: "/smyana-na-agentsiya",
      },
      {
        title: "Онлайн магазини",
        body: "Продажбата от реклама поскъпва? Нови криейтиви всеки месец и отчет по платени, не по направени поръчки.",
        ctaLabel: "Решения за онлайн магазини →",
        href: "/onlayn-magazini",
      },
      {
        title: "Услуги и B2B",
        body: "Правите маркетинг, но цифрите не мърдат? Маркетинг отдел на абонамент: план, реклама, CRM и отчет за продажбите.",
        ctaLabel: "Маркетинг отдел на абонамент →",
        href: "/uslugi-i-b2b",
      },
      {
        title: "Хотели",
        body: "Сезон 2027 се продава сега. Повече директни резервации — с кампании на езиците на гостите ви.",
        ctaLabel: "Решения за хотели →",
        href: "/hoteli",
        gate: "hotels",
      },
      {
        title: "Недвижими имоти",
        body: "Пазарът забави? Запитвания за конкретния проект и цена на оглед във всеки отчет.",
        ctaLabel: "Решения за строители →",
        href: "/nedvizhimi-imoti",
      },
    ],
  },
};

/** Returns only published segment cards for #resheniya (4 while `hotels` gate is closed, 5 when open). */
export function getPublishedHomeSegments(): readonly HomeSegmentCardData[] {
  return HOME_SEGMENTS.data.items.filter((item) => !item.gate || isGateOpen(item.gate));
}

/** Block 5: Card grid «Какво обещаваме — и какво не.» (02-nachalo.md). */
export const HOME_BARRIERS: ContentBlock<HomeBarriersData> = {
  source: { file: "02-nachalo.md", block: "Card grid (бар'єри)" },
  wave: 1,
  data: {
    title: "Какво обещаваме — и какво не.",
    items: [
      {
        title: "Не държим акаунтите ви",
        body: "Всичко е на името на фирмата ви. Ако си тръгнете, нищо не изчезва.",
      },
      {
        title: "Не обещаваме „гарантирани продажби“",
        body: "Гарантираме процеса: срокове, отчет и човек, който отговаря.",
      },
      {
        title: "Не ви връзваме за година",
        body: "Започваме с пилот 30 дни. След него решавате: ако продължим — минимум 3 месеца, после можете да спрете.",
      },
      {
        title: "Не крием цените",
        body: "Пакетите и цените са на сайта. Само 23% от агенциите и студията в България публикуват цени.",
      },
    ],
  },
};

/** Block 6: «Кой отговаря» (02-nachalo.md, HM-03). */
export const HOME_FOUNDER: ContentBlock<HomeFounderData> = {
  source: { file: "02-nachalo.md", block: "Кой отговаря" },
  wave: 1,
  data: {
    title: "Кой отговаря за резултата.",
    bio: "Егор Гончаренко, основател на Маркетинг Завод. Над 8 години в продуктов дизайн и проучвания: започвам от данните, записвам базовата линия и меря всяка промяна. Отговарям лично за всеки пилот.",
    photo: FOUNDER_PHOTOS.square,
    actions: [
      {
        label: "Пишете ми на имейл",
        href: COMPANY.emailHref,
        variant: "primary",
      },
      {
        label: "LinkedIn",
        href: COMPANY.linkedinHref,
        variant: "secondary",
        external: true,
      },
    ],
  },
};

/** Block 7: Банер «Пилот 30 дни» (02-nachalo.md, HM-04). */
export const HOME_PILOT_BANNER: ContentBlock<HomePilotBannerData> = {
  source: { file: "02-nachalo.md", block: "Банер «Пилот 30 дни»" },
  wave: 1,
  data: {
    text: "Първите ни кейси се пишат сега. Пилот 30 дни: одит, първи кампании и отчет „преди / след“ — от 690 € общо. Приемаме 3 фирми до февруари 2027.",
    ctaLabel: "Вижте пилота →",
    href: "/keysi",
    location: "home_pilot_banner",
  },
};

/** Block 8: «Звучи ли ви познато?» (02-nachalo.md, HM-05). */
export const HOME_MIRROR_QUESTIONS: ContentBlock<HomeMirrorQuestionsData> = {
  source: { file: "02-nachalo.md", block: "Блок «Звучи ли ви познато?»" },
  wave: 1,
  data: {
    title: "Звучи ли ви познато?",
    questions: [
      "Знаете, че маркетингът не работи както трябва, но не знаете откъде да започнете?",
      "Не можете да намерите човек, който да го подреди?",
      "Плащате за реклама, а цифрите не мърдат?",
    ],
    cta: {
      label: "Започнете с безплатен разговор →",
      href: "/kontakt",
      location: "home_mirror_questions",
    },
  },
};

/** Block 9: Comparison table «Маркетинг Завод или…?» (02-nachalo.md, HM-06). */
export const HOME_COMPARISON: ContentBlock<HomeComparisonData> = {
  source: { file: "02-nachalo.md", block: "Comparison table" },
  wave: 1,
  data: {
    title: "Маркетинг Завод или…?",
    tabsAriaLabel: BG_DRAFTS.alternativesTabsAria.value,
    columns: [
      { id: "employee", name: "Служител" },
      { id: "freelancer", name: "Фрилансер" },
      { id: "diy-ai", name: "Сами с AI" },
      { id: "marketing-zavod", name: "Маркетинг Завод", highlight: true },
    ],
    groups: [
      {
        rows: [
          {
            feature: "Цена",
            tone: "grey",
            cells: [
              {
                text: "≈1 640 € бруто на месец + осигуровки (средна заплата на маркетолог във Варна)",
              },
              { text: "150–400 € на месец за канал" },
              { text: "от ≈16 € на месец за инструмент + вашето време" },
              { text: "от 290 € за канал, от 690 € за 2–3 канала" },
            ],
          },
          {
            feature: "Стратегия",
            tone: "black",
            cells: [
              { text: "Зависи от човека" },
              { text: "Рядко" },
              { text: "Вие" },
              { text: "Стратег в пакета" },
            ],
          },
          {
            feature: "Реклама, съдържание и анализи",
            tone: "grey",
            cells: [
              { text: "Един човек трудно покрива всичко" },
              { text: "Обикновено един канал" },
              { text: "Колкото време имате" },
              { text: "2–3 канала: стратег и проверени изпълнители" },
            ],
          },
          {
            feature: "Ако човекът си тръгне",
            tone: "black",
            cells: [
              { text: "Започвате отначало" },
              { text: "Търсите нов" },
              { text: "—" },
              { text: "Процесите и достъпите остават у вас" },
            ],
          },
        ],
      },
    ],
  },
};

/** Block 10: FAQ (02-nachalo.md). */
export const HOME_FAQ: ContentBlock<HomeFaqData> = {
  source: { file: "02-nachalo.md", block: "FAQ" },
  wave: 1,
  data: {
    title: "Често задавани въпроси.",
    items: [
      {
        question: "Гарантирате ли резултат?",
        answer:
          "Не обещаваме „гарантирани продажби“ — честен изпълнител не може да го направи. Гарантираме процеса: базова линия, срокове, месечен отчет и човек, който отговаря. Ако резултатът не идва, казваме защо и какво променяме.",
      },
      {
        question: "Колко струва?",
        answer:
          "Пакетите започват от 290 € на месец — цените са крайни. Основният пакет „Растеж“ за 2–3 канала е от 690 €. Първите 30 дни — одит и пилот — струват от 690 € общо. Всички цени са на страница „Цени“.",
      },
      {
        question: "Трябва ли да подпиша за година?",
        answer:
          "Не. Започваме с пилот за 30 дни: одит, първи кампании и отчет „преди / след“. След него решавате. Ако продължим — минимум 3 месеца с плащане месечно предварително, после можете да спрете.",
      },
      {
        question: "Чии са рекламните акаунти?",
        answer:
          "Ваши. Google Ads, Meta, пикселът и профилът в Google са на името на фирмата, а ние имаме достъп. Ако сега са на името на агенцията ви, помагаме да ги прехвърлите.",
      },
      {
        question: "Използвате ли AI?",
        answer:
          "Да — за чернови, варианти и анализи. Всичко, което излиза навън, проверява човек, а AI съдържанието маркираме там, където законът го изисква.",
      },
      {
        question: "Работите ли само във Варна?",
        answer:
          "Базата ни е във Варна, а клиентите ни могат да са от цяла България. Срещи на живо — във Варна по уговорка, онлайн — навсякъде.",
      },
    ],
  },
};

/** Block 11: CTA band (02-nachalo.md). */
export const HOME_CTA_BAND: ContentBlock<HomeCtaBandData> = {
  source: { file: "02-nachalo.md", block: "CTA band" },
  wave: 1,
  data: {
    title: "Да видим цифрите ви.",
    description:
      "30 минути разговор без ангажимент. Ще ви кажем честно дали и как можем да помогнем.",
    cta: {
      text: "Запазете безплатен разговор",
      href: "/kontakt",
      location: "footer_cta",
    },
  },
};

/** Ordered sequence of blocks rendered on the Bulgarian home page (HM-01, PG-A1). */
export const BG_HOME_BLOCK_ORDER = [
  "hero",
  "feature-grid",
  "process-steps",
  "card-grid",
  "card-grid",
  "founder-card",
  "pilot-banner",
  "mirror-questions",
  "comparison-table",
  "faq",
  "cta-band",
] as const;

export const BG_HOME_CONTENT_BLOCKS: readonly ContentBlock<unknown>[] = [
  HOME_HERO,
  HOME_FEATURE_GRID,
  HOME_PROCESS_STEPS,
  HOME_SEGMENTS,
  HOME_BARRIERS,
  HOME_FOUNDER,
  HOME_PILOT_BANNER,
  HOME_MIRROR_QUESTIONS,
  HOME_COMPARISON,
  HOME_FAQ,
  HOME_CTA_BAND,
];
