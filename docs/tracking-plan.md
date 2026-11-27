# План подій і трекінгу

Єдине джерело назв подій, параметрів і змінних. Код (`lib/tracking/events.ts`), контейнер GTM (`gtm/events.json` → `gtm/container.json`) і цей документ мають збігатися. Юніт-тест `tests/unit/tracking-plan.test.ts` падає, якщо вони розійшлися.

## Правила

1. Події відправляє лише `track(event, params)` з `lib/tracking`. Прямий `dataLayer.push` заборонений.
2. Назви подій і параметрів: стиль GA4, `snake_case`, англійською.
3. У параметрах немає персональних даних: ні email, ні імені, ні телефону, ні тексту повідомлення.
4. Кожна подія автоматично отримує `event_id` (UUID). Для заявок це `event_id`, виданий сервером. Він же є `transaction_id` у Google Ads і `eventID` у Meta.
5. Трекінг працює лише на production-деплої Vercel. Preview і локальний запуск мовчать, якщо не задано `NEXT_PUBLIC_TRACKING_DEBUG=true`.

## Події

| Подія | Коли спрацьовує | Параметри | Куди йде | Ключова |
| --- | --- | --- | --- | --- |
| `page_view` | Один раз на перше завантаження і на кожен перехід між маршрутами. Після переходу подія чекає новий `<title>` (до 1 с), бо Next.js може дописати метадані трохи пізніше за сторінку | `page_location`, `page_path`, `page_title` | GA4, Amplitude (власний перегляд `[Amplitude] Page Viewed`), Google Ads Remarketing, Meta `PageView` | ні |
| `generate_lead` | Сервер зберіг заявку з форми Contact або Waitlist | `form_name` (`contact`, `waitlist`), `lead_id` | GA4, Amplitude, Google Ads (Contact), Meta `Lead` (Contact), LinkedIn (Contact) | так |
| `join_waitlist` | Сервер зберіг заявку Waitlist. Іде разом із `generate_lead`, з тим самим `event_id` | `form_name` (`waitlist`), `lead_id` | GA4, Amplitude, Google Ads (Waitlist), Meta `CompleteRegistration`, LinkedIn (Waitlist) | так |
| `submit_application` | Сервер зберіг відгук на вакансію | `form_name` (`careers_apply`), `lead_id`, `role` | GA4, Amplitude | ні |
| `begin_checkout` | Відкрито сторінку `/checkout` | `plan`, `value`, `currency` | GA4, Amplitude, Google Ads (додаткова), Meta `InitiateCheckout` | так |
| `view_pricing` | Відкрито `/pricing`, а також перемкнуто період оплати | `billing_period` (`monthly`, `yearly`) | GA4, Amplitude, Meta `ViewContent` | ні |
| `cta_click` | Клік по кнопці заклику | `cta_text`, `cta_location`, `destination` | GA4, Amplitude | ні |
| `contact_click` | Клік по `mailto:`, `tel:` або посиланню на месенджер | `method` (`email`, `phone`, `whatsapp`, `telegram`, `messenger`) | GA4, Amplitude, Google Ads (додаткова), Meta `Contact` | ні |
| `outbound_click` | Клік по посиланню на інший домен, зокрема соцмережі | `link_domain`, `link_url` (без рядка запиту) | GA4, Amplitude | ні |
| `form_start` | Перший фокус у полі форми, один раз на форму | `form_name` | GA4, Amplitude | ні |
| `form_error` | Поле не пройшло валідацію в браузері або на сервері | `form_name`, `field` | GA4, Amplitude | ні |
| `faq_open` | Розкрито питання в FAQ (закриття не рахується) | `question` | GA4, Amplitude | ні |

Серверна подія Amplitude `lead_saved` (`form_name`, `lead_id`, `event_id`, `store`) відправляється з route handler після збереження заявки, якщо була згода на статистику. Вона прив'язана до того самого пристрою, що й браузер (`amplitude_device_id` із форми). Ще одна серверна подія, `consent_recorded`, — це журнал згод (див. `analytics.md`).

Amplitude, окрім подій плану, сам збирає перегляди сторінок (`[Amplitude] Page Viewed`, один на маршрут), сесії, атрибуцію кампаній і завантаження файлів, а також записує всі сесії (Session Replay, поля форм замасковано). Кліки і форми він не збирає: їх покривають події плану.

### Значення `cta_location`

`header`, `mobile_menu`, `hero`, `footer_cta`, `updates`, `about`, `careers`, `checkout`, `pricing_card_starter`, `pricing_card_pro`, `pricing_card_agency`, `pricing_compare_starter`, `pricing_compare_pro`, `pricing_compare_agency`, `announcement`, `not_found`, `home_pilot_banner`.

