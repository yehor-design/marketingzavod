# Наскрізна перевірка трекінгу

Документ має дві частини: що вже перевірено і з яким результатом, та сценарій, який треба повторювати на production після змін. Найсвіжіший результат — розділ «Production marketingzavod.com».

## Автоматичні сценарії (`npm run test:e2e`)

Збірка: `next build` з `NEXT_PUBLIC_TRACKING_DEBUG=true`, `GTM-E2ETEST` і підставним ключем Amplitude. Запити до GTM, Amplitude і Vercel перехоплюються. Банер згоди в цій збірці видно. Сценарії першого візиту, «Accept all», «Necessary only», «Settings», відкликання через футер і клавіатури — у `tests/e2e/banner.spec.ts`; решта тестів стартує зі збереженого «Necessary only», що для трекінгу те саме, що «без вибору». Шлях у кожному сценарії: захід на `/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST` → Pricing → Contact → заявка.

| Сценарій | Перевірка |
| --- | --- |
| Без вибору | Жодної cookie і жодного ключа в localStorage; жодного запиту до Google, Amplitude чи Speed Insights |
| | У запиті до `/api/lead` лише `utm_source`, `utm_medium`, `utm_campaign`; `amplitude_device_id` немає |
| | Три сторінки дали рівно три `page_view` |
| GTM зі збереженим вибором | У `dataLayer`: ідентифікатори → Consent Mode `default` за вибором → `consent_statistics`/`consent_marketing` → `gtm.js` → `page_view`. Контейнер запитано один раз; Amplitude і Speed Insights стартують |
| «Accept all» у банері | Без перезавантаження: `consent_update`, GTM, запити до Amplitude |
| Відкликання | Сторінка перезавантажується, лишається лише `mz_consent`, cookies і localStorage GA4, Amplitude, Meta зникли |
| Футер | «Cookie settings» відкриває панель із поточним вибором |
| Події | `page_view` один на маршрут, `cta_click`, `faq_open` (лише розкриття), `outbound_click`, `contact_click`, `view_pricing`, `begin_checkout`, `form_start`, `form_error`, `generate_lead`, `join_waitlist` |
| Персональні дані | У `dataLayer` і в URL після заявки немає email, імені, тексту повідомлення і ключа `user_data` |
| API заявок | Валідація (400 з назвами полів), поле-пастка, чужий origin (403), ліміт 5 на хвилину (429) |
| SEO | `sitemap.xml`, `robots.txt` і `X-Robots-Tag: noindex` поза production, 404 для неіснуючої сторінки, canonical, JSON-LD |
| Доступність | axe без порушень рівнів A і AA для банера і панелі |

Юніт-тести (`npm test`) покривають розбір URL, first і last touch, нормалізацію, валідацію заявок, мапінг у HubSpot, хешування і тіло запиту Conversions API, підпис webhook, формат файла Google Ads, Amplitude (черга до згоди, Session Replay, ідентифікація ліда, HTTP API), журнал згод, очищення сховища й IndexedDB і відповідність контейнера GTM плану подій.

### Що автотести не доводять

- Що теги в контейнері спрацьовують у правильному порядку в справжньому GTM.
- Що HubSpot, Meta, GA4 і Amplitude приймають дані у форматі, який шле сайт.

Це перевіряє сценарій для production нижче.

## Production marketingzavod.com

Результати перевірки після підключення нових акаунтів — у розділах нижче, у порядку дат.

## Сценарій для production з ідентифікаторами

Для кожного сценарію: приватне вікно, GTM Preview увімкнено, шлях `/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST` → Pricing → About → Contact → заявка з адресою виду `qa+дата@marketingzavod.com`.

### А. Згода прийнята («Accept all»)

| Де дивитися | Очікуване |
| --- | --- |
| DevTools → Cookies | `mz_consent` зі значенням `1.s1m1.…`, `mz_attr`, `_ga`, `_ga_*`, `_gcl_au`, `_gcl_aw`, `_fbp`, `AMP_*`. Звір з префіксами в `CATEGORY_STORAGE_PREFIXES` (`lib/consent/core.ts`): кожен cookie сервісу має підпадати під свою категорію |
| Network | `google-analytics.com/g/collect` з `gcs=G111`; `facebook.com/tr` з `ev=Lead` і `eid`; `api2.amplitude.com/2/httpapi`; `api-sr.amplitude.com` (записи сесій); `/api/lead` → 200 |
| GTM Preview | `consent_update` після вибору; Consent Mode `default` = `granted` до першого `page_view`; чотири `page_view`; `generate_lead`; спрацювали теги GA4, Google Ads Contact lead, Meta Lead |
| GA4 DebugView або Realtime | Чотири `page_view`, один `generate_lead` з `form_name=contact` і `lead_id` |
| Amplitude → User Look-Up / Live Events | Чотири `[Amplitude] Page Viewed`, один `generate_lead`, один `lead_saved` (з сервера, той самий пристрій); у користувача властивість `last_lead_id` |
| Amplitude → Session Replay | Запис сесії, поля форми замасковані |
| Google Ads Tag Assistant | Одна конверсія Contact lead, `transaction_id` = `event_id`, є хешований email |
| Meta Test Events | `Lead` з Browser і з Server, позначка Deduplicated |
| HubSpot | Один контакт, одна угода; `mz_ft_utm_source=qa`, `mz_gclid=TEST`, `mz_consent_marketing=true` |

