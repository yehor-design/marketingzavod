-- Заявки за first touch і last touch.
-- First touch: джерело, з яким користувача вперше побачив GA4 (traffic_source).
-- Last touch: джерело сесії, у якій сталася заявка.
-- Точніша атрибуція з вікном 90 днів лежить у CRM (властивості wb_ft_* і wb_lt_*).
-- Заміни PROJECT.DATASET і діапазон дат.
WITH events AS (
  SELECT
    user_pseudo_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
    event_timestamp,
    event_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'form_name') AS form_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'lead_id') AS lead_id,
    traffic_source.source AS first_source,
    traffic_source.medium AS first_medium,
    traffic_source.name AS first_campaign,
    collected_traffic_source.manual_source AS session_source,
    collected_traffic_source.manual_medium AS session_medium,
    collected_traffic_source.manual_campaign_name AS session_campaign
  FROM `PROJECT.DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
                          AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
),
session_source AS (
  SELECT
    user_pseudo_id,
    session_id,
    ARRAY_AGG(session_source IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS source,
    ARRAY_AGG(session_medium IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS medium,
    ARRAY_AGG(session_campaign IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS campaign
  FROM events
  GROUP BY user_pseudo_id, session_id
),
leads AS (
  SELECT DISTINCT
    lead_id, form_name, user_pseudo_id, session_id, first_source, first_medium, first_campaign
  FROM events
  WHERE event_name = 'generate_lead'
)
SELECT
  leads.form_name,
  COALESCE(leads.first_source, '(direct)') AS first_touch_source,
  COALESCE(leads.first_medium, '(none)') AS first_touch_medium,
  COALESCE(leads.first_campaign, '(not set)') AS first_touch_campaign,
  COALESCE(session_source.source, '(direct)') AS last_touch_source,
  COALESCE(session_source.medium, '(none)') AS last_touch_medium,
  COALESCE(session_source.campaign, '(not set)') AS last_touch_campaign,
  COUNT(*) AS leads
FROM leads
LEFT JOIN session_source
  ON session_source.user_pseudo_id = leads.user_pseudo_id
 AND session_source.session_id = leads.session_id
GROUP BY 1, 2, 3, 4, 5, 6, 7
ORDER BY leads DESC;
