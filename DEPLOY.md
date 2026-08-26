# Buddha Spa — заявки (Bitrix24 + Telegram) и деплой на Vercel

Форма заявки открывается в модалке по кнопке **«Подробнее»** на карточках услуг
(и по кнопке **«Записаться»**). Отправка идёт на serverless-функцию
[`api/lead.js`](api/lead.js), которая:

1. Создаёт **один общий лид** в Bitrix24 (метод `crm.lead.add`), с названием
   филиала в заголовке и комментарии.
2. Отправляет уведомление в **Telegram-чат конкретного филиала**
   (маршрутизация по `slug` филиала).

Токены хранятся только в переменных окружения на бэкенде — во фронтенде их нет.

## 1. Переменные окружения

Список — в [`.env.example`](.env.example). В Vercel их задают в
**Project → Settings → Environment Variables** (Production и Preview).

| Переменная | Что это |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен бота от @BotFather |
| `TELEGRAM_CHAT_ID` | Общий chat_id (резерв, если у филиала нет своего) |
| `TELEGRAM_<ФИЛИАЛ>_CHAT_ID` | Необязательный chat_id конкретного филиала |
| `BITRIX_WEBHOOK` | База входящего вебхука Bitrix24, оканчивается на `/` |

Per-branch переменные (все необязательные — при отсутствии берётся
`TELEGRAM_CHAT_ID`): `TELEGRAM_NURSAT_CHAT_ID`, `TELEGRAM_TAUKE_HANA_CHAT_ID`,
`TELEGRAM_ASTANA_CHAT_ID` (Астана · Туран), `TELEGRAM_TARAZ_CHAT_ID`,
`TELEGRAM_AKTOBE_CHAT_ID`, `TELEGRAM_TULPAR_CHAT_ID`, `TELEGRAM_KUNAEVA_CHAT_ID`,
`TELEGRAM_FRANCHISE_CHAT_ID`.

## 2. Telegram — бот и chat_id

1. **Где вставлять Bot Token:** создать бота у **@BotFather**
   (`/newbot` → имя → username) → он выдаст токен вида `1234567890:AA...`.
   Вставить его в `TELEGRAM_BOT_TOKEN` (только в Vercel env, нигде во фронте).
2. **Как добавить бота в группу:** создать группу/канал для заявок и добавить
   туда бота. В группу — обычным участником; в канал — **администратором**.
3. **Какие права дать боту:** достаточно права **отправлять сообщения**
   (Post Messages для канала). Приватность в @BotFather можно оставить как есть —
   боту не нужно читать чужие сообщения, он только пишет.
4. **Как узнать Chat ID:** добавить в группу **@getmyid_bot** или **@RawDataBot** —
   он покажет `id` (у групп/каналов начинается с `-100...`). Вставить в
   `TELEGRAM_CHAT_ID` (общий) и/или в per-branch `TELEGRAM_<ФИЛИАЛ>_CHAT_ID`.
5. **Как протестировать:** после деплоя вызвать `POST /api/test/telegram` —
   в чат придёт `✅ Buddha Spa Telegram integration works`.
   Проверить конкретный филиал: `POST /api/test/telegram?branch=taraz`.

   ```bash
   curl -X POST https://ВАШ-ДОМЕН/api/test/telegram
   ```

## 3. Bitrix24 — входящий вебхук

1. Bitrix24 → **Разработчикам** → **Другое** → **Входящий вебхук**.
2. Права: **CRM (crm)**. Сохранить.
3. Скопировать URL вида `https://ВАШ-ПОРТАЛ.bitrix24.kz/rest/1/КОД/` в `BITRIX_WEBHOOK`.

## 4. Деплой на Vercel

```bash
npm i -g vercel   # один раз
vercel            # preview-деплой
vercel --prod     # прод
```

Или через дашборд Vercel: подключить репозиторий, фреймворк определится как
**Vite** автоматически. Папка `api/` разворачивается в serverless-функции,
файл [`vercel.json`](vercel.json) настраивает SPA-роутинг.

## 5. Проверка

После деплоя оставьте тестовую заявку на странице любого филиала → должно
прийти сообщение в Telegram нужного филиала и появиться лид в Bitrix24.
Если один из каналов недоступен, заявка всё равно уходит во второй, а
пользователь видит «Заявка принята».

### Локальная проверка функции

`vite dev` не запускает `/api`. Чтобы проверить функцию локально, используйте
`vercel dev` (поднимает и фронт, и serverless вместе).
