// src/utils/cloudinary.ts
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

/**
 * Sube un archivo a Cloudinary desde un buffer
 * @param fileBuffer - Buffer del archivo
 * @param folder - Carpeta en Cloudinary (ej: "profile-images", "documents")
 * @param publicId - ID público opcional para el archivo
 * @returns URL pública del archivo subido
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = "uploads",
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "auto", // Detecta automáticamente si es imagen, video, etc.
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    // Convertir buffer a stream y subirlo
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

/**
 * Elimina un archivo de Cloudinary
 * @param publicId - ID público del archivo a eliminar
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error al eliminar de Cloudinary:", error);
    throw error;
  }
}
