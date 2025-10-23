# Configuración de Email para Adventure Works

## Problema Actual
El error "Email authentication failed" indica que las credenciales de email no están configuradas correctamente.

## Solución Paso a Paso

### 1. Configurar Gmail (Recomendado)

**Opción A: Usar App Password (Más Seguro)**
1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Ve a "Seguridad" → "Verificación en 2 pasos"
3. Activa la verificación en 2 pasos si no está activada
4. Ve a "Contraseñas de aplicaciones"
5. Genera una nueva contraseña para "Correo"
6. Copia la contraseña generada (16 caracteres sin espacios)

**Opción B: Usar tu contraseña normal (Menos seguro)**
- Usa tu contraseña normal de Gmail

### 2. Actualizar el archivo .env

Edita el archivo `Adventure-Works-API/.env` y reemplaza:

```env
# Cambia estas líneas:
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-aqui
```

**Ejemplo:**
```env
EMAIL_USER=adventureworks@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### 3. Reiniciar el Servidor

Después de cambiar el .env, reinicia el servidor API:

```bash
cd Adventure-Works-API
npm run dev
```

### 4. Probar el Email

1. Haz una compra de prueba
2. Ve a la página de éxito de la orden
3. Haz clic en "Enviar Factura por Email"
4. Verifica que llegue el email

## Alternativas de Email

Si no quieres usar Gmail, puedes usar otros proveedores:

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

## Campos Actualizados en Checkout

Ahora el formulario de checkout incluye:
- ✅ **DUI**: Campo requerido con formato validado (12345678-9)
- ✅ **Teléfono**: Campo requerido para contacto
- ✅ **País por defecto**: El Salvador (SV)
- ✅ **Placeholders en español**: Todos los campos están en español

## Verificación

Para verificar que todo funciona:
1. Completa una compra con todos los campos
2. La factura mostrará el DUI y teléfono reales
3. El email se enviará con la factura PDF adjunta
