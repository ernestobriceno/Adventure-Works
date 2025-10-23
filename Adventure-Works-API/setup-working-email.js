// setup-working-email.js
// Configuración que funciona con un servicio de email real

import fs from 'fs';

console.log('🏍️ Adventure WorkCycle - Configuración de Email Funcional\n');

// Configuración que funciona con Ethereal Email (para pruebas)
const envContent = `# Server Configuration
PORT=4000
JWT_SECRET=adventure-works-super-secret-jwt-key-2024

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://adventureworkscycle.netlify.app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=

# Email Configuration - Ethereal Email (para pruebas)
# Este servicio funciona sin credenciales reales
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=ethereal.user@ethereal.email
EMAIL_PASS=ethereal.pass

# NOTA: Ethereal Email es solo para pruebas
# Los correos se envían pero no llegan a destinatarios reales
# Para producción, usa Gmail con credenciales reales
`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ Configuración de email funcional creada');
  console.log('\n📧 CONFIGURACIÓN:');
  console.log('- Servicio: Ethereal Email (para pruebas)');
  console.log('- Los correos se envían pero no llegan a destinatarios reales');
  console.log('- Perfecto para desarrollo y pruebas');
  console.log('\n🧪 Para probar:');
  console.log('node test-email.js');
  console.log('\n📝 Para producción:');
  console.log('Cambia las credenciales por las de tu Gmail real');
} catch (error) {
  console.error('❌ Error:', error.message);
}
