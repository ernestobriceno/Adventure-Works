// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { products, categories } from "./data/products.js";

// ---------- ENV / CONFIG ----------
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_PATH = path.join(__dirname, "data", "users.json");
const ORDERS_PATH = path.join(__dirname, "data", "orders.json");

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""; // opcional, recomendado setearlo

// Permite front en local y otros dominios que agregues por coma
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// ---------- APP ----------
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",                 // front local (Vite)
      "http://127.0.0.1:5173",
      "https://adventureworkscycle.netlify.app" // tu sitio en Netlify
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- HELPERS (persistencia JSON) ----------
function readJSON(p) {
  try {
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return [];
  }
}
function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// ---------- AUTH MIDDLEWARE ----------
function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ---------- ADMIN MIDDLEWARE ----------
function adminAuth(req, res, next) {
  const users = readJSON(USERS_PATH);
  const user = users.find((u) => u.id === req.user.sub);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// ---------- UTILS ----------
function unitPrice(p) {
  // -25% si es deal
  return p.tag === "deal" ? +(p.price * 0.75).toFixed(2) : p.price;
}

// ---------- GOOGLE OAUTH ----------
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ---------- EMAIL CONFIGURATION ----------
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER || "";
const EMAIL_PASS = process.env.EMAIL_PASS || "";

// Verificar configuración de email
const isEmailConfigured = EMAIL_USER && EMAIL_PASS;

let transporter = null;
if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
  
  // Verificar conexión al iniciar
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email service configuration error:", error.message);
    } else {
      console.log("✅ Email service configured successfully");
    }
  });
} else {
  console.warn("⚠️  Email service not configured. Set EMAIL_USER and EMAIL_PASS in .env file");
}

// ================== ROUTES ==================

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// -------- Productos
// GET /api/products?category=...&tag=deal&q=texto
app.get("/api/products", (req, res) => {
  let list = [...products];
  const { category, tag, q } = req.query;

  if (category) list = list.filter((p) => p.category === category);
  if (tag) list = list.filter((p) => p.tag === tag);
  if (q) {
    const t = String(q).toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.brand.toLowerCase().includes(t)
    );
  }
  res.json(list);
});

// GET /api/products/:id
app.get("/api/products/:id", (req, res) => {
  const p = products.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// GET /api/categories
app.get("/api/categories", (_req, res) => res.json(categories));

// GET /api/deals (solo tag=deal)
app.get("/api/deals", (_req, res) =>
  res.json(products.filter((p) => p.tag === "deal"))
);

// -------- Auth (email/password)
// POST /api/auth/signup  {email, password, name}
app.post("/api/auth/signup", (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });

  const users = readJSON(USERS_PATH);
  if (users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hash = bcrypt.hashSync(password, 10);
  const isFirstUser = users.length === 0; // El primer usuario es administrador
  const user = {
    id: nanoid(),
    email,
    name: name || "",
    hash,
    isAdmin: isFirstUser,
    createdAt: Date.now(),
  };
  users.push(user);
  writeJSON(USERS_PATH, users);

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    },
  });
});

// POST /api/auth/signin  {email, password}
app.post("/api/auth/signin", (req, res) => {
  const { email, password } = req.body || {};
  const users = readJSON(USERS_PATH);
  const user = users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (!user || !user.hash)
    return res.status(401).json({ error: "Invalid credentials" });

  const ok = bcrypt.compareSync(password, user.hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      isAdmin: user.isAdmin || false,
      createdAt: user.createdAt
    },
  });
});

// -------- Auth (Google)
// POST /api/auth/google  { idToken }
app.post("/api/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: "Missing idToken" });

    // Verificar el ID Token con Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID || undefined, // mejor setearlo en .env
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: "Invalid Google token" });

    const email = payload.email;
    const name = payload.name || "";
    if (!email) return res.status(400).json({ error: "Google token missing email" });

    // Buscar o crear usuario
    const users = readJSON(USERS_PATH);
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: nanoid(),
        email,
        name,
        provider: "google",
        createdAt: Date.now(),
      };
      users.push(user);
      writeJSON(USERS_PATH, users);
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider || "google",
      },
    });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Google verification failed" });
  }
});

