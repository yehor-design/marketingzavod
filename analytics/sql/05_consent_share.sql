-- Частка трафіку зі згодою і без, по днях.
-- privacy_info.analytics_storage і ads_storage мають значення 'Yes', 'No' або NULL (не задано).
-- Без згоди на аналітику події приходять без user_pseudo_id, тому рахуються події, а не користувачі.
-- Заміни PROJECT.DATASET і діапазон дат.
SELECT
  PARSE_DATE('%Y%m%d', event_date) AS day,
  COUNT(*) AS events,
  COUNTIF(privacy_info.analytics_storage = 'Yes') AS events_analytics_granted,
  COUNTIF(privacy_info.analytics_storage = 'No') AS events_analytics_denied,
  COUNTIF(privacy_info.analytics_storage IS NULL) AS events_analytics_unset,
  ROUND(SAFE_DIVIDE(COUNTIF(privacy_info.analytics_storage = 'Yes'), COUNT(*)) * 100, 2) AS analytics_granted_pct,
  ROUND(SAFE_DIVIDE(COUNTIF(privacy_info.ads_storage = 'Yes'), COUNT(*)) * 100, 2) AS ads_granted_pct,
  COUNTIF(event_name = 'page_view') AS page_views,
  COUNTIF(event_name = 'page_view' AND privacy_info.analytics_storage = 'Yes') AS page_views_granted
FROM `PROJECT.DATASET.events_*`
WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                        AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
GROUP BY day
ORDER BY day DESC;