### Покриття точок конверсії з аудиту

| Точка конверсії | Подія |
| --- | --- |
| Форма Waitlist | `form_start`, `form_error`, `generate_lead`, `join_waitlist` |
| Форма Contact | `form_start`, `form_error`, `generate_lead` |
| Форма відгуку на вакансію | `form_start`, `form_error`, `submit_application` |
| Сторінка Checkout | `begin_checkout`; кнопка «Get access» дає `cta_click` і `outbound_click` |
| Кнопки «Join waitlist», «Contact», «Learn more», кнопки тарифів | `cta_click` |
| Перемикач періоду оплати | `view_pricing` |
| FAQ | `faq_open` |
| Посилання на пошту | `contact_click` |
| Соцмережі та інші зовнішні посилання | `outbound_click` |

### Мапінг на Meta

| Подія сайту | Подія Meta (піксель) | Подія Meta (Conversions API) |
| --- | --- | --- |
| `page_view` | `PageView` | — |
| `generate_lead`, `form_name = contact` | `Lead` | `Lead` |
| `join_waitlist` | `CompleteRegistration` | `CompleteRegistration` |
| `begin_checkout` | `InitiateCheckout` | — |
| `view_pricing` | `ViewContent` | — |
| `contact_click` | `Contact` | — |

Для Waitlist обрано `CompleteRegistration`, а не `Lead`: так заявки з Contact і записи у Waitlist лишаються двома різними цілями оптимізації.

### Офлайн-конверсії (стадії угоди в CRM)

Умовна цінність потрібна рекламним системам для ставок. Це не виручка. Числа нижче є стартовим припущенням, їх варто замінити, коли з'являться реальні дані про угоди. Змінюються в `lib/offline/config.ts`.

| Стадія | Стадія в HubSpot (типовий пайплайн) | Назва в Google Ads | Подія Meta | Цінність |
| --- | --- | --- | --- | --- |
| Кваліфікований лід | `qualifiedtobuy` | `Qualified lead (offline)` | `QualifiedLead` | 50 EUR |
| Угода виграна | `closedwon` | `Deal won (offline)` | `DealWon` | 500 EUR |

## Схема UTM

Усі значення в нижньому регістрі, без пробілів (пробіл замінюється на `_`), до 150 символів. Сайт нормалізує їх сам, але посилання краще одразу писати правильно.

| Параметр | Правило | Дозволені значення |
| --- | --- | --- |
| `utm_source` | Майданчик | `google`, `meta`, `facebook`, `instagram`, `linkedin`, `tiktok`, `bing`, `youtube`, `x`, `newsletter`, `partner`, `qa` (для тестів) |
| `utm_medium` | Тип трафіку | `cpc`, `paid_social`, `display`, `video`, `email`, `organic_social`, `referral`, `affiliate`, `qr` |
| `utm_campaign` | `{продукт}_{ціль}_{гео}_{рррр-мм}` | наприклад `jet_leads_eu_2026-11` |
| `utm_content` | Варіант оголошення або креативу | наприклад `video_a`, `carousel_2` |
| `utm_term` | Ключове слово або аудиторія | довільно |

## Click ID

Зберігаються лише за згоди на маркетинг: `gclid`, `gbraid`, `wbraid` (Google), `fbclid` (Meta), `msclkid` (Microsoft), `li_fat_id` (LinkedIn), `ttclid` (TikTok). Регістр не змінюється, довжина до 255 символів.

## Атрибуція

- **First touch** записується один раз і не перезаписується. **Last touch** оновлюється, коли приходить новий набір параметрів кампанії.
- Кожен дотик містить UTM, click ID, `landing_page`, `referrer` (обидва без рядка запиту) і `timestamp`.
- Сховище: first-party cookie `mz_attr` на 90 днів.

| Згода | Cookie `mz_attr` | Що йде з формою |
| --- | --- | --- |
| Маркетинг | є, з click ID | UTM, click ID, landing page, referrer, час |
| Лише статистика | є, без click ID | UTM, landing page, referrer, час |
| Немає | немає, значення лише в пам'яті вкладки | лише UTM |

Сервер повторно застосовує те саме правило до того, що прийшло з браузера.

## Згода

