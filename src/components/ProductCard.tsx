import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import type { Product } from "./Deals";

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();

  const imgSrc = p.image.startsWith("/")
    ? p.image
    : `/${p.image.replace(/^public\//, "")}`;

  const isDeal = p.tag === "deal";
  const discounted = isDeal ? +(p.price * 0.75).toFixed(2) : null;
  const isOut = p.stock === "out";
  const rating = Math.max(0, Math.min(5, p.rating ?? 5));

  return (
    <article className="group relative bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition overflow-hidden">
      <Link to={`/product/${p.id}`} className="block w-full">
        <div className="relative w-full h-[260px] grid place-items-center bg-white">
          {p.tag === "new" && (
            <span className="absolute left-3 top-3 text-[11px] px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">NEW</span>
          )}
          {isDeal && (
            <span className="absolute left-3 top-3 text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">DEAL</span>
          )}
          {isOut && (
            <span className="absolute right-3 top-3 text-[11px] px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">Out of stock</span>
          )}
          <img
            src={imgSrc}
            alt={p.name}
            className={`w-full h-full object-contain p-4 ${isOut ? "opacity-70" : ""}`}
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-4 pt-3">
        <h3 className="text-base font-semibold leading-tight">
          <Link to={`/product/${p.id}`} className="hover:underline">
            {p.name}
          </Link>
          <span className="text-xs text-neutral-500 ml-1 align-middle">{p.brand}</span>
        </h3>
        <div className="mt-1 text-amber-500 text-sm" aria-label={`Rating ${rating} de 5`}>
          {"★★★★★".slice(0, rating)}
        </div>
        <div className="mt-2 flex items-center gap-2">
          {discounted !== null ? (
            <>
              <span className="font-bold text-emerald-700">${discounted.toFixed(2)}</span>
              <span className="text-neutral-400 line-through text-sm">${p.price.toFixed(2)}</span>
              <span className="ml-1 text-[11px] px-1.5 py-[2px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">-25%</span>
            </>
          ) : (
            <span className="font-bold">${p.price.toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={() => !isOut && add(p)}
          disabled={isOut}
          className={[
            "mt-3 w-full rounded-lg border px-3 py-2 text-sm transition",
            isOut ? "text-neutral-400 bg-neutral-100 cursor-not-allowed" : "hover:bg-black hover:text-white",
          ].join(" ")}
        >
          {isOut ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
