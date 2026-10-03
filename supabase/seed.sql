-- Seed mínimo de ejemplo. Ajusta nombres/precios a tu tienda.
-- Corre después de schema.sql.

insert into categories (slug, name, description) values
  ('conjuntos', 'Conjuntos', 'Conjuntos de encaje y algodón'),
  ('bodys', 'Bodys', 'Bodys para toda ocasión'),
  ('pijamas', 'Pijamas', 'Pijamas cómodas'),
  ('panties', 'Panties', 'Panties pack x3'),
  ('ofertas', 'Ofertas', 'Últimas unidades')
on conflict (slug) do nothing;
