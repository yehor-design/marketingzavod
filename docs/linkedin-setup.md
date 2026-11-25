# LinkedIn Insight Tag

Відкладений канал. Код і теги готові і неактивні, доки немає Partner ID.

## Що зробити в кабінеті

- [ ] Створи акаунт у LinkedIn Campaign Manager.
- [ ] Analyze → Insight Tag → Install my Insight Tag → «I will use a tag manager» → скопіюй **Partner ID** у Vercel як `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`.
- [ ] Analyze → Conversion tracking → Create conversion. Джерело: **Insight Tag**, спосіб відстеження: **Event-specific** (не «Page load»):

  | Назва | Тип | Цінність | Вікно | Змінна з ID конверсії |
  | --- | --- | --- | --- | --- |
  | Contact lead | Lead | 50 EUR | 90 днів клік, 7 днів перегляд | `NEXT_PUBLIC_LINKEDIN_CONVERSION_CONTACT` |
  | Waitlist signup | Sign up | 10 EUR | 30 днів клік, 7 днів перегляд | `NEXT_PUBLIC_LINKEDIN_CONVERSION_WAITLIST` |

  На останньому кроці LinkedIn показує фрагмент `lintrk('track', { conversion_id: 1234567 })`. Число з нього і є ID конверсії.
- [ ] Analyze → Insight Tag → Manage Insight Tag → додай домен `marketingzavod.com`.
- [ ] Plan → Audiences → Create audience → Website: «Усі відвідувачі, 90 днів» і «Відвідали `/pricing`, 30 днів».
- [ ] Redeploy. Новий імпорт контейнера не потрібен, якщо його вже імпортовано з цими тегами.

## Як це працює

| Тег GTM | Тригер | Вимога згоди |
| --- | --- | --- |
| `LinkedIn - Insight Tag` | перший `page_view` або `consent_update` | `ad_storage` |
| `LinkedIn - Conversion - Contact lead` | `generate_lead`, `form_name = contact` | `ad_storage` |
| `LinkedIn - Conversion - Waitlist signup` | `join_waitlist` | `ad_storage` |

`li_fat_id` входить до списку click ID модуля атрибуції: він зберігається в cookie `mz_attr` за згоди на маркетинг і потрапляє в HubSpot у властивість `mz_li_fat_id`.

## Перевірка

Розширення LinkedIn Insight Tag Helper показує активний тег після згоди. У Campaign Manager статус тега стає Active, а тестова конверсія з'являється протягом доби.
