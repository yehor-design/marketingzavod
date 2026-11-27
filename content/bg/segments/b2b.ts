import type { ContentBlock, SegmentPageData } from "@/content/bg/types";

const SOURCE_FILE = "05-uslugi-i-b2b.md";

const B2B_HERO: ContentBlock<SegmentPageData["hero"]> = {
  source: { file: SOURCE_FILE, block: "Hero" },
  wave: 1,
  data: {
    eyebrow: "Услуги и B2B",
    title: "Маркетинг отдел на абонамент.",
    description:
      "За сервизни и B2B фирми с 11–200 души, които плащат за реклама, но нямат маркетолог. Стратег, реклама, CRM и отчет, който свързва маркетинга с продажбите — на български.",
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

const B2B_FEATURE_GRID: ContentBlock<SegmentPageData["featureGrid"]> = {
  source: { file: SOURCE_FILE, block: "Feature grid" },
  wave: 1,
  data: {
    title: "Какво получавате.",
    items: [
      {
        title: "План вместо хаос",
        body: "Стратегия и план за 90 дни: канали, цели, бюджет и KPI.",
        illo: "interface-choose-plan",
      },
      {
        title: "Всяко запитване се вижда",
        body: "Настройваме CRM, за да знаете откъде идва всяко запитване и кое става сделка.",
        illo: "hud-signals",
      },
      {
        title: "Човек, а не вакансия",
        body: "Стратег, който познава бизнеса ви — без месеци търсене на маркетолог.",
        illo: "hud-edge",
      },
      {
        title: "Времето ви обратно",
        body: "Одобрявате пакетно веднъж седмично. Останалото е при нас.",
        illo: "hud-monitoring",
      },
    ],
  },
};

const B2B_PROCESS_STEPS: ContentBlock<SegmentPageData["processSteps"]> = {
  source: { file: SOURCE_FILE, block: "Process steps" },
  wave: 1,
  data: {
    title: "Как започваме.",
    steps: [
      {
        title: "Разговор",
        body: "Разказвате какво продавате и на кого.",
      },
      {
        title: "Одит и план за 90 дни",
        body: "Канали, цели, бюджет и KPI на една страница.",
      },
      {
        title: "Пилот 30 дни",
        body: "CRM, първи кампании и първи отчет. Одит и пилот — от 690 € общо.",
      },
    ],
  },
};

const B2B_MIRROR_QUESTIONS: ContentBlock<SegmentPageData["mirrorQuestions"]> = {
  source: { file: SOURCE_FILE, block: "Блок «Разпознавате ли се?»" },
  wave: 1,
  data: {
    title: "Разпознавате ли се?",
    questions: [
      "Искате клиенти, които не зависят само от вашите познанства?",
      "Маркетологът напусна или наемането не стана?",
      "Правите неща, но цифрите не мърдат?",
      "Не виждате как маркетингът влияе на растежа?",
      "Всяка публикация минава през вас?",
    ],
  },
};

const B2B_FEATURE_SECTION_1: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 1" },
  wave: 1,
  data: {
    id: "sistema",
    eyebrow: "Система",
    title: "Някой най-сетне подрежда маркетинга.",
    body: "От брифа до плана — без да учите агенция от нулата.",
    points: [
      "Бриф в 1–2 срещи → разбираме какво и на кого продавате",
      "Стратегия и KPI дърво от запитване до приход → всички знаят целта",
      "Реклама и социални мрежи в 2–3 канала → стабилен поток от запитвания",
      "Сайт, профил в Google и отзиви → намират ви и без реклама",
    ],
    illo: "hud-orbit",
  },
};

const B2B_FEATURE_SECTION_2: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 2" },
  wave: 1,
  data: {
    id: "prodazhbi",
    eyebrow: "Продажби",
    title: "Виждате как маркетингът влияе на растежа.",
    body: "Всяко запитване има източник и статус.",
    points: [
      "CRM и път „запитване → сделка“ → нищо не се губи",
      "Запитванията стигат до вас веднага в CRM или Viber → отговаряте навреме",
      "Viber асистент с прехвърляне към човек → отговор и извън работно време",
      "Цена на клиент по канали → бюджет на факти",
    ],
    illo: "hud-traffic",
  },
};

const B2B_FEATURE_SECTION_3: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 3" },
  wave: 1,
  data: {
    id: "vasheto-vreme",
    eyebrow: "Вашето време",
    title: "Маркетингът върви и без вас.",
    body: "Вие решавате важното, ние вършим останалото.",
    points: [
      "Едно одобрение седмично → без ежедневни въпроси",
      "Кратък месечен отчет на езика на продажбите → разбирате го без маркетинг речник",
      "Достъпи на името на фирмата и записани решения → нищо не зависи от един човек",
      "Поименен стратег → знаете с кого говорите",
    ],
    illo: "hud-alerts",
  },
};

