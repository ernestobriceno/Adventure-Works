import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products, type Product } from "@/data/products";

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

export default function Deals() {
  // Productos en oferta
  const dealProducts: Product[] = useMemo(
    () => products.filter((p) => p.tag === "deal"),
    []
  );

  // Carrusel simple (3 por página)
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(dealProducts.length / pageSize));
  const [page, setPage] = useState(0);
  const slice = dealProducts.slice(page * pageSize, page * pageSize + pageSize);

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);

  // Countdown objetivo: +2 días
  const target = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d;
  }, []);
  const { d, h, m, s } = useCountdown(target);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-6 lg:p-8">
        {/* 2 columnas: izquierda fija (340px), derecha flexible */}
        <div className="grid grid-cols-1 lg:[grid-template-columns:340px_1fr] gap-6">
          {/* Izquierda: título + CTA + contador */}
          <aside className="flex flex-col gap-5">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Deals Of The Month
              </h2>
              <button className="px-5 py-2 rounded-lg bg-black text-white font-medium hover:bg-neutral-800 transition w-max">
                Buy Now
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-semibold leading-tight">
                Hurry, Before It’s Too Late!
              </h3>

              {/* Contador compacto */}
              <div className="flex flex-wrap items-center gap-3">
                <TimeBox value={d} label="Days" />
                <TimeBox value={h} label="Hr" />
                <TimeBox value={m} label="Mins" />
                <TimeBox value={s} label="Sec" />
              </div>
            </div>
          </aside>

          {/* Derecha: grid de cards */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 [&>*]:h-full [&>*]:w-full">
              {slice.map((p) => (
                <div key={p.id} className="h-full w-full">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>

            {/* Paginación / Dots */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={goPrev}
                className="w-9 h-9 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50"
                aria-label="Anterior"
              >
                ‹
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Ir a la página ${i + 1}`}
                    className={[
                      "w-2.5 h-2.5 rounded-full",
                      i === page ? "bg-neutral-900" : "bg-neutral-300",
                    ].join(" ")}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                className="w-9 h-9 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50"
                aria-label="Siguiente"
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

/* Caja de tiempo: tamaño fijo y números monoespaciados */
function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-neutral-200 shadow-sm bg-white grid place-items-center">
      <div className="text-center leading-tight">
        <div className="text-xl md:text-2xl font-semibold font-mono tabular-nums">
          {String(value).padStart(2, "0")}
        </div>
        <div className="text-[10px] md:text-[11px] text-neutral-500">{label}</div>
      </div>
    </div>
  );
}
