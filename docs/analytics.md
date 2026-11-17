# Аналітика, трекінг і реклама на heywowboy.com

Оглядовий документ. Назви подій і змінних — у [tracking-plan.md](tracking-plan.md).

## Потік даних

```
                         ┌──────────────── браузер ─────────────────┐
 відвідувач ──► сторінка │ track(event, params)   lib/tracking       │
                         │   ├─► dataLayer ──► GTM (Consent Mode v2, типово denied)
                         │   │                    ├─► GA4
                         │   │                    ├─► Microsoft Clarity
                         │   │                    ├─► Google Ads (конверсії, ремаркетинг)
                         │   │                    ├─► Meta Pixel
                         │   │                    └─► LinkedIn Insight Tag
                         │   └─► PostHog ──► /ingest (власний домен) ──► eu.i.posthog.com
                         │ Amplitude        лише за згоди на статистику
                         │ lib/consent      стан згоди, типово відмова
                         │ lib/attribution  UTM і click ID → cookie wb_attr (за згоди)
                         └────────────────────────┬─────────────────┘
                                 форма: поля + атрибуція + згода
                                                  ▼
                         ┌──────────── сервер (route handlers) ─────┐
                         │ POST /api/lead                            │
                         │   валідація → lead_id, event_id           │
                         │   ├─► LeadStore: HubSpot або лог          │
                         │   ├─► Meta Conversions API (згода на маркетинг)
                         │   └─► PostHog lead_saved (згода на статистику)
                         │ POST /api/crm/hubspot        webhook стадії угоди → Meta (офлайн)
                         │ GET  /api/offline-conversions/google-ads  файл для Google Ads
                         └───────────────────────────────────────────┘
 Vercel Speed Insights: окремо, лише за згоди на статистику.
 До згоди не вантажиться нічого: ні GTM, ні PostHog, ні Amplitude, ні Speed Insights.
```

## Роль кожного сервісу

| Сервіс | Для чого | Як підключений | Згода |
| --- | --- | --- | --- |
| Власний засіб згоди | Банер згоди, сигнали Consent Mode v2 | Ще не написаний. Точка входу: `lib/consent` | — |
| Google Tag Manager | Єдина точка входу для тегів Google, Meta, Clarity, LinkedIn | `components/tracking/gtm.tsx`, `lib/tracking/gtm.ts` | вантажиться лише після згоди на статистику або маркетинг |
| GA4 | Аудиторії і конверсії для Google Ads, основа звітності | GTM | `analytics_storage` (Basic Consent Mode: без згоди запитів немає) |
| PostHog | Продуктова аналітика, воронки, записи, експерименти | Код, через `/ingest` | згода на статистику; без неї бібліотека не вантажиться |
| Microsoft Clarity | Записи сесій і теплові карти | GTM | `analytics_storage` |
| Amplitude | Продуктова аналітика, автозбір подій, записи сесій | Код: `lib/tracking/amplitude.ts`, викликається з `TrackingProvider` | згода на статистику; без неї SDK навіть не завантажується |
| Google Ads | Конверсії, Enhanced Conversions, ремаркетинг | GTM | `ad_storage`, `ad_user_data` |
| Meta | Піксель і Conversions API з дедуплікацією | GTM і сервер | `ad_storage` / згода на маркетинг |
| LinkedIn | Insight Tag і конверсії | GTM | `ad_storage` |
| HubSpot | Зберігання заявок з атрибуцією, угоди | Сервер | не залежить від згоди, але click ID лише за згоди |
| Vercel Speed Insights | Швидкість у реальних користувачів | Код: `components/tracking/speed-insights.tsx` | згода на статистику |
| Search Console | Органічний пошук | `sitemap.xml`, `robots.txt`, метадані | — |

## Де що лежить

