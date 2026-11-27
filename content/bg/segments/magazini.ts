import { isGateOpen } from "@/content/bg/gates";
import type { ContentBlock, SegmentPageData } from "@/content/bg/types";

const SOURCE_FILE = "04-onlayn-magazini.md";

/**
 * Atomic switch for decision #3 (ZAV-69 / BG_GATES.creativeSla04):
 * all three occurrences of the monthly creative volume promise switch together
 * between the file-04 verbatim phrasing and the 00-README.md fallback phrasing.
 */
export const MAGAZINI_CREATIVE_SLA_VARIANTS = {
  open: {
    featureGridCard: "Поне 4 нови концепции на месец и A/B тест с победител.",
    featureSectionPoint: "Поне 4 нови концепции на месец → кампаниите не поскъпват от умора",
    cardGridBarrier: "Поне 4 нови концепции на месец в срок, записан в договора.",
  },
  closed: {
    featureGridCard: "Нови концепции всеки месец и A/B тест с победител.",
    featureSectionPoint: "Нови концепции всеки месец → кампаниите не поскъпват от умора",
    cardGridBarrier: "Нови концепции всеки месец в срок, записан в договора.",
  },
} as const;

const MAGAZINI_HERO: ContentBlock<SegmentPageData["hero"]> = {
  source: { file: SOURCE_FILE, block: "Hero" },
  wave: 1,
  data: {
    eyebrow: "Онлайн магазини",
    title: "Върнете рекламата на печалба.",
    description:
      "За онлайн магазини с 11–200 души: одит, нови криейтиви всеки месец и един отчет по платени поръчки. Целта е по-ниска цена на продажба от същия бюджет.",
    actions: [
      {
        text: "Запазете безплатен разговор",
        href: "/kontakt",
        variant: "primary",
        location: "hero",
      },
      {
        text: "Вижте пакетите",
        href: "/tseni",
        variant: "secondary",
        location: "hero",
      },
    ],
  },
};

function buildFeatureGrid(
  creativeSlaOpen: boolean,
): ContentBlock<SegmentPageData["featureGrid"]> {
  const sla = creativeSlaOpen
    ? MAGAZINI_CREATIVE_SLA_VARIANTS.open
    : MAGAZINI_CREATIVE_SLA_VARIANTS.closed;
  return {
    source: { file: SOURCE_FILE, block: "Feature grid" },
    wave: 1,
    gate: "creativeSla04",
    data: {
      title: "Какво променяме.",
      items: [
        {
          title: "Причината, не предположения",
          body: "Одитът проверява кампании, проследяване, фийд и сайт и дава план за 30 дни.",
          illo: "hud-search",
        },
        {
          title: "Криейтив, който не прегаря",
          body: sla.featureGridCard,
          illo: "hud-orbit",
        },
        {
          title: "Един отчет за всички канали",
          body: "Meta, Google, имейл и Viber — оценени по една и съща конверсия.",
          illo: "hud-signals",
        },
        {
          title: "Платени, не само направени поръчки",
          body: "Броим продажбите, които наистина влизат в касата — важно при наложен платеж.",
          illo: "hud-billing-stack",
        },
      ],
    },
  };
}

const MAGAZINI_PROCESS_STEPS: ContentBlock<SegmentPageData["processSteps"]> = {
  source: { file: SOURCE_FILE, block: "Process steps" },
  wave: 1,
  data: {
    title: "Първите 30 дни.",
    steps: [
      {
        title: "Разговор",
        body: "Разказвате за маржа, каналите и сезона.",
      },
      {
        title: "Одит на рекламата и проследяването",
        body: "Намираме защо поскъпна продажбата.",
      },
      {
        title: "Пилот с цел за цена на продажба",
        body: "Работим срещу базова линия и цел, свързана с маржа. Одит и пилот — от 690 € общо.",
      },
    ],
  },
};

