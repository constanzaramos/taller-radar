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
import CallToActionBanner from "./components/CallToActionBanner";
import PublishPage from "./pages/publishPage";
import LinksPage from "./pages/linksPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route
          path="/"
          element={
            <div
              className="min-h-screen bg-white text-neutral-900"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)",
                backgroundSize: "100% 4px",
              }}
            >
              <NavBar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8 sm:pb-10 lg:pb-12">
                <Hero />
                <section
                  id="workshops-section"
                  className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8"
                >
                  <div className="lg:col-span-1 space-y-6">
                    <Calendar />
                    <Filters />
                  </div>
                  <div className="lg:col-span-3">
                    <WorkshopGrid />
                  </div>
                </section>
                <CallToActionBanner />
              </main>
              <Footer />
            </div>
          }
        />
        <Route path="/publicar" element={
          <PublishPage />
        } />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
