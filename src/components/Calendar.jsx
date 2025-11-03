import { useState } from "react";
import { useDate } from "../context/DateContext";

export default function Calendar() {
  const { selectedDate, setSelectedDate } = useDate();
  const tz = "America/Santiago";

  // Estado local del mes y año
  const now = new Date();
  const today = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Obtener el primer día del mes actual
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDay = firstDay.getDay(); // domingo=0, lunes=1, etc.
  const daysInMonth = lastDay.getDate();

  // Días del calendario (llenamos espacios vacíos previos)
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(currentYear, currentMonth, d));
  }

  // Navegar meses
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

  // Seleccionar día
  const handleSelectDay = (day) => {
    if (!day) return;
    const localDay = new Date(
      day.toLocaleString("en-US", { timeZone: tz })
    );
    if (localDay < today.setHours(0, 0, 0, 0)) return; // no permitir días pasados
    setSelectedDate(localDay.toISOString().split("T")[0]);
  };

  // Mostrar mes actual
  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "es-CL",
    { month: "long", year: "numeric" }
  );

  // Función para saber si una fecha es hoy
  const isToday = (date) => {
    if (!date) return false;
    const d = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  // Función para saber si es pasada
  const isPast = (date) => {
    if (!date) return false;
    const d = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    return d < today.setHours(0, 0, 0, 0);
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm text-sm">
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

      <div className="grid grid-cols-7 text-center font-medium text-neutral-700">
        <div>L</div>
        <div>M</div>
        <div>M</div>
        <div>J</div>
        <div>V</div>
        <div>S</div>
        <div>D</div>
      </div>

      <div className="grid grid-cols-7 text-center mt-2">
        {days.map((day, i) => {
          if (!day) return <div key={i}></div>;

          const isSelected =
            selectedDate === day.toISOString().split("T")[0];
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
