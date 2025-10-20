import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL, fetchJson } from "@/lib/api";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState<Product | null>(null);
  const [error, setError] = useState<string>();
  const { add } = useCart();

  useEffect(() => {
    if (!id) return;
    fetchJson<Product>(`${API_URL}/api/products/${id}`)
      .then(setP)
      .catch((e) => setError(String(e?.message || e)));
  }, [id]);

  if (error) {
    return <div className="max-w-5xl mx-auto p-6 text-rose-600">{error}</div>;
  }
  if (!p) {
    return <div className="max-w-5xl mx-auto p-6">Loading…</div>;
  }

  // --------- Derivados / helpers ----------
  const isDeal = p.tag === "deal";
  const discounted = isDeal ? +(p.price * 0.75).toFixed(2) : null;
  const imgSrc = p.image.startsWith("/") ? p.image : `/${p.image}`;

  // Fallback: si la API aún no trae stockCount, inferimos por p.stock
  const inferredCountFromStock =
    p.stock === "out" ? 0 : p.stock === "low" ? 5 : 12;

  const count =
    typeof (p as any).stockCount === "number"
      ? (p as any).stockCount
      : inferredCountFromStock;

  const isOut = p.stock === "out" || count <= 0;
  const isLow = !isOut && (p.stock === "low" || count <= 5);

  const stockLabel = isOut
    ? "SOLD OUT"
    : isLow
    ? `Almost sold out · ${count} left`
    : `In stock · ${count} available`;

  const rating = p.rating ?? 5;
  const stars = "★★★★★".slice(0, Math.min(5, Math.max(0, rating)));

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
      {/* Imagen */}
      <div className="rounded-2xl border bg-white p-6 grid place-items-center">
        <img src={imgSrc} alt={p.name} className="w-full h-[420px] object-contain" />
      </div>

      {/* Detalles */}
      <div>
        {/* Badges */}
        <div className="flex items-center gap-3 mb-2">
          {p.tag === "new" && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
              NEW
            </span>
          )}
          {p.tag === "deal" && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              DEAL
            </span>
          )}
          {isOut && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-neutral-700">
              SOLD OUT
            </span>
          )}
          {isLow && !isOut && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              Almost sold out
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold leading-tight">{p.name}</h1>
        <p className="text-neutral-500">{p.brand}</p>

        {/* Rating */}
        <div className="mt-3 text-amber-500 text-sm" aria-label={`${rating} stars`}>
          {stars}
        </div>

        {/* Precio */}
        <div className="mt-4 flex items-baseline gap-3">
          {discounted !== null ? (
            <>
              <div className="text-3xl font-extrabold text-emerald-700">
                ${discounted.toFixed(2)}
              </div>
              <div className="text-neutral-400 line-through">
                ${p.price.toFixed(2)}
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                -25%
              </span>
            </>
          ) : (
            <div className="text-3xl font-extrabold">${p.price.toFixed(2)}</div>
          )}
        </div>

        {/* Estado de stock */}
        <div className="mt-3">
          <span
            className={[
              "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
              isOut
                ? "bg-neutral-100 text-neutral-700"
                : isLow
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700",
            ].join(" ")}
          >
            {stockLabel}
          </span>
        </div>

        {/* Descripción */}
        <p className="mt-6 text-neutral-700 leading-relaxed">
          {(p as any).description || "High-performance bike for daily rides and trails."}
        </p>

        {/* Metadatos simples */}
        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">Category</dt>
            <dd className="font-medium capitalize">{p.category}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Brand</dt>
            <dd className="font-medium">{p.brand}</dd>
          </div>
        </dl>

        {/* CTA */}
        <button
          onClick={() => add(p)}
          disabled={isOut}
          className={[
            "mt-6 w-full rounded-lg border px-4 py-3 text-center font-medium transition",
            isOut
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "hover:bg-black hover:text-white",
          ].join(" ")}
        >
          {isOut ? "Out of stock" : "Add to cart"}
        </button>

        {/* Nota de envío */}
        <p className="mt-3 text-xs text-neutral-500">
          Envíos y devoluciones gratis en pedidos superiores a $75.
        </p>
      </div>
    </section>
  );
}
