# Наскрізна перевірка трекінгу

Документ має дві частини: що вже перевірено і з яким результатом, та сценарій, який треба повторювати на production після змін. Найсвіжіший результат — розділ «Production з реальними сервісами».

## Стан на 16 листопада 2026

Жодного ідентифікатора сервісу у Vercel ще немає (задача MAR-21 відкрита), а до проєкту Vercel `wowboy/wowboy` в агента немає доступу. Тому:

- **перевірено автоматично** на production-збірці з увімкненим debug-режимом і підставними ідентифікаторами: логіка сайту, згода, cookies, атрибуція, обробник заявок;
- **перевірено на production** після деплою: поведінку сайту без ідентифікаторів (розділ «Production без ідентифікаторів»);
- **не перевірено**: усе, що відбувається всередині сторонніх сервісів — GTM Preview, GA4 DebugView, PostHog, Clarity, Google Ads Tag Assistant, Meta Test Events, HubSpot. Для цього потрібні акаунти.

## Автоматичні сценарії (`npm run test:e2e`)

Збірка: `next build` з `NEXT_PUBLIC_TRACKING_DEBUG=true`, `GTM-E2ETEST` і підставний ключ PostHog. Запити до GTM і PostHog перехоплюються. Банер згоди в цій збірці видно. Сценарії першого візиту, «Accept all», «Necessary only», «Settings», відкликання через футер і клавіатури — у `tests/e2e/banner.spec.ts`; решта тестів стартує зі збереженого «Necessary only», що для трекінгу те саме, що «без вибору». Шлях у кожному сценарії: захід на `/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST` → Pricing → Contact → заявка.

| Сценарій | Перевірка | Результат |
| --- | --- | --- |
| Без вибору | Жодної cookie з префіксами `ph_`, `_ga`, `_gcl`, `_fb`, `_clck`, `_clsk`, `li_`, немає `wb_attr` | пройдено |
| | У запиті до `/api/lead` лише `utm_source`, `utm_medium`, `utm_campaign`; distinct ID немає | пройдено |
| | Три сторінки дали рівно три `page_view` | пройдено |
| GTM без вибору | У `dataLayer` лише ідентифікатори і події, жодного `gtm.js` і жодного запиту до Google, PostHog чи Speed Insights | пройдено |
| GTM зі збереженим вибором | У `dataLayer`: ідентифікатори → Consent Mode `default` за вибором → `consent_statistics`/`consent_marketing` → `gtm.js` → `page_view`. Контейнер запитано один раз | пройдено |
| Футер | «Cookie settings» відкриває панель із поточним вибором | пройдено |
| Події | `page_view` один на маршрут, `cta_click`, `faq_open` (лише розкриття), `outbound_click`, `contact_click`, `view_pricing`, `begin_checkout`, `form_start`, `form_error`, `generate_lead`, `join_waitlist` | пройдено |
| Персональні дані | У `dataLayer` і в URL після заявки немає email, імені, тексту повідомлення і ключа `user_data` | пройдено |
| API заявок | Валідація (400 з назвами полів), поле-пастка, чужий origin (403), ліміт 5 на хвилину (429) | пройдено |
| SEO | `sitemap.xml` (29 URL), `robots.txt` і `X-Robots-Tag: noindex` поза production, 404 для неіснуючої сторінки, canonical, JSON-LD | пройдено |

Юніт-тести (`npm test`, 59 перевірок) покривають розбір URL, first і last touch, нормалізацію, валідацію заявок, мапінг у HubSpot, хешування і тіло запиту Conversions API, підпис webhook, формат файла Google Ads і відповідність контейнера GTM плану подій.

### Що автотести не доводять

- Що `gtm/container.json` імпортується в GTM без помилок.
- Що теги в контейнері спрацьовують у правильному порядку в справжньому GTM.
- Що до згоди немає жодного запиту до Google: це перевіряє e2e (`tests/e2e/consent.spec.ts`), але на production варто подивитися в Network ще раз.
- Що HubSpot, Meta і Google Ads приймають дані у форматі, який шле сайт.

## Production без ідентифікаторів

