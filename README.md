# Pulse – Full Stack Social App

Pulse es una aplicación **full stack** inspirada en X (ex Twitter), desarrollada como proyecto de aprendizaje y portfolio. Permite a los usuarios crear publicaciones, interactuar mediante likes y comentarios, gestionar perfiles y comunicarse en tiempo real.

⚠️ **Aviso legal**: este proyecto es únicamente educativo. No está afiliado ni relacionado con X Corp.

---

## 🚀 Demo

🌐 **URL pública**: [https://clone-x-1-ei6b.onrender.com](https://clone-x-1-ei6b.onrender.com)

---

## 🧩 Funcionalidades

* Autenticación y autorización de usuarios (JWT)
* Creación y visualización de posts
* Likes y comentarios en tiempo real
* Edición de perfil (foto, banner, biografía, datos personales)
* Subida de imágenes con Cloudinary
* Feed con posts de usuarios seguidos
* Comunicación en tiempo real con Socket.IO
* UI inspirada en X

---

## 🛠️ Stack tecnológico

### Frontend

* React 19
* React Router DOM
* Vite
* Tailwind CSS
* Socket.IO Client
* Lucide Icons

### Backend

* Node.js
* Express 5
* Prisma ORM
* PostgreSQL
* Passport (JWT + Local)
* Multer + Cloudinary
* Socket.IO

### Testing

* Jest
* Supertest

---

## 📦 Estructura del proyecto

```text
clone-x/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── app.js
│   └── package.json
│
└── README.md
```

---

## ▶️ Scripts disponibles

### Frontend

```bash
npm run dev       # Desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
```

### Backend

```bash
npm run dev       # Servidor en desarrollo
npm run build     # Prisma generate + migrate + seed
npm start         # Producción
npm test          # Tests con Jest
```

---

## ⚙️ Variables de entorno

Ejemplo de variables requeridas en el backend:

```env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🧠 Objetivos del proyecto

* Consolidar conocimientos en **arquitectura full stack**
* Profundizar en autenticación, autorización y relaciones de datos
* Trabajar con tiempo real y subida de archivos
* Construir una app compleja con criterios realistas de producto

---

## 📌 Estado del proyecto

🟢 En desarrollo activo

Posibles mejoras futuras:

* Notificaciones
* Mensajería privada
* Paginación y optimización del feed
* Tests end-to-end

---

## 👤 Autor

**Eduardo D. Negri**
Politólogo en transición al mundo IT, con interés en arquitectura de software, ciencia de datos y desarrollo de aplicaciones con impacto social.

---

## 📄 Licencia

Este proyecto se publica con fines educativos y de port
