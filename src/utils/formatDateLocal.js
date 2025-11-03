// src/utils/formatDateLocal.js

// 🔹 Asegura que el string "YYYY-MM-DD" se interprete en hora local (Chile)
export const getLocalDateString = (dateString) => {
  if (!dateString) return "";
  // Agrega la hora 12:00 para evitar el corrimiento de fecha por zona horaria
  const localDate = new Date(`${dateString}T12:00:00`);
  return localDate.toLocaleDateString("en-CA", { timeZone: "America/Santiago" }); // YYYY-MM-DD
};

// 🔹 Para mostrarlo en español correctamente
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const localDate = new Date(`${dateString}T12:00:00`);
  return localDate.toLocaleDateString("es-CL", {
    timeZone: "America/Santiago",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
