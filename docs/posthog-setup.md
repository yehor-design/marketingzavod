# PostHog: налаштування і воронки

Роль у стеку: продуктова аналітика, воронки, записи сесій, експерименти і feature flags. GA4 лишається джерелом для реклами. PostHog підключено в коді, не через GTM, і всі запити йдуть через власний домен.

## Що зробити в кабінеті

- [ ] Створи проєкт у регіоні **EU** (`eu.posthog.com`).
- [ ] Project settings → скопіюй **Project API key** (`phc_…`). Поклади у Vercel (Production):
  - `NEXT_PUBLIC_POSTHOG_KEY` = ключ;
  - `NEXT_PUBLIC_POSTHOG_HOST` = `https://eu.i.posthog.com`.
- [ ] Зроби redeploy: змінні `NEXT_PUBLIC_*` вшиваються під час збірки.
- [ ] Session replay → увімкни запис. Маскування полів вводу задано в коді (`maskAllInputs`), у кабінеті залиш його ввімкненим.
- [ ] Project settings → **Authorized URLs**: додай `https://www.heywowboy.com`.

## Як це працює в коді

| Що | Де | Поведінка |
| --- | --- | --- |
| Ініціалізація | `lib/tracking/posthog.ts`, викликається з `TrackingProvider` | Без ключа або поза production нічого не вантажиться. Бібліотека імпортується ліниво, у `requestIdleCallback` |
| Проксі | `next.config.ts`, `rewrites` | `/ingest/*` → `eu.i.posthog.com`, `/ingest/static/*` і `/ingest/array/*` → `eu-assets.i.posthog.com` |
| Згода | `applyPosthogConsent` | До згоди на статистику: `persistence: "memory"`, без cookie, без localStorage, без записів. Після згоди: `localStorage+cookie` і записи. Відкликання повертає режим пам'яті і видаляє `ph_*` |
| Перегляди | `track("page_view")` | Автоматичні перегляди вимкнені (`capture_pageview: false`). Один перегляд на маршрут |
| Події плану | `track()` | Кожна подія дублюється в PostHog з тією самою назвою і параметрами |
| Ідентифікація | `posthogIdentifyLead` | Після заявки: `identify(lead_id)` і властивості first touch. Email як ідентифікатор не використовується. Лише за згоди на статистику |
| Серверна подія | `lib/posthog-server.ts` (`posthog-node`) | `lead_saved` з route handler, з тим самим distinct ID, що в браузері |
| Маскування | `session_recording.maskAllInputs`, атрибут `data-private` на формах | Усі поля вводу замасковані |

**Назва перегляду.** У плані подія називається `page_view`, а в PostHog вона записується як `$pageview`. Це стандартна назва PostHog: на ній тримаються Web analytics, воронки і записи. У Live Events шукай `$pageview`.

**Без згоди** PostHog усе одно отримує анонімні події, але нічого не зберігає в браузері, тож кожне завантаження сторінки виглядає як новий відвідувач. Через це кількість унікальних користувачів у PostHog буде завищена для тих, хто не дав згоди.

## Воронки, які треба зібрати

Product analytics → New insight → Funnel. Вікно конверсії 7 днів, підрахунок за унікальними користувачами.

### 1. Покупка: головна → Pricing → Checkout

| Крок | Подія | Фільтр |
| --- | --- | --- |
| 1 | `$pageview` | `$pathname` = `/` |
| 2 | `view_pricing` | — |
| 3 | `begin_checkout` | — |

Розбивка: `first_utm_source` (властивість користувача) або `utm_source`.

### 2. Waitlist: будь-яка сторінка → Waitlist → успіх

| Крок | Подія | Фільтр |
| --- | --- | --- |
| 1 | `$pageview` | будь-який |
| 2 | `$pageview` | `$pathname` = `/waitlist` |
| 3 | `form_start` | `form_name` = `waitlist` |
| 4 | `join_waitlist` | — |

### 3. Contact → успіх

| Крок | Подія | Фільтр |
| --- | --- | --- |
| 1 | `$pageview` | `$pathname` = `/contact` |
| 2 | `form_start` | `form_name` = `contact` |
| 3 | `generate_lead` | `form_name` = `contact` |

Додатково корисно: тренд `form_error` з розбивкою за `field` і тренд `cta_click` з розбивкою за `cta_location`.

## Перевірка

1. Activity → Live events: видно `$pageview` і подію після кліку по кнопці.
2. DevTools → Network: запити йдуть на `www.heywowboy.com/ingest/…`, а не на `posthog.com`.
3. До згоди: в Application немає cookie і ключа localStorage з префіксом `ph_`. Записів сесії немає.
4. Після згоди: з'являється `ph_phc_…_posthog`, запис сесії показує зірочки замість тексту в полях.

## Вартість проксі

Rewrites пропускають увесь трафік PostHog через Vercel, і він рахується у Fast Data Transfer та Edge Requests. Найбільше важать записи сесій. Якщо трафік виросте, PostHog радить безкоштовний керований проксі на власному піддомені.
