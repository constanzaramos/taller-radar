import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import bannerImage from "../assets/banner.png";

export default function Hero() {
  const navigate = useNavigate();

  const handleScrollToWorkshops = useCallback(() => {
    const target = document.getElementById("workshops-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { replace: true });
      requestAnimationFrame(() => {
        const retryTarget = document.getElementById("workshops-section");
        if (retryTarget) {
          retryTarget.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, [navigate]);

  return (
    <section
      className="relative max-w-7xl mx-auto rounded-2xl overflow-hidden min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-screen"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Contenido */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        {/* Lema */}
        <p className="text-left text-base sm:text-lg md:text-xl text-black mb-8 sm:mb-10 font-">
          En Taller Radar conectamos ideas con personas y oficios
        </p>

        {/* Layout principal: izquierda (texto) y derecha (ilustración) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Lado izquierdo - Texto */}
          <div className="space-y-6">

            {/* Título principal */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
                Descubre
              </h1>
              <div className="inline-block">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
                  <span className="bg-[#FE9B55] text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block border-2 border-black shadow-[4px_4px_0_#000]">
                    talleres
                  </span>
                </h1>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
                cerca de tí
              </h1>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
              <button
                type="button"
                onClick={handleScrollToWorkshops}
                className="inline-block bg-[#90EE90] hover:bg-[#7FDC7F] text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 transition-all duration-200 text-base sm:text-lg text-center"
              >
                Encontrar talleres
              </button>
              <Link
                to="/publicar"
                className="inline-block bg-[#90EE90] hover:bg-[#7FDC7F] text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 transition-all duration-200 text-base sm:text-lg text-center"
              >
                Publicar Taller
              </Link>
            </div>
          </div>

          {/* Lado derecho - La ilustración de la antena satelital debería estar en el banner */}
          <div className="hidden lg:block">
            {/* La imagen del banner ya incluye la antena satelital */}
          </div>
        </div>
      </div>
    </section>
  );
}
  