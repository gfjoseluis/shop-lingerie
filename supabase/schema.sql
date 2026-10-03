-- Supabase schema v1: catálogo con stock atómico por variante.
-- Ejecutar en Supabase SQL Editor (free tier).

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  base_price numeric(10,2) not null check (base_price >= 0),
  sale_price numeric(10,2) check (sale_price is null or sale_price >= 0),
  category_id uuid references categories(id) on delete set null,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  url text not null,
  alt text,
  position int default 0
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  size text not null,
  color text not null,
  sku text unique not null,
  stock int not null default 0 check (stock >= 0),
  price_override numeric(10,2)
);

create table if not exists orders (
  id text primary key,
  customer_name text not null,
  customer_phone text not null,
  neighborhood text not null,
  address text not null,
  reference text,
  notes text,
  subtotal numeric(10,2) not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists order_items (
  order_id text references orders(id) on delete cascade,
  variant_id uuid references product_variants(id),
  product_name text not null,
  size text not null,
  color text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  subtotal numeric(10,2) not null,
  primary key (order_id, variant_id)
);

-- Storage bucket (crear en Dashboard > Storage): product-images (public)
-- RLS sugerido: lectura pública en categories/products/images/variants, escritura solo service_role.
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (is_active = true);
create policy "public read images" on product_images for select using (true);
create policy "public read variants" on product_variants for select using (true);

-- Si re-ejecutas este archivo y da error "policy already exists", corre antes:
-- drop policy if exists "public read categories" on categories;
-- drop policy if exists "public read products" on products;
-- drop policy if exists "public read images" on product_images;
-- drop policy if exists "public read variants" on product_variants;
