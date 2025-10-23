// test-email.js
// Script para probar el servicio de email

import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER || "";
const EMAIL_PASS = process.env.EMAIL_PASS || "";

console.log("🔧 Configuración de Email:");
console.log(`Host: ${EMAIL_HOST}`);
console.log(`Port: ${EMAIL_PORT}`);
console.log(`User: ${EMAIL_USER}`);
console.log(`Pass: ${EMAIL_PASS ? '***configurado***' : 'NO CONFIGURADO'}`);

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error("❌ Error: EMAIL_USER y EMAIL_PASS deben estar configurados en el archivo .env");
  console.log("\n📝 Para configurar Gmail:");
  console.log("1. Crea un archivo .env en la raíz del proyecto");
  console.log("2. Agrega las siguientes líneas:");
  console.log("EMAIL_USER=tu-email@gmail.com");
  console.log("EMAIL_PASS=tu-contraseña-de-aplicacion");
  console.log("\n3. Para Gmail, necesitas usar una 'Contraseña de aplicación':");
  console.log("   - Ve a tu cuenta de Google");
  console.log("   - Activa la verificación en 2 pasos");
  console.log("   - Ve a 'Contraseñas de aplicaciones'");
  console.log("   - Genera una nueva contraseña para 'Adventure Works API'");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function testEmailConnection() {
  try {
    console.log("\n🔍 Verificando conexión con el servidor de email...");
    await transporter.verify();
    console.log("✅ Conexión exitosa con el servidor de email");
    return true;
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    return false;
  }
}

export async function sendTestEmail() {
  try {
    console.log("\n📧 Enviando correo de prueba...");
    
    const mailOptions = {
      from: `"Adventure WorkCycle" <${EMAIL_USER}>`,
      to: EMAIL_USER, // Enviar a sí mismo para prueba
      subject: "🏍️ Prueba de Email - Adventure WorkCycle",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Prueba de Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .success { color: #27ae60; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏍️ Adventure WorkCycle</h1>
            <h2>Prueba de Configuración de Email</h2>
          </div>
          
          <div class="content">
            <h3>¡Configuración Exitosa!</h3>
            <p>Este es un correo de prueba para verificar que el servicio de email está funcionando correctamente.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4>✅ Estado del Servicio</h4>
              <p><strong>Servidor:</strong> ${EMAIL_HOST}:${EMAIL_PORT}</p>
              <p><strong>Usuario:</strong> ${EMAIL_USER}</p>
              <p><strong>Estado:</strong> <span class="success">FUNCIONANDO</span></p>
            </div>
            
            <p>Ahora puedes enviar facturas con PDF adjunto a tus clientes.</p>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado exitosamente");
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Enviado a: ${info.accepted.join(', ')}`);
    
    return true;
  } catch (error) {
    console.error("❌ Error enviando correo:", error.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Iniciando prueba del servicio de email...\n");
  
  const connectionOk = await testEmailConnection();
  if (!connectionOk) {
    process.exit(1);
  }
  
  const emailSent = await sendTestEmail();
  if (emailSent) {
    console.log("\n🎉 ¡Prueba completada exitosamente!");
    console.log("📧 Revisa tu bandeja de entrada para ver el correo de prueba.");
    console.log("\n💡 Ahora puedes usar el endpoint /api/orders/:id/send-invoice para enviar facturas.");
  } else {
    console.log("\n❌ La prueba falló. Revisa la configuración de email.");
    process.exit(1);
  }
}

main().catch(console.error);
