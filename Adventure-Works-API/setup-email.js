// setup-email.js
// Script para configurar automáticamente el servicio de email

import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEmail() {
  console.log('🏍️ Adventure WorkCycle - Configuración de Email\n');
  
  console.log('📧 Para configurar Gmail correctamente, necesitas:');
  console.log('1. Una cuenta de Gmail');
  console.log('2. Verificación en 2 pasos activada');
  console.log('3. Una contraseña de aplicación generada\n');
  
  const email = await question('📮 Ingresa tu email de Gmail: ');
  
  console.log('\n🔐 Ahora necesitas generar una contraseña de aplicación:');
  console.log('1. Ve a https://myaccount.google.com/security');
  console.log('2. Activa "Verificación en 2 pasos" si no está activada');
  console.log('3. Ve a "Contraseñas de aplicaciones"');
  console.log('4. Selecciona "Correo" y "Otro (nombre personalizado)"');
  console.log('5. Escribe "Adventure Works API"');
  console.log('6. Copia la contraseña de 16 caracteres que se genera\n');
  
  const password = await question('🔑 Pega aquí la contraseña de aplicación (16 caracteres): ');
  
  if (password.length !== 16) {
    console.log('❌ La contraseña debe tener exactamente 16 caracteres');
    rl.close();
    return;
  }
  
  // Crear archivo .env
  const envContent = `# Server Configuration
PORT=4000
JWT_SECRET=adventure-works-super-secret-jwt-key-2024

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://adventureworkscycle.netlify.app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=

# Email Configuration - Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=${email}
EMAIL_PASS=${password}`;

  try {
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Archivo .env creado exitosamente');
    
    console.log('\n🧪 Probando la configuración...');
    
    // Importar y probar la configuración
    const { testEmailConnection, sendTestEmail } = await import('./test-email.js');
    
    const connectionOk = await testEmailConnection();
    if (connectionOk) {
      console.log('✅ Conexión exitosa con Gmail');
      
      const emailSent = await sendTestEmail();
      if (emailSent) {
        console.log('\n🎉 ¡Configuración completada exitosamente!');
        console.log('📧 Revisa tu bandeja de entrada para ver el correo de prueba');
        console.log('\n💡 Ahora puedes usar el endpoint /api/orders/:id/send-invoice');
      } else {
        console.log('\n❌ Error enviando correo de prueba');
      }
    } else {
      console.log('\n❌ Error de conexión. Verifica las credenciales');
    }
    
  } catch (error) {
    console.error('❌ Error creando configuración:', error.message);
  }
  
  rl.close();
}

setupEmail().catch(console.error);
