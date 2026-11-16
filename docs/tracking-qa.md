# Наскрізна перевірка трекінгу

Документ має дві частини: що вже перевірено і з яким результатом, та сценарій, який треба повторити на production, коли з'являться ідентифікатори сервісів.

## Стан на 16 листопада 2026

Жодного ідентифікатора сервісу у Vercel ще немає (задача MAR-21 відкрита), а до проєкту Vercel `wowboy/wowboy` в агента немає доступу. Тому:

- **перевірено автоматично** на production-збірці з увімкненим debug-режимом і підставними ідентифікаторами: логіка сайту, згода, cookies, атрибуція, обробник заявок;
- **перевірено на production** після деплою: поведінку сайту без ідентифікаторів (розділ «Production без ідентифікаторів»);
- **не перевірено**: усе, що відбувається всередині сторонніх сервісів — GTM Preview, GA4 DebugView, PostHog, Clarity, Google Ads Tag Assistant, Meta Test Events, HubSpot. Для цього потрібні акаунти.

## Автоматичні сценарії (`npm run test:e2e`)

Збірка: `next build` з `NEXT_PUBLIC_TRACKING_DEBUG=true`, `GTM-E2ETEST`, підставний Cookiebot ID і ключ PostHog. Запити до GTM, PostHog і Cookiebot перехоплюються, Cookiebot замінено дублером із заданим станом згоди. Шлях у кожному сценарії: захід на `/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST` → Pricing → Contact → заявка.

| Сценарій | Перевірка | Результат |
| --- | --- | --- |
| Згода прийнята | Cookie `wb_attr` створена, містить `utm_source=qa` і `gclid=TEST` | пройдено |
| | PostHog зберігає стан (`ph_…_posthog`), запити йдуть лише на `/ingest`, не на `posthog.com` | пройдено |
| | У запиті до `/api/lead`: згода `true`, first і last touch з `gclid`, distinct ID PostHog | пройдено |
| | Повторний захід з `utm_source=newsletter` змінює last touch і не змінює first touch | пройдено |
| Згода відхилена | Cookie `wb_attr` немає, `ph_*` у localStorage немає | пройдено |
| | У запиті до `/api/lead`: згода `false`, лише UTM, рядка `TEST` немає | пройдено |
| Без вибору | Жодної cookie з префіксами `ph_`, `_ga`, `_gcl`, `_fb`, `_clck`, `_clsk`, `li_`, немає `wb_attr` | пройдено |
| | У запиті до `/api/lead` лише `utm_source`, `utm_medium`, `utm_campaign`; distinct ID немає | пройдено |
| | Три сторінки дали рівно три `page_view` | пройдено |
| Лише статистика | `wb_attr` є, click ID у ній немає | пройдено |
| Зміна згоди без перезавантаження | Після згоди cookie з'являється, після відкликання зникає разом із `ph_*`; `page_view` не дублюється | пройдено |
| Порядок старту GTM | У `dataLayer`: ідентифікатори → `gtm.js` → `page_view`. Контейнер запитано один раз | пройдено |
| Події | `page_view` один на маршрут, `cta_click`, `faq_open` (лише розкриття), `outbound_click`, `contact_click`, `view_pricing`, `begin_checkout`, `form_start`, `form_error`, `generate_lead`, `join_waitlist` | пройдено |
| Персональні дані | У `dataLayer` і в URL після заявки немає email, імені, тексту повідомлення і ключа `user_data` | пройдено |
| API заявок | Валідація (400 з назвами полів), поле-пастка, чужий origin (403), ліміт 5 на хвилину (429) | пройдено |
| SEO | `sitemap.xml` (29 URL), `robots.txt` і `X-Robots-Tag: noindex` поза production, 404 для неіснуючої сторінки, canonical, JSON-LD | пройдено |

Юніт-тести (`npm test`, 59 перевірок) покривають розбір URL, first і last touch, нормалізацію, валідацію заявок, мапінг у HubSpot, хешування і тіло запиту Conversions API, підпис webhook, формат файла Google Ads і відповідність контейнера GTM плану подій.

### Що автотести не доводять

- Що `gtm/container.json` імпортується в GTM без помилок.
- Що теги в контейнері спрацьовують у правильному порядку в справжньому GTM.
- Що запити Google мають `gcs=G100` до згоди: це поведінка тегів Google і шаблона Cookiebot, а не коду сайту.
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
| Кнопка «Cookie settings» у футері | Не показується, бо Cookiebot не налаштовано. Так і задумано |
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

## Сценарій для production з ідентифікаторами

