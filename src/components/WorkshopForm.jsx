import { useForm, useFieldArray } from "react-hook-form";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { uploadToImgBB } from "../utils/uploadToImgBB";
import { useNavigate } from "react-router-dom";

export default function WorkshopForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { 
      social: [{ handle: "" }],
      multipleDates: [{ date: "" }],
      dateType: "single"
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  const { fields: dateFields, append: appendDate, remove: removeDate } = useFieldArray({
    control,
    name: "multipleDates",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState("");

  const modality = watch("modality");
  const dateType = watch("dateType") || "single"; // "single", "multiple", "recurring"

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

      // Subir imagen (opcional - si falla, continuamos sin imagen)
      let imageUrl = "";
      const fileFromForm = data.imageFile && data.imageFile[0];
      const fileFromDom = document.getElementById("imageInput")?.files?.[0];
      const file = fileFromForm || fileFromDom;
      if (file) {
        try {
          imageUrl = await uploadToImgBB(file);
        } catch (imgError) {
          console.warn("No se pudo subir la imagen, continuando sin ella:", imgError);
          // Continuamos sin imagen en lugar de fallar todo el formulario
        }
      }

      // Redes sociales (solo arrobas)
      const socials = data.social
        .map((s) => s.handle.trim())
        .filter(Boolean)
        .map((s) => {
          const username = s.startsWith("@") ? s.slice(1) : s;
          return `https://instagram.com/${username}`;
        });

      // Dirección + mapa
      let fullAddress = "";
      let mapUrl = "";
      if (data.modality === "presencial" && data.address) {
        fullAddress = `${data.address || ""}, ${data.commune || ""}, ${data.city || ""}`.trim();
        mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
      }

      // Datos a guardar
      const formattedData = {
        name: data.name.trim(),
        category: [data.category],
        modality: data.modality,
        address: data.address || "",
        commune: data.commune || "",
        city: data.city || "",
        fullAddress,
        // Manejar diferentes tipos de fechas
        date: dateType === "single" ? data.date : (dateType === "multiple" ? data.multipleDates?.[0]?.date || data.date : data.date),
        multipleDates: dateType === "multiple" ? (data.multipleDates || []).map(d => d.date).filter(Boolean) : null,
        time: data.time,
        price: data.isFree ? 0 : Number(data.price || 0),
        ageMin: data.ageMin ? Number(data.ageMin) : null,
        isRecurring: dateType === "recurring" || data.isRecurring || false,
        recurringDays: dateType === "recurring" ? (data.recurringDays || []) : (data.recurringDays || []),
        recurringStart: dateType === "recurring" ? data.recurringStart : null,
        recurringEnd: dateType === "recurring" ? data.recurringEnd : null,
        numberOfClasses: dateType === "recurring" ? (data.numberOfClasses ? Number(data.numberOfClasses) : null) : null,
        dateType: dateType,
        contact: data.contact || "",
        social: socials,
        image: imageUrl,
        description: data.description,
        status: "pending",
        approved: false,
        mapUrl,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "workshops"), formattedData);
      setSuccess(true);
      reset();
      setPreview("");
      // Redirigir a la página principal después de 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error al guardar taller:", err);
      const errorMessage = err.message || "Error desconocido";
      alert(`❌ Error al guardar el taller: ${errorMessage}`);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-[#FE9B55] border-2 border-black rounded-xl p-6 sm:p-8 max-w-5xl mx-auto shadow-[4px_4px_0_#000]">
      <h3 className="font-bold text-xl sm:text-2xl mb-6 text-white">Publicar un taller</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4 sm:gap-5 text-sm">
        {/* Nombre */}
        <div>
          <input
            {...register("name", {
              required: "El nombre es obligatorio",
              minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
            })}
            className="bg-white border-2 border-gray-300 rounded-lg p-3 w-full text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors"
            placeholder="Nombre del taller *"
          />
          {errors.name && <p className="text-red-600 text-xs">{errors.name.message}</p>}
        </div>

        {/* Categoría */}
        <div>
          <select
            {...register("category", { required: "Selecciona una categoría" })}
            className="bg-white border-2 border-gray-300 rounded-lg p-3 w-full text-black focus:border-[#41CBBC] focus:outline-none transition-colors"
          >
            <option value="">Seleccionar categoría *</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Modalidad */}
        <div className="col-span-2 flex gap-6 items-center">
          <label className="flex items-center gap-2 text-white">
            <input type="radio" value="presencial" {...register("modality", { required: true })} className="text-orange-600" />
            <span>Presencial</span>
          </label>
          <label className="flex items-center gap-2 text-white">
            <input type="radio" value="online" {...register("modality", { required: true })} className="text-orange-600" />
            <span>Online</span>
          </label>
        </div>

        {/* Dirección */}
        {modality === "presencial" && (
          <>
            <input
              {...register("address")}
              className="bg-white border-2 border-gray-300 rounded-lg p-3 col-span-2 text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors"
              placeholder="Dirección exacta (Ej: Av. Italia 1234)"
            />
            <input {...register("commune")} className="bg-white border-2 border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors" placeholder="Comuna" />
            <input {...register("city")} className="bg-white border-2 border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors" placeholder="Ciudad" />
          </>
        )}

        {/* Tipo de fecha */}
        <div className="col-span-2 border-t border-white/30 pt-3">
          <div className="text-sm font-medium mb-2 text-white">Tipo de taller:</div>
          <div className="flex flex-wrap gap-3 mb-3">
            <label className="flex items-center gap-2 text-white">
              <input type="radio" value="single" {...register("dateType")} className="text-orange-600" />
              <span>Fecha única</span>
            </label>
            <label className="flex items-center gap-2 text-white">
              <input type="radio" value="multiple" {...register("dateType")} className="text-orange-600" />
              <span>Múltiples fechas específicas</span>
            </label>
            <label className="flex items-center gap-2 text-white">
              <input type="radio" value="recurring" {...register("dateType")} className="text-orange-600" />
              <span>Taller recurrente</span>
            </label>
          </div>

          {/* Fecha única */}
          {dateType === "single" && (
            <div>
              <input
                type="date"
                {...register("date", { required: dateType === "single" ? "Selecciona una fecha" : false })}
                className="bg-white border-2 border-gray-300 rounded-lg p-3 w-full text-black focus:border-[#41CBBC] focus:outline-none transition-colors"
                placeholder="Fecha del taller"
              />
            </div>
          )}

          {/* Múltiples fechas específicas */}
          {dateType === "multiple" && (
            <div className="space-y-2 border border-gray-300 rounded-lg p-3 bg-white/20">
              <div className="text-sm font-medium mb-2 text-white">Agregar fechas específicas:</div>
              {dateFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="date"
                    {...register(`multipleDates.${index}.date`, { 
                      required: dateType === "multiple" && index === 0 ? "Agrega al menos una fecha" : false 
                    })}
                    className="bg-white border-2 border-gray-300 rounded-lg p-3 flex-1 text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors"
                    placeholder="Fecha"
                  />
                  {dateFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDate(index)}
                      className="text-red-500 text-sm px-2 py-1 hover:bg-red-50 rounded"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendDate({ date: "" })}
                className="text-white text-sm hover:underline"
              >
                + Agregar otra fecha
              </button>
            </div>
          )}

          {/* Taller recurrente */}
          {dateType === "recurring" && (
            <div className="space-y-2 border border-gray-300 rounded-lg p-3 bg-white/20">
              <div className="text-sm font-medium text-white">Selecciona los días de la semana:</div>
              <div className="flex flex-wrap gap-2 text-sm">
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                <label key={day} className="flex items-center gap-1 text-white">
                  <input type="checkbox" value={day} {...register("recurringDays")} className="text-orange-600" />
                  {day.slice(0, 3)}
                </label>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-white">Fecha inicio:</label>
                  <input 
                    type="date" 
                    {...register("recurringStart", { required: dateType === "recurring" ? "Fecha inicio requerida" : false })} 
                    className="bg-white border-2 border-gray-300 rounded-lg p-3 w-full text-black focus:border-[#41CBBC] focus:outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="text-xs text-white">Fecha fin:</label>
                  <input 
                    type="date" 
                    {...register("recurringEnd", { required: dateType === "recurring" ? "Fecha fin requerida" : false })} 
                    className="bg-white border-2 border-gray-300 rounded-lg p-3 w-full text-black focus:border-[#41CBBC] focus:outline-none transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white">Número de clases/sesiones (opcional):</label>
                <input
                  type="number"
                  {...register("numberOfClasses", { min: 1 })}
                  className="bg-white border-2 border-gray-300 rounded-lg p-3 w-full text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors"
                  placeholder="Ej: 8 clases"
                />
              </div>
            </div>
          )}
        </div>

        {/* Hora */}
        <div>
          <select {...register("time", { required: "Selecciona una hora" })} className="bg-white border border-gray-300 rounded-lg p-2 w-full text-black">
            <option value="">Seleccionar hora *</option>
            {times.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Edad mínima */}
        <div>
          <input
            type="number"
            {...register("ageMin", {
              min: { value: 1, message: "Debe ser mayor o igual a 1" },
              max: { value: 99, message: "Debe ser menor a 99" },
            })}
            placeholder="Edad mínima (opcional)"
            className="bg-white border-2 border-gray-300 rounded-lg p-3 w-full text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors"
          />
          {errors.ageMin && <p className="text-red-600 text-xs">{errors.ageMin.message}</p>}
        </div>


        {/* Precio */}
        <div className="col-span-2 flex items-center gap-4">
          <input
            type="number"
            {...register("price", { min: { value: 0, message: "Debe ser mayor o igual a 0" } })}
            className="bg-white border-2 border-gray-300 rounded-lg p-3 w-full text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors"
            placeholder="Precio (CLP)"
          />
          <label className="flex items-center gap-2 text-white">
            <input type="checkbox" {...register("isFree")} className="text-orange-600" />
            <span>Gratis</span>
          </label>
        </div>

        {/* Inscripciones */}
        <div className="col-span-2 border-t border-white/30 pt-4">
          <h4 className="font-semibold mb-2 text-white">Inscripciones</h4>
          <input
            {...register("contact")}
            className="bg-white border border-gray-300 rounded-lg p-2 w-full mb-3 text-black placeholder-gray-500"
            placeholder="Correo o teléfono (opcional)"
          />
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 mb-2">
              <input
                {...register(`social.${index}.handle`, {
                  pattern: {
                    value: /^@[\w.]+$/,
                    message: "Debe comenzar con @ y solo letras/números",
                  },
                })}
                className="bg-white border-2 border-gray-300 rounded-lg p-3 flex-1 text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors"
                placeholder="@usuario"
              />
              <button type="button" onClick={() => remove(index)} className="text-red-500 text-sm">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append({ handle: "" })} className="text-sky-700 text-sm hover:underline">
            + Agregar otra red
          </button>
        </div>

        {/* Imagen */}
        <div className="col-span-2 border-t pt-4">
          <h4 className="font-semibold mb-2">Imagen del taller</h4>
          <button
            type="button"
            onClick={() => document.getElementById("imageInput").click()}
            className={`flex items-center gap-2 ${
              preview ? "bg-green-600 hover:bg-green-700" : "bg-sky-700 hover:bg-sky-800"
            } text-white px-4 py-2 rounded-lg transition`}
          >
            {preview ? "Cambiar imagen" : "Subir imagen"}
          </button>
          <input
            type="file"
            accept="image/*"
            id="imageInput"
            {...register("imageFile")}
            onChange={(e) => {
              if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0]));
            }}
            className="hidden"
          />
          {preview && (
            <div className="mt-3">
              <img src={preview} alt="Vista previa" className="w-full h-48 object-cover rounded-xl border" />
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
        </div>

        {/* Descripción */}
        <div className="col-span-2">
          <textarea
            {...register("description", {
              required: "La descripción es obligatoria",
              minLength: { value: 10, message: "Debe tener al menos 10 caracteres" },
            })}
            className="bg-white border-2 border-gray-300 rounded-lg p-3 w-full text-black placeholder-gray-500 focus:border-[#41CBBC] focus:outline-none transition-colors"
            rows="3"
            placeholder="Descripción del taller *"
          />
          {errors.description && <p className="text-red-600 text-xs">{errors.description.message}</p>}
        </div>

        <button
          disabled={loading}
          className={`col-span-2 rounded-lg px-4 py-2 text-white font-bold border-2 border-black ${
            loading ? "bg-gray-400" : "bg-[#FE9B55] hover:bg-[#e88a44] shadow-[2px_2px_0_#000]"
          }`}
        >
          {loading ? "Guardando..." : "ENVIAR TALLER"}
        </button>

        {success && <p className="col-span-2 text-green-600 mt-2 font-medium">✅ Taller enviado para revisión</p>}
      </form>
    </div>
  );
}
