# Taller Radar

Plataforma para descubrir y compartir talleres en Chile. Encuentra talleres cerca de ti o publica el tuyo propio.

## 🚀 Características

- **Búsqueda de talleres**: Filtra por categoría, precio, ciudad y más
- **Publicación de talleres**: Formulario completo para publicar nuevos talleres
- **Calendario**: Visualización de talleres por fecha
- **Administración**: Panel de administración para aprobar talleres
- **Modalidades**: Soporta talleres presenciales y online

## 🛠️ Tecnologías

- **React** + **Vite** - Framework y build tool
- **Tailwind CSS** - Estilos
- **Firebase** - Base de datos y autenticación
  - Firestore
  - Authentication
- **React Hook Form** - Manejo de formularios
- **React Router** - Navegación

## 📦 Instalación

```bash
npm install
```

## 🏃 Ejecutar en desarrollo

```bash
npm run dev
```

## 🏗️ Build para producción

```bash
npm run build
```

## 🔧 Configuración

1. **Configuración de Firebase**:
   - Copia el archivo `.env.example` a `.env`:
     ```bash
     cp .env.example .env
     ```
   - Obtén tus credenciales de Firebase desde [Firebase Console](https://console.firebase.google.com/) > Project Settings > General > Your apps
   - Completa las variables de entorno en el archivo `.env` con tus credenciales

2. **Configuración de Firestore**:
   - Asegúrate de tener las reglas de seguridad de Firestore configuradas
   - Configura la autenticación en Firebase Console

**Nota**: El archivo `.env` está en `.gitignore` y no se subirá al repositorio por seguridad.

## 📝 Estructura del proyecto

```
src/
├── components/      # Componentes React
├── firebase/        # Configuración de Firebase
└── main.jsx         # Punto de entrada
```

## 📄 Licencia

Este proyecto es privado.