| Що | Де |
| --- | --- |
| Список подій (типи) | `lib/tracking/events.ts` |
| `track()` | `lib/tracking/index.ts` |
| Умови ввімкнення, ідентифікатори | `lib/tracking/env.ts` |
| PostHog у браузері / на сервері | `lib/tracking/posthog.ts` / `lib/posthog-server.ts` |
| Amplitude | `lib/tracking/amplitude.ts` |
| Згода | `lib/consent/index.ts` (стан), `lib/consent/core.ts` (cookie `wb_consent`), `components/consent/` (банер і панель) |
| Журнал згод | `app/api/consent/route.ts`, `lib/consent/record.ts`, `lib/consent/log.ts` |
| Атрибуція | `lib/attribution/core.ts` (логіка), `lib/attribution/index.ts` (cookie) |
| Перегляди, делеговані слухачі | `components/tracking/tracking-provider.tsx` |
| Події показу сторінки | `components/tracking/track-view.tsx` |
| Завантаження GTM | `components/tracking/gtm.tsx` |
| Кнопка «Cookie settings» | `components/tracking/cookie-settings.tsx` |
| Обробник заявок | `app/api/lead/route.ts`, `lib/leads/*` |
| Meta Conversions API | `lib/meta/capi.ts` |
| Офлайн-конверсії | `app/api/crm/hubspot/route.ts`, `app/api/offline-conversions/google-ads/route.ts`, `lib/offline/*` |
| Контейнер GTM | `gtm/` |
| SEO | `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts`, `components/json-ld.tsx` |
| Запити BigQuery | `analytics/sql/` |
| Тести | `tests/unit/`, `tests/e2e/` |
| CI | `.github/workflows/ci.yml`, `lighthouserc.json` |

## Де що налаштовується

| Задача | Документ |
| --- | --- |
| Змінні середовища | `.env.example`, `tracking-plan.md` |
| Імпорт і публікація контейнера | `gtm/README.md` |
| GA4 | `ga4-setup.md` |
| PostHog і воронки | `posthog-setup.md` |
| Clarity | `clarity-setup.md` |
| Google Ads | `google-ads-setup.md` |
| Meta | `meta-setup.md` |
| LinkedIn | `linkedin-setup.md` |
| Офлайн-конверсії | `offline-conversions.md` |
| Server-side GTM | `sgtm-plan.md` |
| BigQuery і Looker Studio | `reporting-setup.md` |
| Швидкість | `performance-budget.md` |
| Перевірка | `tracking-qa.md` |
| Перед запуском реклами | `launch-checklist.md` |

## Коли трекінг увімкнений

| Середовище | Трекінг |
| --- | --- |
| Production-деплой Vercel (`VERCEL_ENV=production`) | так, для сервісів, чиї змінні задано |
| Preview-деплой | ні |
| Локально | ні |
| Будь-де з `NEXT_PUBLIC_TRACKING_DEBUG=true` | так |

Події в `dataLayer` пишуться завжди: це лише масив у пам'яті сторінки. Назовні вони йдуть, тільки коли завантажено GTM або PostHog.

## Згода

Стороннього банера згоди на сайті немає. Власний засіб ще не написаний, тому зараз згоди не може дати ніхто і все, що від неї залежить, вимкнено:

- `lib/consent` повертає відмову, доки вибору немає. GTM, PostHog, Amplitude і Speed Insights не вантажаться, cookie атрибуції не створюється, click ID не йдуть на сервер.
- `components/tracking/gtm.tsx` до старту GTM задає Consent Mode v2: усе `denied`.
- Константа `CONSENT_TOOL_READY` у `lib/consent` дорівнює `false`. Сайт передає її в GTM як `consent_ready`, і тригер-виняток `Block - Consent tool missing` тримає всі теги контейнера. Кнопки «Cookie settings» у футері теж немає.

Що має зробити власний засіб згоди:

1. Після вибору відвідувача (і при відновленні збереженого вибору) викликати `setConsent()` з `lib/consent`. Атрибуція і PostHog підхоплять зміну самі.
2. Надіслати в GTM `gtag('consent', 'update', …)` і подію `consent_update` з булевими `consent_statistics` та `consent_marketing`. На неї підписані теги Clarity, Meta і LinkedIn.
3. Реалізувати `openConsentSettings()` і перемкнути `CONSENT_TOOL_READY` на `true`.

Відповідність категорій сигналам Consent Mode — у `tracking-plan.md`.

## Журнал згод

