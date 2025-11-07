import { useState } from "react";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <h1 className="font-bold text-lg sm:text-xl tracking-tight">Taller Radar</h1>
        
        {/* Menú desktop */}
        <ul className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
          <li><a href="#" className="hover:text-sky-600">Home</a></li>
          <li><a href="#" className="hover:text-sky-600">About</a></li>
          <li><a href="#" className="hover:text-sky-600">Contact</a></li>
          <li>
            <button className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg px-3 py-1.5 text-sm">
              Sign Up
            </button>
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
              <button className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg px-3 py-2 w-full text-sm">
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
  