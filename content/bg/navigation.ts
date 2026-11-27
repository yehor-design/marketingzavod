import { COMPANY } from "./company";
import { BG_DRAFTS } from "./drafts";
import { CASES_PAGE_MODE, isGateOpen, type GateKey } from "./gates";
import type { ContentSource } from "./types";

export type BgNavLink = {
  readonly href: string;
  readonly label: string;
  readonly gate?: GateKey;
  readonly ctaLocation?: string;
};

export type BgFooterItem =
  | {
      readonly kind: "link";
      readonly href: string;
      readonly label: string;
      readonly gate?: GateKey;
      readonly ctaLocation?: string;
    }
  | {
      readonly kind: "text";
      readonly text: string;
    }
  | {
      readonly kind: "email";
      readonly href: string;
      readonly label: string;
    };

export type BgFooterColumn = {
  readonly id: "solutions" | "company" | "contact" | "legal";
  readonly title: string;
  readonly items: readonly BgFooterItem[];
  readonly hasCookieSettings?: boolean;
};

/**
 * Segment pages listed under «Решения» in header and footer (01-globalni-elementi.md, CR-05, CR-06).
 */
export const BG_SOLUTIONS_LINKS = [
  { href: "/smyana-na-agentsiya", label: "Смяна на агенция" },
  { href: "/onlayn-magazini", label: "Онлайн магазини" },
  { href: "/uslugi-i-b2b", label: "Услуги и B2B" },
  { href: "/hoteli", label: "Хотели", gate: "hotels" },
  { href: "/nedvizhimi-imoti", label: "Недвижими имоти" },
] as const satisfies readonly BgNavLink[];

export function getPublishedBgSolutionsLinks(): readonly BgNavLink[] {
  return BG_SOLUTIONS_LINKS.filter((link) => !("gate" in link) || isGateOpen(link.gate));
}

/**
 * Bulgarian edition header navigation verbatim from docs/site-texts/01-globalni-elementi.md (GL-05..GL-07).
 */
export const BG_HEADER_NAV = {
  source: {
    file: "01-globalni-elementi.md",
    block: "Nav",
  } satisfies ContentSource,
  solutionsLabel: "Решения",
  solutions: BG_SOLUTIONS_LINKS,
  links: [
    { href: "/uslugi", label: "Какво правим" },
    { href: "/tseni", label: "Цени" },
    { href: "/kak-rabotim", label: "Как работим" },
    {
      href: "/keysi",
      label: CASES_PAGE_MODE === "cases" ? "Кейси" : "Пилот 30 дни",
    },
    { href: "/blog", label: "Блог" },
  ] as const satisfies readonly BgNavLink[],
  primaryCta: {
    href: "/kontakt",
    label: "Безплатен разговор",
  },
} as const;

/**
 * Bulgarian edition 4-column footer verbatim from docs/site-texts/01-globalni-elementi.md (GL-08..GL-12).
 */
export const BG_FOOTER = {
  source: {
    file: "01-globalni-elementi.md",
    block: "Footer",
  } satisfies ContentSource,
  columns: [
    {
      id: "solutions",
      title: "Решения",
      items: BG_SOLUTIONS_LINKS.map((link) => ({
        kind: "link" as const,
        ...link,
      })),
    },
    {
      id: "company",
      title: "Компания",
      items: [
        { kind: "link", href: "/uslugi", label: "Какво правим" },
        { kind: "link", href: "/tseni", label: "Цени" },
        { kind: "link", href: "/kak-rabotim", label: "Как работим" },
        {
          kind: "link",
          href: "/keysi",
          label: CASES_PAGE_MODE === "cases" ? "Кейси" : "Пилот 30 дни",
          ctaLocation: "footer",
        },
        { kind: "link", href: "/za-nas", label: "За нас" },
        { kind: "link", href: "/partnyori", label: "Партньори" },
        { kind: "link", href: "/blog", label: "Блог" },
      ],
    },
    {
      id: "contact",
      title: "Контакт",
      items: [
        { kind: "text", text: COMPANY.meetingsLine },
        { kind: "email", href: COMPANY.emailHref, label: COMPANY.email },
      ],
    },
    {
      id: "legal",
      title: "Правни",
      items: [
        { kind: "link", href: "/legal/obshti-usloviya", label: "Общи условия" },
        { kind: "link", href: "/legal/poveritelnost", label: "Политика за поверителност" },
        { kind: "link", href: "/legal/biskvitki", label: "Политика за бисквитките" },
      ],
      hasCookieSettings: true,
    },
  ] as readonly BgFooterColumn[],
  socials: [
    {
      href: COMPANY.linkedinHref,
      label: BG_DRAFTS.founderLinkedinAria.value,
      icon: "linkedin",
    },
  ] as const,
} as const;

export function getPublishedBgFooterColumns(): readonly BgFooterColumn[] {
  return BG_FOOTER.columns.map((column) => ({
    ...column,
    items: column.items.filter(
      (item) => item.kind !== "link" || !item.gate || isGateOpen(item.gate),
    ),
  }));
}
