import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  createFolder,
  getFolderContents,
  renameFolder,
  deleteFolder,
  moveFolder,
  getFolderPath,
} from "../controllers/folderController";

const router = express.Router();

// 📁 Crear carpeta en un repositorio
router.post("/repositories/:repositoryId/folders", verifyToken, createFolder);

// 📂 Obtener contenido de una carpeta (raíz o específica)
router.get("/folders/contents", verifyToken, getFolderContents);

// 📍 Obtener ruta/breadcrumb de una carpeta
router.get("/folders/:folderId/path", verifyToken, getFolderPath);

// 📝 Renombrar/editar carpeta
router.put("/folders/:folderId", verifyToken, renameFolder);

// 🔄 Mover carpeta
router.patch("/folders/:folderId/move", verifyToken, moveFolder);

// 🗑️ Eliminar carpeta (y todo su contenido)
router.delete("/folders/:folderId", verifyToken, deleteFolder);

export default router;
