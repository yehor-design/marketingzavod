# Cloudflare Zaraz

Заміна GTM за специфікацією «Перехід на Cloudflare Zaraz» (Linear, P-MAR-3). Сайт обирає менеджер тегів змінною `NEXT_PUBLIC_TAG_MANAGER`: `gtm` (за замовчуванням) або `zaraz`. Повернутися до GTM — змінити змінну і зробити redeploy.

## Як це працює

- Сайт не проксіюється через Cloudflare. Zaraz віддає проксійований піддомен `NEXT_PUBLIC_ZARAZ_HOST` (`z.heywowboy.com`, запис AAAA `100::`, Proxied).
- До згоди скрипт `https://z.heywowboy.com/cdn-cgi/zaraz/i.js` не вантажиться. Після згоди на Statistics або Marketing його додає `lib/tracking/zaraz.ts`. Події сторінки чекають у черзі, доки Zaraz не отримає Consent Mode default і мети згоди (`zaraz.consent.set({ statistics, marketing })`).
- `track()` викликає `zaraz.track(назва, параметри)` замість `dataLayer.push`. Назви й параметри ті самі, що в `docs/tracking-plan.md`.
- Сервери Cloudflare шлють події в GA4. У браузері немає ні gtag, ні fbq.
- **Meta йде не через Zaraz.** Його Conversions API потребує токена, а токен зберігається лише у Vercel. Тому браузер шле стандартні події Meta (`PageView`, `ViewContent`, `Contact`, `InitiateCheckout`) на власний `/api/meta/event`, а сервер передає їх у Conversions API з тим самим `event_id`, IP, user agent і cookie `_fbp`/`_fbc` у форматі пікселя. `Lead` і `CompleteRegistration` шле `/api/lead`, як і раніше. Усе це працює лише за згоди на маркетинг: сервер перевіряє cookie `wb_consent`. Код: `lib/tracking/meta-relay.ts`, `app/api/meta/event/route.ts`, `lib/meta/relay.ts`.

## Файли

| Файл | Що в ньому |
| --- | --- |
| `build-config.mjs` | Будує `config.json` з плану подій `gtm/events.json`. Один тригер на подію, дії GA4 і Meta такі самі, як теги контейнера GTM |
| `config.json` | Згенерований конфіг. Не редагуй руками: `npm run zaraz:build` |
| `ids.json` | Публічні ID: GA4. Google Ads і LinkedIn додаються, коли з'являться акаунти |
| `publish.mjs` | Публікація і перевірка синхронізації через API Cloudflare |

`tests/unit/zaraz-config.test.ts` перевіряє, що `config.json` збігається з білдером, кожна подія має тригер, кожен інструмент прив'язаний до мети згоди, події Meta (ретранслятор і `/api/lead`) ті самі, що в GTM, і в конфігу немає секретів. `tests/unit/meta-relay.test.ts` перевіряє ретранслятор Meta.

## Публікація

Конфіг можна опублікувати двома способами: через панель Cloudflare (Zaraz → інструменти, тригери, налаштування за `config.json`) або скриптом з API-токеном Cloudflare (право **Zaraz Admin** на зоні `heywowboy.com`) і ID зони.

```bash
CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ZONE_ID=… npm run zaraz:check
CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ZONE_ID=… npm run zaraz:publish
```

- `zaraz:check` порівнює опублікований конфіг з `config.json` і завершується з помилкою, якщо вони розійшлися.
- `zaraz:publish` записує конфіг і публікує його. Секретів конфіг не містить.

## Налаштування в Zaraz, яких немає в API

- **Automatic Pageview Tracking: вимкнено.** Перегляди сторінок шле сайт подією `page_view`.
- **Google Consent Mode v2:** сайт сам задає `google_consent_default` і `google_consent_update`. Окрема галочка в налаштуваннях Zaraz не потрібна.

## Перевірка після перемикання

1. Без згоди: жодного запиту до `z.heywowboy.com`.
2. «Accept all»: `i.js` і події GA4 йдуть на `z.heywowboy.com`, події Meta — на `/api/meta/event`. Прямих запитів до `google-analytics.com` чи `facebook.com` немає.
3. GA4 Realtime і DebugView показують `page_view` та інші події один раз, без дублів.
4. Meta Events Manager → Test events (з `META_TEST_EVENT_CODE`): `PageView`, `ViewContent`, `Contact` від `/api/meta/event` і `Lead` від `/api/lead`, кожна подія один раз.
5. `npm run zaraz:check` проходить.
