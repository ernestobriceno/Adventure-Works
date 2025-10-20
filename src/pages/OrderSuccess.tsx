import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

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

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const facturaRef = useRef<HTMLDivElement | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Request failed (${res.status})`);
        }
        const data = await res.json();
        setOrder(data);
      } catch (e: any) {
        setErr(e.message || "No fue posible cargar la orden.");
      }
    })();
  }, [id, token, navigate]);

  const first = useMemo(() => order?.items?.[0] || null, [order]);

  function scrollToFactura() {
    if (facturaRef.current) {
      facturaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={scrollToFactura}
            className="rounded-lg bg-black text-white px-6 py-3 shadow hover:bg-neutral-900"
          >
            Ver Factura
          </button>
          <Link
            to="/"
            className="rounded-lg border px-6 py-3 hover:bg-neutral-50"
          >
            Seguir comprando
          </Link>
        </div>
      </div>

      {/* Factura / Detalle */}
      <div
        ref={facturaRef}
        id="factura"
        className="max-w-3xl mx-auto mt-12 rounded-2xl bg-white border border-neutral-200 shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Factura</h3>
          <button
            onClick={() => window.print()}
            className="text-sm rounded-lg border px-3 py-1.5 hover:bg-neutral-50"
          >
            Imprimir
          </button>
        </div>

        {/* Cabecera */}
        <div className="mt-4 text-sm text-neutral-600">
          <div>Orden: <span className="font-mono">{order.id}</span></div>
          <div>
            Fecha: {new Date(order.createdAt).toLocaleString()}
          </div>
          {order?.address?.name && (
            <div className="mt-1">
              Cliente: <span className="font-medium">{order.address.name}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mt-6 divide-y">
          {order.items.map((it) => (
            <div key={it.productId} className="py-4 flex items-start gap-3">
              <img
                src={it.image}
                alt={it.name}
                className="w-16 h-16 object-contain border rounded"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {it.name}{" "}
                    <span className="text-xs text-neutral-500">{it.brand}</span>
                  </div>
                  <div className="text-sm text-neutral-600">x{it.qty}</div>
                </div>
                <div className="text-sm text-neutral-500">
                  Unit: ${it.unit.toFixed(2)}{" "}
                  {it.tag === "deal" && (
                    <span className="ml-2 text-emerald-700">(-25%)</span>
                  )}
                </div>
                <div className="text-sm">
                  Linea: <span className="font-semibold">${it.line.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}
