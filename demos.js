// EtchTechnologies — Mini-demos interactivos de "Míralo en acción".
// Ninguno automatiza nada real: son simulaciones visuales del concepto de cada servicio.

function initAutomationDemo() {
  const trigger = document.getElementById("automation-trigger");
  const result = document.getElementById("automation-result");
  const steps = Array.from(document.querySelectorAll("#automation-steps li"));
  if (!trigger) return;

  trigger.addEventListener("click", () => {
    trigger.disabled = true;
    result.textContent = "";
    steps.forEach((li) => {
      li.classList.remove("done");
      li.querySelector(".demo-step-check").textContent = "○";
    });

    steps.forEach((li, i) => {
      setTimeout(() => {
        li.classList.add("done");
        li.querySelector(".demo-step-check").textContent = "✓";
      }, (i + 1) * 400);
    });

    setTimeout(() => {
      result.textContent = "✅ Hecho automáticamente en 1.6s (antes: ~25 min manuales por semana).";
      trigger.textContent = "↺ Repetir";
      trigger.disabled = false;
    }, steps.length * 400 + 300);
  });
}

function initDbDemo() {
  const boxes = Array.from(document.querySelectorAll(".db-box"));
  const hint = document.getElementById("db-hint");
  if (boxes.length === 0) return;

  let selected = [];

  function toggleBox(box) {
    const id = box.dataset.id;
    if (selected.includes(id)) {
      selected = selected.filter((x) => x !== id);
      box.classList.remove("selected");
      return;
    }
    if (selected.length === 2) return;
    box.classList.add("selected");
    selected.push(id);

    if (selected.length === 2) {
      const key = [...selected].sort().join("-");
      const connection = document.querySelector(`.db-connection[data-pair="${key}"]`);
      if (connection) {
        connection.classList.add("visible");
        hint.textContent = "";
      } else {
        hint.textContent = 'Sin relación directa entre estas dos — normalmente se conectan a través de "Pedidos".';
      }
      setTimeout(() => {
        boxes.forEach((b) => b.classList.remove("selected"));
        selected = [];
      }, 1000);
    }
  }

  boxes.forEach((box) => {
    box.addEventListener("click", () => toggleBox(box));
    box.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleBox(box);
      }
    });
  });
}

function initIntegrationDemo() {
  const trigger = document.getElementById("integration-trigger");
  const payload = document.getElementById("integration-payload");
  const flow = document.getElementById("integration-flow");
  if (!trigger) return;

  const sourceHub = flow.querySelector('[data-connector="source-hub"]');
  const hub = flow.querySelector('[data-node="hub"]');
  const branches = Array.from(flow.querySelectorAll(".flow-connector-vertical"));
  const destinations = Array.from(flow.querySelectorAll('[data-node="slack"], [data-node="email"], [data-node="db"]'));

  trigger.addEventListener("click", () => {
    trigger.disabled = true;
    payload.hidden = true;
    sourceHub.classList.remove("active");
    hub.classList.remove("active");
    branches.forEach((b) => b.classList.remove("active"));
    destinations.forEach((d) => d.classList.remove("received"));

    // 1. Sheets -> Webhook
    requestAnimationFrame(() => sourceHub.classList.add("active"));

    // 2. Webhook pulsa
    setTimeout(() => hub.classList.add("active"), 500);

    // 3. Webhook -> Slack / Email / DB en paralelo
    setTimeout(() => {
      branches.forEach((b) => b.classList.add("active"));
      destinations.forEach((d) => d.classList.add("received"));
    }, 800);

    // 4. Resultado
    setTimeout(() => {
      payload.textContent = JSON.stringify(
        {
          event: "nueva_fila",
          source: "Google Sheets",
          destinations: ["Slack", "Email", "Base de datos"],
          status: "entregado",
        },
        null,
        2
      );
      payload.hidden = false;
      trigger.textContent = "↺ Repetir evento";
      trigger.disabled = false;
    }, 1400);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAutomationDemo();
  initDbDemo();
  initIntegrationDemo();
});
