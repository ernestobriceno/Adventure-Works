import { useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import ProductCard from "./ProductCard";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "mountain", label: "Mountain" },
  { id: "hybrid", label: "Hybrid" },
  { id: "bmx", label: "BMX" },
  { id: "electric", label: "Electric" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

export default function NewArrivals() {
  const [active, setActive] = useState<CategoryId>("all");

  const filtered: Product[] = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      {/* Título */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight">
        Products
      </h2>
      <p className="text-center text-neutral-500 mt-2 max-w-2xl mx-auto text-base">
        Explore our latest collection and find the perfect ride for you.
      </p>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 justify-center mt-6">
        {CATEGORIES.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={[
                "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                isActive
                  ? "bg-black text-white border-black shadow"
                  : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Grid de productos */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10 [&>*]:h-full">
        {filtered.length ? (
          filtered.map((p) => (
            <div key={p.id} className="h-full">
              <ProductCard p={p} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-neutral-500 py-16">
            No products found.
          </div>
        )}
      </div>

      {/* Botón “ver más” */}
      <div className="text-center mt-10">
        <button className="bg-black text-white px-5 py-2.5 rounded-lg text-sm hover:bg-neutral-900 transition">
          View More
        </button>
      </div>
    </section>
  );
}
