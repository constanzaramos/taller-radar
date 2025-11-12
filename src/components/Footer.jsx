import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">Taller Radar</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Conectamos a personas curiosas con talleres creativos y oficios locales.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>tallerradarcl@gmail.com</li>
              <li>Concepción, Chile</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Síguenos</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a
                  href="https://www.instagram.com/tallerradar/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Taller Radar. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              Portal
            </Link>
            <span className="hidden sm:inline text-gray-600">|</span>
            <p className="text-gray-500">
              Diseñado con cariño para la comunidad creativa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

