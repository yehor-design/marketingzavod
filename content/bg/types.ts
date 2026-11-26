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
