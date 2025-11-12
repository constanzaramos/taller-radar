import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/taller-logo.png";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b-2 border-black bg-white sticky top-0 z-40 shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoImage}
            alt="Taller Radar"
            className="h-10 sm:h-14 w-auto drop-shadow-sm"
          />
        </Link>
        
        {/* Menú desktop */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <li>
            <Link to="/" className="text-black hover:text-[#FE9B55] transition-colors">
              Inicio
            </Link>
          </li>
          <li><a href="#" className="text-black hover:text-[#FE9B55] transition-colors">Sobre</a></li>
          <li><a href="#" className="text-black hover:text-[#FE9B55] transition-colors">Contacto</a></li>
          <li>
            <Link
              to="/publicar"
              className="bg-[#A48FC9] hover:bg-[#8a75b8] text-white rounded-lg px-4 py-2 text-sm font-semibold border-2 border-black shadow-[2px_2px_0_#000] transition-all"
            >
              Publicar taller
            </Link>
          </li>
        </ul>

        {/* Botón hamburguesa móvil */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-neutral-700"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <ul className="flex flex-col px-4 py-3 gap-3 text-sm">
            <li><a href="#" className="hover:text-sky-600 block py-2">Home</a></li>
            <li><a href="#" className="hover:text-sky-600 block py-2">About</a></li>
            <li><a href="#" className="hover:text-sky-600 block py-2">Contact</a></li>
            <li>
              <Link
                to="/publicar"
                onClick={() => setIsMenuOpen(false)}
                className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg px-3 py-2 w-full text-sm text-center"
              >
                Publicar taller
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
  