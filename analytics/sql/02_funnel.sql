-- Воронка: перегляд → cta_click → form_start → generate_lead.
-- Закрита воронка за користувачем: кожен наступний крок має статися не раніше попереднього.
-- Заміни PROJECT.DATASET і діапазон дат.
WITH steps AS (
  SELECT
    user_pseudo_id,
    MIN(IF(event_name = 'page_view', event_timestamp, NULL)) AS viewed_at,
    MIN(IF(event_name = 'cta_click', event_timestamp, NULL)) AS clicked_at,
    MIN(IF(event_name = 'form_start', event_timestamp, NULL)) AS started_at,
    MIN(IF(event_name = 'generate_lead', event_timestamp, NULL)) AS lead_at
  FROM `PROJECT.DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                          AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
    AND event_name IN ('page_view', 'cta_click', 'form_start', 'generate_lead')
  GROUP BY user_pseudo_id
),
counts AS (
  SELECT
    COUNTIF(viewed_at IS NOT NULL) AS step_1_view,
    COUNTIF(viewed_at IS NOT NULL AND clicked_at >= viewed_at) AS step_2_cta_click,
    COUNTIF(viewed_at IS NOT NULL AND clicked_at >= viewed_at AND started_at >= clicked_at) AS step_3_form_start,
    COUNTIF(
      viewed_at IS NOT NULL AND clicked_at >= viewed_at AND started_at >= clicked_at AND lead_at >= started_at
    ) AS step_4_generate_lead
  FROM steps
)
SELECT step, users, pct_of_previous, pct_of_first
FROM (
  SELECT 1 AS position, 'page_view' AS step, step_1_view AS users,
         100.0 AS pct_of_previous, 100.0 AS pct_of_first
  FROM counts
  UNION ALL
  SELECT 2, 'cta_click', step_2_cta_click,
         ROUND(SAFE_DIVIDE(step_2_cta_click, step_1_view) * 100, 2),
         ROUND(SAFE_DIVIDE(step_2_cta_click, step_1_view) * 100, 2)
  FROM counts
  UNION ALL
  SELECT 3, 'form_start', step_3_form_start,
         ROUND(SAFE_DIVIDE(step_3_form_start, step_2_cta_click) * 100, 2),
         ROUND(SAFE_DIVIDE(step_3_form_start, step_1_view) * 100, 2)
  FROM counts
  UNION ALL
  SELECT 4, 'generate_lead', step_4_generate_lead,
         ROUND(SAFE_DIVIDE(step_4_generate_lead, step_3_form_start) * 100, 2),
         ROUND(SAFE_DIVIDE(step_4_generate_lead, step_1_view) * 100, 2)
  FROM counts
)
ORDER BY position;
