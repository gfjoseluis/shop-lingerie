-- Seed taxonomía 8 categorías + 8 productos con atributos de lencería.
-- Requiere migrate-02.sql (columnas nuevas). Idempotente.
-- Fotos placeholders (picsum); reemplazar desde /admin.

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

insert into products (id, slug, name, description, base_price, sale_price, category_id, is_active, is_featured,
  cup_type, bra_style, hooks, cut_type, material, adhesive_kind, presentation) values
  ('a1000000-0000-0000-0000-000000000001', 'bralette-encaje-soft', 'Bralette Encaje Soft',
   'Sin aros ni relleno, encaje visible con forro de algodón.', 110, null,
   (select id from categories where slug = 'bralettes'), true, true,
   'soft', 'clasico', 2, null, 'encaje', null, null),
  ('a1000000-0000-0000-0000-000000000002', 'sosten-push-up-negro', 'Sostén Push-Up Negro',
   'Relleno angular que junta y eleva. 3 broches.', 159, 139,
   (select id from categories where slug = 'sostenes'), true, true,
   'push-up', null, 3, null, 'microfibra', null, null),
  ('a1000000-0000-0000-0000-000000000003', 'panty-clasica-algodon', 'Panty Clásica Algodón',
   'Cobertura tradicional a media cadera en algodón respirable.', 45, null,
   (select id from categories where slug = 'panties'), true, false,
   null, null, null, 'clasica', 'algodon', null, null),
  ('a1000000-0000-0000-0000-000000000004', 'tanga-brasilena-negra', 'Tanga Brasileña Negra',
   'Bikini adelante y V atrás. Cero marcas bajo ropa ajustada.', 55, null,
   (select id from categories where slug = 'tangas'), true, false,
   null, null, null, 'brasilena', 'licra', null, null),
  ('a1000000-0000-0000-0000-000000000005', 'faja-reductora-alta', 'Faja Reductora Tiro Alto',
   'Compresión moderada que moldea abdomen y glúteos.', 175, null,
   (select id from categories where slug = 'fajas'), true, false,
   null, null, null, 'reductora', 'licra', null, null),
  ('a1000000-0000-0000-0000-000000000006', 'conjunto-encaje-rose-clasico', 'Conjunto Encaje Rosé Clásico',
   'Encaje suave con forro de algodón, broche regulable.', 149, 129,
   (select id from categories where slug = 'conjuntos'), true, true,
   null, null, null, null, 'encaje', null, null),
  ('a1000000-0000-0000-0000-000000000007', 'pack-oferta-tangas', 'Pack Oferta x3 Tangas',
   'Tres tangas surtidas a precio especial. Hasta agotar stock.', 120, 89,
   (select id from categories where slug = 'ofertas'), true, true,
   null, null, null, 'tanga', 'licra', null, null),
  ('a1000000-0000-0000-0000-000000000008', 'pezoneras-silicona-nude', 'Pezoneras de Silicona Nude',
   'Adhesivas reutilizables, sin tiros ni broches. Talla única.', 65, null,
   (select id from categories where slug = 'adhesivos'), true, false,
   null, null, null, null, 'silicona', 'pezonera', 'Par')
on conflict (slug) do nothing;

insert into product_images (id, product_id, url, alt, position) values
  ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/bralette-soft-0/800/1000', 'Foto 1', 0),
  ('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/bralette-soft-1/800/1000', 'Foto 2', 1),
  ('b1000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000002', 'https://picsum.photos/seed/pushup-0/800/1000', 'Foto 1', 0),
  ('b1000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000002', 'https://picsum.photos/seed/pushup-1/800/1000', 'Foto 2', 1),
  ('b1000000-0000-0000-0000-000000000031', 'a1000000-0000-0000-0000-000000000003', 'https://picsum.photos/seed/panty-clasica-0/800/1000', 'Foto 1', 0),
  ('b1000000-0000-0000-0000-000000000032', 'a1000000-0000-0000-0000-000000000003', 'https://picsum.photos/seed/panty-clasica-1/800/1000', 'Foto 2', 1),
  ('b1000000-0000-0000-0000-000000000041', 'a1000000-0000-0000-0000-000000000004', 'https://picsum.photos/seed/tanga-0/800/1000', 'Foto 1', 0),
  ('b1000000-0000-0000-0000-000000000042', 'a1000000-0000-0000-0000-000000000004', 'https://picsum.photos/seed/tanga-1/800/1000', 'Foto 2', 1),
  ('b1000000-0000-0000-0000-000000000051', 'a1000000-0000-0000-0000-000000000005', 'https://picsum.photos/seed/faja-0/800/1000', 'Foto 1', 0),
  ('b1000000-0000-0000-0000-000000000052', 'a1000000-0000-0000-0000-000000000005', 'https://picsum.photos/seed/faja-1/800/1000', 'Foto 2', 1),
  ('b1000000-0000-0000-0000-000000000061', 'a1000000-0000-0000-0000-000000000006', 'https://picsum.photos/seed/rose-clasico-0/800/1000', 'Foto 1', 0),
  ('b1000000-0000-0000-0000-000000000062', 'a1000000-0000-0000-0000-000000000006', 'https://picsum.photos/seed/rose-clasico-1/800/1000', 'Foto 2', 1),
  ('b1000000-0000-0000-0000-000000000071', 'a1000000-0000-0000-0000-000000000007', 'https://picsum.photos/seed/pack-tangas-0/800/1000', 'Foto 1', 0),
  ('b1000000-0000-0000-0000-000000000072', 'a1000000-0000-0000-0000-000000000007', 'https://picsum.photos/seed/pack-tangas-1/800/1000', 'Foto 2', 1),
  ('b1000000-0000-0000-0000-000000000081', 'a1000000-0000-0000-0000-000000000008', 'https://picsum.photos/seed/pezoneras-0/800/1000', 'Foto 1', 0)