Перевірено 16 листопада 2026 на `https://www.heywowboy.com` після деплою коміту `0372159`, скриптом Playwright у чистому профілі. У Vercel на цей момент не задано жодного ідентифікатора, тому банера немає і три сценарії згоди збігаються в один: вибрати нічого не можна.

Шлях: `/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST` → Pricing → About → Contact → заявка з адресою `qa+mar39-20261116@example.com`.

| Перевірка | Результат |
| --- | --- |
| Запити до сторонніх доменів | Жодного. Усі 86 запитів пішли на `www.heywowboy.com` |
| Cookies | Жодної |
| localStorage | Порожній |
| `dataLayer` | `page_view` ×4 (по одному на сторінку), `view_pricing`, `cta_click`, `form_start`, `generate_lead` |
| `POST /api/lead` | 200, повернув `lead_id` і `event_id` |
| Що пішло з формою | Лише `utm_source`, `utm_medium`, `utm_campaign`. `gclid=TEST` не передано. Згода `false` |
| Помилки в консолі, зокрема гідратації | Немає |
| Кнопка «Cookie settings» у футері | Не показується, бо банера згоди немає. Так і задумано |
| `sitemap.xml` | 200, 29 URL |
| `robots.txt` | Дозволяє сайт, закриває `/api/`, `/ingest/`, `/dev/`, `/checkout`, вказує sitemap |
| Canonical, JSON-LD | `https://www.heywowboy.com`, `Organization` і `WebSite` на головній |
| Неіснуюча сторінка | 404 |
| Адреса зі слешем у кінці | Один 308 на адресу без слеша |
| `wowboy.vercel.app` | Віддає `X-Robots-Tag: noindex, nofollow` |
| Проксі PostHog `/ingest/static/array.js` | 200 |
| Endpoint офлайн-конверсій без налаштувань | 503 |
| Скрипт Speed Insights `/_vercel/speed-insights/script.js` | 200, скрипт віддається. Чи з'являються дані в панелі Vercel, агент не бачив |

Що лишилося неперевіреним у цьому прогоні:

- **Чи збереглася тестова заявка.** Сервер відповів 200, а без токена HubSpot заявка має потрапити в лог Vercel. Логи проєкту `wowboy/wowboy` агенту недоступні. Перевір сам: Vercel → Project → Logs, пошук `d4b70edb-46de-4cff-81a0-6dd9d284ff2d`.
- **Preview-деплой.** Він закритий авторизацією Vercel (302), тому відсутність запитів до `googletagmanager.com` на preview агент не бачив. Це гарантує код: `TRACKING_ENABLED` дорівнює `false`, коли `VERCEL_ENV` не `production`.
- **Rich Results Test** для JSON-LD не запускався.

## Production з реальними сервісами, 17 листопада 2026

Після запуску банера згоди (MAR-49), ще до видалення Clarity (MAR-54). У Vercel задано GTM, GA4, Clarity, Meta (піксель, токен Conversions API, тестовий код), PostHog і Amplitude. Google Ads, LinkedIn і HubSpot ще не підключено. Перевірка — скриптом Playwright у чистому профілі, шлях `/?utm_source=qa…` → Pricing → About → Contact.

**Згода по трьох сценаріях:**

| Сценарій | Сторонні запити | Cookies | localStorage |
| --- | --- | --- | --- |
| Без вибору | жодного; немає й `/ingest` та Speed Insights | жодної | порожній |
| «Necessary only» | жодного; один запис у журнал згод `/api/consent` | лише `wb_consent` | порожній |
| «Accept all» | GTM, GA4 (`region1.google-analytics.com`), Meta (`connect.facebook.net`, `facebook.com/tr`), Clarity (`clarity.ms`, `c.bing.com`), Amplitude, PostHog через `/ingest`, Speed Insights | `wb_consent`, `wb_attr`, `_ga`, `_ga_FC7QKZ0DYD`, `_fbp`, `_clck`, `_clsk`, `ph_…_posthog`, `AMP_…`, `AMP_MKTG_…` (плюс cookies Clarity і Bing на їхніх доменах) | `ph_…`, `AMP_…`, `amplitude.engagement.…`, `lastExternalReferrer`, `lastExternalReferrerTime` |

