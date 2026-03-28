-- ============================================================
-- SplitDeal — Compras Grupales de Supermercado Mayorista
-- ============================================================

-- 1. Productos (poblados por el scraper)
create table if not exists productos (
  id                    bigint primary key generated always as identity,
  nombre                text    not null,
  descripcion           text,
  precio_mayorista      numeric not null,          -- precio por unidad en compra mayorista
  precio_minorista      numeric,                   -- precio referencial en supermercado minorista
  unidad                text    not null default 'u',  -- 'kg', 'lt', 'u', 'pack'
  cantidad_por_bulto    int     not null default 6,    -- unidades mínimas para precio mayorista
  categoria             text,
  imagen_url            text,
  image_emoji           text    default '🛍️',
  url_origen            text,                      -- URL de donde se scrapeó
  activo                boolean default true,
  ultima_actualizacion  timestamptz default now()
);

-- 2. Compras grupales (una por cada "pedido abierto" de un producto)
create table if not exists compras_grupales (
  id                bigint primary key generated always as identity,
  producto_id       bigint  not null references productos(id) on delete cascade,
  cantidad_objetivo int     not null,              -- unidades totales para cerrar el pedido
  cantidad_actual   int     not null default 0,    -- unidades comprometidas hasta ahora
  precio_por_unidad numeric not null,              -- precio al que paga cada participante
  estado            text    not null default 'abierta',
                    -- 'abierta' | 'completa' | 'procesando' | 'entregada' | 'cancelada'
  fecha_limite      date,                          -- fecha límite opcional para completarse
  fecha_creacion    timestamptz default now()
);

-- 3. Participaciones (qué usuario se sumó con cuántas unidades)
create table if not exists participaciones (
  id          bigint primary key generated always as identity,
  compra_id   bigint not null references compras_grupales(id) on delete cascade,
  user_id     uuid   not null references auth.users(id),
  cantidad    int    not null default 1,
  estado      text   not null default 'pendiente', -- 'pendiente' | 'confirmada' | 'cancelada'
  fecha_union timestamptz default now()
);
