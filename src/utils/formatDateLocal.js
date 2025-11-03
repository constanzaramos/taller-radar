// src/utils/formatDateLocal.js

// 🔧 Parse flexible: acepta ISO (YYYY-MM-DDTHH:mm:ssZ) y plano (YYYY-MM-DD)
const parseLocalDateFlexible = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return dateInput;
  const s = String(dateInput);
  if (s.includes("T")) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, y, m, d] = match;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

// 🔹 YYYY-MM-DD consistente
// Si ya viene como YYYY-MM-DD, devolver tal cual (sin tocar zonas horarias)
export const getLocalDateString = (dateInput) => {
  if (!dateInput) return "";
  const s = String(dateInput);
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) return s;
  const dateObj = parseLocalDateFlexible(s);
  if (!dateObj) return "";
  return dateObj.toLocaleDateString("en-CA", { timeZone: "America/Santiago" });
};

// 🔹 Texto legible en español (Chile)
export const formatDateForDisplay = (dateInput) => {
  if (!dateInput) return "";
  const s = String(dateInput);
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, y, m, d] = match;
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return `${Number(d)} de ${months[Number(m) - 1]} de ${y}`;
  }
  const dateObj = parseLocalDateFlexible(s);
  if (!dateObj) return "";
  return dateObj.toLocaleDateString("es-CL", {
    timeZone: "America/Santiago",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
