import type { ContentBlock, SegmentPageData } from "@/content/bg/types";

const SOURCE_FILE = "07-nedvizhimi-imoti.md";

const IMOTI_HERO: ContentBlock<SegmentPageData["hero"]> = {
  source: { file: SOURCE_FILE, block: "Hero" },
  wave: 1,
  data: {
    eyebrow: "Недвижими имоти",
    title: "Запитвания за проекта ви и цена на всеки оглед.",
    description:
      "За строители и агенции за недвижими имоти: лендинг и материали за проекта, реклама за запитвания на няколко езика и CRM, в която запитването не изстива. Всеки месец знаете колко струва един оглед.",
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

const IMOTI_FEATURE_GRID: ContentBlock<SegmentPageData["featureGrid"]> = {
  source: { file: SOURCE_FILE, block: "Feature grid" },
  wave: 1,
  data: {
    title: "Какво получавате.",
    items: [
      {
        title: "Цена на оглед",
        body: "Главната цифра в отчета: колко струва едно запитване и един оглед.",
        illo: "hud-cost-meter",
      },
      {
        title: "Материали, които продават онлайн",
        body: "Видео, разпределения и текстове, от които купувачът разбира апартамента преди огледа. Архитектурните визуализации — с ваш или препоръчан изпълнител.",
        illo: "hud-latency-heatmap",
      },
      {
        title: "Запитване, което не изстива",
        body: "CRM, бърз първи отговор и напомняне за огледа.",
        illo: "hud-alerts",
      },
      {
        title: "Купувачи от чужбина",
        body: "Реклами и страници на езиците на вашите купувачи.",
        illo: "hud-edge",
      },
    ],
  },
};

const IMOTI_PROCESS_STEPS: ContentBlock<SegmentPageData["processSteps"]> = {
  source: { file: SOURCE_FILE, block: "Process steps" },
  wave: 1,
  data: {
    title: "Как започваме.",
    steps: [
      {
        title: "Разговор",
        body: "Колко апартамента и до кога трябва да продадете.",
      },
      {
        title: "Одит на продажбите на проекта",
        body: "Откъде идват запитванията и къде се губят.",
      },
      {
        title: "Пилот 30 дни за един проект",
        body: "Одит и пилот — от 690 € общо. Цена на оглед още в първия отчет.",
      },
    ],
  },
};

const IMOTI_MIRROR_QUESTIONS: ContentBlock<SegmentPageData["mirrorQuestions"]> = {
  source: { file: SOURCE_FILE, block: "Блок «Разпознавате ли се?»" },
  wave: 1,
  data: {
    title: "Разпознавате ли се?",
    questions: [
      "Искате да продадете проекта по график?",
      "Сделките намаляват, а цените и разходите за строеж растат?",
      "Сайт имате, но реклама и съдържание не се виждат?",
      "Запитванията от порталите са разпилени?",
      "Не знаете колко струва един оглед?",
    ],
  },
};

const IMOTI_FEATURE_SECTION_1: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 1" },
  wave: 1,
  data: {
    id: "zapusk-na-proekta",
    eyebrow: "Запуск на проекта",
    title: "Един проект — една страница, която продава.",
    body: "Проектен запуск плюс месечна работа по запитванията.",
    points: [
      "Лендинг с форма за оглед → рекламата има къде да води",
      "Видео и разпределения, визуализации — с партньор → на оглед идват подходящите купувачи",
      "Реклама в Meta и Google за запитвания → поток от купувачи за проекта",
      "Отделен отчет за запитванията от порталите → сравнявате каналите",
    ],
    illo: "interface-choose-plan",
  },
};

const IMOTI_FEATURE_SECTION_2: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 2" },
  wave: 1,
  data: {
    id: "prodazhbi",
    eyebrow: "Продажби",
    title: "От запитване до оглед — без изгубени хора.",
    body: "Всяко запитване влиза в CRM и има статус.",
    points: [
      "CRM фуния за проекта → нищо не се губи",
      "Въпроси във формата, които отсяват нецелевите → продавачите губят по-малко време",
      "Бърз първи отговор → запитването не изстива",
      "Напомняне за огледа по Viber → повече хора стигат до огледа",
    ],
    illo: "hud-signals",
  },
};

const IMOTI_FEATURE_SECTION_3: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 3" },
  wave: 1,
  data: {
    id: "chuzhdestranni-kupuvachi",
    eyebrow: "Чуждестранни купувачи",
    title: "Покажете проекта на езика на купувача.",
    body: "Отделни страници и реклами за всеки пазар.",
    points: [
      "Страници на английски, немски, полски и украински — според купувачите на проекта → проектът се разбира без преводач",
      "Реклами, насочени по пазари → по-широк кръг купувачи",
      "Отделно отчитане на всеки пазар → знаете кой пазар работи",
      "Човешка проверка на всеки превод → без грешки в цени и условия",
    ],
    illo: "hud-orbit",
  },
};

