// EtchTechnologies — Quiz de diagnóstico opcional.
// Recomienda servicios y avisa a script.js vía el evento "preselect-services" (no depende del orden de carga).

const DIAGNOSTIC_QUESTIONS = [
  {
    text: "¿Dónde vive hoy la información de tu negocio?",
    options: [
      { label: "En papel o Excel disperso", scores: { bases_datos: 1 } },
      { label: "En una base de datos que ya no da abasto", scores: { bases_datos: 2 } },
      { label: "En varios sistemas que no se hablan entre sí", scores: { integracion: 2 } },
    ],
  },
  {
    text: "¿Cuánto tiempo a la semana pierdes en tareas repetitivas?",
    options: [
      { label: "Casi nada", scores: {} },
      { label: "Un par de horas", scores: { automatizacion: 1 } },
      { label: "Es un dolor de cabeza", scores: { automatizacion: 2 } },
    ],
  },
  {
    text: "¿Qué te haría más feliz ahora mismo?",
    options: [
      { label: "Una app o página nueva", scores: { desarrollo: 2 } },
      { label: "Que mis sistemas se conecten", scores: { integracion: 2 } },
      { label: "Automatizar lo repetitivo", scores: { automatizacion: 2 } },
      { label: "Poner orden en mis datos", scores: { bases_datos: 2 } },
    ],
  },
];

let diagCurrent = 0;
let diagScores = {};

function diagRenderQuestion() {
  const container = document.getElementById("diagnostic-question");
  const q = DIAGNOSTIC_QUESTIONS[diagCurrent];
  container.innerHTML = `
    <p class="diagnostic-question-text">${q.text}</p>
    <div class="diagnostic-options">
      ${q.options
        .map((opt, i) => `<button class="diagnostic-option" type="button" data-index="${i}">${opt.label}</button>`)
        .join("")}
    </div>`;

  container.querySelectorAll(".diagnostic-option").forEach((btn) => {
    btn.addEventListener("click", () => diagSelectOption(Number(btn.dataset.index)));
  });

  diagUpdateDots();
}

function diagUpdateDots() {
  document.querySelectorAll(".diagnostic-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === diagCurrent);
    dot.classList.toggle("done", i < diagCurrent);
  });
}

function diagSelectOption(index) {
  const opt = DIAGNOSTIC_QUESTIONS[diagCurrent].options[index];
  Object.entries(opt.scores).forEach(([id, val]) => {
    diagScores[id] = (diagScores[id] || 0) + val;
  });
  diagCurrent++;
  if (diagCurrent < DIAGNOSTIC_QUESTIONS.length) {
    diagRenderQuestion();
  } else {
    diagShowResult();
  }
}

function diagShowResult() {
  document.getElementById("diagnostic-question").innerHTML = "";
  document.getElementById("diagnostic-progress").hidden = true;

  const sorted = Object.entries(diagScores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const topIds = sorted.slice(0, 2).map(([id]) => id);
  const finalIds = topIds.length ? topIds : ["automatizacion"];
  const labels = finalIds
    .map((id) => window.SERVICES.find((s) => s.id === id))
    .filter(Boolean)
    .map((s) => s.label);

  const resultEl = document.getElementById("diagnostic-result");
  document.getElementById("diagnostic-result-services").textContent = labels.join(" + ");
  resultEl.dataset.ids = JSON.stringify(finalIds);
  resultEl.hidden = false;
}

function diagReset() {
  diagCurrent = 0;
  diagScores = {};
  document.getElementById("diagnostic-result").hidden = true;
  document.getElementById("diagnostic-progress").hidden = false;
  diagRenderQuestion();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("diagnostic-question")) return;

  diagRenderQuestion();

  document.getElementById("diagnostic-cta").addEventListener("click", () => {
    const ids = JSON.parse(document.getElementById("diagnostic-result").dataset.ids || "[]");
    document.dispatchEvent(new CustomEvent("preselect-services", { detail: { ids } }));
  });

  document.getElementById("diagnostic-restart").addEventListener("click", diagReset);
});
