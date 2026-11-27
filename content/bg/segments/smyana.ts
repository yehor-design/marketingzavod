import type { ContentBlock, SegmentPageData } from "@/content/bg/types";

const SOURCE_FILE = "03-smyana-na-agentsiya.md";

const SMYANA_HERO: ContentBlock<SegmentPageData["hero"]> = {
  source: { file: SOURCE_FILE, block: "Hero" },
  wave: 1,
  data: {
    eyebrow: "Смяна на агенция",
    title: "Сменете агенцията без срив в рекламата.",
    description:
      "За фирми с 11–200 души, които плащат на агенция или фрилансер, а продажбите стоят. Сменяме поетапно: помагаме да прехвърлите акаунтите на ваше име, записваме базова линия и започваме с пилот за 30 дни.",
    actions: [
      {
        text: "Проверете кой притежава акаунтите ви",
        href: "/proverka-na-akaunti",
        variant: "primary",
        location: "hero",
      },
      {
        text: "Запазете безплатен разговор",
        href: "/kontakt",
        variant: "secondary",
        location: "hero",
      },
    ],
  },
};

const SMYANA_FEATURE_GRID: ContentBlock<SegmentPageData["featureGrid"]> = {
  source: { file: SOURCE_FILE, block: "Feature grid" },
  wave: 1,
  data: {
    title: "Какво получавате при прехода.",
    items: [
      {
        title: "Ясна диагноза",
        body: "Одитът показва какво точно не работи: настройки, криейтив, сайт или самото предложение.",
        illo: "hud-search",
      },
      {
        title: "Акаунтите са ваши",
        body: "Помагаме да прехвърлите Google Ads, Meta, пиксела и профила в Google на името на фирмата — с история и отзиви, доколкото платформите позволяват.",
        illo: "hud-threat-detection",
      },
      {
        title: "Без срив в запитванията",
        body: "Първо проверяваме проследяването и записваме базова линия. Чак после променяме живите кампании.",
        illo: "hud-monitoring",
      },
      {
        title: "Отчет, който разбирате",
        body: "Запитвания, сделки и цена на клиент — включително какво не проработи.",
        illo: "hud-audit-log",
      },
    ],
  },
};

const SMYANA_PROCESS_STEPS: ContentBlock<SegmentPageData["processSteps"]> = {
  source: { file: SOURCE_FILE, block: "Process steps" },
  wave: 1,
  data: {
    title: "Преходът в 3 стъпки.",
    steps: [
      {
        title: "Проверка на акаунтите",
        body: "Разбирате кой реално притежава рекламните ви акаунти и какво рискувате при смяна.",
      },
      {
        title: "Одит и базова линия",
        body: "Независим поглед върху досегашната работа и цифрите, от които започваме.",
      },
      {
        title: "Пилот 30 дни",
        body: "Одит и пилот — от 690 € общо. Поетапен преход и първи отчет „преди / след“.",
      },
    ],
  },
};

const SMYANA_MIRROR_QUESTIONS: ContentBlock<SegmentPageData["mirrorQuestions"]> = {
  source: { file: SOURCE_FILE, block: "Блок «Разпознавате ли се?»" },
  wave: 1,
  data: {
    title: "Разпознавате ли се?",
    questions: [
      "Искате маркетинг, на който да имате доверие?",
      "Плащате от 3–6 месеца, а продажбите стоят?",
      "Цената на клиент расте, а отчетът показва кликове?",
      "Страх ви е да не сгрешите отново с избора?",
      "Агенцията държи акаунтите ви?",
    ],
  },
};

const SMYANA_FEATURE_SECTION_1: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 1" },
  wave: 1,
  data: {
    id: "smyana-bez-risk",
    eyebrow: "Смяна без риск",
    title: "Новият изпълнител поема, старият не пречи.",
    body: "Планираме прехода така, че бизнесът да не го усети.",
    points: [
      "Одит: какво точно не работи → решавате на факти",
      "Базова линия и „реално запитване“ още преди старта → честно сравнение „преди / след“",
      "Проверка на проследяването → цифри, на които вярвате",
      "Промени в живите кампании след проверката → запитванията не спират",
    ],
    illo: "hud-traffic",
  },
};

const SMYANA_FEATURE_SECTION_2: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 2" },
  wave: 1,
  data: {
    id: "akauntite-obratno",
    eyebrow: "Акаунтите обратно",
    title: "От днес всичко ще е на името на фирмата ви.",
    body: "Акаунтите, историята на кампаниите, аудиториите и отзивите — помагаме да запазите всичко, което платформите и старият изпълнител позволяват.",
    points: [
      "Чеклист на всички акаунти и активи преди раздялата → знаете какво да поискате",
      "Прехвърляне на собствеността на фирмата → вие сте собственик, ние имаме достъп",
      "Записано в договора → сигурност и при следваща смяна",
      "Технически план на прехода → ясен край; стария договор проверете с юрист",
    ],
    illo: "hud-alerts",
  },
};