const IMOTI_FEATURE_SECTION_4: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 4" },
  wave: 1,
  data: {
    id: "kade-otivame",
    eyebrow: "Къде отиваме",
    title: "Продавате по график и при бавен пазар.",
    body: "Знаете какво ви носи всяко евро реклама.",
    points: [
      "Контрол над продажбите",
      "Цифри за собственика и инвеститора",
      "Процес, който пренасяте в следващия проект",
      "Решения за бюджета на факти",
    ],
    illo: "hud-monitoring",
  },
};

const IMOTI_CARD_GRID: ContentBlock<SegmentPageData["cardGrid"]> = {
  source: { file: SOURCE_FILE, block: "Card grid" },
  wave: 1,
  data: {
    items: [
      {
        title: "„Пазарът пада — не е време за харчене.“",
        body: "Точно затова започваме с кратък пилот за един проект и цена на оглед в първия отчет.",
      },
      {
        title: "„Запитванията се губят.“",
        body: "CRM и бърз отговор са част от запуска, а не допълнение.",
      },
      {
        title: "„Никой не знае колко струва оглед.“",
        body: "Това е главната цифра в отчета ни от първия месец.",
      },
      {
        title: "„Имаме портали.“",
        body: "Порталите остават. Отчитаме запитванията от тях отделно, за да сравните каналите.",
      },
    ],
  },
};

const IMOTI_FAQ: ContentBlock<SegmentPageData["faq"]> = {
  source: { file: SOURCE_FILE, block: "FAQ" },
  wave: 1,
  data: {
    items: [
      {
        question: "Защо не само портали?",
        answer:
          "Там проектът ви е сред обявите на над 3 600 агенции. Собствената реклама и лендинг носят запитвания само за вашия проект.",
      },
      {
        question: "Работите ли с брокери?",
        answer:
          "Да. Отчитаме отделно запитванията от брокери и от реклама, за да е ясно кой какво носи.",
      },
      {
        question: "Колко трае пилотът?",
        answer: "30 дни за един проект: одит и първи кампании, от 690 € общо.",
      },
      {
        question: "Правите ли архитектурни визуализации?",
        answer:
          "Видео и визуални материали правим с AI, с човешка проверка и ясно обозначение, че са създадени с AI. Архитектурните визуализации — с ваш или препоръчан изпълнител.",
      },
      {
        question: "Колко струва?",
        answer:
          "Лендинг и материали за проекта — от 890 € еднократно. Месечната работа по запитванията — пакет „Растеж“ от 690 € на месец. Точната цена — след одита на проекта.",
      },
    ],
  },
};

const IMOTI_CTA_BAND: ContentBlock<SegmentPageData["ctaBand"]> = {
  source: { file: SOURCE_FILE, block: "CTA band" },
  wave: 1,
  data: {
    title: "Да изчислим цената на оглед за проекта ви.",
    description: "30 минути разговор за проекта и сроковете.",
    actions: [
      {
        text: "Запазете безплатен разговор",
        href: "/kontakt?tema=imoti",
        variant: "primary",
        location: "footer_cta",
      },
    ],
  },
};

export const IMOTI_CONTENT_BLOCKS = [
  IMOTI_HERO,
  IMOTI_FEATURE_GRID,
  IMOTI_PROCESS_STEPS,
  IMOTI_MIRROR_QUESTIONS,
  IMOTI_FEATURE_SECTION_1,
  IMOTI_FEATURE_SECTION_2,
  IMOTI_FEATURE_SECTION_3,
  IMOTI_FEATURE_SECTION_4,
  IMOTI_CARD_GRID,
  IMOTI_FAQ,
  IMOTI_CTA_BAND,
] as const;

export const IMOTI_SEGMENT: SegmentPageData = {
  slug: "nedvizhimi-imoti",
  tema: "imoti",
  source: { file: SOURCE_FILE, block: "Недвижими имоти" },
  wave: 1,
  hero: IMOTI_HERO.data,
  featureGrid: IMOTI_FEATURE_GRID.data,
  processSteps: IMOTI_PROCESS_STEPS.data,
  mirrorQuestions: IMOTI_MIRROR_QUESTIONS.data,
  featureSections: [
    IMOTI_FEATURE_SECTION_1.data,
    IMOTI_FEATURE_SECTION_2.data,
    IMOTI_FEATURE_SECTION_3.data,
    IMOTI_FEATURE_SECTION_4.data,
  ],
  cardGrid: IMOTI_CARD_GRID.data,
  faq: IMOTI_FAQ.data,
  ctaBand: IMOTI_CTA_BAND.data,
};
