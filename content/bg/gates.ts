/**
 * Single registry of publication gates for the Bulgarian edition (CR-15, CR-16).
 * Every gate references its owning Linear issue; closed gates hide dependent
 * routes or blocks until Yehor resolves the decision.
 */
export type GateEntry = {
  readonly open: boolean;
  readonly issue: `ZAV-${number}`;
  readonly note: string;
};

export const BG_GATES = {
  hotels: {
    open: false,
    issue: "ZAV-72",
    note: "Решение 30: /hoteli, статия 19 і картка готелів у першій хвилі",
  },
  forbes: {
    open: false,
    issue: "ZAV-73",
    note: "Решение 36: звірка цитат/статистики Forbes България (05, 14, 22)",
  },
  viber: {
    open: false,
    issue: "ZAV-74",
    note: "Умови Viber для бізнесу в CRM (файл 08, Feature section 6)",
  },
  calendar: {
    open: false,
    issue: "ZAV-75",
    note: "URL запису в календар (Cal.com / Google Calendar) на /kontakt",
  },
  howToCheck: {
    open: false,
    issue: "ZAV-76",
    note: "Погоджені інструкції «Как да проверите» та місяць перевірки (файл 13)",
  },
  creativeSla04: {
    open: false,
    issue: "ZAV-69",
    note: "Решение 3: SLA «поне 4 нови концепции на месец» на /onlayn-magazini",
  },
  firstThreeClients: {
    open: false,
    issue: "ZAV-70",
    note: "Решение 25: блок «Условие за първите 3 клиенти» на /keysi",
  },
  season2027: {
    open: false,
    issue: "ZAV-71",
    note: "Решение 26: блок «Сезон 2027» на /hoteli",
  },
  emailService: {
    open: false,
    issue: "ZAV-68",
    note: "Решение 14/35: підключений імейл-сервіс для PDF-чеклиста й розсилки",
  },
  illustrations: {
    open: true,
    issue: "ZAV-65",
    note: "Вирішено 26.11.2026: анімовані відтворення існуючих ілюстрацій із https://illos.dev/library",
  },
  preferencesCategory: {
    open: false,
    issue: "ZAV-66",
    note: "Категорія cookies «Предпочитания» (CN-04, за замовчуванням варіант Б)",
  },
  motto: {
    open: false,
    issue: "ZAV-78",
    note: "Решение 24: девіз «Проучваме задълбочено…» на /za-nas",
  },
  aiAddons: {
    open: false,
    issue: "ZAV-79",
    note: "Решение 5: ціни AI-добавок (Viber-асистент, GEO) у таблиці цін",
  },
  article18: {
    open: false,
    issue: "ZAV-81",
    note: "Решение 31: стаття 18 (хвиля 2, після звірки CSV і медіа-ексклюзиву)",
  },
  article21: {
    open: false,
    issue: "ZAV-80",
    note: "Решение 18: стаття 21 про Meta (хвиля 2, після звірки з Meta Help Center)",
  },
} as const satisfies Record<string, GateEntry>;

export type GateKey = keyof typeof BG_GATES;

/** State of /keysi: "pilot" (state A) before the first published case, "cases" (state B) after (PL-04). */
export const CASES_PAGE_MODE: "pilot" | "cases" = "pilot";

export function isGateOpen(gate: GateKey): boolean {
  return BG_GATES[gate].open;
}
