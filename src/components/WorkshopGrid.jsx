import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import WorkshopCard from "./WorkshopCard";

export default function WorkshopGrid() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Leer los talleres desde Firestore al cargar el componente
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const q = query(
            collection(db, "workshops"),
            where("status", "==", "approved"),
            orderBy("createdAt", "desc")
          );
          
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Workshops desde Firestore:", data);

        setWorkshops(data);
      } catch (error) {
        console.error("Error al cargar talleres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  if (loading) {
    return <p className="text-center text-neutral-600 mt-6">Cargando talleres...</p>;
  }

  if (workshops.length === 0) {
    return <p className="text-center text-neutral-600 mt-6">No hay talleres publicados aún.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {workshops.map((w) => (
        <WorkshopCard
          key={w.id}
          title={w.title}
          date={w.date}
          city={w.city}
          price={w.price}
          image={w.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60"} // imagen genérica si no hay
        />
      ))}
    </div>
  );
}
