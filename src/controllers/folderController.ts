import { Request, Response } from "express";
import Folder from "../models/Folder";
import File from "../models/File";
import Repository from "../models/Repository";
import { logger } from "../utils/logger";

/**
 * 📁 Crear carpeta en un repositorio
 */
export const createFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { repositoryId } = req.params;
    const { name, description, color, parentFolderId } = req.body;

    // Verificar que el repositorio existe
    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      res.status(404).json({ error: "Repositorio no encontrado" });
      return;
    }

    // Verificar permisos (debe ser participante con role writer o superior)
    const isOwner = repository.owner.toString() === userId;
    const participant = repository.participants.find(
      p => p.user.toString() === userId && p.status === "active"
    );
    const canWrite = isOwner || (participant && ["admin", "writer", "creator"].includes(participant.role));

    if (!canWrite) {
      res.status(403).json({ error: "No tienes permisos para crear carpetas en este repositorio" });
      return;
    }

    // Si hay parentFolder, verificar que existe y pertenece al mismo repo
    if (parentFolderId) {
      const parentFolder = await Folder.findById(parentFolderId);
      if (!parentFolder) {
        res.status(404).json({ error: "Carpeta padre no encontrada" });
        return;
      }
      if (parentFolder.repository.toString() !== repositoryId) {
        res.status(400).json({ error: "La carpeta padre no pertenece a este repositorio" });
        return;
      }
      if (parentFolder.level >= 10) {
        res.status(400).json({ error: "Se alcanzó el límite máximo de anidación (10 niveles)" });
        return;
      }
    }

    // Verificar que no exista una carpeta con el mismo nombre en el mismo nivel
    const existingFolder = await Folder.findOne({
      repository: repositoryId,
      parentFolder: parentFolderId || null,
      name: name.trim()
    });

    if (existingFolder) {
      res.status(400).json({ error: "Ya existe una carpeta con ese nombre en esta ubicación" });
      return;
    }

    // Crear carpeta
    const folder = new Folder({
      name: name.trim(),
      description,
      color: color || "#9D0045",
      repository: repositoryId,
      parentFolder: parentFolderId || undefined,
      createdBy: userId,
    });

    logger.info("Intentando guardar carpeta:", { name: folder.name, repository: repositoryId, parentFolder: parentFolderId });
    await folder.save();
    logger.info("Carpeta guardada exitosamente:", folder._id);

    res.status(201).json(folder);
  } catch (err) {
    logger.error("Error al crear carpeta:", err);
    if (err instanceof Error) {
      logger.error("Stack trace:", err.stack);
      logger.error("Error message:", err.message);
    }
    res.status(500).json({ error: "Error al crear carpeta", details: err instanceof Error ? err.message : String(err) });
  }
};

/**
 * 📂 Obtener contenido de una carpeta (subcarpetas y archivos)
 */
export const getFolderContents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { repositoryId, folderId } = req.query;

    if (!repositoryId) {
      res.status(400).json({ error: "repositoryId es requerido" });
      return;
    }

    // Verificar repositorio
    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      res.status(404).json({ error: "Repositorio no encontrado" });
      return;
    }

    // Verificar permisos de lectura
    const isOwner = repository.owner.toString() === userId;
    const participant = repository.participants.find(
      p => p.user.toString() === userId && p.status === "active"
    );
    const canRead = repository.privacy === "public" || isOwner || participant;

    if (!canRead) {
      res.status(403).json({ error: "No tienes acceso a este repositorio" });
      return;
    }

    // Determinar el filtro de carpeta (null para raíz, folderId para carpeta específica)
    const folderFilter = folderId || null;
    let currentFolder = null;

    // Si hay folderId, verificar que la carpeta existe
    if (folderId) {
      currentFolder = await Folder.findById(folderId);
      if (!currentFolder || currentFolder.repository.toString() !== repositoryId) {
        res.status(404).json({ error: "Carpeta no encontrada" });
        return;
      }
    }

    // Obtener subcarpetas
    const subfolders = await Folder.find({
      repository: repositoryId,
      parentFolder: folderFilter
    })
      .populate("createdBy", "username nombre apellido")
      .sort({ name: 1 });

    // Obtener archivos
    const files = await File.find({
      repository: repositoryId,
      folder: folderFilter
    })
      .populate("uploadedBy", "username nombre apellido")
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      currentFolder,
      subfolders,
      files,
    });
  } catch (err) {
    logger.error("Error al obtener contenido de carpeta:", err);
    res.status(500).json({ error: "Error al obtener contenido" });
  }
};

/**
 * 📝 Renombrar carpeta
 */
