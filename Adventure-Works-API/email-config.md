# Configuración de Email

Para que el servicio de email funcione correctamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env`:

## Para Gmail (Recomendado)

1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega las siguientes variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
```

### Configurar Gmail:

1. Ve a tu cuenta de Gmail
2. Activa la verificación en 2 pasos
3. Ve a "Contraseñas de aplicaciones" en tu cuenta de Google
4. Genera una nueva contraseña de aplicación para "Adventure Works API"
5. Usa esa contraseña en `EMAIL_PASS`

## Para otros proveedores

```env
EMAIL_HOST=smtp.tu-proveedor.com
EMAIL_PORT=587
EMAIL_USER=tu-email@tu-dominio.com
EMAIL_PASS=tu-contraseña
```

## Proveedores comunes:

- **Outlook/Hotmail**: smtp-mail.outlook.com, puerto 587
- **Yahoo**: smtp.mail.yahoo.com, puerto 587
- **iCloud**: smtp.mail.me.com, puerto 587

## Verificar configuración

Una vez configurado, el endpoint `/api/orders/:id/send-invoice` enviará:
- Un correo HTML con el cuerpo del mensaje
- El PDF de la factura como adjunto
- Información detallada de la orden
