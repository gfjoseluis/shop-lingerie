export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Catálogo Lencería API",
    version: "1.0.0",
    description:
      "API v1 para web y futura app móvil. Stock atómico por variante (talla/color). Pedidos contraentrega Santa Cruz, Bolivia.",
  },
  servers: [{ url: "/api/v1" }],
  paths: {
    "/categories": {
      get: { summary: "Listar categorías", responses: { "200": { description: "OK" } } },
    },
    "/products": {
      get: {
        summary: "Listar productos con filtros, buscador y paginación",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "categoria", in: "query", schema: { type: "string" } },
          { name: "talla", in: "query", schema: { type: "string" } },
          { name: "color", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 12 } },
          { name: "orden", in: "query", schema: { type: "string", enum: ["newest", "price_asc", "price_desc"] } },
        ],
        responses: { "200": { description: "Paginado de productos" } },
      },
    },
    "/products/{slug}": {
      get: {
        summary: "Detalle de producto",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "404": { description: "No encontrado" } },
      },
    },
    "/orders": {
      post: {
        summary: "Crear pedido contraentrega",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                customerName: "María",
                customerPhone: "70012345",
                neighborhood: "Equipetrol",
                address: "Calle 5 #123",
                items: [{ variantId: "p1-v2", quantity: 1 }],
              },
            },
          },
        },
        responses: { "201": { description: "Pedido creado" }, "400": { description: "Validación/stock" } },
      },
    },
  },
};
