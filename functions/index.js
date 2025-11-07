import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

// 🔥 Endpoint que recibe los datos desde Apify
export const importFromApify = onRequest(async (req, res) => {
  try {
    const posts = req.body?.data || req.body; // Apify puede enviar data[] o JSON directo

    for (const post of posts) {
      // Filtramos solo lo que necesitamos
      const workshop = {
        title: post.caption?.slice(0, 60) || "Sin título",
        description: post.caption || "",
        image: post.displayUrl,
        creator: post.ownerUsername,
        link: post.postUrl,
        date: post.timestamp,
        category: "Por revisar",
        status: "pendiente",
        source: "apify",
        created_at: new Date()
      };

      // Evitar duplicados por URL
      const existing = await db.collection("talleres_moderacion")
        .where("link", "==", post.postUrl)
        .get();

      if (existing.empty) {
        await db.collection("talleres_moderacion").add(workshop);
      }
    }

    res.status(200).send({ success: true, message: "Datos recibidos y guardados" });
  } catch (error) {
    console.error("Error al guardar:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});
