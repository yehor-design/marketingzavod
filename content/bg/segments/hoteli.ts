import type { ContentBlock, SegmentPageData } from "@/content/bg/types";

const SOURCE_FILE = "06-hoteli.md";

const HOTELI_HERO: ContentBlock<SegmentPageData["hero"]> = {
  source: { file: SOURCE_FILE, block: "Hero" },
  wave: 2,
  gate: "hotels",
  data: {
    eyebrow: "Хотели",
    title: "Повече директни резервации за сезон 2027.",
    description:
      "За хотели и комплекси по Черноморието: оферти за ранни записвания, кампании на езиците на гостите ви и отчет колко комисиони сте спестили. Сезонът се продава между ноември и март.",
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

const HOTELI_FEATURE_GRID: ContentBlock<SegmentPageData["featureGrid"]> = {
  source: { file: SOURCE_FILE, block: "Feature grid" },
  wave: 2,
  gate: "hotels",
  data: {
    title: "Какво получавате.",
    items: [
      {
        title: "Директни резервации",
        body: "Кампании и страници, от които гостът резервира директно, а не през посредник.",
        illo: "hud-traffic",
      },
      {
        title: "На езика на госта",
        body: "Румънски, немски, полски, украински и английски — според пазарите ви.",
        illo: "hud-edge",
      },
      {
        title: "Бърз отговор",
        body: "Viber асистент или чат бот отговаря веднага и прехвърля към човек.",
        illo: "hud-alerts",
      },
      {
        title: "Сезонът в цифри",
        body: "Директни резервации, приход и спестени комисиони в един отчет.",
        illo: "hud-cost-meter",
      },
    ],
  },
};

const HOTELI_PROCESS_STEPS: ContentBlock<SegmentPageData["processSteps"]> = {
  source: { file: SOURCE_FILE, block: "Process steps" },
  wave: 2,
  gate: "hotels",
  data: {
    title: "Подготовка за сезона.",
    steps: [
      {
        title: "Разговор",
        body: "Кои са пазарите ви и колко ви струва посредникът.",
      },
      {
        title: "Анализ на миналия сезон",
        body: "Откъде дойдоха гостите и колко отиде за комисиони.",
      },
      {
        title: "Кампания за ранни записвания",
        body: "Оферта, страница и реклама, докато медиите са по-евтини.",
      },
    ],
  },
};

const HOTELI_MIRROR_QUESTIONS: ContentBlock<SegmentPageData["mirrorQuestions"]> = {
  source: { file: SOURCE_FILE, block: "Блок «Разпознавате ли се?»" },
  wave: 2,
  gate: "hotels",
  data: {
    title: "Разпознавате ли се?",
    questions: [
      "Искате сезон, който зависи по-малко от посредници?",
      "Сезон 2027 трябва да е продаден до пролетта?",
      "Нощувките паднаха, а комисионите останаха?",
      "Не знаете как да говорите с румънските и полските си гости?",
      "Не знаете колко резервации ви носи собственият сайт?",
    ],
  },
};

const HOTELI_FEATURE_SECTION_1: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 1" },
  wave: 2,
  gate: "hotels",
  data: {
    id: "ranni-zapisvaniya",
    eyebrow: "Ранни записвания",
    title: "Продайте пика, преди да е започнал.",
    body: "Ранните записвания за лятото се продават през зимата.",
    points: [
      "Анализ на каналите от миналия сезон → знаете откъде идват гостите",
      "Оферта за ранно записване и страница за нея → гостът резервира директно",
      "Реклама през януари–февруари → по-ниски медийни цени",
      "Предложения към минали гости по имейл и Viber → повече повторни резервации",
      "От 14.11.2024 Booking не може да ви забрани по-ниска цена на собствения сайт → законен стимул за директна резервация",
    ],
    illo: "hud-latency-heatmap",
  },
};

const HOTELI_FEATURE_SECTION_2: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 2" },
  wave: 2,
  gate: "hotels",
  data: {
    id: "chuzhdestranni-gosti",
    eyebrow: "Чуждестранни гости",
    title: "Говорете с всеки гост на неговия език.",
    body: "Румънците дават една четвърт от нощувките в община Варна.",
    points: [
      "Страници и реклами за всеки пазар → резервации от повече държави",
      "Текстове на румънски, немски, полски, украински и английски → гостът разбира офертата",
      "Цени и условия ясно на всеки език → по-малко въпроси и откази",
      "Човешка проверка на всеки превод → без смешни грешки",
    ],
    illo: "hud-orbit",
  },
};

const HOTELI_FEATURE_SECTION_3: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 3" },
  wave: 2,
  gate: "hotels",
  data: {
    id: "barzi-otgovori",
    eyebrow: "Бързи отговори",
    title: "Нито едно запитване без отговор в пика.",
    body: "Асистентът отговаря веднага, а сложното прехвърля към рецепцията.",
    points: [
      "Viber асистент или чат бот на сайта → отговор и през нощта",
      "Отговори на езика на госта → по-малко изгубени резервации",
      "Само проверена информация → хотелът отговаря за думите на бота",
      "Всяко запитване се проследява до резервация → виждате ефекта",
    ],
    illo: "hud-signals",
  },
};

