# Контейнер Google Tag Manager

`container.json` — файл імпорту веб-контейнера GTM. У ньому всі теги сайту: Cookiebot, GA4, Clarity, Google Ads, Meta Pixel, LinkedIn.

Файл генерується. Не редагуй його руками.

| Файл | Призначення |
| --- | --- |
| `events.json` | Список подій, параметрів і ключів ідентифікаторів |
| `build-container.mjs` | Генератор. Тут описані теги, тригери, змінні і налаштування згоди |
| `templates/cookiebot-cmp.tpl` | Офіційний шаблон Cookiebot CMP |
| `container.json` | Результат. Саме його імпортують у GTM |

Щоб змінити контейнер: відредагуй `events.json` або `build-container.mjs`, запусти `npm run gtm:build`, закоміть і зроби новий імпорт. CI перевіряє, що `container.json` відповідає генератору.

## Важливе застереження

Файл зібрано за форматом експорту GTM, але імпорт у справжній контейнер не перевірявся: в агента немає доступу до GTM. Перший імпорт варто зробити уважно і переглянути прев'ю змін перед підтвердженням. Якщо GTM відхилить файл, найімовірніша причина — вбудований шаблон Cookiebot або службові поля тегів Google. Порядок дій на цей випадок описано в розділі «Якщо імпорт не вдався».

## Як імпортувати

1. GTM → **Admin** → **Import Container**.
2. Обери `gtm/container.json`.
3. Workspace: **Existing** → `Default Workspace` (або новий, якщо хочеш переглянути зміни окремо).
4. Режим: **Merge** → **Overwrite conflicting tags, triggers, and variables**.
5. Перевір прев'ю: має бути 32 теги, 26 тригерів, 35 змінних і 1 шаблон. Натисни **Confirm**.

Ідентифікатори сервісів у контейнер вписувати не треба. Сайт передає їх у `dataLayer` зі змінних середовища Vercel, а контейнер читає їх змінними `ID - …`. Тег із порожнім ідентифікатором не спрацьовує: його тримає тригер-виняток `Block - … missing`.

## Як перевірити в Preview

1. Додай у Vercel `NEXT_PUBLIC_GTM_ID` і `NEXT_PUBLIC_COOKIEBOT_ID`, зроби redeploy.
2. GTM → **Preview**, введи `https://www.heywowboy.com`.
3. У Tag Assistant перевір по порядку:
   - на події **Consent Initialization** спрацював лише тег `Cookiebot CMP`, вкладка Consent показує `denied` для `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`;
   - далі йде `Initialization` (Google tag, Conversion Linker), потім один `page_view`;
   - при переході на іншу сторінку з'являється рівно один новий `page_view`;
   - після «Allow all» у банері з'являється `cookie_consent_update`, стан згоди стає `granted`, спрацьовують Clarity і Meta.
4. Вкладка **Variables** на будь-якій події: змінні `ID - …` мають значення з Vercel.

## Як опублікувати

**Submit** → назва версії (наприклад `MAR-20: initial tracking`) → **Publish**. Після кожного нового імпорту потрібна нова публікація.

## Налаштування згоди в тегах

- **Теги Google (GA4, Google Ads)** мають вбудовані перевірки згоди. Додаткова вимога згоди для них не задана свідомо: без згоди вони мають надсилати запити без cookies (`gcs=G100`), інакше не працює моделювання Consent Mode.
- **Clarity** вимагає `analytics_storage` і без нього не вантажиться взагалі.
- **Meta Pixel і LinkedIn** вимагають `ad_storage` і без нього не вантажаться взагалі.
- **Жоден тег, крім Cookiebot, не працює, доки не задано `NEXT_PUBLIC_COOKIEBOT_ID`.** Без банера згода не може бути отримана, тож усе вимкнено.
- Стан згоди за замовчуванням `denied` заданий глобально, без переліку регіонів. Це покриває ЄЕЗ, Велику Британію і Швейцарію та будь-яку іншу країну.
- Автоматичне блокування cookies (auto-blocking) вимкнене: шаблон вантажить `uc.js` без `data-blockingmode`.

## Перегляди сторінок

Google tag має `send_page_view = false`. Сайт сам кладе в `dataLayer` один `page_view` на маршрут, а тег `GA4 - page_view` пересилає його. У GA4 треба вимкнути Enhanced Measurement → **Page changes based on browser history events**, інакше перегляди подвояться (див. `docs/ga4-setup.md`).

## Шаблон Cookiebot

Шаблон вбудовано у файл, тому в GTM він з'явиться як звичайний користувацький шаблон без оновлень із галереї. Щоб перейти на версію з галереї: **Templates** → **Search Gallery** → `Cookiebot CMP` → **Add to workspace**, потім у тезі `Cookiebot CMP` зміни тип на шаблон із галереї і перенеси ті самі налаштування. Після цього власний експорт контейнера (Admin → Export Container) можна покласти в `gtm/` як нову основу.

## Якщо імпорт не вдався

1. Запиши текст помилки GTM.
2. Додай шаблон Cookiebot CMP з галереї вручну і створи тег `Cookiebot CMP` на тригері **Consent Initialization - All Pages** з Cookiebot ID `{{ID - cookiebot_id}}`.
3. Експортуй контейнер (Admin → Export Container) і передай файл агенту разом із текстом помилки. Він використає справжній експорт як основу для генератора.
