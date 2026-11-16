# Cookiebot: чекліст налаштувань

Cookiebot (Usercentrics) показує банер згоди і передає сигнали Consent Mode v2. На сайт він потрапляє через тег `Cookiebot CMP` у GTM. У коді сайту скрипта Cookiebot немає.

## Обмеження безкоштовного плану

Нижче дані зі сторонніх оглядів, які треба звірити в кабінеті: один домен, до 50 підсторінок, одна мова банера, журнал згод близько місяця, блокування cookies лише ручне, обмежене брендування. Перехід понад 50 підсторінок може автоматично перевести домен на платний тариф.

**Лічильник сторінок сайту.** У `sitemap.xml` зараз 29 публічних URL: 8 основних сторінок, 6 статей блогу, 5 оновлень, 8 вакансій, 2 юридичні. Поза sitemap є `/checkout` і дві службові сторінки `/dev/*`, разом 32. Запас до межі 50 становить 18 сторінок. Кожна задача, що додає сторінки, має звірятися з цим числом. E2e-тест падає, якщо в sitemap стане більше 40 URL.

## Кроки

- [ ] Зареєструй акаунт на cookiebot.com, план Free.
- [ ] Додай домен `heywowboy.com` (і `www.heywowboy.com`, якщо кабінет просить окремо).
- [ ] **Your scripts** → скопіюй **Domain Group ID** і поклади у Vercel як `NEXT_PUBLIC_COOKIEBOT_ID` (Production). Це не секрет.
- [ ] **Banner**:
  - тип: явна згода (opt-in), з категоріями;
  - кнопки «Allow all» і «Deny» однакового розміру й контрасту, жодна не схована за «Customize»;
  - тема темна, кольори під сайт, наскільки дозволяє план: фон `#080808`, текст білий;
  - розташування знизу, оверлей без блокування сторінки, щоб банер не зсував верстку.
- [ ] **Content** → мова банера: English, автовизначення мови вимкнути.
- [ ] **Auto-blocking: вимкнено.** Воно переписує теги скриптів і ламає гідратацію Next.js. Блокування зроблено через Consent у тегах GTM і модуль `lib/consent`.
- [ ] **Google Consent Mode** увімкнено (воно також увімкнене в тезі GTM).
- [ ] Дочекайся першого сканування. **Cookies** → перевір список. Нерозпізнані cookies класифікуй вручну:

  | Cookie | Категорія | Опис |
  | --- | --- | --- |
  | `CookieConsent` | Necessary | Вибір відвідувача в Cookiebot |
  | `wb_attr` | Statistics | Джерело візиту: UTM і click ID, 90 днів, first-party |
  | `ph_*_posthog` | Statistics | PostHog: ідентифікатор і сесія |
  | `_ga`, `_ga_*` | Statistics | Google Analytics 4 |
  | `_clck`, `_clsk`, `CLID`, `MUID` | Statistics | Microsoft Clarity |
  | `_gcl_au`, `_gcl_aw`, `_gcl_gb` | Marketing | Google Ads |
  | `_fbp`, `_fbc` | Marketing | Meta |
  | `li_fat_id`, `bcookie`, `lidc` | Marketing | LinkedIn |

- [ ] У списку не лишилося cookies у категорії Unclassified.
- [ ] Лічильник підсторінок: **Domains** → домен → звіт сканування показує кількість знайдених сторінок. Звір із числом вище.
- [ ] У GTM імпортуй `gtm/container.json` і опублікуй версію (див. `gtm/README.md`).
- [ ] Перечитай розділ «Cookies & Tracking» на `/legal/privacy-policy`. Текст написано агентом і він потребує твого погодження.

## Перевірка

1. Відкрий сайт у приватному вікні. Банер з'являється, сторінка під ним не стрибає.
2. До вибору: DevTools → Application → Cookies порожні, окрім `CookieConsent` після вибору. У Network запити до `google-analytics.com` мають `gcs=G100`. Запитів до `clarity.ms` і `facebook.net` немає.
3. «Allow all»: без перезавантаження з'являються `_ga`, `wb_attr`, `ph_*`, запити мають `gcs=G111`.
4. «Deny»: cookies аналітики й реклами не з'являються.
5. Клавіатура: Tab доходить до кнопок банера, Enter спрацьовує. Скрінрідер оголошує діалог.
6. Футер → **Cookie settings** відкриває вікно знову.
7. `/legal/privacy-policy` показує таблицю cookies, зокрема після переходу на сторінку без перезавантаження.

## Що робить код

- `lib/consent` читає `window.Cookiebot.consent` і слухає `CookiebotOnConsentReady`, `CookiebotOnAccept`, `CookiebotOnDecline`. Без Cookiebot на сторінці згода вважається відсутньою.
- Кнопка «Cookie settings» у футері викликає `Cookiebot.renew()`. Вона з'являється, лише коли задано `NEXT_PUBLIC_COOKIEBOT_ID` і `NEXT_PUBLIC_GTM_ID`.
- Декларація cookies на Privacy вантажить `https://consent.cookiebot.com/{ID}/cd.js`.
