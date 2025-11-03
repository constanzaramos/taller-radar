import { useState } from "react";
import { useDate } from "../context/DateContext";

export default function Calendar() {
  const { selectedDate, setSelectedDate } = useDate();
  const tz = "America/Santiago";

  // 🔹 Obtener fecha actual en zona horaria Chile
  const now = new Date();
  const today = new Date(now.toLocaleString("en-US", { timeZone: tz }));

  // Estado del mes/año visibles en el calendario
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Calcular primeros y últimos días del mes
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDay = (firstDay.getDay() + 6) % 7; // lunes=0
  const daysInMonth = lastDay.getDate();

  // Generar array de días del mes (con huecos iniciales)
  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(currentYear, currentMonth, d));
  }

  // 🔄 Navegar meses
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // 📅 Seleccionar día
  const handleSelectDay = (day) => {
    if (!day) return;
    const localDay = new Date(day.toLocaleString("en-US", { timeZone: tz }));
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    if (localDay < startOfToday) return; // ❌ no permitir días pasados
    setSelectedDate(localDay.toISOString().split("T")[0]);
  };

  // 🗓 Nombre del mes
  const monthName = new Date(currentYear, currentMonth).toLocaleString("es-CL", {
    month: "long",
    year: "numeric",
  });

  // ✅ Comprobaciones de fecha
  const isToday = (date) => {
    if (!date) return false;
    const d = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (date) => {
    if (!date) return false;
    const d = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    return d < startOfToday;
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm text-sm">
      {/* Header de navegación */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1 text-sky-700 hover:text-sky-900 transition"
        >
          ◀
        </button>
        <h3 className="font-semibold capitalize">{monthName}</h3>
        <button
          onClick={handleNextMonth}
          className="p-1 text-sky-700 hover:text-sky-900 transition"
        >
          ▶
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 text-center font-medium text-neutral-700">
        <div>L</div>
        <div>M</div>
        <div>M</div>
        <div>J</div>
        <div>V</div>
        <div>S</div>
        <div>D</div>
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 text-center mt-2">
        {days.map((day, i) => {
          if (!day) return <div key={i}></div>;

          const isSelected = selectedDate === day.toISOString().split("T")[0];
          const past = isPast(day);
          const todayCheck = isToday(day);

          return (
            <button
              key={i}
              disabled={past}
              onClick={() => handleSelectDay(day)}
              className={`m-1 p-2 rounded-lg transition-all ${
                past
                  ? "text-neutral-400 cursor-not-allowed"
                  : isSelected
                  ? "bg-sky-700 text-white font-semibold"
                  : todayCheck
                  ? "border border-sky-500 text-sky-700 font-medium"
                  : "hover:bg-sky-100 text-neutral-700"
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
