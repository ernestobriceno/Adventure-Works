// quick-setup.js
// Configuración rápida con credenciales de ejemplo

import fs from 'fs';

console.log('🏍️ Adventure WorkCycle - Configuración Rápida\n');

// Configuración con credenciales de ejemplo que funcionan
const envContent = `# Server Configuration
PORT=4000
JWT_SECRET=adventure-works-super-secret-jwt-key-2024

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://adventureworkscycle.netlify.app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=

# Email Configuration - Gmail
# CONFIGURACIÓN DE EJEMPLO - CAMBIA ESTAS CREDENCIALES
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=adventureworkscycle@gmail.com
EMAIL_PASS=AdventureWorks2024!

# ⚠️  IMPORTANTE: Esta configuración es de ejemplo
# Para usar en producción, necesitas:
# 1. Tu propio email de Gmail
# 2. Una contraseña de aplicación generada
# 3. Verificación en 2 pasos activada
`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ Archivo .env configurado con credenciales de ejemplo');
  console.log('\n📧 CONFIGURACIÓN ACTUAL:');
  console.log('- Email: adventureworkscycle@gmail.com');
  console.log('- Contraseña: AdventureWorks2024!');
  console.log('\n⚠️  NOTA: Estas son credenciales de ejemplo');
  console.log('Para usar en producción, cambia las credenciales por las tuyas');
  console.log('\n🧪 Para probar la configuración:');
  console.log('node test-email.js');
} catch (error) {
  console.error('❌ Error:', error.message);
}
