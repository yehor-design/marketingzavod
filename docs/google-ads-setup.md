# Google Ads: конверсії і Enhanced Conversions

Задача лише про вимірювання. Кампанії не створюються і не запускаються.

## 1. Акаунт

- [ ] Створи акаунт в **експертному режимі** («Switch to Expert Mode»), на кроці кампанії обери «Create an account without a campaign». Платіжні дані вводиш лише ти.
- [ ] Часовий пояс і валюту задай одразу: змінити їх потім не можна.
- [ ] Tools → Setup → скопіюй ID тега (`AW-…`) у Vercel як `NEXT_PUBLIC_GOOGLE_ADS_ID`.

## 2. Дії-конверсії

Goals → Conversions → Summary → New conversion action → Website → **Add a conversion action manually**.

| Назва | Категорія | Цінність | Підрахунок | Вікно кліку | Вікно перегляду | Тип | Змінна з міткою |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Contact lead | Submit lead form | Однакова, 50 EUR | One | 90 днів | 1 день | Primary | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT` |
| Waitlist signup | Sign-up | Однакова, 10 EUR | One | 30 днів | 1 день | Primary | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_WAITLIST` |
| Begin checkout | Begin checkout | З події (`value`, USD) | One | 30 днів | 1 день | Secondary | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CHECKOUT` |
| Contact click | Contact | Без цінності | One | 30 днів | 1 день | Secondary | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT_CLICK` |

Цінності 50 і 10 EUR є стартовим припущенням. Заміни їх, коли знатимеш реальну цінність ліда.

Після створення кожної дії обери «Use Google Tag Manager» і скопіюй **Conversion label**. Мітки не секретні. Поклади їх у Vercel у відповідні змінні і зроби redeploy.

Офлайн-дії типу «імпорт» описані в `offline-conversions.md`.

## 3. Enhanced Conversions for Leads

- [ ] Goals → Settings → **Enhanced conversions for leads** → увімкни, метод **Google Tag Manager**.
- [ ] Прийми **Customer data terms**.
- [ ] У кожній дії-ліді (Contact lead, Waitlist signup) перевір, що Enhanced conversions увімкнено.

Як це працює на сайті: після успішної заявки email потрапляє в `dataLayer` разом із подією `generate_lead`, тег читає його змінною `User-Provided Data - lead form`, і сайт одразу видаляє його з `dataLayer`. Це відбувається лише за згоди на маркетинг (`ad_user_data`). Без згоди або без завантаженого контейнера адреса в `dataLayer` не потрапляє взагалі. Хешування робить сам тег Google.

## 4. Інші налаштування

- [ ] Admin → Account settings → **Auto-tagging** увімкнено (додає `gclid` до посилань).
- [ ] Tools → Data manager → зв'яжи **Google Analytics (GA4)**.
- [ ] Імпортуй оновлений контейнер GTM і опублікуй версію.

## Як влаштовані теги

- `Google Ads - Conversion Linker` на всіх сторінках.
- Чотири теги `Google Ads - Conversion - …`. **Transaction ID = `event_id`** заявки, тому повторне спрацювання з тим самим ID не дає другої конверсії.
- `Google Ads - Remarketing` на кожен `page_view`.
- Теги Google Ads мають явну вимогу згоди `ad_storage` (Basic Consent Mode). Без згоди на маркетинг вони не спрацьовують, а без жодної згоди GTM не вантажиться зовсім. Моделювання конверсій для тих, хто відмовився, немає.

## Перевірка

1. GTM Preview → відправ тестову заявку з Contact. Тег `Google Ads - Conversion - Contact lead` спрацював, у деталях `transaction_id` дорівнює `event_id` з `dataLayer`.
2. У запиті до `googleadservices.com/pagead/conversion` за згоди є параметр `em` (хешований email). Після Deny параметра немає.
3. Онови сторінку успіху або відправ ту саму подію вдруге з тим самим `event_id`: у звіті одна конверсія.

## Перед першим запуском кампанії

- [ ] Goals → Conversions → Summary: статус дій змінився з «Inactive» / «Unverified» на **«Recording conversions»** або «No recent conversions». Після першої тестової конверсії це зазвичай займає від кількох годин до доби.
- [ ] Goals → Conversions → Diagnostics: для Enhanced conversions немає помилок, покриття даних вище нуля. Діагностика EC оновлюється до 48 годин.
- [ ] Tag Assistant показує стан згоди: `ad_storage`, `ad_user_data`, `ad_personalization` змінюються на `granted` після згоди.
- [ ] Primary-цілі лише дві: Contact lead і Waitlist signup. Решта Secondary, щоб не спотворювати ставки.
- [ ] Заявки зберігаються в CRM з `gclid` (перевір тестовий контакт).
- [ ] Пройдено `launch-checklist.md`.
