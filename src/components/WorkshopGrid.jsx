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
  const { selectedCategory, selectedPrice, selectedModality, setSelectedCategory, setSelectedPrice, setSelectedModality } = useFilters();
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

  const priceRanges = [
    { value: "free", label: "Gratis" },
    { value: "0-10000", label: "$0 - $10.000" },
    { value: "10000-30000", label: "$10.000 - $30.000" },
    { value: "30000-50000", label: "$30.000 - $50.000" },
    { value: "50000+", label: "$50.000+" },
  ];

  const hasActiveFilters = selectedCategory || selectedPrice || selectedModality;

  return (
    <div>
      {/* Botón para volver a ver todos */}
      {selectedDate && (
        <div className="mb-6">
          <button
            onClick={() => setSelectedDate(null)}
            className="text-[#41CBBC] text-sm font-semibold hover:text-[#FE9B55] transition-colors flex items-center gap-2"
          >
            <span>↩</span>
            <span>Ver todos los talleres</span>
          </button>
        </div>
      )}

      {/* Pills de filtros activos */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          {selectedCategory && (
            <div className="bg-[#A48FC9] border-2 border-black rounded-full px-4 py-2 text-white text-sm font-medium flex items-center gap-2 shadow-[2px_2px_0_#000]">
              <span>{selectedCategory}</span>
              <button
                onClick={() => setSelectedCategory("")}
                className="hover:bg-[#8a75b8] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                aria-label="Eliminar filtro"
              >
                ✕
              </button>
            </div>
          )}
          {selectedPrice && (
            <div className="bg-[#A48FC9] border-2 border-black rounded-full px-4 py-2 text-white text-sm font-medium flex items-center gap-2 shadow-[2px_2px_0_#000]">
              <span>{priceRanges.find(r => r.value === selectedPrice)?.label || selectedPrice}</span>
              <button
                onClick={() => setSelectedPrice("")}
                className="hover:bg-[#8a75b8] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                aria-label="Eliminar filtro"
              >
                ✕
              </button>
            </div>
          )}
          {selectedModality && (
            <div className="bg-[#A48FC9] border-2 border-black rounded-full px-4 py-2 text-white text-sm font-medium flex items-center gap-2 shadow-[2px_2px_0_#000]">
              <span>{selectedModality === "presencial" ? "Presencial" : "Online"}</span>
              <button
                onClick={() => setSelectedModality("")}
                className="hover:bg-[#8a75b8] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                aria-label="Eliminar filtro"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid de talleres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 relative">
        {paginatedWorkshops.length > 0 ? (
          paginatedWorkshops.map((w) => (
            <div
              key={w.id}
              className="border-2 border-black rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-[#FFFBF0] shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 cursor-pointer transition-all duration-200"
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
                <div className="w-full h-32 sm:h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-xs sm:text-sm border-2 border-black rounded-lg">
                  Sin imagen
                </div>
              )}

              {/* Información principal */}
              <h3 className="font-semibold mt-2 text-sm sm:text-base line-clamp-2 text-black">{w.name}</h3>
              <p className="text-xs sm:text-sm text-black line-clamp-1 mt-1">
                {Array.isArray(w.category) ? w.category.join(", ") : w.category}
              </p>
              <p className="text-xs sm:text-sm text-black mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#FE9B55] rounded-full"></span>
                {formatDateForDisplay(w.date)}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 sm:py-16">
            <p className="text-neutral-500 text-base sm:text-lg mb-2">🗓️</p>
            <p className="text-neutral-600 text-sm sm:text-base font-medium">
              No hay talleres disponibles
            </p>
            {selectedDate && (
              <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                Prueba seleccionando otra fecha o limpiando los filtros
              </p>
            )}
          </div>
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
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
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
                        ? "bg-[#A48FC9] text-white shadow-[2px_2px_0_#000]"
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
