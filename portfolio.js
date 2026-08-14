// EtchTechnologies — Portafolio de proyectos reales publicados en GitHub.
// serviceTag vincula cada proyecto a un id de window.SERVICES (services-data.js) para heredar su color.

window.PORTFOLIO = [
  {
    name: "PulseGuard",
    url: "https://github.com/Trukitro/PulseGuard",
    tagline: "Watchdog de recursos para Windows: backend Python + UI web-native, empaquetado como instalador.",
    serviceTag: "automatizacion",
  },
  {
    name: "Etch-DB-Mapper",
    url: "https://github.com/Trukitro/Etch-DB-Mapper",
    tagline: "Herramienta de escritorio para mapear visualmente esquemas de bases de datos relacionales.",
    serviceTag: "bases_datos",
  },
  {
    name: "SVG-Converter",
    url: "https://github.com/Trukitro/SVG-Converter",
    tagline: "Convierte SVG a PNG/ICO/JPG/WEBP en uno o varios tamaños, con GUI drag & drop.",
    serviceTag: "desarrollo",
  },
  {
    name: "SSH-Console-Launcher",
    url: "https://github.com/Trukitro/SSH-Console-Launcher",
    tagline: "GUI para administrar múltiples sesiones SSH con perfiles, tabs y auto-login.",
    serviceTag: "integracion",
  },
  {
    name: "DiskInfo",
    url: "https://github.com/Trukitro/DiskInfo",
    tagline: "Utilidad de información y monitoreo de disco/almacenamiento para Windows.",
    serviceTag: "desarrollo",
  },
  {
    name: "Lawn Mowing Forecast",
    url: "https://github.com/Trukitro/lawn-mowing-forecast",
    tagline: "App web interactiva que recomienda el mejor momento para cortar el césped según el clima.",
    serviceTag: "desarrollo",
  },
];

function renderPortfolio() {
  const grid = document.getElementById("portfolio-grid");
  if (!grid) return;

  grid.innerHTML = window.PORTFOLIO.map((p) => {
    const service = window.SERVICES.find((s) => s.id === p.serviceTag);
    return `
    <article class="portfolio-card" data-service="${p.serviceTag}">
      <div class="portfolio-media" aria-hidden="true"></div>
      <span class="portfolio-tag">${service ? service.label : ""}</span>
      <h3><a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.name}</a></h3>
      <p>${p.tagline}</p>
    </article>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", renderPortfolio);