on conflict (id) do nothing;

insert into product_variants (product_id, size, color, sku, stock, price_override) values
  ('a1000000-0000-0000-0000-000000000001', 'S', 'Negro', 'BRA-S-NEG', 6, null),
  ('a1000000-0000-0000-0000-000000000001', 'M', 'Negro', 'BRA-M-NEG', 8, null),
  ('a1000000-0000-0000-0000-000000000001', 'M', 'Rosado', 'BRA-M-ROS', 5, null),
  ('a1000000-0000-0000-0000-000000000001', 'L', 'Blanco', 'BRA-L-BLA', 4, null),
  ('a1000000-0000-0000-0000-000000000002', '34B', 'Negro', 'SOS-34B-NEG', 4, null),
  ('a1000000-0000-0000-0000-000000000002', '36B', 'Negro', 'SOS-36B-NEG', 6, null),
  ('a1000000-0000-0000-0000-000000000002', '36C', 'Negro', 'SOS-36C-NEG', 3, null),
  ('a1000000-0000-0000-0000-000000000003', 'S', 'Blanco', 'PAN-S-BLA', 12, null),
  ('a1000000-0000-0000-0000-000000000003', 'M', 'Blanco', 'PAN-M-BLA', 15, null),
  ('a1000000-0000-0000-0000-000000000003', 'L', 'Beige', 'PAN-L-BEI', 10, null),
  ('a1000000-0000-0000-0000-000000000003', 'XL', 'Beige', 'PAN-XL-BEI', 6, null),
  ('a1000000-0000-0000-0000-000000000004', 'S', 'Negro', 'TAN-S-NEG', 8, null),
  ('a1000000-0000-0000-0000-000000000004', 'M', 'Negro', 'TAN-M-NEG', 10, null),
  ('a1000000-0000-0000-0000-000000000004', 'L', 'Negro', 'TAN-L-NEG', 5, null),
  ('a1000000-0000-0000-0000-000000000005', 'M', 'Beige', 'FAJ-M-BEI', 5, null),
  ('a1000000-0000-0000-0000-000000000005', 'L', 'Beige', 'FAJ-L-BEI', 4, null),
  ('a1000000-0000-0000-0000-000000000005', 'XL', 'Negro', 'FAJ-XL-NEG', 3, null),
  ('a1000000-0000-0000-0000-000000000006', 'S', 'Negro', 'CON-S-NEG', 5, null),
  ('a1000000-0000-0000-0000-000000000006', 'M', 'Negro', 'CON-M-NEG', 8, null),
  ('a1000000-0000-0000-0000-000000000006', 'M', 'Rosado', 'CON-M-ROS', 4, null),
  ('a1000000-0000-0000-0000-000000000006', 'L', 'Blanco', 'CON-L-BLA', 6, null),
  ('a1000000-0000-0000-0000-000000000007', 'S', 'Surtido', 'OFE-S-SUR', 9, null),
  ('a1000000-0000-0000-0000-000000000007', 'M', 'Surtido', 'OFE-M-SUR', 12, null),
  ('a1000000-0000-0000-0000-000000000007', 'L', 'Surtido', 'OFE-L-SUR', 0, null),
  ('a1000000-0000-0000-0000-000000000008', 'Único', 'Nude', 'ADH-UNI-NUD', 30, null)
on conflict (sku) do nothing;
