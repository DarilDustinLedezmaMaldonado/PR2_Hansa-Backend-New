#!/usr/bin/env node

/**
 * Script para verificar la conexión a MongoDB
 * Útil para probar que las credenciales funcionan antes de desplegar
 */

require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n🔍 Probando conexión a MongoDB...\n');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI no está definida en .env');
  process.exit(1);
}

// Ocultar password para mostrar URI de forma segura
const safeURI = MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
console.log(`📡 Conectando a: ${safeURI}\n`);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000, // 10 segundos timeout
})
.then(async () => {
  console.log('✅ ¡Conexión exitosa a MongoDB!\n');
  
  // Obtener información de la base de datos
  const db = mongoose.connection.db;
  const admin = db.admin();
  
  try {
    const info = await admin.serverInfo();
    console.log('📊 Información del servidor:');
    console.log(`   - Versión de MongoDB: ${info.version}`);
    console.log(`   - Sistema: ${info.sysInfo?.split(' ')[0] || 'N/A'}`);
    
    // Listar bases de datos
    const dbList = await admin.listDatabases();
    console.log(`\n📁 Bases de datos disponibles: ${dbList.databases.length}`);
    dbList.databases.forEach(db => {
      const sizeMB = (db.sizeOnDisk / (1024 * 1024)).toFixed(2);
      console.log(`   - ${db.name} (${sizeMB} MB)`);
    });
    
    // Listar colecciones de la DB actual
    const currentDB = mongoose.connection.name || 'test';
    console.log(`\n📚 Colecciones en "${currentDB}":`);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('   (No hay colecciones aún - se crearán al insertar datos)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    console.log('\n✅ MongoDB está listo para usar en producción.\n');
    
  } catch (error) {
    console.log('\n⚠️  No se pudo obtener información adicional, pero la conexión funciona.');
  }
  
  await mongoose.connection.close();
  console.log('🔌 Conexión cerrada.\n');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error al conectar a MongoDB:\n');
  
  if (error.name === 'MongooseServerSelectionError') {
    console.error('   Posibles causas:');
    console.error('   1. URI de conexión incorrecta');
    console.error('   2. Usuario/contraseña incorrectos');
    console.error('   3. Network Access no permite tu IP en MongoDB Atlas');
    console.error('   4. Firewall bloqueando la conexión\n');
    console.error('   Acción: Ve a MongoDB Atlas → Network Access');
    console.error('   Agrega: 0.0.0.0/0 (Allow access from anywhere)\n');
  } else if (error.name === 'MongoParseError') {
    console.error('   La URI de conexión tiene un formato incorrecto');
    console.error('   Verifica que MONGO_URI en .env sea correcta\n');
  } else {
    console.error(`   ${error.message}\n`);
  }
  
  process.exit(1);
});

// Timeout de seguridad
setTimeout(() => {
  console.error('\n⏱️  Timeout: La conexión tardó demasiado.');
  console.error('   Verifica tu conexión a internet y las credenciales.\n');
  process.exit(1);
}, 15000); // 15 segundos
