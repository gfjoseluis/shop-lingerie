"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">API v1 — Documentación</h1>
      <p className="mt-1 text-sm text-zinc-600">Misma API que usará la futura app móvil.</p>
      <div className="mt-4 rounded border bg-white">
        <SwaggerUI url="/api/openapi.json" />
      </div>
    </main>
  );
}
