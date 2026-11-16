# Microsoft Clarity: налаштування

Роль у стеку: записи сесій і теплові карти лендингу. Воронки й події лишаються в PostHog і GA4. Clarity стоїть тегом у GTM.

## Що зробити в кабінеті

- [ ] clarity.microsoft.com → New project → `heywowboy.com`.
- [ ] Settings → Overview → скопіюй **Project ID** у Vercel як `NEXT_PUBLIC_CLARITY_ID`, зроби redeploy.
- [ ] Settings → **Masking** → режим **Balanced** або **Strict**. Не Relaxed.
- [ ] Settings → Setup → **Google Analytics integration** → Get started → обери ресурс GA4. Після цього в GA4 з'являється посилання на запис сесії, а в Clarity сегменти за даними GA4.
- [ ] Settings → **IP blocking** → додай свою IP-адресу.
- [ ] Settings → Setup → Cookies: залиш увімкненими. Згоду контролює тег GTM.

## Як це працює

| Тег GTM | Коли | Вимога згоди |
| --- | --- | --- |
| `Clarity - Base` | Перший `page_view` або `consent_update`, один раз на завантаження | `analytics_storage` |
| `Clarity - Consent update` | Кожен `consent_update` | немає: саме він повідомляє Clarity про відкликання |
| `Clarity - Form tag` | `generate_lead` | `analytics_storage` |

- Без згоди на статистику скрипт Clarity не вантажиться, запитів до `clarity.ms` немає.
- Після завантаження тег викликає Consent API: `clarity("consentv2", { ad_Storage, analytics_Storage })`. При відкликанні надсилається `denied` і `clarity("consent", false)`, що стирає cookies Clarity.
- Користувацькі теги: `utm_source`, `utm_campaign` (з URL або з cookie атрибуції) і `form_name` після заявки. Email та інші персональні дані не передаються.
- Форми мають атрибут `data-clarity-mask="true"`, тож їхній вміст замасковано в будь-якому режимі.

Назви методів Consent API взято з пам'яті за довідкою Microsoft і не перевірено на живому проєкті. Після підключення перевір у DevTools, що виклик `consentv2` не дає помилок у консолі.

## Розумні події і фільтри

- Smart events створюються автоматично. Додай власні в Settings → Smart events: «Submit form» для `/contact` і `/waitlist`, «Rage click» на `/pricing`.
- Фільтри: Filters → Custom tags → `utm_source`, `utm_campaign`, `form_name`. Збережи сегменти «Платний трафік» (`utm_source` = `google` або `meta`) і «Залишили заявку» (`form_name` існує).

## Перевірка

1. До згоди: у Network немає запитів до `clarity.ms`.
2. Після «Allow all»: з'являється запит до `www.clarity.ms/tag/…`, у кабінеті через кілька хвилин видно запис. Поля форми показані крапками.
3. PostHog і Clarity пишуть ту саму сесію незалежно. Перевір, що обидва записи тестової сесії повні.
4. Вплив на швидкість записується в таблицю «до і після» в `performance-budget.md`.
