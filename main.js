/**
 * Carga Retorno Bogotá - lógica de la página
 * - Enlaces de WhatsApp
 * - Formulario de cotización (arma el mensaje y abre WhatsApp)
 * - Botones para copiar datos de contacto
 */
"use strict";

/* ---------- Configuración ---------- */
const CONFIG = {
  // Número en formato internacional, sin "+" ni espacios
  whatsappNumber: "573203320023",
  contactName: "Camilo",
  defaultMessage: "Hola Camilo, quiero cotizar un flete hacia Bogotá.",
  destination: "Bogotá",
  copyFeedbackMs: 1600,
};

/* ---------- Utilidades ---------- */
const buildWhatsAppUrl = (message) =>
  `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

const getFieldValue = (id) => {
  const field = document.getElementById(id);
  return (field && field.value.trim()) || "—";
};

const openInNewTab = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const selectText = (element) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

/* ---------- Módulos ---------- */
function initWhatsAppLinks() {
  const url = buildWhatsAppUrl(CONFIG.defaultMessage);
  document.querySelectorAll(".wa-link").forEach((link) => {
    link.href = url;
  });
}

function buildQuoteMessage() {
  return [
    `Hola ${CONFIG.contactName}, quiero cotizar un flete:`,
    `• Origen: ${getFieldValue("q-origen")}`,
    `• Destino: ${CONFIG.destination}`,
    `• Fecha: ${getFieldValue("q-fecha")}`,
    `• Peso: ${getFieldValue("q-peso")}`,
    `• Mercancía: ${getFieldValue("q-carga")}`,
    `• Nombre/Empresa: ${getFieldValue("q-empresa")}`,
  ].join("\n");
}

function initQuoteForm() {
  const form = document.getElementById("qform");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    openInNewTab(buildWhatsAppUrl(buildQuoteMessage()));
  });
}

function initCopyButtons() {
  document.querySelectorAll(".copy").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copy);
      if (!target) return;

      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        const original = button.textContent;
        button.textContent = "Copiado";
        setTimeout(() => {
          button.textContent = original;
        }, CONFIG.copyFeedbackMs);
      } catch {
        selectText(target);
      }
    });
  });
}

/* ---------- Inicio ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppLinks();
  initQuoteForm();
  initCopyButtons();
});
