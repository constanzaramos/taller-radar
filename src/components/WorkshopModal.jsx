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
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-4 text-neutral-500 hover:text-neutral-800 text-xl sm:text-2xl font-bold z-10"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Imagen */}
        {workshop.image && (
          <img
            src={workshop.image}
            alt={workshop.name}
            className="w-full h-40 sm:h-56 object-cover rounded-lg mb-4"
          />
        )}

        {/* Título y categoría */}
        <h2 className="text-lg sm:text-xl font-bold mb-1 pr-8">{workshop.name}</h2>
        <p className="text-sm text-neutral-600 mb-2">
          {Array.isArray(workshop.category)
            ? workshop.category.join(", ")
            : workshop.category}
        </p>

        {/* Fecha */}
        {workshop.multipleDates && workshop.multipleDates.length > 0 ? (
          <div className="text-sm mb-2">
            <span className="font-semibold">📅 Fechas:</span>
            <ul className="list-disc list-inside ml-2 mt-1">
              {workshop.multipleDates.map((date, idx) => (
                <li key={idx}>{formatDateForDisplay(date)}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm mb-2">
            <span className="font-semibold">📅 Fecha:</span>{" "}
            {formatDateForDisplay(workshop.date)}
          </p>
        )}

        {/* Información de taller recurrente */}
        {workshop.isRecurring && workshop.recurringDays && workshop.recurringDays.length > 0 && (
          <div className="text-sm mb-2">
            <span className="font-semibold">🔄 Taller recurrente:</span>
            <div className="ml-2 mt-1">
              <p>Días: {Array.isArray(workshop.recurringDays) ? workshop.recurringDays.join(", ") : workshop.recurringDays}</p>
              {workshop.recurringStart && workshop.recurringEnd && (
                <p>
                  Del {formatDateForDisplay(workshop.recurringStart)} al {formatDateForDisplay(workshop.recurringEnd)}
                </p>
              )}
              {workshop.numberOfClasses && (
                <p className="font-medium text-sky-700">{workshop.numberOfClasses} clases/sesiones</p>
              )}
            </div>
          </div>
        )}

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
        {workshop.confirmPriceOnRegistration ? (
          <p className="text-sm mb-2 font-semibold text-orange-600">
            💰 Precio a confirmar al momento de la inscripción
          </p>
        ) : workshop.price === 0 ? (
          <p className="text-sm mb-2 font-semibold text-green-700">💸 Gratis</p>
        ) : (
          <p className="text-sm mb-2">
            <span className="font-semibold">💰 Precio:</span> ${workshop.price?.toLocaleString("es-CL") || workshop.price}
          </p>
        )}

        {/* Contacto */}
        {workshop.contact && (
          <p className="text-sm mb-2">
            <span className="font-semibold">📞 Contacto:</span>{" "}
            {workshop.contact}
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
        {/* Dirección */}
        {workshop.modality === "presencial" && (
          <>
            {workshop.confirmAddressOnRegistration ? (
              <p className="text-sm mb-2 font-semibold text-orange-600">
                📍 Dirección a confirmar al momento de la inscripción
              </p>
            ) : workshop.fullAddress ? (
              <p className="text-sm mb-2">
                <span className="font-semibold">📍 Dirección:</span> {workshop.fullAddress}
              </p>
            ) : null}
          </>
        )}

        {/* Descripción */}
        {workshop.description && (
          <p className="text-sm mb-4">{workshop.description}</p>
        )}

        {/* Mapa embebido */}
        {workshop.modality === "presencial" && 
         workshop.mapUrl && 
         !workshop.confirmAddressOnRegistration && (
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
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-6">
            <button
              onClick={onReject}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
            >
              Rechazar
            </button>
            <button
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
            >
              Aprobar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
