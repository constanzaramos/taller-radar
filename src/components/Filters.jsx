import { useFilters } from "../context/FilterContext";

export default function Filters() {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    selectedModality,
    setSelectedModality,
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

  const hasActiveFilters = selectedCategory || selectedPrice || selectedModality;

  return (
    <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0_#000] space-y-3 text-sm">
      <h3 className="font-semibold mb-2 text-base text-black">Filtros</h3>

      {/* Categoría */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">Categoría</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
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
        <label className="block text-xs text-gray-600 mb-1">Precio</label>
        <select
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
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
        <label className="block text-xs text-gray-600 mb-1">Modalidad</label>
        <select
          value={selectedModality}
          onChange={(e) => setSelectedModality(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
        >
          <option value="">Todas las modalidades</option>
          <option value="presencial">Presencial</option>
          <option value="online">Online</option>
        </select>
      </div>

      {/* Tags de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-3 space-y-2">
          <div className="text-xs font-medium text-gray-600">Filtros activos:</div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <div className="bg-[#A48FC9] border-2 border-black rounded-lg px-3 py-1.5 text-white text-xs font-medium flex items-center gap-2 shadow-[2px_2px_0_#000]">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory("")}
                  className="hover:bg-[#8a75b8] rounded px-1"
                  aria-label="Eliminar filtro"
                >
                  ✕
                </button>
              </div>
            )}
            {selectedPrice && (
              <div className="bg-[#A48FC9] border-2 border-black rounded-lg px-3 py-1.5 text-white text-xs font-medium flex items-center gap-2 shadow-[2px_2px_0_#000]">
                <span>{priceRanges.find(r => r.value === selectedPrice)?.label || selectedPrice}</span>
                <button
                  onClick={() => setSelectedPrice("")}
                  className="hover:bg-[#8a75b8] rounded px-1"
                  aria-label="Eliminar filtro"
                >
                  ✕
                </button>
              </div>
            )}
            {selectedModality && (
              <div className="bg-[#A48FC9] border-2 border-black rounded-lg px-3 py-1.5 text-white text-xs font-medium flex items-center gap-2 shadow-[2px_2px_0_#000]">
                <span>{selectedModality === "presencial" ? "Presencial" : "Online"}</span>
                <button
                  onClick={() => setSelectedModality("")}
                  className="hover:bg-[#8a75b8] rounded px-1"
                  aria-label="Eliminar filtro"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="w-full mt-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
          >
            Limpiar todos
          </button>
        </div>
      )}
    </div>
  );
}

  