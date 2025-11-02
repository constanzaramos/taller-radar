import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import Calendar from "./components/Calendar";
import WorkshopGrid from "./components/WorkshopGrid";
import WorkshopForm from "./components/WorkshopForm";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-[#fdfcf9] text-neutral-900">
              <NavBar />
              <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
                <Hero />
                <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1 space-y-4">
                    <Calendar />
                    <Filters />
                  </div>
                  <div className="lg:col-span-3">
                    <WorkshopGrid />
                  </div>
                </section>
                <WorkshopForm />
              </main>
            </div>
          }
        />
          <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
