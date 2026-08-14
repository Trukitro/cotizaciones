# Cotizaciones — Trukitro

Landing page de cotización en tiempo real para **Trukitro (Rikion)**, ingeniería de software especializada en automatización de procesos, arquitectura de bases de datos, desarrollo local/web e integración de sistemas.

Sitio estático (HTML/CSS/JS vanilla, sin build step), publicado en GitHub Pages. El formulario calcula un rango de precio estimado en el navegador, guarda la solicitud en Supabase y envía una notificación por email vía EmailJS.

**Demo:** https://trukitro.github.io/cotizaciones/

## Stack

- Frontend: HTML/CSS/JS vanilla
- Base de datos: [Supabase](https://supabase.com) (`@supabase/supabase-js` vía CDN)
- Notificaciones: [EmailJS](https://www.emailjs.com/) (`@emailjs/browser` vía CDN)
- Hosting: GitHub Pages

## Estructura

```
index.html          Landing + formulario de cotización
style.css            Estilos (tema oscuro minimalista)
script.js             Calculadora de precios + envío a Supabase/EmailJS
config.example.js  Plantilla de configuración (sin valores reales)
config.js               Configuración real — NO se sube al repo (.gitignore)
schema.sql              Tabla + políticas RLS para Supabase
.github/workflows/keep-alive.yml   Ping periódico para evitar pausa del proyecto Free de Supabase
```

## Setup local

1. Clona el repo.
2. Copia `config.example.js` a `config.js` y llena tus valores reales (ver checklist abajo).
3. Abre `index.html` en el navegador (no requiere servidor ni build).

## Checklist — pasos manuales pendientes

Estos pasos **no** se pueden automatizar desde aquí y hay que hacerlos manualmente:

- [ ] **Copiar `config.example.js` → `config.js`** y llenar:
  - `SUPABASE_URL`: `https://icisukcehosnyyndzcem.supabase.co`
  - `SUPABASE_ANON_KEY`: clave `anon` `public` del proyecto `etchtechnologies` (Settings → API en el dashboard de Supabase)
  - `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`: desde el dashboard de EmailJS
- [ ] **Ejecutar [`schema.sql`](schema.sql)** en el SQL Editor del dashboard de Supabase para crear la tabla `cotizaciones` y las políticas RLS.
- [ ] **Crear el GitHub Secret `SUPABASE_ANON_KEY`** en este repo (usado por el workflow de keep-alive):
  ```bash
  gh secret set SUPABASE_ANON_KEY --repo Trukitro/cotizaciones
  ```
- [ ] **Publicar `config.js` para que el sitio en producción funcione.** GitHub Pages solo sirve archivos versionados en el repo, y `config.js` está en `.gitignore` a propósito (para no comitear valores por error mientras desarrollas). La `anon key` de Supabase y la `public key` de EmailJS están diseñadas para ser usadas del lado del cliente (la seguridad real la da RLS en Supabase, no el secreto de la key), así que es seguro subir `config.js` una vez lo hayas llenado. Cuando quieras que el formulario funcione en `https://trukitro.github.io/cotizaciones/`, agrega el archivo explícitamente:
  ```bash
  git add -f config.js
  git commit -m "chore: add production config"
  git push
  ```
  (Nunca hagas esto con claves de rol `service_role` de Supabase — esas sí son secretas y nunca deben ir al frontend.)

## Leer las cotizaciones recibidas

Como `anon` solo tiene permiso de `INSERT` (ver [`schema.sql`](schema.sql)), los registros **no** se pueden leer desde el frontend. Para revisarlos:

1. Entra al [dashboard de Supabase](https://supabase.com/dashboard) → proyecto `etchtechnologies`.
2. Ve a **Table Editor → `cotizaciones`**, o usa **SQL Editor** con:
   ```sql
   select * from public.cotizaciones order by fecha_creacion desc;
   ```

## Mantenimiento

El workflow [`keep-alive.yml`](.github/workflows/keep-alive.yml) hace un `GET` al endpoint REST de Supabase cada 4 días para evitar que el proyecto Free se pause por inactividad. Requiere el secret `SUPABASE_ANON_KEY` configurado en el repo (ver checklist arriba).

## Licencia

Todos los derechos reservados — Trukitro / Rikion.
