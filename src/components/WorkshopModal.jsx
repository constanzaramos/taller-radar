import { useEffect } from "react";
import { formatDateForDisplay } from "../utils/formatDateLocal";

export default function WorkshopModal({
  workshop,
  onClose,
  isAdminView = false,
  onApprove,
  onReject,
}) {
  const isOpen = Boolean(workshop);

  // 🔹 Cerrar al presionar la tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0_#000] max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-6 text-neutral-500 hover:text-black text-2xl sm:text-3xl font-bold z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
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
        <h2 className="text-xl sm:text-2xl font-bold mb-3 pr-10 text-black leading-tight">{workshop.name}</h2>
        <p className="text-sm text-neutral-600 mb-2">
          {Array.isArray(workshop.category)
            ? workshop.category.join(", ")
            : workshop.category}
        </p>

        {/* Fecha */}
        {workshop.multipleDates && workshop.multipleDates.length > 0 ? (
          <div className="text-sm mb-2 font-manrope">
            <span className="font-semibold">📅 Fechas:</span>
            <ul className="list-disc list-inside ml-2 mt-1">
              {workshop.multipleDates.map((date, idx) => (
                <li key={idx}>{formatDateForDisplay(date)}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm mb-2 font-manrope">
            <span className="font-semibold">📅 Fecha:</span>{" "}
            {formatDateForDisplay(workshop.date)}
          </p>
        )}

        {/* Información de taller recurrente */}
        {workshop.isRecurring && workshop.recurringDays && workshop.recurringDays.length > 0 && (
          <div className="text-sm mb-2 font-manrope">
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
          <p className="text-sm mb-2 font-manrope">
            <span className="font-semibold">🕒 Hora:</span> {workshop.time}
          </p>
        )}

        {/* Modalidad */}
        {workshop.modality && (
          <p className="text-sm mb-2 font-manrope">
            <span className="font-semibold">📍 Modalidad:</span>{" "}
            {workshop.modality === "presencial" ? "Presencial" : "Online"}
          </p>
        )}

        {/* Precio */}
        {workshop.confirmPriceOnRegistration ? (
          <p className="text-sm mb-2 font-manrope font-semibold text-orange-600">
            💰 Precio a confirmar al momento de la inscripción
          </p>
        ) : workshop.price === 0 ? (
          <p className="text-sm mb-2 font-manrope font-semibold text-green-700">💸 Gratis</p>
        ) : (
          <p className="text-sm mb-2 font-manrope">
            <span className="font-semibold">💰 Precio:</span> ${workshop.price?.toLocaleString("es-CL") || workshop.price}
          </p>
        )}

        {/* Contacto */}
        {workshop.contact && (
          <p className="text-sm mb-2 font-manrope">
            <span className="font-semibold">📞 Contacto:</span>{" "}
            {workshop.contact}
          </p>
        )}

        {/* Redes */}
        {workshop.social && (
          <p className="text-sm mb-2 font-manrope">
            <span className="font-semibold">🔗 Redes:</span>{" "}
            <a
              href={typeof workshop.social === 'string' ? workshop.social : (Array.isArray(workshop.social) && workshop.social.length > 0 ? workshop.social[0] : '#')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:underline"
            >
              {(() => {
                // Extraer el @ de la URL de Instagram
                let url = '';
                if (typeof workshop.social === 'string') {
                  url = workshop.social;
                } else if (Array.isArray(workshop.social) && workshop.social.length > 0) {
                  url = typeof workshop.social[0] === 'string' ? workshop.social[0] : (workshop.social[0]?.handle || workshop.social[0] || '');
                } else if (workshop.social && typeof workshop.social === 'object') {
                  url = workshop.social.handle || workshop.social.url || '';
                }
                
                if (!url || typeof url !== 'string') {
                  return "Ver perfil";
                }
                
                const match = url.match(/instagram\.com\/([^/?]+)/);
                const username = match ? match[1] : null;
                return username ? `@${username}` : "Ver perfil";
              })()}
            </a>
          </p>
        )}
        {/* Dirección */}
        {workshop.modality === "presencial" && (
          <>
            {workshop.confirmAddressOnRegistration ? (
              <p className="text-sm mb-2 font-manrope text-orange-600">
                📍 Dirección a confirmar al momento de la inscripción
              </p>
            ) : workshop.fullAddress ? (
              <p className="text-sm mb-2 font-manrope">
                <span className="font-semibold">📍 Dirección:</span> {workshop.fullAddress}
              </p>
            ) : null}
          </>
        )}

        {/* Descripción */}
        {workshop.description && (
          <p className="text-sm mb-4 font-manrope text-justify leading-relaxed">
            {workshop.description}
          </p>
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
