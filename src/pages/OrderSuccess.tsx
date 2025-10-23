import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchJson } from "@/lib/api";
import QRCode from "qrcode";

type OrderItem = {
  productId: string;
  name: string;
  brand: string;
  image: string;
  tag: string | null;
  qty: number;
  unit: number;
  line: number;
};
type Order = {
  id: string;
  total: number;
  items: OrderItem[];
  status: string;
  createdAt: number;
  address?: any;
};

// Helper function to convert numbers to Spanish words
function numberToWords(num: number): string {
  const ones = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const tens = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const hundreds = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  if (num === 0) return 'CERO';
  if (num < 0) return 'MENOS ' + numberToWords(-num);

  let result = '';

  // Handle thousands
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    if (thousands === 1) {
      result += 'MIL ';
    } else {
      result += numberToWords(thousands) + ' MIL ';
    }
    num %= 1000;
  }

  // Handle hundreds
  if (num >= 100) {
    const hundred = Math.floor(num / 100);
    if (hundred === 1 && num % 100 === 0) {
      result += 'CIEN ';
    } else {
      result += hundreds[hundred] + ' ';
    }
    num %= 100;
  }

  // Handle tens and ones
  if (num >= 20) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    result += tens[ten];
    if (one > 0) {
      result += ' Y ' + ones[one];
    }
    result += ' ';
  } else if (num >= 10) {
    result += teens[num - 10] + ' ';
  } else if (num > 0) {
    result += ones[num] + ' ';
  }

  return result.trim();
}

