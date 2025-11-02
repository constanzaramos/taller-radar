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

1. Configura tu proyecto de Firebase en `src/firebase/config.js`
2. Asegúrate de tener las reglas de seguridad de Firestore configuradas
3. Configura la autenticación en Firebase Console

## 📝 Estructura del proyecto

```
src/
├── components/      # Componentes React
├── firebase/        # Configuración de Firebase
└── main.jsx         # Punto de entrada
```

## 📄 Licencia

Este proyecto es privado.
