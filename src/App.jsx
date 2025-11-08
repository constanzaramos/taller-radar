import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import Calendar from "./components/Calendar";
import WorkshopGrid from "./components/WorkshopGrid";
import WorkshopForm from "./components/WorkshopForm";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white text-neutral-900" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
              backgroundSize: '100% 4px'
            }}>
              <NavBar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
                <Hero />
                <section className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <Calendar />
                    <Filters />
                  </div>
                  <div className="lg:col-span-3">
                    <WorkshopGrid />
                  </div>
                </section>
              </main>
              <Footer />
            </div>
          }
        />
        <Route path="/publicar" element={
          <div className="min-h-screen bg-white text-neutral-900">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
              <WorkshopForm />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
