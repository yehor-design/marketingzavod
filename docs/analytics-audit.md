# Аудит аналітики: стан до початку робіт

Дата аудиту: 16 листопада 2026. Гілка `main`, коміт `86485f7`.
Це знімок «як було». Поточний стан описано в [analytics.md](analytics.md).

## Технічна основа

| Пункт | Значення |
| --- | --- |
| Фреймворк | Next.js 16.4 (`next` `^16.4.5`), React 19.3 |
| Роутер | App Router (`app/`). Pages Router не використовується |
| Хостинг | Vercel, проєкт `wowboy/wowboy`, деплой з GitHub `yehor-design/marketing` |
| Основний домен | `https://www.heywowboy.com`. Апекс `heywowboy.com` віддає 308 на `www` |
| Серверний код | Не було жодного route handler і жодної server action |
| Змінні середовища | Жодна не читалася кодом, `.env.example` не існував |
| Лінтер, тести, CI | Не було |

## Скрипти аналітики

| Сервіс | Чи був у коді | Як вантажився | Чи зважав на згоду |
| --- | --- | --- | --- |
| Google Tag Manager | ні | — | — |
| GA4 (`gtag.js`) | ні | — | — |
| PostHog | ні | — | — |
| Microsoft Clarity | ні | — | — |
| Meta Pixel | ні | — | — |
| Vercel Speed Insights / Analytics | ні | — | — |
| Банер згоди | ні | — | — |

Висновок: сайт не мав жодного трекінгу і жодної cookie. Дублікатів прибирати не довелося.

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

Виміряно на production (`https://www.heywowboy.com`) до будь-яких змін. Lighthouse 12.8.2, стандартна мобільна емуляція (Slow 4G, CPU ×4), по три запуски, у таблиці медіана. Lighthouse не вимірює INP, тому лабораторним замінником є TBT.

| Сторінка | Оцінка | LCP | CLS | TBT | JS (передано) | Усього |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 70 | 7,40 с | 0,000 | 88 мс | 219 КБ | 2106 КБ |
| `/pricing` | 83 | 3,75 с | 0,000 | 50 мс | 225 КБ | 561 КБ |
| `/contact` | 97 | 2,52 с | 0,000 | 1 мс | 217 КБ | 462 КБ |

Окремі запуски (оцінка / LCP у мс): головна 67 / 7640, 80 / 5302, 70 / 7401; Pricing 83 / 3752, 88 / 3710, 83 / 3800; Contact 88 / 3347, 97 / 2524, 99 / 1927.

Спостереження: LCP головної і Pricing уже до трекінгу перевищує бюджет 2,5 с. Причина не в скриптах аналітики (їх не було), а у вазі головної (2,1 МБ) і в тому, що героїчні зображення малюються на canvas після завантаження. Це зафіксовано в [performance-budget.md](performance-budget.md) як окрема проблема.

## Що було встановлено і чого бракувало

Встановлено: нічого з аналітики.

Бракувало, і це закрито в межах MAR-20:

- банера згоди і Consent Mode v2;
- GTM, `dataLayer` і єдиного помічника `track()`;
- GA4, PostHog, Clarity, Google Ads, Meta, LinkedIn;
- серверного обробника форм, збереження заявок і передачі в CRM;
- збереження UTM і click ID;
- `sitemap.xml`, `robots.txt`, canonical на власний домен (canonical вказував на `jet.framer.website`), Open Graph, JSON-LD;
- Speed Insights, бюджету швидкості, CI.
