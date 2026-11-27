import type { IlloName } from "@/components/illos";
import type { RichTextContent } from "@/lib/rich-text";
import type { GateKey } from "./gates";

export type ContentSource = {
  readonly file: string;
  readonly block: string;
};

export type PublishWave = 1 | 2;

export type ContentBlock<TData> = {
  readonly source: ContentSource;
  readonly wave: PublishWave;
  readonly gate?: GateKey;
  readonly data: TData;
};

export type DraftEntry = {
  readonly value: string;
  readonly spec: string;
  readonly date: string;
};

export type FounderPhoto = {
  readonly webp?: string;
  readonly jpg: string;
  readonly alt: string;
  readonly aspect: "1/1" | "4/5" | "avatar";
  readonly source: ContentSource;
};

const SOURCE_PHOTO_PREFIX = "фото/";
const PUBLIC_FOUNDERS_PREFIX = "/founders/";

/** Maps source-doc relative paths (`фото/...`) to public asset paths (`/founders/...`) (CR-40). */
export function resolveFounderPhotoPath(sourcePath: string): string {
  const normalized = sourcePath.trim();
  const filename = normalized.startsWith(SOURCE_PHOTO_PREFIX)
    ? normalized.slice(SOURCE_PHOTO_PREFIX.length)
    : normalized.startsWith(PUBLIC_FOUNDERS_PREFIX)
      ? normalized.slice(PUBLIC_FOUNDERS_PREFIX.length)
      : normalized;

  if (!filename || filename.includes("/") || filename.includes("..")) {
    throw new Error(`Invalid founder photo path: "${sourcePath}"`);
  }
  if (filename.includes("-original.")) {
    throw new Error(`Original uncropped founder photo must not be used on site: "${sourcePath}"`);
  }
  return `${PUBLIC_FOUNDERS_PREFIX}${filename}`;
}

export const FOUNDER_PHOTOS = {
  square: {
    webp: resolveFounderPhotoPath("фото/egor-goncharenko-1x1-800.webp"),
    jpg: resolveFounderPhotoPath("фото/egor-goncharenko-1x1-800.jpg"),
    alt: "Егор Гончаренко, основател на Маркетинг Завод",
    aspect: "1/1",
    source: { file: "02-nachalo.md", block: "Кой отговаря" },
  },
  portrait: {
    webp: resolveFounderPhotoPath("фото/egor-goncharenko-4x5-1200.webp"),
    jpg: resolveFounderPhotoPath("фото/egor-goncharenko-4x5-1200.jpg"),
    alt: "Егор Гончаренко, основател на Маркетинг Завод",
    aspect: "4/5",
    source: { file: "14-za-nas.md", block: "Team → «Кой стои зад Маркетинг Завод»" },
  },
  avatar: {
    jpg: resolveFounderPhotoPath("фото/egor-goncharenko-avatar-240.jpg"),
    alt: "Егор Гончаренко",
    aspect: "avatar",
    source: { file: "14-za-nas.md", block: "Team → «Кой стои зад Маркетинг Завод»" },
  },
} as const satisfies Record<string, FounderPhoto>;

export type SegmentTema = "smyana" | "magazin" | "b2b" | "hotel" | "sezon" | "imoti";

export type SegmentSlug =
  | "smyana-na-agentsiya"
  | "onlayn-magazini"
  | "uslugi-i-b2b"
  | "hoteli"
  | "nedvizhimi-imoti";

export type SegmentAction = {
  readonly text: string;
  readonly href: string;
  readonly variant?: "primary" | "secondary";
  readonly location?: string;
};

export type SegmentFeatureGridItem = {
  readonly title: string;
  readonly body: string;
  readonly illo: IlloName;
  readonly alt?: string;
};

export type SegmentProcessStep = {
  readonly title: string;
  readonly body: string;
};

export type SegmentFeatureSection = {
  readonly id?: string;
  readonly eyebrow?: string;
  readonly title: string;
  readonly body: RichTextContent;
  readonly points: readonly RichTextContent[];
  readonly illo: IlloName;
  readonly alt?: string;
  readonly gate?: GateKey;
};

export type SegmentCardItem = {
  readonly title: string;
  readonly body: string;
  readonly href?: string;
  readonly ctaLabel?: string;
  readonly gate?: GateKey;
};

export type SegmentFaqItem = {
  readonly question: string;
  readonly answer: RichTextContent;
  readonly gate?: GateKey;
};

/**
 * Typed content contract for the 5 Bulgarian segment pages (SG-01..SG-07).
 * Order of fields mirrors the 9 mandatory sections of every segment page.
 */
export type SegmentPageData = {
  readonly slug: SegmentSlug;
  readonly tema: SegmentTema;
  readonly source: ContentSource;
  readonly wave: PublishWave;
  readonly gate?: GateKey;
  readonly hero: {
    readonly eyebrow?: string;
    readonly title: string;
    readonly description: string;
    readonly actions: readonly SegmentAction[];
  };
  readonly featureGrid: {
    readonly title: string;
    readonly items: readonly SegmentFeatureGridItem[];
  };
  readonly processSteps: {
    readonly title: string;
    readonly steps: readonly SegmentProcessStep[];
    readonly note?: string;
  };
  readonly mirrorQuestions: {
    readonly title: string;
    readonly questions: readonly string[];
    readonly note?: string;
    readonly cta?: {
      readonly label: string;
      readonly href: string;
      readonly location?: string;
    };
  };
  readonly featureSections: readonly SegmentFeatureSection[];
  readonly cardGrid: {
    readonly id?: string;
    readonly title?: string;
    readonly items: readonly SegmentCardItem[];
    readonly note?: string;
  };
  readonly faq: {
    readonly title?: string;
    readonly items: readonly SegmentFaqItem[];
  };
  readonly ctaBand: {
    readonly title: string;
    readonly description?: string;
    readonly actions: readonly SegmentAction[];
  };
};

/**
 * Appends `?tema=<tema>` to `/kontakt` links on segment pages without overwriting
 * an explicit `tema` already specified in the content file (SG-06, SG-07).
 */
export function appendSegmentTema(href: string, tema: SegmentTema): string {
  if (!href.startsWith("/kontakt")) {
    return href;
  }
  const rest = href.slice("/kontakt".length);
  if (rest !== "" && !rest.startsWith("?") && !rest.startsWith("#")) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const queryIndex = withoutHash.indexOf("?");
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const search = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";

  const params = new URLSearchParams(search);
  if (!params.has("tema")) {
    params.set("tema", tema);
  }
  return `${pathname}?${params.toString()}${hash}`;
}
