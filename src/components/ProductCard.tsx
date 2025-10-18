import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();

  const isOut = p.stock === "out";
  const isLow = p.stock === "low";
  const isDeal = p.tag === "deal";
  const isNew = p.tag === "new";

  const discountPct = 25;
  const discounted = isDeal
    ? +(p.price * (1 - discountPct / 100)).toFixed(2)
    : null;

  const rating = Math.max(0, Math.min(5, p.rating ?? 5));

  return (
    <article
      className="w-full h-full bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition overflow-hidden"
      aria-label={`${p.name} ${p.brand}`}
    >
      {/* Imagen y badges */}
      <div className="relative h-[260px] bg-white flex items-center justify-center">
        {/* BADGES: esquina superior izquierda */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {isNew && (
            <span className="text-[11px] px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              NEW
            </span>
          )}
          {isDeal && (
            <>
              <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                DEAL
              </span>
              <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                -{discountPct}%
              </span>
            </>
          )}
        </div>

        {/* BADGE: esquina superior derecha (sold out / low) */}
        <div className="absolute top-3 right-3 flex gap-2">
          {isLow && !isOut && (
            <span className="text-[11px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Almost Sold Out
            </span>
          )}
          {isOut && (
            <span className="text-[11px] px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Imagen centrada, sin recortes */}
        <img
          src={p.image}
          alt={p.name}
          className={`max-h-[220px] max-w-[92%] object-contain ${
            isOut ? "opacity-60" : ""
          }`}
          loading="lazy"
        />
      </div>

      {/* Contenido */}
      <div className="p-4 pt-3">
        {/* Título y marca */}
        <h3 className="text-base font-semibold leading-tight">
          {p.name}
          <span className="text-xs text-neutral-500 ml-1 align-middle">
            {p.brand}
          </span>
        </h3>

        {/* Rating */}
        <div
          className="mt-1 text-amber-500 text-sm"
          aria-label={`Rating ${rating} de 5`}
        >
          {"★★★★★".slice(0, rating)}
        </div>

        {/* Precio */}
        <div className="mt-2 flex items-center gap-2">
          {discounted !== null ? (
            <>
              <span className="font-bold text-emerald-700">
                $
                {discounted.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-neutral-400 line-through text-sm">
                $
                {p.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </>
          ) : (
            <span className="font-bold">
              $
              {p.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          )}
        </div>

        {/* Botón */}
        <button
          onClick={() => !isOut && add(p)}
          disabled={isOut}
          className={[
            "mt-3 w-full rounded-lg border px-3 py-2 text-sm transition",
            isOut
              ? "text-neutral-400 bg-neutral-100 cursor-not-allowed"
              : "hover:bg-black hover:text-white",
          ].join(" ")}
        >
          {isOut ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
