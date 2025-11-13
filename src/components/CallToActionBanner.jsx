import { Link } from "react-router-dom";
import potterImage from "../assets/potter.png";

export default function CallToActionBanner() {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-2xl border-4 border-black bg-[#41cbbc] text-black shadow-[8px_8px_0_#000]">
        <div className="relative flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
          
          {/* Imagen - Responsive: arriba en móvil, izquierda en desktop */}
          <div className="absolute left-0 bottom-0 top-0 hidden md:flex items-center z-0">
            <img
              src={potterImage}
              alt="Mujer trabajando en cerámica"
              className="h-full w-auto object-contain max-h-full"
            />
          </div>
          
          {/* Imagen móvil - centrada arriba */}
          <div className="md:hidden w-full flex justify-center mb-4 z-10">
            <img
              src={potterImage}
              alt="Mujer trabajando en cerámica"
              className="h-32 sm:h-40 w-auto object-contain"
            />
          </div>

          {/* Contenedor de texto - Responsive: centrado en móvil, derecha en desktop */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1 md:gap-2 w-full md:w-3/5 lg:w-1/2 md:ml-auto z-10">
            <p className="uppercase tracking-[0.35em] text-[10px] sm:text-[11px] md:text-xs font-semibold">
              ¿Eres tallerista?
            </p>
            <p className="text-sm sm:text-base md:text-lg font-extrabold text-black leading-tight">
              Tu creatividad merece llegar más lejos.
            </p>
            <p className="text-[10px] sm:text-[11px] md:text-sm text-black leading-relaxed max-w-md md:max-w-none">
              Publica tu taller en Taller Radar y conecta con personas que buscan aprender lo que tú enseñas.
            </p>
            <p className="text-[10px] sm:text-[11px] md:text-sm text-black font-semibold leading-tight">
              Publicar tu taller es totalmente gratis.
            </p>

            <Link
              to="/publicar"
              className="mt-3 md:mt-4 inline-flex items-center justify-center bg-[#fe9b55] hover:bg-[#7FDC7F] text-black font-semibold px-4 sm:px-5 md:px-6 py-2 md:py-2.5 text-xs sm:text-sm md:text-base rounded-lg border-2 border-black shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_#000] hover:-translate-y-0.5 transition-all duration-200"
            >
              Publicar taller
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
