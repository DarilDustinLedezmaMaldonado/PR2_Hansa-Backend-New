// Script para hacer backup de MongoDB
require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const MONGO_URI = process.env.MONGO_URI;
const BACKUP_DIR = path.join(__dirname, 'backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                  new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
const BACKUP_PATH = path.join(BACKUP_DIR, `backup_${timestamp}`);

// Crear directorio de backups si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('📁 Directorio de backups creado');
}

console.log('🔄 Iniciando backup de MongoDB...');
console.log(`📍 Ubicación: ${BACKUP_PATH}`);

// Comando mongodump
const command = `mongodump --uri="${MONGO_URI}" --out="${BACKUP_PATH}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error al crear backup:', error.message);
    console.error('\n⚠️  NOTA: Necesitas tener MongoDB Database Tools instalado.');
    console.error('📥 Descárgalo desde: https://www.mongodb.com/try/download/database-tools');
    console.error('\nAlternativamente, usa el método manual que se muestra a continuación.\n');
    process.exit(1);
  }

  if (stderr) {
    console.log(stderr);
  }

  console.log(stdout);
  console.log(`✅ Backup completado exitosamente en: ${BACKUP_PATH}`);
  console.log(`📦 Tamaño del backup: ${getDirectorySize(BACKUP_PATH)}`);
});

function getDirectorySize(dirPath) {
  try {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        totalSize += parseFloat(getDirectorySize(filePath));
      } else {
        totalSize += fs.statSync(filePath).size;
      }
    }
    
    return (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
  } catch (err) {
    return 'N/A';
  }
}