Виконати, коли закрито MAR-21 і опубліковано контейнер GTM. Для кожного з трьох сценаріїв: приватне вікно, GTM Preview увімкнено, шлях `/?utm_source=qa&utm_medium=cpc&utm_campaign=qa_test&gclid=TEST` → Pricing → About → Contact → заявка з адресою виду `qa+дата@твій-домен`.

### А. Згода прийнята («Allow all»)

| Де дивитися | Очікуване |
| --- | --- |
| DevTools → Cookies | `CookieConsent`, `wb_attr`, `ph_*`, `_ga`, `_ga_*`, `_gcl_au`, `_gcl_aw`, `_fbp`, `_clck`, `_clsk` |
| Network | `google-analytics.com/g/collect` з `gcs=G111`; `clarity.ms`; `facebook.com/tr` з `ev=Lead` і `eid`; `/ingest/…`; `/api/lead` → 200 |
| GTM Preview | Cookiebot на Consent Initialization; чотири `page_view`; `generate_lead`; спрацювали теги GA4, Google Ads Contact lead, Meta Lead |
| GA4 DebugView | Чотири `page_view`, один `generate_lead` з `form_name=contact` і `lead_id` |
| PostHog Live events | Чотири `$pageview`, один `generate_lead`, один `lead_saved`; особа ідентифікована за `lead_id` |
| Clarity | Запис сесії, поля форми замасковані, теги `utm_source=qa`, `form_name=contact` |
| Google Ads Tag Assistant | Одна конверсія Contact lead, `transaction_id` = `event_id`, є хешований email |
| Meta Test Events | `Lead` з Browser і з Server, позначка Deduplicated |
| HubSpot | Один контакт, одна угода; `wb_ft_utm_source=qa`, `wb_gclid=TEST`, `wb_consent_marketing=true` |

Підсумок: одна заявка = один контакт у CRM з атрибуцією, один `generate_lead` у GA4 і PostHog, одна конверсія Google Ads, одна дедуплікована подія Meta.

### Б. Згода відхилена («Deny»)

| Де дивитися | Очікуване |
| --- | --- |
| Cookies | Лише `CookieConsent` |
| Network | `g/collect` з `gcs=G100` і без cookies; немає запитів до `clarity.ms`, `connect.facebook.net`, `facebook.com/tr`, `snap.licdn.com`; `/ingest/…` є, без cookie |
| GTM Preview | Теги Clarity, Meta, LinkedIn у стані «Blocked by consent» |
| Meta Test Events | Жодної події, ні з браузера, ні з сервера |
| HubSpot | Контакт і угода є; `wb_lt_utm_source=qa`; `wb_gclid` порожній; `wb_consent_marketing=false` |

### В. Без вибору (банер не чіпати)

Те саме, що в сценарії Б. Додатково: банер видно на кожній сторінці, він не зсуває верстку.

### Звірка GA4 і PostHog

Зроби 20 дій зі згодою: 5 переглядів, 5 кліків CTA, 4 розкриття FAQ, 3 перемикання періоду на Pricing, 2 зовнішні кліки, 1 заявку. Порівняй кількість подій за назвами в GA4 DebugView і PostHog Live events. Очікувано цифри збігаються один до одного, бо обидві системи отримують ту саму подію з одного виклику `track()`. Відомі джерела розбіжностей: `page_view` у PostHog називається `$pageview`; PostHog додатково має `$pageleave`, `$autocapture` і `lead_saved`; GA4 додає власні `session_start`, `first_visit`, `user_engagement`, `scroll`.

### Скриншоти, якщо агент не має доступу

GTM Preview (вкладки Tags і Consent на події Consent Initialization та `generate_lead`), GA4 DebugView, PostHog Live events, Clarity (кадр запису з формою), Tag Assistant з конверсією Google Ads, Meta Test events, картка контакту HubSpot з групою властивостей «Lead attribution (website)».

## Безпека

| Перевірка | Як | Результат |
| --- | --- | --- |
| Секретів немає в клієнтському бандлі | `grep -rlE "META_CAPI_ACCESS_TOKEN\|HUBSPOT_ACCESS_TOKEN\|HUBSPOT_CLIENT_SECRET\|OFFLINE_CONVERSIONS_SECRET" .next/static` | нічого не знайдено |
| Секретів немає в репозиторії | `.env*` в `.gitignore`, `.env.example` без значень | так |
| Персональних даних немає в `dataLayer` і URL | e2e-тест форми Contact і Waitlist | пройдено |
| Персональних даних немає в логах помилок | Помилки Meta і PostHog логують лише `event_id` і тіло відповіді | так, за кодом |
| Повна заявка в логах | Лише коли CRM не підключено або не відповіла. Це свідоме запасне сховище | так |
