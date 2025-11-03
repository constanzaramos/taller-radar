import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import WorkshopModal from "./WorkshopModal";

export default function AdminPanel() {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [loading, setLoading] = useState(false);

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
    try {
      setLoading(true);
      await updateDoc(doc(db, "workshops", id), {
        status: "approved",
        approved: true,
      });
      alert("✅ Taller aprobado correctamente.");
    } catch (err) {
      console.error("Error al aprobar:", err);
      alert("❌ Error al aprobar el taller.");
    } finally {
      setLoading(false);
    }
  };

  // 🚫 Rechazar
  const handleReject = async (id) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, "workshops", id), {
        status: "rejected",
        approved: false,
      });
      alert("🚫 Taller rechazado.");
    } catch (err) {
      console.error("Error al rechazar:", err);
      alert("❌ Error al rechazar el taller.");
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

  return (
    <div className="max-w-4xl mx-auto p-6 font-body">
      <h2 className="text-3xl font-display mb-6 text-center">🛠️ Panel de Moderación</h2>

      {workshops.length === 0 ? (
        <p className="text-center text-neutral-500 italic">No hay talleres pendientes por revisar.</p>
      ) : (
        <div className="bg-cream border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0_#000]">
          <table className="w-full text-sm">
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
                      className="bg-mint border-2 border-black px-3 py-1 text-sm rounded-full shadow-[2px_2px_0_#000] hover:translate-y-[1px]"
                    >
                      ✅ Aprobar
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => handleReject(w.id)}
                      className="bg-orange border-2 border-black px-3 py-1 text-sm rounded-full shadow-[2px_2px_0_#000] hover:translate-y-[1px]"
                    >
                      ❌ Rechazar
                    </button>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="bg-red-400 border-2 border-black px-3 py-1 text-sm rounded-full shadow-[2px_2px_0_#000] hover:translate-y-[1px]"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