const MAGAZINI_MIRROR_QUESTIONS: ContentBlock<SegmentPageData["mirrorQuestions"]> = {
  source: { file: SOURCE_FILE, block: "Блок «Разпознавате ли се?»" },
  wave: 1,
  data: {
    title: "Разпознавате ли се?",
    questions: [
      "Искате да растете онлайн, без да строите цял маркетинг отдел?",
      "Цената на продажба расте от три месеца?",
      "Meta поскъпна, а рекламите вече не носят продажби?",
      "Питате се „само при мен ли е така?“",
      "Не знаете кой канал реално носи купувачи?",
    ],
  },
};

const MAGAZINI_FEATURE_SECTION_1: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 1" },
  wave: 1,
  data: {
    id: "pechalba-ot-reklamata",
    eyebrow: "Печалба от рекламата",
    title: "Знаете защо поскъпна продажбата.",
    body: "И какво променяме през следващите 30 дни.",
    points: [
      "Проверка на акаунтите и потвърждението на рекламодателя в Meta → рекламата не спира",
      "Цел за CAC или ROAS, свързана с маржа → печалба, не само оборот",
      "Бюджет към кампаниите с най-ниска цена на продажба → повече продажби от същите пари",
      "Следене за ботове и нецелеви кликове → бюджетът отива за купувачи",
    ],
    illo: "hud-cost-meter",
  },
};

function buildFeatureSection2(
  creativeSlaOpen: boolean,
): ContentBlock<SegmentPageData["featureSections"][number]> {
  const sla = creativeSlaOpen
    ? MAGAZINI_CREATIVE_SLA_VARIANTS.open
    : MAGAZINI_CREATIVE_SLA_VARIANTS.closed;
  return {
    source: { file: SOURCE_FILE, block: "Feature section 2" },
    wave: 1,
    gate: "creativeSla04",
    data: {
      id: "krieytivi-i-fiyd",
      eyebrow: "Криейтиви и фийд",
      title: "Нови криейтиви, преди старите да изгорят.",
      body: "AI прави черновите, човек избира и отговаря.",
      points: [
        sla.featureSectionPoint,
        "Описания на продукти и преводи за целия фийд → рекламата показва правилните продукти",
        "A/B тестове с ясен победител → всеки месец по-добре",
        "Подготовка за сезонните пикове навреме → не изпускате най-силните седмици",
      ],
      illo: "hud-latency-heatmap",
    },
  };
}

const MAGAZINI_FEATURE_SECTION_3: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 3" },
  wave: 1,
  data: {
    id: "yasna-kartina",
    eyebrow: "Ясна картина",
    title: "Виждате кой канал носи купувачи.",
    body: "Един отчет вместо пет рекламни кабинета.",
    points: [
      "Проверка как поръчките стигат до Meta, Google и анализите → данните са верни",
      "Една конверсия за всички канали → без двойно броене",
      "Отчет по платени поръчки → ROAS, който съвпада с касата",
      "Имейл и Viber като допълнителни канали → по-малка зависимост от една платформа",
    ],
    illo: "hud-audit-log",
  },
};

const MAGAZINI_FEATURE_SECTION_4: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 4" },
  wave: 1,
  data: {
    id: "kade-otivame",
    eyebrow: "Къде отиваме",
    title: "Растете, без да строите маркетинг отдел.",
    body: "Оборотът расте, а делът на рекламата в него — не.",
    points: [
      "Увереност да добавяте бюджет",
      "Без ежедневно гасене на пожари",
      "Решения за бюджета на факти",
      "Преход към „Мащаб“ и KPI бонус, когато цифрите са там",
    ],
    illo: "hud-monitoring",
  },
};

function buildCardGrid(creativeSlaOpen: boolean): ContentBlock<SegmentPageData["cardGrid"]> {
  const sla = creativeSlaOpen
    ? MAGAZINI_CREATIVE_SLA_VARIANTS.open
    : MAGAZINI_CREATIVE_SLA_VARIANTS.closed;
  return {
    source: { file: SOURCE_FILE, block: "Card grid" },
    wave: 1,
    gate: "creativeSla04",
    data: {
      items: [
        {
          title: "„Meta просто спря да работи.“",
          body: "Проверяваме акаунтите, потвърждението на рекламодателя и кампаниите и следим промените в платформите вместо вас.",
        },
        {
          title: "„Кабинетът показва едно, касата — друго.“",
          body: "Сверяваме проследяването и отчитаме по платени поръчки.",
        },
        {
          title: "„Криейтивите изгарят за седмици.“",
          body: sla.cardGridBarrier,
        },
        {
          title: "„Агенциите са скъпи.“",
          body: "Пакетът за 2–3 канала е от 690 € — по-малко от половината от средната заплата на маркетолог във Варна.",
        },
      ],
    },
  };
}

