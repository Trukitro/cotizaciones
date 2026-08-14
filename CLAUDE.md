# CLAUDE.md — cotizaciones (Trukitro)

Estado y contexto del proyecto para futuras sesiones de Claude Code.

## Qué es

Landing page estática de cotización en tiempo real para Trukitro (Rikion) — ingeniería de software / automatización. Formulario con checkboxes de servicios que calcula un rango de precio client-side, guarda la solicitud en Supabase y notifica por email vía EmailJS. Sin build step, publicado en GitHub Pages.

## Recursos exactos

- **Repo GitHub:** `Trukitro/cotizaciones` (público)
- **GitHub Pages:** https://trukitro.github.io/cotizaciones/
- **Cuenta GitHub usada por `gh`:** `Trukitro`
- **Supabase:** proyecto `etchtechnologies` (plan Free), región `us-east-1`
  URL: `https://icisukcehosnyyndzcem.supabase.co`
  Tabla: `public.cotizaciones` (ver [`schema.sql`](schema.sql))
- **EmailJS:** cuenta Free (200 requests/mes). Template existente con variables:
  `from_name`, `from_email`, `phone`, `services`, `estimated_price`, `message`, `date`.
  El "To Email" del template está fijo al correo personal del dueño (no es variable, no se pasa desde el frontend).

## Decisiones tomadas

- **Sin framework, sin build step.** HTML/CSS/JS vanilla, `@supabase/supabase-js` y `@emailjs/browser` cargados vía CDN (jsdelivr).
- **Secretos client-side vía `config.js` gitignoreado.** `config.example.js` queda versionado como plantilla; `config.js` con valores reales está en `.gitignore`. Ver nota importante abajo sobre producción.
- **Precios estimados definidos por Claude, no venían en el flyer original:**
  - Automatización de Procesos: $300–$1,200
  - Arquitectura de Bases de Datos: $400–$1,500
  - Desarrollo Local y Web: $600–$3,000
  - Integración de Sistemas: $350–$1,400
  Moneda: USD. Si esto no corresponde al mercado objetivo del dueño, ajustar en `SERVICES` dentro de [`script.js`](script.js).
- **RLS en Supabase: `anon` solo puede `INSERT`.** No hay política de SELECT/UPDATE/DELETE para `anon`, así que las cotizaciones solo se leen desde el dashboard de Supabase (Table Editor o SQL Editor), nunca desde el frontend.
- **Paleta visual:** near-black (`#0a0e14`) + acento azul (`#5b8cf7`, del logo "TRUKITRO" del flyer) + acento verde (`#2ea043`, del badge "INGENIERÍA & AUTOMATIZACIÓN"). Mismo lenguaje visual que PulseGuard (otro proyecto del dueño).
- **Keep-alive:** cron cada 4 días (`0 12 */4 * *`) vía GitHub Actions, hace `GET` a `/rest/v1/` de Supabase usando el secret `SUPABASE_ANON_KEY` del repo, para evitar que el proyecto Free se pause por inactividad.

## Tensión conocida: `config.js` gitignoreado vs. sitio en producción

GitHub Pages solo sirve archivos versionados. Como `config.js` está en `.gitignore` por diseño (para evitar comitear valores por accidente durante desarrollo), el sitio publicado **no tendrá el formulario funcional** hasta que el dueño decida subir un `config.js` con los valores reales (`git add -f config.js`). Esto es seguro porque tanto la `anon key` de Supabase como la `public key` de EmailJS están pensadas para exponerse en el cliente — la seguridad real la da RLS (Supabase) y el "To Email" fijo del template (EmailJS), no el secreto de esas claves. Documentado en el checklist de [`README.md`](README.md).

## Próximos pasos (pendientes, no automatizables desde aquí)

1. Dueño llena `config.js` localmente con las claves reales.
2. Dueño corre `schema.sql` en el SQL Editor de Supabase.
3. Dueño crea el GitHub Secret `SUPABASE_ANON_KEY` en `Trukitro/cotizaciones` (usado por `keep-alive.yml`).
4. Dueño decide si sube `config.js` a producción (`git add -f config.js`) para que el formulario funcione en Pages, o si prefiere otro mecanismo de despliegue con inyección de secretos.
5. Verificar que GitHub Pages esté sirviendo correctamente desde `main` (root) y probar el flujo completo end-to-end una vez `config.js` esté en producción.

## No usar / no repetir

- No agregar build step (Vite, bundlers, npm) — el requisito explícito fue "sin build step".
- No dar a `anon` permisos de SELECT/UPDATE/DELETE en `cotizaciones`.
- No commitear `config.js` sin que el dueño lo apruebe explícitamente (aunque las keys sean "seguras de exponer", sigue siendo su decisión).
