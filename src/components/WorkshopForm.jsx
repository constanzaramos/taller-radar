import { useForm } from "react-hook-form";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

export default function WorkshopForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  // Horarios cada 30 min desde 5:00 a 23:30
  const times = [];
  for (let h = 5; h <= 23; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Validar y formatear red social
      let socialUrl = "";
      if (data.social) {
        if (data.social.startsWith("@")) {
          const user = data.social.replace("@", "");
          socialUrl = `https://instagram.com/${user}`;
        } else if (data.social.startsWith("https://")) {
          socialUrl = data.social;
        } else {
          socialUrl = `https://${data.social}`;
        }
      }

      // Crear enlace automático a Google Maps (solo si es presencial)
      let mapUrl = "";
      if (data.modality === "presencial" && data.address) {
        const fullAddress = `${data.address}, ${data.commune || ""}, ${
          data.city || ""
        }`;
        mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          fullAddress
        )}`;
      }

      // Validar rango de edad
      const minAge = data.ageMin ? Number(data.ageMin) : null;
      const maxAge = data.ageMax ? Number(data.ageMax) : null;

      if (minAge && maxAge && maxAge < minAge) {
        alert("❌ La edad máxima no puede ser menor que la mínima");
        setLoading(false);
        return;
      }

      const formattedData = {
        ...data,
        name: data.name.trim(),
        price: Number(data.price),
        ageMin: minAge,
        ageMax: maxAge,
        category: [data.category],
        createdAt: serverTimestamp(),
        status: "pending",
        mapUrl,
        social: socialUrl,
      };

      await addDoc(collection(db, "workshops"), formattedData);
      setSuccess(true);
      reset();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Hubo un error al guardar el taller");
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
              minLength: {
                value: 2,
                message: "Debe tener al menos 2 caracteres",
              },
            })}
            className="border rounded-lg p-2 w-full"
            placeholder="Nombre del taller *"
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
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
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Modalidad */}
        <div className="col-span-2 flex gap-6 items-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="presencial"
              {...register("modality", {
                required: "Selecciona una modalidad",
              })}
            />
            <span>Presencial</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="online"
              {...register("modality", {
                required: "Selecciona una modalidad",
              })}
            />
            <span>Online</span>
          </label>
        </div>
        {errors.modality && (
          <p className="text-red-600 text-xs col-span-2">
            {errors.modality.message}
          </p>
        )}

        {/* Campos de ubicación solo si es presencial */}
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
            <p className="text-red-600 text-xs mt-1">{errors.date.message}</p>
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
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="text-red-600 text-xs mt-1">{errors.time.message}</p>
          )}
        </div>

        {/* Precio */}
        <div>
          <input
            type="number"
            {...register("price", {
              required: "Ingresa el precio",
              min: { value: 1, message: "Debe ser mayor a 0" },
            })}
            className="border rounded-lg p-2 w-full"
            placeholder="Precio (CLP) *"
          />
          {errors.price && (
            <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Edad mínima */}
        <div>
          <input
            type="number"
            {...register("ageMin", {
              min: {
                value: 1,
                message: "La edad mínima debe ser mayor o igual a 1 año",
              },
              max: {
                value: 99,
                message: "La edad mínima no puede superar los 99 años",
              },
              validate: (value) =>
                value === "" ||
                (!isNaN(value) && value >= 1 && value <= 99) ||
                "Ingresa una edad válida entre 1 y 99",
            })}
            className="border rounded-lg p-2 w-full"
            placeholder="Edad mínima (opcional)"
          />
          {errors.ageMin && (
            <p className="text-red-600 text-xs mt-1">{errors.ageMin.message}</p>
          )}
        </div>

        {/* Edad máxima */}
        <div>
          <input
            type="number"
            {...register("ageMax", {
              min: {
                value: 1,
                message: "La edad máxima debe ser mayor o igual a 1 año",
              },
              max: {
                value: 99,
                message: "La edad máxima no puede superar los 99 años",
              },
            })}
            className="border rounded-lg p-2 w-full"
            placeholder="Edad máxima (opcional)"
          />
          {errors.ageMax && (
            <p className="text-red-600 text-xs mt-1">{errors.ageMax.message}</p>
          )}
        </div>

        {/* Contacto */}
        <div>
          <input
            {...register("contact", { required: "Ingresa un contacto" })}
            className="border rounded-lg p-2 w-full"
            placeholder="Correo o teléfono *"
          />
          {errors.contact && (
            <p className="text-red-600 text-xs mt-1">
              {errors.contact.message}
            </p>
          )}
        </div>

        {/* Red social */}
        <div>
          <input
            {...register("social")}
            className="border rounded-lg p-2 w-full"
            placeholder="Instagram o sitio web (ej: @usuario)"
          />
        </div>

        {/* Imagen */}
        <div className="col-span-2">
          <input
            {...register("image", { required: "Ingresa una URL de imagen" })}
            className="border rounded-lg p-2 w-full"
            placeholder="URL de imagen (https://...) *"
          />
          {errors.image && (
            <p className="text-red-600 text-xs mt-1">{errors.image.message}</p>
          )}
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
            <p className="text-red-600 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Botón */}
        <button
          disabled={loading}
          className={`${
            loading ? "bg-neutral-400" : "bg-sky-700 hover:bg-sky-800"
          } text-white rounded-lg px-4 py-2 col-span-2 mt-2`}
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
