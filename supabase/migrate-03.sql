-- Migración 03: configuración de la tienda editable desde /admin/configuracion.
-- Ejecutar UNA vez en Supabase Dashboard > SQL Editor.

create table if not exists site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);
-- Escritura solo con service_role (Server Actions), sin policies de insert/update.

insert into site_settings (key, value) values
  ('store_name', 'Lencería Linita'),
  ('whatsapp_number', '59167852925'),
  ('currency', 'Bs'),
  ('instagram_url', ''),
  ('tiktok_url', ''),
  ('facebook_url', '')
on conflict (key) do nothing;
