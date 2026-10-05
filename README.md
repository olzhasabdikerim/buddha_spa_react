# BuddhaSpa — React сайт

Мультиязычный SPA-сайт (RU / KK / EN) для сети премиальных спа-салонов в Казахстане.

## Ссылки

| | |
|---|---|
| **Сайт** | https://buddhaspareact.vercel.app |
| **Домен (в процессе)** | buddhaspa.kz |
| **Репозиторий** | https://github.com/olzhasabdikerim/buddha_spa_react |
| **Админ-панель** | https://buddhaspareact.vercel.app/admin |

> ⚠️ **app.buddhaspa.kz не трогать** — отдельный сайт на Tilda. Все изменения только через `buddhaspareact.vercel.app`.

---

## Основные возможности

- 8 страниц филиалов с динамическими данными из Supabase (услуги, мастера, фото, контакты)
- Лендинг франшизы с визуальным редактором — каждый текст кликабелен в режиме правки
- Три языка: Русский / Қазақша / English с переключателем и localStorage
- Форма заявки → Telegram через serverless API (Vercel Functions)
- Виртуальные туры 360° через Kuula iFrame
- Визуальный редактор сайта в /admin через postMessage + iframe
- Управление услугами, ценами и мастерами через табличный интерфейс
- SEO: JSON-LD, Open Graph, sitemap.xml, robots.txt

---

## Стек

| Слой | Технология | Версия | Роль |
|---|---|---|---|
| UI | React | 18.3 | Компоненты, контекст, хуки |
| Бандлер | Vite | 5.4 | Dev-сервер, сборка |
| Роутинг | React Router DOM | 7.18 | SPA-навигация |
| БД / Auth | Supabase | 2.116 | PostgreSQL, RLS, anon key |
| Деплой | Vercel | — | Хостинг, Serverless Functions |
| API | Vercel Functions | — | `/api/lead` → Telegram Bot |
| Шрифты | Manrope + Cormorant | — | Google Fonts |

---

## Быстрый старт

```bash
git clone https://github.com/olzhasabdikerim/buddha_spa_react.git
cd buddha_spa_react
npm install
cp .env.example .env.local   # заполнить переменные
npm run dev                  # → localhost:5173
```

### Деплой на Vercel

```bash
vercel        # первый раз (связать проект)
vercel --prod # деплой в продакшн
```

---

