import { Link } from "react-router-dom";
import logoImage from "../assets/taller-logo.png";

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-[#FFF7F0] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full border-2 border-black bg-white shadow-[4px_4px_0_#000] overflow-hidden flex items-center justify-center">
            <img src={logoImage} alt="Taller Radar" className="w-full h-full object-contain p-2" />
          </div>
          <h1 className="text-3xl font-black text-black mb-1">Taller Radar</h1>
          <p className="text-sm text-neutral-600 font-manrope">
            Conecta con nuestra plataforma y comparte tu taller en segundos.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-[#41CBBC] hover:bg-[#36b0a4] text-black font-semibold border-2 border-black rounded-xl py-3 shadow-[4px_4px_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] transition-all duración-200"
          >
            Ir al sitio web
          </Link>
          <Link
            to="/publicar"
            className="block w-full bg-[#FE9B55] hover:bg-[#ec8d4b] text-black font-semibold border-2 border-black rounded-xl py-3 shadow-[4px_4px_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] transition-all duración-200"
          >
            Publicar un taller
          </Link>
        </div>
        <p className="text-xs text-neutral-500 font-manrope">
          Síguenos en Instagram:{" "}
          <a
            href="https://www.instagram.com/tallerradar/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#FE9B55]"
          >
            @tallerradar
          </a>
        </p>
      </div>
    </div>
  );
}

