# Контейнер Google Tag Manager

`container.json` — файл імпорту веб-контейнера GTM. У ньому всі теги сайту: GA4, Clarity, Google Ads, Meta Pixel, LinkedIn.

Файл генерується. Не редагуй його руками.

| Файл | Призначення |
| --- | --- |
| `events.json` | Список подій, параметрів і ключів ідентифікаторів |
| `build-container.mjs` | Генератор. Тут описані теги, тригери, змінні і налаштування згоди |
| `container.json` | Результат. Саме його імпортують у GTM |

Щоб змінити контейнер: відредагуй `events.json` або `build-container.mjs`, запусти `npm run gtm:build`, закоміть і зроби новий імпорт. CI перевіряє, що `container.json` відповідає генератору.

## Важливе застереження

Файл зібрано за форматом експорту GTM, але імпорт у справжній контейнер не перевірявся: в агента немає доступу до GTM. Перший імпорт варто зробити уважно і переглянути прев'ю змін перед підтвердженням. Якщо GTM відхилить файл, найімовірніша причина — службові поля тегів Google. Порядок дій на цей випадок описано в розділі «Якщо імпорт не вдався».

## Як імпортувати

1. GTM → **Admin** → **Import Container**.
2. Обери `gtm/container.json`.
3. Workspace: **Existing** → `Default Workspace` (або новий, якщо хочеш переглянути зміни окремо).
4. Режим: **Merge** → **Overwrite conflicting tags, triggers, and variables**.
5. Перевір прев'ю: має бути 31 тег, 26 тригерів і 37 змінних. Натисни **Confirm**.

Ідентифікатори сервісів у контейнер вписувати не треба. Сайт передає їх у `dataLayer` зі змінних середовища Vercel, а контейнер читає їх змінними `ID - …`. Тег із порожнім ідентифікатором не спрацьовує: його тримає тригер-виняток `Block - … missing`.

## Як перевірити в Preview

1. Додай у Vercel `NEXT_PUBLIC_GTM_ID`, зроби redeploy.
2. GTM → **Preview**, введи `https://www.heywowboy.com`. Без згоди сайт GTM не вантажить, тож у вікні Preview спершу натисни в банері «Accept all».
3. У Tag Assistant перевір по порядку:
   - на події **Consent Initialization** не спрацював жоден тег, вкладка Consent показує стан, який ти вибрав у банері (після «Accept all» — `granted` для `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`);
   - далі йде `Initialization` (Google tag, Conversion Linker), потім один `page_view`;
   - при переході на іншу сторінку з'являється рівно один новий `page_view`;
   - якщо змінити вибір через «Cookie settings» без перезавантаження (розширити згоду), з'являється `consent_update`, і стан оновлюється.
4. Вкладка **Variables** на будь-якій події: змінні `ID - …` мають значення з Vercel.

## Як опублікувати

**Submit** → назва версії (наприклад `MAR-20: initial tracking`) → **Publish**. Після кожного нового імпорту потрібна нова публікація.

## Налаштування згоди в тегах

- **Теги Google (GA4, Google Ads)** мають явну вимогу згоди, як і решта: GA4 — `analytics_storage`, Google Ads — `ad_storage` (Basic Consent Mode). Сам контейнер сайт вантажить лише після згоди на статистику або маркетинг, тож запитів без cookies (`gcs=G100`) немає. Так вирішено у специфікації банера згоди.
- **Clarity** вимагає `analytics_storage` і без нього не вантажиться взагалі.
- **Meta Pixel і LinkedIn** вимагають `ad_storage` і без нього не вантажаться взагалі.
- **Запобіжник `consent_ready`.** Сайт передає `consent_ready` = значення константи `CONSENT_TOOL_READY` у `lib/consent`. Поки вона `false`, тригер-виняток `Block - Consent tool missing` тримає всі теги. Коли банер увімкнено на production, вона `true`, і теги працюють за згодою.
- Тега згоди в контейнері немає. Стан згоди за замовчуванням `denied` задає сам сайт у `components/tracking/gtm.tsx` до старту GTM, глобально, без переліку регіонів. Це покриває ЄЕЗ, Велику Британію і Швейцарію та будь-яку іншу країну.
- Оновлення згоди має надсилати власний засіб: `gtag('consent', 'update', …)` і подія `consent_update` з `consent_statistics` та `consent_marketing`. Деталі — у `docs/analytics.md`, розділ «Згода».

## Перегляди сторінок

Google tag має `send_page_view = false`. Сайт сам кладе в `dataLayer` один `page_view` на маршрут, а тег `GA4 - page_view` пересилає його. У GA4 треба вимкнути Enhanced Measurement → **Page changes based on browser history events**, інакше перегляди подвояться (див. `docs/ga4-setup.md`).

## Якщо імпорт не вдався

1. Запиши текст помилки GTM.
2. Експортуй контейнер (Admin → Export Container) і передай файл агенту разом із текстом помилки. Він використає справжній експорт як основу для генератора.
