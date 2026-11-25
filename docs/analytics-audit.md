# Аудит аналітики: стан на момент перепідключення

Дата аудиту: 25 листопада 2026. Гілка `main`, коміт `f530bc1`.
Сайт переїхав на нову назву і домен (Marketing Zavod, `marketingzavod.com`), а всі сервіси підключаються до нових акаунтів. Це знімок «як було» перед перепідключенням. Поточний стан описано в [analytics.md](analytics.md).

## Технічна основа

| Пункт | Значення |
| --- | --- |
| Фреймворк | Next.js 16.4.6, React 19.3.1 |
| Роутер | App Router (`app/`). Pages Router не використовується |
| Хостинг | Vercel, команда `zavodzamarketing`, проєкт `marketingzavod`, деплой з GitHub `yehor-design/marketingzavod` (гілка `main`) |
| Основний домен | `https://www.marketingzavod.com`. Апекс `marketingzavod.com` віддає 308 на `www`. Домен зареєстровано у Vercel, DNS — Vercel |
| Серверний код | Route handlers: `/api/lead`, `/api/consent`, `/api/cron/offline-conversions`, `/api/crm/hubspot`, `/api/offline-conversions/google-ads`, а також `/api/meta/event` (лише для Zaraz) |
| Змінні середовища | У проєкті Vercel не було жодної: увесь трекінг на production був неактивний |
| Лінтер, тести, CI | ESLint, Vitest, Playwright, Lighthouse CI у GitHub Actions |

## Скрипти аналітики

| Сервіс | Чи був у коді | Як вантажився | Чи зважав на згоду | Що з ним зроблено |
| --- | --- | --- | --- | --- |
| Google Tag Manager | так | inline-бутстрап + `gtm.js` лише після згоди | так | лишається єдиним менеджером тегів |
| Cloudflare Zaraz | так, за перемикачем `NEXT_PUBLIC_TAG_MANAGER` | `z.<домен>` після згоди | так | прибрано: вибрано GTM |
| GA4 | так, через GTM або Zaraz | всередині менеджера тегів | так | лишається, через GTM |
| PostHog | так, у коді (`/ingest`), плюс серверні логи через OpenTelemetry | ліниво після згоди | так | прибрано: продуктова аналітика лише в Amplitude |
| Amplitude | так, `@amplitude/unified` | після згоди | так | лишається; лише SDK аналітики і Session Replay |
| Meta Pixel / Conversions API | піксель у GTM, CAPI з `/api/lead`, при Zaraz — `/api/meta/event` | після згоди на маркетинг | так | піксель у GTM + CAPI для заявок; `/api/meta/event` прибрано |
| Vercel Speed Insights | так | після згоди на статистику | так | лишається |
| Банер згоди | так, власний | — | — | лишається; cookie перейменовано на `mz_consent` |

Префікс власних cookie, ключів і властивостей HubSpot змінено з `wb_` на `mz_` (`mz_consent`, `mz_attr`, `mz_*` у HubSpot).

## Точки конверсії

| Точка | Сторінка | Файл і компонент | Куди йшли дані до змін |
| --- | --- | --- | --- |
| Форма Waitlist | `/waitlist` | `components/waitlist/waitlist-page.tsx`, `WaitlistPage` | Нікуди. `onSubmit` лише показував «You're on the waitlist!» |
| Форма Contact | `/contact` | `components/contact/contact-page.tsx`, `ContactPage` | Нікуди. `onSubmit` лише показував успіх. Функція `validate` існувала, але не викликалася |
| Форма відгуку на вакансію | `/careers/[slug]` | `components/careers/apply-form.tsx`, `ApplyForm` | Нікуди, так само |
| Сторінка Checkout | `/checkout` | `components/checkout/checkout-page.tsx`, `CheckoutPage` | Оплати на сайті немає. Кнопка «Get access» веде на зовнішній `whop.com` |
| Кнопки «Join waitlist» | шапка, мобільне меню, герой, блок перед футером, Updates | `components/site-header.tsx` (`NavRoll`, `.mobile-cta`), `components/home/home-page.tsx` (`RollLink`), `components/site-cta.tsx`, `components/updates/join-button.tsx` | Внутрішній перехід на `/waitlist` |
| Кнопка «Contact» | шапка | `components/site-header.tsx`, `NavRoll` | Перехід на `/contact` |
| «Learn more» | герой | `components/home/home-page.tsx`, `RollLink` | Якір `/#benefits` |
| Кнопки тарифів | `/pricing`: 3 картки, перемикач тарифу, таблиця порівняння | `components/pricing/pricing-page.tsx` (`Link` картки, `RollLink`) | Перехід на `/checkout` |
| Перемикач періоду оплати | `/pricing` | `components/pricing/pricing-page.tsx`, кнопки Monthly / Yearly | Локальний стан |
| FAQ | головна | `components/home/home-page.tsx`, кнопки питань | Локальний стан |
| Посилання на пошту | Privacy: `mailto:privacy@jet.com` | `lib/legal.ts` → `components/legal/legal-page.tsx` | Поштовий клієнт |
| Соцмережі | футер: Facebook, Instagram, TikTok, YouTube, X | `lib/routes.ts` (`socialLinks`) → `components/site-footer.tsx` | Зовнішні сайти |
| Інші зовнішні посилання | About (портрети → `x.com`), Checkout (`whop.com`, `dub.link`, твіт) | `components/about/about-page.tsx`, `components/checkout/checkout-page.tsx` | Зовнішні сайти |

Телефону і месенджерів на сайті немає.

## Базова швидкість (Lighthouse, мобільний профіль)

Виміряно на production (`https://www.marketingzavod.com`) до підключення сервісів: жодного стороннього скрипта на сторінці. Lighthouse 13.6.0, стандартна мобільна емуляція (Slow 4G, CPU ×4), по три запуски, у таблиці медіана. Lighthouse не вимірює INP, тому лабораторним замінником є TBT.

| Сторінка | Оцінка | LCP | CLS | TBT | JS (передано) | Усього |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 77 | 5,15 с | 0,000 | 206 мс | 334 КБ | 2134 КБ |
| `/pricing` | 91 | 3,50 с | 0,000 | 41 мс | 328 КБ | 571 КБ |
| `/contact` | 100 | 1,10 с | 0,000 | 2 мс | 378 КБ | 543 КБ |

Спостереження: LCP головної і Pricing уже до трекінгу перевищує бюджет 2,5 с. Причина не в скриптах аналітики (їх не було), а у вазі головної (2,1 МБ) і в тому, що героїчні зображення малюються на canvas після завантаження. Це зафіксовано в [performance-budget.md](performance-budget.md) як окрема проблема.

## Що було встановлено і чого бракувало

Встановлено: увесь код стеку (згода, GTM, атрибуція, ліди, Meta CAPI, HubSpot, офлайн-конверсії, Speed Insights, SEO, CI).

Бракувало, і це закривається перепідключенням:

- акаунтів під Marketing Zavod: GA4, GTM, набір даних Meta, Amplitude, HubSpot (властивості й ключ), Search Console;
- змінних середовища у проєкті Vercel `marketingzavod`;
- підтвердження домену `marketingzavod.com` у Meta і Search Console;
- згадки старого домену і префікса `wb_` у коді й документації.
