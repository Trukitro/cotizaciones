-- Trukitro — Cotizaciones
-- Ejecutar en el SQL Editor del dashboard de Supabase (proyecto etchtechnologies).

create extension if not exists pgcrypto;

create table if not exists public.cotizaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text,
  servicios text not null,
  mensaje text,
  rango_estimado text,
  fecha_creacion timestamptz not null default now()
);

alter table public.cotizaciones enable row level security;

-- El rol "anon" (frontend público) solo puede insertar filas.
create policy "anon puede insertar cotizaciones"
  on public.cotizaciones
  for insert
  to anon
  with check (true);

-- No se crean políticas de SELECT/UPDATE/DELETE para "anon":
-- con RLS habilitado y sin política, esas operaciones quedan denegadas por defecto.
