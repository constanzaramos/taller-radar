import { useForm, useFieldArray } from "react-hook-form";
import { db, auth } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { uploadToImgBB } from "../utils/uploadToImgBB";

export default function AdminWorkshopForm({ onSuccess }) {
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
    if (!auth.currentUser) {
      alert("❌ Debes estar autenticado para crear talleres.");
      return;
    }

    try {
      setLoading(true);

      // Subir imagen (opcional - si falla, continuamos sin imagen)
      let imageUrl = "";
      const fileFromForm = data.imageFile && data.imageFile[0];
      const fileFromDom = document.getElementById("adminImageInput")?.files?.[0];
      const file = fileFromForm || fileFromDom;
      if (file) {
        try {
          imageUrl = await uploadToImgBB(file);
        } catch (imgError) {
          console.warn("No se pudo subir la imagen, continuando sin ella:", imgError);
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

      // Datos a guardar - DIRECTAMENTE APROBADO
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
        status: "approved", // ✅ Directamente aprobado
        approved: true, // ✅ Directamente aprobado
        confirmPriceOnRegistration: data.confirmPriceOnRegistration || false,
        confirmAddressOnRegistration: data.confirmAddressOnRegistration || false,
        mapUrl,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid, // Guardar quién lo creó
      };

      const docRef = await addDoc(collection(db, "workshops"), formattedData);
      console.log("Taller creado con ID:", docRef.id);
      console.log("Datos guardados:", formattedData);
      setSuccess(true);
      reset();
      setPreview("");
      if (onSuccess) onSuccess();
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
    <div className="bg-white border-2 border-black rounded-xl p-4 sm:p-6 max-w-4xl mx-auto shadow-[4px_4px_0_#000]">
      <h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-800">➕ Crear Taller (Aprobado Directamente)</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
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
          {errors.name && <p className="text-red-600 text-xs">{errors.name.message}</p>}
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
        </div>

        {/* Modalidad */}
        <div className="col-span-2 flex gap-6 items-center">
          <label className="flex items-center gap-2">
            <input type="radio" value="presencial" {...register("modality", { required: true })} />
            <span>Presencial</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="online" {...register("modality", { required: true })} />
            <span>Online</span>
          </label>
        </div>

        {/* Dirección */}
        {modality === "presencial" && (
          <>
            <input
              {...register("address")}
              className="border rounded-lg p-2 col-span-2"
              placeholder="Dirección exacta (Ej: Av. Italia 1234)"
            />
            <input {...register("commune")} className="border rounded-lg p-2" placeholder="Comuna" />
            <input {...register("city")} className="border rounded-lg p-2" placeholder="Ciudad" />
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("confirmAddressOnRegistration")} />
                <span>📍 Confirmar dirección al momento de la inscripción</span>
              </label>
            </div>
          </>
        )}

        {/* Tipo de fecha */}
        <div className="col-span-2 border-t pt-3">
          <div className="text-sm font-medium mb-2">Tipo de taller:</div>
          <div className="flex flex-wrap gap-3 mb-3">
            <label className="flex items-center gap-2">
              <input type="radio" value="single" {...register("dateType")} />
              <span>Fecha única</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="multiple" {...register("dateType")} />
              <span>Múltiples fechas específicas</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="recurring" {...register("dateType")} />
              <span>Taller recurrente</span>
            </label>
          </div>

          {/* Fecha única */}
          {dateType === "single" && (
            <div>
              <input
                type="date"
                {...register("date", { required: dateType === "single" ? "Selecciona una fecha" : false })}
                className="border rounded-lg p-2 w-full"
                placeholder="Fecha del taller"
              />
            </div>
          )}

          {/* Múltiples fechas específicas */}
          {dateType === "multiple" && (
            <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
              <div className="text-sm font-medium mb-2">Agregar fechas específicas:</div>
              {dateFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="date"
                    {...register(`multipleDates.${index}.date`, { 
                      required: dateType === "multiple" && index === 0 ? "Agrega al menos una fecha" : false 
                    })}
                    className="border rounded-lg p-2 flex-1"
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
                className="text-sky-700 text-sm hover:underline"
              >
                + Agregar otra fecha
              </button>
            </div>
          )}

          {/* Taller recurrente */}
          {dateType === "recurring" && (
            <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
              <div className="text-sm font-medium">Selecciona los días de la semana:</div>
              <div className="flex flex-wrap gap-2 text-sm">
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                  <label key={day} className="flex items-center gap-1">
                    <input type="checkbox" value={day} {...register("recurringDays")} />
                    {day.slice(0, 3)}
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Fecha inicio:</label>
                  <input 
                    type="date" 
                    {...register("recurringStart", { required: dateType === "recurring" ? "Fecha inicio requerida" : false })} 
                    className="border rounded-lg p-2 w-full" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Fecha fin:</label>
                  <input 
                    type="date" 
                    {...register("recurringEnd", { required: dateType === "recurring" ? "Fecha fin requerida" : false })} 
                    className="border rounded-lg p-2 w-full" 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600">Número de clases/sesiones (opcional):</label>
                <input
                  type="number"
                  {...register("numberOfClasses", { min: 1 })}
                  className="border rounded-lg p-2 w-full"
                  placeholder="Ej: 8 clases"
                />
              </div>
            </div>
          )}
        </div>

        {/* Hora */}
        <div>
          <select {...register("time", { required: "Selecciona una hora" })} className="border rounded-lg p-2 w-full">
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
            className="border rounded-lg p-2 w-full"
          />
          {errors.ageMin && <p className="text-red-600 text-xs">{errors.ageMin.message}</p>}
        </div>


        {/* Precio */}
        <div className="col-span-2 space-y-2">
          <div className="flex items-center gap-4">
            <input
              type="number"
              {...register("price", { min: { value: 0, message: "Debe ser mayor o igual a 0" } })}
              className="border rounded-lg p-2 w-full"
              placeholder="Precio (CLP)"
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isFree")} />
              <span>Gratis</span>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("confirmPriceOnRegistration")} />
            <span>💰 Confirmar precio al momento de la inscripción</span>
          </label>
        </div>

        {/* Inscripciones */}
        <div className="col-span-2 border-t pt-4">
          <h4 className="font-semibold mb-2">Inscripciones</h4>
          <input
            {...register("contact")}
            className="border rounded-lg p-2 w-full mb-3"
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
                className="border rounded-lg p-2 flex-1"
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
            onClick={() => document.getElementById("adminImageInput").click()}
            className={`flex items-center gap-2 ${
              preview ? "bg-green-600 hover:bg-green-700" : "bg-sky-700 hover:bg-sky-800"
            } text-white px-4 py-2 rounded-lg transition`}
          >
            {preview ? "Cambiar imagen" : "Subir imagen"}
          </button>
          <input
            type="file"
            accept="image/*"
            id="adminImageInput"
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
                  document.getElementById("adminImageInput").value = "";
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
            className="border rounded-lg p-2 w-full"
            rows="3"
            placeholder="Descripción del taller *"
          />
          {errors.description && <p className="text-red-600 text-xs">{errors.description.message}</p>}
        </div>

        <button
          disabled={loading}
          className={`col-span-2 rounded-lg px-4 py-2 text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Guardando..." : "✅ Crear Taller (Aprobado)"}
        </button>

        {success && (
          <p className="col-span-2 text-green-600 mt-2 font-medium">✅ Taller creado y aprobado correctamente</p>
        )}
      </form>
    </div>
  );
}

