import { Link } from "react-router-dom";
import potterImage from "../assets/potter.png";

export default function CallToActionBanner() {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-2xl border-4 border-black bg-[#41cbbc] text-black shadow-[8px_8px_0_#000]">
        <div className="relative flex flex-col sm:flex-row items-center justify-between sm:items-center px-4 sm:px-8 py-8 sm:py-10">
          
          {/* Imagen completamente al borde izquierdo */}
          <div className="absolute left-0 bottom-0 top-0 flex items-center">
            <img
              src={potterImage}
              alt="Mujer trabajando en cerámica"
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Contenedor de texto centrado */}
          <div className="flex flex-col items-end text-right gap-1 ml-auto sm:w-3/5 md:w-1/2">
            <p className="uppercase tracking-[0.35em] text-[11px] sm:text-xs font-semibold">
              ¿Eres tallerista?
            </p>
            <p className="text-sm sm:text-base font-extrabold text-black leading-tight">
              Tu creatividad merece llegar más lejos.
            </p>
            <p className="text-[11px] sm:text-sm text-black leading-tight">
              Publica tu taller en Taller Radar y conecta con personas que buscan aprender lo que tú enseñas.
            </p>
            <p className="text-[11px] sm:text-sm text-black font-semibold leading-tight">
              Publicar tu taller es totalmente gratis.
            </p>

            <Link
              to="/publicar"
              className="mt-3 inline-flex items-center justify-center bg-[#fe9b55] hover:bg-[#7FDC7F] text-black font-semibold px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg border-2 border-black shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_#000] hover:-translate-y-0.5 transition-all duration-200"
            >
              Publicar taller
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
