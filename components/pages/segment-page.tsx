"use client";

import type { ReactNode } from "react";
import { CardGrid } from "@/components/blocks/card-grid";
import { CtaBand } from "@/components/blocks/cta-band";
import { Faq } from "@/components/blocks/faq";
import { FeatureGrid } from "@/components/blocks/feature-grid";
import { FeatureSection } from "@/components/blocks/feature-section";
import { Hero } from "@/components/blocks/hero";
import { MirrorQuestions } from "@/components/blocks/mirror-questions";
import { ProcessSteps } from "@/components/blocks/process-steps";
import { RichTextRuns } from "@/components/blocks/rich-text";
import { isGateOpen } from "@/content/bg/gates";
import { appendSegmentTema, type SegmentPageData } from "@/content/bg/types";

const SECTION_ACCENTS = [
  "var(--color-brand)",
  "var(--color-series-magenta)",
  "var(--color-series-blue)",
  "var(--color-series-yellow)",
] as const;

const DEFAULT_FAQ_TITLE = "Често задавани въпроси.";

export type SegmentPageProps = {
  data: SegmentPageData;
  /** Optional segment-specific block rendered between CardGrid and FAQ (e.g. «Сезон 2027», SG-01 / SG-15). */
  extraSlot?: ReactNode;
};

/**
 * Shared 9-section template for Bulgarian segment pages (SG-01..SG-07, PG-01..PG-07).
 * Order: Hero (static) -> FeatureGrid -> ProcessSteps -> MirrorQuestions ->
 * FeatureSections 1..4 (alternating flip, illos.dev/library visuals) -> CardGrid ->
 * [extraSlot] -> FAQ -> CtaBand.
 */
export function SegmentPage({ data, extraSlot }: SegmentPageProps) {
  const { tema } = data;

  const visibleFeatureSections = data.featureSections.filter(
    (section) => !section.gate || isGateOpen(section.gate),
  );
  const visibleCards = data.cardGrid.items.filter(
    (item) => !item.gate || isGateOpen(item.gate),
  );
  const visibleFaq = data.faq.items.filter((item) => !item.gate || isGateOpen(item.gate));

  return (
    <>
      <Hero
        variant="static"
        titleId={`${data.slug}-hero-title`}
        eyebrow={data.hero.eyebrow}
        title={data.hero.title}
        description={data.hero.description}
        actions={data.hero.actions.map((action, index) => ({
          href: appendSegmentTema(action.href, tema),
          text: action.text,
          variant: action.variant ?? (index === 0 ? "primary" : "secondary"),
          location: action.location ?? "hero",
        }))}
      />

      <FeatureGrid
        titleId={`${data.slug}-value-title`}
        title={data.featureGrid.title}
        alwaysShowBody
        items={data.featureGrid.items.map((item) => ({
          title: item.title,
          body: item.body,
          visual: {
            kind: "illo",
            name: item.illo,
            alt: item.alt,
          },
        }))}
      />

      <ProcessSteps
        titleId={`${data.slug}-process-title`}
        title={data.processSteps.title}
        autoHeight
        steps={data.processSteps.steps}
        note={data.processSteps.note}
      />

      <MirrorQuestions
        titleId={`${data.slug}-mirror-title`}
        title={data.mirrorQuestions.title}
        questions={data.mirrorQuestions.questions}
        note={data.mirrorQuestions.note}
        cta={
          data.mirrorQuestions.cta
            ? {
                label: data.mirrorQuestions.cta.label,
                href: appendSegmentTema(data.mirrorQuestions.cta.href, tema),
                location: data.mirrorQuestions.cta.location ?? "mirror_questions",
              }
            : undefined
        }
      />

      {visibleFeatureSections.map((section, index) => (
        <FeatureSection
          key={section.id ?? section.title}
          id={section.id}
          eyebrow={section.eyebrow}
          accentColor={SECTION_ACCENTS[index % SECTION_ACCENTS.length]}
          title={section.title}
          body={<RichTextRuns content={section.body} />}
          points={section.points.map((point, pointIndex) => (
            <RichTextRuns key={pointIndex} content={point} />
          ))}
          visual={{
            kind: "illo",
            name: section.illo,
            alt: section.alt,
          }}
          flip={index % 2 === 1}
          autoHeight
        />
      ))}

      <CardGrid
        id={data.cardGrid.id}
        titleId={`${data.slug}-barriers-title`}
        title={data.cardGrid.title}
        autoHeight
        items={visibleCards.map((item) => ({
          title: item.title,
          body: item.body,
          href: item.href ? appendSegmentTema(item.href, tema) : undefined,
          ctaLabel: item.ctaLabel,
        }))}
        note={data.cardGrid.note}
      />

      {extraSlot}

      <Faq
        titleId={`${data.slug}-faq-title`}
        title={data.faq.title ?? DEFAULT_FAQ_TITLE}
        defaultOpenIndex={0}
        className="[&_.faqGrid]:max-[1199.98px]:before:content-none!"
        items={visibleFaq.map((item) => ({
          question: item.question,
          answer: <RichTextRuns content={item.answer} />,
          trackQuestion: item.question,
        }))}
      />

      <CtaBand
        titleId={`${data.slug}-cta-title`}
        title={data.ctaBand.title}
        description={data.ctaBand.description}
        spacing="page"
        autoHeight
        actions={data.ctaBand.actions.map((action, index) => ({
          href: appendSegmentTema(action.href, tema),
          text: action.text,
          variant: action.variant ?? (index === 0 ? "primary" : "secondary"),
          location: action.location ?? "footer_cta",
        }))}
      />
    </>
  );
}