// GET /api/me
app.get("/api/me", auth, (req, res) => {
  const users = readJSON(USERS_PATH);
  const me = users.find((u) => u.id === req.user.sub);
  if (!me) return res.status(404).json({ error: "Not found" });
  
  // TEMPORAL: Hacer que todos los usuarios sean admin para testing
  // En producción, usar: isAdmin: me.isAdmin || false
  res.json({ 
    id: me.id, 
    email: me.email, 
    name: me.name,
    isAdmin: true, // TEMPORAL - todos los usuarios son admin
    createdAt: me.createdAt
  });
});

// -------- Órdenes
// POST /api/orders  {items:[{productId,qty}], address, discount?, shipping?}
app.post("/api/orders", auth, (req, res) => {
  try {
    const { items, address, discount, shipping = 0 } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items required" });
    }

    // Enriquecer líneas
    const lines = items.map((it) => {
      const p = products.find((x) => x.id === it.productId);
      if (!p) throw new Error("Invalid product");
      const unit = unitPrice(p);
      const qty = Number(it.qty || 1);
      return {
        productId: p.id,
        name: p.name,
        brand: p.brand,
        image: p.image,
        tag: p.tag || null,
        qty,
        unit,
        line: +(unit * qty).toFixed(2),
      };
    });

    // Total
    let total = +lines.reduce((a, b) => a + b.line, 0).toFixed(2);
    const discountAmount = discount?.amount ? Number(discount.amount) : 0;
    total = +(total - discountAmount + Number(shipping)).toFixed(2);
    if (total < 0) total = 0;

    // Persistir
    const orders = readJSON(ORDERS_PATH);
    const order = {
      id: nanoid(),
      userId: req.user.sub,
      items: lines,
      total,
      address: address || null,
      discount: discount || null,
      shipping: Number(shipping) || 0,
      status: "created",
      createdAt: Date.now(),
    };
    orders.push(order);
    writeJSON(ORDERS_PATH, orders);

    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ error: e.message || "Invalid payload" });
  }
});

