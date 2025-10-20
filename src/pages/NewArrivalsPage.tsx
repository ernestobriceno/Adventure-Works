import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products, type Product } from "@/data/products";

type Cat = "all" | "mountain" | "hybrid" | "bmx" | "electric";

const CATS: { key: Cat; label: string }[] = [
  { key: "all", label: "All" },
  { key: "mountain", label: "Mountain" },
  { key: "hybrid", label: "Hybrid" },
  { key: "bmx", label: "BMX" },
  { key: "electric", label: "Electric" },
];

export default function Products() {
  const [active, setActive] = useState<Cat>("all");

  const list: Product[] = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-black">Products</h2>
        <p className="mt-3 text-neutral-500">
          Explore our latest collection and find the perfect ride for you.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {CATS.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={[
              "px-5 py-2 rounded-full border transition text-base font-semibold",
              active === c.key
                ? "bg-black text-white border-black"
                : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50",
            ].join(" ")}
            aria-pressed={active === c.key}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {/* Empty state */}
      {list.length === 0 && (
        <div className="text-center text-neutral-500 py-16">
          No products for this category yet.
        </div>
      )}
    </section>
  );
}
