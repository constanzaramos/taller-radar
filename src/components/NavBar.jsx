export default function NavBar() {
    return (
      <header className="border-b bg-white/70 backdrop-blur-sm">
        <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <h1 className="font-bold text-lg tracking-tight">Taller Radar</h1>
          <ul className="flex items-center gap-6 text-sm">
            <li><a href="#" className="hover:text-sky-600">Home</a></li>
            <li><a href="#" className="hover:text-sky-600">About</a></li>
            <li><a href="#" className="hover:text-sky-600">Contact</a></li>
            <li>
              <button className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg px-3 py-1.5">
                Sign Up
              </button>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
  