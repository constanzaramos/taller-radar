import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useDate } from "../context/DateContext";
import { useFilters } from "../context/FilterContext";
import WorkshopModal from "./WorkshopModal";
import { getLocalDateString, formatDateForDisplay } from "../utils/formatDateLocal";

export default function WorkshopGrid() {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedDate, setSelectedDate } = useDate();
  const { selectedCategory, selectedPrice, selectedModality } = useFilters();
  const ITEMS_PER_PAGE = 9;

  // 🔥 Obtener talleres aprobados en tiempo real desde Firestore
  useEffect(() => {
    const q = collection(db, "workshops");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Filtrar talleres aprobados (verificar tanto approved como status)
      const data = allData.filter((w) => {
        // Aceptar si approved es true O si status es "approved"
        return w.approved === true || w.status === "approved";
      });
      
      setWorkshops(data);
    });
    return () => unsubscribe();
  }, []);

  // 🎯 Filtrar talleres por fecha y otros filtros
  const filteredWorkshops = workshops.filter((w) => {
    // Filtro por fecha
    if (selectedDate) {
      const workshopDate = getLocalDateString(w.date);
      if (workshopDate !== selectedDate) return false;
    }

    // Filtro por categoría
    if (selectedCategory) {
      const workshopCategories = Array.isArray(w.category) ? w.category : [w.category];
      if (!workshopCategories.includes(selectedCategory)) return false;
    }

    // Filtro por precio
    if (selectedPrice) {
      // Si el precio se confirma al inscribirse, excluirlo del filtro de "Gratis"
      if (w.confirmPriceOnRegistration && selectedPrice === "free") {
        return false;
      }

      const price = w.price || 0;
      switch (selectedPrice) {
        case "free":
          // Solo mostrar si es gratis Y no tiene precio a confirmar
          if (price !== 0 || w.confirmPriceOnRegistration) return false;
          break;
        case "0-10000":
          if (price === 0 || price > 10000) return false;
          break;
        case "10000-30000":
          if (price < 10000 || price > 30000) return false;
          break;
        case "30000-50000":
          if (price < 30000 || price > 50000) return false;
          break;
        case "50000+":
          if (price < 50000) return false;
          break;
      }
    }

    // Filtro por modalidad
    if (selectedModality) {
      if (w.modality !== selectedModality) return false;
    }

    return true;
  });

  // 📄 Paginación
  const totalPages = Math.ceil(filteredWorkshops.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedWorkshops = filteredWorkshops.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedCategory, selectedPrice, selectedModality, filteredWorkshops.length]);

  // Navegación de páginas
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

      {/* Información de resultados */}
      {filteredWorkshops.length > 0 && (
        <div className="mb-4 text-sm text-neutral-600">
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredWorkshops.length)} de {filteredWorkshops.length} talleres
        </div>
      )}

      {/* Grid de talleres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 relative">
        {paginatedWorkshops.length > 0 ? (
          paginatedWorkshops.map((w) => (
            <div
              key={w.id}
              className="border-2 border-black rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-white shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 cursor-pointer transition-all duration-200"
              onClick={() => setSelectedWorkshop(w)}
            >
              {/* Imagen */}
              {w.image ? (
                <div className="w-full min-h-[150px] sm:min-h-[200px] max-h-[250px] sm:max-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={w.image}
                    alt={w.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-32 sm:h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-xs sm:text-sm border-2 border-black rounded-lg">
                  Sin imagen
                </div>
              )}

              {/* Información principal */}
              <h3 className="font-semibold mt-2 text-sm sm:text-base line-clamp-2">{w.name}</h3>
              <p className="text-xs sm:text-sm text-neutral-600 line-clamp-1">
                {Array.isArray(w.category) ? w.category.join(", ") : w.category}
              </p>
              <p className="text-xs sm:text-sm text-neutral-500">
                {formatDateForDisplay(w.date)}
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-neutral-500 italic py-8 sm:py-10 text-sm sm:text-base">
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

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          {/* Botón anterior */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border-2 border-black font-semibold text-sm ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 shadow-[2px_2px_0_#000] hover:translate-y-[1px]"
            }`}
          >
            ← Anterior
          </button>

          {/* Números de página */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Mostrar todas las páginas si son pocas, o mostrar páginas cercanas
              if (
                totalPages <= 7 ||
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[2.5rem] px-3 py-2 rounded-lg border-2 border-black font-semibold text-sm ${
                      currentPage === page
                        ? "bg-sky-700 text-white shadow-[2px_2px_0_#000]"
                        : "bg-white hover:bg-gray-50 shadow-[2px_2px_0_#000] hover:translate-y-[1px]"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span key={page} className="px-2 text-neutral-500">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          {/* Botón siguiente */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border-2 border-black font-semibold text-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 shadow-[2px_2px_0_#000] hover:translate-y-[1px]"
            }`}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
