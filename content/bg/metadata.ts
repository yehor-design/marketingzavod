import { isGateOpen, type GateKey } from "./gates";
import type { ContentSource } from "./types";

export const BG_METADATA_SOURCE: ContentSource = {
  file: "30-metadani-saytu.md",
  block: "Метадані сайту",
};

/**
 * Single source of truth for Bulgarian edition metadata, share cards, app icon
 * naming, and Google structured-data fields (CR-50, file 30-metadani-saytu.md).
 */
export const BG_SITE_METADATA = {
  source: BG_METADATA_SOURCE,
  siteName: "Маркетинг Завод",
  alternateName: "Marketing Zavod",
  fullName: "Маркетинг Завод — агенция от Варна",
  tagline: "Агенция от Варна за цяла България.",
  titleSuffix: " | Маркетинг Завод",
  defaultTitle: "Маркетинг Завод — агенция от Варна за цяла България",
  defaultDescription:
    "Маркетинг агенция от Варна за фирми с 11–200 души в цяла България: реклама, SEO, социални мрежи и CRM с публични цени и отчет на езика на продажбите.",
  lang: "bg",
  locale: "bg_BG",
  homeCard: {
    title: "Повече клиенти от същия бюджет — Маркетинг Завод",
    description:
      "Маркетинг агенция от Варна за фирми с 11–200 души: базова линия, отчет на езика на продажбите и акаунти на ваше име. Пилот 30 дни с фиксирана цена.",
  },
  ogImage: {
    lines: [
      "Повече клиенти от същия бюджет.",
      "Маркетинг агенция от Варна за цяла България",
      "marketingzavod.com",
    ] as const,
    alt: "Маркетинг Завод — агенция от Варна за цяла България",
  },
  appIcon: {
    shortName: "ZAVOD",
    fullName: "Маркетинг Завод — агенция от Варна",
  },
  organization: {
    name: "Маркетинг Завод",
    alternateName: "Marketing Zavod",
    city: "Варна",
    countryName: "България",
    countryCode: "BG",
    areaServed: "България",
    email: "zavodzamarketing@gmail.com",
    founderName: "Егор Гончаренко",
    founderUrl: "https://www.linkedin.com/in/yehor-honcharenko",
    displayUrl: "https://marketingzavod.com",
  },
} as const;

/** Immutable parts of row 12 (case-study template); formatter is implemented in ZAV-192. */
export const BG_CASE_TEMPLATE_METADATA = {
  source: BG_METADATA_SOURCE,
  titleSuffix: " | Маркетинг Завод",
  descriptionTail: "Базова линия, какво направихме, резултат и какво не проработи.",
  inSearch: false,
} as const;

export type BgRouteMetadataEntry = {
  readonly path: string | null;
  readonly title: string;
  readonly description: string | null;
  readonly inSearch: boolean;
  readonly gate?: GateKey;
  readonly type?: "website" | "article";
  readonly ogTitle?: string;
  readonly ogDescription?: string;
};

/**
 * Verbatim page metadata table from docs/site-texts/30-metadani-saytu.md (rows 02–29,
 * excluding template row 12 in BG_CASE_TEMPLATE_METADATA).
 */
