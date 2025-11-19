#!/usr/bin/env node

/**
 * Script de verificación pre-despliegue
 * Verifica que todas las configuraciones estén correctas
 */

require('dotenv').config();

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

console.log('\n🔍 Verificando configuración de despliegue...\n');

// 1. Verificar variables de entorno
console.log('📋 Variables de entorno:');

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'BREVO_API_KEY',
  'BREVO_FROM_EMAIL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`  ✅ ${varName}`);
    checks.passed.push(`Env var: ${varName}`);
  } else {
    console.log(`  ❌ ${varName} - NO CONFIGURADA`);
    checks.failed.push(`Env var: ${varName}`);
  }
});

// 2. Verificar MongoDB URI
console.log('\n🗄️  MongoDB:');
if (process.env.MONGO_URI) {
  if (process.env.MONGO_URI.includes('mongodb+srv://')) {
    console.log('  ✅ Usando MongoDB Atlas (recomendado para producción)');
    checks.passed.push('MongoDB Atlas URI');
  } else if (process.env.MONGO_URI.includes('localhost')) {
    console.log('  ⚠️  Usando localhost (solo para desarrollo)');
    checks.warnings.push('MongoDB localhost - cambiar a Atlas para producción');
  }
} else {
  console.log('  ❌ MONGO_URI no configurada');
  checks.failed.push('MONGO_URI');
}

// 3. Verificar JWT Secret
console.log('\n🔐 JWT Secret:');
if (process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.length >= 32) {
    console.log('  ✅ JWT_SECRET tiene longitud segura');
    checks.passed.push('JWT secret length');
  } else {
    console.log('  ⚠️  JWT_SECRET es muy corto (recomendado: 32+ caracteres)');
    checks.warnings.push('JWT secret debería ser más largo');
  }
}

// 4. Verificar Brevo
console.log('\n📧 Brevo Email Service:');
if (process.env.BREVO_API_KEY && process.env.BREVO_FROM_EMAIL) {
  console.log('  ✅ Brevo configurado correctamente');
  checks.passed.push('Brevo email service');
} else {
  console.log('  ❌ Faltan credenciales de Brevo');
  checks.failed.push('Brevo credentials');
}

// 5. Verificar Cloudinary
console.log('\n☁️  Cloudinary:');
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  console.log('  ✅ Cloudinary configurado correctamente');
  checks.passed.push('Cloudinary credentials');
} else {
  console.log('  ❌ Faltan credenciales de Cloudinary');
  checks.failed.push('Cloudinary credentials');
}

// 6. Verificar FRONTEND_URL
console.log('\n🌐 Frontend URL:');
if (process.env.FRONTEND_URL) {
  if (process.env.FRONTEND_URL.includes('localhost')) {
    console.log('  ⚠️  Usando localhost (para desarrollo)');
    console.log('     Para producción, cambiar a URL de Vercel');
    checks.warnings.push('FRONTEND_URL es localhost - actualizar para producción');
  } else if (process.env.FRONTEND_URL.includes('vercel.app')) {
    console.log('  ✅ URL de Vercel configurada');
    checks.passed.push('Frontend URL production');
  }
}

// 7. Verificar archivos necesarios
console.log('\n📁 Archivos de configuración:');
const fs = require('fs');
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'render.yaml',
  '.env.production',
  'src/server.ts'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
    checks.passed.push(`File: ${file}`);
  } else {
    console.log(`  ❌ ${file} - NO ENCONTRADO`);
    checks.failed.push(`File: ${file}`);
  }
});

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(50));
console.log(`✅ Verificaciones pasadas: ${checks.passed.length}`);
console.log(`⚠️  Advertencias: ${checks.warnings.length}`);
console.log(`❌ Verificaciones fallidas: ${checks.failed.length}`);

if (checks.warnings.length > 0) {
  console.log('\n⚠️  ADVERTENCIAS:');
  checks.warnings.forEach(w => console.log(`   - ${w}`));
}

if (checks.failed.length > 0) {
  console.log('\n❌ ERRORES QUE DEBES CORREGIR:');
  checks.failed.forEach(f => console.log(`   - ${f}`));
  console.log('\n⛔ No puedes desplegar hasta corregir estos errores.\n');
  process.exit(1);
} else if (checks.warnings.length > 0) {
  console.log('\n✅ Configuración básica correcta.');
  console.log('⚠️  Hay advertencias que deberías revisar antes de producción.\n');
  process.exit(0);
} else {
  console.log('\n✅ ¡Todo listo para desplegar!\n');
  console.log('Próximos pasos:');
  console.log('  1. git add .');
  console.log('  2. git commit -m "Preparar para despliegue"');
  console.log('  3. git push origin main');
  console.log('  4. Desplegar en Render y Vercel');
  console.log('\n📚 Lee DESPLIEGUE-RAPIDO.md para instrucciones paso a paso.\n');
  process.exit(0);
}