## Переменные окружения (`.env.local`)

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Telegram бот для заявок
TELEGRAM_BOT_TOKEN=7123456789:AAF...
TELEGRAM_CHAT_ID=-1001234567890
```

| Переменная | Где взять | Обязательна |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL | Да |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key | Да |
| `TELEGRAM_BOT_TOKEN` | @BotFather в Telegram | Да (для форм) |
| `TELEGRAM_CHAT_ID` | ID вашего чата/группы | Да (для форм) |

`VITE_*` — клиентские (доступны в браузере). `TELEGRAM_*` — только серверные (Vercel Functions), клиенту не передаются.

---

## Структура проекта

```
buddha_spa_react/
├── api/
│   ├── lead.js             # POST /api/lead → Telegram
│   └── master.js
├── public/
│   └── images/             # Статичные фото филиалов, франшизы
├── src/
│   ├── admin/              # Панель управления /admin
│   │   ├── AdminApp.jsx    # Корневой компонент, сайдбар, таблица
│   │   ├── SiteEditorTab.jsx  # Iframe-редактор с postMessage
│   │   ├── ServicesTab.jsx
│   │   ├── MastersTab.jsx
│   │   └── BranchTab.jsx
│   ├── components/
│   │   ├── EditableText.jsx      # Визуальный редактор текстов (EditorModal)
│   │   ├── EditableServiceField.jsx
│   │   ├── Franchise.jsx         # Лендинг франшизы (полностью редактируемый)
│   │   ├── BranchDetail.jsx
│   │   └── ServiceDetailModal.jsx
│   ├── contexts/
│   │   ├── ContentContext.jsx    # Глобальный контент из Supabase + update()
│   │   └── EditModeContext.jsx   # isEditMode, postMessage listener
│   ├── lib/
│   │   ├── supabase.js           # Supabase client
│   │   └── content.js            # fetchContent() / upsertContent()
│   ├── data/                     # Статичные данные (резерв без БД)
│   ├── pages/
│   └── i18n.jsx                  # useT(), useLang(), LANGS
├── supabase-schema.sql            # Схема БД — запустить в Supabase SQL Editor
└── vite.config.js
```

---

## База данных (Supabase)

### Таблицы

| Таблица | Назначение | Ключевые поля |
|---|---|---|
| `branches` | Филиалы сети | `slug`, `city`, `name`, `phone`, `hours`, `gallery[]`, `vr_tour` |
| `services` | Услуги и цены | `branch_id`, `category`, `name`, `price`, `duration`, `description` |
| `masters` | Мастера | `branch_id`, `name`, `photo` |
| `content` | Тексты сайта | `key TEXT PRIMARY KEY`, `value TEXT` |

### RLS политики

- Все таблицы: **публичное чтение** (SELECT без авторизации)
- `content`: полная запись через anon key (INSERT, UPDATE, DELETE)
- `services`: UPDATE через anon key (изменение цен и описаний)

### Первоначальная настройка

1. Открыть [supabase.com](https://supabase.com) → ваш проект → **SQL Editor**
2. Скопировать содержимое `supabase-schema.sql` и нажать **Run**
3. Убедиться что вывод: *"Success. No rows returned"*
4. Заполнить `branches` через Table Editor или через seed-скрипт:
   ```bash
   node seed.mjs
   ```

> `supabase-schema.sql` безопасно запускать повторно — используются `CREATE TABLE IF NOT EXISTS` и `ADD COLUMN IF NOT EXISTS`.

---

## Админ-панель

Открыть `/admin` → войти через Supabase Auth.

Добавить нового администратора: **Supabase → Authentication → Users → Invite**.

### Вкладки

| Вкладка | Что делает |
|---|---|
| 🌐 Редактор сайта | Iframe с реальным сайтом. Кнопка **✏️ Редактирование** включает режим правки через postMessage — все тексты подсвечиваются золотой рамкой и становятся кликабельными |
| 💆 Услуги и цены | Таблица услуг выбранного филиала. Редактирование названия, цены, категории, описания прямо в строке |
| 👤 Мастера | Список мастеров филиала с фотографией и именем. Добавление, редактирование, удаление |
| 🏢 Информация | Контактные данные филиала: адрес, телефон, WhatsApp, часы работы, ссылка на 2GIS |

### Визуальный редактор — как пользоваться

1. Перейти на вкладку **Редактор сайта**
2. Выбрать нужную страницу из панели кнопок (Главная, Нурсат, Франшиза…)
3. Нажать **✏️ Редактирование** — сайт в iframe переключается в режим правки
4. Кликнуть на любой текст с золотой пунктирной рамкой — откроется модальное окно
5. Ввести текст на нужных языках (RU / KK / EN) и нажать **Сохранить**
6. Изменение мгновенно отображается на сайте (оптимистичное обновление)

**Числа и цены** (на странице франшизы) — одно поле без языковых вкладок.  
**Карточки кейсов и этапов** — редактируются через иконку 🖊️ в правом углу карточки.  
**Состав услуги** — кнопка «Редактировать состав» в модале услуги открывает трёхязычный редактор.

### Добавление новых элементов (кнопка +)

На странице франшизы в режиме редактирования доступны кнопки "+" для добавления:

- Нового формата партнёрства (карточка с названием, описанием, тремя полями)
- Нового этапа запуска (заголовок, описание, чипы УК/Партнёр)
- Нового партнёра/кейса (имя, город, цитата)

Дополнительные элементы хранятся в таблице `content` как JSON:
- `fr.formats.extra` — дополнительные форматы
- `fr.steps.extra` — дополнительные этапы
- `fr.cases.extra` — дополнительные кейсы

### Редактирование услуг через «Подробнее»

При включённом режиме редактирования модальное окно услуги показывает:

- Редактирование названия услуги (таблица `services.name`)
- Редактирование цены для каждого варианта (таблица `services.price`)
- Кнопку «Редактировать состав» — трёхязычный редактор (RU сохраняется в `services.description`, KK/EN — в таблицу `content`)

---

## Система контента

Все редактируемые тексты хранятся в таблице `content` в формате `ключ → значение`. При загрузке `ContentContext` загружает все строки и раздаёт их компонентам через хук `useContent(key, fallback)`.

### Оптимистичное обновление

```js
// ContentContext.jsx
const update = async (key, value) => {
  // 1. Мгновенно показать в UI
  setContent(prev => ({ ...prev, [key]: value }))
  // 2. Сохранить в Supabase
  const ok = await upsertContent(key, value)
  // 3. Откатить если ошибка
  if (!ok) fetchContent().then(setContent)
}
```

### Ключи контента

| Префикс | Секция | Пример ключа |
|---|---|---|
| `fr.*` | Франшиза — все секции | `fr.hero.title` |
| `fr.num.N.*` | Числа-показатели (0–3) | `fr.num.0.val`, `fr.num.0.lbl` |
| `fr.format.N.*` | Форматы партнёрства | `fr.format.1.name`, `fr.format.1.g1.val` |
| `fr.manage.NN.*` | Секция управления (01–05) | `fr.manage.01.title`, `fr.manage.01.li.0` |
| `fr.step.NN.*` | Этапы запуска (01–05) | `fr.step.01.title`, `fr.step.01.chips` |
| `fr.case.N.*` | Кейсы партнёров | `fr.case.0.name`, `fr.case.0.quote` |
| `fr.founder.*` | Блок основательницы | `fr.founder.role`, `fr.founder.bio` |
| `section.*` | Страницы филиалов | `section.memberships.title` |
| `tier.*` | Абонементы | `tier.silver.price`, `tier.gold.item.0` |
| `svc.desc.{id}` | RU описание услуги | `svc.desc.42` |
| `svc.desc.{id}.kk` | KK описание услуги | `svc.desc.42.kk` |
| `svc.desc.{id}.en` | EN описание услуги | `svc.desc.42.en` |
| `benefit.N.label` | Преимущества гостей | `benefit.0.label` |

### Мультиязычность

| Язык | Ключ в БД | Приоритет |
|---|---|---|
| Русский (RU) | `fr.hero.title` | Базовый (всегда) |
| Қазақша (KK) | `fr.hero.title.kk` | Если есть → KK, иначе RU |
| English (EN) | `fr.hero.title.en` | Если есть → EN, иначе RU |

Поля с `translate={false}` (цифры, цены) имеют только базовый ключ без суффиксов.

---

## Деплой

```bash
vercel --prod
```

Vercel автоматически деплоит при push в `main`. Добавить все переменные в **Vercel → Project → Settings → Environment Variables**.

`VITE_*` — для всех окружений (Production, Preview, Development).  
`TELEGRAM_*` — только для Production.

