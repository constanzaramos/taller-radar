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
    setSelectedDate(localDay.toISOString().split("T")[0]);
  };

  // 🗓 Nombre del mes
  const displayDate = new Date(currentYear, currentMonth);
  const monthName = `${displayDate.toLocaleString("es-CL", { month: "long" })} ${displayDate.getFullYear()}`;

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
    <div className="bg-[#41CBBC] border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_#000]">
      {/* Header de navegación */}
      <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1 sm:p-2 text-black font-bold hover:bg-white/30 rounded transition"
          aria-label="Mes anterior"
        >
          ◀
        </button>
        <h3 className="font-semibold capitalize text-xs sm:text-sm md:text-base px-2 text-center text-black">
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
      <div className="grid grid-cols-7 text-center font-bold text-black text-xs sm:text-sm mb-2 gap-1">
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
              onClick={() => handleSelectDay(day)}
              className={`min-w-[1.75rem] sm:min-w-[2.5rem] w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-all border-2 text-xs sm:text-sm ${
                isSelected
                  ? "bg-[#FE9B55] text-black font-bold border-black shadow-[2px_2px_0_#000]"
                  : past
                  ? "border-transparent hover:bg-white/50 text-neutral-400"
                  : todayCheck
                  ? "border-black text-black font-medium hover:bg-white/50"
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
