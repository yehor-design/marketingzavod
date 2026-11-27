import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { posts, type Block } from "@/lib/blog";
import { legalDocuments, type LegalBlock } from "@/lib/legal";
import {
  inlineToPlainText,
  isExternalHref,
  isInternalPath,
  type RichTextContent,
  type RichTextFragment,
} from "@/lib/rich-text";

const SITE_TEXTS_DIR = path.join(process.cwd(), "docs", "site-texts");

function readSourceStripped(file: string): string {
  const raw = fs.readFileSync(path.join(SITE_TEXTS_DIR, file), "utf8");
  return raw
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[\s\u00A0]+/g, " ")
    .trim();
}

describe("lib/rich-text helpers and extended Block / LegalBlock compatibility (CR-A3, ТП-06)", () => {
  it("joins plain strings and mixed inline fragments without inserting extra whitespace", () => {
    expect(inlineToPlainText("Plain paragraph.")).toBe("Plain paragraph.");
    expect(inlineToPlainText([])).toBe("");

    const fragments: readonly RichTextFragment[] = [
      { text: "Проверете своите акаунти с " },
      { text: "безплатния ни чеклист", href: "/proverka-na-akaunti" },
      { text: "." },
    ];
    expect(inlineToPlainText(fragments)).toBe(
      "Проверете своите акаунти с безплатния ни чеклист.",
    );

    const mixed: RichTextContent = [
      { text: "Едно място за всички запитвания", strong: true },
      { text: " — формите от сайта, Viber, телефон и имейл." },
    ];
    expect(inlineToPlainText(mixed)).toBe(
      "Едно място за всички запитвания — формите от сайта, Viber, телефон и имейл.",
    );
  });

  it("matches verbatim Bulgarian paragraphs from docs/site-texts after joining fragments (CR-A3)", () => {
    const article17 = readSourceStripped("17-blog-predi-da-podpishete.md");
    const article17LinkParagraph: readonly RichTextFragment[] = [
      { text: "Проверете своите акаунти с " },
      { text: "безплатния ни чеклист", href: "/proverka-na-akaunti" },
      { text: "." },
    ];
    expect(article17).toContain(inlineToPlainText(article17LinkParagraph));

    const article17PilotParagraph: readonly RichTextFragment[] = [
      {
        text: "Поискайте кейс с базова линия, период и рекламен бюджет — без тях резултатът не може да се оцени. Тук ние губим: Маркетинг Завод е нова агенция и още нямаме публикувани кейси. Затова предлагаме ",
      },
      { text: "пилот 30 дни", href: "/keysi" },
      {
        text: " с отчет „преди / след“ на вашите цифри. Ако агенцията има кейси, проверете дали всяка цифра има дата и източник.",
      },
    ];
    expect(article17).toContain(inlineToPlainText(article17PilotParagraph));

    const article22 = readSourceStripped("22-blog-crm-za-malka-firma.md");
    const article22NumberedItem: readonly RichTextFragment[] = [
      { text: "Едно място за всички запитвания", strong: true },
      { text: " — формите от сайта, Viber, телефон и имейл." },
    ];
    expect(article22).toContain(inlineToPlainText(article22NumberedItem));

    const legal29 = readSourceStripped("29-legal-biskvitki.md");
    const legal29Paragraph: readonly RichTextFragment[] = [
      { text: "Как обработваме личните данни, събрани чрез бисквитките, е описано в " },
      { text: "Политиката за поверителност", href: "/legal/poveritelnost" },
      { text: ". Въпроси: " },
      { text: "zavodzamarketing@gmail.com", href: "mailto:zavodzamarketing@gmail.com" },
      { text: "." },
    ];
    expect(legal29).toContain(inlineToPlainText(legal29Paragraph));
  });

  it("classifies external URLs vs internal paths vs non-HTTP schemes accurately", () => {
    expect(isExternalHref("https://web.dev/articles/vitals")).toBe(true);
    expect(isExternalHref("http://example.com")).toBe(true);
    expect(isExternalHref("//example.com/path")).toBe(true);
    expect(isExternalHref("/proverka-na-akaunti")).toBe(false);
    expect(isExternalHref("#cookies")).toBe(false);
    expect(isExternalHref("mailto:zavodzamarketing@gmail.com")).toBe(false);
    expect(isExternalHref("tel:+359888000000")).toBe(false);

    expect(isInternalPath("/proverka-na-akaunti")).toBe(true);
    expect(isInternalPath("/legal/poveritelnost#cookies")).toBe(true);
    expect(isInternalPath("//example.com")).toBe(false);
    expect(isInternalPath("https://marketingzavod.com")).toBe(false);
    expect(isInternalPath("mailto:zavodzamarketing@gmail.com")).toBe(false);
  });

  it("keeps existing English Jet blog and legal documents intact as strict subsets of extended types", () => {
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      const blocks: readonly Block[] = post.body;
      expect(blocks.length).toBeGreaterThan(0);
    }

    expect(legalDocuments.length).toBeGreaterThan(0);
    for (const doc of legalDocuments) {
      const blocks: readonly LegalBlock[] = doc.blocks;
      expect(blocks.length).toBeGreaterThan(0);
    }
  });
});
