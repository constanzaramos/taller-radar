import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config"; 

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function AdminPanel() {
  const [pending, setPending] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchPending();
      } else {
        navigate("/login");
      }
    });
    return () => unsub();
  }, []);

  const fetchPending = async () => {
    const q = query(collection(db, "workshops"), where("status", "==", "pending"));
    const snap = await getDocs(q);
    setPending(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const approve = async (id) => {
    await updateDoc(doc(db, "workshops", id), { status: "approved" });
    setPending(pending.filter((p) => p.id !== id));
  };

  const reject = async (id) => {
    await updateDoc(doc(db, "workshops", id), { status: "rejected" });
    setPending(pending.filter((p) => p.id !== id));
  };

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto my-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Panel de Moderación</h2>
        <button
          onClick={handleLogout}
          className="bg-neutral-800 text-white px-3 py-1 rounded-lg"
        >
          Cerrar sesión
        </button>
      </div>
      {pending.length === 0 ? (
        <p>No hay talleres pendientes</p>
      ) : (
        <div className="space-y-4">
          {pending.map((w) => (
            <div
              key={w.id}
              className="bg-white border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{w.title}</h3>
                <p className="text-sm text-neutral-600">{w.city} — ${w.price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approve(w.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => reject(w.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