Ключі `amplitude.engagement.…` (Amplitude) і `lastExternalReferrer…` (піксель Meta) знайдено лише на production. Їх додано до очищення при відкликанні (`CATEGORY_STORAGE_PREFIXES`) і до e2e-тесту відкликання.

Consent Mode: усі запити GA4 після «Accept all» мають `gcs=G111`. Помилок у консолі немає.

**Звірка GA4 і PostHog**, 17 дій сайту в одній сесії зі згодою (4 розкриття FAQ, 2 зовнішні кліки, 2 кліки CTA, 3 перемикання періоду на Pricing, 5 переходів):

| Подія сайту | `dataLayer` | GA4 | PostHog | Meta |
| --- | --- | --- | --- | --- |
| `page_view` | 5 | 6 | 5 (`$pageview`) | 5 (`PageView`) |
| `faq_open` | 4 | 4 | 4 | — |
| `outbound_click` | 2 | 2 | 2 | — |
| `cta_click` | 2 | 2 | 2 | — |
| `view_pricing` | 4 | 4 | 4 | 4 (`ViewContent`) |

Власні події збігаються один до одного в усіх системах. Розбіжності і їх причини:

- **GA4 `page_view` +1 на сесію.** На сторінці входу Google tag сам надсилає ще один перегляд, хоча в контейнері стоїть `send_page_view: false`. Наші переходи не дублюються. Виправляється переходом на Zaraz (проект «Перехід на Cloudflare Zaraz», критерій Z4), до того сесій у GA4 правильно, а переглядів трохи більше.
- **GA4 `click` ×2 і `scroll` ×1** — розширені вимірювання GA4 (Enhanced measurement). `click` дублює наш `outbound_click`. Вимкнути «Outbound clicks» у GA4 → Admin → Data streams → Enhanced measurement.
- **Meta `SubscribedButtonClick` ×7** — автоматичні події пікселя. Вимкнути в Events Manager → Settings → Automatic events.
- **PostHog `$autocapture` ×13, `$web_vitals`, `$pageleave`** — автоматичні події PostHog, так задумано.

**PostHog і автоматизовані браузери.** PostHog відкидає події з headless-браузера як ботів, а піксель Meta в браузері з прапорцем автоматизації не надсилає подій. Для перевірки цих двох сервісів скрипт треба запускати у звичайному вікні (`headless: false`, `--disable-blink-features=AutomationControlled`). Події доходять у PostHog із затримкою до 10 хвилин.

**Ще не перевірено на production:** заявка з форми до CRM (HubSpot ще не підключено, заявки поки лише в логах Vercel) і дедуплікація події Meta `Lead` з браузера та сервера. Ці перевірки — частина підключення HubSpot.

## Production через Cloudflare Zaraz, 17 листопада 2026

`NEXT_PUBLIC_TAG_MANAGER=zaraz` на production, коміт `20ffd17`. Перевірено в Chromium зі звичайним профілем. Локальний DNS-кеш роутера ще віддавав для `z.heywowboy.com` старі адреси Vercel, тому хост примусово вказано на IP Cloudflare (`--host-resolver-rules`). Публічні резолвери 1.1.1.1 і 8.8.8.8 на той момент уже віддавали Cloudflare.

| Перевірка | Результат |
| --- | --- |
| До згоди | жодного стороннього запиту, GTM-бутстрапа в HTML немає, `dataLayer` порожній (Z2) |
| «Accept all» | `i.js` і `s.js` з `z.heywowboy.com`; `zaraz.consent.getAll()` = `{ MwUo: true }` (Statistics); cookie `wb_zaraz_consent`, `cf_zaraz_client` |
| Події | `page_view`, `view_pricing` → `z.heywowboy.com/cdn-cgi/zaraz/t` 200, з параметрами і `google_consent_default` (Z3). У моніторингу Zaraz дія GA4 «Site events» має активність |
| Meta | `/api/meta/event` 204 на `page_view` і `view_pricing`, `_fbp` ставить сервер. Прямих запитів до `facebook.com` немає |
| Прямі запити | жодного до `google-analytics.com`, `googletagmanager.com`, `connect.facebook.net`, `facebook.com/tr` |
| Відкликання | після «Necessary only» лишається лише `wb_consent`; Zaraz і `/api/meta/event` більше не викликаються |
| Privacy Policy | `/legal/privacy-policy`, версія 1.8, згадує Cloudflare Zaraz (Z8) |

