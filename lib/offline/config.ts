/**
 * Deal stages that count as conversions after the form: the offline funnel.
 * Names and values mirror docs/tracking-plan.md. Values are placeholders agreed
 * for bidding, not revenue. Change them here and in the plan together.
 */
export type OfflineConversion = {
  key: "qualified_lead" | "deal_won";
  /** HubSpot deal stage ID. Defaults match HubSpot's default sales pipeline. */
  stage: string;
  /** Conversion action name in Google Ads (type: import). Must match exactly. */
  googleAdsName: string;
  /** Event name in Meta. */
  metaEvent: string;
  value: number;
  currency: string;
};

export function offlineConversions(): OfflineConversion[] {
  return [
    {
      key: "qualified_lead",
      stage: process.env.HUBSPOT_STAGE_QUALIFIED?.trim() || "qualifiedtobuy",
      googleAdsName: "Qualified lead (offline)",
      metaEvent: "QualifiedLead",
      value: 50,
      currency: "EUR",
    },
    {
      key: "deal_won",
      stage: process.env.HUBSPOT_STAGE_WON?.trim() || "closedwon",
      googleAdsName: "Deal won (offline)",
      metaEvent: "DealWon",
      value: 500,
      currency: "EUR",
    },
  ];
}

export function conversionForStage(stage: string): OfflineConversion | undefined {
  return offlineConversions().find((conversion) => conversion.stage === stage);
}
