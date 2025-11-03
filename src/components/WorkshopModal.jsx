import { useEffect } from "react";
import { formatDateForDisplay } from "../utils/formatDateLocal";

export default function WorkshopModal({
  workshop,
  onClose,
  isAdminView = false,
  onApprove,
  onReject,
}) {
  if (!workshop) return null;

  // 🔹 Cerrar al presionar la tecla Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-neutral-500 hover:text-neutral-800 text-2xl font-bold"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Imagen */}
        {workshop.image && (
          <img
            src={workshop.image}
            alt={workshop.name}
            className="w-full h-56 object-cover rounded-lg mb-4"
          />
        )}

        {/* Título y categoría */}
        <h2 className="text-xl font-bold mb-1">{workshop.name}</h2>
        <p className="text-sm text-neutral-600 mb-2">
          {Array.isArray(workshop.category)
            ? workshop.category.join(", ")
            : workshop.category}
        </p>

        {/* Fecha */}
        <p className="text-sm mb-2">
          <span className="font-semibold">📅 Fecha:</span>{" "}
          {formatDateForDisplay(workshop.date)}
        </p>

        {/* Hora */}
        {workshop.time && (
          <p className="text-sm mb-2">
            <span className="font-semibold">🕒 Hora:</span> {workshop.time}
          </p>
        )}

        {/* Modalidad */}
        {workshop.modality && (
          <p className="text-sm mb-2">
            <span className="font-semibold">📍 Modalidad:</span>{" "}
            {workshop.modality === "presencial" ? "Presencial" : "Online"}
          </p>
        )}

        {/* Precio */}
        {workshop.price === 0 ? (
          <p className="text-sm mb-2 font-semibold text-green-700">💸 Gratis</p>
        ) : (
          <p className="text-sm mb-2">
            <span className="font-semibold">💰 Precio:</span> ${workshop.price}
          </p>
        )}

        {/* Contacto */}
        {workshop.contact && (
          <p className="text-sm mb-2">
            <span className="font-semibold">📞 Contacto:</span> {workshop.contact}
          </p>
        )}

        {/* Redes */}
        {workshop.social && (
          <p className="text-sm mb-2">
            <span className="font-semibold">🔗 Redes:</span>{" "}
            <a
              href={workshop.social}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:underline"
            >
              Ver perfil
            </a>
          </p>
        )}

        {/* Descripción */}
        {workshop.description && (
          <p className="text-sm mb-4">{workshop.description}</p>
        )}

        {/* Mapa embebido */}
        {workshop.modality === "presencial" && workshop.mapUrl && (
          <iframe
            src={workshop.mapUrl}
            className="w-full h-48 rounded-lg border"
            allowFullScreen
            loading="lazy"
            title="Ubicación del taller"
          ></iframe>
        )}

        {/* 🧭 Controles de aprobación solo en modo admin */}
        {isAdminView && (
          <div className="flex justify-between mt-6">
            <button
              onClick={onReject}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Rechazar
            </button>
            <button
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Aprobar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
