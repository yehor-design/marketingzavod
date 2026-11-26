import type { ContentSource } from "./types";

/** Unified verbatim formulations from 00-README.md (CR-13). */
export const SHARED_FORMULATIONS = {
  source: {
    file: "00-README.md",
    block: "Єдині формулювання",
  } satisfies ContentSource,
  firstStep:
    "Пилот 30 дни: одит, първи кампании и отчет „преди / след“ — от 690 € общо. След пилота решавате. Ако продължим — минимум 3 месеца с плащане месечно предварително. Само одит — от 490 €; ако продължим с пилот, сумата се приспада.",
  packages: "«Старт» от 290 € · «Растеж» от 690 € · «Мащаб» от 1 490 € на месец без ДДС",
  whoWorks: "стратег и проверени изпълнители",
  meetings: "Срещи на живо във Варна — по уговорка",
  responseTime: "Отговаряме до 1 работен ден",
  formPrivacyNote: "Как обработваме данните ви — в Политиката за поверителност",
  accountTransferProcess: "помагаме да прехвърлите",
  accountTransferHistory: "и да запазите историята, където платформите позволяват",
} as const;

/** Dynamic numbers referenced across Bulgarian pages (CR-11). */
export const SHARED_NUMBERS = {
  pilotSlots: 3,
  pilotDeadlineMonthYear: "февруари 2027",
  marketProvidersCount: "3 232",
  marketPublishPricesPct: "23%",
  marketAccountOwnershipCount: "11 от 324",
  strategistMaxClients: 8,
  minRetainerMonths: 3,
  pilotDurationDays: 30,
  prices: {
    startEur: 290,
    auditEur: 490,
    pilotEur: 690,
    growthEur: 690,
    scaleEur: 1490,
    propertyLaunchEur: 890,
  },
} as const;

/** Formats an ISO date (`YYYY-MM-DD`) into Bulgarian `DD.MM.YYYY` display format (CR-12). */
export function formatBgDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) {
    throw new Error(`Invalid ISO date for formatBgDate: "${isoDate}"`);
  }
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

export const LAUNCH_PUBLICATION_DATE_ISO = "2026-11-20";
export const LAUNCH_PUBLICATION_DATE_BG = formatBgDate(LAUNCH_PUBLICATION_DATE_ISO);
