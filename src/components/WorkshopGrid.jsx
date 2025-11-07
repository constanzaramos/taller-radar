import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useDate } from "../context/DateContext";
import WorkshopModal from "./WorkshopModal";
import { getLocalDateString, formatDateForDisplay } from "../utils/formatDateLocal";

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
              className="border-2 border-black rounded-2xl p-3 bg-white shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 cursor-pointer transition-all duration-200"
              onClick={() => setSelectedWorkshop(w)}
            >
              {/* Imagen */}
              {w.image ? (
                <div className="w-full min-h-[200px] max-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={w.image}
                    alt={w.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border-2 border-black rounded-lg">
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
