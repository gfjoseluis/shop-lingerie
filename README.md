# Santa Cruz Lencería — Catálogo virtual

Next.js 16 + TypeScript + Tailwind + Supabase (free tier) + Vercel.

## Correr local (Windows / Laragon)

Usar el npm bundled de Node 24 (el global 12.x da error EALLOWSCRIPTS):

```bash
"C:/Program Files/nodejs/node.exe" "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" install
"C:/Program Files/nodejs/node.exe" "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" run dev -- -p 3100
```

Abrir http://localhost:3100

## Configurar

1. Copiar `.env.example` a `.env.local`
2. `NEXT_PUBLIC_WHATSAPP_NUMBER=591...` (sin +)
3. `ADMIN_PASSWORD=...` para ver `/admin?key=...`
4. Supabase (opcional fase 1, obligatorio para producción):
   - Crear proyecto free en supabase.com
   - Ejecutar `supabase/schema.sql` en SQL Editor
   - Crear bucket público `product-images`
   - Pegar URL + anon key en `.env.local`

Sin Supabase la app usa placeholders (`src/data/mock.ts`).

## API v1 (reusable por futura app móvil)

- `GET /api/v1/categories`
- `GET /api/v1/products?q=&categoria=&talla=&color=&page=&limit=&orden=`
- `GET /api/v1/products/[slug]`
- `POST /api/v1/orders` `{customerName, customerPhone, neighborhood, address, reference?, items:[{variantId, quantity}]}`
- Docs: `/api-docs` (Swagger, spec en `/api/openapi.json`)

Arquitectura: `app/api` (controllers) → `services` (reglas) → `repositories` (DIP, Mock hoy / Supabase mañana) → validación `zod`.

## Deploy Vercel free

1. Subir a GitHub, importar en vercel.com
2. Agregar env vars del `.env.example`
3. Queda en `tutienda.vercel.app`. Dominio propio luego ($10-15/año).
