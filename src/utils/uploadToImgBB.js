export const uploadToImgBB = async (file) => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error("La clave API de ImgBB no está configurada. Por favor, configura VITE_IMGBB_API_KEY en tu archivo .env");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || `Error ${response.status}: ${response.statusText}`;
      throw new Error(`ImgBB API error: ${errorMsg}`);
    }

    if (!data.success) {
      const errorMsg = data.error?.message || "Error desconocido al subir la imagen";
      throw new Error(`ImgBB: ${errorMsg}`);
    }
    
    return data.data.url; // URL directa de la imagen
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    // Re-lanzar el error con más información
    if (error.message.includes("ImgBB")) {
      throw error; // Ya tiene un mensaje descriptivo
    }
    throw new Error(`No se pudo subir la imagen a ImgBB: ${error.message}`);
  }
};
