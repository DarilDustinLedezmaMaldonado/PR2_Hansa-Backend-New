import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth";
import {
  listPublicUsers,
  getMyProfile,
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
} from "../controllers/userController";

const router = express.Router();

// Configurar multer para manejar la subida de archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo aceptar imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
});

// 🔹 Perfil propio (autenticado)
router.get("/me", verifyToken, getMyProfile);

// 🔹 Subir/actualizar foto de perfil
router.post("/me/upload-image", verifyToken, upload.single('profileImage'), uploadProfileImage);

// 🔹 Listar usuarios públicos
router.get("/", listPublicUsers);

// 🔹 Obtener perfil por ID (respeta privacidad en frontend)
router.get("/:id", getUserProfile);

// 🔹 Actualizar perfil (solo dueño)
router.put("/:id", verifyToken, updateUserProfile);

export default router;
