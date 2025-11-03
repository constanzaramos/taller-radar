export const uploadToImgBB = async (file) => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!data.success) throw new Error("Error al subir la imagen");
    return data.data.url; // URL directa de la imagen
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    throw new Error("No se pudo subir la imagen a ImgBB");
  }
};
