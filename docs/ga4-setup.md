# GA4: чекліст налаштувань

GA4 стоїть лише через GTM. Прямого `gtag.js` у коді немає. Орієнтовно 15 хвилин одним заходом.

## Створення

- [ ] Admin → Create → Property. Часовий пояс **Europe/Sofia**, валюта **EUR**.
- [ ] Data streams → Web → `https://www.heywowboy.com`. Скопіюй **Measurement ID** (`G-…`) у Vercel як `NEXT_PUBLIC_GA4_ID`, зроби redeploy.

## Налаштування

- [ ] **Зберігання даних.** Admin → Data collection and modification → Data retention → **14 months**.
- [ ] **Enhanced Measurement.** Data streams → потік → шестерня:
  - Page views → Advanced settings → **вимкни «Page changes based on browser history events»**. Сайт сам надсилає один `page_view` на маршрут. Якщо лишити цю опцію, перегляди подвояться;
  - **Site search — вимкни** (пошуку на сайті немає);
  - **Outbound clicks — вимкни**: сайт надсилає власний `outbound_click`;
  - **Form interactions — вимкни**: сайт надсилає `form_start` і `generate_lead`;
  - Scrolls, Video engagement, File downloads лиши ввімкненими.
- [ ] **Ключові події.** Admin → Data display → Events → позначити **Mark as key event** для `generate_lead`, `join_waitlist`, `begin_checkout`. Подія з'являється у списку після першого надходження. Щоб не чекати, створи їх заздалегідь через Key events → New key event.
- [ ] **Custom dimensions.** Admin → Data display → Custom definitions → Create custom dimension, scope **Event**:

  | Назва | Event parameter |
  | --- | --- |
  | Form name | `form_name` |
  | Form field | `field` |
  | CTA text | `cta_text` |
  | CTA location | `cta_location` |
  | CTA destination | `destination` |
  | Contact method | `method` |
  | Link domain | `link_domain` |
  | Billing period | `billing_period` |
  | Plan | `plan` |
  | FAQ question | `question` |
  | Role | `role` |
  | Lead ID | `lead_id` |

  `lead_id` потрібен, щоб звести заявку в GA4 із записом у CRM. Це внутрішній UUID, не персональні дані. `event_id`, `page_location`, `page_title`, `value`, `currency` реєструвати не треба.
- [ ] **Внутрішній трафік.** Data streams → потік → Configure tag settings → Define internal traffic → додай свою IP-адресу. Потім Admin → Data filters → Internal Traffic → стан **Active**.
- [ ] **Небажані реферали.** Configure tag settings → List unwanted referrals → додай `whop.com` і `dub.link` (зовнішня сторінка оплати), щоб повернення з них не починало нову сесію.
- [ ] **Google Signals.** Admin → Data collection → увімкни, якщо плануєш ремаркетингові аудиторії. Він працює лише для користувачів із `ad_personalization = granted`.
- [ ] **Згода.** Admin → Data collection → Consent settings: після першого трафіку тут має бути зелений статус для ad measurement і ad personalization.
- [ ] **Зв'язки.** Admin → Product links:
  - Google Ads (після створення акаунта);
  - Search Console (після підтвердження домену);
  - BigQuery (див. `reporting-setup.md`).

## Як влаштовані теги

- `GA4 - Google tag` стоїть на Initialization з `send_page_view = false`.
- На кожну подію плану є тег `GA4 - {event}` з усіма параметрами і `event_id`.
- Додаткової вимоги згоди на тегах GA4 немає: вони мають вбудовану перевірку `analytics_storage`. Без згоди GA4 надсилає запити без cookies (`gcs=G100`), і це потрібно для моделювання.

## Перевірка

1. **DebugView.** GTM → Preview → відкрий сайт. У GA4 → Admin → DebugView видно `page_view` на кожен перехід і події плану з параметрами.
2. **Realtime.** Reports → Realtime: твій візит і події видно за кілька секунд.
3. **Без дублів.** Перейди між трьома сторінками: у DebugView рівно три `page_view`.
4. **Без згоди.** У приватному вікні натисни Deny. У Network запити до `google-analytics.com/g/collect` мають `gcs=G100`, а cookie `_ga` не створено.
