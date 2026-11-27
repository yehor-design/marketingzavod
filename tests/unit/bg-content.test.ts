import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COMPANY, COMPANY_ABOUT_DETAILS, COMPANY_LEGAL_DETAILS } from "@/content/bg/company";
import { BG_DRAFTS } from "@/content/bg/drafts";
import { BG_GATES, CASES_PAGE_MODE, isGateOpen } from "@/content/bg/gates";
import { HOME_HERO } from "@/content/bg/home";
import {
  BG_FOOTER,
  BG_HEADER_NAV,
  BG_SOLUTIONS_LINKS,
  getPublishedBgFooterColumns,
  getPublishedBgSolutionsLinks,
} from "@/content/bg/navigation";
import { BG_NOT_FOUND, getPublishedBgNotFoundSolutions } from "@/content/bg/not-found";
import {
  formatBgDate,
  LAUNCH_PUBLICATION_DATE_BG,
  LAUNCH_PUBLICATION_DATE_ISO,
  SHARED_FORMULATIONS,
} from "@/content/bg/shared";
import {
  FOUNDER_PHOTOS,
  resolveFounderPhotoPath,
  type ContentBlock,
  type ContentSource,
} from "@/content/bg/types";
import { BG_UI_SOURCE_FILES, bgUi } from "@/content/bg/ui";
import { jetUi } from "@/content/jet/ui";

const SITE_TEXTS_DIR = path.join(process.cwd(), "docs", "site-texts");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const UKRAINIAN_LETTERS = /[іїєґІЇЄҐ]/;
const BRACKET_PLACEHOLDERS = /[\[\]]/;
const SERVICE_LABELS = [/\bОснова\b/, /\bПримітка\b/, /\bПублікувати\b/, /\bдля перевірки\b/i];

const sourceCache = new Map<string, string>();

/** Normalizes only whitespace (including NBSP per DS-07) without altering punctuation or characters. */
export function normalizeWhitespace(value: string): string {
  return value.replace(/[\s\u00A0]+/g, " ").trim();
}

function readNormalizedSource(file: string): string {
  const cached = sourceCache.get(file);
  if (cached !== undefined) {
    return cached;
  }
  const fullPath = path.join(SITE_TEXTS_DIR, file);
  const raw = fs.readFileSync(fullPath, "utf8");
  const normalized = normalizeWhitespace(raw);
  sourceCache.set(file, normalized);
  return normalized;
}

const DRAFT_VALUES = new Set(Object.values(BG_DRAFTS).map((entry) => normalizeWhitespace(entry.value)));

function isNonContentString(value: string, keyPath: string): boolean {
  const leaf = keyPath.split(".").at(-1) ?? "";
  if (leaf === "href" || leaf.endsWith("Href") || leaf === "domain") {
    return true;
  }
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/.test(value)) {
    return true;
  }
  return false;
}

function collectStrings(value: unknown, prefix: string): Array<{ path: string; value: string }> {
  if (typeof value === "string") {
    return [{ path: prefix, value }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${prefix}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => {
      if (key === "source" || key === "wave" || key === "gate" || key === "aspect") {
        return [];
      }
      return collectStrings(child, prefix ? `${prefix}.${key}` : key);
    });
  }
  return [];
}

function assertCleanBulgarianText(value: string, label: string) {
  expect(value, `${label} contains Ukrainian letters`).not.toMatch(UKRAINIAN_LETTERS);
  expect(value, `${label} contains bracket placeholder`).not.toMatch(BRACKET_PLACEHOLDERS);
  for (const forbidden of SERVICE_LABELS) {
    expect(value, `${label} contains service label ${forbidden}`).not.toMatch(forbidden);
  }
}

