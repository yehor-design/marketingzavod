-- Сесії і користувачі за джерелом, каналом і кампанією.
-- Джерело сесії береться з першої події сесії, що має параметри трафіку.
-- Заміни PROJECT.DATASET і діапазон дат.
WITH events AS (
  SELECT
    user_pseudo_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
    event_timestamp,
    event_name,
    COALESCE(collected_traffic_source.manual_source, traffic_source.source) AS source,
    COALESCE(collected_traffic_source.manual_medium, traffic_source.medium) AS medium,
    COALESCE(collected_traffic_source.manual_campaign_name, traffic_source.name) AS campaign,
    collected_traffic_source.gclid AS gclid
  FROM `PROJECT.DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                          AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
),
sessions AS (
  SELECT
    user_pseudo_id,
    session_id,
    ARRAY_AGG(source IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS source,
    ARRAY_AGG(medium IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS medium,
    ARRAY_AGG(campaign IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS campaign,
    LOGICAL_OR(gclid IS NOT NULL) AS has_gclid,
    COUNTIF(event_name = 'generate_lead') AS leads
  FROM events
  WHERE session_id IS NOT NULL
  GROUP BY user_pseudo_id, session_id
)
SELECT
  COALESCE(source, '(direct)') AS source,
  COALESCE(medium, '(none)') AS medium,
  COALESCE(campaign, '(not set)') AS campaign,
  CASE
    WHEN has_gclid OR medium IN ('cpc', 'ppc', 'paid_search') THEN 'Paid Search'
    WHEN medium IN ('paid_social', 'paidsocial') THEN 'Paid Social'
    WHEN medium IN ('display', 'video') THEN 'Display & Video'
    WHEN medium = 'email' THEN 'Email'
    WHEN medium = 'organic' THEN 'Organic Search'
    WHEN medium IN ('organic_social', 'social') THEN 'Organic Social'
    WHEN medium IN ('referral', 'affiliate') THEN 'Referral'
    WHEN source IS NULL OR medium IS NULL OR medium = '(none)' THEN 'Direct'
    ELSE 'Other'
  END AS channel,
  COUNT(*) AS sessions,
  COUNT(DISTINCT user_pseudo_id) AS users,
  SUM(leads) AS leads,
  ROUND(SAFE_DIVIDE(COUNTIF(leads > 0), COUNT(*)) * 100, 2) AS session_conversion_pct
FROM sessions
GROUP BY source, medium, campaign, channel
ORDER BY sessions DESC;
