import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import WorkshopModal from "./WorkshopModal";
import AdminWorkshopForm from "./AdminWorkshopForm";

export default function AdminPanel() {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Verificar autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 🔥 Escuchar talleres pendientes
  useEffect(() => {
    const q = collection(db, "workshops");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkshops(data.filter((w) => w.status === "pending"));
    });
    return () => unsubscribe();
  }, []);

  // ✅ Aprobar
  const handleApprove = async (id) => {
    if (!isAuthenticated || !auth.currentUser) {
      alert("❌ Debes estar autenticado para aprobar talleres.");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      await updateDoc(doc(db, "workshops", id), {
        status: "approved",
        approved: true,
      });
      alert("✅ Taller aprobado correctamente.");
    } catch (err) {
      console.error("Error al aprobar:", err);
      const errorMessage = err.message || "Error desconocido";
      if (errorMessage.includes("permission") || errorMessage.includes("Permission")) {
        alert("❌ Error: No tienes permisos para aprobar talleres. Asegúrate de estar autenticado.");
      } else if (errorMessage.includes("400") || errorMessage.includes("Bad Request")) {
        alert(`❌ Error 400: ${errorMessage}. Verifica que los datos sean válidos.`);
      } else {
        alert(`❌ Error al aprobar el taller: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🚫 Rechazar
  const handleReject = async (id) => {
    if (!isAuthenticated || !auth.currentUser) {
      alert("❌ Debes estar autenticado para rechazar talleres.");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      await updateDoc(doc(db, "workshops", id), {
        status: "rejected",
        approved: false,
      });
      alert("🚫 Taller rechazado.");
    } catch (err) {
      console.error("Error al rechazar:", err);
      const errorMessage = err.message || "Error desconocido";
      if (errorMessage.includes("permission") || errorMessage.includes("Permission")) {
        alert("❌ Error: No tienes permisos para rechazar talleres. Asegúrate de estar autenticado.");
      } else if (errorMessage.includes("400") || errorMessage.includes("Bad Request")) {
        alert(`❌ Error 400: ${errorMessage}. Verifica que los datos sean válidos.`);
      } else {
        alert(`❌ Error al rechazar el taller: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ❌ Eliminar definitivamente (opcional)
  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este taller?")) {
      await deleteDoc(doc(db, "workshops", id));
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Los talleres se actualizarán automáticamente con el listener
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 font-body">
      <h2 className="text-2xl sm:text-3xl font-display mb-4 sm:mb-6 text-center">🛠️ Panel de Administración</h2>

      {/* Toggle entre vista de moderación y formulario */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6 justify-center">
        <button
          onClick={() => setShowForm(false)}
          className={`px-3 sm:px-4 py-2 rounded-lg border-2 border-black font-semibold text-sm sm:text-base ${
            !showForm
              ? "bg-mint shadow-[2px_2px_0_#000]"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          📋 Moderar Talleres
        </button>
        <button
          onClick={() => setShowForm(true)}
          className={`px-3 sm:px-4 py-2 rounded-lg border-2 border-black font-semibold text-sm sm:text-base ${
            showForm
              ? "bg-green-500 text-white shadow-[2px_2px_0_#000]"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          ➕ Crear Taller
        </button>
      </div>

      {showForm ? (
        <AdminWorkshopForm onSuccess={handleFormSuccess} />
      ) : (
        <>
          {workshops.length === 0 ? (
        <p className="text-center text-neutral-500 italic text-sm sm:text-base">No hay talleres pendientes por revisar.</p>
      ) : (
        <div className="bg-cream border-2 border-black rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0_#000] overflow-x-auto">
          {/* Tabla desktop */}
          <table className="w-full text-xs sm:text-sm hidden md:table">
            <thead>
              <tr className="border-b border-black text-left bg-mint">
                <th className="py-3 px-2 font-semibold">Taller</th>
                <th className="py-3 px-2 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-dashed border-black hover:bg-orange/10 transition"
                >
                  <td
                    className="py-2 px-2 cursor-pointer text-sky-800 hover:underline"
                    onClick={() => setSelectedWorkshop(w)}
                  >
                    {w.name}
                  </td>
                  <td className="py-2 px-2 text-center space-x-2">
                    <button
                      disabled={loading}
                      onClick={() => handleApprove(w.id)}
                      className="bg-mint border-2 border-black px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full shadow-[2px_2px_0_#000] hover:translate-y-[1px]"
                    >
                      ✅ Aprobar
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => handleReject(w.id)}
                      className="bg-orange border-2 border-black px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full shadow-[2px_2px_0_#000] hover:translate-y-[1px]"
                    >
                      ❌ Rechazar
                    </button>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="bg-red-400 border-2 border-black px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full shadow-[2px_2px_0_#000] hover:translate-y-[1px]"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cards móvil */}
          <div className="md:hidden space-y-3">
            {workshops.map((w) => (
              <div
                key={w.id}
                className="bg-white border-2 border-black rounded-lg p-3 shadow-[2px_2px_0_#000]"
              >
                <h3
                  className="font-semibold text-sm mb-2 cursor-pointer text-sky-800 hover:underline"
                  onClick={() => setSelectedWorkshop(w)}
                >
                  {w.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={loading}
                    onClick={() => handleApprove(w.id)}
                    className="bg-mint border-2 border-black px-3 py-1.5 text-xs rounded-full shadow-[2px_2px_0_#000] hover:translate-y-[1px] flex-1 min-w-[80px]"
                  >
                    ✅ Aprobar
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => handleReject(w.id)}
                    className="bg-orange border-2 border-black px-3 py-1.5 text-xs rounded-full shadow-[2px_2px_0_#000] hover:translate-y-[1px] flex-1 min-w-[80px]"
                  >
                    ❌ Rechazar
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="bg-red-400 border-2 border-black px-3 py-1.5 text-xs rounded-full shadow-[2px_2px_0_#000] hover:translate-y-[1px] flex-1 min-w-[80px]"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de vista previa */}
      {selectedWorkshop && (
        <WorkshopModal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
          isAdminView={true}
          onApprove={() => handleApprove(selectedWorkshop.id)}
          onReject={() => handleReject(selectedWorkshop.id)}
        />
      )}
        </>
      )}
    </div>
  );
}
