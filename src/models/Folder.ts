import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFolder extends Document {
  name: string;
  description?: string;
  color?: string; // Color para personalizar carpeta (ej: #FF5733)
  
  repository: Types.ObjectId; // Repositorio al que pertenece
  parentFolder?: Types.ObjectId; // Carpeta padre (null = raíz)
  
  createdBy: Types.ObjectId; // Usuario que creó la carpeta
  
  // Metadatos
  path: string; // Path completo (ej: "/Documentos/2024/Enero")
  level: number; // Nivel de anidación (0 = raíz)
  
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    description: { 
      type: String,
      maxlength: 500
    },
    color: { 
      type: String,
      default: "#9D0045" // Color Univalle por defecto
    },
    
    repository: { 
      type: Schema.Types.ObjectId, 
      ref: "Repository", 
      required: true, 
      index: true 
    },
    parentFolder: { 
      type: Schema.Types.ObjectId, 
      ref: "Folder",
      default: null,
      index: true
    },
    
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    
    path: { 
      type: String, 
      required: false, // Se calcula en el pre-save hook
      index: true
    },
    level: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 10 // Límite de anidación
    },
  },
  { 
    timestamps: true 
  }
);

// Índice compuesto para búsquedas eficientes
FolderSchema.index({ repository: 1, parentFolder: 1 });
FolderSchema.index({ repository: 1, path: 1 });

// Método para construir el path antes de guardar
FolderSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("parentFolder") || this.isModified("name")) {
      console.log(`[Folder pre-save] Processing folder: ${this.name}, parentFolder: ${this.parentFolder}`);
      
      if (this.parentFolder) {
        // Buscar carpeta padre para construir path
        const FolderModel = mongoose.model<IFolder>("Folder");
        const parent = await FolderModel.findById(this.parentFolder);
        
        if (parent) {
          console.log(`[Folder pre-save] Found parent: ${parent.name}, path: ${parent.path}, level: ${parent.level}`);
          this.path = `${parent.path}/${this.name}`;
          this.level = parent.level + 1;
        } else {
          console.log(`[Folder pre-save] Parent not found, using root`);
          this.path = `/${this.name}`;
          this.level = 0;
        }
      } else {
        // Carpeta raíz
        console.log(`[Folder pre-save] No parent, creating root folder`);
        this.path = `/${this.name}`;
        this.level = 0;
      }
      
      console.log(`[Folder pre-save] Final path: ${this.path}, level: ${this.level}`);
    }
    next();
  } catch (error) {
    console.error(`[Folder pre-save] Error:`, error);
    next(error as any);
  }
});

export default mongoose.model<IFolder>("Folder", FolderSchema);
