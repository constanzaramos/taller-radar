import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FFF7F0] flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-6xl sm:text-7xl font-black text-black">404</h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-black">
              Página no encontrada
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-manrope">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>
          
          <div className="space-y-3 pt-4">
            <Link
              to="/"
              className="block w-full bg-[#41CBBC] hover:bg-[#36b0a4] text-black font-semibold border-2 border-black rounded-xl py-3 shadow-[4px_4px_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] transition-all duration-200"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

