import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  filename: string;              // nombre en disco/almacenamiento
  originalname: string;          // nombre original
  contentType: string;
  size: number;

  // Metadatos funcionales
  title: string;
  description?: string;
  tags: string[];
  importance: 0 | 1 | 2 | 3;     // 0–3
  sensitive: boolean;            // si repo es público y sensitive=true => solo miembros

  repository: mongoose.Types.ObjectId; // a qué repo pertenece
  folder?: mongoose.Types.ObjectId; // carpeta donde está el archivo (null = raíz)
  uploadedBy: mongoose.Types.ObjectId; // User
  storagePath?: string;           // path/s3-key opcional
  checksum?: string;              // para deduplicar si quieres
}

const FileSchema = new Schema<IFile>(
  {
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },

    title: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String, index: true }],
    importance: { type: Number, enum: [0, 1, 2, 3], default: 0, index: true },
    sensitive: { type: Boolean, default: false },

    repository: { type: Schema.Types.ObjectId, ref: "Repository", required: true, index: true },
    folder: { type: Schema.Types.ObjectId, ref: "Folder", default: null, index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    storagePath: { type: String },
    checksum: { type: String, index: true },
  },
  { timestamps: true }
);

// Índice compuesto para búsquedas por repositorio y carpeta
FileSchema.index({ repository: 1, folder: 1 });

export default mongoose.model<IFile>("File", FileSchema);
