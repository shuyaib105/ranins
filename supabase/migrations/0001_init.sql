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

-- Categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table settings enable row level security;

-- Products Policies
create policy "Allow public read products" on products for select using (true);
create policy "Allow authenticated all products" on products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Categories Policies
create policy "Allow public read categories" on categories for select using (true);
create policy "Allow authenticated all categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Orders Policies
create policy "Allow public insert orders" on orders for insert with check (true);
create policy "Allow authenticated all orders" on orders for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Settings Policies
create policy "Allow public read settings" on settings for select using (true);
create policy "Allow authenticated all settings" on settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Seed initial categories
insert into categories (name, slug) values 
('Exclusive', 'all'),
('Islamic', 'islamic'),
('Motivational', 'motivational'),
('Classical', 'classical'),
('Music Band', 'musicband')
on conflict (slug) do nothing;

-- Ensure there's at most one settings row (optional - enforce via app logic or a trigger)

-- Supabase Storage Setup
-- Note: These run in the 'storage' schema

-- Create the bucket
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Set up RLS policies for storage
-- Allow public access to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Allow authenticated users (admin) to upload images
create policy "Admin Upload"
on storage.objects for insert
with check (
  bucket_id = 'images' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users (admin) to update images
create policy "Admin Update"
on storage.objects for update
using (
  bucket_id = 'images' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users (admin) to delete images
create policy "Admin Delete"
on storage.objects for delete
using (
  bucket_id = 'images' 
  and auth.role() = 'authenticated'
);