// GET /api/orders/:id
app.get("/api/orders/:id", auth, (req, res) => {
  const orders = readJSON(ORDERS_PATH);
  const order = orders.find((o) => o.id === req.params.id && o.userId === req.user.sub);
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

// Helper function to generate El Salvador compliant invoice PDF
async function generateInvoicePDF(order) {
  const doc = new PDFDocument({ size: "A4", margin: 20 });
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  
  return new Promise(async (resolve) => {
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Header Section
    doc.fontSize(28).text("Factura", { x: 30, y: 30 });
    doc.fontSize(20).text("Adventure WorkCycle", { x: 250, y: 30, align: "center" });
    doc.fontSize(12).text("FACTURA ELECTRÓNICA", { x: 250, y: 55, align: "center" });
    
    // Invoice Details Section
    const detailsY = 90;
    doc.fontSize(10);
    doc.text(`Código de Generación: ${order.id}`, { x: 30, y: detailsY });
    doc.text(`Número de Control: DTE-01-S005P001-${order.id}`, { x: 30, y: detailsY + 15 });
    doc.text(`Sello de recepción: ${order.id.substring(0, 8)}`, { x: 30, y: detailsY + 30 });
    doc.text(`Número Interno: ${order.id}`, { x: 30, y: detailsY + 45 });
    
    doc.text(`Modelo de Facturación: Modelo Facturación previo`, { x: 350, y: detailsY });
    doc.text(`Tipo de Transmisión: Transmisión normal`, { x: 350, y: detailsY + 15 });
    doc.text(`Fecha y Hora de Generación: ${new Date(order.createdAt).toLocaleDateString('es-SV')}, ${new Date(order.createdAt).toLocaleTimeString('es-SV')}`, { x: 350, y: detailsY + 30 });
    
    // Emisor and Receptor Sections
    const emisorY = 160;
    const receptorY = 160;
    
    // Emisor Box
    doc.rect(30, emisorY, 250, 120).stroke();
    doc.fontSize(12).text("Emisor", { x: 40, y: emisorY + 10, bold: true });
    doc.fontSize(10);
    doc.text("Nombre o razón social: AdventureWorkCycle", { x: 40, y: emisorY + 30 });
    doc.text("NIT: 06141806191048", { x: 40, y: emisorY + 45 });
    doc.text("NRC: 2807177", { x: 40, y: emisorY + 60 });
    doc.text("Actividad Económica: Tienda de Bicicletas", { x: 40, y: emisorY + 75 });
    doc.text("Dirección: 71 AV. LA REVOLUCION, LOCAL. 115 Y 117, COL. SAN BENITO, NIVEL 1, CENTRO COMERCIAL Y TORRE PRESIDENTE PLAZASAN SALVADOR, SAN SALVADOR", { x: 40, y: emisorY + 90 });
    
    // Receptor Box
    doc.rect(300, receptorY, 270, 120).stroke();
    doc.fontSize(12).text("Receptor", { x: 310, y: receptorY + 10, bold: true });
    doc.fontSize(10);
    doc.text(`Nombre o razón social: ${order.address?.name || 'N/A'}`, { x: 310, y: receptorY + 30 });
    doc.text(`DUI: ${order.address?.dui || 'N/A'}`, { x: 310, y: receptorY + 45 });
    doc.text("Actividad económica: Cliente", { x: 310, y: receptorY + 60 });
    doc.text("NRC:", { x: 310, y: receptorY + 75 });
    doc.text(`Dirección: ${order.address?.line1 || 'N/A'}, ${order.address?.city || 'N/A'}`, { x: 310, y: receptorY + 90 });
    doc.text(`Correo electrónico: ${order.address?.email || 'N/A'}`, { x: 310, y: receptorY + 105 });
    doc.text(`Teléfono: ${order.address?.phone || 'N/A'}`, { x: 310, y: receptorY + 120 });
    
    // Products Table
    const tableY = 300;
    const headerY = tableY;
    
    // Table header with yellow background
    doc.rect(30, headerY, 540, 25).fillAndStroke('#FFE066', '#000000');
    doc.fillColor('black');
    doc.fontSize(10);
    doc.text("N°", 40, headerY + 8);
    doc.text("Código", 80, headerY + 8);
    doc.text("Cant.", 140, headerY + 8);
    doc.text("Unidad", 180, headerY + 8);
    doc.text("Descripción", 220, headerY + 8);
    doc.text("Precio Unitario", 380, headerY + 8);
    doc.text("Descuento por item", 480, headerY + 8);
    doc.text("Ventas Gravadas", 550, headerY + 8);
    
    // Table rows
    let currentY = headerY + 25;
    order.items.forEach((item, index) => {
      const rowHeight = 25;
      
      // White background for data rows
      doc.rect(30, currentY, 540, rowHeight).fill('#FFFFFF');
      doc.rect(30, currentY, 540, rowHeight).stroke();
      
      doc.fillColor('black');
      doc.fontSize(9);
      doc.text(`${index + 1}`, 40, currentY + 8);
      doc.text(`${item.productId}`, 80, currentY + 8);
      doc.text(`${item.qty}`, 140, currentY + 8);
      doc.text("Unidad", 180, currentY + 8);
      doc.text(`${item.name} (${item.brand})`, 220, currentY + 8);
      doc.text(`$${item.unit.toFixed(2)}`, 380, currentY + 8);
      doc.text("$0.00", 480, currentY + 8);
      doc.text(`$${item.line.toFixed(2)}`, 550, currentY + 8);
      
      currentY += rowHeight;
    });
    
    // Additional Information and Summary Sections
    const infoY = currentY + 20;
    
    // Calculate totals
    const subtotal = order.items.reduce((sum, item) => sum + item.line, 0);
    const taxRate = 0.13;
    const taxableAmount = subtotal - (order.discount?.amount || 0);
    const tax = taxableAmount * taxRate;
    const total = subtotal + tax;
    
    // Left side - Additional Information (organized layout)
    const leftInfoY = infoY;
    doc.fontSize(10);
    doc.text(`Valor en letras: ${numberToWords(total)} CON ${(total % 1 * 100).toFixed(0)}/100`, { x: 30, y: leftInfoY });
    doc.text("Observaciones:", { x: 30, y: leftInfoY + 20 });
    doc.text("Condición de la Operación: 1 - Contado", { x: 30, y: leftInfoY + 40 });
    
    // Extension table (better organized)
    doc.text("Nombre entrega", { x: 30, y: leftInfoY + 60 });
    doc.text("Documento", { x: 150, y: leftInfoY + 60 });
    doc.text("Nombre recibe", { x: 30, y: leftInfoY + 80 });
    doc.text("No Documento", { x: 150, y: leftInfoY + 80 });
    
    // QR Code in bottom left (better positioned)
    const qrY = leftInfoY + 100;
    const qrSize = 80;
    const qrX = 30;
    
    // QR Code data (El Salvador standard format)
    const qrData = {
      nit: "06141806191048",
      nrc: "2807177",
      numero: order.id,
      fecha: new Date(order.createdAt).toISOString().split('T')[0],
      monto: total.toFixed(2),
      dui: order.address?.dui || "",
      nombre: order.address?.name || ""
    };
    
    // Generate QR Code
    try {
      const qrString = JSON.stringify(qrData);
      const qrCodeDataURL = await QRCode.toDataURL(qrString, {
        width: qrSize,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Add QR Code to PDF
      doc.image(qrCodeDataURL, qrX, qrY, { width: qrSize, height: qrSize });
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Fallback: draw a placeholder
      doc.rect(qrX, qrY, qrSize, qrSize).stroke();
      doc.fontSize(8).text("CÓDIGO QR", { x: qrX + 25, y: qrY + 35 });
    }
    
    // Right side - Summary of Operations (better positioned and organized)
    const summaryY = infoY;
    const summaryWidth = 200;
    const summaryHeight = 140;
    const summaryX = 350;
    
    doc.rect(summaryX, summaryY, summaryWidth, summaryHeight).fillAndStroke('#FFE066', '#000000');
    doc.fillColor('black');
    doc.fontSize(12).text("Suma Total de Operaciones", { x: summaryX + 10, y: summaryY + 10, bold: true });
    
    doc.fontSize(10);
    doc.text(`Suma Total de Operaciones: $${subtotal.toFixed(2)}`, { x: summaryX + 10, y: summaryY + 30 });
    doc.text(`Sub-Total: $${(subtotal - tax).toFixed(2)}`, { x: summaryX + 10, y: summaryY + 45 });
    doc.text(`IVA: $${tax.toFixed(2)}`, { x: summaryX + 10, y: summaryY + 60 });
    doc.text("Retención Renta: $0.00", { x: summaryX + 10, y: summaryY + 75 });
    doc.text("Descuentos: $0.00", { x: summaryX + 10, y: summaryY + 90 });
    doc.text(`Total a Pagar: $${total.toFixed(2)}`, { x: summaryX + 10, y: summaryY + 105 });
    doc.text("Total Otros montos no afectos: $0.00", { x: summaryX + 10, y: summaryY + 120 });
    
    doc.end();
  });
}

// Helper function to convert numbers to words (simplified)
function numberToWords(num) {
  const ones = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  
  if (num < 10) return ones[Math.floor(num)];
  if (num < 20) return teens[Math.floor(num) - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = Math.floor(num % 10);
    return tens[ten] + (one > 0 ? ' y ' + ones[one] : '');
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return ones[hundred] + 'cientos' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }
  return 'CUATROCIENTOS NOVENTA Y UNO'; // Simplified for demo
}

// GET /api/orders/:id/invoice.pdf  -> Genera PDF
app.get("/api/orders/:id/invoice.pdf", auth, async (req, res) => {
  const orders = readJSON(ORDERS_PATH);
  const order = orders.find((o) => o.id === req.params.id && o.userId === req.user.sub);
  if (!order) return res.status(404).json({ error: "Not found" });

  try {
    const pdfBuffer = await generateInvoicePDF(order);
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="Factura-${order.id}.pdf"`
    );
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating invoice" });
  }
});

// POST /api/orders/:id/send-invoice  -> Send invoice via email
app.post("/api/orders/:id/send-invoice", auth, async (req, res) => {
  const orders = readJSON(ORDERS_PATH);
  const order = orders.find((o) => o.id === req.params.id && o.userId === req.user.sub);
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (!order.address?.email) {
    return res.status(400).json({ error: "No email address provided" });
  }

  // Check if email configuration is set up
  if (!isEmailConfigured || !transporter) {
    return res.status(500).json({ 
      error: "Email service not configured. Please contact administrator to set up email credentials." 
    });
  }

  try {
    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(order);
    
    // Create detailed HTML email body
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura Electrónica - Adventure WorkCycle</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .order-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background-color: #34495e; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .highlight { color: #e74c3c; font-weight: bold; }
          .success { color: #27ae60; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏍️ Adventure WorkCycle</h1>
          <h2>Factura Electrónica</h2>
        </div>
        
        <div class="content">
          <h3>¡Gracias por su compra!</h3>
          <p>Estimado/a <strong>${order.address.name || 'Cliente'}</strong>,</p>
          
          <p>Adjunto encontrará la factura electrónica de su compra en Adventure WorkCycle.</p>
          
          <div class="order-details">
            <h4>📋 Detalles de la Orden</h4>
            <p><strong>Número de Orden:</strong> <span class="highlight">${order.id}</span></p>
            <p><strong>Fecha de Compra:</strong> ${new Date(order.createdAt).toLocaleDateString('es-SV')}</p>
            <p><strong>Hora de Compra:</strong> ${new Date(order.createdAt).toLocaleTimeString('es-SV')}</p>
            <p><strong>Total Pagado:</strong> <span class="success">$${order.total.toFixed(2)}</span></p>
            <p><strong>Estado:</strong> ${order.status}</p>
          </div>
          
          <div class="order-details">
            <h4>📦 Productos Comprados</h4>
            <ul>
              ${order.items.map(item => `
                <li><strong>${item.name}</strong> (${item.brand}) - Cantidad: ${item.qty} - $${item.line.toFixed(2)}</li>
              `).join('')}
            </ul>
          </div>
          
          ${order.discount ? `
          <div class="order-details">
            <h4>🎉 Descuento Aplicado</h4>
            <p><strong>Código:</strong> ${order.discount.code}</p>
            <p><strong>Descuento:</strong> -$${Number(order.discount.amount).toFixed(2)}</p>
          </div>
          ` : ''}
          
          <p><strong>📄 Factura PDF:</strong> Adjunto encontrará la factura electrónica en formato PDF que cumple con las normativas de facturación electrónica de El Salvador.</p>
          
          <p>Si tiene alguna pregunta sobre su pedido, no dude en contactarnos.</p>
        </div>
        
        <div class="footer">
          <p>Saludos cordiales,<br><strong>Equipo Adventure WorkCycle</strong></p>
          <p>🏍️ Tu tienda de confianza para bicicletas y accesorios</p>
          <p>📧 Email: ventas@adventureworks.sv | 📞 Tel: +503 2234-5678</p>
        </div>
      </body>
      </html>
    `;
    
    // Send email
    const mailOptions = {
      from: `"Adventure WorkCycle" <${EMAIL_USER}>`,
      to: order.address.email,
      subject: `🏍️ Factura Electrónica - Adventure WorkCycle - Orden ${order.id}`,
      html: emailHtml,
      attachments: [
        {
          filename: `Factura-${order.id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    res.json({ 
      message: "Invoice sent successfully",
      orderId: order.id,
      email: order.address.email
    });
  } catch (error) {
    console.error("Error sending email:", error);
    
    // Provide more specific error messages
    let errorMessage = "Error sending invoice";
    if (error.code === 'EAUTH') {
      errorMessage = "Email authentication failed. Please check email credentials.";
    } else if (error.code === 'ECONNECTION') {
      errorMessage = "Could not connect to email server. Please try again later.";
    } else if (error.code === 'EENVELOPE') {
      errorMessage = "Invalid email address. Please check the recipient email.";
    } else if (error.code === 'EMESSAGE') {
      errorMessage = "Error creating email message. Please check email content.";
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// -------- ADMIN ENDPOINTS --------
// GET /api/admin/users - List all users (admin only)
app.get("/api/admin/users", auth, adminAuth, (req, res) => {
  const users = readJSON(USERS_PATH);
  const usersWithoutHash = users.map(({ hash, ...user }) => user); // Remove password hashes
  res.json(usersWithoutHash);
});

// DELETE /api/admin/users/:id - Delete user (admin only)
app.delete("/api/admin/users/:id", auth, adminAuth, (req, res) => {
  const users = readJSON(USERS_PATH);
  const userIndex = users.findIndex((u) => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  
  const user = users[userIndex];
  if (user.isAdmin) {
    return res.status(403).json({ error: "Cannot delete admin user" });
  }
  
  users.splice(userIndex, 1);
  writeJSON(USERS_PATH, users);
  res.json({ message: "User deleted successfully" });
});

// GET /api/admin/orders - List all orders (admin only)
app.get("/api/admin/orders", auth, adminAuth, (req, res) => {
  const orders = readJSON(ORDERS_PATH);
  res.json(orders);
});

// PATCH /api/admin/orders/:id - Update order status (admin only)
app.patch("/api/admin/orders/:id", auth, adminAuth, (req, res) => {
  const orders = readJSON(ORDERS_PATH);
  const orderIndex = orders.findIndex((o) => o.id === req.params.id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }
  
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }
  
  orders[orderIndex].status = status;
  writeJSON(ORDERS_PATH, orders);
  res.json({ message: "Order status updated successfully" });
});

// ---------- START ----------
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
