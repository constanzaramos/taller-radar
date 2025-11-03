import { useForm, useFieldArray } from "react-hook-form";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

export default function WorkshopForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { social: [{ handle: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState("");
  const modality = watch("modality");

  const categories = [
    "Creatividad y artes",
    "Cocina y alimentación",
    "Bienestar y salud",
    "Naturaleza y sustentabilidad",
    "Desarrollo personal y profesional",
    "Actividad física",
    "Tecnología y diseño",
  ];

  const times = [];
  for (let h = 5; h <= 23; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // 🖼️ Subir imagen a Cloudinary
      let imageUrl = "";
      if (data.imageFile && data.imageFile[0]) {
        imageUrl = await uploadToCloudinary(data.imageFile[0]);
      }

      // 🔗 Procesar redes sociales (solo arrobas)
      const socials = data.social
        .map((s) => s.handle.trim())
        .filter(Boolean)
        .map((s) => {
          const username = s.startsWith("@") ? s.slice(1) : s;
          return `https://instagram.com/${username}`;
        });

      // 🗺 Crear URL de mapa
      let mapUrl = "";
      if (data.modality === "presencial" && data.address) {
        const fullAddress = `${data.address}, ${data.commune || ""}, ${
          data.city || ""
        }`;
        mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
          fullAddress
        )}&output=embed`;
      }

      const formattedData = {
        name: data.name.trim(),
        category: [data.category],
        modality: data.modality,
        address: data.address || "",
        commune: data.commune || "",
        city: data.city || "",
        date: data.date,
        time: data.time,
        price: data.isFree ? 0 : Number(data.price || 0),
        contact: data.contact || "",
        social: socials,
        image: imageUrl,
        description: data.description,
        status: "pending",
        mapUrl,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "workshops"), formattedData);

      setSuccess(true);
      reset();
      setPreview("");
    } catch (err) {
      console.error("Error al guardar taller:", err);
      alert("❌ Error al guardar el taller.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 max-w-4xl mx-auto">
      <h3 className="font-semibold text-lg mb-4">Publicar un taller</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid sm:grid-cols-2 gap-4 text-sm"
      >
        {/* Nombre */}
        <div>
          <input
            {...register("name", {
              required: "El nombre es obligatorio",
              minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
            })}
            className="border rounded-lg p-2 w-full"
            placeholder="Nombre del taller *"
          />
          {errors.name && (
            <p className="text-red-600 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <select
            {...register("category", { required: "Selecciona una categoría" })}
            className="border rounded-lg p-2 w-full"
          >
            <option value="">Seleccionar categoría *</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-xs">{errors.category.message}</p>
          )}
        </div>

        {/* Modalidad */}
        <div className="col-span-2 flex gap-6 items-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="presencial"
              {...register("modality", { required: "Selecciona una modalidad" })}
            />
            <span>Presencial</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="online"
              {...register("modality", { required: "Selecciona una modalidad" })}
            />
            <span>Online</span>
          </label>
        </div>
        {errors.modality && (
          <p className="text-red-600 text-xs col-span-2">
            {errors.modality.message}
          </p>
        )}

        {/* Dirección visible */}
        {modality === "presencial" && (
          <>
            <input
              {...register("address")}
              className="border rounded-lg p-2 col-span-2"
              placeholder="Dirección exacta (Ej: Av. Italia 1234)"
            />
            <input
              {...register("commune")}
              className="border rounded-lg p-2"
              placeholder="Comuna o barrio"
            />
            <input
              {...register("city")}
              className="border rounded-lg p-2"
              placeholder="Ciudad"
            />
          </>
        )}

        {/* Fecha */}
        <div>
          <input
            type="date"
            {...register("date", { required: "Selecciona una fecha" })}
            className="border rounded-lg p-2 w-full"
          />
          {errors.date && (
            <p className="text-red-600 text-xs">{errors.date.message}</p>
          )}
        </div>

        {/* Hora */}
        <div>
          <select
            {...register("time", { required: "Selecciona una hora" })}
            className="border rounded-lg p-2 w-full"
          >
            <option value="">Seleccionar hora *</option>
            {times.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {errors.time && (
            <p className="text-red-600 text-xs">{errors.time.message}</p>
          )}
        </div>

        {/* Precio + Gratis */}
        <div className="col-span-2 flex items-center gap-4">
          <input
            type="number"
            {...register("price", {
              required: false,
              min: { value: 0, message: "Debe ser mayor o igual a 0" },
            })}
            className="border rounded-lg p-2 w-full"
            placeholder="Precio (CLP)"
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("isFree")} />
            <span>Gratis</span>
          </label>
        </div>

        {/* 🧾 Sección Inscripciones */}
        <div className="col-span-2 border-t pt-4">
          <h4 className="font-semibold mb-2">📋 Inscripciones</h4>

          {/* Contacto (opcional) */}
          <input
            {...register("contact")}
            className="border rounded-lg p-2 w-full mb-3"
            placeholder="Correo o teléfono (opcional)"
          />

          {/* Redes sociales */}
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 mb-2">
              <input
                {...register(`social.${index}.handle`, {
                  pattern: {
                    value: /^@[\w.]+$/,
                    message: "Debe comenzar con @ y solo letras/números",
                  },
                })}
                className="border rounded-lg p-2 flex-1"
                placeholder="@usuario"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ handle: "" })}
            className="text-sky-700 text-sm hover:underline"
          >
            + Agregar otra red
          </button>
        </div>

        {/* Imagen con botón bonito */}
        <div className="col-span-2 border-t pt-4">
          <h4 className="font-semibold mb-2">🖼️ Imagen del taller</h4>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={() => document.getElementById("imageInput").click()}
              className={`flex items-center gap-2 ${
                preview
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-sky-700 hover:bg-sky-800"
              } text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-150`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5 7.5 12m4.5-9v12"
                />
              </svg>
              {preview ? "Cambiar imagen" : "Subir imagen"}
            </button>

            {preview && (
              <span className="text-sm text-neutral-600">
                Imagen seleccionada ✓
              </span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            id="imageInput"
            {...register("imageFile")}
            onChange={(e) => {
              if (e.target.files[0]) {
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="hidden"
          />

          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Vista previa"
                className="w-full h-48 object-cover rounded-xl border shadow-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview("");
                  document.getElementById("imageInput").value = "";
                }}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                Quitar imagen
              </button>
            </div>
          )}

          <p className="text-xs text-neutral-500 mt-2">
            Formatos admitidos: JPG, PNG, WEBP. Tamaño máximo: 5 MB.
          </p>
        </div>

        {/* Descripción */}
        <div className="col-span-2">
          <textarea
            {...register("description", {
              required: "La descripción es obligatoria",
              minLength: {
                value: 10,
                message: "Debe tener al menos 10 caracteres",
              },
            })}
            className="border rounded-lg p-2 w-full"
            rows="3"
            placeholder="Descripción del taller *"
          />
          {errors.description && (
            <p className="text-red-600 text-xs">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Botón enviar */}
        <button
          disabled={loading}
          className={`col-span-2 rounded-lg px-4 py-2 text-white ${
            loading ? "bg-gray-400" : "bg-sky-700 hover:bg-sky-800"
          }`}
        >
          {loading ? "Guardando..." : "Enviar taller"}
        </button>

        {success && (
          <p className="col-span-2 text-green-600 mt-2 font-medium">
            ✅ Taller enviado para revisión
          </p>
        )}
      </form>
    </div>
  );
}