const B2B_FEATURE_SECTION_4: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 4" },
  wave: 1,
  data: {
    id: "kade-otivame",
    eyebrow: "Къде отиваме",
    title: "Предвидим поток от клиенти всеки месец.",
    body: "Бизнес, който расте, без да сте във всяка сделка.",
    points: [
      "Облекчение: някой отговаря за маркетинга",
      "Увереност: знаете какво носи всеки канал",
      "Свобода: време за продажби и екипа",
      "Спокойствие, когато хората се сменят",
    ],
    illo: "hud-cost-meter",
  },
};

const B2B_CARD_GRID: ContentBlock<SegmentPageData["cardGrid"]> = {
  source: { file: SOURCE_FILE, block: "Card grid" },
  wave: 1,
  data: {
    items: [
      {
        title: "„Не можем да намерим маркетолог.“",
        body: "Получавате стратег веднага и проверени изпълнители за рекламата и съдържанието. Маркетолог във Варна струва 980–2 300 € бруто на месец и трудно се намира.",
      },
      {
        title: "„Запитванията се губят.“",
        body: "Настройваме CRM и пътя до продажбата още в пилота.",
      },
      {
        title: "„Агенциите не разбират какво продаваме.“",
        body: "Започваме с бриф и одит, говорим на български и не пускаме реклама, преди да разберем клиентите ви.",
      },
      {
        title: "„Не знаем колко трябва да струва.“",
        body: "Цените са публични: от 290 € за един канал, от 690 € за 2–3 канала.",
      },
    ],
  },
};

const B2B_FAQ: ContentBlock<SegmentPageData["faq"]> = {
  source: { file: SOURCE_FILE, block: "FAQ" },
  wave: 1,
  data: {
    items: [
      {
        question: "Защо да не наемем маркетолог?",
        answer:
          "Ако намерите силен — наемете. В анкета на Forbes България сред 50 CEO 28% казват, че трудно намират маркетинг лидер. Ние сме решение, докато го няма — или вместо него.",
        gate: "forbes",
      },
      {
        question: "Защо не фрилансъри?",
        answer:
          "Добри са за отделни задачи. Ние даваме стратегия, изпълнение и отчет от едно място.",
      },
      {
        question: "Ще разберете ли бизнеса ни?",
        answer:
          "Затова започваме с бриф и одит. Ако след тях не виждаме как да помогнем, ще ви го кажем.",
      },
      {
        question: "Подходящо ли е за адвокати и други регулирани професии?",
        answer:
          "Да, в рамките на Етичния кодекс на професията. Когато правилата ограничават рекламата, залагаме на сайта, профила в Google, съдържанието и LinkedIn.",
      },
      {
        question: "Колко време ще ми отнема?",
        answer: "Една-две срещи за брифа в началото, после одобрение веднъж седмично.",
      },
    ],
  },
};

const B2B_CTA_BAND: ContentBlock<SegmentPageData["ctaBand"]> = {
  source: { file: SOURCE_FILE, block: "CTA band" },
  wave: 1,
  data: {
    title: "Да подредим маркетинга ви.",
    description: "30 минути разговор. Ще ви кажем откъде бихме започнали.",
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

export const B2B_CONTENT_BLOCKS = [
  B2B_HERO,
  B2B_FEATURE_GRID,
  B2B_PROCESS_STEPS,
  B2B_MIRROR_QUESTIONS,
  B2B_FEATURE_SECTION_1,
  B2B_FEATURE_SECTION_2,
  B2B_FEATURE_SECTION_3,
  B2B_FEATURE_SECTION_4,
  B2B_CARD_GRID,
  B2B_FAQ,
  B2B_CTA_BAND,
] as const;

export const B2B_SEGMENT: SegmentPageData = {
  slug: "uslugi-i-b2b",
  tema: "b2b",
  source: { file: SOURCE_FILE, block: "Услуги и B2B" },
  wave: 1,
  hero: B2B_HERO.data,
  featureGrid: B2B_FEATURE_GRID.data,
  processSteps: B2B_PROCESS_STEPS.data,
  mirrorQuestions: B2B_MIRROR_QUESTIONS.data,
  featureSections: [
    B2B_FEATURE_SECTION_1.data,
    B2B_FEATURE_SECTION_2.data,
    B2B_FEATURE_SECTION_3.data,
    B2B_FEATURE_SECTION_4.data,
  ],
  cardGrid: B2B_CARD_GRID.data,
  faq: B2B_FAQ.data,
  ctaBand: B2B_CTA_BAND.data,
};
