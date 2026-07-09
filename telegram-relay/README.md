# Telegram lead relay

Маленький Cloudflare Worker, который принимает POST от формы лендинга и
пересылает заявку в Telegram-канал/группу.

## 1. Бот и канал (в Telegram)

1. Напишите [@BotFather](https://t.me/BotFather) → `/newbot` → сохраните токен.
2. Создайте приватную группу или канал, добавьте туда себя и партнёра.
3. Добавьте бота в эту группу/канал (в канале — как администратора).
4. Отправьте в группу/канал любое сообщение.
5. Узнайте `chat_id`: откройте в браузере
   `https://api.telegram.org/bot<TOKEN>/getUpdates` и найдите `"chat":{"id":...}`
   (для канала id обычно отрицательный, например `-1001234567890`).

## 2. Деплой воркера

Понадобится бесплатный аккаунт Cloudflare.

```bash
cd telegram-relay
npx wrangler login          # откроет браузер, авторизация в Cloudflare
npx wrangler secret put TELEGRAM_BOT_TOKEN     # вставить токен из BotFather
npx wrangler secret put TELEGRAM_CHAT_ID       # вставить chat_id из шага выше
npx wrangler deploy
```

После деплоя wrangler выведет URL вида:
`https://slot-lead-relay.<ваш-сабдоменn>.workers.dev`

Опционально в `wrangler.toml` можно сузить `ALLOWED_ORIGIN` до конкретного
домена лендинга (например `https://username.github.io`) вместо `*`.

## 3. Подключить к лендингу

В `index.html` найти константу `LEAD_ENDPOINT` (в скрипте внизу страницы) и
заменить на URL воркера из шага 2.

## 4. Проверка

Отправить тестовую заявку через форму на сайте и убедиться, что сообщение
пришло в Telegram-группу.
