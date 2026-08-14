// EtchTechnologies — Cotizador de servicios
// Cálculo de rango de precios client-side + envío a Supabase y EmailJS.
// SERVICES, currencyFmt y tierForService vienen de services-data.js (cargado antes que este archivo).

function renderServiceCheckboxes() {
  const list = document.getElementById("services-list");
  list.innerHTML = window.SERVICES.map(
    (s) => `
    <label class="checkbox-item">
      <input type="checkbox" name="servicio" value="${s.id}" />
      <span class="checkbox-item-text">
        <span class="checkbox-item-title">${s.label}</span>
        <span class="checkbox-item-desc">${s.desc}</span>
      </span>
      <span class="checkbox-item-tier" title="Nivel de inversión referencial">${window.tierForService(s)}</span>
    </label>`
  ).join("");

  list.addEventListener("change", updateEstimate);
}

function getSelectedServices() {
  const checked = Array.from(
    document.querySelectorAll('input[name="servicio"]:checked')
  ).map((el) => el.value);
  return window.SERVICES.filter((s) => checked.includes(s.id));
}

function preselectServices(ids) {
  document.querySelectorAll('input[name="servicio"]').forEach((el) => {
    el.checked = ids.includes(el.value);
  });
  updateEstimate();
  document.getElementById("cotizador").scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("preselect-services", (event) => {
  preselectServices(event.detail.ids || []);
});

function updateEstimate() {
  const selected = getSelectedServices();
  const estimateValue = document.getElementById("estimate-value");

  if (selected.length === 0) {
    estimateValue.textContent = "Selecciona al menos un servicio";
    return;
  }

  const min = selected.reduce((sum, s) => sum + s.min, 0);
  const max = selected.reduce((sum, s) => sum + s.max, 0);
  estimateValue.textContent = `${window.currencyFmt.format(min)} - ${window.currencyFmt.format(max)}`;
}

function getEstimateText() {
  const selected = getSelectedServices();
  if (selected.length === 0) return "";
  const min = selected.reduce((sum, s) => sum + s.min, 0);
  const max = selected.reduce((sum, s) => sum + s.max, 0);
  return `${window.currencyFmt.format(min)} - ${window.currencyFmt.format(max)}`;
}

function setStatus(message, type) {
  const status = document.getElementById("form-status");
  status.textContent = message;
  status.className = "form-status" + (type ? ` ${type}` : "");
}

function getConfig() {
  const cfg = window.APP_CONFIG;
  if (!cfg || !cfg.SUPABASE_URL || cfg.SUPABASE_URL.includes("YOUR_PROJECT")) {
    return null;
  }
  return cfg;
}

async function handleSubmit(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const selected = getSelectedServices();

  if (!nombre || !email) {
    setStatus("Por favor completa nombre y email.", "error");
    return;
  }
  if (selected.length === 0) {
    setStatus("Selecciona al menos un servicio.", "error");
    return;
  }

  const cfg = getConfig();
  if (!cfg) {
    setStatus(
      "Configuración no encontrada. Copia config.example.js a config.js y llena tus valores.",
      "error"
    );
    return;
  }

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;
  setStatus("Enviando...", "");

  const serviciosTexto = selected.map((s) => s.label).join(", ");
  const rangoEstimado = getEstimateText();
  const fecha = new Date().toISOString();

  try {
    const supabaseClient = window.supabase.createClient(
      cfg.SUPABASE_URL,
      cfg.SUPABASE_ANON_KEY
    );

    const { error: dbError } = await supabaseClient.from("cotizaciones").insert({
      nombre,
      email,
      telefono: telefono || null,
      servicios: serviciosTexto,
      mensaje: mensaje || null,
      rango_estimado: rangoEstimado,
    });

    if (dbError) throw dbError;

    await window.emailjs.send(
      cfg.EMAILJS_SERVICE_ID,
      cfg.EMAILJS_TEMPLATE_ID,
      {
        from_name: nombre,
        from_email: email,
        phone: telefono || "N/A",
        services: serviciosTexto,
        estimated_price: rangoEstimado,
        message: mensaje || "N/A",
        date: fecha,
      },
      { publicKey: cfg.EMAILJS_PUBLIC_KEY }
    );

    setStatus("¡Cotización enviada! Te contactaremos pronto.", "success");
    document.getElementById("quote-form").reset();
    updateEstimate();
  } catch (err) {
    console.error(err);
    setStatus(
      "Ocurrió un error al enviar tu cotización. Intenta de nuevo o escríbenos directamente.",
      "error"
    );
  } finally {
    submitBtn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderServiceCheckboxes();
  document.getElementById("quote-form").addEventListener("submit", handleSubmit);
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
