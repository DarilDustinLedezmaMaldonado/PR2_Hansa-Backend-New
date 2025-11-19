# 🎓 Plataforma Académica HANSA - Backend

Plataforma académica desarrollada con Node.js, Express y MongoDB, orientada a la organización jerárquica y centralizada de archivos educativos por universidad, facultad, carrera y materia. El sistema permite gestionar repositorios personales y grupales, compartir contenido entre estudiantes e instituciones, y aplicar criterios avanzados de clasificación con enfoque en seguridad (GDPR), escalabilidad y usabilidad.

## 🚀 Stack Tecnológico

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Base de datos:** MongoDB Atlas
- **Autenticación:** JWT + 2FA
- **Email:** Brevo (Sendinblue)
- **Almacenamiento:** Cloudinary
- **Deploy:** Render

## 📋 Prerequisitos

- Node.js 18+ 
- MongoDB Atlas account
- Brevo account (email service)
- Cloudinary account (file storage)

## 🛠️ Instalación Local

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd PR2_Hansa-Backend-New
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar .env con tus credenciales (ya está creado)
```

4. **Verificar configuración**
```bash
npm run verify
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

## 📦 Scripts Disponibles

```bash
npm run dev         # Inicia servidor en modo desarrollo
npm run build       # Compila TypeScript a JavaScript
npm start           # Inicia servidor en producción
npm run lint        # Verifica código con ESLint
npm run lint:fix    # Corrige errores de linting
npm run format      # Formatea código con Prettier
npm run verify      # Verifica configuración de despliegue
```

## 🌐 Despliegue

### Despliegue Rápido
Lee la guía rápida: **[DESPLIEGUE-RAPIDO.md](./DESPLIEGUE-RAPIDO.md)**

### Documentación Completa
Para instrucciones detalladas: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Verificar antes de desplegar
```bash
npm run verify
```

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuraciones (DB, Cloudinary, CORS, etc.)
├── controllers/     # Controladores de rutas
├── middleware/      # Middlewares (auth, rate limit, etc.)
├── models/          # Modelos de MongoDB
├── routes/          # Definición de rutas
├── services/        # Servicios (email, etc.)
├── templates/       # Templates de emails
├── utils/           # Utilidades
├── app.ts           # Configuración de Express
└── server.ts        # Punto de entrada
```

## 🔐 Variables de Entorno

Las siguientes variables deben estar configuradas:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://...

# JWT
JWT_SECRET=tu_secreto_aqui

# Brevo Email
BREVO_API_KEY=tu_api_key
BREVO_FROM_EMAIL=tu_email@example.com
BREVO_FROM_NAME=Nombre del remitente

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# App Config
APP_NAME=Plataforma Estudiantes
FRONTEND_URL=http://localhost:5173
RESET_TOKEN_TTL_MIN=20

# Rate Limiting 2FA
RESEND_WINDOW_SEC=600
RESEND_MAX_PER_WINDOW=3
RESEND_MIN_INTERVAL_SEC=60
TWOFA_TTL_MIN=5
```

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Verificación 2FA por email
- ✅ Rate limiting en endpoints sensibles
- ✅ CORS configurado
- ✅ Helmet.js para headers de seguridad
- ✅ Validación de datos con express-validator
- ✅ Bcrypt para hashing de passwords

## 📧 Servicio de Email

Este proyecto usa **Brevo** (anteriormente Sendinblue) para el envío de emails:
- Verificación de código 2FA
- Reset de contraseña
- Notificaciones

**Plan gratuito:** 300 emails/día

## ☁️ Almacenamiento de Archivos

Cloudinary se usa para:
- Subida de archivos
- Gestión de imágenes
- Optimización automática

## 🐛 Troubleshooting

### El servidor no inicia
```bash
# Verifica que todas las variables estén configuradas
npm run verify

# Revisa los logs
npm run dev
```

### Error de conexión a MongoDB
- Verifica que `MONGO_URI` sea correcta
- Asegúrate de que MongoDB Atlas permita tu IP (0.0.0.0/0 para Render)

### Emails no se envían
- Verifica tu `BREVO_API_KEY`
- Confirma que el email remitente esté verificado en Brevo
- Revisa el límite diario (300 emails en plan gratuito)

## 📚 Documentación Adicional

- [Guía de Despliegue Rápido](./DESPLIEGUE-RAPIDO.md)
- [Documentación Completa de Despliegue](./DEPLOYMENT.md)
- [Configuración de Variables de Entorno](./env.example)

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎯 Estado del Proyecto

- ✅ Autenticación y autorización
- ✅ Gestión de usuarios
- ✅ Repositorios y archivos
- ✅ Sistema de carpetas
- ✅ Invitaciones y aplicaciones
- ✅ Notificaciones
- ✅ Reset de contraseña
- ✅ 2FA por email
- ✅ Listo para producción

## 🌐 URLs en Producción

- **Backend:** [Tu URL de Render]
- **Frontend:** [Tu URL de Vercel]
- **Docs API:** [Tu URL]/api-docs (si existe)

---

Desarrollado con ❤️ para UNIVALLE