Кожен вибір у банері чи панелі браузер надсилає на `POST /api/consent` (`navigator.sendBeacon`). Сервер перевіряє origin, формат і частоту запитів і записує в PostHog подію `consent_recorded`:

- `distinct_id` — випадковий ID згоди з cookie `wb_consent`. Одна й та сама людина зберігає його між змінами вибору, тож видно всю історію;
- властивості: `version`, `statistics`, `marketing`, `source` (`banner` або `settings`), `decided_at`;
- профіль людини не створюється (`$process_person_profile: false`), GeoIP вимкнено, IP і user agent не записуються.

Журнал ведеться й при «Necessary only»: правова підстава — обов'язок довести згоду (GDPR, ст. 7(1)), а не сама згода. Події PostHog зберігаються рік на безкоштовному плані і 7 років на платному.

Знайти записи за ID згоди (PostHog → SQL):

```sql
SELECT timestamp, properties.statistics, properties.marketing, properties.source, properties.version
FROM events
WHERE event = 'consent_recorded' AND distinct_id = '<ID згоди з cookie wb_consent>'
ORDER BY timestamp
```

## Розмітка подій у верстці

Обробники в компоненти не додаються. Є один делегований слухач у `TrackingProvider` і атрибути:

```tsx
<Link
  href="/waitlist"
  data-track="cta_click"
  data-track-cta-text="Join waitlist"
  data-track-cta-location="hero"
>
```

- `data-track` — назва події. `data-track-*` — параметри (`data-track-cta-location` → `cta_location`).
- `data-track-if="collapsed"` або `"unpressed"` — подія лише при розкритті або ввімкненні (`aria-expanded`, `aria-pressed`).
- `data-track-form="contact"` на `<form>` дає `form_start` і `form_error` без жодного коду.
- Посилання `mailto:`, `tel:`, на месенджери і на інші домени розпізнаються автоматично.
- Подію «сторінку показано» дає `<TrackView event="…" params={…} />`.

## Як додати нову подію

1. Додай назву і параметри в `lib/tracking/events.ts` (тип `TrackEvents` і масив `TRACK_EVENT_NAMES`).
2. Додай той самий запис у `gtm/events.json`.
3. Опиши подію в `docs/tracking-plan.md`.
4. Розміть елемент атрибутами `data-track-*` або виклич `track()`.
5. `npm run gtm:build` — з'являться тригер, змінні і тег GA4. Теги інших сервісів додаються в `gtm/build-container.mjs`.
6. `npm test` — тест синхронізації перевірить, що код, план і контейнер збігаються.
7. Додай перевірку в `tests/e2e/tracking.spec.ts`.
8. Після мерджу: імпорт `gtm/container.json` у GTM і публікація. У GA4 зареєструй нові параметри як custom dimensions.

## Як перевірити після змін

```bash
npm run typecheck   # типи
npm run lint        # лінт
npm test            # юніт-тести: атрибуція, валідація, CRM, хешування, контейнер
npm run test:e2e    # e2e: події, згода, cookies, API
npm run build && npm run lighthouse   # швидкість
```

У браузері на production: GTM Preview, GA4 DebugView, PostHog Live events. Повний сценарій — у `tracking-qa.md`.

## Безпека і приватність

- Секрети (`META_CAPI_ACCESS_TOKEN`, `HUBSPOT_ACCESS_TOKEN`, `HUBSPOT_CLIENT_SECRET`, `OFFLINE_CONVERSIONS_SECRET`) живуть лише у Vercel і читаються лише на сервері.
- Персональних даних немає в `dataLayer`, URL і параметрах подій. Єдиний виняток: email для Enhanced Conversions, який потрапляє в `dataLayer` на час однієї події, лише за згоди на маркетинг, і одразу видаляється.
- У логах сервера повна заявка з'являється лише тоді, коли CRM не підключено або вона не відповіла. Це запасне сховище, щоб заявка не загубилась.
- Обробник заявок відхиляє запити з чужого origin, має поле-пастку і обмеження п'ять заявок на хвилину з однієї адреси. Обмеження тримається в пам'яті інстансу і не є жорсткою гарантією.
