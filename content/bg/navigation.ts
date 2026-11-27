import { CASES_PAGE_MODE, isGateOpen, type GateKey } from "./gates";
import type { ContentSource } from "./types";

export type BgNavLink = {
  readonly href: string;
  readonly label: string;
  readonly gate?: GateKey;
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
