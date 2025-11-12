import { useState } from "react";
import { useFilters } from "../context/FilterContext";

export default function Filters() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    selectedModality,
    setSelectedModality,
    selectedCity,
    setSelectedCity,
    availableCities,
    clearFilters,
  } = useFilters();

  const categories = [
    "Creatividad y artes",
    "Cocina y alimentación",
    "Bienestar y salud",
    "Naturaleza y sustentabilidad",
    "Desarrollo personal y profesional",
    "Actividad física",
    "Tecnología y diseño",
  ];

  const priceRanges = [
    { value: "free", label: "Gratis" },
    { value: "0-10000", label: "$0 - $10.000" },
    { value: "10000-30000", label: "$10.000 - $30.000" },
    { value: "30000-50000", label: "$30.000 - $50.000" },
    { value: "50000+", label: "$50.000+" },
  ];

  const hasActiveFilters = selectedCategory || selectedPrice || selectedModality || selectedCity;

  return (
    <div className="relative">
      {/* Botón para abrir/cerrar filtros */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between font-semibold text-black"
      >
        <span className="flex items-center gap-2">
          <span>🔍</span>
          <span>Filtros</span>
          {hasActiveFilters && (
            <span className="bg-[#FE9B55] text-white text-xs px-2 py-0.5 rounded-full border-2 border-black">
              {[selectedCategory, selectedPrice, selectedModality, selectedCity].filter(Boolean).length}
            </span>
          )}
        </span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Panel desplegable de filtros */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-xl p-5 sm:p-6 shadow-[4px_4px_0_#000] space-y-4 z-10">

      {/* Categoría */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">Categoría</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg p-2.5 text-sm focus:border-[#FE9B55] focus:outline-none transition-colors"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Precio */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">Precio</label>
        <select
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg p-2.5 text-sm focus:border-[#FE9B55] focus:outline-none transition-colors"
        >
          <option value="">Todos los precios</option>
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Modalidad */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">Modalidad</label>
        <select
          value={selectedModality}
          onChange={(e) => setSelectedModality(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg p-2.5 text-sm focus:border-[#FE9B55] focus:outline-none transition-colors"
        >
          <option value="">Todas las modalidades</option>
          <option value="presencial">Presencial</option>
          <option value="online">Online</option>
        </select>
      </div>

      {/* Ciudad */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">Localidad</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg p-2.5 text-sm focus:border-[#FE9B55] focus:outline-none transition-colors"
        >
          <option value="">Todas las localidades</option>
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full mt-4 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors border border-gray-300"
            >
              Limpiar todos
            </button>
          )}
        </div>
      )}
    </div>
  );
}

  