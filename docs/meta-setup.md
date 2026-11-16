# Meta: піксель і Conversions API

Meta отримує конверсію двома шляхами: з браузера (піксель у GTM) і з сервера (Conversions API з route handler). Обидві події мають однаковий `event_id`, і Meta рахує їх як одну. Кампанії не створюються.

## Що зробити в кабінеті

- [ ] business.facebook.com → створи Business Portfolio і рекламний акаунт.
- [ ] Events Manager → Connect data → Web → створи набір даних (піксель). Скопіюй **Dataset ID** у Vercel як `NEXT_PUBLIC_META_PIXEL_ID`.
- [ ] Events Manager → набір даних → Settings → Conversions API → **Generate access token**. Поклади у Vercel як `META_CAPI_ACCESS_TOKEN`. Це секрет: не в Linear і не в чат.
- [ ] **Підтверди домен.** Business settings → Brand safety and suitability → Domains → Add → `heywowboy.com` → метод DNS TXT. Додай запис у реєстратора, дочекайся статусу Verified.
- [ ] Імпортуй оновлений контейнер GTM, опублікуй версію, зроби redeploy.

## Як це працює

### Браузер (GTM)

| Тег | Тригер | Подія Meta |
| --- | --- | --- |
| `Meta - PageView` | кожен `page_view`, а також `cookie_consent_update` | `PageView` |
| `Meta - Lead` | `generate_lead`, `form_name = contact` | `Lead` |
| `Meta - CompleteRegistration` | `join_waitlist` | `CompleteRegistration` |
| `Meta - InitiateCheckout` | `begin_checkout` | `InitiateCheckout` |
| `Meta - ViewContent` | `view_pricing` | `ViewContent` |
| `Meta - Contact` | `contact_click` | `Contact` |

Усі теги вимагають `ad_storage`. Без згоди `fbevents.js` не вантажиться. Кожна подія передає `eventID` = `event_id` з `dataLayer`. Для `PageView` його генерує клієнт.

### Сервер (`app/api/lead/route.ts` → `lib/meta/capi.ts`)

Після збереження заявки сервер надсилає `Lead` (Contact) або `CompleteRegistration` (Waitlist) на `graph.facebook.com/v27.0/{dataset_id}/events`:

- `event_id` той самий, що повернувся в браузер;
- `action_source: website`, `event_source_url`, `event_time`;
- `user_data`: SHA-256 від нормалізованого email (і телефону, якщо поле з'явиться), IP, user agent, `fbp`, `fbc` (з cookie або з `fbclid`), хешований `lead_id` як `external_id`.

Подія надсилається лише коли: це production, у формі була згода на маркетинг, і задано обидва значення `META_CAPI_ACCESS_TOKEN` та `NEXT_PUBLIC_META_PIXEL_ID`. Інакше виклик тихо пропускається. Запит іде після відповіді користувачу, з тайм-аутом 4 секунди. Помилки пишуться в лог з тілом відповіді Meta і без персональних даних.

Версію Graph API (`v27.0`) перевірено запитом до `graph.facebook.com` 16 листопада 2026. Meta випускає нову версію кілька разів на рік. Константа `META_GRAPH_VERSION` у `lib/meta/capi.ts`.

## Тестовий режим

1. Events Manager → набір даних → **Test events** → скопіюй код (`TEST12345`). Він не секретний.
2. Додай у Vercel `META_TEST_EVENT_CODE`, зроби redeploy.
3. На вкладці Test events у полі «Test browser events» відкрий сайт, прийми cookies і відправ форму Contact.
4. Очікуване: дві події `Lead`, одна з позначкою **Browser**, друга **Server**, і позначка **Deduplicated** на одній із них.
5. **Видали `META_TEST_EVENT_CODE`** після перевірки. З кодом події не потрапляють у звичайну статистику.

## Як читати якість

- **Event Match Quality** (Events Manager → подія → колонка EMQ): оцінка від 1 до 10. Для `Lead` з email, IP, user agent, `fbp` і `fbc` варто очікувати 6 і вище. Нижче 5 означає, що бракує ідентифікаторів.
- **Дедуплікація** (подія → View details → Event deduplication): частка серверних подій, що мають пару з браузера з тим самим ключем. Тут пари не буде в тих, хто блокує піксель, і це нормально.
- **Event coverage**: відношення серверних подій до браузерних. Meta радить 75% і вище.

## Перевірка без згоди

Після Deny: у Network немає запитів до `connect.facebook.net` і `facebook.com/tr`, а в логах Vercel немає виклику Conversions API. Заявка при цьому зберігається.

## Токена немає в клієнті

`META_CAPI_ACCESS_TOKEN` читається лише в `lib/meta/capi.ts`, який імпортують тільки route handlers. Перевірка після збірки: `grep -r "META_CAPI_ACCESS_TOKEN" .next/static` не має знаходити нічого.