Знайдено й виправлено (PR #27): `zaraz.consent.set()` відкидав увесь виклик через мету Marketing, яка ще не прив'язана до жодного інструмента. Через це Statistics лишалася вимкненою, і GA4 не отримав би жодної події. Тепер кожну мету передано окремо.

Не перевірено агентом: параметр `gcd` у запитах Google (Z5) — вони йдуть із серверів Cloudflare, браузер їх не бачить. Порівняння GA4 за тиждень (Z9) — MAR-58, 24.11.2026.

## Тестова заявка через HubSpot, 17–18 листопада 2026

Production (Zaraz). Contact з `?utm_source=qa&utm_medium=cpc&utm_campaign=mar21_test&fbclid=QA_MAR21_TEST`, «Accept all», адреса `qa+mar21@heywowboy.com`.

| Що | Результат |
| --- | --- |
| `/api/lead` | 200, `lead_id` і `event_id` повернуто, на сторінці показано успіх |
| Контакт HubSpot | створено з атрибуцією: first/last touch UTM, `wb_fbclid`, `wb_fbc` з fbclid, `wb_fbp` (поставив `/api/meta/event`), згода statistics і marketing = true, `wb_lead_id`, `wb_event_id` |
| Угода HubSpot | «Contact form: …» у Sales Pipeline, стадія `appointmentscheduled`, прив'язана до контакту, `wb_lead_id` |
| Офлайн-конверсія | угоду переведено в `qualifiedtobuy`; `GET /api/cron/offline-conversions` → `sent: 1`, Meta відповіла 200, `wb_offline_sent = qualified_lead`; повторний виклик нічого не надіслав |
| Meta | події заявки й синхронізації пішли з тестовим кодом; помилок `meta_capi_error` у логах немає. Після цього `META_TEST_EVENT_CODE` видалено |

Тестові контакт і угода лишилися в HubSpot (`qa+mar21@heywowboy.com`); їх можна видалити.

## Сценарій для production з ідентифікаторами

Виконати, коли закрито MAR-21 і опубліковано контейнер GTM. Для кожного з трьох сценаріїв: приватне вікно, GTM Preview увімкнено, шлях `/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST` → Pricing → About → Contact → заявка з адресою виду `qa+дата@твій-домен`.

### А. Згода прийнята («Accept all»)

| Де дивитися | Очікуване |
| --- | --- |
| DevTools → Cookies | `wb_consent` зі значенням `1.s1m1.…`, `wb_attr`, `ph_*`, `_ga`, `_ga_*`, `_gcl_au`, `_gcl_aw`, `_fbp`. Звір з префіксами в `CATEGORY_STORAGE_PREFIXES` (`lib/consent/core.ts`): кожен cookie сервісу має підпадати під свою категорію |
| Network | `google-analytics.com/g/collect` з `gcs=G111`; `facebook.com/tr` з `ev=Lead` і `eid`; `/ingest/…`; `/api/lead` → 200; жодного запиту до `clarity.ms` (Clarity прибрано) |
| GTM Preview | `consent_update` після вибору; Consent Mode `default` = `granted` до першого `page_view`; чотири `page_view`; `generate_lead`; спрацювали теги GA4, Google Ads Contact lead, Meta Lead |
| GA4 DebugView | Чотири `page_view`, один `generate_lead` з `form_name=contact` і `lead_id` |
| PostHog Live events | Чотири `$pageview`, один `generate_lead`, один `lead_saved`; особа ідентифікована за `lead_id` |
| PostHog Replay | Запис сесії, поля форми замасковані |
| Google Ads Tag Assistant | Одна конверсія Contact lead, `transaction_id` = `event_id`, є хешований email |
| Meta Test Events | `Lead` з Browser і з Server, позначка Deduplicated |
| HubSpot | Один контакт, одна угода; `wb_ft_utm_source=qa`, `wb_gclid=TEST`, `wb_consent_marketing=true` |

Підсумок: одна заявка = один контакт у CRM з атрибуцією, один `generate_lead` у GA4 і PostHog, одна конверсія Google Ads, одна дедуплікована подія Meta.

### Б. Лише необхідне («Necessary only»)

| Де дивитися | Очікуване |
| --- | --- |
| Cookies | Лише `wb_consent` зі значенням `1.s0m0.…` |
| Network | немає запитів до `googletagmanager.com`, `google-analytics.com`, `clarity.ms`, `connect.facebook.net`, `facebook.com/tr`, `snap.licdn.com`, amplitude.com, `/ingest/…` і `/_vercel/speed-insights` |
| GTM Preview | GTM не вантажиться зовсім, тож Preview не підключиться. Це очікувано |
| Meta Test Events | Жодної події, ні з браузера, ні з сервера |
| HubSpot | Контакт і угода є; `wb_lt_utm_source=qa`; `wb_gclid` порожній; `wb_consent_marketing=false` |

### В. Без вибору (банер не чіпати)

Те саме, що в сценарії Б, але й `wb_consent` немає. Додатково: банер видно на кожній сторінці, включно з checkout і 404, він не зсуває верстку, а з клавіатури до нього можна дістатися першим Tab.

### Г. Відкликання

Після сценарію А: футер → «Cookie settings» → «Necessary only». Сторінка перезавантажується, лишається тільки `wb_consent` (`1.s0m0.…`), cookies `_ga`, `_gcl_*`, `_fbp`, `_clck`, `ph_*`, `AMP_*` і `wb_attr` зникли. Cookies на доменах clarity.ms, linkedin.com і facebook.com сайт не видаляє, так і має бути.

### Ґ. Журнал згод

PostHog → SQL: `SELECT timestamp, distinct_id, properties.statistics, properties.marketing, properties.source FROM events WHERE event = 'consent_recorded' ORDER BY timestamp DESC LIMIT 20`. На кожен вибір із попередніх сценаріїв — рівно один запис, `distinct_id` дорівнює ID з `wb_consent`, особи (person) немає.

### Звірка GA4 і PostHog

Зроби 20 дій зі згодою: 5 переглядів, 5 кліків CTA, 4 розкриття FAQ, 3 перемикання періоду на Pricing, 2 зовнішні кліки, 1 заявку. Порівняй кількість подій за назвами в GA4 DebugView і PostHog Live events. Очікувано цифри збігаються один до одного, бо обидві системи отримують ту саму подію з одного виклику `track()`. Відомі джерела розбіжностей: `page_view` у PostHog називається `$pageview`; PostHog додатково має `$pageleave`, `$autocapture` і `lead_saved`; GA4 додає власні `session_start`, `first_visit`, `user_engagement`, `scroll`.

### Скриншоти, якщо агент не має доступу

GTM Preview (вкладки Tags і Consent на події Consent Initialization та `generate_lead`), GA4 DebugView, PostHog Live events, Tag Assistant з конверсією Google Ads, Meta Test events, картка контакту HubSpot з групою властивостей «Lead attribution (website)».

## Безпека

| Перевірка | Як | Результат |
| --- | --- | --- |
| Секретів немає в клієнтському бандлі | `grep -rlE "META_CAPI_ACCESS_TOKEN\|HUBSPOT_ACCESS_TOKEN\|HUBSPOT_CLIENT_SECRET\|OFFLINE_CONVERSIONS_SECRET" .next/static` | нічого не знайдено |
| Секретів немає в репозиторії | `.env*` в `.gitignore`, `.env.example` без значень; пошук токенів (`pat-…`, `EAA…`, `sk_…`, `ghp_…`, `AKIA…`, приватні ключі) по всій історії git 17.11.2026 | нічого не знайдено |
| Клієнтський код не читає серверних секретів | жоден файл з `"use client"` не імпортує `lib/leads/hubspot`, `lib/meta/capi`, `lib/offline`, `lib/posthog-server` | так |
| Персональних даних немає в `dataLayer` і URL | e2e-тест форми Contact і Waitlist | пройдено |
| Персональних даних немає в логах помилок | Помилки Meta і PostHog логують лише `event_id` і тіло відповіді | так, за кодом |
| Повна заявка в логах | Лише коли CRM не підключено або не відповіла. Це свідоме запасне сховище | так |
