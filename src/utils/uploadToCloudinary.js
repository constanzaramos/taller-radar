export const uploadToCloudinary = async (file) => {
    const cloudName = "dcexhmpsq";
    const uploadPreset = "tallerRadar"; 
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
  
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await res.json();
      return data.secure_url; // URL final de la imagen subida
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      throw new Error("No se pudo subir la imagen");
    }
  };
  