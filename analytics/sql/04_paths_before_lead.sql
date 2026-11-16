-- Шлях сторінок перед заявкою: до п'яти останніх переглядів у сесії заявки.
-- Заміни PROJECT.DATASET і діапазон дат.
WITH events AS (
  SELECT
    user_pseudo_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
    event_timestamp,
    event_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_path') AS page_path,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'form_name') AS form_name
  FROM `PROJECT.DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                          AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
    AND event_name IN ('page_view', 'generate_lead')
),
leads AS (
  SELECT user_pseudo_id, session_id, form_name, MIN(event_timestamp) AS lead_at
  FROM events
  WHERE event_name = 'generate_lead'
  GROUP BY user_pseudo_id, session_id, form_name
),
paths AS (
  SELECT
    leads.form_name,
    leads.user_pseudo_id,
    leads.session_id,
    ARRAY_TO_STRING(
      ARRAY_REVERSE(ARRAY_AGG(events.page_path IGNORE NULLS ORDER BY events.event_timestamp DESC LIMIT 5)),
      ' → '
    ) AS path
  FROM leads
  JOIN events
    ON events.user_pseudo_id = leads.user_pseudo_id
   AND events.session_id = leads.session_id
   AND events.event_name = 'page_view'
   AND events.event_timestamp <= leads.lead_at
  GROUP BY leads.form_name, leads.user_pseudo_id, leads.session_id
)
SELECT form_name, path, COUNT(*) AS leads
FROM paths
GROUP BY form_name, path
ORDER BY leads DESC
LIMIT 50;
