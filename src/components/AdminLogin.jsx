import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();
  const allowedGoogleEmail = "tallerradarcl@gmail.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o usuario no registrado");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      const result = await signInWithPopup(auth, provider);
      const email = result?.user?.email?.toLowerCase();
      if (email !== allowedGoogleEmail) {
        await signOut(auth);
        setError("Este correo no tiene acceso con Google.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesión con Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white border rounded-xl p-4 sm:p-6 w-full max-w-sm shadow-md"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Login Admin</h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
          required
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-sky-700 hover:bg-sky-800 text-white py-2 rounded-lg mb-3"
        >
          Ingresar
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-neutral-300 text-neutral-800 py-2 rounded-lg hover:bg-neutral-50"
        >
          🔐 Ingresar con Google
        </button>
      </form>
    </div>
  );
}
