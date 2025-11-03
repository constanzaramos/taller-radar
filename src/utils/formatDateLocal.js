/**
 * Convierte cualquier fecha (string, Timestamp o Date) al formato local sin
 * perder un día por diferencia UTC.
 * Retorna un string con formato YYYY-MM-DD.
 */
export const getLocalDateString = (dateValue) => {
    if (!dateValue) return null;
  
    try {
      let jsDate;
  
      // 🔹 Caso Firestore Timestamp
      if (dateValue.seconds) {
        jsDate = new Date(dateValue.seconds * 1000);
      } else {
        jsDate = new Date(dateValue);
      }
  
      if (isNaN(jsDate.getTime())) return null;
  
      // 🔹 Ajuste a hora local
      const localDate = new Date(
        jsDate.getTime() - jsDate.getTimezoneOffset() * 60000
      );
  
      return localDate.toISOString().split("T")[0];
    } catch {
      return null;
    }
  };
  
  /**
   * Formatea una fecha para mostrarla en formato legible (DD de mes de YYYY)
   * Ej: "4 de noviembre de 2025"
   */
  export const formatDateForDisplay = (dateValue) => {
    const dateStr = getLocalDateString(dateValue);
    if (!dateStr) return "Sin fecha";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  