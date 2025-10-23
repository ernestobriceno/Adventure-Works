# 📧 Configuración del Servicio de Email

Este documento explica cómo configurar el servicio de email para enviar facturas con PDF adjunto.

## 🚨 Problema Actual

Si ves el error: `"Email service not configured. Please contact administrator to set up email credentials."`, significa que el servicio de email no está configurado.

## 🔧 Solución: Configurar Email

### Paso 1: Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Server Configuration
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
```

### Paso 2: Configurar Gmail (Recomendado)

1. **Activar verificación en 2 pasos:**
   - Ve a tu cuenta de Google
   - Seguridad → Verificación en 2 pasos → Activar

2. **Generar contraseña de aplicación:**
   - Ve a Seguridad → Contraseñas de aplicaciones
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe "Adventure Works API"
   - Copia la contraseña generada (16 caracteres)

3. **Configurar .env:**
   ```env
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASS=la-contraseña-de-16-caracteres-generada
   ```

### Paso 3: Probar la configuración

Ejecuta el script de prueba:

```bash
node test-email.js
```

Si todo está bien configurado, verás:
```
✅ Conexión exitosa con el servidor de email
✅ Correo enviado exitosamente
🎉 ¡Prueba completada exitosamente!
```

## 📧 Características del Email

Una vez configurado, el sistema enviará correos con:

- **Cuerpo HTML profesional** con:
  - Header con logo de Adventure WorkCycle
  - Detalles de la orden
  - Lista de productos comprados
  - Información de descuentos (si aplica)
  - Footer con información de contacto

- **PDF adjunto** con:
  - Factura electrónica completa
  - Cumplimiento normativo de El Salvador
  - Cálculo de IVA (13%)
  - Información de la empresa

## 🔄 Uso del Endpoint

Para enviar una factura por email:

```bash
POST /api/orders/:id/send-invoice
Authorization: Bearer <token>
```

**Respuesta exitosa:**
```json
{
  "message": "Invoice sent successfully",
  "orderId": "orden-123",
  "email": "cliente@email.com"
}
```

## 🛠️ Otros Proveedores de Email

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=tu-email@outlook.com
EMAIL_PASS=tu-contraseña
```

### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=tu-email@yahoo.com
EMAIL_PASS=tu-contraseña
```

### iCloud
```env
EMAIL_HOST=smtp.mail.me.com
EMAIL_PORT=587
EMAIL_USER=tu-email@icloud.com
EMAIL_PASS=tu-contraseña
```

## 🐛 Solución de Problemas

### Error: "Email authentication failed"
- Verifica que las credenciales sean correctas
- Para Gmail, asegúrate de usar una contraseña de aplicación
- Verifica que la verificación en 2 pasos esté activada

### Error: "Could not connect to email server"
- Verifica que el HOST y PORT sean correctos
- Revisa tu conexión a internet
- Algunos proveedores bloquean conexiones desde ciertas IPs

### Error: "Invalid email address"
- Verifica que el email del cliente sea válido
- Asegúrate de que la orden tenga una dirección de email

## 📞 Soporte

Si tienes problemas con la configuración:

1. Ejecuta `node test-email.js` para diagnosticar
2. Revisa los logs del servidor para errores específicos
3. Verifica que el archivo `.env` esté en la raíz del proyecto
4. Asegúrate de que las variables de entorno estén correctamente configuradas