export const renameFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { folderId } = req.params;
    const { name, description, color } = req.body;

    const folder = await Folder.findById(folderId).populate("repository");
    if (!folder) {
      res.status(404).json({ error: "Carpeta no encontrada" });
      return;
    }

    const repository = folder.repository as any;

    // Verificar permisos
    const isOwner = repository.owner.toString() === userId;
    const participant = repository.participants.find(
      (p: any) => p.user.toString() === userId && p.status === "active"
    );
    const canEdit = isOwner || (participant && ["admin", "writer", "creator"].includes(participant.role));

    if (!canEdit) {
      res.status(403).json({ error: "No tienes permisos para editar esta carpeta" });
      return;
    }

    // Actualizar
    if (name) folder.name = name.trim();
    if (description !== undefined) folder.description = description;
    if (color) folder.color = color;

    await folder.save();

    res.status(200).json(folder);
  } catch (err) {
    logger.error("Error al renombrar carpeta:", err);
    res.status(500).json({ error: "Error al renombrar carpeta" });
  }
};

/**
 * 🗑️ Eliminar carpeta (y todo su contenido recursivamente)
 */
export const deleteFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { folderId } = req.params;

    const folder = await Folder.findById(folderId).populate("repository");
    if (!folder) {
      res.status(404).json({ error: "Carpeta no encontrada" });
      return;
    }

    const repository = folder.repository as any;

    // Verificar permisos
    const isOwner = repository.owner.toString() === userId;
    const participant = repository.participants.find(
      (p: any) => p.user.toString() === userId && p.status === "active"
    );
    const canDelete = isOwner || (participant && ["admin", "writer", "creator"].includes(participant.role));

    if (!canDelete) {
      res.status(403).json({ error: "No tienes permisos para eliminar esta carpeta" });
      return;
    }

    // Eliminar recursivamente: primero las subcarpetas
    await deleteFolderRecursive(folderId);

    res.status(200).json({ message: "Carpeta eliminada correctamente" });
  } catch (err) {
    logger.error("Error al eliminar carpeta:", err);
    res.status(500).json({ error: "Error al eliminar carpeta" });
  }
};

/**
 * Función auxiliar para eliminar carpeta y todo su contenido recursivamente
 */
async function deleteFolderRecursive(folderId: string): Promise<void> {
  // Buscar subcarpetas
  const subfolders = await Folder.find({ parentFolder: folderId });
  
  // Eliminar recursivamente cada subcarpeta
  for (const subfolder of subfolders) {
    await deleteFolderRecursive(subfolder._id.toString());
  }

  // Eliminar archivos de esta carpeta
  await File.deleteMany({ folder: folderId });

  // Eliminar la carpeta
  await Folder.findByIdAndDelete(folderId);
}

/**
 * 🔄 Mover carpeta a otra ubicación
 */
export const moveFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { folderId } = req.params;
    const { newParentFolderId } = req.body;

    const folder = await Folder.findById(folderId).populate("repository");
    if (!folder) {
      res.status(404).json({ error: "Carpeta no encontrada" });
      return;
    }

    const repository = folder.repository as any;

    // Verificar permisos
    const isOwner = repository.owner.toString() === userId;
    const participant = repository.participants.find(
      (p: any) => p.user.toString() === userId && p.status === "active"
    );
    const canMove = isOwner || (participant && ["admin", "writer", "creator"].includes(participant.role));

    if (!canMove) {
      res.status(403).json({ error: "No tienes permisos para mover esta carpeta" });
      return;
    }

    // Si newParentFolderId === "root", mover a raíz
    if (newParentFolderId === "root") {
      folder.parentFolder = undefined;
    } else {
      // Verificar que la carpeta destino existe
      const newParent = await Folder.findById(newParentFolderId);
      if (!newParent) {
        res.status(404).json({ error: "Carpeta destino no encontrada" });
        return;
      }

      // Verificar que no se mueva a sí misma o a una subcarpeta propia
      if (newParentFolderId === folderId) {
        res.status(400).json({ error: "No puedes mover una carpeta dentro de sí misma" });
        return;
      }

      // Verificar límite de anidación
      if (newParent.level >= 10) {
        res.status(400).json({ error: "Se alcanzaría el límite máximo de anidación" });
        return;
      }

      folder.parentFolder = newParent._id as any;
    }

    await folder.save();

    res.status(200).json(folder);
  } catch (err) {
    logger.error("Error al mover carpeta:", err);
    res.status(500).json({ error: "Error al mover carpeta" });
  }
};

/**
 * 📍 Obtener ruta completa (breadcrumb) de una carpeta
 */
export const getFolderPath = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folderId } = req.params;

    if (folderId === "root") {
      res.status(200).json([]);
      return;
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      res.status(404).json({ error: "Carpeta no encontrada" });
      return;
    }

    // Construir breadcrumb desde la carpeta hasta la raíz
    const breadcrumb: any[] = [];
    let currentFolder: any = folder;

    while (currentFolder) {
      breadcrumb.unshift({
        _id: currentFolder._id,
        name: currentFolder.name,
        level: currentFolder.level
      });

      if (currentFolder.parentFolder) {
        currentFolder = await Folder.findById(currentFolder.parentFolder);
      } else {
        currentFolder = null;
      }
    }

    res.status(200).json(breadcrumb);
  } catch (err) {
    logger.error("Error al obtener ruta de carpeta:", err);
    res.status(500).json({ error: "Error al obtener ruta" });
  }
};
