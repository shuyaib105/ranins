-- Add is_hidden column to products table
alter table products add column if not exists is_hidden boolean not null default false;