const HOTELI_FEATURE_SECTION_4: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 4" },
  wave: 2,
  gate: "hotels",
  data: {
    id: "kade-otivame",
    eyebrow: "Къде отиваме",
    title: "Сезон, който зависи по-малко от посредници.",
    body: "Повече приход от стая след комисионите.",
    points: [
      "Спокойствие за касата",
      "Пикът е продаден навреме",
      "Знаете колко резервации донесе маркетингът",
      "По-пълно междусезоние",
    ],
    illo: "hud-monitoring",
  },
};

const HOTELI_CARD_GRID: ContentBlock<SegmentPageData["cardGrid"]> = {
  source: { file: SOURCE_FILE, block: "Card grid" },
  wave: 2,
  gate: "hotels",
  data: {
    items: [
      {
        title: "„Сега нямаме пари за маркетинг.“",
        body: "Затова започваме с ранните записвания — те носят пари още преди лятото.",
      },
      {
        title: "„Не знаем кое ни носи гости.“",
        body: "Отбелязваме източника на всяка директна резервация — от сайта, телефона и Viber.",
      },
      {
        title: "„През сезона не смогваме с отговорите.“",
        body: "Асистентът отговаря веднага и прехвърля към човек, когато трябва.",
      },
      {
        title: "„Booking ни носи гостите.“",
        body: "Booking остава. Целта е всеки гост, който може да резервира директно, да го направи — без комисиона за посредник.",
      },
    ],
  },
};

const HOTELI_FAQ: ContentBlock<SegmentPageData["faq"]> = {
  source: { file: SOURCE_FILE, block: "FAQ" },
  wave: 2,
  gate: "hotels",
  data: {
    items: [
      {
        question: "Правите ли система за резервации?",
        answer:
          "Не. Работим с вашата или ви препоръчваме доставчик. Ние правим страниците, рекламите и съдържанието, които водят гостите към нея.",
      },
      {
        question: "Защо не специализирана хотелска агенция?",
        answer:
          "Ако имате такава и тя ви носи директни резервации — останете. Ние сме за хотели, които искат отчет в спестени комисиони и кампании на повече езици.",
      },
      {
        question: "Работите ли сезонно?",
        answer:
          "Да: подготовка от ноември до февруари, кампании от март нататък и отчет след сезона.",
      },
      {
        question: "Безопасен ли е чат ботът?",
        answer:
          "Ботът отговаря само с одобрена от вас информация и прехвърля към човек. Хотелът носи отговорност за думите му, затова отговорите се проверяват.",
      },
      {
        question: "Колко струва?",
        answer:
          "„Сезон 2027“ е на цената на „Растеж“ — от 690 € на месец. Точния обхват определяме след анализа на миналия сезон.",
      },
      {
        question: "Ще ни накаже ли Booking за директните резервации?",
        answer:
          "Не може: от 14.11.2024 Booking няма право да забранява на хотелите в ЕС по-ниска цена на собствения им сайт. Booking остава — целта е по-голям директен дял.",
      },
    ],
  },
};

const HOTELI_CTA_BAND: ContentBlock<SegmentPageData["ctaBand"]> = {
  source: { file: SOURCE_FILE, block: "CTA band" },
  wave: 2,
  gate: "hotels",
  data: {
    title: "Сезон 2027 се продава сега.",
    description: "30 минути разговор за пазарите ви и ранните записвания.",
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

export const HOTELI_CONTENT_BLOCKS = [
  HOTELI_HERO,
  HOTELI_FEATURE_GRID,
  HOTELI_PROCESS_STEPS,
  HOTELI_MIRROR_QUESTIONS,
  HOTELI_FEATURE_SECTION_1,
  HOTELI_FEATURE_SECTION_2,
  HOTELI_FEATURE_SECTION_3,
  HOTELI_FEATURE_SECTION_4,
  HOTELI_CARD_GRID,
  HOTELI_FAQ,
  HOTELI_CTA_BAND,
] as const;

export const HOTELI_SEGMENT: SegmentPageData = {
  slug: "hoteli",
  tema: "hotel",
  source: { file: SOURCE_FILE, block: "Хотели" },
  wave: 2,
  gate: "hotels",
  hero: HOTELI_HERO.data,
  featureGrid: HOTELI_FEATURE_GRID.data,
  processSteps: HOTELI_PROCESS_STEPS.data,
  mirrorQuestions: HOTELI_MIRROR_QUESTIONS.data,
  featureSections: [
    HOTELI_FEATURE_SECTION_1.data,
    HOTELI_FEATURE_SECTION_2.data,
    HOTELI_FEATURE_SECTION_3.data,
    HOTELI_FEATURE_SECTION_4.data,
  ],
  cardGrid: HOTELI_CARD_GRID.data,
  faq: HOTELI_FAQ.data,
  ctaBand: HOTELI_CTA_BAND.data,
};
