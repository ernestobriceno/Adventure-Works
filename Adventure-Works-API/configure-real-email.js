// configure-real-email.js
// Configuración con credenciales reales

import fs from 'fs';

console.log('🏍️ Adventure WorkCycle - Configurando Email Real\n');

// Configuración con credenciales reales
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
EMAIL_USER=noreplyadventureworks2@gmail.com
EMAIL_PASS=axxl fizh hiup ndjb
`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ Archivo .env configurado con credenciales reales');
  console.log('\n📧 CONFIGURACIÓN:');
  console.log('- Email: noreplyadventureworks2@gmail.com');
  console.log('- Contraseña: axxl fizh hiup ndjb');
  console.log('- Servidor: smtp.gmail.com:587');
  console.log('\n🧪 Probando configuración...');
} catch (error) {
  console.error('❌ Error:', error.message);
}