| Категорія згоди | Сигнали Consent Mode | Що вмикає поза GTM |
| --- | --- | --- |
| Necessary | `security_storage` (завжди `granted`) | cookie `mz_consent` із вибором відвідувача |
| Preferences (у банері не показується) | `functionality_storage`, `personalization_storage` (завжди `denied`) | нічого |
| Statistics | `analytics_storage` | GTM (якщо дано лише цю згоду), Amplitude із записами сесій, Vercel Speed Insights, cookie атрибуції, серверна подія Amplitude `lead_saved` |
| Marketing | `ad_storage`, `ad_user_data`, `ad_personalization` | GTM (якщо дано лише цю згоду), click ID, Meta Conversions API, передача email у Enhanced Conversions |

## Змінні середовища

| Змінна | Тип | Призначення |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | публічна | Канонічний origin. Типово `https://www.marketingzavod.com` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | публічна | `true` у Production відкриває сайт для Google і пошукових роботів; поки порожньо — сайт повністю закритий (`Disallow: /`, `X-Robots-Tag`, `meta robots`, порожній `sitemap.xml`) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | публічна | Запасне підтвердження Search Console мета-тегом |
| `NEXT_PUBLIC_TRACKING_DEBUG` | публічна | `true` дозволяє трекінг поза production |
| `NEXT_PUBLIC_GTM_ID` | публічна | ID контейнера GTM (`GTM-…`) |
| `NEXT_PUBLIC_GA4_ID` | публічна | Measurement ID (`G-…`) |
| `NEXT_PUBLIC_AMPLITUDE_API_KEY` | публічна | Ключ проєкту Amplitude. Браузер вантажить Amplitude лише за згоди на статистику; сервер шле цим ключем `lead_saved` і журнал згод |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | публічна | ID акаунта Google Ads (`AW-…`) |
| `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT` | публічна | Мітка конверсії «заявка з Contact» |
| `NEXT_PUBLIC_GOOGLE_ADS_LABEL_WAITLIST` | публічна | Мітка конверсії «запис у Waitlist» |
| `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CHECKOUT` | публічна | Мітка конверсії `begin_checkout` |
| `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT_CLICK` | публічна | Мітка конверсії `contact_click` |
| `NEXT_PUBLIC_META_PIXEL_ID` | публічна | ID набору даних (пікселя) Meta |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | публічна | Partner ID LinkedIn |
| `NEXT_PUBLIC_LINKEDIN_CONVERSION_CONTACT` | публічна | ID конверсії LinkedIn для Contact |
| `NEXT_PUBLIC_LINKEDIN_CONVERSION_WAITLIST` | публічна | ID конверсії LinkedIn для Waitlist |
| `META_CAPI_ACCESS_TOKEN` | **секрет** | Токен Conversions API |
| `HUBSPOT_ACCESS_TOKEN` | **секрет** | Токен доступу HubSpot |
| `HUBSPOT_CLIENT_SECRET` | **секрет** | Client secret застосунку HubSpot, перевіряє підпис webhook (необов'язковий шлях) |
| `CRON_SECRET` | **секрет** | Vercel Cron передає його в `/api/cron/offline-conversions`, інших викликачів відхилено |
| `OFFLINE_CONVERSIONS_SECRET` | **секрет** | Пароль до файла офлайн-конверсій для Google Ads |
| `RESEND_API_KEY` | **секрет** | Ключ API Resend для відправки листів з домену `marketingzavod.com` |
| `EMAIL_VERIFY_SECRET` | **секрет** | Bearer-секрет для операційної перевірки відправки `POST /api/email/verify` |
| `RESEND_FROM` | не секрет | Адреса відправника Resend. Типово `Marketing Zavod <noreply@marketingzavod.com>` |
| `RESEND_VERIFY_TO` | не секрет | Скринька одержувача для перевірки `POST /api/email/verify` |
| `META_TEST_EVENT_CODE` | не секрет | Тестовий код Meta. Прибрати після перевірки |
| `HUBSPOT_PIPELINE` | не секрет | ID пайплайна. Типово `default` |
| `HUBSPOT_DEAL_STAGE_NEW` | не секрет | Стадія нової угоди. Типово `appointmentscheduled` |
| `HUBSPOT_STAGE_QUALIFIED` | не секрет | Стадія «кваліфікований лід». Типово `qualifiedtobuy` |
| `HUBSPOT_STAGE_WON` | не секрет | Стадія «угода виграна». Типово `closedwon` |

Публічні ідентифікатори потрапляють у клієнтський бандл. Секрети читаються лише на сервері і ніколи не мають префікса `NEXT_PUBLIC_`.

Ідентифікатори сервісів не вписані в контейнер GTM. Сайт кладе їх у `dataLayer` зі змінних середовища до старту GTM, а контейнер читає їх змінними `ID - …`. Тому після імпорту контейнер не треба редагувати, а порожня змінна лишає тег неактивним.
