import Link from "next/link";
import { Hero } from "@/components/blocks/hero";
import { LinkList } from "@/components/blocks/link-list";
import { Button } from "@/components/ui/button";
import { BG_NOT_FOUND, getPublishedBgNotFoundSolutions } from "@/content/bg/not-found";
import { ui } from "@/content/ui";
import { isBg } from "@/lib/edition";
import { bgPageMetadata } from "@/lib/seo";

export const metadata = isBg
  ? bgPageMetadata("notFound")
  : {
      title: ui.notFound.metaTitle,
    };

export default function NotFound() {
  if (isBg) {
    const solutionItems = getPublishedBgNotFoundSolutions();

    return (
      <div className="flex flex-col gap-[32px] py-[16px] min-[810px]:py-[32px]">
        <Hero
          variant="static"
          titleId="not-found-title"
          title={BG_NOT_FOUND.hero.title}
          description={BG_NOT_FOUND.hero.description}
          actions={BG_NOT_FOUND.hero.actions}
          className="max-[809.98px]:[&_.staticFrame]:[padding:48px_16px] max-[809.98px]:[&_h1]:[font-size:2.4rem]"
        />
        <section className="mx-auto w-[min(1200px,_calc(100%_-_32px))]">
          <div className="grid grid-cols-1 gap-[32px] border border-dashed border-rule p-[24px] min-[810px]:grid-cols-2 min-[810px]:gap-[48px] min-[810px]:p-[34px]">
            <LinkList
              embedded
              id={BG_NOT_FOUND.suggestedGroup.id}
              variant="list"
              title={BG_NOT_FOUND.suggestedGroup.title}
              items={BG_NOT_FOUND.suggestedGroup.items}
            />
            <LinkList
              embedded
              id={BG_NOT_FOUND.solutionsGroup.id}
              variant="list"
              title={BG_NOT_FOUND.solutionsGroup.title}
              items={solutionItems}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50rem] flex-col items-center justify-end gap-6 px-4 pb-11 text-center text-foreground">
      <p className="w-60 text-muted-foreground">{ui.notFound.body}</p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="tertiary" nativeButton={false} render={<Link href="/" />}>
          {ui.notFound.homeCta}
        </Button>
        <Button
          variant="secondary"
          nativeButton={false}
          render={<Link href={ui.notFound.contactHref} />}
        >
          {ui.notFound.contactCta}
        </Button>
      </div>
    </div>
  );
}