Підсумок: одна заявка = один контакт у CRM з атрибуцією, один `generate_lead` у GA4 і Amplitude, одна конверсія Google Ads, одна дедуплікована подія Meta.

### Б. Лише необхідне («Necessary only»)

| Де дивитися | Очікуване |
| --- | --- |
| Cookies | Лише `mz_consent` зі значенням `1.s0m0.…` |
| Network | немає запитів до `googletagmanager.com`, `google-analytics.com`, `connect.facebook.net`, `facebook.com/tr`, `snap.licdn.com`, `amplitude.com` і `/_vercel/speed-insights`; один `POST /api/consent` |
| GTM Preview | GTM не вантажиться зовсім, тож Preview не підключиться. Це очікувано |
| Meta Test Events | Жодної події, ні з браузера, ні з сервера |
| HubSpot | Контакт і угода є; `mz_lt_utm_source=qa`; `mz_gclid` порожній; `mz_consent_marketing=false` |

### В. Без вибору (банер не чіпати)

Те саме, що в сценарії Б, але й `mz_consent` немає, і `/api/consent` не викликається. Додатково: банер видно на кожній сторінці, включно з checkout і 404, він не зсуває верстку, а з клавіатури до нього можна дістатися першим Tab.

### Г. Відкликання

Після сценарію А: футер → «Cookie settings» → «Necessary only». Сторінка перезавантажується, лишається тільки `mz_consent` (`1.s0m0.…`); cookies `_ga`, `_gcl_*`, `_fbp`, `AMP_*` і `mz_attr` зникли, у localStorage немає `AMP_*`, `amplitude.*`, `lastExternalReferrer*`, в IndexedDB немає `…_amp_session_replay_events`. Cookies на доменах linkedin.com і facebook.com сайт не видаляє, так і має бути.

### Ґ. Журнал згод

Amplitude → User Look-Up → Device ID = ID згоди з cookie `mz_consent`. На кожен вибір із попередніх сценаріїв — рівно одна подія `consent_recorded` з `statistics`, `marketing`, `source`, `version`.

### Звірка GA4 і Amplitude

Зроби 20 дій зі згодою: 5 переглядів, 5 кліків CTA, 4 розкриття FAQ, 3 перемикання періоду на Pricing, 2 зовнішні кліки, 1 заявку. Порівняй кількість подій за назвами в GA4 Realtime і Amplitude. Очікувано цифри збігаються один до одного, бо обидві системи отримують ту саму подію з одного виклику `track()`. Відомі джерела розбіжностей: `page_view` в Amplitude називається `[Amplitude] Page Viewed`; Amplitude додатково має `[Amplitude] Start Session`, `[Amplitude] End Session`, `[Amplitude] File Downloaded` і `lead_saved`; GA4 додає власні `session_start`, `first_visit`, `user_engagement`, `scroll`.

## Безпека

| Перевірка | Як | Очікуване |
| --- | --- | --- |
| Секретів немає в клієнтському бандлі | `grep -rlE "META_CAPI_ACCESS_TOKEN\|HUBSPOT_ACCESS_TOKEN\|HUBSPOT_CLIENT_SECRET\|OFFLINE_CONVERSIONS_SECRET\|CRON_SECRET" .next/static` | нічого не знайдено |
| Секретів немає в репозиторії | `.env*` в `.gitignore`, `.env.example` без значень | так |
| Клієнтський код не читає серверних секретів | жоден файл з `"use client"` не імпортує `lib/leads/hubspot`, `lib/meta/capi`, `lib/offline`, `lib/amplitude-server` | так |
| Персональних даних немає в `dataLayer` і URL | e2e-тест форми Contact і Waitlist | пройдено |
| Персональних даних немає в логах помилок | Помилки Meta і Amplitude логують лише ідентифікатори, статус і тіло відповіді | так, за кодом |
| Повна заявка в логах | Лише коли CRM не підключено або не відповіла. Це свідоме запасне сховище | так |
