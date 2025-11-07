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
    <div className="bg-[#24cbb6] border-2 border-black rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0_#000] text-xs sm:text-sm">
      {/* Header de navegación */}
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1 sm:p-2 text-black font-bold hover:bg-white/30 rounded transition"
          aria-label="Mes anterior"
        >
          ◀
        </button>
        <h3 className="font-semibold capitalize text-xs sm:text-sm md:text-base px-2 text-center">
          {monthName}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1 sm:p-2 text-black font-bold hover:bg-white/30 rounded transition"
          aria-label="Mes siguiente"
        >
          ▶
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 text-center font-medium text-neutral-700 text-xs sm:text-sm mb-1">
        <div>L</div>
        <div>M</div>
        <div>M</div>
        <div>J</div>
        <div>V</div>
        <div>S</div>
        <div>D</div>
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mt-1">
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
              className={`min-w-[1.75rem] sm:min-w-[2.5rem] w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-all border-2 text-xs sm:text-sm ${
                past
                  ? "text-neutral-400 cursor-not-allowed border-transparent"
                  : isSelected
                  ? "bg-orange text-black font-bold border-black shadow-[2px_2px_0_#000]"
                  : todayCheck
                  ? "border-sky-500 text-sky-700 font-medium border-transparent hover:border-sky-500"
                  : "border-transparent hover:bg-white/50 text-black"
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
