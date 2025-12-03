// Script alternativo para backup usando Mongoose (sin necesidad de mongodump)
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI;
const BACKUP_DIR = path.join(__dirname, 'backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                  new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
const BACKUP_FILE = path.join(BACKUP_DIR, `backup_${timestamp}.json`);

// Crear directorio de backups si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🔄 Iniciando backup de MongoDB (método Mongoose)...');
console.log(`📍 Archivo: ${BACKUP_FILE}`);

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const backup = {};
    
    for (const collInfo of collections) {
      const collName = collInfo.name;
      console.log(`📦 Respaldando colección: ${collName}`);
      
      const data = await db.collection(collName).find({}).toArray();
      backup[collName] = data;
      
      console.log(`   ✓ ${data.length} documentos exportados`);
    }
    
    // Guardar backup en archivo JSON
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));
    
    const stats = fs.statSync(BACKUP_FILE);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('\n✅ Backup completado exitosamente');
    console.log(`📁 Ubicación: ${BACKUP_FILE}`);
    console.log(`📊 Tamaño: ${fileSizeMB} MB`);
    console.log(`📚 Colecciones respaldadas: ${Object.keys(backup).length}`);
    
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error durante el backup:', error);
    process.exit(1);
  });
