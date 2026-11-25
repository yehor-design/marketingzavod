# Resend: поштовий домен і транзакційна відправка

Resend відповідає за відправку транзакційних листів від імені `marketingzavod.com` через серверний клієнт `lib/email/resend.ts` (без стороннього SDK, через HTTPS API `api.resend.com`). Поточні форми Jet (`contact`, `waitlist`, `careers_apply`) лишаються на HubSpot без автоматичних розсилок відвідувачам до запуску відповідних форм і оновлення політики приватності (`ZAV-133`, `ZAV-135`).

## Що налаштовано (25.11.2026)

- [x] Домен `marketingzavod.com` додано в Resend (регіон ЄС, `eu-west-1`).
- [x] У Vercel DNS прописані та публічно роздаються записи поштової автентифікації:
  - `TXT` `resend._domainkey` — публічний ключ DKIM;
  - `CNAME` `send` → `send.forge.rmta.net.` — зворотні звіти (MX) та SPF;
  - `CNAME` `rsend` → `rsend-euw1.forge.rmta.net.` — відправка з регіону ЄС;
  - `TXT` `_dmarc` → `v=DMARC1; p=none;` — політика DMARC.
- [x] У Vercel (Production, тип Sensitive) додано `RESEND_API_KEY`.

## Як це працює в коді

- `lib/email/resend.ts`:
  - `resendConfigured()` — перевіряє наявність `RESEND_API_KEY`.
  - `sendResendEmail()` — відправляє лист (`from` типово `Marketing Zavod <noreply@marketingzavod.com>`, підтримує `replyTo`, заголовки `List-Unsubscribe`, вкладення PDF і `Idempotency-Key`). Помилки логуються через `serverLog` лише за кодом статусу та типом помилки, без адрес одержувачів, тем і текстів листів.
  - `verifyResendDomain()` — перевіряє статус домену в Resend і за потреби запускає `POST /domains/{id}/verify`.
- `app/api/email/verify/route.ts`:
  - Сервісний маршрут `POST /api/email/verify` для наскрізної перевірки домену та відправки тестового листа в production.
  - Поки `EMAIL_VERIFY_SECRET` не задано — повертає `503`. Зі змінним секретом вимагає `Authorization: Bearer <EMAIL_VERIFY_SECRET>` і відправляє тестовий лист виключно на власну скриньку проєкту (`RESEND_VERIFY_TO` або `zavodzamarketing@gmail.com`), тому не може бути використаний для сторонньої розсилки.

## Безпека

`RESEND_API_KEY` та `EMAIL_VERIFY_SECRET` читаються виключно на сервері і не потрапляють у клієнтський бандл.
