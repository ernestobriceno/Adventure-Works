import { useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

/* ===== Tipos y utilidades del countdown ===== */
type TimeLeft = { d: number; h: number; m: number; s: number };

function calcLeft(target: Date): TimeLeft {
  const t = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(t / (1000 * 60 * 60 * 24));
  const h = Math.floor((t / (1000 * 60 * 60)) % 24);
  const m = Math.floor((t / (1000 * 60)) % 60);
  const s = Math.floor((t / 1000) % 60);
  return { d, h, m, s };
}
function useCountdown(target: Date): TimeLeft {
  const [left, setLeft] = useState<TimeLeft>(() => calcLeft(target));
  useEffect(() => {
    const id = setInterval(() => setLeft(calcLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

/* ===== Caja del número grande del contador ===== */
function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="w-28 h-28 rounded-2xl bg-white/80 border border-neutral-200 shadow-sm grid place-items-center">
      <div className="text-center leading-tight">
        <div className="text-4xl font-extrabold font-mono tabular-nums">
          {String(value).padStart(2, "0")}
        </div>
        <div className="text-xs text-neutral-500">{label}</div>
      </div>
    </div>
  );
}

export default function Deals() {
  /* ===== Productos: sólo los que tienen tag=deal ===== */
  const dealProducts: Product[] = useMemo(
    () => products.filter((p) => p.tag === "deal"),
    []
  );

  /* ===== Carrusel simple (3 por página) ===== */
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(dealProducts.length / pageSize));
  const [page, setPage] = useState(0);

  const slice = dealProducts.slice(page * pageSize, page * pageSize + pageSize);

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);

  /* ===== Countdown (ejemplo: termina en 2 días) ===== */
  const target = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d;
  }, []);
  const { d, h, m, s } = useCountdown(target);

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ===== Columna izquierda ===== */}
          <aside className="lg:col-span-4">
            <h2 className="text-[34px] sm:text-[40px] font-black leading-tight">
              Deals Of The Month
            </h2>
            <p className="text-neutral-500 mt-1">
              Productos con descuento automático del 25%.
            </p>

            <button className="mt-5 inline-flex items-center px-5 py-3 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 transition">
              Buy Now
            </button>

            <div className="mt-8">
              <h3 className="text-3xl font-extrabold leading-tight">
                Hurry, Before It’s Too Late!
              </h3>

              <div className="mt-6 flex flex-wrap gap-4">
                <TimeBox value={d} label="Days" />
                <TimeBox value={h} label="Hr" />
                <TimeBox value={m} label="Mins" />
                <TimeBox value={s} label="Sec" />
              </div>
            </div>
          </aside>

          {/* ===== Columna derecha (carrusel) ===== */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {slice.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>

            {/* Controles del carrusel */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50"
                aria-label="Anterior"
                title="Anterior"
              >
                ‹
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={[
                      "w-2.5 h-2.5 rounded-full",
                      i === page ? "bg-neutral-900" : "bg-neutral-300",
                    ].join(" ")}
                    aria-label={`Ir a la página ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50"
                aria-label="Siguiente"
                title="Siguiente"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
