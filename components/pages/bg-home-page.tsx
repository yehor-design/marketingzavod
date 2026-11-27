"use client";

import { CardGrid } from "@/components/blocks/card-grid";
import { ComparisonTable } from "@/components/blocks/comparison-table";
import { CtaBand } from "@/components/blocks/cta-band";
import { Faq } from "@/components/blocks/faq";
import { FeatureGrid } from "@/components/blocks/feature-grid";
import { FounderCard } from "@/components/blocks/founder-card";
import { Hero } from "@/components/blocks/hero";
import { MirrorQuestions } from "@/components/blocks/mirror-questions";
import { PilotBanner } from "@/components/blocks/pilot-banner";
import { ProcessSteps } from "@/components/blocks/process-steps";
import {
  HOME_BARRIERS,
  HOME_COMPARISON,
  HOME_CTA_BAND,
  HOME_FAQ,
  HOME_FEATURE_GRID,
  HOME_FOUNDER,
  HOME_HERO,
  HOME_MIRROR_QUESTIONS,
  HOME_PILOT_BANNER,
  HOME_PROCESS_STEPS,
  HOME_SEGMENTS,
  getPublishedHomeSegments,
} from "@/content/bg/home";

/**
 * Bulgarian Home Page `/` (ZAV-116, Spec 3A HM-01..HM-07, PG-01..PG-07).
 * Renders all 11 blocks from docs/site-texts/02-nachalo.md in exact file order.
 */
export function BgHomePage() {
  const publishedSegments = getPublishedHomeSegments();

  return (
    <>
      <Hero
        variant="animated"
        titleId="bg-home-hero-title"
        title={HOME_HERO.data.title}
        description={HOME_HERO.data.description}
        actions={[
          {
            href: HOME_HERO.data.primaryCta.href,
            text: HOME_HERO.data.primaryCta.text,
            variant: "primary",
            location: "hero",
          },
          {
            href: HOME_HERO.data.secondaryCta.href,
            text: HOME_HERO.data.secondaryCta.text,
            variant: "secondary",
            location: "hero",
          },
        ]}
        className="pt-[24px]! [&_.heroDesc]:[width:min(620px,_100%)]! max-[809.98px]:[&_h1]:[font-size:2.4rem]! max-[809.98px]:[&_.heroFrame]:h-auto! max-[809.98px]:[&_.heroFrame]:min-h-[540px]! max-[809.98px]:[&_.heroFrame]:[padding:64px_20px_72px]!"
      />

      <FeatureGrid
        titleId="bg-home-value-title"
        title={HOME_FEATURE_GRID.data.title}
        alwaysShowBody
        items={HOME_FEATURE_GRID.data.items.map((item) => ({
          title: item.title,
          body: item.body,
          visual: {
            kind: "illo",
            name: item.illo,
          },
        }))}
      />

      <ProcessSteps
        titleId="bg-home-process-title"
        title={HOME_PROCESS_STEPS.data.title}
        autoHeight
        steps={HOME_PROCESS_STEPS.data.steps}
        note={HOME_PROCESS_STEPS.data.note}
      />

      <CardGrid
        id={HOME_SEGMENTS.data.id}
        titleId="bg-home-segments-title"
        title={HOME_SEGMENTS.data.title}
        autoHeight
        className="scroll-mt-[calc(var(--header-height)_+_24px)]"
        items={publishedSegments.map((item) => ({
          title: item.title,
          body: item.body,
          href: item.href,
          ctaLabel: item.ctaLabel,
        }))}
      />

      <CardGrid
        titleId="bg-home-barriers-title"
        title={HOME_BARRIERS.data.title}
        autoHeight
        items={HOME_BARRIERS.data.items}
      />

      <FounderCard
        titleId="bg-home-founder-title"
        title={HOME_FOUNDER.data.title}
        bio={HOME_FOUNDER.data.bio}
        photo={{
          webp: HOME_FOUNDER.data.photo.webp,
          jpg: HOME_FOUNDER.data.photo.jpg,
          alt: HOME_FOUNDER.data.photo.alt,
          aspect: "1/1",
        }}
        actions={HOME_FOUNDER.data.actions}
      />

      <PilotBanner
        text={HOME_PILOT_BANNER.data.text}
        ctaLabel={HOME_PILOT_BANNER.data.ctaLabel}
        href={HOME_PILOT_BANNER.data.href}
        location={HOME_PILOT_BANNER.data.location}
      />

      <MirrorQuestions
        titleId="bg-home-mirror-title"
        title={HOME_MIRROR_QUESTIONS.data.title}
        questions={HOME_MIRROR_QUESTIONS.data.questions}
        cta={HOME_MIRROR_QUESTIONS.data.cta}
      />

      <ComparisonTable
        titleId="bg-home-comparison-title"
        title={HOME_COMPARISON.data.title}
        columns={HOME_COMPARISON.data.columns}
        groups={HOME_COMPARISON.data.groups}
        tabsAriaLabel={HOME_COMPARISON.data.tabsAriaLabel}
        compactRows={false}
        className="pt-[100px]"
      />

      <Faq
        titleId="bg-home-faq-title"
        title={HOME_FAQ.data.title}
        defaultOpenIndex={0}
        className="[&_.faqGrid]:max-[1199.98px]:before:content-none!"
        items={HOME_FAQ.data.items}
      />

      <CtaBand
        titleId="bg-home-cta-title"
        title={HOME_CTA_BAND.data.title}
        description={HOME_CTA_BAND.data.description}
        spacing="home"
        autoHeight
        actions={[
          {
            href: HOME_CTA_BAND.data.cta.href,
            text: HOME_CTA_BAND.data.cta.text,
            variant: "primary",
            location: HOME_CTA_BAND.data.cta.location,
          },
        ]}
      />
    </>
  );
}
