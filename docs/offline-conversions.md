# Офлайн-конверсії: з CRM у Google Ads і Meta

Рекламні системи дізнаються не лише про заявку, а й про те, що з нею сталося далі. Це дозволяє оптимізувати кампанії під якість лідів.

## Схема

```
Заявка на сайті ──► /api/lead ──► HubSpot: контакт (click ID, email, згода) + угода (wb_lead_id)
                                        │
            менеджер переводить угоду в «Qualified» або «Closed won»
                                        │
              ┌─────────────────────────┴──────────────────────────┐
              ▼                                                    ▼
   webhook HubSpot (deal.propertyChange)              Google Ads, запланований імпорт
   POST /api/crm/hubspot                              GET /api/offline-conversions/google-ads
   → Meta Conversions API                             ← CSV, зібраний з HubSpot у момент запиту
     action_source: system_generated
```

Стадії, назви конверсій і цінності зафіксовані в `tracking-plan.md` і в `lib/offline/config.ts`.

| Стадія HubSpot | Google Ads | Meta | Цінність |
| --- | --- | --- | --- |
| `qualifiedtobuy` | `Qualified lead (offline)` | `QualifiedLead` | 50 EUR |
| `closedwon` | `Deal won (offline)` | `DealWon` | 500 EUR |

## Правила

- **Згода.** Конверсія надсилається лише для ліда, у якого `wb_consent_marketing = true` на момент заявки. Інші угоди пропускаються в обох каналах.
- **Ідемпотентність, Meta.** Після успішної відправки ключ конверсії (`qualified_lead`, `deal_won`) записується у властивість угоди `wb_offline_sent`. Повторний webhook для тієї самої стадії нічого не шле. Угода, яку перевели назад і знову вперед, не дублюється. Додатково `event_id` детермінований: `{lead_id}:{ключ}`.
- **Ідемпотентність, Google Ads.** Файл не має стану: щоразу будується з поточних даних HubSpot. Google Ads сам відкидає повторний рядок з тим самим click ID, назвою конверсії і часом. Час береться з дати входу угоди в стадію, тому він стабільний.
- **Ідентифікатори.** Google Ads: `gclid`, `gbraid` або `wbraid`. Якщо click ID немає, береться SHA-256 від email (Enhanced Conversions for Leads). Meta: хешований email і телефон, `fbp`, `fbc`, хешований `lead_id`.

## Змінні середовища

| Змінна | Тип | Для чого |
| --- | --- | --- |
| `HUBSPOT_ACCESS_TOKEN` | секрет | Читання угод і контактів, запис `wb_offline_sent` |
| `HUBSPOT_CLIENT_SECRET` | секрет | Перевірка підпису webhook (`X-HubSpot-Signature-v3`) |
| `OFFLINE_CONVERSIONS_SECRET` | секрет | Пароль до файла для Google Ads. Згенеруй довгий випадковий рядок |
| `META_CAPI_ACCESS_TOKEN`, `NEXT_PUBLIC_META_PIXEL_ID` | секрет / публічна | Відправка в Meta |
| `HUBSPOT_STAGE_QUALIFIED`, `HUBSPOT_STAGE_WON` | не секрет | ID стадій, якщо пайплайн не типовий |

Без `HUBSPOT_ACCESS_TOKEN` обидва endpoint відповідають 503 і нічого не роблять.

## Налаштування HubSpot

Чому webhook, а не опитування: webhook у застосунку HubSpot доступний на безкоштовному тарифі і спрацьовує одразу. Vercel Cron на тарифі Hobby запускається раз на добу. Workflow з дією «Send webhook» потребує платного Operations Hub, тому він не використовується.

- [ ] Запусти `npm run hubspot:setup` (створює властивості `wb_lead_id`, `wb_offline_sent` та інші).
- [ ] У налаштуваннях застосунку HubSpot → Webhooks:
  - Target URL: `https://www.heywowboy.com/api/crm/hubspot`;
  - підписка: **Deal → Property changed → `dealstage`**;
  - активуй підписку.
- [ ] Скопіюй **Client secret** застосунку у Vercel як `HUBSPOT_CLIENT_SECRET`.

Endpoint приймає запит, лише якщо підпис v3 збігається і мітка часу не старша за 5 хвилин.

## Налаштування Google Ads

Developer token не потрібен: використовується запланований імпорт файла.

- [ ] Goals → Conversions → New conversion action → **Import** → «CRMs, files, or other data sources» → «Track conversions from clicks». Створи дві дії з точними назвами `Qualified lead (offline)` і `Deal won (offline)`, категорії «Qualified lead» і «Converted lead», цінність «Use different values», підрахунок One.
- [ ] Goals → Conversions → **Uploads** → **Schedules** → «+»:
  - Source: **HTTPS**;
  - URL: `https://www.heywowboy.com/api/offline-conversions/google-ads`;
  - Username: будь-який (наприклад `google-ads`), Password: значення `OFFLINE_CONVERSIONS_SECRET`;
  - частота: щодня.
- [ ] Натисни **Preview** на розкладі і перевір, що рядки розпізнано без помилок.

Формат файла:

```
Parameters:TimeZone=+0000
Google Click ID,GBRAID,WBRAID,Email,Conversion Name,Conversion Time,Conversion Value,Conversion Currency,Ad User Data,Ad Personalization
TEST-gclid,,,,Deal won (offline),2026-11-16 10:00:00,500,EUR,Granted,Granted
```

Назви колонок і механізм запланованого імпорту записані з пам'яті за довідкою Google Ads і не перевірені на живому акаунті. Google поступово переводить офлайн-імпорт на Data Manager і Enhanced Conversions for Leads. Якщо Preview покаже помилку формату, завантаж актуальний шаблон з того самого екрана (Uploads → «View templates») і передай його агенту: заголовок задається одним масивом у `lib/offline/google-ads-csv.ts`.

Конверсія з click ID приймається, якщо клік був не раніше ніж 90 днів тому, і зазвичай не раніше ніж через кілька годин після самого кліку.

## Перевірка

1. Відправ форму Contact із `?gclid=TEST-gclid&utm_source=qa` і згодою на все. У HubSpot з'явилися контакт і угода.
2. Додай `META_TEST_EVENT_CODE`, переведи угоду в «Qualified to buy». У Meta → Test events з'являється `QualifiedLead` з джерелом Server.
3. Переведи угоду назад і знову в «Qualified to buy». Другої події немає, у властивості угоди `wb_offline_sent` значення `qualified_lead`.
4. Перевір файл:

   ```bash
   curl -u google-ads:$OFFLINE_CONVERSIONS_SECRET https://www.heywowboy.com/api/offline-conversions/google-ads
   ```

   У відповіді є рядок із `TEST-gclid` і `Qualified lead (offline)`.
5. Без пароля той самий запит повертає 401.

## Що не перевірено

Обидва endpoint покриті юніт-тестами (підпис, формат файла, читання стадій), але не перевірені з реальним HubSpot, Meta і Google Ads: акаунтів і токенів ще немає.
