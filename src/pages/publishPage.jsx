import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WorkshopForm from "../components/WorkshopForm";
import phon from "../assets/phon.png";

export default function PublishPage() {
  return (
    <div className="min-h-screen bg-[#FFF7F0] flex flex-col">
      <NavBar />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-16 items-start">
            {/* Narrativa principal */}
            <div className="relative flex flex-col gap-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black leading-[1.05]">
                Deja de publicar en todas partes.
                </h1>
                <p className="text-base sm:text-lg text-neutral-700 max-w-xl leading-relaxed">
                  En Taller Radar reunimos talleres creativos y manuales en un solo lugar para que más personas
                  descubran tu propuesta.
                </p>
              </div>

              <div className="relative max-w-sm">
                <div className="bg-[#41CBBC] border-2 border-black rounded-[28px] px-6 py-5 shadow-[4px_4px_0_#000]">
                  <p className="text-sm sm:text-base font-medium text-black leading-relaxed">
                    Publica <span className="font-black">GRATIS</span> tu taller y llega a quienes están buscando aprender algo nuevo.
                  </p>
                </div>
                <div className="absolute -bottom-5 left-12 w-10 h-10 bg-[#41CBBC] border-b-2 border-r-2 border-black rotate-45"></div>
              </div>

              <div className="relative mt-4">
                <div className="absolute -top-10 -left-10 w-40 h-30 rounded-full opacity-70 blur-[1px]"></div>
                <img
                  src={phon}
                  alt="Persona respondiendo múltiples teléfonos"
                  className="relative w-full max-w-[520px] lg:max-w-[520px] rounded-lg"
                />
              </div>
            </div>

            {/* Formulario */}
            <div id="form" className="w-full flex justify-center lg:justify-end">
              <WorkshopForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
