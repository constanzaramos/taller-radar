import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import talleres from "./talleres.json" assert { type: "json" };

// 🔥 Tu config de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📥 Subir cada post como "pendiente"
async function uploadPendingWorkshops() {
  for (const t of talleres) {
    await addDoc(collection(db, "pendingWorkshops"), {
      username: t.ownerUsername || "",
      caption: t.caption || "",
      imageUrl: t.displayUrl || "",
      url: t.url || "",
      timestamp: t.timestamp || new Date(),
      approved: false,
    });
  }
  console.log("✅ Talleres subidos a pendingWorkshops");
}

uploadPendingWorkshops();
