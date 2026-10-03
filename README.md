# Santa Cruz Lencería — Catálogo virtual

Next.js 16 + TypeScript + Tailwind v4 + Supabase (free tier) + Vercel.
Tienda: catálogo con buscador/filtros/paginación, carrito y pedido por
WhatsApp con pago contraentrega (Santa Cruz de la Sierra, Bolivia).
Sin registro de clientes. API v1 documentada, lista para futura app móvil.

## Correr en local (Windows / Laragon)

```bash
npm install          # primera vez (npm 11+; si ves EALLOWSCRIPTS actualiza npm: npm install -g npm@11)
npm run dev          # http://localhost:3000 (también en tu WiFi, ver Notas)
npm run build        # verificar antes de subir a Vercel
```

## Variables de entorno

1. Copiar `.env.example` a `.env.local` (nunca se sube a Git).
2. Supabase usa formato nuevo: `NEXT_PUBLIC_SUPABASE_URL` +
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (empieza con `sb_publishable_...`).
   El código también acepta la legacy `ANON_KEY`.
3. `NEXT_PUBLIC_WHATSAPP_NUMBER=591...` (solo dígitos, sin +). En Vercel
   déjala como `NEXT_PUBLIC_*` aunque avise: el número comercial es público
   y se usa en el navegador (`wa.me`).
4. Solo servidor (sin prefijo `NEXT_PUBLIC_`): `SUPABASE_SECRET_KEY` y
   `ADMIN_PASSWORD`. Nunca exponerlas en el cliente.

## Supabase (una vez)

1. Crear proyecto free en supabase.com (región São Paulo).
2. SQL Editor → correr `supabase/schema.sql` (tablas + RLS lectura pública).
   Luego `supabase/migrate-02.sql` (atributos de lencería + 8 categorías).
   Tras correrla, reinicia `npm run dev` (el repo cachea el esquema por proceso).
3. El bucket público `product-images` y los datos de ejemplo se crean con:
   `node --env-file=.env.local scripts/seed.mjs` (8 categorías + 8 productos
   con copa/corte/tela/broches; limpia pedidos de prueba y datos viejos).
   (alternativa manual en Dashboard: Storage > New bucket `product-images`
   público + correr `supabase/seed.sql`, idempotente).
4. Sin credenciales la tienda usa placeholders en memoria
   (`src/data/mock.ts`); con credenciales lee la DB real
   (`src/repositories/factory.ts:1`).

## Admin (`/admin`)

Login con Supabase Auth (ya no usa `?key=`):

```bash
# 1. En .env.local: ADMIN_EMAIL=tu@correo.com + ADMIN_PASSWORD segura
ADMIN_EMAIL=... ADMIN_PASSWORD=... node --env-file=.env.local scripts/create-admin.mjs
# 2. npm run dev → http://localhost:3000/admin/login
```

- **Panel**: productos, pedidos pendientes, stock bajo (≤3), últimos pedidos.
- **Productos**: nuevo/editar (slug y SKU auto), precio/oferta, destacados,
  variantes talla/color/stock, fotos por subida (JPG/PNG/WebP ≤5MB) o URL,
  ocultar/publicar. Con pedidos existentes el stock se edita por variante.
- **Pedidos**: cambia estado (pendiente → confirmado → entregado; al
  **cancelar se devuelve el stock** solo) y botón WhatsApp al cliente.

## API v1 (web y futura app móvil)

- `GET /api/v1/categories`
- `GET /api/v1/products?q=&categoria=&talla=&color=&copa=&corte=&tela=&page=&limit=&orden=`
- `GET /api/v1/products/[slug]`
- `POST /api/v1/orders` `{customerName, customerPhone, neighborhood, address, reference?, items:[{variantId, quantity}]}` (descuenta stock atómico)
- Docs interactivas: `/api-docs` (Scalar, spec en `/api/openapi.json`)

Arquitectura limpia: `app/api` (controllers delgados) → `services`
(reglas) → `repositories` (interfaces + Mock/Supabase, DIP) → `zod`.
Checkout valida el celular: prefijo `+591` fijo, 8 dígitos (6/7...).

## Anti-bots checkout (Cloudflare Turnstile)

El checkout lleva widget invisible y `POST /api/v1/orders` verifica el
token en el servidor **antes** de crear el pedido y descontar stock
(`src/lib/turnstile.ts:1`). Sin secret configurado se omite (dev).

1. Entra a dash.cloudflare.com (cuenta gratis) → Turnstile → Add widget.
2. Nombre `lenceria-checkout`, modo **Managed** (invisible si no es sospechoso),
   dominios: `localhost` para probar + tu dominio Vercel.
3. Copia **Site key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y **Secret key** →
   `TURNSTILE_SECRET_KEY` (en `.env.local` y en Vercel).
4. Para probar en local sin cuenta usa las claves de prueba del `.env.example`
   (siempre pasan).

## Diseño

Sistema editorial propio (skill frontend-design): tipografías Fraunces
(display) + Jost (texto), paleta ivoire/nuit/figue/seda/latón, foto
principal en arco espejo, mobile-first con áreas táctiles ≥44px y
`touch-manipulation`. Sin dependencias de UI.

## Deploy Vercel free

1. Subir a GitHub e importar en vercel.com.
2. Agregar las env vars de `.env.example` (las `NEXT_PUBLIC_*` como públicas).
3. Queda en `tutienda.vercel.app`; dominio propio luego (~$10-15/año).

## Notas y avisos ya resueltos

- Probar desde el celular por WiFi: `next.config.ts` incluye
  `allowedDevOrigins` con la IP de red; si cambia (ver `ipconfig`),
  agrégala y reinicia `npm run dev`.
- `data-scroll-behavior="smooth"` en `<html>` silencia el aviso de scroll.
- `suppressHydrationWarning` en `<body>` cubre atributos de extensiones.
- El carrito hidrata `localStorage` tras el montaje (excepción justificada a
  `react-hooks/set-state-in-effect`) para no romper hidratación.
- Navegación interna con `router.push`, nunca `window.location.href`.
- Docs API con Scalar (swagger-ui-react se rompió con Turbopack y se eliminó).
