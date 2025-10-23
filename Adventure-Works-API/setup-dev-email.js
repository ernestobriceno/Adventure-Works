// setup-dev-email.js
// Configuración para desarrollo que funciona

import fs from 'fs';

console.log('🏍️ Adventure WorkCycle - Configuración de Desarrollo\n');

// Configuración que funciona para desarrollo
const envContent = `# Server Configuration
PORT=4000
JWT_SECRET=adventure-works-super-secret-jwt-key-2024

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://adventureworkscycle.netlify.app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=

# Email Configuration - Gmail
# CONFIGURACIÓN PARA DESARROLLO
# Esta configuración simula el envío de emails sin requerir credenciales reales

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=adventureworkscycle@gmail.com
EMAIL_PASS=AdventureWorks2024!

# NOTA: Esta configuración es para desarrollo
# En producción, usa tus propias credenciales de Gmail
`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ Configuración de desarrollo creada');
  console.log('\n📧 CONFIGURACIÓN:');
  console.log('- Email: adventureworkscycle@gmail.com');
  console.log('- Contraseña: AdventureWorks2024!');
  console.log('\n⚠️  NOTA: Esta es una configuración de desarrollo');
  console.log('El servicio de email está configurado pero puede no funcionar');
  console.log('Para producción, configura tus propias credenciales de Gmail');
  console.log('\n🧪 Para probar:');
  console.log('node test-email.js');
} catch (error) {
  console.error('❌ Error:', error.message);
}
