-- Initialize extensions and core tables for Supabase

create extension if not exists pgcrypto;

-- Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  discount_price numeric,
  stock integer not null default 0,
  category text not null,
  image text,
  created_at timestamptz not null default now()
);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_name on products(name);

-- Orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  products jsonb not null,
  total_amount numeric not null,
  transaction_id text,
  payment_method text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists idx_orders_status on orders(status);

-- Settings table (single-row configuration)
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text,
  bkash_number text,
  nagad_number text,
  hero_image text,
  logo text,
  footer_text text,
  created_at timestamptz not null default now()
);

-- Ensure there's at most one settings row (optional - enforce via app logic or a trigger)