function assertVerbatimAgainstSource(
  source: ContentSource,
  payload: unknown,
  label: string,
) {
  const docText = readNormalizedSource(source.file);
  const strings = collectStrings(payload, label);
  expect(strings.length, `${label} must contain verifiable strings`).toBeGreaterThan(0);

  for (const entry of strings) {
    if (isNonContentString(entry.value, entry.path)) {
      continue;
    }
    assertCleanBulgarianText(entry.value, entry.path);
    const normalized = normalizeWhitespace(entry.value);
    const inSource = docText.includes(normalized);
    const inDrafts = DRAFT_VALUES.has(normalized);
    expect(
      inSource || inDrafts,
      `${entry.path} is neither verbatim in docs/site-texts/${source.file} nor in content/bg/drafts.ts:\n  "${entry.value}"`,
    ).toBe(true);
  }
}

describe("content/bg verbatim and integrity checks (CR-A3, CR-A5, CR-A9)", () => {
  it("contains all 31 expected docs/site-texts markdown files", () => {
    const files = fs
      .readdirSync(SITE_TEXTS_DIR)
      .filter((name) => name.endsWith(".md"))
      .sort();
    expect(files).toHaveLength(31);
    expect(files[0]).toBe("00-README.md");
    expect(files[files.length - 1]).toBe("30-metadani-saytu.md");
  });

  it("verifies HOME_HERO block verbatim against docs/site-texts/02-nachalo.md", () => {
    const blocks: readonly ContentBlock<unknown>[] = [HOME_HERO];
    for (const block of blocks) {
      assertVerbatimAgainstSource(block.source, block.data, `${block.source.file}:${block.source.block}`);
    }
  });

  it("verifies SHARED_FORMULATIONS verbatim against docs/site-texts/00-README.md", () => {
    assertVerbatimAgainstSource(SHARED_FORMULATIONS.source, SHARED_FORMULATIONS, "shared");
  });

  it("verifies COMPANY details verbatim against their source files", () => {
    assertVerbatimAgainstSource(COMPANY.source, COMPANY, "company");
    assertVerbatimAgainstSource(COMPANY_ABOUT_DETAILS.source, COMPANY_ABOUT_DETAILS, "company.about");
    assertVerbatimAgainstSource(COMPANY_LEGAL_DETAILS.source, COMPANY_LEGAL_DETAILS, "company.legal");
  });

  it("verifies BG_HEADER_NAV and BG_SOLUTIONS_LINKS verbatim against file 01 and gate filtering (GL-05, CR-06)", () => {
    assertVerbatimAgainstSource(BG_HEADER_NAV.source, BG_HEADER_NAV, "bgHeaderNav");
    expect(BG_SOLUTIONS_LINKS.map((item) => item.href)).toEqual([
      "/smyana-na-agentsiya",
      "/onlayn-magazini",
      "/uslugi-i-b2b",
      "/hoteli",
      "/nedvizhimi-imoti",
    ]);
    const published = getPublishedBgSolutionsLinks();
    expect(published.some((item) => item.href === "/hoteli")).toBe(isGateOpen("hotels"));
    expect(published.map((item) => item.href)).toEqual([
      "/smyana-na-agentsiya",
      "/onlayn-magazini",
      "/uslugi-i-b2b",
      "/nedvizhimi-imoti",
    ]);
  });

  it("verifies BG_FOOTER verbatim against file 01 and gates closed segment links (GL-08..GL-12)", () => {
    const verifiableColumns = BG_FOOTER.columns.map((column) => ({
      title: column.title,
      items: column.items.map((item) => (item.kind === "text" ? item.text : item.label)),
    }));
    const verifiableSocials = BG_FOOTER.socials.map((item) => ({
      href: item.href,
      label: item.label,
    }));
    assertVerbatimAgainstSource(
      BG_FOOTER.source,
      { columns: verifiableColumns, socials: verifiableSocials },
      "bgFooter",
    );

    const publishedColumns = getPublishedBgFooterColumns();
    expect(publishedColumns.map((column) => column.title)).toEqual([
      "Решения",
      "Компания",
      "Контакт",
      "Правни",
    ]);
    const solutionsCol = publishedColumns[0];
    expect(
      solutionsCol.items.some((item) => item.kind === "link" && item.href === "/hoteli"),
    ).toBe(isGateOpen("hotels"));
    expect(BG_FOOTER.socials).toHaveLength(1);
    expect(BG_FOOTER.socials[0].href).toBe(COMPANY.linkedinHref);
  });

  it("verifies BG consent strings match CN-01..CN-05 (Variant B: 3 categories, /legal/biskvitki, zero Latin leaks)", () => {
    expect(bgUi.consent.cookiesHref).toBe("/legal/biskvitki");
    expect(bgUi.consent.cookieSettingsButton).toBe("Настройки за бисквитки");
    expect(bgUi.consent.necessaryOnly).toBe("Само необходимите");
    expect(bgUi.consent.acceptAll).toBe("Приемам всички");
    expect(bgUi.consent.settings).toBe("Настройки");
    expect(bgUi.consent.saveChoices).toBe("Запазване на избора");
    expect(Object.keys(bgUi.consent.categories)).toEqual(["necessary", "statistics", "marketing"]);
    expect(bgUi.consent.categories.necessary.services).toBe("Маркетинг Завод");

    const allowedServices = [
      "Google Analytics",
      "PostHog",
      "Amplitude",
      "Vercel Speed Insights",
      "Google Ads",
      "Meta",
      "LinkedIn",
    ];
    for (const entry of collectStrings(bgUi.consent, "bgUi.consent")) {
      if (isNonContentString(entry.value, entry.path)) {
        continue;
      }
      let stripped = entry.value;
      for (const service of allowedServices) {
        stripped = stripped.replaceAll(service, "");
      }
      expect(stripped, `${entry.path} contains unexpected Latin text`).not.toMatch(/[A-Za-z]/);
    }
  });

  it("verifies BG_NOT_FOUND verbatim against docs/site-texts/26-404.md and gates closed segments (NF-01)", () => {
    const verifiable = {
      hero: {
        title: BG_NOT_FOUND.hero.title,
        description: BG_NOT_FOUND.hero.description,
        actions: BG_NOT_FOUND.hero.actions.map((action) => action.text),
      },
      suggestedGroup: {
        title: BG_NOT_FOUND.suggestedGroup.title,
        items: BG_NOT_FOUND.suggestedGroup.items.map((item) => item.label),
      },
      solutionsGroup: {
        title: BG_NOT_FOUND.solutionsGroup.title,
        items: BG_NOT_FOUND.solutionsGroup.allItems.map((item) => item.label),
      },
    };
    assertVerbatimAgainstSource(BG_NOT_FOUND.source, verifiable, "bgNotFound");
    expect(BG_NOT_FOUND.hero.actions.map((a) => a.location)).toEqual(["not_found", "not_found"]);

    const published = getPublishedBgNotFoundSolutions();
    expect(published.some((item) => item.href === "/hoteli")).toBe(isGateOpen("hotels"));
    expect(published.map((item) => item.href)).toEqual([
      "/smyana-na-agentsiya",
      "/onlayn-magazini",
      "/uslugi-i-b2b",
      "/nedvizhimi-imoti",
    ]);
  });

  it("verifies all entries in BG_DRAFTS have spec, date, no Ukrainian letters, no placeholders", () => {
    for (const [key, entry] of Object.entries(BG_DRAFTS)) {
      expect(entry.value.trim().length, `draft ${key} value empty`).toBeGreaterThan(0);
      expect(entry.spec.trim().length, `draft ${key} spec empty`).toBeGreaterThan(0);
      expect(entry.date, `draft ${key} date format`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      assertCleanBulgarianText(entry.value, `drafts.${key}`);
    }
  });

  it("verifies every gate in content/bg/gates.ts has a valid Linear issue ID and expected defaults", () => {
    const entries = Object.entries(BG_GATES);
    expect(entries.length).toBeGreaterThanOrEqual(15);
    for (const [key, gate] of entries) {
      expect(gate.issue, `gate ${key} issue ID`).toMatch(/^ZAV-\d+$/);
      expect(typeof gate.open, `gate ${key} boolean state`).toBe("boolean");
      expect(gate.note.trim().length, `gate ${key} note`).toBeGreaterThan(0);
    }
    expect(isGateOpen("illustrations")).toBe(true);
    expect(isGateOpen("hotels")).toBe(false);
    expect(CASES_PAGE_MODE).toBe("pilot");
  });

  it("verifies founder photo resolver and every FOUNDER_PHOTOS crop exists in public/founders/ and is not original", () => {
    expect(resolveFounderPhotoPath("фото/egor-goncharenko-1x1-800.webp")).toBe(
      "/founders/egor-goncharenko-1x1-800.webp",
    );
    expect(() => resolveFounderPhotoPath("фото/egor-goncharenko-original.jpg")).toThrow();
    expect(() => resolveFounderPhotoPath("../secret.jpg")).toThrow();

    for (const [key, photo] of Object.entries(FOUNDER_PHOTOS)) {
      expect(photo.jpg, `${key}.jpg must not reference original`).not.toContain("-original.");
      expect(
        fs.existsSync(path.join(PUBLIC_DIR, photo.jpg.replace(/^\//, ""))),
        `${key}.jpg missing at public${photo.jpg}`,
      ).toBe(true);
      if ("webp" in photo && photo.webp) {
        expect(photo.webp, `${key}.webp must not reference original`).not.toContain("-original.");
        expect(
          fs.existsSync(path.join(PUBLIC_DIR, photo.webp.replace(/^\//, ""))),
          `${key}.webp missing at public${photo.webp}`,
        ).toBe(true);
      }
      assertVerbatimAgainstSource(photo.source, { alt: photo.alt }, `founderPhotos.${key}`);
    }
  });

  it("formats Bulgarian dates in DD.MM.YYYY (CR-12)", () => {
    expect(formatBgDate("2026-11-20")).toBe("20.11.2026");
    expect(LAUNCH_PUBLICATION_DATE_ISO).toBe("2026-11-20");
    expect(LAUNCH_PUBLICATION_DATE_BG).toBe("20.11.2026");
    expect(() => formatBgDate("20.11.2026")).toThrow();
  });

  it("verifies content/bg/ui.ts strings are verbatim in source files or BG_DRAFTS with zero Ukrainian letters or placeholders", () => {
    const combinedDocs = BG_UI_SOURCE_FILES.map((file) => readNormalizedSource(file)).join(" ");
    const entries = collectStrings(bgUi, "bgUi");
    expect(entries.length).toBeGreaterThan(20);

    for (const entry of entries) {
      if (
        entry.value === "" ||
        entry.path === "bgUi.globalError.lang" ||
        isNonContentString(entry.value, entry.path)
      ) {
        continue;
      }
      assertCleanBulgarianText(entry.value, entry.path);
      const normalized = normalizeWhitespace(entry.value);
      const inDocs = combinedDocs.includes(normalized);
      const inDrafts = DRAFT_VALUES.has(normalized);
      expect(
        inDocs || inDrafts,
        `${entry.path} is neither verbatim in docs/site-texts/ nor registered in content/bg/drafts.ts:\n  "${entry.value}"`,
      ).toBe(true);
    }
  });

  it("verifies content/jet/ui.ts and content/bg/ui.ts have identical deep key structure", () => {
    const extractKeys = (obj: unknown, prefix = ""): string[] => {
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
        return [prefix];
      }
      return Object.entries(obj)
        .sort(([a], [b]) => a.localeCompare(b))
        .flatMap(([key, child]) => extractKeys(child, prefix ? `${prefix}.${key}` : key));
    };
    expect(extractKeys(bgUi)).toEqual(extractKeys(jetUi));
  });
});
