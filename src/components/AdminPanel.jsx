import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import WorkshopModal from "./WorkshopModal";

export default function AdminPanel() {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  // Cargar talleres pendientes
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

  // Aprobar o rechazar
  const handleApprove = async (id) => {
    await updateDoc(doc(db, "workshops", id), { status: "approved" });
  };

  const handleReject = async (id) => {
    await updateDoc(doc(db, "workshops", id), { status: "rejected" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">🛠️ Panel de moderación</h2>

      {workshops.length === 0 ? (
        <p className="text-neutral-500">No hay talleres pendientes por revisar.</p>
      ) : (
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 font-medium">Taller</th>
                <th className="py-2 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((w) => (
                <tr key={w.id} className="border-b hover:bg-neutral-50">
                  <td
                    className="py-2 cursor-pointer text-sky-700 hover:underline"
                    onClick={() => setSelectedWorkshop(w)}
                  >
                    {w.name}
                  </td>
                  <td className="py-2 text-center space-x-2">
                    <button
                      onClick={() => handleApprove(w.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(w.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Rechazar
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
