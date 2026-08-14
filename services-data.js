// EtchTechnologies — fuente de verdad de servicios y precios.
// Cargado antes que portfolio.js, demos.js, diagnostic.js y script.js.

window.SERVICES = [
  {
    id: "automatizacion",
    label: "Automatización de Procesos",
    desc: "Scripts y sistemas que eliminan tareas manuales repetitivas.",
    min: 300,
    max: 1200,
  },
  {
    id: "bases_datos",
    label: "Arquitectura de Bases de Datos",
    desc: "Diseño, integración y migración de bases de datos.",
    min: 400,
    max: 1500,
  },
  {
    id: "desarrollo",
    label: "Desarrollo Local y Web",
    desc: "Apps de escritorio modernas y plataformas web a la medida.",
    min: 600,
    max: 3000,
  },
  {
    id: "integracion",
    label: "Integración de Sistemas",
    desc: "Conexión de APIs y plataformas para un ecosistema fluido.",
    min: 350,
    max: 1400,
  },
];

window.currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// 💲 / 💲💲 / 💲💲💲 según el promedio de min/max — sin exponer números crudos.
window.tierForService = function tierForService(service) {
  const avg = (service.min + service.max) / 2;
  if (avg < 500) return "💲";
  if (avg < 1200) return "💲💲";
  return "💲💲💲";
};
