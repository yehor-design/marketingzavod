import type { HeroAction } from "@/components/blocks/hero";
import type { LinkListItem } from "@/components/blocks/link-list";
import { BG_SOLUTIONS_LINKS, getPublishedBgSolutionsLinks } from "./navigation";
import type { ContentSource } from "./types";

/**
 * Bulgarian 404 page content verbatim from docs/site-texts/26-404.md (NF-01).
 */
export const BG_NOT_FOUND = {
  source: {
    file: "26-404.md",
    block: "Hero + LinkList",
  } satisfies ContentSource,
  hero: {
    title: "Тази страница не съществува.",
    description:
      "Може би адресът е сгрешен или страницата е преместена. Ето откъде да продължите:",
    actions: [
      {
        href: "/",
        text: "Към началото",
        variant: "primary",
        location: "not_found",
      },
      {
        href: "/kontakt",
        text: "Безплатен разговор",
        variant: "secondary",
        location: "not_found",
      },
    ] as readonly HeroAction[],
  },
  suggestedGroup: {
    id: "not-found-suggested",
    title: "Може би търсите",
    items: [
      {
        label: "Безплатен чеклист: кой притежава рекламните ви акаунти →",
        href: "/proverka-na-akaunti",
      },
      {
        label: "Цени на пакетите →",
        href: "/tseni",
      },
    ] as readonly LinkListItem[],
  },
  solutionsGroup: {
    id: "not-found-solutions",
    title: "Решения",
    allItems: BG_SOLUTIONS_LINKS,
  },
} as const;

export function getPublishedBgNotFoundSolutions(): readonly LinkListItem[] {
  return getPublishedBgSolutionsLinks().map((item) => ({
    label: item.label,
    href: item.href,
  }));
}
