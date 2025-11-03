import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useDate } from "../context/DateContext";
import WorkshopModal from "./WorkshopModal";

// 🕓 Corrige la interpretación local del string de fecha ("YYYY-MM-DD")
const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  // No genera offset UTC → fecha local pura
  return new Date(year, month - 1, day);
};

// 🎯 Formato para mostrar la fecha correctamente (Chile)
const formatDateForDisplay = (dateString) => {
  const localDate = parseLocalDate(dateString);
  if (!localDate) return "";
  return localDate.toLocaleDateString("es-CL", {
    timeZone: "America/Santiago",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// 🔹 Devuelve string en formato YYYY-MM-DD (para comparación con el calendario)
const getLocalDateString = (dateString) => {
  const localDate = parseLocalDate(dateString);
  if (!localDate) return "";
  return localDate.toLocaleDateString("en-CA", { timeZone: "America/Santiago" });
};

export default function WorkshopGrid() {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const { selectedDate, setSelectedDate } = useDate();

  // 🔥 Obtener talleres aprobados en tiempo real desde Firestore
  useEffect(() => {
    const q = collection(db, "workshops");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((w) => w.approved === true);
      setWorkshops(data);
    });
    return () => unsubscribe();
  }, []);

  // 🎯 Filtrar talleres por fecha seleccionada
  const filteredWorkshops = selectedDate
    ? workshops.filter((w) => {
        const workshopDate = getLocalDateString(w.date);
        return workshopDate === selectedDate;
      })
    : workshops;

  return (
    <div>
      {/* Botón para volver a ver todos */}
      {selectedDate && (
        <div className="mb-4">
          <button
            onClick={() => setSelectedDate(null)}
            className="text-sky-700 text-sm font-medium hover:underline"
          >
            🔁 Ver todos los talleres
          </button>
        </div>
      )}

      {/* Grid de talleres */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map((w) => (
            <div
              key={w.id}
              className="border rounded-xl p-3 bg-white hover:shadow-lg cursor-pointer transition duration-200"
              onClick={() => setSelectedWorkshop(w)}
            >
              {/* Imagen */}
              {w.image ? (
                <img
                  src={w.image}
                  alt={w.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}

              {/* Información principal */}
              <h3 className="font-semibold mt-2">{w.name}</h3>
              <p className="text-sm text-neutral-600">
                {Array.isArray(w.category) ? w.category.join(", ") : w.category}
              </p>
              <p className="text-sm text-neutral-500">
                {formatDateForDisplay(w.date)}
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-neutral-500 italic py-10">
            🗓️ No hay talleres para este día
          </p>
        )}

        {/* Modal de detalle */}
        {selectedWorkshop && (
          <WorkshopModal
            workshop={selectedWorkshop}
            onClose={() => setSelectedWorkshop(null)}
          />
        )}
      </div>
    </div>
  );
}