export const BG_ROUTE_METADATA = {
  home: {
    path: "/",
    title: "Маркетинг Завод — агенция от Варна за цяла България",
    description:
      "Реклама в Google и Meta, SEO, социални мрежи и CRM за фирми с 11–200 души. Публични цени, акаунти на ваше име и отчет на езика на продажбите.",
    inSearch: true,
    ogTitle: BG_SITE_METADATA.homeCard.title,
    ogDescription: BG_SITE_METADATA.homeCard.description,
  },
  smyanaNaAgentsiya: {
    path: "/smyana-na-agentsiya",
    title: "Смяна на агенция без срив в рекламата | Маркетинг Завод",
    description:
      "Помагаме да прехвърлите рекламните акаунти на ваше име, записваме базова линия и сменяме поетапно — с пилот за 30 дни. За фирми с 11–200 души в цяла България.",
    inSearch: true,
  },
  onlaynMagazini: {
    path: "/onlayn-magazini",
    title: "Реклама за онлайн магазини, която печели | Маркетинг Завод",
    description:
      "Одит на Google Ads и Meta, нови криейтиви всеки месец и отчет по платени поръчки. За онлайн магазини с 11–200 души в цяла България.",
    inSearch: true,
  },
  uslugiIB2b: {
    path: "/uslugi-i-b2b",
    title: "Маркетинг отдел на абонамент: услуги и B2B | Маркетинг Завод",
    description:
      "Стратегия, реклама, CRM и отчет на езика на продажбите за сервизни и B2B фирми с 11–200 души, които нямат маркетолог. На български.",
    inSearch: true,
  },
  hoteli: {
    path: "/hoteli",
    title: "Маркетинг за хотели: директни резервации | Маркетинг Завод",
    description:
      "Ранни записвания, кампании на езиците на гостите ви и отчет за спестените комисиони. За хотели по Черноморието.",
    inSearch: true,
    gate: "hotels",
  },
  nedvizhimiImoti: {
    path: "/nedvizhimi-imoti",
    title: "Маркетинг за строители и агенции за имоти | Маркетинг Завод",
    description:
      "Лендинг, реклама за запитвания на няколко езика и CRM за конкретния ви проект. Всеки месец знаете колко струва един оглед.",
    inSearch: true,
  },
  uslugi: {
    path: "/uslugi",
    title: "Услуги: Google Ads, Meta, SEO и CRM | Маркетинг Завод",
    description:
      "Реклама в Google Ads, Meta и ChatGPT, SEO и локално SEO, социални мрежи, CRM и AI асистенти — с един стратег и един отчет на езика на продажбите.",
    inSearch: true,
  },
  tseni: {
    path: "/tseni",
    title: "Маркетинг услуги: цени без „по запитване“ | Маркетинг Завод",
    description:
      "Пакети от 290 € на месец, крайни цени. Първите 30 дни — одит и пилот — от 690 € общо. После решавате; акаунтите са на ваше име.",
    inSearch: true,
  },
  kakRabotim: {
    path: "/kak-rabotim",
    title: "Как работим: акаунти на ваше име | Маркетинг Завод",
    description:
      "Базова линия, отчет на езика на продажбите, акаунти на името на фирмата и AI с човешка проверка. Без „гарантирани продажби“.",
    inSearch: true,
  },
  keysi: {
    path: "/keysi",
    title: "Пилот 30 дни с отчет „преди / след“ | Маркетинг Завод",
    description:
      "Пилот 30 дни: одит, първи кампании и отчет „преди / след“ — от 690 € общо. Приемаме 3 фирми до февруари 2027. Вместо измислени кейси — вашите цифри.",
    inSearch: true,
  },
  proverkaNaAkaunti: {
    path: "/proverka-na-akaunti",
    title: "Чии са рекламните ви акаунти? Чеклист | Маркетинг Завод",
    description:
      "Проверете дали Google Ads, Meta, пикселът, профилът в Google и анализите са на името на фирмата — преди да смените агенция.",
    inSearch: true,
  },
  zaNas: {
    path: "/za-nas",
    title: "За Маркетинг Завод — агенция от Варна",
    description:
      "Публични цени, акаунти на името на клиента, отчет на езика на продажбите и човек, който отговаря. Базирани във Варна, работим в цяла България.",
    inSearch: true,
  },
  partnyori: {
    path: "/partnyori",
    title: "Партньори: счетоводители и уеб студия | Маркетинг Завод",
    description:
      "Препоръчвайте клиенти на маркетинг агенция и получавайте възнаграждение — писмено и прозрачно към клиента. Или работете с нас под ваше име.",
    inSearch: true,
  },
  blog: {
    path: "/blog",
    title: "Блог: маркетинг в България с цифри | Маркетинг Завод",
    description:
      "Практични бележки за маркетинга в България: цени, реклама, CRM, директни резервации и цена на оглед. С цифри и източници.",
    inSearch: true,
  },
  blogPrediDaPodpishete: {
    path: "/blog/kakvo-da-proverite-predi-da-podpishete",
    title: "Какво да проверите преди договор с агенция | Маркетинг Завод",
    description:
      "Осем въпроса за цена, акаунти, базова линия, отчет, екип, срок, гаранции и кейси, които да зададете на всяка агенция преди подписа.",
    inSearch: true,
    type: "article",
  },
  blogTseni2026: {
    path: "/blog/kolko-struva-marketingat-2026",
    title: "Колко струва маркетингът в България (2026) | Маркетинг Завод",
    description:
      "Медианни цени за сайт, онлайн магазин, SEO, Google Ads, Meta и социални мрежи в България и Варна. Агенция, фрилансър или служител — сравнение.",
    inSearch: true,
    gate: "article18",
    type: "article",
  },
  blogDirektniRezervatsii: {
    path: "/blog/direktni-rezervatsii",
    title: "Директни резервации срещу Booking | Маркетинг Завод",
    description:
      "Колко резервации идват директно в Европа, колко струва посредникът и простата сметка, която показва дали директният канал е по-изгоден за вашия хотел.",
    inSearch: true,
    gate: "hotels",
    type: "article",
  },
  blogNalozhenPlatezh: {
    path: "/blog/nalozhen-platezh-i-roas",
    title: "Наложен платеж и ROAS: кабинет срещу каса | Маркетинг Завод",
    description:
      "Как отказаните пратки с наложен платеж изкривяват ROAS в Meta и Google и как да смятате възвръщаемостта по реално платени поръчки.",
    inSearch: true,
    type: "article",
  },
  blogMetaBeneficient: {
    path: "/blog/meta-beneficient-i-platets",
    title: "Бенефициент и платец в рекламите на Meta | Маркетинг Завод",
    description:
      "Какво изисква ЕС за рекламите в Facebook и Instagram, чие име да стои в полетата „бенефициент“ и „платец“ и кратък чеклист за рекламния акаунт.",
    inSearch: true,
    gate: "article21",
    type: "article",
  },
  blogCrmZaMalkaFirma: {
    path: "/blog/crm-za-malka-firma",
    title: "CRM за малка фирма без изгубени запитвания | Маркетинг Завод",
    description:
      "Минималната CRM настройка за фирма с 11–200 души: едно място за всички запитвания, ясни етапи и отчет, който показва кое запитване става сделка.",
    inSearch: true,
    type: "article",
  },
  blogTsenaNaOgled: {
    path: "/blog/tsena-na-ogled",
    title: "Цена на оглед: главната цифра за строителя | Маркетинг Завод",
    description:
      "Как да сметнете колко струва едно запитване и един оглед за вашия проект и да сравните портали, реклама и брокери, когато пазарът забавя.",
    inSearch: true,
    type: "article",
  },
  kontakt: {
    path: "/kontakt",
    title: "Безплатен разговор с агенция във Варна | Маркетинг Завод",
    description:
      "30 минути разговор за рекламата и продажбите ви. Без ангажимент. Пишете ни през формата или по имейл.",
    inSearch: true,
  },
  blagodarim: {
    path: "/blagodarim",
    title: "Благодарим! | Маркетинг Завод",
    description: null,
    inSearch: false,
  },
  notFound: {
    path: null,
    title: "Страницата не е намерена | Маркетинг Завод",
    description: null,
    inSearch: false,
  },
  legalObshtiUsloviya: {
    path: "/legal/obshti-usloviya",
    title: "Общи условия | Маркетинг Завод",
    description:
      "Условия за ползване на marketingzavod.com: кои сме, какво означават цените на сайта, авторски права и приложимо право.",
    inSearch: true,
  },
  legalPoveritelnost: {
    path: "/legal/poveritelnost",
    title: "Политика за поверителност | Маркетинг Завод",
    description:
      "Какви лични данни събира Маркетинг Завод през сайта и формите, за какво ги използваме, колко дълго ги пазим и какви права имате.",
    inSearch: true,
  },
  legalBiskvitki: {
    path: "/legal/biskvitki",
    title: "Политика за бисквитките | Маркетинг Завод",
    description:
      "Какви бисквитки използва marketingzavod.com, за какво служат и как да промените избора си по всяко време.",
    inSearch: true,
  },
} as const satisfies Record<string, BgRouteMetadataEntry>;

export type BgMetadataRouteKey = keyof typeof BG_ROUTE_METADATA;

/** Derives indexability from the route entry and its gate (CR-23). */
export function isBgRouteIndexable(route: BgMetadataRouteKey): boolean {
  const entry: BgRouteMetadataEntry = BG_ROUTE_METADATA[route];
  if (!entry.inSearch) {
    return false;
  }
  if (entry.gate) {
    return isGateOpen(entry.gate);
  }
  return true;
}

/** Strips the trailing " | Маркетинг Завод" suffix for Open Graph titles (CR-20). */
export function stripBgTitleSuffix(title: string): string {
  const suffix = BG_SITE_METADATA.titleSuffix;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}

/** Looks up a Bulgarian metadata route key by its exact pathname. */
export function findBgMetadataRouteByPath(pathname: string): BgMetadataRouteKey | undefined {
  for (const [key, entry] of Object.entries(BG_ROUTE_METADATA)) {
    if (entry.path === pathname) {
      return key as BgMetadataRouteKey;
    }
  }
  return undefined;
}
