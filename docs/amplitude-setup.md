# Amplitude: налаштування і воронки

Роль у стеку: продуктова аналітика, воронки і записи сесій. GA4 лишається джерелом для реклами. Amplitude підключено в коді, не через GTM.

## Акаунт

Організація Amplitude акаунта Marketing Zavod, проєкт `default` (Project ID 918020), регіон даних **US** (`app.amplitude.com`). Регіон задано в коді константою `AMPLITUDE_SERVER_ZONE` у `lib/tracking/env.ts`: його треба змінити, якщо проєкт колись переїде в EU.

- [x] Session Replay: Settings → Session Replay & Heatmaps → Session Capture увімкнено, 100 % сесій, маскування Medium. План — 10 тис. записів на місяць.
- [x] API key проєкту: Settings → API Keys → «Legacy API Key» → у Vercel (Production) як `NEXT_PUBLIC_AMPLITUDE_API_KEY`, потім redeploy. Ключ публічний (він є в коді сторінки), але вносить його власник акаунта. Задано 25.11.2026.

## Як це працює в коді

| Що | Де | Поведінка |
| --- | --- | --- |
| Ініціалізація | `lib/tracking/amplitude.ts`, викликається з `TrackingProvider` | Без ключа або поза production нічого не вантажиться. SDK імпортується динамічно, лише за згоди на статистику |
| Пакети | `@amplitude/analytics-browser`, `@amplitude/plugin-session-replay-browser` | Guides & Surveys і Experiment не вантажаться (у старій версії вони були найважчими скриптами після згоди) |
| Автозбір | `AMPLITUDE_AUTOCAPTURE` | Перегляди сторінок (один на зміну шляху), сесії, атрибуція кампаній, завантаження файлів. Кліки, форми, мережеві запити і web vitals не збираються: їх покривають події плану і Speed Insights |
| Віддалені налаштування | `remoteConfig: { fetchRemoteConfig: false }` | Автозбір задається лише в коді. Перемикачі автозбору в інтерфейсі Amplitude на сайт не діють: інакше там можна було б увімкнути збір кліків і форм, якого не описує текст згоди. Заодно сторінка робить один запит до `sr-client-cfg.amplitude.com` (налаштування Session Replay) замість чотирьох-п'яти |
| Події плану | `track()` → `amplitudeTrack()` | Кожна подія плану, крім `page_view`, іде в Amplitude з тією самою назвою, параметрами і `event_id` |
| Черга до згоди | `amplitudeTrack()` | Події поточної сторінки до вибору чекають у черзі (до 100) і йдуть після згоди зі своїм часом. Відмова очищає чергу |
| Записи сесій | `amplitudeSessionReplayOptions()` | Усі сесії, маскування `medium` (усі поля вводу), додатково елементи з `data-private` |
| Ідентифікація | `amplitudeIdentifyLead()` | Після заявки: властивість користувача `last_lead_id` і first touch (`first_utm_*`, `first_landing_page`). Email і `user_id` не використовуються. Лише за згоди на статистику |
| Серверна подія | `lib/amplitude-server.ts`, з `/api/lead` | `lead_saved` через HTTP API на той самий пристрій, що й у браузері (`amplitude_device_id` із форми) |
| Журнал згод | `lib/amplitude-server.ts`, з `/api/consent` | `consent_recorded` під ID згоди замість ID пристрою (див. `analytics.md`, «Журнал згод») |
| Відкликання | `applyAmplitudeConsent()`, `lib/consent` | SDK переходить в opt-out; cookies і localStorage `AMP_*`, `amp_*`, `amplitude.*` та бази IndexedDB `…_amp_session_replay_events` і `AMP_diagnostics_…` видаляються, сторінка перезавантажується |

**Назва перегляду.** У плані подія називається `page_view`, а в Amplitude це `[Amplitude] Page Viewed`: на ній тримаються стандартні звіти, шляхи і записи сесій.

## Воронки, які треба зібрати

Analytics → New → Funnel Analysis. Вікно конверсії 7 днів, за унікальними користувачами.

### 1. Покупка: головна → Pricing → Checkout

| Крок | Подія | Фільтр |
| --- | --- | --- |
| 1 | `[Amplitude] Page Viewed` | `[Amplitude] Page Path` = `/` |
| 2 | `view_pricing` | — |
| 3 | `begin_checkout` | — |

Розбивка: `first_utm_source` (властивість користувача) або `utm_source` (атрибуція Amplitude).

### 2. Waitlist: будь-яка сторінка → Waitlist → успіх

| Крок | Подія | Фільтр |
| --- | --- | --- |
| 1 | `[Amplitude] Page Viewed` | будь-який |
| 2 | `[Amplitude] Page Viewed` | `[Amplitude] Page Path` = `/waitlist` |
| 3 | `form_start` | `form_name` = `waitlist` |
| 4 | `join_waitlist` | — |

### 3. Contact → успіх

| Крок | Подія | Фільтр |
| --- | --- | --- |
| 1 | `[Amplitude] Page Viewed` | `[Amplitude] Page Path` = `/contact` |
| 2 | `form_start` | `form_name` = `contact` |
| 3 | `generate_lead` | `form_name` = `contact` |

Додатково корисно: тренд `form_error` з розбивкою за `field` і тренд `cta_click` з розбивкою за `cta_location`. У звітах про користувачів відфільтруй подію `consent_recorded`: це записи журналу згод, а не відвідувачі.

## Перевірка

1. Data → Live Events (або User Look-Up за своїм Device ID): видно `[Amplitude] Page Viewed` і подію після кліку по кнопці.
2. DevTools → Network: запити на `api2.amplitude.com/2/httpapi` і `api-sr.amplitude.com` з'являються лише після згоди на статистику.
3. До згоди: в Application немає cookie і ключа localStorage з префіксом `AMP_`.
4. Після згоди: з'являються `AMP_…` і `AMP_MKTG_…`, запис сесії в Session Replay показує зірочки замість тексту в полях.
