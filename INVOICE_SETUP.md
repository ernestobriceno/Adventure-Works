# Adventure Works - Invoice Configuration

## Email Service Setup

To enable invoice email functionality, you need to configure email credentials in the API server.

### Steps to Configure Email Service:

1. **Create a Gmail App Password** (recommended):
   - Go to your Google Account settings
   - Enable 2-Factor Authentication
   - Generate an "App Password" for this application
   - Use this app password instead of your regular Gmail password

2. **Update the `.env` file** in the `Adventure-Works-API` directory:
   ```env
   # Email configuration for sending invoices
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Restart the API server** after updating the configuration.

### Alternative Email Providers:

You can also use other SMTP providers by changing the EMAIL_HOST and EMAIL_PORT values:

- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's settings

### Testing Email Functionality:

1. Complete a purchase in the application
2. Go to the order success page
3. Click "Enviar Factura por Email"
4. Check the recipient's email inbox

### Error Messages:

- **"Email service not configured"**: Email credentials are missing from `.env` file
- **"Email authentication failed"**: Invalid email credentials
- **"Could not connect to email server"**: Network or server issues
- **"Invalid email address"**: The recipient email format is incorrect

## Invoice Features

The invoice now includes:

- ✅ El Salvador compliant format matching official invoices
- ✅ Hardcoded sender information (Adventure WorkCycle)
- ✅ Dynamic recipient information from checkout form
- ✅ Professional print formatting
- ✅ Email delivery with PDF attachment
- ✅ Spanish number-to-words conversion
- ✅ Tax calculations (13% IVA)
- ✅ Proper invoice numbering and metadata
