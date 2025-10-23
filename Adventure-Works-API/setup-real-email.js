// setup-real-email.js
// Configuración con credenciales reales que funcionan

import fs from 'fs';

console.log('🏍️ Adventure WorkCycle - Configuración de Email Real\n');

// Configuración que funciona con Gmail usando App Password
const envContent = `# Server Configuration
PORT=4000
JWT_SECRET=adventure-works-super-secret-jwt-key-2024

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://adventureworkscycle.netlify.app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=

# Email Configuration - Gmail
# INSTRUCCIONES PARA CONFIGURAR:
# 1. Ve a https://myaccount.google.com/security
# 2. Activa "Verificación en 2 pasos"
# 3. Ve a "Contraseñas de aplicaciones"
# 4. Genera una contraseña para "Adventure Works API"
# 5. Reemplaza las credenciales abajo

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion

# CONFIGURACIÓN TEMPORAL PARA PRUEBAS:
# Si no tienes Gmail configurado, puedes usar estas credenciales de prueba
# (solo para desarrollo, no para producción)

# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=test@gmail.com
# EMAIL_PASS=test123
`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ Archivo .env configurado');
  console.log('\n📧 CONFIGURACIÓN ACTUAL:');
  console.log('- Servicio: Gmail SMTP');
  console.log('- Puerto: 587 (TLS)');
  console.log('\n🔧 PARA CONFIGURAR GMAIL:');
  console.log('1. Ve a: https://myaccount.google.com/security');
  console.log('2. Activa "Verificación en 2 pasos"');
  console.log('3. Ve a "Contraseñas de aplicaciones"');
  console.log('4. Genera una contraseña para "Adventure Works API"');
  console.log('5. Reemplaza "tu-email@gmail.com" con tu email');
  console.log('6. Reemplaza "tu-contraseña-de-aplicacion" con la contraseña generada');
  console.log('\n🧪 Para probar:');
  console.log('node test-email.js');
} catch (error) {
  console.error('❌ Error:', error.message);
}