const MAGAZINI_FAQ: ContentBlock<SegmentPageData["faq"]> = {
  source: { file: SOURCE_FILE, block: "FAQ" },
  wave: 1,
  data: {
    items: [
      {
        question: "Защо да не я правим сами?",
        answer:
          "Ако имате време и човек — правете я. Ние влизаме, когато цената на продажба расте и няма кой да разбере защо.",
      },
      {
        question: "Защо не performance служител?",
        answer:
          "Маркетолог във Варна струва 980–2 300 € бруто на месец (средно ≈1 640 €) плюс осигуровки и трудно се намира. „Растеж“ е от 690 € и включва стратег, криейтив и анализи.",
      },
      {
        question: "Каква платформа трябва да имам?",
        answer:
          "WooCommerce, Shopify, друга платформа или собствена разработка — няма значение. Проверяваме как платформата ви предава поръчките към Meta, Google и анализите.",
      },
      {
        question: "Има ли бонус за резултат?",
        answer:
          "При „Мащаб“ можем да се договорим за бонус 5–15% при постигнат KPI спрямо базовата линия.",
      },
      {
        question: "Работите ли с eMAG и други маркетплейси?",
        answer:
          "Управлението на магазин в eMAG или друг маркетплейс не е в пакетите ни. Фокусът ни е собственият ви сайт, а имейл и Viber водим като допълнителни канали.",
      },
    ],
  },
};

const MAGAZINI_CTA_BAND: ContentBlock<SegmentPageData["ctaBand"]> = {
  source: { file: SOURCE_FILE, block: "CTA band" },
  wave: 1,
  data: {
    title: "Да видим защо поскъпна продажбата.",
    description: "30 минути разговор. Носете цифрите от последните три месеца.",
    actions: [
      {
        text: "Запазете безплатен разговор",
        href: "/kontakt",
        variant: "primary",
        location: "footer_cta",
      },
    ],
  },
};

export function getMagaziniContentBlocks(
  creativeSlaOpen: boolean = isGateOpen("creativeSla04"),
) {
  return [
    MAGAZINI_HERO,
    buildFeatureGrid(creativeSlaOpen),
    MAGAZINI_PROCESS_STEPS,
    MAGAZINI_MIRROR_QUESTIONS,
    MAGAZINI_FEATURE_SECTION_1,
    buildFeatureSection2(creativeSlaOpen),
    MAGAZINI_FEATURE_SECTION_3,
    MAGAZINI_FEATURE_SECTION_4,
    buildCardGrid(creativeSlaOpen),
    MAGAZINI_FAQ,
    MAGAZINI_CTA_BAND,
  ] as const;
}

export function getMagaziniSegment(
  creativeSlaOpen: boolean = isGateOpen("creativeSla04"),
): SegmentPageData {
  const featureGrid = buildFeatureGrid(creativeSlaOpen);
  const featureSection2 = buildFeatureSection2(creativeSlaOpen);
  const cardGrid = buildCardGrid(creativeSlaOpen);

  return {
    slug: "onlayn-magazini",
    tema: "magazin",
    source: { file: SOURCE_FILE, block: "Онлайн магазини" },
    wave: 1,
    hero: MAGAZINI_HERO.data,
    featureGrid: featureGrid.data,
    processSteps: MAGAZINI_PROCESS_STEPS.data,
    mirrorQuestions: MAGAZINI_MIRROR_QUESTIONS.data,
    featureSections: [
      MAGAZINI_FEATURE_SECTION_1.data,
      featureSection2.data,
      MAGAZINI_FEATURE_SECTION_3.data,
      MAGAZINI_FEATURE_SECTION_4.data,
    ],
    cardGrid: cardGrid.data,
    faq: MAGAZINI_FAQ.data,
    ctaBand: MAGAZINI_CTA_BAND.data,
  };
}
