-- Migración 02: atributos de lencería + taxonomía de 8 categorías.
-- Ejecutar UNA vez en Supabase Dashboard > SQL Editor.

-- Nuevas columnas (opcionales según categoría)
alter table products add column if not exists cup_type text;
alter table products add column if not exists bra_style text;
alter table products add column if not exists hooks int check (hooks is null or (hooks >= 1 and hooks <= 8));
alter table products add column if not exists cut_type text;
alter table products add column if not exists material text;
alter table products add column if not exists adhesive_kind text;
alter table products add column if not exists presentation text;

-- Taxonomía final (8 categorías)
insert into categories (slug, name, description) values
  ('bralettes', 'Bralettes', 'Livianos sin aro, encaje visible'),
  ('sostenes', 'Sostenes', 'Push-up, balconette y copas con soporte'),
  ('panties', 'Panties', 'Clásicas, bikini y cacheteros de uso diario'),
  ('tangas', 'Tangas', 'Brasileñas e hilo, sin marcas'),
  ('fajas', 'Fajas', 'Compresión suave a firme'),
  ('conjuntos', 'Conjuntos', 'Sets coordinados superior + inferior'),
  ('ofertas', 'Ofertas', 'Precio especial, últimas unidades'),
  ('adhesivos', 'Adhesivos', 'Silicona, pezoneras y cintas')
on conflict (slug) do update set name = excluded.name, description = excluded.description;
