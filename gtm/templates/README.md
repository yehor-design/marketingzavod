# Шаблони GTM

`cookiebot-cmp.tpl` — офіційний шаблон **Cookiebot CMP** з Community Template Gallery.

- Джерело: https://github.com/Usercentrics/gtm-templates-cookiebot-cmp (гілка `master`, коміт `a1fbab779ea80afd56d7cabb68f2a26dab5b7563`, файл `template.tpl`).
- Ліцензія: Apache 2.0.
- Зміни проти оригіналу: вилучено секцію `___VENDOR_DETAILS___` і мініатюру логотипа (разом близько 370 КБ base64-зображень). Код шаблона, параметри, дозволи й тести не змінено.

Шаблон вбудовується в `gtm/container.json` скриптом `gtm/build-container.mjs`. Через це після імпорту він з'являється в GTM як звичайний користувацький шаблон, без прив'язки до галереї, і не оновлюється автоматично. Як замінити його на версію з галереї, описано в `gtm/README.md`.
