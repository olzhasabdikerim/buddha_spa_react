-- BuddhaSpa: схема БД
-- Вставить в Supabase → SQL Editor → Run

-- Филиалы
create table if not exists branches (
  id          serial primary key,
  slug        text unique not null,
  city        text not null,
  name        text not null,
  premium     boolean default false,
  address     text,
  full_address text,
  phone       text,
  whatsapp    text,
  hours       text,
  hero        text,
  vr_tour     text,
  gis         text,
  about_text  text,
  gallery     text[],
  coming_soon boolean default false,
  sort_order  int default 0
);

-- Мастера
create table if not exists masters (
  id         serial primary key,
  branch_id  int references branches(id) on delete cascade,
  name       text not null,
  photo      text
);

-- Услуги
create table if not exists services (
  id          serial primary key,
  branch_id   int references branches(id) on delete cascade,
  category    text,
  name        text not null,
  price       text,
  duration    text,
  description text,
  section     text,
  image_url   text,
  sort_order  int default 0
);

-- Тексты сайта (редактируются через /admin)
create table if not exists content (
  key   text primary key,
  value text not null default ''
);

-- Публичный доступ на чтение (сайт читает без авторизации)
alter table branches enable row level security;
alter table masters  enable row level security;
alter table services enable row level security;
alter table content  enable row level security;

create policy "public read branches" on branches for select using (true);
create policy "public read masters"  on masters  for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read content"  on content  for select using (true);

-- Запись через admin-панель (anon ключ достаточен, доступ только через сайт)
create policy "admin write content"  on content  for all using (true) with check (true);
create policy "admin write services" on services for update using (true) with check (true);

-- Добавление колонок если их нет (безопасно повторно запускать)
alter table services add column if not exists section   text;
alter table services add column if not exists image_url text;
