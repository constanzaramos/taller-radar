import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WorkshopForm from "../components/WorkshopForm";
import phon from "../assets/phon.png";

export default function PublishPage() {
  return (
    <div className="min-h-screen bg-[#FFF7F0] flex flex-col">
      <NavBar />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
          {/* Lado izquierdo: copy + imagen */}
          <div className="flex flex-col items-start space-y-5">
            <h1 className="text-4xl md:text-5xl font-black text-black leading-tight">
              Deja de publicar en todas partes.
            </h1>

            <p className="text-lg text-gray-800 font-medium max-w-md">
              <strong className="text-[#7A3FFF]">Taller Radar</strong> reúne a las personas
              que buscan talleres como el tuyo.
            </p>

            <p className="text-gray-700 max-w-md">
              Publica tu taller gratis y llega a tu público ideal sin perder tiempo.
            </p>

            {/* Botón que hace scroll al formulario */}
            <a
              href="#form"
              className="mt-4 inline-block bg-[#7A3FFF] text-white font-semibold px-6 py-3 rounded-md 
              border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-y-1 
              hover:shadow-[5px_5px_0_#000] transition-all duration-150"
            >
              Completar formulario
            </a>

            {/* Imagen retro decorativa */}
            <img
              src={phon}
              alt="Mujer vintage con teléfonos"
              className="w-3/4 max-w-sm mt-6 rounded-lg shadow-[4px_4px_0_#000] border-2 border-black"
            />
          </div>

          {/* Lado derecho: el formulario */}
          <div id="form" className="w-full">
            <WorkshopForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
