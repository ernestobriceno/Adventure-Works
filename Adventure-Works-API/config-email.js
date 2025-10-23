// config-email.js
// Script simple para configurar email automáticamente

import fs from 'fs';

console.log('🏍️ Adventure WorkCycle - Configuración Automática de Email\n');

// Configuración por defecto para Gmail
const envContent = `# Server Configuration
PORT=4000
JWT_SECRET=adventure-works-super-secret-jwt-key-2024

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://adventureworkscycle.netlify.app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=

# Email Configuration - Gmail
# IMPORTANTE: Cambia estas credenciales por las tuyas
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion

# INSTRUCCIONES PARA CONFIGURAR GMAIL:
# 1. Ve a https://myaccount.google.com/security
# 2. Activa "Verificación en 2 pasos" si no está activada
# 3. Ve a "Contraseñas de aplicaciones"
# 4. Selecciona "Correo" y "Otro (nombre personalizado)"
# 5. Escribe "Adventure Works API"
# 6. Copia la contraseña de 16 caracteres
# 7. Reemplaza "tu-email@gmail.com" con tu email
# 8. Reemplaza "tu-contraseña-de-aplicacion" con la contraseña generada
`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ Archivo .env creado exitosamente');
  console.log('\n📝 INSTRUCCIONES:');
  console.log('1. Abre el archivo .env');
  console.log('2. Cambia "tu-email@gmail.com" por tu email real');
  console.log('3. Cambia "tu-contraseña-de-aplicacion" por tu contraseña de aplicación');
  console.log('4. Ejecuta: node test-email.js para probar');
  console.log('\n🔗 Para generar contraseña de aplicación:');
  console.log('https://myaccount.google.com/security');
} catch (error) {
  console.error('❌ Error creando archivo .env:', error.message);
}