const SMYANA_FEATURE_SECTION_3: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 3" },
  wave: 1,
  data: {
    id: "izbor-s-dokazatelstva",
    eyebrow: "Избор с доказателства",
    title: "Сравнете ни, преди да подпишете.",
    body: "Цените и основните условия на договора са публични. Няма какво да откривате след подписа.",
    points: [
      "Пакети и цени на сайта → сравнявате честно",
      [
        {
          text: "Основните условия на договора са на сайта",
          href: "/kak-rabotim#dogovor",
        },
        { text: " → четете ги преди разговора" },
      ],
      "Писмен обхват: канали, криейтиви, отчети → знаете какво получавате",
      "Поименен стратег и тримесечни прегледи → вниманието не пада след подписа",
      "Пилот 30 дни, после решавате; ако продължим — минимум 3 месеца → не сте вързани за година",
    ],
    illo: "interface-choose-plan",
  },
};

const SMYANA_FEATURE_SECTION_4: ContentBlock<SegmentPageData["featureSections"][number]> = {
  source: { file: SOURCE_FILE, block: "Feature section 4" },
  wave: 1,
  data: {
    id: "kade-otivame",
    eyebrow: "Къде отиваме",
    title: "Отново контролирате маркетинга си.",
    body: "Знаете колко ви струва един клиент и за какво плащате всеки месец.",
    points: [
      "Спокойствие: знаете за какво плащате",
      "Контрол: акаунтите и данните са ваши",
      "Цифри в продажби, не в кликове",
      "Решения за бюджета на факти",
    ],
    illo: "hud-cost-meter",
  },
};

const SMYANA_CARD_GRID: ContentBlock<SegmentPageData["cardGrid"]> = {
  source: { file: SOURCE_FILE, block: "Card grid" },
  wave: 1,
  data: {
    items: [
      {
        title: "„Агенцията държи акаунтите ни.“",
        body: "Помагаме да ги прехвърлите на името на фирмата — с чеклист още преди раздялата.",
      },
      {
        title: "„Не знаем какво точно не работи.“",
        body: "Одитът дава писмен списък с проблеми и приоритети. В пилота е включен, отделно струва от 490 €.",
      },
      {
        title: "„Страх ни е, че запитванията ще спрат.“",
        body: "Поетапен преход: първо проследяване и базова линия, после промени.",
      },
      {
        title: "„Не можем да сравним агенциите.“",
        body: "Публикуваме цени и условия. Само 23% от агенциите и студията в България го правят.",
      },
    ],
  },
};

const SMYANA_FAQ: ContentBlock<SegmentPageData["faq"]> = {
  source: { file: SOURCE_FILE, block: "FAQ" },
  wave: 1,
  data: {
    items: [
      {
        question: "Защо не просто друга агенция?",
        answer:
          "Може. Проверете я със същите въпроси: публична цена, акаунти на ваше име, базова линия, изход без глоба. Ако отговорите са „да“, сте в добри ръце.",
      },
      {
        question: "Защо не фрилансер?",
        answer:
          "За една задача — може би. За реклама, съдържание, анализи и отчет един човек трудно стига. В международно проучване сред 1 900 работодатели 25% съобщават за пропуснати срокове при фрилансъри.",
      },
      {
        question: "Защо не да го правим сами с AI?",
        answer:
          "AI ускорява черновите, но не пита защо продажбите стоят. Ние използваме AI за скорост, а стратегът — за решенията.",
      },
      {
        question: "Колко трае преходът?",
        answer:
          "По практика на пазара — около 6–8 седмици. Пилотът покрива първите 30 дни и показва първите цифри.",
      },
      {
        question: "Ами ако и с вас не се получи?",
        answer:
          "Спирате след пилота — или след минималните 3 месеца, ако сме продължили. Акаунтите, данните и отчетите остават у вас.",
      },
    ],
  },
};

const SMYANA_CTA_BAND: ContentBlock<SegmentPageData["ctaBand"]> = {
  source: { file: SOURCE_FILE, block: "CTA band" },
  wave: 1,
  data: {
    title: "Проверете кой притежава акаунтите ви.",
    description: "Безплатен чеклист и 30 минути разговор за прехода.",
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

export const SMYANA_CONTENT_BLOCKS = [
  SMYANA_HERO,
  SMYANA_FEATURE_GRID,
  SMYANA_PROCESS_STEPS,
  SMYANA_MIRROR_QUESTIONS,
  SMYANA_FEATURE_SECTION_1,
  SMYANA_FEATURE_SECTION_2,
  SMYANA_FEATURE_SECTION_3,
  SMYANA_FEATURE_SECTION_4,
  SMYANA_CARD_GRID,
  SMYANA_FAQ,
  SMYANA_CTA_BAND,
] as const;

export const SMYANA_SEGMENT: SegmentPageData = {
  slug: "smyana-na-agentsiya",
  tema: "smyana",
  source: { file: SOURCE_FILE, block: "Смяна на агенция" },
  wave: 1,
  hero: SMYANA_HERO.data,
  featureGrid: SMYANA_FEATURE_GRID.data,
  processSteps: SMYANA_PROCESS_STEPS.data,
  mirrorQuestions: SMYANA_MIRROR_QUESTIONS.data,
  featureSections: [
    SMYANA_FEATURE_SECTION_1.data,
    SMYANA_FEATURE_SECTION_2.data,
    SMYANA_FEATURE_SECTION_3.data,
    SMYANA_FEATURE_SECTION_4.data,
  ],
  cardGrid: SMYANA_CARD_GRID.data,
  faq: SMYANA_FAQ.data,
  ctaBand: SMYANA_CTA_BAND.data,
};