export default function OrderSuccess() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const facturaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    (async () => {
      try {
        const data = await fetchJson(`/api/orders/${id}`);
        setOrder(data);
        
        // Generate QR Code
        if (data) {
          const qrData = {
            nit: "06141806191048",
            nrc: "2807177",
            numero: data.id,
            fecha: new Date(data.createdAt).toISOString().split('T')[0],
            monto: data.total.toFixed(2),
            dui: data.address?.dui || "",
            nombre: data.address?.name || ""
          };
          
          try {
            const qrString = JSON.stringify(qrData);
            const qrCodeDataURL = await QRCode.toDataURL(qrString, {
              width: 100,
              margin: 1,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            setQrCodeDataURL(qrCodeDataURL);
          } catch (error) {
            console.error('Error generating QR code:', error);
          }
        }
      } catch (e: any) {
        setErr(e.message || "No fue posible cargar la orden.");
      }
    })();
  }, [id, user, navigate]);

  const first = useMemo(() => order?.items?.[0] || null, [order]);

  function scrollToFactura() {
    if (facturaRef.current) {
      facturaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function sendInvoiceEmail() {
    if (!order) return;
    
    setSendingEmail(true);
    setErr(null);
    
    try {
      await fetchJson(`/api/orders/${order.id}/send-invoice`, {
        method: "POST",
      });
      setEmailSent(true);
    } catch (e: any) {
      setErr(e.message || "Error enviando la factura por email");
    } finally {
      setSendingEmail(false);
    }
  }

  if (err) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold">Orden</h2>
        <p className="mt-2 text-rose-600">{err}</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 rounded-lg border">
          Volver al inicio
        </Link>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-12">
        <p>Cargando…</p>
      </section>
    );
  }

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #factura, #factura * {
            visibility: visible;
          }
          #factura {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
            background: white;
          }
          .no-print {
            display: none !important;
          }
          table {
            page-break-inside: avoid;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>
      
      <section className="px-4 py-10">
      {/* Hero de agradecimiento */}
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">
          ¡Gracias Por Tu Compra!
        </h1>

        {/* Imagen del producto principal */}
        {first && (
          <div className="mt-8">
            <img
              src={first.image}
              alt={first.name}
              className="mx-auto w-full max-w-xl h-[320px] object-contain"
            />
          </div>
        )}

        <h2 className="mt-10 text-3xl md:text-4xl font-serif">
          ¡Tu Orden Ya Está En Camino!
        </h2>

        <p className="mt-4 text-xl">
          Orden <span className="font-semibold">#{order.id}</span>
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap no-print">
          <button
            onClick={scrollToFactura}
            className="rounded-lg bg-black text-white px-6 py-3 shadow hover:bg-neutral-900"
          >
            Ver Factura
          </button>
          <button
            onClick={sendInvoiceEmail}
            disabled={sendingEmail || emailSent}
            className="rounded-lg bg-blue-600 text-white px-6 py-3 shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingEmail ? "Enviando..." : emailSent ? "Factura Enviada" : "Enviar Factura por Email"}
          </button>
          <Link
            to="/"
            className="rounded-lg border px-6 py-3 hover:bg-neutral-50"
          >
            Seguir comprando
          </Link>
        </div>
        
        {emailSent && (
          <div className="mt-4 text-center no-print">
            <p className="text-green-600 font-medium">✓ Factura enviada exitosamente a tu email</p>
          </div>
        )}
        
        {err && (
          <div className="mt-4 text-center no-print">
            <p className="text-red-600">{err}</p>
          </div>
        )}
      </div>

      {/* Factura / Detalle */}
      <div
        ref={facturaRef}
        id="factura"
        className="max-w-4xl mx-auto mt-12 rounded-2xl bg-white border border-neutral-200 shadow-sm p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Factura</h3>
          <button
            onClick={() => window.print()}
            className="text-sm rounded-lg border px-3 py-1.5 hover:bg-neutral-50 no-print"
          >
            Imprimir
          </button>
        </div>

        {/* Header with company info */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Adventure WorkCycle</h1>
            <p className="text-sm text-gray-600">FACTURA ELECTRÓNICA</p>
          </div>
          
          {/* Invoice metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-4">
            <div>
              <p><strong>Código de Generación:</strong> {order.id}</p>
              <p><strong>Número de Control:</strong> DTE-01-S005P001-{order.id.slice(-12)}</p>
              <p><strong>Sello de recepción:</strong> {order.id.slice(0, 8).toUpperCase()}</p>
              <p><strong>Número Interno:</strong> {order.id}</p>
            </div>
            <div className="text-right">
              <p><strong>Modelo de Facturación:</strong> Modelo Facturación previo</p>
              <p><strong>Tipo de Transmisión:</strong> Transmisión normal</p>
              <p><strong>Fecha y Hora de Generación:</strong> {new Date(order.createdAt).toLocaleString('es-SV')}</p>
            </div>
          </div>
        </div>

        {/* Emisor and Receptor boxes */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Emisor (Sender) - Hardcoded */}
          <div className="border border-gray-300 p-4 rounded">
            <h4 className="font-bold text-sm mb-2">Emisor</h4>
            <div className="text-xs space-y-1">
              <p><strong>Nombre o razón social:</strong> AdventureWorkCycle</p>
              <p><strong>NIT:</strong> 06141806191048</p>
              <p><strong>NRC:</strong> 2807177</p>
              <p><strong>Actividad Económica:</strong> Tienda de Bicicletas</p>
              <p><strong>Dirección:</strong> 71 AV. LA REVOLUCION, LOCAL. 115 Y 117, COL. SAN BENITO, NIVEL 1, CENTRO COMERCIAL Y TORRE PRESIDENTE PLAZASAN SALVADOR, SAN SALVADOR.</p>
            </div>
          </div>

          {/* Receptor (Receiver) - Dynamic */}
          <div className="border border-gray-300 p-4 rounded">
            <h4 className="font-bold text-sm mb-2">Receptor</h4>
            <div className="text-xs space-y-1">
              <p><strong>Nombre o razón social:</strong> {order?.address?.name || 'N/A'}</p>
              <p><strong>DUI:</strong> {order?.address?.dui || 'N/A'}</p>
              <p><strong>Actividad económica:</strong> Cliente</p>
              <p><strong>NRC:</strong> </p>
              <p><strong>Dirección:</strong> {order?.address?.line1 || 'N/A'}, {order?.address?.city || 'N/A'}</p>
              <p><strong>Correo electrónico:</strong> {order?.address?.email || 'N/A'}</p>
              <p><strong>Nombre comercial:</strong> </p>
              <p><strong>Teléfono:</strong> {order?.address?.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Product table */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <thead className="bg-yellow-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Nº</th>
                <th className="border border-gray-300 p-2 text-left">Código</th>
                <th className="border border-gray-300 p-2 text-left">Cant.</th>
                <th className="border border-gray-300 p-2 text-left">Unidad</th>
                <th className="border border-gray-300 p-2 text-left">Descripción</th>
                <th className="border border-gray-300 p-2 text-left">Precio Unitario</th>
                <th className="border border-gray-300 p-2 text-left">Descuento por item</th>
                <th className="border border-gray-300 p-2 text-left">Ventas No Sujetas</th>
                <th className="border border-gray-300 p-2 text-left">Ventas Exentas</th>
                <th className="border border-gray-300 p-2 text-left">Ventas Gravadas</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it, index) => (
                <tr key={it.productId}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{it.productId}</td>
                  <td className="border border-gray-300 p-2">{it.qty}</td>
                  <td className="border border-gray-300 p-2">Unidad</td>
                  <td className="border border-gray-300 p-2">{it.name}</td>
                  <td className="border border-gray-300 p-2">${it.unit.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">$0.00</td>
                  <td className="border border-gray-300 p-2">$0.00</td>
                  <td className="border border-gray-300 p-2">$0.00</td>
                  <td className="border border-gray-300 p-2">${it.line.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom sections */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left section */}
          <div className="text-xs space-y-2">
            <p><strong>Valor en letras:</strong> {numberToWords(order.total)} CON {(order.total % 1 * 100).toFixed(0).padStart(2, '0')}/100</p>
            <p><strong>Observaciones:</strong> </p>
            <p><strong>Condición de la Operación:</strong> 1 - Contado</p>
            
            {/* Extension table */}
            <div className="mt-4">
              <p className="font-bold mb-2">Extension</p>
              <table className="w-full border-collapse border border-gray-300">
                <tr>
                  <td className="border border-gray-300 p-1">Nombre entrega</td>
                  <td className="border border-gray-300 p-1">Documento</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1">Nombre recibe</td>
                  <td className="border border-gray-300 p-1">No Documento</td>
                </tr>
              </table>
            </div>
            
            {/* QR Code */}
            {qrCodeDataURL && (
              <div className="mt-4">
                <p className="font-bold mb-2">Código QR</p>
                <img 
                  src={qrCodeDataURL} 
                  alt="Código QR de la factura" 
                  className="w-24 h-24 border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Right section - Summary */}
          <div>
            <table className="w-full border-collapse border border-gray-300 text-xs">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Suma Total de Operaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Suma Total de Operaciones: ${order.items.reduce((sum, item) => sum + item.line, 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Sub-Total: ${(order.total / 1.13).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">IVA: ${(order.total * 0.13 / 1.13).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Retención Renta: $</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Descuentos: $</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Monto Total de la Operación: $0.00</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Total Otros montos no afectos: $</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-bold">Total a Pagar: ${order.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}
